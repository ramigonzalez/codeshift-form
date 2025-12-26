import { ChangeEvent, forwardRef, InputHTMLAttributes, useEffect, useState } from 'react';
import styles from '../../styles/components.module.css';
import formStyles from '../../styles/form.module.css';
import { CVMetadata } from '../../types/application';

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

        {/* Info banner for previously uploaded file */}
        {hasRestoredMetadata && savedMetadata && (
          <div style={{
            background: '#dbeafe',
            borderLeft: '4px solid #2563eb',
            padding: '14px 16px',
            borderRadius: '0 8px 8px 0',
            marginBottom: '12px'
          }}>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: '#1e40af' }}>
              <strong>📄 Arquivo detectado:</strong> {savedMetadata.filename} ({(savedMetadata.size / 1024).toFixed(1)} KB)
              <br />
              <span style={{ fontSize: '12px', opacity: 0.9 }}>
                Detectamos que você já havia enviado este arquivo. Por favor, faça o upload novamente para continuar.
              </span>
            </p>
          </div>
        )}

        <div
          className={`${styles.fileUpload} ${selectedFile ? styles.fileUploadSelected : ''} ${
            error ? styles.error : ''
          }`}
        >
          <div className={styles.fileUploadIcon}>
            {selectedFile ? '✅' : hasRestoredMetadata ? '📄' : '📄'}
          </div>
          <p className={styles.fileUploadText}>
            {selectedFile
              ? `✅ ${selectedFile.name}`
              : hasRestoredMetadata && savedMetadata
              ? `Clique para reenviar: ${savedMetadata.filename}`
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
