import { useEffect, useRef, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const burgerRef = useRef(null)
  const firstMobileLinkRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstMobileLinkRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        burgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <nav
        className={`nav ${scrolled ? 'scrolled' : ''}`}
        aria-label="Główna nawigacja"
      >
        <div className="nav-logo">
          <span aria-hidden="true">~/</span>dominik.dev
        </div>
        <ul className="nav-links">
          <li><a href="#experience">[ doświadczenie ]</a></li>
          <li><a href="#projects">[ projekty ]</a></li>
          <li><a href="#skills">[ stack ]</a></li>
          <li><a href="#contact" className="nav-cta">[ kontakt ]</a></li>
        </ul>
        <button
          ref={burgerRef}
          type="button"
          className={`nav-burger ${open ? 'nav-burger--open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`nav-mobile ${open ? 'nav-mobile--open' : ''}`}
        aria-hidden={!open}
        {...(!open ? { inert: '' } : {})}
      >
        <a href="#experience" onClick={close} ref={firstMobileLinkRef}>[ doświadczenie ]</a>
        <a href="#projects" onClick={close}>[ projekty ]</a>
        <a href="#skills" onClick={close}>[ stack ]</a>
        <a href="#contact" onClick={close} className="nav-mobile-cta">[ kontakt ]</a>
      </div>
      {open && (
        <button
          type="button"
          className="nav-overlay"
          onClick={close}
          aria-label="Zamknij menu"
        />
      )}
    </>
  )
}
