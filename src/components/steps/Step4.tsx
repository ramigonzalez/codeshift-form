import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Select, Input, Textarea } from '../common';
import { FormData } from '../../types/application';
import layoutStyles from '../../styles/layout.module.css';

interface Step4Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export const Step4 = ({ register, errors }: Step4Props) => {
  const hoursOptions = [
    { value: '', label: 'Selecione...' },
    { value: '10-15', label: '10-15 horas' },
    { value: '15-25', label: '15-25 horas' },
    { value: '25-35', label: '25-35 horas' },
    { value: '35+', label: '35+ horas (dedicação principal)' },
  ];

  const availabilityOptions = [
    { value: '', label: 'Selecione...' },
    { value: 'imediata', label: 'Imediata' },
    { value: '1-2-semanas', label: '1-2 semanas' },
    { value: '2-4-semanas', label: '2-4 semanas' },
    { value: 'mais-1-mes', label: 'Mais de 1 mês' },
  ];

  return (
    <div className={layoutStyles.section}>
      <Select
        label="Quantas horas por semana você poderia dedicar?"
        required
        options={hoursOptions}
        {...register('horas_semana')}
        error={errors.horas_semana?.message}
      />

      <Select
        label="Disponibilidade para início"
        required
        options={availabilityOptions}
        {...register('disponibilidade')}
        error={errors.disponibilidade?.message}
      />

      <Input
        label="Pretensão de taxa horária (USD)"
        {...register('taxa')}
        error={errors.taxa?.message}
        placeholder="Ex: $30-40/hora"
        hint="Podemos discutir isso depois, mas ajuda a alinhar expectativas (opcional)"
      />

      <Textarea
        label="Alguma pergunta ou comentário?"
        {...register('comentarios')}
        error={errors.comentarios?.message}
        placeholder="Dúvidas sobre o projeto, informações adicionais que queira compartilhar..."
      />

      <div className={layoutStyles.encouragementBox}>
        <p>
          💪 <strong>Lembre-se:</strong> não precisa ter experiência completa em tudo. Se você
          manja de Python e tem vontade de crescer na área, se candidate!
        </p>
      </div>
    </div>
  );
};
