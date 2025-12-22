import { forwardRef, InputHTMLAttributes, useState, ChangeEvent } from 'react';
import styles from '../../styles/components.module.css';
import formStyles from '../../styles/form.module.css';

interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  onFileChange?: (file: File | null) => void;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ label, error, hint, required, onFileChange, onChange, ...props }, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setSelectedFile(file);
      if (onFileChange) {
        onFileChange(file);
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className={formStyles.formGroup}>
        <label className={`${formStyles.label} ${required ? formStyles.required : ''}`}>
          {label}
        </label>
        <div
          className={`${styles.fileUpload} ${selectedFile ? styles.fileUploadSelected : ''} ${
            error ? styles.error : ''
          }`}
        >
          <div className={styles.fileUploadIcon}>
            {selectedFile ? '✅' : '📄'}
          </div>
          <p className={styles.fileUploadText}>
            {selectedFile ? selectedFile.name : 'Clique ou arraste seu CV aqui'}
          </p>
          {hint && !selectedFile && <p className={formStyles.hint}>{hint}</p>}
          <input
            ref={ref}
            type="file"
            onChange={handleChange}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.name}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <span id={`${props.name}-error`} className={formStyles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
