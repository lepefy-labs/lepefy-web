'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import type { Deal } from '../../lib/supabase';
import DealModal from './DealModal';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sourceLabel(source: string) {
  const s = source.toLowerCase();
  if (s.includes('subito')) return 'Subito.it';
  if (s.includes('vinted')) return 'Vinted';
  return source;
}

function sourceBadgeClass(source: string) {
  const s = source.toLowerCase();
  if (s.includes('subito')) return 'deal-source-badge badge-subito';
  if (s.includes('vinted')) return 'deal-source-badge badge-vinted';
  return 'deal-source-badge badge-other';
}

const COUNTRY_CODES: Record<string, string> = {
  'francia':        'fr',
  'france':         'fr',
  'germania':       'de',
  'germany':        'de',
  'spagna':         'es',
  'spain':          'es',
  'portogallo':     'pt',
  'portugal':       'pt',
  'belgio':         'be',
  'belgium':        'be',
  'paesi bassi':    'nl',
  'netherlands':    'nl',
  'austria':        'at',
  'svizzera':       'ch',
  'switzerland':    'ch',
  'polonia':        'pl',
  'poland':         'pl',
  'repubblica ceca':'cz',
  'czech':          'cz',
  'ungheria':       'hu',
  'hungary':        'hu',
  'grecia':         'gr',
  'greece':         'gr',
  'romania':        'ro',
  'svezia':         'se',
  'sweden':         'se',
  'regno unito':    'gb',
  'united kingdom': 'gb',
  'danimarca':      'dk',
  'denmark':        'dk',
  'norvegia':       'no',
  'norway':         'no',
  'finlandia':      'fi',
  'finland':        'fi',
  'croazia':        'hr',
  'croatia':        'hr',
  'slovacchia':     'sk',
  'slovakia':       'sk',
  'slovenia':       'si',
  'bulgaria':       'bg',
  'serbia':         'rs',
};

const ITALY_KEYWORDS = ['italia', 'italy', 'lombardia', 'lazio', 'campania',
  'veneto', 'sicilia', 'piemonte', 'toscana', 'emilia', 'puglia', 'calabria',
  'sardegna', 'liguria', 'marche', 'abruzzo', 'friuli', 'umbria', 'basilicata',
  'molise', "valle d'aosta", 'trentino'];

function locationDisplay(location: string | null): {
  city: string | null;
  countryCode: string | null;
  foreign: boolean;
} | null {
  if (!location) return null;
  const lower = location.toLowerCase();

  // Italiana
  if (ITALY_KEYWORDS.some((k) => lower.includes(k))) {
    return { city: location, countryCode: null, foreign: false };
  }

  // Estera — estrae la città (prima della virgola) e il codice ISO
  for (const [country, code] of Object.entries(COUNTRY_CODES)) {
    if (lower.includes(country)) {
      const parts = location.split(',');
      const city = parts.length > 1 ? parts[0].trim() : null;
      return { city, countryCode: code, foreign: true };
    }
  }

  // Fallback italiano
  return { city: location, countryCode: null, foreign: false };
}

function safeUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.protocol === 'http:' || u.protocol === 'https:') return url;
  } catch {}
  return null;
}



const SearchSvg = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 13l3.5 3.5M9 15A6 6 0 109 3a6 6 0 000 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ─── DealCard ─────────────────────────────────────────────────────────────────

function DealCard({ deal, onOpenModal }: { deal: Deal; onOpenModal: (deal: Deal) => void }) {
  const [imgError, setImgError] = useState(false);
  const href = safeUrl(deal.url);
  const platform = sourceLabel(deal.source);
  const isTopDeal = deal.score >= 9;

  return (
    <div className="deal-card deal-card--clickable" onClick={() => onOpenModal(deal)}>
      {/* Immagine + Badge overlay */}
      <div className="deal-img-wrap">
        {!imgError && deal.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="deal-img"
            src={deal.image_url}
            alt={deal.title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="deal-img-placeholder">
            <img src="/card-placeholder.svg" alt="" />
          </div>
        )}
        <div className="deal-badges">
          {isTopDeal && <span className="badge badge-top">⚡ Top Deal</span>}
          <span className="badge badge-score">Score {deal.score}/10</span>
        </div>
      </div>

      {/* Body */}
      <div className="deal-body">
        <div className="deal-top">
          <span className={sourceBadgeClass(deal.source)}>{platform}</span>
          {deal.condition && (
            <span className="deal-condition">{deal.condition}</span>
          )}
        </div>

        <div className="deal-title">{deal.title}</div>

        <div className="deal-price-row">
          <span className="deal-price">€{deal.price_value.toLocaleString('it-IT')}</span>
          <span className="deal-margin">+€{deal.margine_stimato} margine</span>
        </div>

        {deal.motivazione && (
          <div className="deal-motivation">{deal.motivazione}</div>
        )}

        <div className="deal-footer">
          {(() => {
            const loc = locationDisplay(deal.location);
            if (!loc) return <span />;
            const label = loc.foreign
              ? `📍 ${loc.city ? `${loc.city}, ` : ''}${loc.countryCode!.toUpperCase()}`
              : `📍 ${loc.city}`;
            return (
              <span className={`deal-location${loc.foreign ? ' deal-location--foreign' : ''}`}>
                {label}
                {loc.countryCode && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://flagcdn.com/16x12/${loc.countryCode}.png`}
                    srcSet={`https://flagcdn.com/32x24/${loc.countryCode}.png 2x`}
                    width={16}
                    height={12}
                    alt={loc.countryCode.toUpperCase()}
                    style={{ borderRadius: 2, flexShrink: 0 }}
                  />
                )}
              </span>
            );
          })()}
          {href && (
            <a
              className="deal-link"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Vedi su {platform} →
            </a>
          )}
        </div>

        {/* Affordance "dettagli" */}
        <div className="deal-expand-hint">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
          </svg>
          Dettagli completi
        </div>
      </div>
    </div>
  );
}

// ─── Tipi filtri ──────────────────────────────────────────────────────────────

type Platform = 'tutti' | 'subito' | 'vinted';
type SortBy   = 'score' | 'margin' | 'price_asc' | 'price_desc' | 'date';

// ─── DealsGrid ────────────────────────────────────────────────────────────────

export default function DealsGrid({ initialDeals }: { initialDeals: Deal[] }) {
  const [search,        setSearch]        = useState('');
  const [platform,      setPlatform]      = useState<Platform>('tutti');
  const [keyword,       setKeyword]       = useState('');
  const [minScore,      setMinScore]      = useState(0);
  const [sortBy,        setSortBy]        = useState<SortBy>('score');
  const [showSticky,    setShowSticky]    = useState(false);
  const [fetchedAt,     setFetchedAt]     = useState('');
  const [selectedDeal,  setSelectedDeal]  = useState<Deal | null>(null);

  useEffect(() => {
    setFetchedAt(new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }));
    document.body.classList.add('deals-page');
    const onScroll = () => setShowSticky(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.body.classList.remove('deals-page');
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const keywords = useMemo(() => {
    const kws = new Set<string>();
    initialDeals.forEach((d) => { if (d.keyword) kws.add(d.keyword); });
    return Array.from(kws).sort();
  }, [initialDeals]);

  const hasActiveFilters = search || platform !== 'tutti' || keyword || minScore > 0 || sortBy !== 'score';

  const filtered = useMemo(() => {
    let result = [...initialDeals];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) => d.title.toLowerCase().includes(q) || d.motivazione?.toLowerCase().includes(q)
      );
    }
    if (platform !== 'tutti') {
      result = result.filter((d) => d.source.toLowerCase().includes(platform));
    }
    if (keyword) {
      result = result.filter((d) => d.keyword === keyword);
    }
    if (minScore > 0) {
      result = result.filter((d) => d.score >= minScore);
    }

    switch (sortBy) {
      case 'margin':     result.sort((a, b) => b.margine_stimato - a.margine_stimato); break;
      case 'price_asc':  result.sort((a, b) => a.price_value - b.price_value); break;
      case 'price_desc': result.sort((a, b) => b.price_value - a.price_value); break;
      case 'date':       result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      default:           result.sort((a, b) => b.score * b.margine_stimato - a.score * a.margine_stimato);
    }
    return result;
  }, [initialDeals, search, platform, keyword, minScore, sortBy]);

  function resetFilters() {
    setSearch(''); setPlatform('tutti'); setKeyword(''); setMinScore(0); setSortBy('score');
  }

  return (
    <>
      {/* Counter */}
      <p className="deals-counter">
        <strong>{filtered.length}</strong> occasioni selezionate dall&apos;AI
        {fetchedAt && <> · aggiornato alle {fetchedAt}</>}
      </p>

      {/* Filter bar */}
      <div className="filters-bar">
        {/* Search */}
        <div className="filter-search">
          <SearchSvg />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca un modello (es: Canon EOS R6)..."
          />
        </div>

        {/* Piattaforma */}
        <select className="filter-select" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
          <option value="tutti">Tutte le piattaforme</option>
          <option value="subito">Subito.it</option>
          <option value="vinted">Vinted</option>
        </select>

        {/* Categoria */}
        {keywords.length > 0 && (
          <select className="filter-select" value={keyword} onChange={(e) => setKeyword(e.target.value)}>
            <option value="">Tutte le categorie</option>
            {keywords.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        )}

        {/* Score */}
        <select className="filter-select" value={minScore} onChange={(e) => setMinScore(Number(e.target.value))}>
          <option value={0}>Tutti gli score</option>
          <option value={7}>7/10+</option>
          <option value={8}>8/10+</option>
          <option value={9}>9/10+</option>
        </select>

        {/* Sort */}
        <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
          <option value="score">Score × Margine</option>
          <option value="margin">Margine maggiore</option>
          <option value="price_asc">Prezzo crescente</option>
          <option value="price_desc">Prezzo decrescente</option>
          <option value="date">Più recenti</option>
        </select>

        {hasActiveFilters && (
          <button className="filter-reset" onClick={resetFilters}>✕ Reset</button>
        )}
      </div>

      {/* Grid — un solo CTA banner a metà griglia */}
      {filtered.length === 0 ? (
        <div className="deals-grid">
          <div className="no-deals">Nessun deal trovato con questi filtri.</div>
        </div>
      ) : (
        <>
          {/* Prima metà */}
          <div className="deals-grid">
            {filtered.slice(0, Math.ceil(filtered.length / 2)).map((deal) => (
              <DealCard key={deal.id} deal={deal} onOpenModal={setSelectedDeal} />
            ))}
          </div>

          {/* CTA unico — a metà scroll */}
          <div className="cta-inline">
            <h3>Vuoi ricevere gli alert in tempo reale?</h3>
            <p>Questi deal hanno già 12+ ore. Gli abbonati li vedono subito — prima che spariscano.</p>
            <Link href="/abbonati" className="cta-inline-btn">Iscriviti alla beta →</Link>
            <div className="cta-inline-note">ACCESSO ANTICIPATO · NIENTE SPAM</div>
          </div>

          {/* Seconda metà */}
          <div className="deals-grid">
            {filtered.slice(Math.ceil(filtered.length / 2)).map((deal) => (
              <DealCard key={deal.id} deal={deal} onOpenModal={setSelectedDeal} />
            ))}
          </div>
        </>
      )}

      {/* Sticky CTA mobile */}
      <div className={`cta-mobile-sticky${showSticky ? ' visible' : ''}`}>
        <p>
          Vuoi gli alert istantanei?
          <span>Questi deal hanno già 12+ ore</span>
        </p>
        <Link href="/abbonati">Iscriviti →</Link>
      </div>

      {/* Modal dettaglio deal */}
      {selectedDeal && (
        <DealModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
      )}
    </>
  );
}
