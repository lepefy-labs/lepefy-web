'use client';

import { useState } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

async function saveToWaitlist(
  email: string,
  categoria: string | null,
  marca_modello: string | null
): Promise<'new' | 'duplicate' | 'error'> {
  const checkRes = await fetch(
    `${SUPABASE_URL}/rest/v1/waitlist?email=eq.${encodeURIComponent(email)}&select=id`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  const existing = await checkRes.json();
  if (existing.length > 0) return 'duplicate';

  const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ email, categoria: categoria || null, marca_modello: marca_modello || null }),
  });
  return res.ok ? 'new' : 'error';
}

export function HeroWaitlistForm() {
  const [email, setEmail] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [hasError, setHasError] = useState(false);

  async function handleSubmit() {
    if (!email || !email.includes('@')) {
      setHasError(true);
      setTimeout(() => setHasError(false), 1500);
      return;
    }
    setStatus('loading');
    try {
      const result = await saveToWaitlist(email, categoria || null, marca.trim() || null);
      setStatus(result === 'new' ? 'success' : result === 'duplicate' ? 'duplicate' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success' || status === 'duplicate' || status === 'error') {
    return (
      <div className="waitlist-form">
        <div className="success-msg" style={{ display: 'flex' }}>
          {status === 'success' && '✓ Sei in lista — ti avvisiamo presto.'}
          {status === 'duplicate' && '👋 Sei già in lista — ti avvisiamo presto!'}
          {status === 'error' && '⚠️ Qualcosa è andato storto, riprova.'}
        </div>
      </div>
    );
  }

  return (
    <div className="waitlist-form">
      <span className="form-label">Accesso anticipato gratuito</span>
      <div className={`field-row${hasError ? ' has-error' : ''}`}>
        <input
          type="email"
          placeholder="la.tua@email.it"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        <button
          className="btn-cta"
          onClick={handleSubmit}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? '…' : 'Entra →'}
        </button>
      </div>
      <div className="extra-fields">
        <select value={categoria} onChange={e => setCategoria(e.target.value)}>
          <option value="">Cosa cerchi? (opzionale)</option>
          <option value="Fotocamere">Fotocamere</option>
          <option value="Laptop">Laptop</option>
          <option value="Audio Hi-Fi">Audio Hi-Fi</option>
          <option value="Strumenti musicali">Strumenti musicali</option>
          <option value="Altro">Altro</option>
        </select>
        <input
          type="text"
          placeholder="Marca e modello — es. Nikon D7500, ThinkPad X1... (opzionale)"
          value={marca}
          onChange={e => setMarca(e.target.value)}
        />
      </div>
      <div className="form-note">Niente spam. Solo il tuo link di accesso quando sei pronto.</div>
    </div>
  );
}

export function CTAWaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [hasError, setHasError] = useState(false);

  async function handleSubmit() {
    if (!email || !email.includes('@')) {
      setHasError(true);
      setTimeout(() => setHasError(false), 1500);
      return;
    }
    setStatus('loading');
    try {
      const result = await saveToWaitlist(email, null, null);
      setStatus(result === 'new' ? 'success' : result === 'duplicate' ? 'duplicate' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success' || status === 'duplicate' || status === 'error') {
    return (
      <div className="success-cta">
        {status === 'success' && '✓ Sei in lista — ti avvisiamo presto.'}
        {status === 'duplicate' && '👋 Sei già in lista — ti avvisiamo presto!'}
        {status === 'error' && '⚠️ Qualcosa è andato storto, riprova.'}
      </div>
    );
  }

  return (
    <>
      <div className={`cta-form${hasError ? ' has-error' : ''}`}>
        <input
          type="email"
          placeholder="la.tua@email.it"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        <button
          className="btn-cta-dark"
          onClick={handleSubmit}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? '…' : 'Entra →'}
        </button>
      </div>
      <div className="cta-note">Accesso anticipato gratuito · Niente spam</div>
    </>
  );
}
