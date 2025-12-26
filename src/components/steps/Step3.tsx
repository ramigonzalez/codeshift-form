import { useMemo } from 'react';
import { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form';
import layoutStyles from '../../styles/layout.module.css';
import { FormData, shouldShowTechnicalQuestions } from '../../types/application';
import { Input, Textarea } from '../common';

interface Step3Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
}

export const Step3 = ({ register, errors, watch }: Step3Props) => {
  const conheceRAG = watch('conhece_rag');
  const showTechnical = useMemo(
    () => conheceRAG && shouldShowTechnicalQuestions(conheceRAG),
    [conheceRAG]
  );

  return (
    <>
      {/* Personality Profile Section */}
      <div className={layoutStyles.section}>
        <h3 className={layoutStyles.sectionTitle}>Seu Perfil</h3>
        <p className={layoutStyles.sectionDesc}>
          Ajuda a entender como você trabalha (opcional, mas valorizado)
        </p>

        <Input
          label="MBTI (16 Personalities)"
          {...register('mbti')}
          error={errors.mbti?.message}
          placeholder="Ex: INTJ, ENFP, ISTP..."
          hint="Teste em: 16personalities.com"
        />

        <Input
          label="DISC"
          {...register('disc')}
          error={errors.disc?.message}
          placeholder="Ex: DI, SC, CD"
          hint="Teste em: 123test.com/disc-personality-test"
        />

        <Input
          label="Eneagrama"
          {...register('eneagrama')}
          error={errors.eneagrama?.message}
          placeholder="Ex: 5, 3w4, 7w6, etc..."
          hint="Teste em: truity.com/test/enneagram-personality-test"
        />
      </div>

      {/* General Questions Section */}
      <div className={layoutStyles.section}>
        <h3 className={layoutStyles.sectionTitle}>Algumas Perguntas</h3>
        <p className={layoutStyles.sectionDesc}>
          Responda com honestidade — não existe resposta certa
        </p>

        <Textarea
          label="Por que essa oportunidade te interessou?"
          required
          {...register('motivacao')}
          error={errors.motivacao?.message}
          placeholder="Pode ser breve. O que te chamou atenção?"
        />

        <Textarea
          label="Como você lida quando precisa aprender uma tecnologia nova para entregar algo?"
          required
          {...register('aprendizado')}
          error={errors.aprendizado?.message}
          placeholder="Descreva sua abordagem. Documentação? Tutoriais? Tentativa e erro?"
          hint="Neste projeto você vai precisar aprender coisas novas na prática"
        />

        <Textarea
          label="Descreva brevemente um problema técnico difícil que você resolveu"
          {...register('problema_resolvido')}
          error={errors.problema_resolvido?.message}
          placeholder="Não precisa ser sobre IA. Queremos ver como você pensa."
          hint="Opcional, mas valorizado"
        />
      </div>

      {/* Conditional Technical Questions Section */}
      {showTechnical && (
        <div className={layoutStyles.section}>
          <h3 className={layoutStyles.sectionTitle}>Perguntas Técnicas</h3>
          <div className={layoutStyles.infoBox}>
            <p>
              📊 Pelo seu nível de experiência com RAG, gostaríamos de entender melhor seu
              pensamento técnico
            </p>
          </div>

          <Textarea
            label="Como você faria o chunking de uma transcrição de call de vendas de 45 minutos para otimizar o retrieval?"
            required={showTechnical}
            {...register('pergunta_chunking')}
            error={errors.pergunta_chunking?.message}
            placeholder="Descreva sua abordagem: considere speakers, timestamps, sobreposição, tamanho de chunks, etc."
          />

          <Textarea
            label="Seu sistema RAG está retornando documentos relevantes, mas as respostas do LLM estão erradas. Como você debugaria isso?"
            required={showTechnical}
            {...register('pergunta_debug')}
            error={errors.pergunta_debug?.message}
            placeholder="Descreva sua abordagem sistemática de investigação"
          />

          <Textarea
            label="Como você avalia qualidade em sistemas RAG? Quais métricas usa e por quê?"
            required={showTechnical}
            {...register('pergunta_eval')}
            error={errors.pergunta_eval?.message}
            placeholder="Mencione métricas específicas e como você as aplicaria neste projeto"
          />

          <Textarea
            label="Conte sobre um projeto que falhou ou underperformou. O que deu errado e o que aprendeu?"
            required={showTechnical}
            {...register('pergunta_falha')}
            error={errors.pergunta_falha?.message}
            placeholder="Seja honesto. Queremos ver reflexão e aprendizado, não perfeição."
          />
        </div>
      )}

      {showTechnical && (
        <div className={layoutStyles.encouragementBox}>
          <p>
            💪 <strong>Lembre-se:</strong> não precisa ter respostas perfeitas. Queremos entender
            como você pensa e resolve problemas!
          </p>
        </div>
      )}
    </>
  );
};
