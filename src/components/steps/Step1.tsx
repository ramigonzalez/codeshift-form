import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import layoutStyles from '../../styles/layout.module.css';
import { FormData } from '../../types/application';
import { Input } from '../common';
import { LocationSelector } from '../common/LocationSelector';
import { PhoneInput } from '../common/PhoneInput';

interface Step1Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  control: Control<FormData>;
}

export const Step1 = ({ register, errors, control }: Step1Props) => {
  return (
    <div className={layoutStyles.section}>
      <Input
        label="Nome completo"
        required
        {...register('nome')}
        error={errors.nome?.message}
        placeholder="Seu nome completo"
      />

      <Input
        label="Email"
        type="email"
        required
        {...register('email')}
        error={errors.email?.message}
        placeholder="seu@email.com"
      />

      <Controller
        name="whatsapp"
        control={control}
        render={({ field }) => (
          <PhoneInput
            label="WhatsApp"
            value={field.value}
            onChange={field.onChange}
            error={errors.whatsapp?.message}
            hint="Opcional - Formato internacional"
            name="whatsapp"
          />
        )}
      />

      <Input
        label="LinkedIn"
        type="url"
        required
        {...register('linkedin')}
        error={errors.linkedin?.message}
        placeholder="https://linkedin.com/in/seuperfil"
      />

      <Controller
        name="localizacao"
        control={control}
        render={({ field }) => (
          <LocationSelector
            label="Localização"
            value={field.value}
            onChange={field.onChange}
            error={errors.localizacao?.message}
            required
            name="localizacao"
          />
        )}
      />
    </div>
  );
};
