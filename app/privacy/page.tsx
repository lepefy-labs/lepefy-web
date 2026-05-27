import type { Metadata } from 'next';
import Link from 'next/link';
import LogoSvg from '../_components/LogoSvg';

export const metadata: Metadata = {
  title: 'Lepefy — Privacy Policy',
  description: 'Informativa sul trattamento dei dati personali ai sensi del GDPR (Regolamento UE 2016/679).',
};

/* ── Sezioni della privacy policy ─────────────────── */
const SECTIONS = [
  {
    id: 'titolare',
    icon: '🏢',
    title: 'Titolare del Trattamento',
    content: (
      <>
        <p>
          Il titolare del trattamento dei dati personali è <strong>Lepefy</strong> (di seguito
          «Titolare»), raggiungibile all&apos;indirizzo email{' '}
          <a href="mailto:info@lepefy.it">info@lepefy.it</a>.
        </p>
        <p>
          Per qualsiasi domanda relativa al trattamento dei tuoi dati puoi scriverci in qualsiasi
          momento all&apos;indirizzo sopra indicato.
        </p>
      </>
    ),
  },
  {
    id: 'dati-raccolti',
    icon: '📋',
    title: 'Dati Personali Raccolti',
    content: (
      <>
        <p>Lepefy raccoglie i seguenti dati personali, forniti volontariamente dall&apos;utente:</p>
        <ul>
          <li>
            <strong>Indirizzo email</strong> — obbligatorio per l&apos;iscrizione al servizio e
            per l&apos;invio delle notifiche deal.
          </li>
          <li>
            <strong>Categoria di interesse</strong> — ad esempio Fotografia, Elettronica,
            Smartphone. Obbligatoria per personalizzare le notifiche.
          </li>
          <li>
            <strong>Marca / Modello preferito</strong> — opzionale, consente di affinare
            ulteriormente la selezione dei deal ricevuti.
          </li>
          <li>
            <strong>Fascia di prezzo</strong> — opzionale, filtro minimo/massimo sugli annunci
            notificati.
          </li>
        </ul>
        <p>
          Non raccogliamo dati sensibili (categorie particolari ai sensi dell&apos;art. 9 GDPR),
          dati di minori, né dati di pagamento diretti (i pagamenti vengono gestiti da provider
          terzi certificati PCI-DSS).
        </p>
      </>
    ),
  },
  {
    id: 'finalita',
    icon: '🎯',
    title: 'Finalità e Base Giuridica del Trattamento',
    content: (
      <>
        <table className="privacy-table">
          <thead>
            <tr>
              <th>Finalità</th>
              <th>Base giuridica</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Erogazione del servizio (invio notifiche deal via email)</td>
              <td>Esecuzione del contratto / consenso (art. 6 lett. b e lett. a GDPR)</td>
            </tr>
            <tr>
              <td>Personalizzazione dei deal in base alle preferenze</td>
              <td>Consenso (art. 6 lett. a GDPR)</td>
            </tr>
            <tr>
              <td>Comunicazioni di servizio (aggiornamenti, modifiche ai piani)</td>
              <td>Legittimo interesse del Titolare (art. 6 lett. f GDPR)</td>
            </tr>
            <tr>
              <td>Prevenzione di abusi e sicurezza della piattaforma</td>
              <td>Legittimo interesse del Titolare (art. 6 lett. f GDPR)</td>
            </tr>
            <tr>
              <td>Adempimenti legali e fiscali</td>
              <td>Obbligo di legge (art. 6 lett. c GDPR)</td>
            </tr>
          </tbody>
        </table>
        <p>
          Non trattiamo i tuoi dati per finalità di marketing di terze parti né li vendiamo o
          cediamo a inserzionisti.
        </p>
      </>
    ),
  },
  {
    id: 'modalita',
    icon: '⚙️',
    title: 'Modalità del Trattamento',
    content: (
      <>
        <p>
          I dati sono trattati con strumenti elettronici e conservati in modo sicuro. Per erogare
          il servizio ci avvaliamo di fornitori terzi selezionati (responsabili del trattamento ai
          sensi dell&apos;art. 28 GDPR) nelle seguenti categorie:
        </p>
        <ul>
          <li><strong>Hosting e database</strong> — archiviazione sicura dei dati di iscrizione, con server in Europa o coperti da clausole contrattuali standard (SCCs).</li>
          <li><strong>Email transazionale</strong> — invio delle notifiche deal e comunicazioni di servizio.</li>
          <li><strong>Intelligenza artificiale</strong> — valutazione automatica degli annunci pubblici. Vengono elaborati esclusivamente testi di annunci pubblicamente accessibili; nessun dato personale degli utenti Lepefy viene trasmesso a questi servizi.</li>
        </ul>
        <p>
          L&apos;elenco aggiornato dei responsabili del trattamento è disponibile su richiesta
          scrivendo a <a href="mailto:info@lepefy.it">info@lepefy.it</a>.
        </p>
      </>
    ),
  },
  {
    id: 'conservazione',
    icon: '🗓️',
    title: 'Periodo di Conservazione',
    content: (
      <>
        <ul>
          <li>
            <strong>Dati di iscrizione</strong> (email, preferenze): conservati per tutta la
            durata dell&apos;abbonamento attivo e per 12 mesi successivi alla cancellazione, salvo
            obblighi di legge.
          </li>
          <li>
            <strong>Log delle notifiche inviate</strong>: conservati per 6 mesi a fini di
            assistenza e prevenzione abusi.
          </li>
          <li>
            <strong>Dati degli annunci scansionati</strong> (da Subito.it — dati pubblici): non
            contengono dati personali degli utenti Lepefy e sono conservati per un massimo di
            30 giorni.
          </li>
        </ul>
        <p>
          Alla scadenza del periodo di conservazione i dati vengono cancellati o anonimizzati in
          modo irreversibile.
        </p>
      </>
    ),
  },
  {
    id: 'diritti',
    icon: '⚖️',
    title: 'I Tuoi Diritti',
    content: (
      <>
        <p>
          Ai sensi degli artt. 15–22 del GDPR hai diritto di:
        </p>
        <ul>
          <li><strong>Accesso</strong> — ottenere conferma che siano in corso trattamenti che ti riguardano e ricevere copia dei dati.</li>
          <li><strong>Rettifica</strong> — far correggere dati inesatti o incompleti.</li>
          <li><strong>Cancellazione</strong> («diritto all&apos;oblio») — richiedere la cancellazione dei tuoi dati.</li>
          <li><strong>Limitazione</strong> — richiedere la sospensione del trattamento in determinati casi.</li>
          <li><strong>Portabilità</strong> — ricevere i tuoi dati in formato strutturato e leggibile da macchina.</li>
          <li><strong>Opposizione</strong> — opporsi al trattamento basato sul legittimo interesse.</li>
          <li><strong>Revoca del consenso</strong> — in qualsiasi momento, senza pregiudizio per la liceità del trattamento precedente alla revoca.</li>
        </ul>
        <p>
          Per esercitare i tuoi diritti scrivi a{' '}
          <a href="mailto:info@lepefy.it">info@lepefy.it</a>. Risponderemo entro 30 giorni.
          Hai inoltre il diritto di proporre reclamo al{' '}
          <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
            Garante per la Protezione dei Dati Personali
          </a>{' '}
          (www.garanteprivacy.it).
        </p>
      </>
    ),
  },
  {
    id: 'cookie',
    icon: '🍪',
    title: 'Cookie e Tecnologie di Tracciamento',
    content: (
      <>
        <p>
          Lepefy utilizza esclusivamente cookie tecnici strettamente necessari al funzionamento
          del sito (gestione della sessione, preferenze di navigazione). Non utilizziamo cookie
          di profilazione né di tracciamento di terze parti a fini pubblicitari.
        </p>
        <p>
          Poiché non vengono utilizzati cookie non essenziali, non è richiesta la tua
          autorizzazione preventiva ai sensi della normativa ePrivacy.
        </p>
      </>
    ),
  },
  {
    id: 'sicurezza',
    icon: '🔒',
    title: 'Sicurezza dei Dati',
    content: (
      <>
        <p>
          Adottiamo misure tecniche e organizzative adeguate per proteggere i tuoi dati da
          accessi non autorizzati, perdita o divulgazione accidentale:
        </p>
        <ul>
          <li>Comunicazioni cifrate via HTTPS/TLS su tutti gli endpoint.</li>
          <li>Accesso al database limitato tramite Row Level Security (Supabase RLS).</li>
          <li>Variabili d&apos;ambiente e secret management per le credenziali di servizio.</li>
          <li>Nessuna memorizzazione di dati di pagamento sui nostri server.</li>
        </ul>
        <p>
          In caso di violazione dei dati (data breach) che comporti un rischio per i tuoi
          diritti, ti notificheremo senza ingiustificato ritardo ai sensi dell&apos;art. 34 GDPR.
        </p>
      </>
    ),
  },
  {
    id: 'modifiche',
    icon: '📝',
    title: 'Modifiche alla Presente Informativa',
    content: (
      <>
        <p>
          Questa informativa può essere aggiornata per recepire modifiche normative o evolutive
          del servizio. La versione vigente è sempre pubblicata su questa pagina con la data di
          ultimo aggiornamento. Le modifiche sostanziali vengono comunicate via email agli utenti
          iscritti con almeno 15 giorni di anticipo.
        </p>
        <p>
          <strong>Ultimo aggiornamento:</strong> Maggio 2026
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
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
      <section className="page-hero">
        <div className="page-hero-label">Trasparenza</div>
        <h1>🔒 Privacy Policy</h1>
        <p>
          Informativa sul trattamento dei dati personali ai sensi del{' '}
          <strong>Regolamento UE 2016/679 (GDPR)</strong>.
          Ultima revisione: <strong>Maggio 2026</strong>.
        </p>
      </section>

      {/* CONTENT */}
      <div className="privacy-layout">

        {/* Indice laterale — visibile solo su desktop */}
        <aside className="privacy-toc">
          <div className="privacy-toc-title">Indice</div>
          <ul className="privacy-toc-list">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="privacy-toc-link">
                  {s.icon} {s.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Corpo del documento */}
        <main className="privacy-body">
          <div className="privacy-intro-box">
            <span className="privacy-intro-icon">ℹ️</span>
            <p>
              Questa informativa descrive come Lepefy raccoglie, usa e protegge i tuoi dati
              personali. Ti invitiamo a leggerla prima di iscriverti al servizio.
            </p>
          </div>

          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="privacy-section">
              <div className="privacy-section-header">
                <span className="privacy-section-icon">{s.icon}</span>
                <h2 className="privacy-section-title">{s.title}</h2>
              </div>
              <div className="privacy-section-body">{s.content}</div>
            </section>
          ))}

          {/* CTA finale */}
          <div className="privacy-contact-box">
            <h3>Hai domande sulla tua privacy?</h3>
            <p>Scrivici — rispondiamo entro 30 giorni lavorativi.</p>
            <a href="mailto:info@lepefy.it" className="mission-btn">
              ✉️ Contatta il Titolare
            </a>
          </div>
        </main>
      </div>

      {/* Stili inline privacy-specifici */}
      <style>{`
        /* Layout */
        .privacy-layout {
          max-width: 1100px;
          margin: 0 auto;
          padding: 3rem 2rem;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 3rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .privacy-layout {
            grid-template-columns: 1fr;
            padding: 2rem 1.25rem;
            gap: 2rem;
          }
        }

        /* TOC */
        .privacy-toc {
          position: sticky;
          top: 80px;
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.25rem;
          box-shadow: var(--shadow-sm);
        }
        @media (max-width: 900px) { .privacy-toc { display: none; } }
        .privacy-toc-title {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-3);
          margin-bottom: 0.75rem;
        }
        .privacy-toc-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .privacy-toc-link {
          display: block;
          font-size: 0.78rem;
          color: var(--text-2);
          text-decoration: none;
          padding: 0.4rem 0.5rem;
          border-radius: var(--radius-sm);
          transition: background 0.15s, color 0.15s;
          line-height: 1.4;
        }
        .privacy-toc-link:hover {
          background: var(--accent-light);
          color: var(--accent);
        }

        /* Intro box */
        .privacy-intro-box {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          background: var(--accent-light);
          border: 1px solid var(--accent-border);
          border-radius: var(--radius-sm);
          padding: 1rem 1.25rem;
          margin-bottom: 2.5rem;
        }
        .privacy-intro-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 1px; }
        .privacy-intro-box p {
          font-size: 0.875rem;
          color: var(--text-2);
          line-height: 1.65;
          margin: 0;
        }

        /* Sections */
        .privacy-section {
          margin-bottom: 2.5rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid var(--border);
          scroll-margin-top: 90px;
        }
        .privacy-section:last-of-type { border-bottom: none; }

        .privacy-section-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 1rem;
        }
        .privacy-section-icon { font-size: 1.3rem; }
        .privacy-section-title {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text);
        }

        /* Body prose */
        .privacy-section-body p {
          font-size: 0.875rem;
          color: var(--text-2);
          line-height: 1.75;
          margin-bottom: 0.85rem;
        }
        .privacy-section-body p:last-child { margin-bottom: 0; }
        .privacy-section-body a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .privacy-section-body a:hover { color: var(--accent-mid); }
        .privacy-section-body strong { color: var(--text); font-weight: 600; }

        /* Listas */
        .privacy-section-body ul {
          margin: 0.75rem 0 0.85rem 0;
          padding-left: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .privacy-section-body li {
          font-size: 0.875rem;
          color: var(--text-2);
          line-height: 1.65;
        }

        /* Tabella */
        .privacy-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
          margin: 0.75rem 0 0.85rem;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .privacy-table th {
          background: var(--bg);
          font-family: var(--font-mono);
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-3);
          padding: 0.6rem 0.85rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }
        .privacy-table td {
          padding: 0.65rem 0.85rem;
          color: var(--text-2);
          border-bottom: 1px solid var(--border);
          vertical-align: top;
          line-height: 1.55;
        }
        .privacy-table tr:last-child td { border-bottom: none; }
        .privacy-table tr:nth-child(even) td { background: var(--bg); }

        /* Contact CTA */
        .privacy-contact-box {
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 2rem;
          text-align: center;
          box-shadow: var(--shadow-sm);
          margin-top: 1rem;
        }
        .privacy-contact-box h3 {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text);
          margin-bottom: 0.4rem;
        }
        .privacy-contact-box p {
          font-size: 0.875rem;
          color: var(--text-2);
          margin-bottom: 1.25rem;
        }
      `}</style>

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
            <span className="footer-copy">© 2026 Lepefy · Made in Italy 🇮🇹</span>
          </div>
        </div>
      </footer>
    </>
  );
}
