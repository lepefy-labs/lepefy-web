import type { Metadata } from 'next';
import Link from 'next/link';
import LogoSvg from '../_components/LogoSvg';
import { fetchPublicDeals, type Deal } from '../../lib/supabase';
import DealsGrid from './DealsGrid';

export const revalidate = 900;

export const metadata: Metadata = {
  title: 'Lepefy — Deal del giorno',
  description: "I migliori affari su Subito.it e Vinted selezionati dall'AI. Prezzi sottostimati aggiornati ogni 15 minuti.",
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
      <nav>
        <Link href="/chi-siamo" className="logo-svg" aria-label="Lepefy home">
          <LogoSvg height={36} />
        </Link>
        <div className="nav-links">
          <Link href="/chi-siamo" className="nav-link">Chi siamo</Link>
          <Link href="/abbonati" className="nav-link accent">Iscriviti alla beta</Link>
        </div>
      </nav>

      <div className="page-wrap">
        <div className="page-header">
          <h1>Deal del giorno</h1>
          <p>
            {fetchError
              ? 'Errore nel caricamento — riprova tra poco.'
              : `${deals.length} occasioni selezionate dall'AI`}
          </p>
        </div>

        <DealsGrid initialDeals={deals} />
      </div>

      <footer>
        <div className="footer-logo">
          <LogoSvg height={28} />
        </div>
        <div className="footer-note">© 2025 Lepefy · Made in Italy</div>
      </footer>
    </>
  );
}
