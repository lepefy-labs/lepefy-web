'use client';

import { useState } from 'react';
import Link from 'next/link';
import LogoSvg from '../_components/LogoSvg';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

const CHECK_ICON = (
  <svg fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6l3 3 5-5" />
  </svg>
);

export default function AbbonatiPage() {
  const [email, setEmail] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [emailError, setEmailError] = useState(false);
  const [catError, setCatError] = useState(false);
  const [notice, setNotice] = useState<'duplicate' | 'error' | null>(null);

  async function handleSubmit() {
    setEmailError(false);
    setCatError(false);
    setNotice(null);

    let hasError = false;
    if (!email || !email.includes('@')) {
      setEmailError(true);
      hasError = true;
    }
    if (!categoria) {
      setCatError(true);
      hasError = true;
    }
    if (hasError) return;

    setStatus('loading');

    try {
      const checkRes = await fetch(
        `${SUPABASE_URL}/rest/v1/waitlist?email=eq.${encodeURIComponent(email)}&select=id`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      const existing = await checkRes.json();
      if (existing.length > 0) {
        setStatus('idle');
        setNotice('duplicate');
        return;
      }

      const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          email,
          categoria,
          marca_modello: marca.trim() || null,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
    } catch {
      setStatus('idle');
      setNotice('error');
    }
  }

  return (
    <>
      {/* NAV */}
      <nav>
        <Link href="/" className="logo-link">
          <div className="logo-svg">
            <LogoSvg />
          </div>
        </Link>
        <Link href="/deals" className="nav-link">← Vedi i deal</Link>
      </nav>

      <main style={{ flex: 1 }}>
        <div className="sub-section">
          {/* LEFT: PITCH */}
          <div className="sub-left">
            <div className="hero-tag">Accesso beta</div>
            <h1 className="sub-title">
              Ricevi i deal
              <br />
              <span className="highlight">in tempo reale</span>
            </h1>

            <ul className="benefits-list">
              <li>
                <div className="benefit-check">{CHECK_ICON}</div>
                Notifiche email istantanee appena l&apos;AI trova un&apos;occasione
              </li>
              <li>
                <div className="benefit-check">{CHECK_ICON}</div>
                Filtro per keyword personale — ricevi solo quello che cerchi
              </li>
              <li>
                <div className="benefit-check">{CHECK_ICON}</div>
                Margine stimato dall&apos;AI su ogni annuncio, prima che apri il link
              </li>
            </ul>

            <div className="pricing-box">
              <div className="pricing-main">
                €9,99<span>/mese</span>
              </div>
              <div className="pricing-then">durante il beta — poi €14,99</div>
              <div className="pricing-badge">Prezzo beta bloccato</div>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="sub-right">
            <div className="form-card">
              <div className="form-card-title">Entra nella lista d&apos;attesa</div>
              <div className="form-card-sub">
                Compila il form per riservare il tuo accesso beta. Ti contatteremo via email.
              </div>

              {status === 'success' ? (
                <div className="success-block">
                  <div className="success-icon">✓</div>
                  <div className="success-title">Sei in lista!</div>
                  <div className="success-text">
                    Ti contatteremo a breve per attivare il tuo accesso.
                    <br />
                    Nel frattempo puoi vedere i deal pubblici (con 12h di ritardo).
                  </div>
                  <Link href="/deals" className="success-link">→ Vedi i deal pubblici</Link>
                </div>
              ) : (
                <div className="sub-form-fields">
                  {/* Email */}
                  <div className="sub-field-wrap">
                    <label className="sub-field-label" htmlFor="emailInput">Email *</label>
                    <input
                      id="emailInput"
                      type="email"
                      className={`sub-field-input${emailError ? ' field-error' : ''}`}
                      placeholder="la.tua@email.it"
                      autoComplete="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setEmailError(false); }}
                      onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    />
                  </div>

                  {/* Categoria */}
                  <div className="sub-field-wrap">
                    <label className="sub-field-label" htmlFor="catInput">Categoria *</label>
                    <select
                      id="catInput"
                      className={`sub-field-select${catError ? ' field-error' : ''}${categoria ? ' has-value' : ''}`}
                      value={categoria}
                      onChange={e => { setCategoria(e.target.value); setCatError(false); }}
                    >
                      <option value="">Seleziona una categoria…</option>
                      <option value="Fotografia">Fotografia</option>
                      <option value="Elettronica">Elettronica</option>
                      <option value="Videogiochi">Videogiochi</option>
                      <option value="Audio/HiFi">Audio/HiFi</option>
                      <option value="Strumenti musicali">Strumenti musicali</option>
                    </select>
                  </div>

                  {/* Marca/Modello */}
                  <div className="sub-field-wrap">
                    <label className="sub-field-label" htmlFor="marcaInput">
                      Marca e modello <span>(opzionale)</span>
                    </label>
                    <input
                      id="marcaInput"
                      type="text"
                      className="sub-field-input"
                      placeholder="es. Sony A7, iPhone 14, Gibson Les Paul…"
                      value={marca}
                      onChange={e => setMarca(e.target.value)}
                    />
                  </div>

                  <button
                    className="btn-submit"
                    onClick={handleSubmit}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Invio in corso…' : 'Iscriviti alla beta →'}
                  </button>

                  <div className="sub-form-note">
                    Niente spam. Solo il tuo link di accesso quando è pronto.
                  </div>

                  {notice === 'duplicate' && (
                    <div className="sub-notice notice-info">
                      👋 Sei già in lista — ti avvisiamo presto!
                    </div>
                  )}
                  {notice === 'error' && (
                    <div className="sub-notice notice-error">
                      ⚠️ Qualcosa è andato storto. Riprova tra qualche minuto.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <LogoSvg height={28} />
        </div>
        <div className="footer-note">© 2025 Lepefy · Made in Italy</div>
      </footer>
    </>
  );
}
