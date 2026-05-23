'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Deal } from '@/lib/supabase';

function esc(str: string | null | undefined): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safeUrl(url: string | null): string {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : '';
}

function formatEur(val: number | null): string {
  if (val === null || val === undefined) return '—';
  return Number(val).toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const CAMERA_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
  </svg>
);

const PIN_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 11, height: 11, flexShrink: 0 }}>
    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
  </svg>
);

function DealCard({ deal }: { deal: Deal }) {
  const [imgError, setImgError] = useState(false);
  const imgUrl = safeUrl(deal.image_url);
  const scoreClass = deal.score >= 8 ? 'score-green' : 'score-yellow';
  const sourceClass = deal.source === 'Vinted.it' ? 'source-vinted' : 'source-subito';
  const linkUrl = safeUrl(deal.url);

  return (
    <div className="deal-card-pub">
      <div className="card-img-wrap">
        {imgUrl && !imgError ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgUrl} alt={esc(deal.title)} loading="lazy" onError={() => setImgError(true)} />
          </>
        ) : (
          <div className="img-placeholder">{CAMERA_SVG}</div>
        )}
      </div>
      <div className="card-body">
        <div className="card-top-row">
          <span className={`source-badge ${sourceClass}`}>{deal.source || '—'}</span>
          <span className={`score-badge ${scoreClass}`}>Score AI {deal.score}/10</span>
        </div>
        <h3 className="card-title">{deal.title}</h3>
        <div className="card-price-row">
          <div className="card-price">€{formatEur(deal.price_value)}</div>
          <div className="card-margin">~€{formatEur(deal.margine_stimato)} di margine</div>
        </div>
        {deal.motivazione && <p className="card-motivation">{deal.motivazione}</p>}
        {deal.location && (
          <div className="card-location">
            {PIN_SVG}
            {deal.location}
          </div>
        )}
        <div className="card-footer">
          {linkUrl ? (
            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="card-link">
              Vedi annuncio →
            </a>
          ) : (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Link non disponibile</span>
          )}
          <span className="card-age">Trovato 12h+ fa</span>
        </div>
      </div>
    </div>
  );
}

interface Props {
  initialDeals: Deal[];
  fetchedAt: string;
}

export default function DealsGrid({ initialDeals, fetchedAt }: Props) {
  const [activeSource, setActiveSource] = useState('all');
  const [activeKeyword, setActiveKeyword] = useState('');

  useEffect(() => {
    document.body.classList.add('deals-page');
    return () => document.body.classList.remove('deals-page');
  }, []);

  const keywords = useMemo(() => {
    const seen = new Set<string>();
    return initialDeals
      .map(d => d.keyword)
      .filter((k): k is string => !!k && !seen.has(k) && !!seen.add(k))
      .sort();
  }, [initialDeals]);

  const filtered = useMemo(() => {
    return initialDeals.filter(d => {
      if (activeSource !== 'all' && d.source !== activeSource) return false;
      if (activeKeyword && d.keyword !== activeKeyword) return false;
      return true;
    });
  }, [initialDeals, activeSource, activeKeyword]);

  function resetFilters() {
    setActiveSource('all');
    setActiveKeyword('');
  }

  const sources = ['all', 'Subito.it', 'Vinted.it'] as const;
  const sourceLabels: Record<string, string> = { all: 'Tutti', 'Subito.it': 'Subito.it', 'Vinted.it': 'Vinted.it' };

  return (
    <>
      {/* Filters */}
      <div className="filters-bar">
        <span className="filter-label">Fonte</span>
        <div className="filter-pills">
          {sources.map(s => (
            <button
              key={s}
              className={`filter-pill${activeSource === s ? ' active' : ''}`}
              onClick={() => setActiveSource(s)}
            >
              {sourceLabels[s]}
            </button>
          ))}
        </div>
        {keywords.length > 0 && (
          <>
            <div className="filter-divider" />
            <span className="filter-label">Categoria</span>
            <select
              className="filter-select"
              value={activeKeyword}
              onChange={e => setActiveKeyword(e.target.value)}
            >
              <option value="">Tutte le categorie</option>
              {keywords.map(kw => (
                <option key={kw} value={kw}>{kw}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Layout */}
      <div className="content-layout">
        <main>
          {filtered.length === 0 ? (
            <div className="state-msg">
              Nessun deal trovato con questi filtri.
              <br />
              <button className="reset-filter-btn" onClick={resetFilters}>Rimuovi filtri</button>
            </div>
          ) : (
            <div className="deals-grid">
              {filtered.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </main>

        {/* Sidebar CTA */}
        <aside className="cta-sidebar">
          <div className="cta-card">
            <span className="cta-card-icon">⏰</span>
            <h3>Questi deal hanno già 12 ore.</h3>
            <p>
              Gli abbonati li ricevono in tempo reale, appena l&apos;AI identifica un&apos;occasione
              su Subito.it e Vinted.it.
            </p>
            <a href="/abbonati" className="btn-subscribe">Iscriviti alla beta →</a>
            <div className="cta-price-note">€9,99/mese · Disdici quando vuoi</div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky CTA */}
      <div className="cta-mobile-sticky visible">
        <div className="cta-mobile-text">
          Questi deal hanno 12h di ritardo. Abbonati per riceverli in tempo reale.
        </div>
        <a href="/abbonati" className="btn-subscribe-mobile">Iscriviti →</a>
      </div>
    </>
  );
}
