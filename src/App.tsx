import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ErrorScreen } from './components/screens/ErrorScreen';
import { SuccessScreen } from './components/screens/SuccessScreen';
import { Step1 } from './components/steps/Step1';
import { Step2 } from './components/steps/Step2';
import { Step3 } from './components/steps/Step3';
import { Step4 } from './components/steps/Step4';
import { WizardContainer } from './components/wizard/WizardContainer';
import { useFormPersistence } from './hooks/useFormPersistence';
import { submitToWebhook } from './services/webhookService';
import { FormData } from './types/application';
import { getStepFields, validateStep } from './utils/stepValidation';

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

function App() {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [submissionError, setSubmissionError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors: formErrors },
  } = useForm<FormData>({
    mode: 'onBlur',
    shouldFocusError: false,
    defaultValues: {
      techs: [],
    },
  });

  // Merge formErrors with validationErrors - validationErrors take precedence
  const errors = { ...formErrors, ...Object.fromEntries(
    Object.entries(validationErrors).map(([key, message]) => [
      key,
      { message, type: 'manual' }
    ])
  ) } as typeof formErrors;

  // Form persistence with localStorage
  const { clearSavedData } = useFormPersistence({ watch, setValue });

  const handleValidateStep = async (step: number): Promise<boolean> => {
    // Clear only errors for the current step's fields
    const stepFields = getStepFields(step);
    stepFields.forEach(field => {
      clearErrors(field as keyof FormData);
    });
    
    // Clear validation errors for this step
    setValidationErrors(prev => {
      const updated = { ...prev };
      stepFields.forEach(field => {
        delete updated[field];
      });
      return updated;
    });

    // Get current form values
    const formData = getValues();

    // Validate the step
    const { isValid, errors: validationErrors } = await validateStep(step, formData);
    
    if (!isValid && validationErrors && Object.keys(validationErrors).length > 0) {

      const errorMessages = Object.values(validationErrors);
      const errorCount = errorMessages.length;
      
      // Show toast notification with error summary
      if (errorCount === 1) {
        toast.error(errorMessages[0] || 'Por favor, corrija o erro no formulário');
      } else {
        toast.error(`${errorCount} campos precisam ser corrigidos. Por favor, revise o formulário.`);
      }

      // Set all errors at once
      // Set errors in both react-hook-form and local state
      setValidationErrors(validationErrors);
      
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field as keyof FormData, {
          type: 'manual',
          message: message as string,
        }, { shouldFocus: false });
      });

      // Scroll to first error and focus it
      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField) {
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
    }

    return isValid;
  };

  const handleValidateAllSteps = async (): Promise<boolean> => {
    // Clear all validation errors before validating all steps
    clearErrors();
    setValidationErrors({});

    // Get current form values
    const formData = getValues();

    // Validate all steps sequentially
    const allErrors: Record<string, string> = {};
    let allStepsValid = true;

    for (let step = 1; step <= 4; step++) {
      const { isValid, errors: stepErrors } = await validateStep(step, formData);
      
      if (!isValid && stepErrors) {
        allStepsValid = false;
        Object.assign(allErrors, stepErrors);
      }
    }

    if (!allStepsValid && Object.keys(allErrors).length > 0) {
      const errorMessages = Object.values(allErrors);
      const errorCount = errorMessages.length;

      // Show toast notification with error summary
      if (errorCount === 1) {
        toast.error(errorMessages[0] || 'Por favor, corrija o erro no formulário');
      } else {
        toast.error(`${errorCount} campos precisam ser corrigidos. Por favor, revise o formulário.`);
      }

      // Set all errors at once
      setValidationErrors(allErrors);
      
      Object.entries(allErrors).forEach(([field, message]) => {
        setError(field as keyof FormData, {
          type: 'manual',
          message: message as string,
        }, { shouldFocus: false });
      });

      // Scroll to first error and focus it
      const firstErrorField = Object.keys(allErrors)[0];
      if (firstErrorField) {
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
    }

    return allStepsValid;
  };

  const onSubmit = handleSubmit(async (data) => {
    setSubmissionStatus('submitting');
    setSubmissionError('');

    try {
      // Submit to webhook
      const result = await submitToWebhook(data);

      if (result.success) {
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
        onValidateAllSteps={handleValidateAllSteps}
        isSubmitting={submissionStatus === 'submitting'}
      >
        {renderStep}
      </WizardContainer>
    </form>
  );
}

export default App;
