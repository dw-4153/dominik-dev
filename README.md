# Dominik Wojciechowski — portfolio

Osobiste portfolio: prezentacja doświadczenia, projektów (automatyzacje n8n, aplikacje webowe i mobilne) oraz stacku technologicznego. Single-page application z animowanymi sekcjami, modalami case study i formularzem kontaktowym.

 **Live:** [dominik-dev.vercel.app](https://dominik-dev.vercel.app/) 

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

---

## Struktura sekcji

1. **Hero** — imię + 3 karty „what I do" (automation · web · AI Claude Code) + interaktywny n8n workflow
2. **Kariera** — chronologiczna oś czasu (praca + edukacja + kwalifikacje INF.03/INF.04), filtrowanie po kategorii
3. **Projekty** — bento grid z modalami case study (problem · rozwiązanie · stack)
4. **Stack** — chipy umiejętności z 5-stopniowymi paskami poziomu, filtrowanie po kategorii
5. **Kontakt** — formularz EmailJS + email + social
   
