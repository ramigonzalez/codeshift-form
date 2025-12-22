import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Select, CheckboxGroup, Input, Textarea, FileUpload } from '../common';
import { FormData } from '../../types/application';
import layoutStyles from '../../styles/layout.module.css';

interface Step2Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export const Step2 = ({ register, errors }: Step2Props) => {
  const pythonOptions = [
    { value: '', label: 'Selecione...' },
    { value: 'menos-1', label: 'Menos de 1 ano' },
    { value: '1-2', label: '1-2 anos' },
    { value: '2-3', label: '2-3 anos' },
    { value: '3-5', label: '3-5 anos' },
    { value: 'mais-5', label: 'Mais de 5 anos' },
  ];

  const llmOptions = [
    { value: '', label: 'Selecione...' },
    { value: 'nenhuma', label: 'Nunca mexi, mas tenho interesse' },
    { value: 'tutoriais', label: 'Fiz alguns tutoriais/experimentos' },
    { value: 'projetos-pessoais', label: 'Construí projetos pessoais' },
    { value: 'profissional', label: 'Já usei em contexto profissional' },
    { value: 'producao', label: 'Já coloquei sistemas em produção' },
  ];

  const ragOptions = [
    { value: '', label: 'Selecione...' },
    { value: 'nao', label: 'Não sei o que é' },
    { value: 'conceito', label: 'Entendo o conceito mas nunca implementei' },
    { value: 'basico', label: 'Já implementei algo básico' },
    { value: 'intermediario', label: 'Tenho experiência implementando RAG' },
    { value: 'avancado', label: 'Já trabalhei com técnicas avançadas (HyDE, Reranking, etc)' },
  ];

  const techOptions = [
    { value: 'fastapi', label: 'FastAPI / Flask / Django' },
    { value: 'langchain', label: 'LangChain / LlamaIndex' },
    { value: 'openai', label: 'OpenAI API / Claude API' },
    { value: 'vectordb', label: 'Vector DBs (Qdrant, Pinecone, pgvector, Chroma)' },
    { value: 'docker', label: 'Docker' },
    { value: 'langgraph', label: 'LangGraph / Agentes' },
  ];

  return (
    <>
      <div className={layoutStyles.section}>
        <h3 className={layoutStyles.sectionTitle}>Experiência</h3>

        <Select
          label="Há quanto tempo trabalha com Python profissionalmente?"
          required
          options={pythonOptions}
          {...register('exp_python')}
          error={errors.exp_python?.message}
        />

        <Select
          label="Qual seu nível de experiência com LLMs/LangChain?"
          required
          options={llmOptions}
          {...register('exp_llm')}
          error={errors.exp_llm?.message}
        />

        <Select
          label="Você sabe o que é RAG (Retrieval-Augmented Generation)?"
          required
          options={ragOptions}
          {...register('conhece_rag')}
          error={errors.conhece_rag?.message}
        />

        <CheckboxGroup
          label="Tecnologias que você já usou"
          options={techOptions}
          hint="Marque todas que se aplicam (opcional)"
          {...register('techs')}
          error={errors.techs?.message}
        />
      </div>

      <div className={layoutStyles.section}>
        <h3 className={layoutStyles.sectionTitle}>Portfolio & Links</h3>

        <Input
          label="GitHub"
          type="url"
          required
          {...register('github')}
          error={errors.github?.message}
          placeholder="https://github.com/seuperfil"
        />

        <Textarea
          label="Projeto relevante"
          {...register('projeto')}
          error={errors.projeto?.message}
          placeholder="Pode ser um repo do GitHub, um projeto live, ou uma descrição de algo que construiu. Não precisa ser relacionado a IA."
          hint="Queremos ver código seu, independente do domínio (opcional)"
        />

        <FileUpload
          label="CV/Currículo"
          accept=".pdf"
          {...register('cv')}
          error={errors.cv?.message}
          hint="Opcional, mas ajuda a conhecer sua trajetória (PDF, máx 5MB)"
        />
      </div>
    </>
  );
};
