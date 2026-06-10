import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useApp } from './context/AppContext'
import { useTranslation } from './hooks/useTranslation'
import { Header } from './components/Header'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'
import { Experience } from './components/sections/Experience'
import { Education } from './components/sections/Education'
import { Testimonials } from './components/sections/Testimonials'
import { Blog } from './components/sections/BlogRoot'
import { Contact } from './components/sections/Contact'
import { Footer } from './components/sections/Footer'
import { Loading } from './components/ui/Loading'
import { BlogRoot } from './blog/BlogRoot'

function App() {
  const { loading, error } = useApp()
  const { lang } = useTranslation()
  const [blogMode, setBlogMode] = useState(false)

  // Watch hash changes for blog full-page mode
  useEffect(() => {
    const check = () => {
      const hash = window.location.hash
      // Enter blog mode when hash is #blog/article/<slug>
      setBlogMode(hash.startsWith('#blog/article/'))
    }
    check()
    window.addEventListener('hashchange', check)
    window.addEventListener('popstate', check)
    return () => {
      window.removeEventListener('hashchange', check)
      window.removeEventListener('popstate', check)
    }
  }, [])

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
    <AnimatePresence
      mode="sync"
      onExitComplete={() => {
        // Scroll to #blog only when exiting full-page blog mode,
        // after the exit animation finishes and the old #blog is gone
        if (!blogMode) {
          const el = document.getElementById('blog')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }
      }}
    >
      {blogMode ? (
        <motion.div
          key="blog-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen bg-paper"
        >
          {/* Back to portfolio bar */}
          <div className="sticky top-0 z-50 bg-paper border-b-2 border-ink">
            <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
              <button
                onClick={() => {
                  history.pushState(null, '', '#blog')
                  window.dispatchEvent(new HashChangeEvent('hashchange'))
                }}
                className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-accent transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                {lang === 'es' ? 'Volver al portfolio' : 'Back to portfolio'}
              </button>
              <span className="font-mono text-[9px] text-ink-muted uppercase tracking-widest">
                Blog
              </span>
            </div>
          </div>

          {/* Full-page blog content */}
          <BlogRoot />
        </motion.div>
      ) : (
        <motion.div
          key="portfolio"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen bg-paper"
        >
          <Header />
          <main>
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Experience />
            <Education />
            <Testimonials />
            <Blog />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
