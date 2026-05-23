import type { Metadata } from 'next';
import Link from 'next/link';
import LogoSvg from '../_components/LogoSvg';
import DealsGrid from './DealsGrid';
import { fetchPublicDeals } from '@/lib/supabase';
import type { Deal } from '@/lib/supabase';

export const revalidate = 900;

export const metadata: Metadata = {
  title: 'Lepefy — I migliori deal trovati dall\'AI',
  description:
    'I migliori affari su Subito.it e Vinted.it, selezionati dall\'AI con 12 ore di ritardo rispetto agli abbonati.',
};

export default async function DealsPage() {
  let deals: Deal[] = [];
  let fetchError = false;

  try {
    deals = await fetchPublicDeals();
  } catch {
    fetchError = true;
  }

  const fetchedAt = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* NAV */}
      <nav>
        <Link href="/" className="logo-link">
          <div className="logo-svg">
            <LogoSvg />
          </div>
        </Link>
        <div className="nav-right">
          <Link href="/" className="nav-link">← Home</Link>
          <Link href="/abbonati" className="nav-cta">Iscriviti alla beta</Link>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="page-wrap">
        <div className="deals-header">
          <h1>I migliori affari trovati dall&apos;AI</h1>
          <p className="deals-subtitle">
            Aggiornati ogni 15 minuti — con 12 ore di ritardo rispetto agli abbonati
          </p>
          <div className="last-updated">Aggiornato alle {fetchedAt}</div>
        </div>

        {fetchError ? (
          <div className="state-msg" style={{ padding: '4rem 2rem' }}>
            Impossibile caricare i deal in questo momento. Riprova tra qualche minuto.
          </div>
        ) : deals.length === 0 ? (
          <div className="state-msg" style={{ padding: '4rem 2rem' }}>
            Nessun deal disponibile al momento. Torna presto!
          </div>
        ) : (
          <DealsGrid initialDeals={deals} fetchedAt={fetchedAt} />
        )}
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <LogoSvg height={28} />
        </div>
        <div className="footer-note">© 2025 Lepefy · Made in Italy</div>
      </footer>
    </>
  );
}
