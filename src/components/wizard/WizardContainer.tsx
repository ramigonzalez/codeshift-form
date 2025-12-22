import { ReactNode, useState } from 'react';
import { useWizard } from '../../hooks/useWizard';
import layoutStyles from '../../styles/layout.module.css';
import wizardStyles from '../../styles/wizard.module.css';

interface WizardContainerProps {
  children: (currentStep: number) => ReactNode;
  onSubmit: () => void;
  onValidateStep?: (step: number) => Promise<boolean>;
  isSubmitting?: boolean;
}

export const WizardContainer = ({ children, onSubmit, onValidateStep, isSubmitting = false }: WizardContainerProps) => {
  const { currentStep, isFirstStep, isLastStep, nextStep, previousStep, progress } = useWizard(4);
  const [isValidating, setIsValidating] = useState(false);

  const handleNext = async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ce68e963-6408-408e-ae46-387ce13d212d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WizardContainer.tsx:17',message:'handleNext called',data:{currentStep:currentStep,hasOnValidateStep:!!onValidateStep},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    if (onValidateStep) {
      setIsValidating(true);
      const isValid = await onValidateStep(currentStep);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ce68e963-6408-408e-ae46-387ce13d212d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WizardContainer.tsx:21',message:'Validation result in handleNext',data:{isValid:isValid,currentStep:currentStep},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      setIsValidating(false);

      if (isValid) {
        nextStep();
      }
    } else {
      nextStep();
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
              onClick={onSubmit}
              className={`${wizardStyles.navButton} ${wizardStyles.navButtonPrimary}`}
              disabled={isSubmitting}
              style={{ flex: 1 }}
            >
              {isSubmitting ? (
                <>
                  <span className={wizardStyles.loadingSpinner} />
                  Enviando...
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
