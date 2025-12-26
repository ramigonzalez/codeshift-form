import { forwardRef, InputHTMLAttributes } from 'react';
import styles from '../../styles/components.module.css';
import formStyles from '../../styles/form.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className, ...props }, ref) => {
    return (
      <div className={formStyles.formGroup}>
        <label className={`${formStyles.label} ${required ? formStyles.required : ''}`}>
          {label}
        </label>
        <input
          ref={ref}
          className={`${styles.input} ${error ? styles.error : ''} ${className || ''}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.name}-error` : undefined}
          {...props}
        />
        {hint && <span className={formStyles.hint}>{hint}</span>}
        {error && (
          <span id={`${props.name}-error`} className={formStyles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
