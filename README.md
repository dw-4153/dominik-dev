# Dominik Wojciechowski — portfolio

Osobiste portfolio: prezentacja doświadczenia, projektów (automatyzacje n8n, aplikacje webowe i mobilne) oraz stacku technologicznego. Single-page application z animowanymi sekcjami, modalami case study i formularzem kontaktowym.

🌐 **Live:** [dominik-dev.vercel.app](https://dominik-dev.vercel.app/) *(po deployu)*

---

## Stack

### Frontend
- **React 19** — funkcyjne komponenty, Suspense, lazy loading
- **Vite 8** — bundler, dev server, build optimization (manualChunks: react-vendor / emailjs)
- **Vanilla CSS** — custom properties, grid, ~2300 linii responsywnych styli (mobile-first), brak Tailwinda

### Animacje i grafika
- **Canvas 2D API** — animowana sieć cząsteczek (`NeuralLayer`) z bucketingiem stroke calls i pauzą na `visibilitychange`
- **CSS animations** — keyframes, `prefers-reduced-motion` respektowane globalnie
- **SVG** — ikony, n8n-style workflow visualization w hero

### Komunikacja
- **EmailJS** — formularz kontaktowy bez backendu (z honeypot, cooldown localStorage 60 s, timeout 12 s, walidacją JS)

### A11y / SEO / Bezpieczeństwo
- **WCAG 2.2 AA** — focus trap w modalu, skip link, aria-live regions, kontrast ≥4.5:1, touch targets ≥32 px na mobile
- **SEO** — Open Graph, Twitter Card, JSON-LD `Person` schema, canonical, sitemap, robots.txt
- **CSP + HSTS** — headers w `vercel.json`
- **RODO** — klauzula informacyjna pod formularzem kontaktowym

### Tooling
- **ESLint 9** (flat config) z `react-hooks` + `react-refresh`
- **Puppeteer** (devDep) — generator faviconów w `scripts/generate-favicons.mjs`

---

## Struktura sekcji

1. **Hero** — imię + 3 karty „what I do" (automation · web · AI Claude Code) + interaktywny n8n workflow
2. **Kariera** — chronologiczna oś czasu (praca + edukacja + kwalifikacje INF.03/INF.04), filtrowanie po kategorii
3. **Projekty** — bento grid z modalami case study (problem · rozwiązanie · stack)
4. **Stack** — chipy umiejętności z 5-stopniowymi paskami poziomu, filtrowanie po kategorii
5. **Kontakt** — formularz EmailJS + email + social

---

## Komendy

```bash
npm install           # instalacja dependencies
npm run dev           # dev server (http://localhost:5173)
npm run build         # production build → dist/
npm run preview       # podgląd builda lokalnie
npm run lint          # ESLint

node scripts/generate-favicons.mjs   # regeneracja faviconów z public/favicon.svg
```

---

## Struktura katalogów

```
.
├── index.html              # entry point (meta SEO, OG, JSON-LD, font preload)
├── public/                 # statyczne assety (favicony, robots.txt, sitemap.xml)
├── src/
│   ├── main.jsx            # React mount
│   ├── App.jsx             # routing, layout, lazy(Contact)
│   ├── index.css           # globalne style + a11y utilities
│   ├── components/
│   │   ├── Navbar.jsx          # sticky nav + mobile menu (focus trap, inert)
│   │   ├── Hero.jsx + HeroWorkflow.jsx
│   │   ├── CareerPreview.jsx   # timeline z filtrami
│   │   ├── ProjectsBento.jsx   # bento grid + modal
│   │   ├── Skills.jsx          # chips z poziomami
│   │   ├── Contact.jsx         # form (lazy loaded)
│   │   ├── AmbientLayer.jsx    # dekoracyjne tło (DOM)
│   │   └── NeuralLayer.jsx     # canvas particle mesh
│   └── assets/             # obrazy projektów (zoptymalizowane)
├── scripts/
│   └── generate-favicons.mjs   # SVG → PNG-i
├── vercel.json             # security headers, rewrites, cache rules
├── vite.config.js          # build config (target es2020, manualChunks)
└── eslint.config.js
```

---

## Deployment

Projekt skonfigurowany pod **Vercel** (`vercel.json` zawiera headers + SPA rewrites). Działa też na Netlify po przepisaniu konfiguracji do `netlify.toml`.

Przed deployem:
1. Podmień `https://dominik-dev.vercel.app/` na docelową domenę w `index.html`, `public/sitemap.xml`, `public/robots.txt`, `vercel.json`
2. Wygeneruj `public/og-image.png` (1200×630) — używany w Open Graph i Twitter Card
3. W panelu EmailJS ustaw Allowed Origins na docelową domenę

---

## Licencja

All rights reserved. Kod udostępniony do wglądu — nie do redystrybucji bez zgody autora.
# dominik.dev
