import { forwardRef, InputHTMLAttributes } from 'react';
import styles from '../../styles/components.module.css';
import formStyles from '../../styles/form.module.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={formStyles.formGroup}>
        <label className={styles.checkboxItem}>
          <input
            ref={ref}
            type="checkbox"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.name}-error` : undefined}
            {...props}
          />
          <span>{label}</span>
        </label>
        {error && (
          <span id={`${props.name}-error`} className={formStyles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
