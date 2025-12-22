import layoutStyles from '../../styles/layout.module.css';
import wizardStyles from '../../styles/wizard.module.css';

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
  onGoBack: () => void;
}

export const ErrorScreen = ({ error, onRetry, onGoBack }: ErrorScreenProps) => {
  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.header} style={{ background: 'linear-gradient(135deg, #742a2a 0%, #c53030 100%)' }}>
        <h1>❌ Erro no Envio</h1>
        <p>Não foi possível enviar o formulário</p>
      </div>

      <div className={layoutStyles.formContainer}>
        <div className={layoutStyles.errorBox} style={{ marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😞</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#742a2a' }}>
              Oops! Algo deu errado
            </h2>
            <p style={{ fontSize: '1rem', color: '#4a5568', lineHeight: '1.6' }}>
              {error}
            </p>
          </div>

          <div className={layoutStyles.infoBox} style={{ marginBottom: '2rem' }}>
            <p style={{ margin: 0 }}>
              <strong>💡 O que você pode fazer:</strong>
            </p>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>Clique em "Tentar Novamente" para reenviar</li>
              <li>Verifique sua conexão com a internet</li>
              <li>Se o problema persistir, entre em contato conosco diretamente</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onGoBack}
              className={`${wizardStyles.navButton} ${wizardStyles.navButtonSecondary}`}
              style={{ flex: '1', minWidth: '200px' }}
            >
              ← Voltar ao Formulário
            </button>
            <button
              type="button"
              onClick={onRetry}
              className={`${wizardStyles.navButton} ${wizardStyles.navButtonPrimary}`}
              style={{ flex: '1', minWidth: '200px' }}
            >
              Tentar Novamente
            </button>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#718096' }}>
            <p>
              Se o problema persistir, você pode me contatar diretamente pelo LinkedIn ou email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
