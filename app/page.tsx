import Link from 'next/link';
import LogoSvg from './_components/LogoSvg';
import { HeroWaitlistForm, CTAWaitlistForm } from './_components/WaitlistForm';

export default function HomePage() {
  return (
    <>
      {/* NAV */}
      <nav>
        <div className="logo-svg">
          <LogoSvg />
        </div>
        <div className="nav-pill">Beta · Lista d&apos;attesa</div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-tag">Deal scanner AI · Marketplace italiani</div>
          <h1>
            Trova le <span className="highlight">occasioni</span>
            <br />
            prima degli altri
          </h1>
          <p className="hero-sub">
            Lepefy scansiona Subito, eBay, Facebook Marketplace e Wallapop in tempo reale.
            L&apos;AI analizza ogni annuncio e ti segnala solo i prezzi davvero sottostimati.
          </p>

          <HeroWaitlistForm />
        </div>

        {/* MOCKUP */}
        <div className="mockup">
          <div className="mockup-bar">
            <div className="mockup-dots">
              <span />
              <span />
              <span />
            </div>
            <div className="mockup-title">lepefy · scansione attiva</div>
            <div className="mockup-status">live</div>
          </div>
          <div className="mockup-body">
            <div className="deal-card featured">
              <div className="deal-emoji">📷</div>
              <div className="deal-info">
                <div className="deal-name">Sony A7 III + 28-70mm</div>
                <div className="deal-meta">subito.it · 3 min fa · Milano</div>
              </div>
              <div className="deal-score">
                <div className="deal-pct">−38%</div>
                <div className="deal-badge">AFFARONE</div>
              </div>
            </div>
            <div className="deal-card">
              <div className="deal-emoji">💻</div>
              <div className="deal-info">
                <div className="deal-name">MacBook Air M2 · 16GB</div>
                <div className="deal-meta">facebook · 11 min fa · Roma</div>
              </div>
              <div className="deal-score">
                <div className="deal-pct">−27%</div>
                <div className="deal-badge">BUONO</div>
              </div>
            </div>
            <div className="deal-card">
              <div className="deal-emoji">🎧</div>
              <div className="deal-info">
                <div className="deal-name">Sennheiser HD 650</div>
                <div className="deal-meta">ebay.it · 18 min fa</div>
              </div>
              <div className="deal-score">
                <div className="deal-pct">−21%</div>
                <div className="deal-badge">BUONO</div>
              </div>
            </div>
            <div className="deal-card">
              <div className="deal-emoji">📻</div>
              <div className="deal-info">
                <div className="deal-name">Cambridge Audio AXR100</div>
                <div className="deal-meta">wallapop · 25 min fa</div>
              </div>
              <div className="deal-score">
                <div className="deal-pct neutral">−8%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOURCES */}
      <div className="sources-section">
        <div className="sources-inner">
          <div className="sources-label">Fonti monitorate</div>
          <div className="sources-pills">
            <div className="source-pill">Subito.it</div>
            <div className="source-pill">eBay Italia</div>
            <div className="source-pill">Facebook Marketplace</div>
            <div className="source-pill">Wallapop</div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-label">Come funziona</div>
        <div className="section-title">
          Tutto quello che ti serve
          <br />
          per non perdere un&apos;occasione
        </div>
        <div className="features-grid">
          <div className="feat">
            <div className="feat-icon-wrap">🔍</div>
            <h3>Scansione continua</h3>
            <p>
              Monitoriamo Subito, eBay, Facebook e Wallapop ogni pochi minuti. Nessun annuncio ti
              sfugge, anche quelli che spariscono in ore.
            </p>
          </div>
          <div className="feat">
            <div className="feat-icon-wrap">🧠</div>
            <h3>Valutazione AI del prezzo</h3>
            <p>
              L&apos;AI confronta ogni annuncio con centinaia di listing simili e calcola il valore
              reale di mercato. Vedi subito quanto stai risparmiando.
            </p>
          </div>
          <div className="feat">
            <div className="feat-icon-wrap">🔔</div>
            <h3>Alert istantanei</h3>
            <p>
              Configura le categorie che ti interessano e ricevi una notifica appena compare
              un&apos;occasione. Arriva sempre prima dei competitor.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-section">
        <div className="stat">
          <div className="stat-val">4</div>
          <div className="stat-desc">Marketplace</div>
        </div>
        <div className="stat">
          <div className="stat-val">24/7</div>
          <div className="stat-desc">Scansione</div>
        </div>
        <div className="stat">
          <div className="stat-val">AI</div>
          <div className="stat-desc">Valutazione</div>
        </div>
        <div className="stat">
          <div className="stat-val">∞</div>
          <div className="stat-desc">Categorie</div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>
            Smetti di guardare partire
            <br />
            le <em>occasioni</em>.
          </h2>
          <p>I migliori annunci spariscono in minuti. Lepefy ti avvisa per primo.</p>
          <CTAWaitlistForm />
        </div>
      </section>

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
