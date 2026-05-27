'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { Deal } from '@/lib/supabase';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const COUNTRY_CODES: Record<string, string> = {
  'francia': 'fr', 'france': 'fr',
  'germania': 'de', 'germany': 'de',
  'spagna': 'es', 'spain': 'es',
  'portogallo': 'pt', 'portugal': 'pt',
  'belgio': 'be', 'belgium': 'be',
  'paesi bassi': 'nl', 'netherlands': 'nl',
  'austria': 'at', 'svizzera': 'ch', 'switzerland': 'ch',
  'polonia': 'pl', 'poland': 'pl',
  'grecia': 'gr', 'greece': 'gr',
  'romania': 'ro', 'svezia': 'se', 'sweden': 'se',
  'regno unito': 'gb', 'united kingdom': 'gb',
};

const ITALY_KEYWORDS = ['italia', 'italy', 'lombardia', 'lazio', 'campania',
  'veneto', 'sicilia', 'piemonte', 'toscana', 'emilia', 'puglia', 'calabria',
  'sardegna', 'liguria', 'marche', 'abruzzo', 'friuli', 'umbria', 'basilicata',
  'molise', "valle d'aosta", 'trentino'];

function getLocationInfo(location: string | null) {
  if (!location) return null;
  const lower = location.toLowerCase();
  if (ITALY_KEYWORDS.some((k) => lower.includes(k))) {
    return { label: location, countryCode: null, foreign: false };
  }
  for (const [country, code] of Object.entries(COUNTRY_CODES)) {
    if (lower.includes(country)) {
      const parts = location.split(',');
      const city = parts.length > 1 ? parts[0].trim() : null;
      return { label: city ? `${city}, ${code.toUpperCase()}` : code.toUpperCase(), countryCode: code, foreign: true };
    }
  }
  return { label: location, countryCode: null, foreign: false };
}

// ─── ScoreBar ─────────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const color = score >= 9 ? '#10B981' : score >= 8 ? '#2563EB' : score >= 7 ? '#F59E0B' : '#9CA3AF';
  return (
    <div className="modal-score-bar-wrap">
      <div className="modal-score-bar-track">
        <div className="modal-score-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="modal-score-label" style={{ color }}>{score}/10</span>
    </div>
  );
}

// ─── DealModal ────────────────────────────────────────────────────────────────

interface Props {
  deal: Deal;
  onClose: () => void;
}

export default function DealModal({ deal, onClose }: Props) {
  const href = safeUrl(deal.url);
  const platform = sourceLabel(deal.source);
  const isSubito = deal.source.toLowerCase().includes('subito');
  const location = getLocationInfo(deal.location);
  const isTopDeal = deal.score >= 9 || deal.margine_stimato > 200;

  // Chiude con ESC, blocca scroll del body
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="modal-header">
          <div className="modal-header-badges">
            {isTopDeal && <span className="badge badge-top">⚡ Top Deal</span>}
            <span className="badge badge-score">Score {deal.score}/10</span>
            <span className={`deal-source-badge ${isSubito ? 'badge-subito' : 'badge-vinted'}`}>
              {platform}
            </span>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Chiudi">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Immagine ── */}
        {deal.image_url && (
          <div className="modal-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={deal.image_url} alt={deal.title} className="modal-img" />
          </div>
        )}

        {/* ── Body ── */}
        <div className="modal-body">

          {/* Titolo */}
          <h2 className="modal-title">{deal.title}</h2>

          {/* Prezzo + Margine */}
          <div className="modal-price-row">
            <span className="modal-price">€{deal.price_value.toLocaleString('it-IT')}</span>
            <span className="deal-margin">+€{deal.margine_stimato} di margine stimato</span>
          </div>

          {/* Score bar */}
          <ScoreBar score={deal.score} />

          {/* Valutazione AI completa */}
          {deal.motivazione && (
            <div className="modal-section">
              <div className="modal-section-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-1.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
                Valutazione AI
              </div>
              <p className="modal-motivation">{deal.motivazione}</p>
            </div>
          )}

          {/* Meta info */}
          <div className="modal-meta-grid">
            {location && (
              <div className="modal-meta-item">
                <span className="modal-meta-label">Località</span>
                <span className={`modal-meta-value${location.foreign ? ' modal-meta-foreign' : ''}`}>
                  📍 {location.label}
                  {location.countryCode && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://flagcdn.com/16x12/${location.countryCode}.png`}
                      srcSet={`https://flagcdn.com/32x24/${location.countryCode}.png 2x`}
                      width={16} height={12}
                      alt={location.countryCode.toUpperCase()}
                      style={{ borderRadius: 2 }}
                    />
                  )}
                </span>
              </div>
            )}
            {deal.condition && (
              <div className="modal-meta-item">
                <span className="modal-meta-label">Condizioni</span>
                <span className="modal-meta-value">{deal.condition}</span>
              </div>
            )}
            {deal.keyword && (
              <div className="modal-meta-item">
                <span className="modal-meta-label">Categoria</span>
                <span className="modal-meta-value">{deal.keyword}</span>
              </div>
            )}
            <div className="modal-meta-item">
              <span className="modal-meta-label">Piattaforma</span>
              <span className="modal-meta-value">{platform}</span>
            </div>
          </div>

        </div>

        {/* ── Footer CTA ── */}
        <div className="modal-footer">
          {href && (
            <a href={href} target="_blank" rel="noopener noreferrer" className="modal-cta-primary">
              Vedi su {platform} →
            </a>
          )}
          <Link href="/abbonati" className="modal-cta-secondary" onClick={onClose}>
            Ricevi deal come questo in anticipo
          </Link>
        </div>

      </div>
    </div>
  );
}
