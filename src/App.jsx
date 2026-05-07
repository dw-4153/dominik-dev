import { lazy, Suspense } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CareerPreview from './components/CareerPreview'
import ProjectsBento from './components/ProjectsBento'
import Skills from './components/Skills'
import AmbientLayer from './components/AmbientLayer'
import NeuralLayer from './components/NeuralLayer'

const Contact = lazy(() => import('./components/Contact'))

function App() {
  return (
    <>
      <a href="#main" className="skip-link">Przejdź do treści głównej</a>

      <div className="grid-bg" aria-hidden="true" />
      <div className="glow-orb" aria-hidden="true" />
      <div className="glow-orb-2" aria-hidden="true" />
      <NeuralLayer />
      <AmbientLayer />
      <Navbar />

      <main id="main" tabIndex={-1}>
        <Hero />
        <CareerPreview />
        <ProjectsBento />
        <Skills />
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
      </main>
    </>
  )
}

export default App
