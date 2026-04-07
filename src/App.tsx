import { useApp } from './context/AppContext'
import { Header } from './components/Header'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'
import { Experience } from './components/sections/Experience'
import { Contact } from './components/sections/Contact'
import { Footer } from './components/sections/Footer'
import { Loading } from './components/ui/Loading'

function App() {
  const { loading, error } = useApp()

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-900 grid-bg">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <p className="text-neon-pink font-mono text-sm mb-2">Error</p>
          <p className="text-text-secondary">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-sm cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-900">
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
