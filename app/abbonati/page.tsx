'use client';

import { useState } from 'react';
import Link from 'next/link';
import LogoSvg from '../_components/LogoSvg';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

const BENEFITS = [
  { icon: '⚡', title: '12 ore di vantaggio', desc: 'Accedi ai deal prima che diventino pubblici e prima che spariscano.' },
  { icon: '🤖', title: 'Scoring AI avanzato', desc: "L'AI analizza ogni annuncio e stima il margine di rivendita reale." },
  { icon: '🔔', title: 'Notifiche personalizzate', desc: 'Ricevi solo i deal nella categoria e marca che ti interessano.' },
  { icon: '💸', title: 'Paghi solo se vuoi', desc: '7 giorni di prova gratuiti, poi €9,99/mese. Disdici quando vuoi.' },
];

const FAQ = [
  { q: 'Come funziona lo scoring AI?', a: "L'algoritmo confronta ogni annuncio con i prezzi di mercato attuali e calcola il margine potenziale di rivendita. Score 9/10 = ottima opportunità con margine elevato." },
  { q: 'Posso annullare l\'abbonamento?', a: 'Sì, puoi annullare in qualsiasi momento. Il tuo accesso rimane attivo fino alla fine del periodo pagato.' },
  { q: 'Quanti deal riceverò al giorno?', a: 'In media 5–10 notifiche email al giorno, ma solo quando l\'AI trova deal genuinamente interessanti. Qualità prima della quantità.' },
  { q: 'Quali marketplace vengono scansionati?', a: 'Attualmente Subito.it e Vinted.it. Stiamo lavorando per aggiungere altri marketplace italiani.' },
];

export default function AbbonatiPage() {
  const [email,        setEmail]        = useState('');
  const [categoria,    setCategoria]    = useState('');
  const [marcaModello, setMarcaModello] = useState('');
  const [piano,        setPiano]        = useState('free');
  const [privacy,      setPrivacy]      = useState(false);
  const [status,       setStatus]       = useState<Status>('idle');
  const [emailError,   setEmailError]   = useState(false);
  const [catError,     setCatError]     = useState(false);
  const [privacyError, setPrivacyError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;

    if (!email || !email.includes('@')) { setEmailError(true); valid = false; } else setEmailError(false);
    if (!categoria)                      { setCatError(true);   valid = false; } else setCatError(false);
    if (!privacy)                        { setPrivacyError(true); valid = false; } else setPrivacyError(false);

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
      {/* NAV */}
      <nav>
        <Link href="/" className="logo-link" aria-label="Lepefy home">
          <div className="logo-svg"><LogoSvg /></div>
          <span className="logo-name">Lepefy</span>
        </Link>
        <div className="nav-right">
          <Link href="/deals"    className="nav-link">Deal del giorno</Link>
          <Link href="/chi-siamo" className="nav-link">Chi siamo</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="page-hero">
        <h1>Non perderti mai un&apos;occasione</h1>
        <p>
          Ricevi i migliori deal su elettronica e fotografia usata direttamente nella tua email,{' '}
          <strong>12 ore prima</strong> degli altri.
        </p>
      </section>

      {/* LAYOUT: form + benefits */}
      <div className="sub-layout">

        {/* ── FORM ─────────────────────────────────────── */}
        {status === 'success' ? (
          <div className="success-block">
            <div className="success-icon">🎉</div>
            <h2>Sei in lista!</h2>
            <p>Ti contatteremo a breve per attivare il tuo accesso. Nel frattempo esplora i deal pubblici.</p>
          </div>
        ) : (
          <div className="sub-form-card">
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

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="sub-field">
                <label htmlFor="email">Email *</label>
                <input
                  id="email" type="email" placeholder="la.tua@email.it" autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
                  className={emailError ? 'error' : ''}
                />
                {emailError && <span className="sub-field-note" style={{ color: 'var(--danger)' }}>Inserisci un&apos;email valida.</span>}
              </div>

              {/* Categoria */}
              <div className="sub-field">
                <label htmlFor="categoria">Categoria *</label>
                <select
                  id="categoria"
                  value={categoria}
                  onChange={(e) => { setCategoria(e.target.value); setCatError(false); }}
                  className={catError ? 'error' : ''}
                >
                  <option value="">Seleziona una categoria…</option>
                  <option value="Fotografia">📷 Fotocamere</option>
                  <option value="Obiettivi">🔭 Obiettivi</option>
                  <option value="Computer">💻 Computer</option>
                  <option value="Smartphone">📱 Smartphone</option>
                  <option value="Videogiochi">🎮 Videogiochi</option>
                  <option value="Audio/HiFi">🎵 Audio / Hi-Fi</option>
                  <option value="Strumenti musicali">🎸 Strumenti musicali</option>
                  <option value="Altro">🔧 Altro</option>
                </select>
                {catError && <span className="sub-field-note" style={{ color: 'var(--danger)' }}>Seleziona una categoria.</span>}
              </div>

              {/* Marca / Modello */}
              <div className="sub-field">
                <label htmlFor="marca">Marca / Modello specifico</label>
                <input
                  id="marca" type="text"
                  placeholder="Es: Canon EOS R6, Nikon D7500, MacBook Pro…"
                  value={marcaModello}
                  onChange={(e) => setMarcaModello(e.target.value)}
                />
                <span className="sub-field-note">Lascia vuoto per ricevere tutti i deal della categoria.</span>
              </div>

              {/* Piano */}
              <div className="sub-field">
                <label>Piano</label>
              </div>
              <div className="sub-radio-group">
                <label className="sub-radio-item">
                  <input type="radio" name="piano" value="free" checked={piano === 'free'} onChange={() => setPiano('free')} />
                  🎁 Gratis (7 giorni di prova)
                </label>
                <label className="sub-radio-item">
                  <input type="radio" name="piano" value="premium" checked={piano === 'premium'} onChange={() => setPiano('premium')} />
                  ⚡ Premium (€9,99/mese)
                </label>
              </div>

              {/* Privacy */}
              <label className="sub-checkbox">
                <input
                  type="checkbox"
                  checked={privacy}
                  onChange={(e) => { setPrivacy(e.target.checked); setPrivacyError(false); }}
                />
                <span style={{ color: privacyError ? 'var(--danger)' : undefined }}>
                  Accetto la <a href="/privacy">Privacy Policy</a> *
                </span>
              </label>

              <button type="submit" className="sub-btn" disabled={status === 'loading'}>
                {status === 'loading' ? 'Invio in corso…' : 'Inizia Subito →'}
              </button>
              <div className="sub-btn-note">NIENTE SPAM · SOLO IL TUO LINK DI ACCESSO</div>
            </form>
          </div>
        )}

        {/* ── BENEFITS ─────────────────────────────────── */}
        <div className="sub-benefits">
          {BENEFITS.map((b) => (
            <div key={b.title} className="benefit-item">
              <span className="benefit-icon">{b.icon}</span>
              <div>
                <div className="benefit-title">{b.title}</div>
                <div className="benefit-desc">{b.desc}</div>
              </div>
            </div>
          ))}
          <div className="social-proof-card">
            <div className="social-proof-title">🎉 26 beta tester attivi · Soddisfazione 92%</div>
            <div className="social-proof-quote">
              &ldquo;Ho recuperato il costo dell&apos;abbonamento con il primo affare.&rdquo; — Marco, Roma
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="faq-section">
        <div className="faq-inner">
          <div className="faq-title">Domande frequenti</div>
          {FAQ.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <LogoSvg height={24} />
                <span className="footer-brand-name">Lepefy</span>
              </div>
              <p className="footer-brand-desc">Deal scanner AI per marketplace italiani.</p>
            </div>
            <div>
              <div className="footer-col-title">Navigazione</div>
              <ul className="footer-links">
                <li><Link href="/deals">Deal del giorno</Link></li>
                <li><Link href="/chi-siamo">Chi siamo</Link></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Contatti</div>
              <ul className="footer-links">
                <li><a href="mailto:info@lepefy.it">✉️ Email</a></li>
                <li><a href="/privacy">🔒 Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 Lepefy · Made in Italy 🇮🇹</span>
          </div>
        </div>
      </footer>
    </>
  );
}
