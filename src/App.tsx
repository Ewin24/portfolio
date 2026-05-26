import { useApp } from './context/AppContext'
import { Header } from './components/Header'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'
import { Experience } from './components/sections/Experience'
import { Testimonials } from './components/sections/Testimonials'
import { Blog } from './components/sections/Blog'
import { Contact } from './components/sections/Contact'
import { Footer } from './components/sections/Footer'
import { Loading } from './components/ui/Loading'

function App() {
  const { loading, error } = useApp()

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="border-2 border-ink shadow-pixel p-8 text-center max-w-md bg-paper">
          <div className="border-t-4 border-ink mb-1" />
          <div className="border-t border-ink mb-4" />
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent mb-2">
            Error
          </p>
          <p className="font-sans text-sm text-ink-light">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-btn px-btn-outline text-xs cursor-pointer"
          >
            Reintentar
          </button>
          <div className="border-t-4 border-ink mt-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Testimonials />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
