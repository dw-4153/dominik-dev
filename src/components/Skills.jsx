import { useMemo, useState } from 'react'

const SKILLS = [
  // AI & AUTOMATION
  { name: 'Claude API / SDK',        category: 'ai',      level: 5 },
  { name: 'n8n',                     category: 'ai',      level: 5 },
  { name: 'OpenRouter',              category: 'ai',      level: 5 },
  { name: 'Prompt engineering',      category: 'ai',      level: 5 },
  { name: 'AI Agents',               category: 'ai',      level: 4 },
  { name: 'SEO',                     category: 'ai',      level: 3 },
  { name: 'Make.com',                category: 'ai',      level: 2 },

  // DEVELOPMENT
  { name: 'HTML',                    category: 'dev',     level: 5 },
  { name: 'JavaScript',              category: 'dev',     level: 5 },
  { name: 'CSS',                     category: 'dev',     level: 5 },
  { name: 'Tailwind CSS',            category: 'dev',     level: 5 },
  { name: 'Vite',                    category: 'dev',     level: 5 },
  { name: 'React',                   category: 'dev',     level: 4 },
  { name: 'PHP',                     category: 'dev',     level: 4 },
  { name: 'React Native + Expo',     category: 'dev',     level: 3 },
  { name: 'TypeScript',              category: 'dev',     level: 3 },
  { name: 'Node.js',                 category: 'dev',     level: 2 },
  { name: 'Python',                  category: 'dev',     level: 2 },

  // DATA & INFRA
  { name: 'Claude Code',             category: 'data',    level: 5 },
  { name: 'JSON',                    category: 'data',    level: 5 },
  { name: 'Google API',              category: 'data',    level: 5 },
  { name: 'REST API / Webhooks',     category: 'data',    level: 4 },
  { name: 'Vercel',                  category: 'data',    level: 4 },
  { name: 'Git / GitHub',            category: 'data',    level: 4 },
  { name: 'WordPress',               category: 'data',    level: 4 },
  { name: 'Supabase',                category: 'data',    level: 3 },
  { name: 'SQL',                     category: 'data',    level: 3 },
  { name: 'Shoper',                  category: 'data',    level: 3 },
  { name: 'PrestaShop',              category: 'data',    level: 3 },
  { name: 'PostgreSQL',              category: 'data',    level: 2 },

  // PRODUCT & WORKFLOW (soft skills + workflow tools)
  { name: 'Komunikacja z klientem',  category: 'product', level: 5 },
  { name: 'AI-first workflow',       category: 'product', level: 5 },
  { name: 'Pair programming',        category: 'product', level: 5 },
  { name: 'Product thinking',        category: 'product', level: 4 },
  { name: 'Dekompozycja zadań',      category: 'product', level: 4 },
  { name: 'Estymacja zadań',         category: 'product', level: 4 },
  { name: 'Adaptacja do zmian',      category: 'product', level: 4 },
  { name: 'Dokumentacja techniczna', category: 'product', level: 4 },
  { name: 'Kontrola jakości',        category: 'product', level: 4 },
  { name: 'Wymiana wiedzy',          category: 'product', level: 4 },
  { name: 'ClickUp',                 category: 'product', level: 4 },
]

const LEVEL_LABELS = {
  1: 'learning',
  2: 'basic',
  3: 'working',
  4: 'daily',
  5: 'pro',
}

const CATEGORIES = [
  { id: 'all',     label: 'all',                color: '#a0b0bf' },
  { id: 'ai',      label: 'ai & automation',    color: '#f5a623' },
  { id: 'dev',     label: 'development',        color: '#00d4ff' },
  { id: 'data',    label: 'data & infra',       color: '#a78bfa' },
  { id: 'product', label: 'product & workflow', color: '#4ade80' },
]

function colorFor(category) {
  const c = CATEGORIES.find(x => x.id === category)
  return c ? c.color : '#a0b0bf'
}

export default function Skills() {
  const [active, setActive] = useState('all')

  const counts = useMemo(() => {
    const m = { all: SKILLS.length }
    for (const s of SKILLS) m[s.category] = (m[s.category] || 0) + 1
    return m
  }, [])

  const filtered = useMemo(
    () => (active === 'all' ? SKILLS : SKILLS.filter(s => s.category === active)),
    [active]
  )

  return (
    <section className="skills-section" id="skills" aria-labelledby="skills-heading">
      <header className="section-head">
        <div className="section-head-meta">[ STACK ]</div>
        <h2 className="section-head-title" id="skills-heading">
          Czego używam<span className="section-head-title-accent">.</span>
        </h2>
        <p className="section-head-sub">
          Filtruj po kategorii. Każda umiejętność ma poziom — od <code lang="en">learning</code> po <code lang="en">pro</code>.
        </p>
      </header>

      <div className="skills-filter" role="group" aria-label="Filtruj umiejętności">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            type="button"
            aria-pressed={active === c.id}
            onClick={() => setActive(c.id)}
            className={`skills-filter-btn ${active === c.id ? 'skills-filter-btn--active' : ''}`}
            style={{ '--cat-color': c.color }}
          >
            <span className="skills-filter-dot" aria-hidden="true" />
            <span className="skills-filter-label" lang="en">{c.label}</span>
            <span className="skills-filter-count">
              [ {String(counts[c.id] || 0).padStart(2, '0')} ]
            </span>
          </button>
        ))}
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {`Wyświetlono ${filtered.length} z ${SKILLS.length} umiejętności${
          active === 'all'
            ? ''
            : ' w kategorii ' + (CATEGORIES.find(c => c.id === active)?.label || '')
        }`}
      </div>

      <ul className="skills-chips">
        {filtered.map((skill, i) => (
          <li
            key={`${skill.name}-${active}`}
            className="skills-chip"
            style={{
              '--chip-color': colorFor(skill.category),
              animationDelay: `${i * 0.025}s`,
            }}
            title={`${skill.name} — ${LEVEL_LABELS[skill.level]} (${skill.level}/5)`}
          >
            <span className="skills-chip-dot" aria-hidden="true" />
            <span className="skills-chip-name">{skill.name}</span>
            <span className="skills-chip-bars" aria-label={`Poziom: ${skill.level} z 5`}>
              {[1, 2, 3, 4, 5].map(n => (
                <span
                  key={n}
                  className={`skills-chip-bar ${n <= skill.level ? 'skills-chip-bar--filled' : ''}`}
                  aria-hidden="true"
                />
              ))}
            </span>
          </li>
        ))}
      </ul>

      <div className="skills-meta">
        <span className="skills-meta-item">
          pokazuję <strong>{filtered.length}</strong> / {SKILLS.length}
        </span>
        <span className="skills-meta-divider" aria-hidden="true">·</span>
        <span className="skills-meta-item" lang={active === 'all' ? 'en' : 'pl'}>
          {active === 'all'
            ? 'all categories'
            : CATEGORIES.find(c => c.id === active)?.label}
        </span>
        <span className="skills-meta-divider" aria-hidden="true">·</span>
        <span className="skills-meta-legend" aria-label="Skala poziomów">
          <span className="skills-legend-bars" aria-hidden="true">
            {[1, 2, 3, 4, 5].map(n => (
              <span key={n} className="skills-legend-bar" />
            ))}
          </span>
          <span lang="en">learning → pro</span>
        </span>
      </div>
    </section>
  )
}
