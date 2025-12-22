import axios, { AxiosError } from 'axios';
import { FormData } from '../types/application';

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || '';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

interface WebhookPayload {
  formData: FormData;
  submittedAt: string;
  userAgent: string;
}

interface SubmissionResult {
  success: boolean;
  error?: string;
  retries?: number;
}

/**
 * Delays execution for a specified duration
 */
const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Converts FormData to a webhook payload
 */
const preparePayload = async (formData: FormData): Promise<WebhookPayload> => {
  // If CV file exists, convert to base64
  const payload: any = { ...formData };

  if (formData.cv && formData.cv instanceof File) {
    try {
      const base64 = await fileToBase64(formData.cv);
      payload.cv = {
        filename: formData.cv.name,
        size: formData.cv.size,
        type: formData.cv.type,
        data: base64,
      };
    } catch (error) {
      console.error('Failed to convert CV to base64:', error);
      delete payload.cv;
    }
  }

  return {
    formData: payload,
    submittedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };
};

/**
 * Converts a File to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Submits form data to webhook with retry logic
 */
export const submitToWebhook = async (
  formData: FormData
): Promise<SubmissionResult> => {
  // Validate webhook URL
  if (!WEBHOOK_URL) {
    console.error('VITE_WEBHOOK_URL not configured');
    return {
      success: false,
      error: 'Webhook URL not configured. Please contact support.',
    };
  }

  // Prepare payload
  let payload: WebhookPayload;
  try {
    payload = await preparePayload(formData);
  } catch (error) {
    console.error('Failed to prepare payload:', error);
    return {
      success: false,
      error: 'Failed to prepare submission data.',
    };
  }

  // Attempt submission with retries
  let lastError: string = '';

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(WEBHOOK_URL, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      if (response.status >= 200 && response.status < 300) {
        console.log('Form submitted successfully:', response.data);
        return {
          success: true,
          retries: attempt,
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      // Log the attempt
      console.error(`Submission attempt ${attempt + 1} failed:`, axiosError.message);

      // Determine if we should retry
      const shouldRetry = attempt < MAX_RETRIES && isRetryableError(axiosError);

      if (!shouldRetry) {
        lastError = getErrorMessage(axiosError);
        break;
      }

      // Calculate exponential backoff delay
      const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
      console.log(`Retrying in ${retryDelay}ms...`);
      await delay(retryDelay);
    }
  }

  return {
    success: false,
    error: lastError || 'Failed to submit form after multiple attempts.',
    retries: MAX_RETRIES,
  };
};

/**
 * Determines if an error is retryable
 */
const isRetryableError = (error: AxiosError): boolean => {
  // Network errors are retryable
  if (!error.response) {
    return true;
  }

  // 5xx server errors are retryable
  const status = error.response.status;
  if (status >= 500 && status < 600) {
    return true;
  }

  // 429 Too Many Requests is retryable
  if (status === 429) {
    return true;
  }

  // 408 Request Timeout is retryable
  if (status === 408) {
    return true;
  }

  // All other errors are not retryable
  return false;
};

/**
 * Extracts a user-friendly error message from an AxiosError
 */
const getErrorMessage = (error: AxiosError): string => {
  if (!error.response) {
    return 'Network error. Please check your connection and try again.';
  }

  const status = error.response.status;

  switch (status) {
    case 400:
      return 'Invalid form data. Please check your inputs.';
    case 401:
    case 403:
      return 'Authorization failed. Please contact support.';
    case 404:
      return 'Submission endpoint not found. Please contact support.';
    case 413:
      return 'File too large. Please use a smaller CV file.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Server error. Please try again later.';
    default:
      return `Submission failed (Error ${status}). Please try again.`;
  }
};
