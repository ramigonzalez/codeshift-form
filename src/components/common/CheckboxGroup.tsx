import { forwardRef, InputHTMLAttributes } from 'react';
import styles from '../../styles/components.module.css';
import formStyles from '../../styles/form.module.css';

interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

interface CheckboxGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  options: CheckboxOption[];
  error?: string;
  hint?: string;
  required?: boolean;
}

export const CheckboxGroup = forwardRef<HTMLInputElement, CheckboxGroupProps>(
  ({ label, options, error, hint, required, name, ...props }, ref) => {
    return (
      <div className={formStyles.formGroup}>
        <label className={`${formStyles.label} ${required ? formStyles.required : ''}`}>
          {label}
        </label>
        {hint && <span className={formStyles.hint}>{hint}</span>}
        <div className={styles.checkboxGroup}>
          {options.map((option, index) => (
            <label key={option.value} className={styles.checkboxItem}>
              <input
                ref={index === 0 ? ref : undefined}
                type="checkbox"
                name={name}
                value={option.value}
                aria-invalid={error ? 'true' : 'false'}
                {...props}
              />
              <div className="checkbox-label">
                <span>{option.label}</span>
                {option.description && (
                  <span style={{ display: 'block', fontSize: '12px', color: '#6b7280' }}>
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          ))}
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

CheckboxGroup.displayName = 'CheckboxGroup';
