import '../../app/notte-ai.css'

export default function ConfirmPage() {
  return (
    <div className="notte-ai">
      <div className="na-login-wrap">
        <div className="na-login-card na-fade-up" style={{ textAlign: 'center' }}>
          <div className="na-logo-icon" style={{ fontSize: 32 }}>📬</div>
          <h1 className="na-title" style={{ fontSize: '1.6rem', marginBottom: 12 }}>
            Controlla la tua email
          </h1>
          <p style={{ color: 'var(--na-text2)', fontSize: 14, lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Ti abbiamo inviato un link di conferma. Clicca sul link per attivare il tuo account e accedere a Lepefy.
          </p>
          <a
            href="/login"
            className="na-btn na-btn-ghost"
            style={{ display: 'inline-block', textDecoration: 'none' }}
          >
            Torna al login
          </a>
        </div>
      </div>
    </div>
  )
}
