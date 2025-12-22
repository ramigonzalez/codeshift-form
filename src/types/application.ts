// TypeScript interfaces for the AI Engineer application form

// Step 1: Personal Data
export interface PersonalData {
  nome: string;
  email: string;
  whatsapp?: string;  // Optional (V2 only)
  linkedin: string;
  localizacao: string;
}

// Step 2: Experience Data
export type PythonExperience = 'menos-1' | '1-2' | '2-3' | '3-5' | 'mais-5';
export type LLMExperience = 'nenhuma' | 'tutoriais' | 'projetos-pessoais' | 'profissional' | 'producao';
export type RAGKnowledge = 'nao' | 'conceito' | 'basico' | 'intermediario' | 'avancado';

export interface ExperienceData {
  exp_python: PythonExperience;
  exp_llm: LLMExperience;
  conhece_rag: RAGKnowledge;
  techs: string[];  // Array of selected technologies
}

// Step 2: Portfolio Data
export interface PortfolioData {
  github: string;
  projeto?: string;  // Optional project description
  cv: File;  // Required CV file (PDF)
}

// Step 3: Personality Profile
export interface PersonalityData {
  mbti?: string;  // Optional
  disc?: string;  // Optional
  eneagrama?: string;  // Optional
}

// Step 3: General Questions
export interface GeneralQuestions {
  motivacao: string;
  aprendizado: string;
  problema_resolvido?: string;  // Optional
}

// Step 3: Technical Questions (conditional - shown when conhece_rag >= 'basico')
export interface TechnicalQuestions {
  pergunta_chunking?: string;
  pergunta_debug?: string;
  pergunta_eval?: string;
  pergunta_falha?: string;
}

// Step 4: Availability & Expectations
export type HoursPerWeek = '10-15' | '15-25' | '25-35' | '35+';
export type StartAvailability = 'imediata' | '1-2-semanas' | '2-4-semanas' | 'mais-1-mes';

export interface AvailabilityData {
  horas_semana: HoursPerWeek;
  disponibilidade: StartAvailability;
  taxa: string;  // Required hourly rate in USD
  comentarios?: string;  // Optional comments
}

// Complete Application Form Data
export interface ApplicationFormData {
  personal: PersonalData;
  experience: ExperienceData;
  portfolio: PortfolioData;
  personality: PersonalityData;
  generalQuestions: GeneralQuestions;
  technicalQuestions?: TechnicalQuestions;  // Conditional based on conhece_rag
  availability: AvailabilityData;
}

// Flattened form data for React Hook Form (all fields at root level)
export interface FormData {
  // Personal
  nome: string;
  email: string;
  whatsapp?: string;
  linkedin: string;
  localizacao: string;

  // Experience
  exp_python: PythonExperience;
  exp_llm: LLMExperience;
  conhece_rag: RAGKnowledge;
  techs: string[];

  // Portfolio
  github: string;
  projeto?: string;
  cv: File;

  // Personality
  mbti?: string;
  disc?: string;
  eneagrama?: string;

  // General Questions
  motivacao: string;
  aprendizado: string;
  problema_resolvido?: string;

  // Technical Questions (conditional)
  pergunta_chunking?: string;
  pergunta_debug?: string;
  pergunta_eval?: string;
  pergunta_falha?: string;

  // Availability
  horas_semana: HoursPerWeek;
  disponibilidade: StartAvailability;
  taxa: string;
  comentarios?: string;
}

// Helper type to check if technical questions should be shown
export type RAGLevelWithTechnicalQuestions = 'basico' | 'intermediario' | 'avancado';

export const shouldShowTechnicalQuestions = (ragKnowledge: RAGKnowledge): boolean => {
  const technicalLevels: RAGLevelWithTechnicalQuestions[] = ['basico', 'intermediario', 'avancado'];
  return technicalLevels.includes(ragKnowledge as RAGLevelWithTechnicalQuestions);
};
