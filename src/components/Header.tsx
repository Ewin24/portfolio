import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Menu, X, Globe } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'
import { useTheme } from '../theme/ThemeContext'
import { BookToggle } from './book/BookToggle'
import { GithubIcon } from './ui/GithubIcon'

const NAV_ITEMS = [
  { key: 'nav.about'      as const, href: '#about' },
  { key: 'nav.projects'   as const, href: '#projects' },
  { key: 'nav.skills'     as const, href: '#skills' },
  { key: 'nav.experience' as const, href: '#experience' },
  { key: 'nav.education'  as const, href: '#education' },
  { key: 'nav.testimonials' as const, href: '#testimonials' },
  { key: 'nav.blog'       as const, href: '#blog' },
  { key: 'nav.contact'    as const, href: '#contact' },
]

export function Header() {
  const { t, lang, toggleLang } = useTranslation()
  const { theme, stillness } = useTheme()
  const reduceMotion = useReducedMotion()
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [veilRequested, setVeilRequested] = useState(false)
  const lastY = useRef(0)

  // Derived: the bar can only recede while Book is on, motion is welcome,
  // and the mobile menu is closed. Deriving it means leaving any of those
  // states never has to write the flag back through an effect.
  const veiled = veilRequested && theme === 'book' && !stillness && !mobileOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /**
   * Breathing chrome.
   *
   * Book has no HUD, and a fixed navigation bar is the loudest thing on
   * the page. So while the visitor is descending it steps back, and it
   * returns the moment they show any intent to navigate — scrolling up,
   * moving the pointer, or tabbing into it.
   *
   * It fades but never unmounts and never loses focusability: a hidden nav
   * that a keyboard cannot reach is a broken nav, not a minimal one. The
   * focusin listener is what guarantees a tabbing visitor sees where they
   * are. Under reduced motion it simply never veils.
   */
  useEffect(() => {
    if (theme !== 'book' || stillness || mobileOpen) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        setVeilRequested(y > 140 && y > lastY.current + 4)
        lastY.current = y
      })
    }
    const reveal = () => setVeilRequested(false)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', reveal, { passive: true })
    window.addEventListener('focusin', reveal)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', reveal)
      window.removeEventListener('focusin', reveal)
    }
  }, [theme, stillness, mobileOpen])

  return (
    <header
      style={{
        opacity: veiled ? 0 : 1,
        pointerEvents: veiled ? 'none' : 'auto',
        // Inline transition wins over the utility below, so the bar's own
        // scrolled-state fades are restated here instead of being dropped.
        transition:
          'opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-150 ${
        scrolled
          ? 'bg-paper border-b-2 border-rule shadow-pixel-sm'
          : 'bg-paper/90 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logotipo */}
        <a
          href="#"
          className="font-headline font-black text-lg text-ink hover:text-accent transition-colors"
        >
          {'<ET />'}
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link"
            >
              {t(item.key)}
            </a>
          ))}
        </div>

        {/* Acciones */}
        <div className="hidden md:flex items-center gap-2">
          <BookToggle />
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 border-2 border-rule px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-ink hover:bg-ink hover:text-paper transition-colors cursor-pointer"
          >
            <Globe size={12} />
            {lang.toUpperCase()}
          </button>
          <a
            href="https://github.com/Ewin24"
            target="_blank" rel="noopener noreferrer"
            className="border-2 border-rule p-1.5 text-ink hover:bg-ink hover:text-paper transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon size={16} />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-1.5 border-2 border-rule text-ink cursor-pointer"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="md:hidden bg-paper border-t-2 border-rule"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="nav-link py-1 border-b border-rule-light"
                >
                  {t(item.key)}
                </a>
              ))}
              <div className="pt-2">
                <BookToggle withLabel />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={toggleLang}
                  className="flex items-center gap-1.5 border-2 border-rule px-3 py-1 font-mono text-[10px] font-bold uppercase text-ink cursor-pointer"
                >
                  <Globe size={12} />
                  {lang.toUpperCase()}
                </button>
                <a
                  href="https://github.com/Ewin24"
                  target="_blank" rel="noopener noreferrer"
                  className="border-2 border-rule p-1.5 text-ink"
                >
                  <GithubIcon size={16} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
