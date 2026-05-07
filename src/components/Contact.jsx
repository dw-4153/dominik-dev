import { useState, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'

const EMAILJS_PUBLIC_KEY = 'ph3Q2MGtSBFbv6ITB'
const EMAILJS_SERVICE_ID = 'service_q05tvwc'
const EMAILJS_TEMPLATE_ID = 'template_fqo37qg'

const COOLDOWN_KEY = 'contact_last_sent'
const COOLDOWN_MS = 60_000
const TIMEOUT_MS = 12_000
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error | cooldown
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({ from_name: '', from_email: '', message: '' })

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY)
  }, [])

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    if (!form.from_name.trim()) return 'Podaj imię lub nazwę firmy.'
    if (!EMAIL_REGEX.test(form.from_email.trim())) return 'Nieprawidłowy adres email.'
    if (form.message.trim().length < 10) return 'Wiadomość jest za krótka (minimum 10 znaków).'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    const botField = formRef.current?.elements?.website?.value
    if (botField) return

    const last = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10)
    if (Date.now() - last < COOLDOWN_MS) {
      setErrorMsg('Poczekaj chwilę przed kolejną próbą wysłania.')
      setStatus('cooldown')
      return
    }

    const err = validate()
    if (err) {
      setErrorMsg(err)
      setStatus('error')
      return
    }

    setErrorMsg('')
    setStatus('sending')

    try {
      await Promise.race([
        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
        ),
      ])
      localStorage.setItem(COOLDOWN_KEY, Date.now().toString())
      setStatus('sent')
      setForm({ from_name: '', from_email: '', message: '' })
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('EmailJS error:', err)
      }
      setErrorMsg('Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz bezpośrednio na podany adres email.')
      setStatus('error')
    }
  }

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-heading">
      <div className="contact-inner">
        <div className="contact-left">
          <header className="section-head">
            <div className="section-head-meta">[ KONTAKT ]</div>
            <h2 className="section-head-title" id="contact-heading">
              Zacznijmy współpracę<span className="section-head-title-accent">.</span>
            </h2>
            <p className="section-head-sub">
              Jeśli szukasz kogoś do automatyzacji procesów, budowy aplikacji lub strony internetowej — napisz. Odpiszę w ciągu 24 godzin.
            </p>
          </header>
          <a
            href="mailto:dominikwojciechowski10@gmail.com"
            className="contact-email"
            aria-label="Wyślij email na dominikwojciechowski10@gmail.com"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 3l5 3.5L11 3M1 3h10v7H1V3z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            dominikwojciechowski10@gmail.com
          </a>

          <div className="contact-socials">
            <span className="contact-socials-label">[ social ]</span>
            <a
              className="contact-social"
              href="https://www.instagram.com/wojciechowski.q/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram (otwiera się w nowej karcie)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6"/>
                <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor"/>
              </svg>
              <span>instagram</span>
            </a>
            <a
              className="contact-social"
              href="https://github.com/dw-4153"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (otwiera się w nowej karcie)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.8c.85 0 1.71.11 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"
                  fill="currentColor"
                />
              </svg>
              <span>github</span>
            </a>
          </div>
        </div>

        <form className="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate>
          {/* Honeypot — ukryte pole; boty wypełniają wszystko, ludzie nie widzą */}
          <div
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
            aria-hidden="true"
          >
            <label htmlFor="contact-website">Website (zostaw puste)</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="contact-field">
            <label className="contact-label" htmlFor="contact-name">[ imię lub firma ]</label>
            <input
              className="contact-input"
              id="contact-name"
              type="text"
              name="from_name"
              autoComplete="name"
              value={form.from_name}
              onChange={handleChange}
              placeholder="Jan Kowalski"
              required
              aria-required="true"
            />
          </div>

          <div className="contact-field">
            <label className="contact-label" htmlFor="contact-email">[ adres email ]</label>
            <input
              className="contact-input"
              id="contact-email"
              type="email"
              name="from_email"
              autoComplete="email"
              value={form.from_email}
              onChange={handleChange}
              placeholder="jan@firma.pl"
              required
              aria-required="true"
            />
          </div>

          <div className="contact-field">
            <label className="contact-label" htmlFor="contact-message">[ wiadomość ]</label>
            <textarea
              className="contact-input contact-textarea"
              id="contact-message"
              name="message"
              autoComplete="off"
              value={form.message}
              onChange={handleChange}
              placeholder="Opisz projekt lub czego szukasz..."
              rows={5}
              required
              aria-required="true"
              minLength={10}
            />
          </div>

          <button
            className="contact-submit"
            type="submit"
            disabled={status === 'sending' || status === 'sent'}
          >
            {status === 'idle' && <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 1l10 5-10 5V7l7-1-7-1V1z" fill="currentColor"/>
              </svg>
              wyślij wiadomość
            </>}
            {status === 'sending'  && '[ wysyłanie... ]'}
            {status === 'sent'     && '[ wiadomość wysłana ]'}
            {status === 'error'    && '[ spróbuj ponownie ]'}
            {status === 'cooldown' && '[ poczekaj chwilę ]'}
          </button>

          <div role="status" aria-live="polite" className="sr-only">
            {status === 'sending' && 'Wysyłanie wiadomości...'}
            {status === 'sent' && 'Wiadomość została wysłana. Odpowiem w ciągu 24 godzin.'}
          </div>
          <div role="alert" aria-live="assertive" className="sr-only">
            {(status === 'error' || status === 'cooldown') && errorMsg}
          </div>

          {(status === 'error' || status === 'cooldown') && errorMsg && (
            <p className="contact-error">{errorMsg}</p>
          )}
        </form>
      </div>
    </section>
  )
}
