import { z } from 'zod';

// Step 1: Personal Data Schema
export const step1Schema = z.object({
  nome: z.string()
    .min(3, 'Nome muito curto (mínimo 3 caracteres)')
    .max(100, 'Nome muito longo'),

  email: z.string()
    .email('Email inválido')
    .toLowerCase(),

  whatsapp: z.string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || /^\+[1-9]\d{1,14}$/.test(val),
      'Número de telefone inválido - use o formato internacional (ex: +55 11 99999-9999)'
    ),

  linkedin: z.string()
    .url('LinkedIn inválido - insira a URL completa (https://...)')
    .refine(
      (url) => url.includes('linkedin.com'),
      'URL deve ser do LinkedIn'
    ),

  localizacao: z.string()
    .min(3, 'Localização muito curta')
    .max(100, 'Localização muito longa')
    .refine(
      (val) => {
        // Format should be: "City, State, Country"
        const parts = val.split(', ');
        return parts.length === 3 && parts.every((part) => part.trim().length > 0);
      },
      'Selecione cidade, estado e país'
    ),
});

// Step 2: Experience + Portfolio Schema
export const step2Schema = z.object({
  // Experience
  exp_python: z
    .string()
    .refine((val) => val !== '', 'Por favor, selecione sua experiência com Python')
    .refine(
      (val) => ['menos-1', '1-2', '2-3', '3-5', 'mais-5'].includes(val),
      'Valor inválido para experiência com Python'
    ),

  exp_llm: z
    .string()
    .refine((val) => val !== '', 'Por favor, selecione seu nível com LLMs')
    .refine(
      (val) => ['nenhuma', 'tutoriais', 'projetos-pessoais', 'profissional', 'producao'].includes(val),
      'Valor inválido para nível de LLM'
    ),

  conhece_rag: z
    .string()
    .refine((val) => val !== '', 'Por favor, selecione seu conhecimento em RAG')
    .refine(
      (val) => ['nao', 'conceito', 'basico', 'intermediario', 'avancado'].includes(val),
      'Valor inválido para conhecimento em RAG'
    ),

  techs: z.array(z.string())
    .max(15, 'Máximo de 15 tecnologias permitidas')
    .default([]),

  // Portfolio
  github: z
    .string()
    .min(1, 'GitHub é obrigatório')
    .url('GitHub inválido - insira a URL completa (https://...)')
    .refine(
      (url) => url.toLowerCase().includes('github.com'),
      'URL deve ser do GitHub (ex: https://github.com/seuperfil)'
    ),

  projeto: z.union([
    z.literal(''),
    z.string().url('URL do projeto inválida - insira uma URL completa (https://...)')
  ]).optional(),

  cv: z
    .custom<FileList | File | null | undefined>()
    .transform((val) => {
      // Handle react-hook-form file input (returns FileList)
      if (val instanceof FileList) {
        return val.length > 0 ? val[0] : null;
      }
      // Handle direct File object
      if (val instanceof File) {
        return val;
      }
      // Handle null/undefined (no file uploaded)
      return null;
    })
    .refine(
      (file) => file !== null && file !== undefined,
      'CV/Currículo é obrigatório - faça upload do seu PDF'
    )
    .refine(
      (file) => file === null || file.size <= 5 * 1024 * 1024,
      'Arquivo muito grande (máx 5MB)'
    )
    .refine(
      (file) => file === null || file.type === 'application/pdf',
      'Apenas arquivos PDF são aceitos'
    ),
});

// Step 3: Personality + Questions Schema
// Note: Technical questions validation is handled conditionally in the component
export const step3Schema = z.object({
  // Personality (all optional)
  mbti: z.string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || /^[IE][NS][TF][JP]$/.test(val),
      'MBTI inválido - formato esperado: 4 letras (ex: INTJ, ENFP)'
    ),

  disc: z.string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || (/^[DISC]+$/.test(val) && val.length >= 1 && val.length <= 4),
      'DISC inválido - use 1-4 letras: D, I, S, C (ex: D, DI, ISC)'
    ),

  eneagrama: z.string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || /^[1-9]w?[0-9]?$/.test(val),
      'Eneagrama inválido - formato esperado: número 1-9 ou com asa (ex: 5, 5w4)'
    )
    .refine(
      (val) => {
        if (!val) return true;
        const match = val.match(/^([1-9])(w([0-9]))?$/);
        if (!match) return false;
        const main = parseInt(match[1]);
        const wing = match[3] ? parseInt(match[3]) : null;
        if (wing !== null) {
          // Wing must be adjacent to main type (±1)
          return Math.abs(main - wing) === 1 && wing >= 1 && wing <= 9;
        }
        return true;
      },
      'Asa do eneagrama inválida - deve ser adjacente ao tipo principal (ex: 5w4, 5w6)'
    ),

  // General Questions
  motivacao: z.string()
    .min(20, 'Muito curto - conte um pouco mais (mínimo 20 caracteres)')
    .max(1000, 'Muito longo (máximo 1000 caracteres)'),

  aprendizado: z.string()
    .min(20, 'Muito curto - descreva sua abordagem (mínimo 20 caracteres)')
    .max(1000, 'Muito longo (máximo 1000 caracteres)'),

  problema_resolvido: z.string()
    .optional()
    .or(z.literal('')),

  // Technical Questions (optional in schema, conditionally required in component)
  pergunta_chunking: z.string()
    .optional()
    .or(z.literal('')),

  pergunta_debug: z.string()
    .optional()
    .or(z.literal('')),

  pergunta_eval: z.string()
    .optional()
    .or(z.literal('')),

  pergunta_falha: z.string()
    .optional()
    .or(z.literal('')),
});

// Helper function to create conditional technical questions validation
export const createStep3SchemaWithConditionalTech = (showTechnical: boolean) => {
  if (!showTechnical) {
    return step3Schema;
  }

  // When technical questions are shown, they become required
  return step3Schema.extend({
    pergunta_chunking: z.string()
      .min(20, 'Muito curto - explique sua abordagem (mínimo 20 caracteres)')
      .max(1500, 'Muito longo (máximo 1500 caracteres)'),

    pergunta_debug: z.string()
      .min(20, 'Muito curto - descreva seu processo (mínimo 20 caracteres)')
      .max(1500, 'Muito longo (máximo 1500 caracteres)'),

    pergunta_eval: z.string()
      .min(20, 'Muito curto - explique as métricas (mínimo 20 caracteres)')
      .max(1500, 'Muito longo (máximo 1500 caracteres)'),

    pergunta_falha: z.string()
      .min(20, 'Muito curto - compartilhe seu aprendizado (mínimo 20 caracteres)')
      .max(1500, 'Muito longo (máximo 1500 caracteres)'),
  });
};

// Step 4: Availability & Expectations Schema
export const step4Schema = z.object({
  horas_semana: z
    .string()
    .refine((val) => val !== '', 'Por favor, selecione quantas horas por semana')
    .refine(
      (val) => ['10-15', '15-25', '25-35', '35+'].includes(val),
      'Valor inválido para horas por semana'
    ),

  disponibilidade: z
    .string()
    .refine((val) => val !== '', 'Por favor, selecione sua disponibilidade')
    .refine(
      (val) => ['imediata', '1-2-semanas', '2-4-semanas', 'mais-1-mes'].includes(val),
      'Valor inválido para disponibilidade'
    ),

  taxa: z.string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || /^R\$\s\d{1,3}(\.\d{3})*(,\d{2})?$/.test(val),
      'Taxa inválida - use formato brasileiro: R$ 100,00 ou R$ 1.500,50'
    )
    .refine(
      (val) => {
        if (!val) return true;
        // Parse Brazilian format: R$ 1.500,50 -> 1500.50
        const numValue = parseFloat(
          val.replace('R$ ', '').replace(/\./g, '').replace(',', '.')
        );
        return !isNaN(numValue) && numValue >= 0 && numValue <= 999999;
      },
      'Taxa deve estar entre R$ 0,00 e R$ 999.999,00'
    ),

  comentarios: z.string()
    .max(1000, 'Comentários muito longos (máximo 1000 caracteres)')
    .optional()
    .or(z.literal('')),
});

// Complete form schema (for final submission)
export const completeFormSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
});

// Type exports for use in components
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type CompleteFormData = z.infer<typeof completeFormSchema>;
