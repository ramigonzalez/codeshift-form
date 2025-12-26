import { ReactNode, useState } from 'react';
import { useWizard } from '../../hooks/useWizard';
import layoutStyles from '../../styles/layout.module.css';
import wizardStyles from '../../styles/wizard.module.css';

interface WizardContainerProps {
  children: (currentStep: number) => ReactNode;
  onSubmit: () => void;
  onValidateStep?: (step: number) => Promise<boolean>;
  onValidateAllSteps?: () => Promise<boolean>;
  isSubmitting?: boolean;
}

export const WizardContainer = ({ children, onSubmit, onValidateStep, onValidateAllSteps, isSubmitting = false }: WizardContainerProps) => {
  const { currentStep, isFirstStep, isLastStep, nextStep, previousStep, progress } = useWizard(4);
  const [isValidating, setIsValidating] = useState(false);

  const handleNext = async () => {
    if (onValidateStep) {
      setIsValidating(true);
      const isValid = await onValidateStep(currentStep);
      setIsValidating(false);

      if (isValid) {
        nextStep();
      }
    } else {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    // Validate all steps before submitting to ensure entire form is valid
    if (onValidateAllSteps) {
      setIsValidating(true);
      const isValid = await onValidateAllSteps();
      setIsValidating(false);

      if (isValid) {
        onSubmit();  // Only submit if all steps validation passes
      }
    } else if (onValidateStep) {
      // Fallback: validate only current step if onValidateAllSteps not provided
      setIsValidating(true);
      const isValid = await onValidateStep(currentStep);
      setIsValidating(false);

      if (isValid) {
        onSubmit();
      }
    } else {
      onSubmit();  // Fallback if no validation function provided
    }
  };

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1:
        return 'Sobre Você';
      case 2:
        return 'Sua Experiência';
      case 3:
        return 'Como Você Trabalha';
      case 4:
        return 'Disponibilidade';
      default:
        return '';
    }
  };

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.header}>
        <h1>🚀 AI Engineer - RAG Systems</h1>
        <p>Formulário de Interesse</p>
        <div className={layoutStyles.badge}>
          ⏱️ Passo {currentStep} de 4: {getStepTitle(currentStep)}
        </div>
      </div>

      <div className={layoutStyles.formContainer}>
        <div className={wizardStyles.progressBar}>
          <div className={wizardStyles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        <div className={layoutStyles.introBox}>
          <h3>💡 {getStepTitle(currentStep)}</h3>
          <p>
            {currentStep === 1 && 'Informações básicas para contato'}
            {currentStep === 2 && 'Queremos entender seu momento profissional'}
            {currentStep === 3 && 'Ajuda a entender como você trabalha e pensa'}
            {currentStep === 4 && 'Para alinhar expectativas'}
          </p>
        </div>

        {children(currentStep)}

        <div className={wizardStyles.navigation}>
          {!isFirstStep && (
            <button
              type="button"
              onClick={previousStep}
              className={`${wizardStyles.navButton} ${wizardStyles.navButtonSecondary}`}
              disabled={isSubmitting}
            >
              ← Voltar
            </button>
          )}

          {!isLastStep ? (
            <button
              type="button"
              onClick={handleNext}
              className={`${wizardStyles.navButton} ${wizardStyles.navButtonPrimary}`}
              style={isFirstStep ? { width: '100%' } : {}}
              disabled={isValidating || isSubmitting}
            >
              {isValidating ? (
                <>
                  <span className={wizardStyles.loadingSpinner} />
                  Validando...
                </>
              ) : (
                'Próximo →'
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className={`${wizardStyles.navButton} ${wizardStyles.navButtonPrimary}`}
              disabled={isSubmitting || isValidating}
              style={{ flex: 1 }}
            >
              {isSubmitting ? (
                <>
                  <span className={wizardStyles.loadingSpinner} />
                  Enviando...
                </>
              ) : isValidating ? (
                <>
                  <span className={wizardStyles.loadingSpinner} />
                  Validando...
                </>
              ) : (
                'Enviar meu interesse 🚀'
              )}
            </button>
          )}
        </div>

        {isLastStep && (
          <div className={layoutStyles.finalNote}>
            ✅ Entro em contato em até 5 dias úteis. Mesmo que não seja para essa vaga, posso
            ter outras oportunidades no futuro!
          </div>
        )}
      </div>
    </div>
  );
};
