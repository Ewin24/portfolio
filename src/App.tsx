import { useState, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
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
import { Contact } from './components/sections/Contact'
import { Footer } from './components/sections/Footer'
import { BookStage } from './components/book/BookStage'
import { Loading } from './components/ui/Loading'

/**
 * The blog carries the heaviest dependencies in the app: every post body
 * (src/blog/content/posts.ts), the MiniSearch index, and the micromark
 * parser. None of it is needed to paint the Hero, and the on-page blog
 * section sits below the fold, so it loads as its own chunk.
 *
 * Both entry points below resolve to the same module, so the full-page
 * article view reuses the chunk the section already fetched.
 */
const BlogRoot = lazy(() =>
  import('./blog/BlogRoot').then((m) => ({ default: m.BlogRoot })),
)

/** Placeholder that reserves roughly the blog header height, so the
 *  surrounding layout does not jump when the chunk resolves. It carries
 *  id="blog" so the header anchor still resolves before the chunk lands. */
function BlogFallback({ minHeight, id }: { minHeight: string; id?: string }) {
  return (
    <div
      id={id}
      className="py-20 px-6 max-w-7xl mx-auto"
      style={{ minHeight }}
      aria-busy="true"
    >
      <div className="border-t-4 border-rule mb-1" />
      <div className="border-t border-rule mb-4" />
      <div className="h-10 w-64 bg-paper-dark" />
      <div className="border-t-4 border-rule mt-4" />
    </div>
  )
}

function App() {
  const { loading, error } = useApp()
  const { lang } = useTranslation()
  const reduceMotion = useReducedMotion()
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
        <div className="border-2 border-rule shadow-pixel p-8 text-center max-w-md bg-paper">
          <div className="border-t-4 border-rule mb-1" />
          <div className="border-t border-rule mb-4" />
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
          <div className="border-t-4 border-rule mt-4" />
        </div>
      </div>
    )
  }

  const fade = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: reduceMotion ? 0 : 0.2 },
  }

  return (
    <AnimatePresence
      mode="sync"
      onExitComplete={() => {
        // Scroll to #blog only when exiting full-page blog mode,
        // after the exit animation finishes and the old #blog is gone
        if (!blogMode) {
          const el = document.getElementById('blog')
          if (el) {
            el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
          }
        }
      }}
    >
      {blogMode ? (
        <motion.div key="blog-full" {...fade} className="min-h-screen bg-paper">
          {/* The article view carries the atmosphere too. Without it the page
              surface is transparent in Book and the reader gets a flat
              wash instead of a sky. No section ids exist here, so the stage
              settles on the opening chapter. */}
          <BookStage />

          {/* Back to portfolio bar */}
          <div className="chrome-bar sticky top-0 z-50 bg-paper border-b-2 border-rule">
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
          <Suspense fallback={<BlogFallback minHeight="100vh" />}>
            <BlogRoot />
          </Suspense>
        </motion.div>
      ) : (
        <motion.div key="portfolio" {...fade} className="min-h-screen bg-paper">
          {/* Book's sky, dunes and airborne sand. Renders nothing at all
              in the default newspaper theme. */}
          <BookStage />

          <a href="#main" className="skip-link">
            {lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}
          </a>
          <Header />

          {/* The atmosphere layers sit at z-0, so the readable page is lifted
              above them explicitly rather than relying on which elements
              happen to be positioned. */}
          <div className="relative z-10">
            <main id="main" tabIndex={-1}>
              <Hero />
              <About />
              <Projects />
              <Skills />
              <Experience />
              <Education />
              <Testimonials />
              <Suspense fallback={<BlogFallback minHeight="24rem" id="blog" />}>
                <BlogRoot />
              </Suspense>
              <Contact />
            </main>
            <Footer />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
