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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ce68e963-6408-408e-ae46-387ce13d212d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Step1.tsx:15',message:'Step1 render - errors object',data:{errors:errors,hasNomeError:!!errors.nome?.message,nomeError:errors.nome?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

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
