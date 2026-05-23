'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import type { Deal } from '../../lib/supabase';

const PIN_SVG = (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor" />
  </svg>
);

const CAMERA_SVG = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

function sourceBadgeClass(source: string) {
  const s = source.toLowerCase();
  if (s.includes('subito')) return 'deal-source-badge badge-subito';
  if (s.includes('vinted')) return 'deal-source-badge badge-vinted';
  return 'deal-source-badge badge-other';
}

function sourceLabel(source: string) {
  const s = source.toLowerCase();
  if (s.includes('subito')) return 'Subito.it';
  if (s.includes('vinted')) return 'Vinted';
  return source;
}

function safeUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.protocol === 'http:' || u.protocol === 'https:') return url;
  } catch {}
  return null;
}

function DealCard({ deal }: { deal: Deal }) {
  const [imgError, setImgError] = useState(false);
  const href = safeUrl(deal.url);

  return (
    <div className="deal-card">
      {!imgError && deal.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="deal-img"
          src={deal.image_url}
          alt={deal.title}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="deal-img-placeholder">{CAMERA_SVG}</div>
      )}

      <div className="deal-body">
        <div className="deal-top">
          <span className={sourceBadgeClass(deal.source)}>{sourceLabel(deal.source)}</span>
          <span className="deal-score-badge">Score {deal.score}/10</span>
        </div>

        <div className="deal-title">{deal.title}</div>

        <div className="deal-price-row">
          <span className="deal-price">€{deal.price_value.toLocaleString('it-IT')}</span>
          <span className="deal-margin">~€{deal.margine_stimato} di margine</span>
        </div>

        {deal.motivazione && (
          <div className="deal-motivation">{deal.motivazione}</div>
        )}

        <div className="deal-footer">
          {deal.location ? (
            <span className="deal-location">
              {PIN_SVG} {deal.location}
            </span>
          ) : (
            <span />
          )}
          {href ? (
            <a className="deal-link" href={href} target="_blank" rel="noopener noreferrer">
              Vedi annuncio →
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const SOURCES = ['Tutti', 'Subito.it', 'Vinted.it'] as const;
type SourceFilter = (typeof SOURCES)[number];

export default function DealsGrid({ initialDeals }: { initialDeals: Deal[]; fetchedAt: string }) {
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('Tutti');
  const [keyword, setKeyword] = useState('');
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    document.body.classList.add('deals-page');
    const onScroll = () => setShowSticky(window.scrollY > 300);
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

  const filtered = useMemo(() => {
    return initialDeals.filter((d) => {
      if (sourceFilter !== 'Tutti') {
        const s = d.source.toLowerCase();
        if (sourceFilter === 'Subito.it' && !s.includes('subito')) return false;
        if (sourceFilter === 'Vinted.it' && !s.includes('vinted')) return false;
      }
      if (keyword && d.keyword !== keyword) return false;
      return true;
    });
  }, [initialDeals, sourceFilter, keyword]);

  return (
    <>
      <div className="filters-row">
        {SOURCES.map((s) => (
          <button
            key={s}
            className={`filter-pill${sourceFilter === s ? ' active' : ''}`}
            onClick={() => setSourceFilter(s)}
          >
            {s}
          </button>
        ))}
        {keywords.length > 0 && (
          <select
            className="keyword-select"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          >
            <option value="">Tutte le categorie</option>
            {keywords.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        )}
      </div>

      <div className="deals-layout">
        <div className="deals-grid">
          {filtered.length === 0 ? (
            <div className="no-deals">Nessun deal trovato con questi filtri.</div>
          ) : (
            filtered.map((deal) => <DealCard key={deal.id} deal={deal} />)
          )}
        </div>

        <aside className="cta-sidebar">
          <h3>Vuoi ricevere gli alert in tempo reale?</h3>
          <p>Questi deal hanno già 12+ ore. Gli abbonati li vedono subito — prima che spariscano.</p>
          <Link href="/abbonati" className="cta-sidebar-btn">Iscriviti alla beta →</Link>
          <div className="cta-sidebar-note">Accesso anticipato · Niente spam</div>
        </aside>
      </div>

      <div className={`cta-mobile-sticky${showSticky ? ' visible' : ''}`}>
        <p>
          Vuoi gli alert istantanei?
          <span>Questi deal hanno già 12+ ore</span>
        </p>
        <Link href="/abbonati">Iscriviti →</Link>
      </div>
    </>
  );
}
