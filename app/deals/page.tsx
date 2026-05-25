import type { Metadata } from 'next';
import Link from 'next/link';
import LogoSvg from '../_components/LogoSvg';
import DealsGrid from './DealsGrid';
import { fetchPublicDeals } from '@/lib/supabase';
import type { Deal } from '@/lib/supabase';

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Lepefy — I migliori deal su Subito.it e Vinted.it",
  description: "I migliori affari su elettronica e fotografia usata, scoperti dall'AI. Gli abbonati li vedono 12 ore prima.",
};

export default async function DealsPage() {
  let deals: Deal[] = [];
  let fetchError = false;

  try {
    deals = await fetchPublicDeals();
  } catch {
    fetchError = true;
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
          <Link href="/chi-siamo" className="nav-link">Chi siamo</Link>
          <Link href="/abbonati" className="nav-cta">Iscriviti alla beta</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-section-inner">
          <div className="hero-badge">🤖 AI-powered · Aggiornato ogni 15 minuti</div>
          <h1>
            I migliori deal su Subito.it e Vinted.it —{' '}
            <span className="highlight">Scoperti dall&apos;AI</span>
          </h1>
          <p>
            Risparmia fino al 40% su elettronica e fotografia usata.
            Gli abbonati li vedono <strong>12 ore prima</strong>.
          </p>
          <div className="hero-cta-row">
            <Link href="/abbonati" className="btn-primary">Prova Gratis per 7 Giorni →</Link>
            <Link href="/chi-siamo" className="btn-secondary">Come funziona?</Link>
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <div className="promo-banner">
        <p>
          🔔 Vuoi vedere i deal <strong>12 ore prima</strong> degli altri?
          Iscriviti alla beta e ricevi notifiche in tempo reale!
        </p>
        <Link href="/abbonati" className="promo-banner-btn">Iscriviti Ora →</Link>
      </div>

      {/* DEALS */}
      <div className="page-wrap">
        {fetchError ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-3)' }}>
            ⚠️ Impossibile caricare i deal in questo momento. Riprova tra qualche minuto.
          </div>
        ) : deals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-3)' }}>
            🕐 Nessun deal disponibile al momento. Torna presto!
          </div>
        ) : (
          <DealsGrid initialDeals={deals} />
        )}
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <LogoSvg height={24} />
                <span className="footer-brand-name">Lepefy</span>
              </div>
              <p className="footer-brand-desc">
                Deal scanner AI per marketplace italiani. Trova le occasioni prima degli altri.
              </p>
            </div>
            <div>
              <div className="footer-col-title">Navigazione</div>
              <ul className="footer-links">
                <li><Link href="/deals">Deal del giorno</Link></li>
                <li><Link href="/abbonati">Iscriviti alla beta</Link></li>
                <li><Link href="/chi-siamo">Chi siamo</Link></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Contatti</div>
              <ul className="footer-links">
                <li><a href="https://t.me/lepefy">✈️ Telegram</a></li>
                <li><a href="mailto:info@lepefy.it">✉️ Email</a></li>
                <li><a href="/privacy">🔒 Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 Lepefy · Tutti i diritti riservati · Made in Italy 🇮🇹</span>
          </div>
        </div>
      </footer>
    </>
  );
}
