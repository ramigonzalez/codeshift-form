import { forwardRef, InputHTMLAttributes } from 'react';
import styles from '../../styles/components.module.css';
import formStyles from '../../styles/form.module.css';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  options: RadioOption[];
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, options, error, hint, required, name, value: selectedValue, ...props }, ref) => {
    return (
      <div className={formStyles.formGroup}>
        <label className={`${formStyles.label} ${required ? formStyles.required : ''}`}>
          {label}
        </label>
        {hint && <span className={formStyles.hint}>{hint}</span>}
        <div className={styles.radioGroup}>
          {options.map((option, index) => {
            const isChecked = selectedValue === option.value;
            return (
              <label
                key={option.value}
                className={`${styles.radioItem} ${isChecked ? styles.checked : ''}`}
              >
                <input
                  ref={index === 0 ? ref : undefined}
                  type="radio"
                  name={name}
                  value={option.value}
                  aria-invalid={error ? 'true' : 'false'}
                  {...props}
                />
                <div className="radio-label-content">{option.label}</div>
              </label>
            );
          })}
        </div>
        {error && (
          <span id={`${name}-error`} className={formStyles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
