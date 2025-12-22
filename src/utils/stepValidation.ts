import { FormData } from '../types/application';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  createStep3SchemaWithConditionalTech,
} from './validationSchemas';

/**
 * Gets the validation schema for a specific step
 */
export const getStepSchema = (step: number, formData?: Partial<FormData>) => {
  switch (step) {
    case 1:
      return step1Schema;
    case 2:
      return step2Schema;
    case 3:
      // Check if technical questions should be shown
      if (formData?.conhece_rag) {
        const showTechnical = ['basico', 'intermediario', 'avancado'].includes(
          formData.conhece_rag
        );
        return createStep3SchemaWithConditionalTech(showTechnical);
      }
      return step3Schema;
    case 4:
      return step4Schema;
    default:
      throw new Error(`Invalid step: ${step}`);
  }
};

/**
 * Gets the field names that belong to a specific step
 */
export const getStepFields = (step: number): (keyof FormData)[] => {
  switch (step) {
    case 1:
      return ['nome', 'email', 'whatsapp', 'linkedin', 'localizacao'];
    case 2:
      return ['exp_python', 'exp_llm', 'conhece_rag', 'techs', 'github', 'projeto', 'cv'];
    case 3:
      return [
        'mbti',
        'disc',
        'eneagrama',
        'motivacao',
        'aprendizado',
        'problema_resolvido',
        'pergunta_chunking',
        'pergunta_debug',
        'pergunta_eval',
        'pergunta_falha',
      ];
    case 4:
      return ['horas_semana', 'disponibilidade', 'taxa', 'comentarios'];
    default:
      return [];
  }
};

/**
 * Validates the data for a specific step
 */
export const validateStep = async (
  step: number,
  formData: Partial<FormData>
): Promise<{ isValid: boolean; errors?: Record<string, string> }> => {
  try {
    console.log(`[STEP_VALIDATION] Validating step ${step}`);

    const schema = getStepSchema(step, formData);
    const stepFields = getStepFields(step);

    // Extract only the fields for this step
    // IMPORTANT: Always include all fields, even if undefined, so Zod can validate required fields
    const stepData = stepFields.reduce((acc, field) => {
      acc[field] = formData[field] as any;
      return acc;
    }, {} as any);

    console.log('[STEP_VALIDATION] Step data to validate:', {
      step,
      fields: stepFields,
      data: {
        ...stepData,
        cv: stepData.cv instanceof FileList
          ? `FileList(${stepData.cv.length})`
          : stepData.cv instanceof File
          ? `File: ${stepData.cv.name}`
          : stepData.cv,
      },
    });

    // Validate the step data - use safeParseAsync to handle errors better
    const result = await schema.safeParseAsync(stepData);
    if (result.success) {
      console.log(`[STEP_VALIDATION] Step ${step} validation passed`);
      return { isValid: true };
    } else {
      // Handle validation errors from Zod
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path && issue.path.length > 0 ? issue.path.join('.') : 'unknown';
        errors[field] = issue.message || 'Validation error';
        console.log(`[STEP_VALIDATION] Error on field "${field}": ${issue.message}`);
      });
      console.log('[STEP_VALIDATION] Returning errors:', errors);
      return { isValid: false, errors };
    }
  } catch (error: any) {
    // This catch is for unexpected errors (not Zod validation errors)
    console.error('[STEP_VALIDATION] Unexpected error during validation:', error);
    return { isValid: false, errors: { _error: 'Erro inesperado durante validação' } };
  }
};
