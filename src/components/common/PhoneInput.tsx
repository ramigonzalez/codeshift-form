import { forwardRef } from 'react';
import PhoneInputWithCountry from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import styles from '../../styles/components.module.css';
import formStyles from '../../styles/form.module.css';

interface PhoneInputProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string | undefined) => void;
  name?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, hint, required, value, onChange, name }, ref) => {
    return (
      <div className={formStyles.formGroup}>
        <label className={`${formStyles.label} ${required ? formStyles.required : ''}`}>
          {label}
        </label>
        <PhoneInputWithCountry
          international
          defaultCountry="BR"
          value={value}
          onChange={onChange}
          className={`${styles.phoneInput} ${error ? styles.error : ''}`}
          numberInputProps={{
            name: name,
            'aria-invalid': error ? 'true' : 'false',
          }}
        />
        {hint && <span className={formStyles.hint}>{hint}</span>}
        {error && <span className={formStyles.error} role="alert">{error}</span>}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
