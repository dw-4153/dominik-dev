import { useEffect, useMemo, useRef, useState } from 'react'

/* Unified career timeline — work + education + qualifications.
   Events ordered descending (newest first). Filterable by category. */

const EVENTS = [
  {
    id: '1stplace',
    type: 'work',
    title: '1stplace',
    subtitle: 'agencja marketingowa',
    role: 'n8n Developer',
    period: 'Listopad 2025 — obecnie',
    duration: 'aktualnie',
    location: 'Poznań · hybrydowo',
    current: true,
    description: 'Projektuję automatyzacje biznesowe w n8n — systemy contentowe, integracje z CRM, web scraping pod lead generation. Równolegle opiekuję się stronami klientów: aktualizacje, bezpieczeństwo i wdrożenia treści na WordPressie oraz serwisach w czystym kodzie.',
    tags: ['n8n', 'AI Workflows', 'CRM', 'Web Scraping', 'Lead Generation', 'WordPress', 'CMS'],
  },
  {
    id: 'studia',
    type: 'edu',
    title: 'Politechnika Poznańska',
    subtitle: 'Informatyka · studia zaoczne',
    role: 'Student',
    period: '2025 — obecnie',
    duration: 'w trakcie',
    location: 'Poznań · zaocznie',
    current: true,
    description: 'Studia inżynierskie zaoczne na kierunku Informatyka. Program obejmuje algorytmikę, projektowanie i programowanie aplikacji, bazy danych, sieci komputerowe oraz podstawy systemów AI.',
    tags: ['Informatyka', 'Studia zaoczne', 'Algorytmika', 'Bazy danych'],
  },
  {
    id: 'inf04',
    type: 'cert',
    title: 'INF.04',
    subtitle: 'Projektowanie, programowanie i testowanie aplikacji',
    role: 'Kwalifikacja zawodowa',
    period: '2025',
    duration: 'zdana',
    location: 'OKE Poznań',
    description: 'Egzamin obejmuje projektowanie aplikacji użytkowych, implementację front-end i back-end (web + desktop + mobile), tworzenie i obsługę baz danych, testowanie oraz publikację gotowych aplikacji.',
    tags: ['Programowanie', 'Bazy danych', 'Testowanie', 'Front + Back'],
  },
  {
    id: 'miele',
    type: 'work',
    title: 'Miele Experience Center',
    subtitle: 'Poznań · praktyki techniczne',
    role: 'Serwisant komputerowy',
    period: 'Kwiecień 2023',
    duration: '1 miesiąc',
    location: 'Poznań',
    description: 'Diagnozowanie i naprawa usterek sprzętowych oraz programowych. Konfiguracja sieci lokalnej, utrzymanie infrastruktury IT, wsparcie techniczne dla pracowników biura.',
    tags: ['Hardware', 'Networking', 'IT Support', 'Documentation'],
  },
  {
    id: 'inf03',
    type: 'cert',
    title: 'INF.03',
    subtitle: 'Tworzenie i administrowanie stronami i aplikacjami internetowymi oraz bazami danych',
    role: 'Kwalifikacja zawodowa',
    period: '2023',
    duration: 'zdana',
    location: 'OKE Poznań',
    description: 'Egzamin obejmuje projektowanie i tworzenie stron internetowych (HTML, CSS, JS), aplikacji internetowych (PHP, frameworki), oraz administrowanie i obsługę baz danych (SQL, MySQL).',
    tags: ['HTML / CSS / JS', 'PHP', 'SQL', 'WWW + DB'],
  },
  {
    id: 'technikum',
    type: 'edu',
    title: 'Technikum Ekonomiczno-Administracyjne nr 1',
    subtitle: 'Technik programista',
    role: 'Edukacja zawodowa',
    period: '2020 — 2025',
    duration: '5 lat',
    location: 'Poznań',
    description: 'Pięcioletnie kształcenie w zawodzie technika programisty. Profil obejmował programowanie, projektowanie aplikacji i baz danych, tworzenie stron internetowych, oraz przygotowanie do dwóch kwalifikacji zawodowych: INF.03 i INF.04.',
    tags: ['Programowanie', 'WWW', 'Bazy danych', 'INF.03', 'INF.04'],
  },
]

const CATEGORIES = [
  { id: 'all',  label: 'all',           color: '#a0b0bf' },
  { id: 'work', label: 'praca',         color: '#00d4ff' },
  { id: 'edu',  label: 'edukacja',      color: '#a78bfa' },
  { id: 'cert', label: 'kwalifikacje',  color: '#4ade80' },
]

const TYPE_LABELS = {
  work: 'PRACA',
  edu:  'EDUKACJA',
  cert: 'KWALIFIKACJA',
}

const TYPE_COLORS = {
  work: '#00d4ff',
  edu:  '#a78bfa',
  cert: '#4ade80',
}

function TypeIcon({ type }) {
  if (type === 'work') {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="12" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M6 5V3.5a1 1 0 011-1h2a1 1 0 011 1V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M2 9h12" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    )
  }
  if (type === 'edu') {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
        <path d="M2 6l6-3 6 3-6 3-6-3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M4.5 7.5v3.5c1 .8 2.2 1.2 3.5 1.2s2.5-.4 3.5-1.2V7.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M14 6v3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
      <circle cx="8" cy="6.5" r="3.8" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5.5 9.5l-1.5 4 4-1.5 4 1.5-1.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M6.3 6.5l1.3 1.3 2.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function EventNode({ event, index, total }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setVisible(true), index * 80)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      clearTimeout(timer)
    }
  }, [index])

  const isLast = index === total - 1

  return (
    <div
      ref={ref}
      className={[
        'cp-event',
        `cp-event--${event.type}`,
        visible && 'cp-event--visible',
        event.current && 'cp-event--current',
      ].filter(Boolean).join(' ')}
      style={{ '--type-color': TYPE_COLORS[event.type] }}
    >
      <div className="cp-event-rail">
        <div className="cp-event-marker">
          <span className="cp-event-marker-icon" aria-hidden="true">
            <TypeIcon type={event.type} />
          </span>
          {event.current && <span className="cp-event-marker-pulse" aria-hidden="true" />}
        </div>
        {!isLast && <div className="cp-event-line" aria-hidden="true" />}
      </div>

      <article className="cp-event-card">
        <header className="cp-event-strip">
          <span className="cp-event-type-badge">
            <TypeIcon type={event.type} />
            <span>{TYPE_LABELS[event.type]}</span>
          </span>
          <span className="cp-event-period">{event.period}</span>
          {event.current && (
            <span className="cp-event-status">
              <span className="cp-event-status-dot" aria-hidden="true" />
              w trakcie
            </span>
          )}
        </header>

        <div className="cp-event-body">
          <div className="cp-event-titles">
            <h3 className="cp-event-title">
              {event.title}<span className="cp-event-title-accent">.</span>
            </h3>
            <p className="cp-event-subtitle">{event.subtitle}</p>
          </div>

          <div className="cp-event-meta">
            <div className="cp-event-meta-row">
              <span className="cp-event-meta-label">// rola</span>
              <span className="cp-event-meta-value">{event.role}</span>
            </div>
            <div className="cp-event-meta-row">
              <span className="cp-event-meta-label">// czas</span>
              <span className="cp-event-meta-value">{event.duration}</span>
            </div>
            <div className="cp-event-meta-row">
              <span className="cp-event-meta-label">// miejsce</span>
              <span className="cp-event-meta-value">{event.location}</span>
            </div>
          </div>

          <p className="cp-event-desc">{event.description}</p>

          {event.tags && event.tags.length > 0 && (
            <div className="cp-event-tags">
              {event.tags.map(t => (
                <span key={t} className="cp-event-tag">{t}</span>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  )
}

export default function CareerPreview() {
  const [active, setActive] = useState('all')

  const counts = useMemo(() => {
    const m = { all: EVENTS.length }
    for (const e of EVENTS) m[e.type] = (m[e.type] || 0) + 1
    return m
  }, [])

  const filtered = useMemo(
    () => (active === 'all' ? EVENTS : EVENTS.filter(e => e.type === active)),
    [active]
  )

  return (
    <section className="cp-page" id="experience" aria-labelledby="cp-heading">
      <header className="section-head">
        <div className="section-head-meta">[ KARIERA ]</div>
        <h2 className="section-head-title" id="cp-heading">
          Skąd jestem<span className="section-head-title-accent">.</span>
        </h2>
        <p className="section-head-sub">
          Pełna ścieżka — praca, edukacja, kwalifikacje zawodowe — w jednej chronologicznej osi. Filtruj po kategorii, żeby zobaczyć tylko wybrany typ.
        </p>
      </header>

      <div className="cp-filter" role="group" aria-label="Filtruj wpisy kariery">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            type="button"
            aria-pressed={active === c.id}
            onClick={() => setActive(c.id)}
            className={`cp-filter-btn ${active === c.id ? 'cp-filter-btn--active' : ''}`}
            style={{ '--cat-color': c.color }}
          >
            <span className="cp-filter-dot" aria-hidden="true" />
            <span className="cp-filter-label">{c.label}</span>
            <span className="cp-filter-count">[ {String(counts[c.id] || 0).padStart(2, '0')} ]</span>
          </button>
        ))}
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {`Wyświetlono ${filtered.length} ${filtered.length === 1 ? 'wpis' : 'wpisów'}${
          active === 'all' ? '' : ' w kategorii ' + (CATEGORIES.find(c => c.id === active)?.label || '')
        }`}
      </div>

      <div className="cp-timeline">
        {filtered.map((event, i) => (
          <EventNode
            key={`${event.id}-${active}`}
            event={event}
            index={i}
            total={filtered.length}
          />
        ))}
      </div>

    </section>
  )
}
