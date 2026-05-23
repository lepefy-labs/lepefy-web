'use client';

import { useState } from 'react';
import Link from 'next/link';
import LogoSvg from '../_components/LogoSvg';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

export default function AbbonatiPage() {
  const [email, setEmail] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marcaModello, setMarcaModello] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [emailError, setEmailError] = useState(false);
  const [catError, setCatError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;

    if (!email || !email.includes('@')) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (!categoria) {
      setCatError(true);
      valid = false;
    } else {
      setCatError(false);
    }

    if (!valid) return;

    setStatus('loading');

    try {
      const check = await fetch(
        `${SUPABASE_URL}/rest/v1/waitlist?email=eq.${encodeURIComponent(email)}&select=id`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      const existing = await check.json();
      if (existing.length > 0) { setStatus('duplicate'); return; }

      const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          email,
          categoria,
          marca_modello: marcaModello.trim() || null,
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <nav>
        <Link href="/chi-siamo" className="logo-svg" aria-label="Lepefy home">
          <LogoSvg height={36} />
        </Link>
        <div className="nav-links">
          <Link href="/deals" className="nav-link">Deal del giorno</Link>
          <Link href="/chi-siamo" className="nav-link">Chi siamo</Link>
        </div>
      </nav>

      <main className="sub-page">
        <Link href="/deals" className="sub-back">← Vedi i deal</Link>

        {status === 'success' ? (
          <div className="success-block">
            <div className="success-icon">🎉</div>
            <h2>Sei in lista!</h2>
            <p>Ti contatteremo a breve per attivare il tuo accesso. Nel frattempo puoi esplorare i deal pubblici.</p>
            <Link href="/deals">Vedi i deal del giorno →</Link>
          </div>
        ) : (
          <>
            <h1 className="sub-title">Iscriviti alla beta</h1>
            <p className="sub-sub">
              Ricevi alert in tempo reale sulle migliori occasioni — prima che spariscano. Accesso anticipato gratuito.
            </p>

            {status === 'duplicate' && (
              <div className="sub-notice notice-info" style={{ marginBottom: '1rem' }}>
                👋 Sei già in lista — ti contatteremo presto!
              </div>
            )}
            {status === 'error' && (
              <div className="sub-notice notice-error" style={{ marginBottom: '1rem' }}>
                ⚠️ Qualcosa è andato storto. Riprova tra poco.
              </div>
            )}

            <form className="sub-form" onSubmit={handleSubmit} noValidate>
              <div className="sub-field">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  placeholder="la.tua@email.it"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
                  className={emailError ? 'error' : ''}
                />
              </div>

              <div className="sub-field">
                <label htmlFor="categoria">Categoria di interesse *</label>
                <select
                  id="categoria"
                  value={categoria}
                  onChange={(e) => { setCategoria(e.target.value); setCatError(false); }}
                  className={catError ? 'error' : ''}
                >
                  <option value="">Seleziona una categoria…</option>
                  <option value="Fotografia">Fotografia</option>
                  <option value="Elettronica">Elettronica</option>
                  <option value="Videogiochi">Videogiochi</option>
                  <option value="Audio/HiFi">Audio / Hi-Fi</option>
                  <option value="Strumenti musicali">Strumenti musicali</option>
                </select>
              </div>

              <div className="sub-field">
                <label htmlFor="marca">Marca / modello specifico</label>
                <input
                  id="marca"
                  type="text"
                  placeholder="es. Nikon D7500, Gibson Les Paul… (opzionale)"
                  value={marcaModello}
                  onChange={(e) => setMarcaModello(e.target.value)}
                />
                <span className="sub-field-note">Lascia vuoto per ricevere tutti i deal della categoria.</span>
              </div>

              <button type="submit" className="sub-btn" disabled={status === 'loading'}>
                {status === 'loading' ? 'Invio in corso…' : 'Iscriviti alla beta →'}
              </button>

              <p className="sub-field-note">Niente spam. Solo il tuo link di accesso quando sei pronto.</p>
            </form>
          </>
        )}
      </main>

      <footer>
        <div className="footer-logo">
          <LogoSvg height={28} />
        </div>
        <div className="footer-note">© 2025 Lepefy · Made in Italy</div>
      </footer>
    </>
  );
}
