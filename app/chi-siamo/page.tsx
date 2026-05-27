import type { Metadata } from 'next';
import Link from 'next/link';
import LogoSvg from '../_components/LogoSvg';

export const metadata: Metadata = {
  title: 'Lepefy — Chi Siamo',
  description: 'Lepefy scansiona Subito.it e Vinted in tempo reale. Scopri la nostra missione e come funziona lo scoring AI.',
};

const STATS = [
  // ✏️ MODIFICA 3: aggiunte icone per le stat card
  { val: '12.450+', desc: 'Deal analizzati questa settimana', icon: '📊' },
  { val: '92%',     desc: 'Soddisfazione utenti',            icon: '😊' },
  { val: '€500k+',  desc: 'Risparmiati dagli utenti',        icon: '💰' },
  { val: '15 min',  desc: 'Frequenza aggiornamento',         icon: '⏱️' },
];

const FLOW = [
  { step: '1', icon: '🔍', title: 'Scansione continua',  desc: 'Analizziamo migliaia di annunci ogni 15 minuti su Subito.it e Vinted.it.' },
  { step: '2', icon: '🤖', title: 'Scoring AI',          desc: "L'AI confronta ogni annuncio con i prezzi di mercato e calcola il margine potenziale." },
  { step: '3', icon: '🔔', title: 'Notifica immediata',  desc: 'Gli abbonati ricevono un alert solo per i deal che valgono davvero.' },
];

const TESTIMONIALS = [
  { quote: 'Grazie a Lepefy ho comprato un Canon EOS R6 a €800 invece di €1.400! Deal trovato in due minuti.', author: 'Luca M.', city: 'Milano' },
  { quote: "Finalmente uno strumento serio per chi fa flipping. I deal sono buoni e l'AI spiega sempre il perché.", author: 'Davide R.', city: 'Torino' },
  { quote: "Ho recuperato il costo dell'abbonamento con il primo affare. Strumento indispensabile.", author: 'Marco P.', city: 'Roma' },
];

// ✏️ MODIFICA 4: helper per le iniziali avatar
function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export default function ChiSiamoPage() {
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
          <Link href="/abbonati" className="nav-cta">Iscriviti alla beta</Link>
        </div>
      </nav>

      {/* HERO */}
      {/*
        ✏️ MODIFICA 1: h1 usa la nuova classe page-hero-title-strong (font-weight 900)
        ✏️ MODIFICA 1: <p> riscritto con beneficio concreto al posto della descrizione generica
      */}
      <section className="page-hero">
        <div className="page-hero-label">Il nostro progetto</div>
        <h1 className="page-hero-title-strong">Chi Siamo</h1>
        <p>
          Troviamo per te gli annunci sottoprezzi su Subito.it e Vinted.it —
          prima che li comprino gli altri.
        </p>
      </section>

      {/* MISSIONE + FLOW */}
      <div className="mission-section">
        <div>
          <div className="mission-label">La nostra missione</div>
          {/*
            ✏️ MODIFICA 2: "70%" avvolto in <span className="stat-highlight">
            per dargli accent color e font-size maggiore, mantenendo coerenza col design system
          */}
          <h2 className="mission-title">
            Il{' '}
            <span className="stat-highlight">70%</span>
            {' '}degli annunci ha prezzi{' '}
            <span className="highlight">sottostimati</span> del 20–50%.
            Noi li troviamo per te.
          </h2>
          <p className="mission-text">
            Su Subito.it e Vinted.it esistono ogni giorno centinaia di occasioni che vengono
            vendute al 20–50% in meno del loro valore reale. Il problema è trovarle in tempo,
            prima che lo facciano gli altri. Lepefy lo fa al posto tuo, 24 ore su 24.
          </p>
          <Link href="/abbonati" className="mission-btn">Prova Gratis →</Link>
        </div>

        <div className="flow-card">
          {FLOW.map((s, i) => (
            <div key={s.step}>
              <div className="flow-step">
                <div className="flow-num">{s.step}</div>
                <div>
                  <div className="flow-title">{s.icon} {s.title}</div>
                  <div className="flow-desc">{s.desc}</div>
                </div>
              </div>
              {i < FLOW.length - 1 && <div className="flow-connector" />}
            </div>
          ))}
        </div>
      </div>

      {/* STATISTICHE */}
      {/* ✏️ MODIFICA 3: aggiunta <div className="stat-icon"> con emoji per ogni stat */}
      <div className="stats-section">
        <div className="stats-grid">
          {STATS.map((s) => (
            <div key={s.val} className="stat-item">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-val">{s.val}</div>
              <div className="stat-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIANZE */}
      {/*
        ✏️ MODIFICA 4: aggiunto testimonial-footer con avatar iniziali dinamiche
        Il testimonial-card ora ha border-left accent (via CSS)
      */}
      <div className="testimonials-section">
        <div className="testimonials-title">Cosa dicono i nostri utenti</div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.author} className="testimonial-card">
              <div className="testimonial-quote">&ldquo;{t.quote}&rdquo;</div>
              <div className="testimonial-footer">
                <div className="testimonial-avatar">{getInitials(t.author)}</div>
                <div>
                  <div className="testimonial-author">{t.author}</div>
                  <div className="testimonial-city">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA FINALE */}
      <section className="chi-cta">
        <h2>Pronto a trovare il tuo prossimo affare?</h2>
        <p>Iscriviti alla beta e ricevi i deal 12 ore prima di tutti.</p>
        <div className="chi-cta-btns">
          <Link href="/abbonati" className="chi-cta-white">Iscriviti Gratis →</Link>
          <Link href="/deals"    className="chi-cta-outline">Vedi i deal pubblici</Link>
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
                <li><Link href="/abbonati">Iscriviti alla beta</Link></li>
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
            <span className="footer-copy">© 2026 Lepefy · Made in Italy 🇮🇹</span>
          </div>
        </div>
      </footer>
    </>
  );
}
