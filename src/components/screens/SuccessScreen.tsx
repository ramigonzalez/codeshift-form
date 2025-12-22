import layoutStyles from '../../styles/layout.module.css';
import wizardStyles from '../../styles/wizard.module.css';

export const SuccessScreen = () => {
  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.header}>
        <h1>✅ Formulário Enviado!</h1>
        <p>Recebemos seu interesse com sucesso</p>
      </div>

      <div className={layoutStyles.formContainer}>
        <div className={layoutStyles.successBox}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a365d' }}>
              Obrigado pelo interesse!
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#4a5568', lineHeight: '1.6' }}>
              Recebemos sua candidatura e vamos analisá-la com atenção.
            </p>
          </div>

          <div className={layoutStyles.infoBox} style={{ marginBottom: '2rem' }}>
            <p style={{ margin: 0 }}>
              <strong>📧 Próximos passos:</strong>
            </p>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>Vou analisar seu perfil e experiência</li>
              <li>Se houver match, entrarei em contato em até 5 dias úteis</li>
              <li>Mesmo que não seja para essa vaga, posso ter outras oportunidades no futuro</li>
            </ul>
          </div>

          <div className={layoutStyles.encouragementBox}>
            <p style={{ margin: 0 }}>
              💼 <strong>Fique atento ao email e LinkedIn</strong> — é por lá que vou te contatar!
            </p>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={`${wizardStyles.navButton} ${wizardStyles.navButtonSecondary}`}
              style={{ margin: '0 auto' }}
            >
              Enviar outra candidatura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
