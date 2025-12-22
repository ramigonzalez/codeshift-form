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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ce68e963-6408-408e-ae46-387ce13d212d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Input.tsx:14',message:'Input render',data:{name:props.name,label:label,hasError:!!error,errorMessage:error,errorType:typeof error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

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
