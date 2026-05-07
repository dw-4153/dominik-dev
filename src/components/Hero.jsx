import HeroWorkflow from './HeroWorkflow'

export default function Hero() {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-name">
      <div className="hero-grid">
        <div className="hero-content">
          <h1 className="hero-name" id="hero-name">
            Dominik<br /><span className="accent">Wojciechowski</span>
          </h1>

          <p className="hero-role">
            <span className="bracket">[</span>&nbsp;automation&nbsp;
            <span className="bracket">·</span>&nbsp;web&nbsp;
            <span className="bracket">·</span>&nbsp;AI Claude Code&nbsp;
            <span className="bracket">]</span>
          </p>

          <p className="hero-desc">
            Projektuję i buduję: automatyzacje, aplikacje webowe i mobilne. Łączę narzędzia AI z kodem pisanym przez Claude&nbsp;Code, żeby dostarczać produkty szybciej i mądrzej.
          </p>

          <div className="what-i-do">
            <div className="wid-card">
              <span className="wid-label">[ AUTOMATYZACJE ]</span>
              <span className="wid-desc">Workflow w n8n i Make.com, integracje API, agenty AI działające bez nadzoru</span>
            </div>
            <div className="wid-card">
              <span className="wid-label">[ APLIKACJE WEB ]</span>
              <span className="wid-desc">Własne projekty webowe budowane z Claude Code, od pomysłu do wdrożenia</span>
            </div>
            <div className="wid-card">
              <span className="wid-label">[ AI · CLAUDE CODE ]</span>
              <span className="wid-desc">Wdrażanie i używanie Claude Code w codziennej pracy: integracje, agenty AI, automatyzacja zadań developerskich</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <HeroWorkflow />
        </div>
      </div>

      <div className="scroll-hint">SCROLL</div>
    </section>
  )
}
