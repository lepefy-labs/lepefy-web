'use client';

import { useState } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

async function saveToWaitlist(email: string, categoria: string | null, marca_modello: string | null): Promise<Status> {
  try {
    const check = await fetch(
      `${SUPABASE_URL}/rest/v1/waitlist?email=eq.${encodeURIComponent(email)}&select=id`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const existing = await check.json();
    if (existing.length > 0) return 'duplicate';

    const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: { ...HEADERS, Prefer: 'return=minimal' },
      body: JSON.stringify({ email, categoria: categoria || null, marca_modello: marca_modello || null }),
    });
    return res.ok ? 'success' : 'error';
  } catch {
    return 'error';
  }
}

export function HeroWaitlistForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [email, setEmail] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marcaModello, setMarcaModello] = useState('');

  async function handleSubmit() {
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    const result = await saveToWaitlist(email, categoria || null, marcaModello.trim() || null);
    setStatus(result);
  }

  if (status === 'success' || status === 'duplicate' || status === 'error') {
    return (
      <div className="success-msg">
        {status === 'success' && '✓ Sei in lista — ti avvisiamo presto.'}
        {status === 'duplicate' && '👋 Sei già in lista — ti avvisiamo presto!'}
        {status === 'error' && '⚠️ Qualcosa è andato storto, riprova.'}
      </div>
    );
  }

  return (
    <div className="waitlist-form">
      <span className="form-label">Accesso anticipato gratuito</span>
      <div className="field-row">
        <input
          type="email"
          placeholder="la.tua@email.it"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button className="btn-cta" onClick={handleSubmit} disabled={status === 'loading'}>
          {status === 'loading' ? '...' : 'Entra →'}
        </button>
      </div>
      <div className="extra-fields">
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Cosa cerchi? (opzionale)</option>
          <option value="Fotografia">Fotografia</option>
          <option value="Elettronica">Elettronica</option>
          <option value="Videogiochi">Videogiochi</option>
          <option value="Audio/HiFi">Audio / Hi-Fi</option>
          <option value="Strumenti musicali">Strumenti musicali</option>
        </select>
        <input
          type="text"
          placeholder="Marca e modello — es. Nikon D7500 (opzionale)"
          value={marcaModello}
          onChange={(e) => setMarcaModello(e.target.value)}
        />
      </div>
      <div className="form-note">Niente spam. Solo il tuo link di accesso quando sei pronto.</div>
    </div>
  );
}

export function CTAWaitlistForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [email, setEmail] = useState('');

  async function handleSubmit() {
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    const result = await saveToWaitlist(email, null, null);
    setStatus(result);
  }

  if (status !== 'idle' && status !== 'loading') {
    return (
      <p className="success-cta" style={{ display: 'block', marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--accent)' }}>
        {status === 'success' && '✓ Sei in lista — ti avvisiamo presto.'}
        {status === 'duplicate' && '👋 Sei già in lista!'}
        {status === 'error' && '⚠️ Riprova tra poco.'}
      </p>
    );
  }

  return (
    <div className="cta-form">
      <input
        type="email"
        placeholder="la.tua@email.it"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <button className="btn-cta-dark" onClick={handleSubmit} disabled={status === 'loading'}>
        {status === 'loading' ? '...' : 'Entra →'}
      </button>
    </div>
  );
}
