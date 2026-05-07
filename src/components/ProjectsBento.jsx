import { useEffect, useRef, useState, useCallback } from 'react'
import strona1       from '../assets/web-projects/strona1.jpg'
import strona2       from '../assets/web-projects/strona2.jpg'
import seoScheduler  from '../assets/projects/seo-content-scheduler.png'
import leadImg       from '../assets/projects/lead-enrichment.png'
import blogImg       from '../assets/projects/blog-pipeline.png'
import scheduleImg   from '../assets/projects/schedule-monitor.png'
import timi1         from '../assets/mobile/timi-1.png'
import timi2         from '../assets/mobile/timi-2.png'
import timi3         from '../assets/mobile/timi-3.png'
import timi4         from '../assets/mobile/timi-4.png'

const PROJECTS = [
  {
    id: 'igue',
    title: 'igue',
    subtitle: 'AI Overview Checker',
    type: 'web',
    image: strona2,
    desc: 'Landing z back-endem n8n. Sprawdza czy fraza generuje AI Overview w Google przez SERP API i tworzy gotową treść do CMS.',
    tags: ['React', 'n8n', 'SERP API'],
    size: 'featured',
    status: 'live',
    href: 'https://igue.vercel.app/',
    longDesc: 'Landing page z back-endem zbudowanym w n8n. Użytkownik wypełnia formularz (link do strony + fraza), a workflow przez SERP API sprawdza, czy dla danej frazy pojawia się AI Overview w Google. Jeśli tak — generuje gotową treść, którą można wkleić do CMS, żeby lepiej pozycjonować się i być cytowanym przez AI.',
    problem: 'Pozycjonowanie pod AI Overview wymaga dopasowania formatu odpowiedzi do oczekiwań algorytmu Google. Ręczne sprawdzanie dla wielu fraz było czasochłonne i niepowtarzalne.',
    solution: 'Self-service narzędzie online. Frontend React z formularzem na Vercelu, n8n na osobnym hoście orkiestruje SERP API i model AI. Użytkownik dostaje gotową treść w 30 sekund.',
    allTags: ['React', 'Vite', 'Tailwind CSS', 'n8n', 'SERP API', 'Vercel'],
  },
  {
    id: 'seo-scheduler',
    title: 'SEO Content Scheduler',
    type: 'automation',
    image: seoScheduler,
    desc: 'Multi-client engine. Trzy typy treści (blog, sponsorowane, treść na stronę) generowane według harmonogramu.',
    tags: ['n8n', 'OpenRouter', 'SEO'],
    size: 'default',
    longDesc: 'System automatycznego tworzenia treści SEO według harmonogramów dla wielu klientów jednocześnie. Obsługuje trzy typy treści w jednym przebiegu: artykuły blogowe, sponsorowane oraz treści na stronę. Workflow uruchamia się cyklicznie, iteruje po aktywnych klientach, generuje treści w pełni zgodne z wytycznymi SEO, konwertuje markdown na Google Docs i zapisuje pliki w miesięcznych folderach klienta na Drive.',
    problem: 'Produkcja treści SEO dla wielu klientów wymagała żonglowania trzema rodzajami formatów, kontrolowania harmonogramów, formatowania i ręcznego organizowania plików w Drive — przy rosnącej liczbie klientów było to nieskalowalne.',
    solution: 'Workflow w n8n startuje według harmonogramu, pobiera listę aktywnych klientów z Google Sheets, dla każdego pobiera kontekst strony i tworzy odpowiednie foldery na Drive. Trzy równoległe ścieżki (blog / treść / spon) generują treść przez OpenRouter LLM, konwertują markdown → HTML → Google Doc, czyszczą plik i aktualizują status w arkuszu — wszystko bez udziału człowieka.',
    allTags: ['n8n', 'OpenRouter', 'Google Sheets', 'Google Drive', 'Markdown → HTML', 'Schedule Trigger', 'SEO'],
  },
  {
    id: 'upperhigh',
    title: 'upperHigh',
    subtitle: 'Agencja SEO + AI Overview',
    type: 'web',
    image: strona1,
    desc: 'SaaS dla agencji content marketingowej z panelem klienta i adminem do produkcji treści.',
    tags: ['React', 'Supabase', 'PayPal'],
    size: 'default',
    status: 'wip',
    href: 'https://upperHigh.pl',
    longDesc: 'Strona marketingowa i aplikacja SaaS dla agencji content marketingowej. Klienci kupują pakiet SEO/AIO, logują się do panelu i zarządzają zamówionymi treściami. Panel admina umożliwia generowanie treści przez AI, przekazywanie ich do akceptacji klientom i zarządzanie całym procesem produkcji, w pełni zautomatyzowane.',
    problem: 'Agencje content marketingowe dostarczają klientom treści ręcznie przez e-mail i Google Doc-i, bez transparentności statusu. Skalowanie to chaos.',
    solution: 'Pełen SaaS: marketing site + panel klienta (status zamówień, akceptacje, historia) + panel admin (generowanie AI, kolejka produkcyjna, billing). Płatności przez PayPal. Auth + RLS na Supabase.',
    allTags: ['React 18', 'Vite', 'Tailwind CSS', 'Supabase', 'PayPal', 'Vercel'],
  },
  {
    id: 'timi',
    title: 'Timi',
    subtitle: 'Aplikacja randkowa invite-only',
    type: 'mobile',
    image: timi1,
    desc: 'Cross-platform app z onboardingiem, real-time chat (Stream) i monetyzacją (RevenueCat). Expo New Architecture.',
    tags: ['React Native', 'Expo', 'Supabase'],
    size: 'default',
    status: 'wip',
    longDesc: 'Ekskluzywna aplikacja randkowa w modelu invite-only. Rejestracja tylko z unikalnym kodem zaproszenia walidowanym przez Supabase RPC. Wieloetapowy onboarding z animacjami, upload zdjęć do Supabase Storage, real-time chat przez Stream Chat i monetyzacja przez RevenueCat.',
    problem: 'Aplikacje randkowe są przepełnione i mają problem z jakością użytkowników. Trzeba było zbudować zamknięty ekosystem zachęcający do wartościowych połączeń.',
    solution: 'Invite-only access z weryfikacją kodów po stronie serwera. Onboarding zaprojektowany pod retencję — animowane kroki, real-time feedback. Stack: Expo SDK 54 z New Architecture (bridgeless), Reanimated 4 do animacji, Stream Chat do messagingu, RevenueCat do subskrypcji.',
    allTags: ['React Native', 'Expo SDK 54', 'TypeScript', 'Supabase', 'Stream Chat', 'RevenueCat', 'Reanimated 4'],
    gallery: [timi1, timi2, timi3, timi4],
  },
  {
    id: 'ai-overview',
    title: 'AI Overview Content',
    type: 'automation',
    image: leadImg,
    desc: 'Workflow generujący treści cytowane przez Google AI Overview. SERP analysis + multi-model AI.',
    tags: ['n8n', 'Claude AI', 'SERP'],
    size: 'default',
    longDesc: 'System automatycznego tworzenia treści zoptymalizowanych pod Google AI Overview. Na podstawie docelowych fraz pobiera dane z SERP API, identyfikuje luki contentowe i generuje treści zaprojektowane tak, aby algorytmy Google cytowały je bezpośrednio ze strony klienta.',
    problem: 'Tworzenie treści widocznych w AI Overview wymaga precyzyjnego dopasowania formatu odpowiedzi do oczekiwań algorytmu. Ręczna obsługa każdej frazy dla wielu klientów zajmowała wiele godzin.',
    solution: 'Workflow łączy SERP API do analizy wyników, OpenRouter do doboru modelu AI i n8n jako orkiestrator. Dane klientów z Google Sheets, gotowe treści zapisywane bezpośrednio na Google Drive w dedykowanych folderach.',
    allTags: ['n8n', 'OpenRouter', 'SERP API', 'REST API', 'Claude AI', 'Google Sheets', 'Google Drive'],
  },
  {
    id: 'blog-pipeline',
    title: 'Blog Pipeline',
    type: 'automation',
    image: blogImg,
    desc: 'Automatyczne tworzenie blogów SEO według harmonogramu. Copywriter robi tylko korekty.',
    tags: ['n8n', 'Drive', 'SEO'],
    size: 'default',
    longDesc: 'System automatycznego tworzenia blogów SEO dla wielu klientów. Workflow uruchamia się według harmonogramu i przetwarza każdego klienta osobno: pobiera plan publikacji z Sheets, generuje artykuł zoptymalizowany pod wyszukiwarki i zapisuje plik na Drive.',
    problem: 'Copywriter nie wyrabiał się z liczbą klientów. Każdy artykuł wymagał pełnego zaangażowania, przez co liczba obsługiwanych klientów była ograniczona możliwościami jednej osoby.',
    solution: 'Automatyzacja przejęła tworzenie treści. Copywriter robi teraz tylko korekty gotowych artykułów, co pozwoliło kilkukrotnie zwiększyć liczbę klientów obsługiwanych miesięcznie.',
    allTags: ['n8n', 'OpenRouter', 'Google Sheets', 'Google Drive', 'Gmail', 'SEO'],
  },
  {
    id: 'schedule-monitor',
    title: 'Content Schedule Monitor',
    type: 'automation',
    image: scheduleImg,
    desc: 'Pilnuje czy klienci mają zaplanowane tematy na 3 miesiące do przodu. Auto-uzupełnia brakujące.',
    tags: ['n8n', 'Sheets', 'Web Scraping'],
    size: 'wide',
    longDesc: 'System kontrolujący harmonogramy treści wszystkich klientów jednocześnie. Workflow sprawdza, czy dla każdej pary klient+usługa zaplanowane są tematy na minimum 3 miesiące do przodu. Obsługuje trzy typy treści osobno: blogi, artykuły sponsorowane i treści na stronę.',
    problem: 'Przy dużej liczbie klientów harmonogramy regularnie wyczerpywały się niezauważone. Brak tematów blokował automatyzacje do tworzenia treści i wymagał ręcznej interwencji przy każdym kliencie.',
    solution: 'Workflow cyklicznie skanuje master sheet, analizuje bufor tematów i słów kluczowych. Jeśli wykryje brak, pobiera stronę klienta, przeprowadza analizę przez AI i automatycznie uzupełnia harmonogram, zanim luka zdąży zablokować produkcję.',
    allTags: ['n8n', 'OpenRouter', 'Google Sheets', 'Web Scraping', 'SEO'],
  },
]

const TYPE_LABELS = { automation: 'AUTOMATION', web: 'WEB', mobile: 'MOBILE' }
const TYPE_COLORS = { automation: '#f5a623', web: '#00d4ff', mobile: '#4ade80' }

function StatusDot({ status }) {
  if (!status) return null
  return (
    <span className={`bento-status bento-status--${status}`}>
      <span className="bento-status-dot" aria-hidden="true" />
      {status}
    </span>
  )
}

function BentoCard({ project, index, onOpen }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setVisible(true), index * 90)
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

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(project.id, ref.current)}
      className={[
        'bento-item',
        `bento-item--${project.size}`,
        `bento-item--type-${project.type}`,
        visible && 'bento-item--visible',
        'bento-item--linked',
      ].filter(Boolean).join(' ')}
      style={{ '--type-color': TYPE_COLORS[project.type] }}
      aria-labelledby={`bento-title-${project.id}`}
      aria-describedby={`bento-desc-${project.id}`}
    >
      <div
        className="bento-item-bg"
        style={{ backgroundImage: `url(${project.image})` }}
        aria-hidden="true"
      />
      <div className="bento-item-overlay" aria-hidden="true" />
      <div className="bento-item-grain" aria-hidden="true" />

      <div className="bento-item-top">
        <span className="bento-type-badge">
          <span className="bento-type-dot" aria-hidden="true" />
          {TYPE_LABELS[project.type]}
        </span>
        <StatusDot status={project.status} />
      </div>

      <div className="bento-item-content">
        <div className="bento-item-text">
          <span className="bento-item-title" id={`bento-title-${project.id}`}>{project.title}</span>
          {project.subtitle && (
            <p className="bento-item-subtitle">{project.subtitle}</p>
          )}
          <p className="bento-item-desc" id={`bento-desc-${project.id}`}>{project.desc}</p>
        </div>

        <div className="bento-item-foot">
          <div className="bento-item-tags">
            {project.tags.map(t => (
              <span key={t} className="bento-item-tag">{t}</span>
            ))}
          </div>
          <span className="bento-item-arrow" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </button>
  )
}

function ProjectModal({ project, onClose, returnFocusRef }) {
  const [galleryIdx, setGalleryIdx] = useState(0)
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()
    const returnTo = returnFocusRef?.current

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const root = dialogRef.current
      if (!root) return
      const focusables = root.querySelectorAll(
        'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      returnTo?.focus()
    }
  }, [onClose, returnFocusRef])

  const stop = useCallback(e => e.stopPropagation(), [])

  const heroImage = project.gallery
    ? project.gallery[galleryIdx]
    : project.image

  return (
    <div
      ref={dialogRef}
      className="bento-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${project.id}`}
      onClick={onClose}
    >
      <article
        className="bento-modal"
        onClick={stop}
        style={{ '--type-color': TYPE_COLORS[project.type] }}
      >
        <header className="bento-modal-head">
          <div className="bento-modal-head-left">
            <span className="bento-type-badge">
              <span className="bento-type-dot" aria-hidden="true" />
              {TYPE_LABELS[project.type]}
            </span>
            <StatusDot status={project.status} />
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="bento-modal-close"
            onClick={onClose}
            aria-label="Zamknij szczegóły projektu"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </header>

        <div
          className={[
            'bento-modal-hero',
            project.type === 'web' && 'bento-modal-hero--scrolling',
            project.type === 'mobile' && 'bento-modal-hero--mobile',
          ].filter(Boolean).join(' ')}
        >
          {project.type === 'mobile' && (
            <div
              className="bento-modal-hero-backdrop"
              style={{ backgroundImage: `url(${heroImage})` }}
              aria-hidden="true"
            />
          )}
          <img
            src={heroImage}
            alt=""
            className="bento-modal-hero-img"
            loading="lazy"
            decoding="async"
          />
          <div className="bento-modal-hero-fade" aria-hidden="true" />
          {project.gallery && project.gallery.length > 1 && (
            <div className="bento-modal-thumbs">
              {project.gallery.map((g, i) => (
                <button
                  key={i}
                  type="button"
                  className={`bento-modal-thumb ${i === galleryIdx ? 'bento-modal-thumb--active' : ''}`}
                  onClick={() => setGalleryIdx(i)}
                  aria-label={`Pokaż obraz ${i + 1} z ${project.gallery.length}`}
                  aria-pressed={i === galleryIdx}
                >
                  <img src={g} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bento-modal-body">
          <div className="bento-modal-titles">
            <h2 className="bento-modal-title" id={`modal-title-${project.id}`}>
              {project.title}
            </h2>
            {project.subtitle && (
              <p className="bento-modal-subtitle">{project.subtitle}</p>
            )}
          </div>

          {project.longDesc && (
            <p className="bento-modal-lead">{project.longDesc}</p>
          )}

          <div className="bento-modal-breakdown">
            {project.problem && (
              <section className="bento-modal-section">
                <span className="bento-modal-label bento-modal-label--problem">[ PROBLEM ]</span>
                <p className="bento-modal-text">{project.problem}</p>
              </section>
            )}
            {project.solution && (
              <section className="bento-modal-section">
                <span className="bento-modal-label bento-modal-label--solution">[ ROZWIĄZANIE ]</span>
                <p className="bento-modal-text">{project.solution}</p>
              </section>
            )}
          </div>

          <div className="bento-modal-stack">
            <span className="bento-modal-stack-label">[ STACK ]</span>
            <div className="bento-modal-stack-tags">
              {(project.allTags || project.tags).map(t => (
                <span key={t} className="bento-modal-tag">{t}</span>
              ))}
            </div>
          </div>

          {project.href && (
            <div className="bento-modal-actions">
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bento-modal-cta"
                aria-label={`Otwórz live demo ${project.title} w nowej karcie`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                otwórz live demo
              </a>
              <span className="bento-modal-url">{project.href.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}

export default function ProjectsBento() {
  const [selectedId, setSelectedId] = useState(null)
  const returnFocusRef = useRef(null)
  const selected = PROJECTS.find(p => p.id === selectedId) || null

  const open = useCallback((id, triggerEl) => {
    returnFocusRef.current = triggerEl
    setSelectedId(id)
  }, [])
  const close = useCallback(() => setSelectedId(null), [])

  return (
    <>
      <section className="bento-page" id="projects" aria-labelledby="bento-heading">
        <header className="section-head">
          <div className="section-head-meta">[ PROJEKTY ]</div>
          <h2 className="section-head-title" id="bento-heading">
            Co zbudowałem<span className="section-head-title-accent">.</span>
          </h2>
          <p className="section-head-sub">
            Automatyzacje, aplikacje webowe i mobilne w jednej spójnej siatce. Kliknij na kafel, żeby zobaczyć pełen case study — problem, rozwiązanie i stack.
          </p>
        </header>

        <div className="bento-grid">
          {PROJECTS.map((p, i) => (
            <BentoCard key={p.id} project={p} index={i} onOpen={open} />
          ))}
        </div>

        <footer className="bento-footer">
          <span>{PROJECTS.length} projektów · automation · web · mobile</span>
        </footer>
      </section>

      {selected && (
        <ProjectModal
          project={selected}
          onClose={close}
          returnFocusRef={returnFocusRef}
        />
      )}
    </>
  )
}
