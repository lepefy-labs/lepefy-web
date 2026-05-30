'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LogoSvg from '../_components/LogoSvg';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const HEADERS = {
  apikey:        SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type':'application/json',
};

// ─── Tipi ────────────────────────────────────────────────────────────────────

type Step    = 1 | 2;
type Status  = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';
type Segment = 'flipper' | 'collezionista' | 'riparatore';

interface SegmentConfig {
  label:            string;
  emoji:            string;
  desc:             string;
  defaultMin:       number;
  defaultMax:       number;
  searchHint:       string;
  is_collector:     boolean;
  include_defective: boolean;
  source:           string | null;
  // filtri sulla tabella keywords
  kwFilter: {
    only_collector:    boolean | null;  // null = non filtrare
    include_defective: boolean;
  };
}

const SEGMENT_CONFIG: Record<Segment, SegmentConfig> = {
  flipper: {
    label:             'Flipper',
    emoji:             '📈',
    desc:              'Compro a prezzi bassi, rivendo a prezzi di mercato',
    defaultMin:        50,
    defaultMax:        500,
    searchHint:        'es. "nikon", "iphone 13", "canon eos"',
    is_collector:      false,
    include_defective: false,
    source:            null,
    kwFilter:          { only_collector: false, include_defective: false },
  },
  collezionista: {
    label:             'Collezionista',
    emoji:             '🏺',
    desc:              'Cerco pezzi rari e vintage a prezzi onesti',
    defaultMin:        10,
    defaultMax:        300,
    searchHint:        'es. "olympus om", "leica", "fujica"',
    is_collector:      true,
    include_defective: false,
    source:            'Vinted.it',
    kwFilter:          { only_collector: true, include_defective: false },
  },
  riparatore: {
    label:             'Riparatore',
    emoji:             '🔧',
    desc:              'Acquisto rotto o difettoso per recuperare i ricambi',
    defaultMin:        5,
    defaultMax:        100,
    searchHint:        'es. "iphone rotto", "macbook", "samsung"',
    is_collector:      false,
    include_defective: true,
    source:            'Vinted.it',
    kwFilter:          { only_collector: false, include_defective: true },
  },
};

const BENEFITS = [
  { icon: '⚡', title: 'Attivazione immediata',   desc: 'Ricevi il primo deal entro 15 minuti dalla registrazione.' },
  { icon: '🤖', title: 'Scoring AI avanzato',     desc: "L'AI stima il margine reale di ogni annuncio." },
  { icon: '🎯', title: 'Solo ciò che ti serve',   desc: 'Keyword curate = zero rumore, costi AI ottimizzati.' },
  { icon: '💸', title: 'Gratis per iniziare',     desc: 'Nessuna carta richiesta. Piano Pro a €9,99/mese.' },
];

const FAQ = [
  { q: 'Come funziona lo scoring AI?',              a: "L'algoritmo confronta ogni annuncio con i prezzi di mercato attuali e calcola il margine potenziale di rivendita. Score 9/10 = ottima opportunità con margine elevato." },
  { q: 'Posso annullare l\'abbonamento?',           a: 'Sì, puoi annullare in qualsiasi momento. Il tuo accesso rimane attivo fino alla fine del periodo pagato.' },
  { q: 'Quanti deal riceverò al giorno?',           a: "In media 5–10 notifiche email al giorno, ma solo quando l'AI trova deal genuinamente interessanti. Qualità prima della quantità." },
  { q: 'Quali marketplace vengono scansionati?',    a: 'Attualmente Subito.it e Vinted.it. Stiamo lavorando per aggiungere altri marketplace italiani.' },
  { q: 'Posso richiedere una keyword non presente?', a: 'Sì, usa il pulsante "Richiedi questa keyword". La valutiamo e se ha senso la aggiungiamo al catalogo entro pochi giorni.' },
  { q: 'Perché non posso scrivere keyword libere?', a: "Le keyword vengono usate per chiamare l'AI su ogni annuncio — keyword non ottimizzate genererebbero notifiche irrilevanti. Quelle nel catalogo sono testate e calibrate." },
];

// ─── API helpers ──────────────────────────────────────────────────────────────

/** Cerca keyword nel catalogo, filtrate per segmento. */
async function searchKeywords(query: string, cfg: SegmentConfig): Promise<string[]> {
  if (query.length < 2) return [];

  // PostgREST accetta * come wildcard nell'ilike (tradotto in % sul DB)
  const encoded = encodeURIComponent(query);
  let url = `${SUPABASE_URL}/rest/v1/keywords`
    + `?keyword=ilike.*${encoded}*`
    + `&active=eq.true`
    + `&include_defective=eq.${cfg.kwFilter.include_defective}`
    + `&select=keyword`
    + `&order=keyword.asc`
    + `&limit=8`;

  if (cfg.kwFilter.only_collector !== null) {
    url += `&only_collector=eq.${cfg.kwFilter.only_collector}`;
  }

  try {
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[Lepefy] searchKeywords', res.status, err);
      return [];
    }
    const data: { keyword: string }[] = await res.json();
    return data.map(r => r.keyword);
  } catch (e) {
    console.error('[Lepefy] searchKeywords fetch failed', e);
    return [];
  }
}

/** Salva una richiesta di nuova keyword. */
async function requestKeyword(keyword: string, email: string, segment: Segment): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/keyword_requests`, {
      method:  'POST',
      headers: { ...HEADERS, Prefer: 'return=minimal' },
      body:    JSON.stringify({ keyword: keyword.trim().toLowerCase(), email: email || null, segment }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[Lepefy] requestKeyword', res.status, err);
    }
    return res.ok;
  } catch (e) {
    console.error('[Lepefy] requestKeyword fetch failed', e);
    return false;
  }
}

/** Crea la subscription direttamente (no waitlist). */
async function createSubscription(payload: {
  email:            string;
  keyword:          string;
  min_threshold:    number;
  max_threshold:    number;
  is_collector:     boolean;
  include_defective: boolean;
  source:           string | null;
}): Promise<Status> {
  try {
    const check = await fetch(
      `${SUPABASE_URL}/rest/v1/subscriptions`
        + `?email=eq.${encodeURIComponent(payload.email)}`
        + `&keyword=ilike.${encodeURIComponent(payload.keyword)}`
        + `&select=id`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const existing = await check.json();
    if (existing.length > 0) return 'duplicate';

    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscriptions`, {
      method:  'POST',
      headers: { ...HEADERS, Prefer: 'return=minimal' },
      body:    JSON.stringify({
        ...payload,
        active:  true,
        keyword: payload.keyword.toLowerCase(),
        plan:    'beta',           // colonna aggiunta (DEFAULT 'beta')
      }),
    });
    return res.ok ? 'success' : 'error';
  } catch {
    return 'error';
  }
}

// ─── Componente Autocomplete ─────────────────────────────────────────────────

interface AutocompleteProps {
  segment:    Segment;
  email:      string;          // serve per salvare la request
  emailValid: boolean;         // blocca la richiesta se false
  value:      string | null;   // keyword selezionata
  onChange:   (kw: string | null) => void;
  onRequest:  (kw: string) => void;
}

function KeywordAutocomplete({ segment, email, emailValid, value, onChange, onRequest }: AutocompleteProps) {
  const [query,        setQuery]        = useState('');
  const [results,      setResults]      = useState<string[]>([]);
  const [open,         setOpen]         = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [requestSent,  setRequestSent]  = useState(false);
  const [requestKw,    setRequestKw]    = useState('');
  const [emailMissing, setEmailMissing]  = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const cfg         = SEGMENT_CONFIG[segment];

  // Reset stato quando cambia segmento
  useEffect(() => {
    setQuery('');
    setResults([]);
    setOpen(false);
    setRequestSent(false);
    onChange(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment]);

  // Chiudi dropdown cliccando fuori
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  function handleInput(q: string) {
    setQuery(q);
    setRequestSent(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) { setResults([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const res = await searchKeywords(q, cfg);
      setResults(res);
      setOpen(true);
      setLoading(false);
    }, 220);
  }

  function select(kw: string) {
    onChange(kw);
    setQuery('');
    setOpen(false);
  }

  function clearSelection() {
    onChange(null);
    setQuery('');
    setResults([]);
    setOpen(false);
  }

  async function handleRequest() {
    const kw = query.trim();
    if (!kw) return;
    if (!emailValid) {
      setEmailMissing(true);
      return;
    }
    setEmailMissing(false);
    await requestKeyword(kw, email, segment);
    setRequestSent(true);
    setRequestKw(kw);
    setOpen(true);
  }

  // Evidenzia la parte matchata nella keyword
  function highlightMatch(kw: string) {
    const idx = kw.toLowerCase().indexOf(query.toLowerCase());
    if (idx < 0) return kw;
    return (
      <>
        {kw.slice(0, idx)}
        <strong style={{ color: 'var(--accent)' }}>{kw.slice(idx, idx + query.length)}</strong>
        {kw.slice(idx + query.length)}
      </>
    );
  }

  if (value) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
        <span className="selected-kw-pill">
          🏷 {value}
          <button type="button" onClick={clearSelection} aria-label="Rimuovi keyword" className="pill-remove">×</button>
        </span>
      </div>
    );
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <input
        type="text"
        value={query}
        placeholder={`Cerca — ${cfg.searchHint}`}
        autoComplete="off"
        onChange={e => handleInput(e.target.value)}
        onFocus={() => { if (results.length > 0) setOpen(true); }}
        className={open ? 'kw-input-open' : ''}
      />

      {open && (
        <div className="kw-dropdown">
          {loading && (
            <div className="kw-row kw-loading">Ricerca…</div>
          )}

          {!loading && results.length > 0 && results.map(kw => (
            <button
              key={kw}
              type="button"
              className="kw-row kw-item"
              onClick={() => select(kw)}
            >
              <span className="kw-icon">🔍</span>
              <span>{highlightMatch(kw)}</span>
            </button>
          ))}

          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="kw-empty">
              {requestSent ? (
                <div className="kw-request-sent">
                  ✅ Richiesta inviata per &ldquo;{requestKw}&rdquo; — ti avvisiamo quando è disponibile.
                </div>
              ) : (
                <>
                  <div className="kw-empty-msg">
                    Nessuna keyword per &ldquo;<strong>{query}</strong>&rdquo;
                  </div>
                  <button type="button" className="kw-request-btn" onClick={handleRequest}>
                    + Richiedi questa keyword
                  </button>
                  {emailMissing && (
                    <div className="kw-email-warn">
                      ❌ Inserisci prima un&apos;email valida nel campo sopra.
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Componente StepDot ───────────────────────────────────────────────────────

function StepDot({ n, active, done, label }: { n: number; active: boolean; done: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div className={`step-dot ${done ? 'step-dot-done' : active ? 'step-dot-active' : 'step-dot-idle'}`}>
        {done ? '✓' : n}
      </div>
      <span className={`step-dot-label ${active ? 'step-dot-label-active' : ''}`}>{label}</span>
    </div>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function AbbonatiPage() {
  const [step,         setStep]         = useState<Step>(1);
  const [segment,      setSegment]      = useState<Segment | null>(null);
  const [email,        setEmail]        = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [keyword,      setKeyword]      = useState<string | null>(null);
  const [minPrice,     setMinPrice]     = useState(50);
  const [maxPrice,     setMaxPrice]     = useState(500);
  const [privacy,      setPrivacy]      = useState(false);
  const [status,       setStatus]       = useState<Status>('idle');
  const [emailErr,     setEmailErr]     = useState(false);
  const [kwErr,        setKwErr]        = useState(false);
  const [privacyErr,   setPrivacyErr]   = useState(false);

  // Validazione email in tempo reale
  const emailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const priceValid = minPrice < maxPrice;

  const config = segment ? SEGMENT_CONFIG[segment] : null;

  function selectSegment(seg: Segment) {
    setSegment(seg);
    setMinPrice(SEGMENT_CONFIG[seg].defaultMin);
    setMaxPrice(SEGMENT_CONFIG[seg].defaultMax);
    setKeyword(null);
    setStep(2);
  }

  function goBack() {
    setStep(1);
    setStatus('idle');
    setEmailErr(false);
    setKwErr(false);
    setPrivacyErr(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!config || !segment) return;

    let valid = true;
    if (!email || !email.includes('@')) { setEmailErr(true);   valid = false; } else setEmailErr(false);
    if (!keyword)                        { setKwErr(true);     valid = false; } else setKwErr(false);
    if (!privacy)                        { setPrivacyErr(true);valid = false; } else setPrivacyErr(false);
    if (minPrice >= maxPrice)            { valid = false; }
    if (!valid) return;

    setStatus('loading');
    const result = await createSubscription({
      email,
      keyword:           keyword!,
      min_threshold:     minPrice,
      max_threshold:     maxPrice,
      is_collector:      config.is_collector,
      include_defective: config.include_defective,
      source:            config.source,
    });
    setStatus(result);
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <>
        <nav>
          <Link href="/" className="logo-link" aria-label="Lepefy home">
            <div className="logo-svg"><LogoSvg /></div>
            <span className="logo-name">Lepefy</span>
          </Link>
        </nav>
        <div className="success-block" style={{ maxWidth: 520, margin: '6rem auto', textAlign: 'center', padding: '0 1.5rem' }}>
          <div className="success-icon">🎉</div>
          <h2>Sei dentro!</h2>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>
            La tua subscription per <strong>&ldquo;{keyword}&rdquo;</strong> è attiva.
            Il primo deal arriva entro i prossimi 15 minuti — controlla la tua email.
          </p>
          <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginTop: '1rem', fontFamily: 'var(--font-mono)' }}>
            Non vedi nulla? Controlla spam o scrivi a{' '}
            <a href="mailto:ciao@lepefy.it">ciao@lepefy.it</a>
          </p>
          <Link href="/deals" className="sub-btn" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
            Esplora i deal pubblici →
          </Link>
        </div>
      </>
    );
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
          <Link href="/deals"     className="nav-link">Deal del giorno</Link>
          <Link href="/chi-siamo" className="nav-link">Chi siamo</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="page-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <StepDot n={1} active={step === 1} done={step === 2} label="Profilo" />
          <div style={{ width: 32, height: 1, background: 'var(--border)' }} />
          <StepDot n={2} active={step === 2} done={false} label="Configura" />
        </div>
        <h1>
          {step === 1 ? 'Che tipo di acquirente sei?' : `Configura le tue notifiche ${config?.emoji}`}
        </h1>
        <p>
          {step === 1
            ? <span style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', fontWeight:500, color:'var(--text)' }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--success)', display:'inline-block', animation:'lepefyPulse 1.5s ease-in-out infinite' }} />
                Seleziona il tuo profilo per iniziare
              </span>
            : 'Cerca tra le keyword del catalogo — solo keyword ottimizzate, zero rumore.'}
        </p>
      </section>

      {/* LAYOUT */}
      <div className="sub-layout">

        {/* ── STEP 1 ──────────────────────────────────────────────────────── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(Object.entries(SEGMENT_CONFIG) as [Segment, SegmentConfig][]).map(([key, cfg]) => (
              <button
                key={key}
                type="button"
                onClick={() => selectSegment(key)}
                style={{
                  display:       'flex',
                  alignItems:    'center',
                  gap:           '1rem',
                  padding:       '1.25rem 1.5rem',
                  background:    'var(--bg-2)',
                  border:        '1.5px solid var(--border)',
                  borderRadius:  'var(--radius)',
                  cursor:        'pointer',
                  textAlign:     'left',
                  width:         '100%',
                  transition:    'border-color .15s, background .15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--text)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-2)'; }}
              >
                <span style={{ fontSize: '2rem', lineHeight: 1 }}>{cfg.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{cfg.label}</div>
                  <div style={{ fontSize: '0.83rem', color: 'var(--text-2)', marginTop: '0.2rem' }}>{cfg.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', background: 'var(--bg-3)', border: '0.5px solid var(--border)', borderRadius: 20, padding: '0.3rem 0.75rem', whiteSpace: 'nowrap' }}>
                  Seleziona →
                </div>
              </button>
            ))}
            <div className="social-proof-card" style={{ marginTop: '0.5rem' }}>
              <div className="social-proof-title">🎉 26 beta tester attivi · Soddisfazione 92%</div>
              <div className="social-proof-quote">
                &ldquo;Ho recuperato il costo dell&apos;abbonamento con il primo affare.&rdquo; — Marco, Roma
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2 ──────────────────────────────────────────────────────── */}
        {step === 2 && config && (
          <div className="sub-form-card">
            <button
              type="button"
              onClick={goBack}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              ← Cambia profilo
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: 6, padding: '0.3rem 0.75rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700 }}>
              {config.emoji} {config.label}
            </div>

            {status === 'duplicate' && (
              <div className="sub-notice notice-info" style={{ marginBottom: '1rem' }}>
                👋 Stai già monitorando &ldquo;{keyword}&rdquo; con questa email.
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
                  onChange={e => { setEmail(e.target.value); setEmailTouched(true); setEmailErr(false); }}
                  onBlur={() => setEmailTouched(true)}
                  className={emailErr || (emailTouched && !emailValid && email.length > 0) ? 'error' : ''}
                />
                {/* Feedback in tempo reale */}
                {emailTouched && email.length > 0 && (
                  <span className="sub-field-note" style={{ color: emailValid ? 'var(--success)' : 'var(--danger)' }}>
                    {emailValid ? '✅ Email valida' : '❌ Formato non valido'}
                  </span>
                )}
                {emailErr && !emailTouched && (
                  <span className="sub-field-note" style={{ color: 'var(--danger)' }}>Inserisci un&apos;email valida.</span>
                )}
              </div>

              {/* Keyword autocomplete */}
              <div className="sub-field">
                <label>Cosa vuoi monitorare? *</label>
                <KeywordAutocomplete
                  segment={segment!}
                  email={email}
                  emailValid={emailValid}
                  value={keyword}
                  onChange={kw => { setKeyword(kw); setKwErr(false); }}
                  onRequest={() => {}}
                />
                {keyword && (
                  <span className="sub-field-note" style={{ color: 'var(--success)' }}>✅ Keyword selezionata</span>
                )}
                {kwErr && !keyword && (
                  <span className="sub-field-note" style={{ color: 'var(--danger)' }}>❌ Seleziona una keyword dal catalogo.</span>
                )}
                {!keyword && (
                  <span className="sub-field-note">
                    Non trovi ciò che cerchi? Usa &ldquo;Richiedi questa keyword&rdquo; — la valutiamo entro pochi giorni.
                  </span>
                )}
              </div>

              {/* Fascia prezzo */}
              <div className="sub-field">
                <label>Fascia prezzo (€)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <span className="sub-field-note" style={{ display: 'block', marginBottom: 4 }}>Minimo</span>
                    <input type="number" min="0" max={maxPrice - 1} step="10"
                      value={minPrice} onChange={e => setMinPrice(Math.max(0, +e.target.value))}
                      style={{ width: '100%' }} />
                  </div>
                  <div>
                    <span className="sub-field-note" style={{ display: 'block', marginBottom: 4 }}>Massimo</span>
                    <input type="number" min={minPrice + 1} step="10"
                      value={maxPrice} onChange={e => setMaxPrice(Math.max(minPrice + 1, +e.target.value))}
                      style={{ width: '100%' }} />
                  </div>
                </div>
                <span className="sub-field-note" style={{ color: priceValid ? 'var(--success)' : 'var(--danger)' }}>
                  {priceValid ? `✅ Fascia: €${minPrice} – €${maxPrice}` : '❌ Il minimo deve essere inferiore al massimo'}
                </span>
              </div>

              {/* Fonte */}
              {config.source && (
                <div className="sub-notice notice-info" style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
                  📡 Monitoraggio su: <strong>{config.source}</strong>
                </div>
              )}

              {/* Privacy */}
              <div className="sub-field" style={{ marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={privacy}
                    onChange={e => { setPrivacy(e.target.checked); setPrivacyErr(false); }}
                    style={{ marginTop: 3 }} />
                  <span style={{ color: privacyErr && !privacy ? 'var(--danger)' : undefined }}>
                    Accetto la <a href="/privacy">Privacy Policy</a> *
                  </span>
                </label>
                {privacy && (
                  <span className="sub-field-note" style={{ color: 'var(--success)' }}>✅ Privacy accettata</span>
                )}
                {privacyErr && !privacy && (
                  <span className="sub-field-note" style={{ color: 'var(--danger)' }}>❌ Devi accettare la privacy policy.</span>
                )}
              </div>

              <button type="submit" className="sub-btn"
                disabled={status === 'loading' || minPrice >= maxPrice}>
                {status === 'loading' ? 'Attivazione in corso…' : 'Attiva notifiche gratuite →'}
              </button>
              <div className="sub-btn-note">NESSUNA CARTA RICHIESTA · ATTIVAZIONE IN ~15 MINUTI</div>
            </form>
          </div>
        )}

        {/* BENEFITS */}
        <div className="sub-benefits">
          {BENEFITS.map(b => (
            <div key={b.title} className="benefit-item">
              <span className="benefit-icon">{b.icon}</span>
              <div>
                <div className="benefit-title">{b.title}</div>
                <div className="benefit-desc">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <section className="faq-section">
        <div className="faq-inner">
          <div className="faq-title">Domande frequenti</div>
          {FAQ.map(item => (
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
                <li><a href="mailto:ciao@lepefy.it">✉️ Email</a></li>
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
