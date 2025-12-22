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
    console.log(`[VALIDATION] Starting validation for Step ${step}`);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ce68e963-6408-408e-ae46-387ce13d212d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:55',message:'handleValidateStep called',data:{step:step},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion

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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ce68e963-6408-408e-ae46-387ce13d212d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:58',message:'Form data before validation',data:{formDataKeys:Object.keys(formData),nome:formData.nome,email:formData.email,linkedin:formData.linkedin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion

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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ce68e963-6408-408e-ae46-387ce13d212d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:71',message:'Validation result',data:{isValid:isValid,validationErrors:validationErrors,hasErrors:!!validationErrors,errorKeys:validationErrors?Object.keys(validationErrors):[]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion

    // Set errors if validation failed
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ce68e963-6408-408e-ae46-387ce13d212d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:83',message:'Checking validation condition',data:{isValid:isValid,hasValidationErrors:!!validationErrors,validationErrorKeys:validationErrors?Object.keys(validationErrors):[],conditionResult:!isValid && validationErrors && Object.keys(validationErrors).length > 0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
    // #endregion
    
    if (!isValid && validationErrors && Object.keys(validationErrors).length > 0) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ce68e963-6408-408e-ae46-387ce13d212d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:87',message:'INSIDE IF BLOCK - Validation failed',data:{step:step},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      console.error('[VALIDATION] Validation failed with errors:', validationErrors);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ce68e963-6408-408e-ae46-387ce13d212d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:90',message:'Validation failed - setting errors',data:{step:step,validationErrors:validationErrors,errorCount:Object.keys(validationErrors).length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion

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
        console.log(`[VALIDATION] Setting error for field "${field}": ${message}`);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/ce68e963-6408-408e-ae46-387ce13d212d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:124',message:'Setting error for field',data:{field:field,message:message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        setError(field as keyof FormData, {
          type: 'manual',
          message: message as string,
        }, { shouldFocus: false });
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
