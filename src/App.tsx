import { useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { WizardContainer } from './components/wizard/WizardContainer';
import { Step1 } from './components/steps/Step1';
import { Step2 } from './components/steps/Step2';
import { Step3 } from './components/steps/Step3';
import { Step4 } from './components/steps/Step4';
import { SuccessScreen } from './components/screens/SuccessScreen';
import { ErrorScreen } from './components/screens/ErrorScreen';
import { FormData } from './types/application';
import { validateStep, getStepFields } from './utils/stepValidation';
import { submitToWebhook } from './services/webhookService';
import { useFormPersistence } from './hooks/useFormPersistence';

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

function App() {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [submissionError, setSubmissionError] = useState<string>('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      techs: [],
    },
  });

  // Form persistence with localStorage
  const { clearSavedData } = useFormPersistence({ watch, setValue });

  // Use useFormState to properly subscribe to form state changes
  const { errors } = useFormState({ control });

  const handleValidateStep = async (step: number): Promise<boolean> => {
    console.log(`[VALIDATION] Starting validation for Step ${step}`);

    // Clear only errors for the current step's fields
    const stepFields = getStepFields(step);
    stepFields.forEach(field => {
      clearErrors(field as keyof FormData);
    });

    // Get current form values
    const formData = getValues();

    // Log form data for debugging (special handling for FileList)
    console.log('[VALIDATION] Current form data:', {
      ...formData,
      cv: formData.cv instanceof FileList
        ? `FileList(${formData.cv.length} files)`
        : formData.cv instanceof File
        ? `File: ${formData.cv.name}`
        : formData.cv,
    });

    // Validate the step
    const { isValid, errors: validationErrors } = await validateStep(step, formData);

    // Set errors if validation failed
    if (!isValid && validationErrors) {
      console.error('[VALIDATION] Validation failed with errors:', validationErrors);

      Object.entries(validationErrors).forEach(([field, message]) => {
        console.log(`[VALIDATION] Setting error for field "${field}": ${message}`);
        setError(field as keyof FormData, {
          type: 'manual',
          message,
        });
      });

      // Scroll to first error and focus it
      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField) {
        console.log(`[VALIDATION] Scrolling to first error field: ${firstErrorField}`);
        setTimeout(() => {
          const element = document.getElementsByName(firstErrorField)[0];
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Focus element for accessibility
            if (element instanceof HTMLElement) {
              element.focus();
            }
          } else {
            console.warn(`[VALIDATION] Could not find element with name="${firstErrorField}"`);
          }
        }, 100);
      }
    } else {
      console.log(`[VALIDATION] Step ${step} validated successfully!`);
    }

    return isValid;
  };

  const onSubmit = handleSubmit(async (data) => {
    setSubmissionStatus('submitting');
    setSubmissionError('');

    try {
      console.log('Submitting form data:', data);

      // Submit to webhook
      const result = await submitToWebhook(data);

      if (result.success) {
        console.log('Form submitted successfully!');
        clearSavedData(); // Clear localStorage after successful submission
        setSubmissionStatus('success');
      } else {
        console.error('Submission failed:', result.error);
        setSubmissionError(result.error || 'Erro desconhecido ao enviar formulário.');
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Unexpected error during submission:', error);
      setSubmissionError('Erro inesperado ao enviar formulário. Por favor, tente novamente.');
      setSubmissionStatus('error');
    }
  });

  const handleGoBack = () => {
    setSubmissionStatus('idle');
    setSubmissionError('');
  };

  const renderStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return <Step1 register={register} errors={errors} control={control} />;
      case 2:
        return <Step2 register={register} errors={errors} />;
      case 3:
        return <Step3 register={register} errors={errors} watch={watch} />;
      case 4:
        return <Step4 register={register} errors={errors} />;
      default:
        return null;
    }
  };

  // Show success screen
  if (submissionStatus === 'success') {
    return <SuccessScreen />;
  }

  // Show error screen
  if (submissionStatus === 'error') {
    return <ErrorScreen error={submissionError} onRetry={onSubmit} onGoBack={handleGoBack} />;
  }

  // Show wizard form
  return (
    <form onSubmit={onSubmit}>
      <WizardContainer
        onSubmit={onSubmit}
        onValidateStep={handleValidateStep}
        isSubmitting={submissionStatus === 'submitting'}
      >
        {renderStep}
      </WizardContainer>
    </form>
  );
}

export default App;
