import { forwardRef, InputHTMLAttributes, useState, ChangeEvent, useEffect } from 'react';
import { CVMetadata } from '../../types/application';
import styles from '../../styles/components.module.css';
import formStyles from '../../styles/form.module.css';

interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  onFileChange?: (file: File | null) => void;
  savedMetadata?: CVMetadata | null;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ label, error, hint, required, onFileChange, onChange, savedMetadata, ...props }, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [hasRestoredMetadata, setHasRestoredMetadata] = useState(false);

    // Check for saved metadata on mount
    useEffect(() => {
      if (savedMetadata && !selectedFile) {
        setHasRestoredMetadata(true);
      }
    }, [savedMetadata, selectedFile]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setSelectedFile(file);
      setHasRestoredMetadata(false);
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

        {/* Warning banner for previously uploaded file */}
        {hasRestoredMetadata && savedMetadata && (
          <div style={{
            padding: '8px 12px',
            marginBottom: '8px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#856404'
          }}>
            ⚠️ Arquivo anterior: <strong>{savedMetadata.filename}</strong>
            {' '}({(savedMetadata.size / 1024).toFixed(1)} KB)
            <br />
            <em>Por favor, faça upload novamente - arquivos não podem ser salvos automaticamente</em>
          </div>
        )}

        <div
          className={`${styles.fileUpload} ${selectedFile ? styles.fileUploadSelected : ''} ${
            error ? styles.error : ''
          }`}
        >
          <div className={styles.fileUploadIcon}>
            {selectedFile ? '✅' : hasRestoredMetadata ? '⚠️' : '📄'}
          </div>
          <p className={styles.fileUploadText}>
            {selectedFile
              ? selectedFile.name
              : hasRestoredMetadata && savedMetadata
              ? `Reenvie: ${savedMetadata.filename}`
              : 'Clique ou arraste seu CV aqui'}
          </p>
          {hint && !selectedFile && !hasRestoredMetadata && <p className={formStyles.hint}>{hint}</p>}
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
