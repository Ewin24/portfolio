import { useState, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Menu, X, Globe, Moon, Sun } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'
import { GithubIcon } from './ui/GithubIcon'
import { ThemeToggle } from './xp/ThemeToggle'
import { ReadingProgress } from './ui/ReadingProgress'
import { useTheme } from '../theme/ThemeContext'

const NAV_ITEMS = [
  { key: 'nav.about'      as const, href: '#about' },
  { key: 'nav.projects'   as const, href: '#projects' },
  { key: 'nav.skills'     as const, href: '#skills' },
  { key: 'nav.experience' as const, href: '#experience' },
  { key: 'nav.education'  as const, href: '#education' },
  { key: 'nav.blog'       as const, href: '#blog' },
  { key: 'nav.contact'    as const, href: '#contact' },
]

/**
 * Light ⇄ dark newspaper. Separate from the XP toggle on purpose: that one
 * changes the whole design language, this one only the paper and the ink.
 * The name states what the switch is, and aria-pressed says whether it is on.
 */
export function DarkToggle({ withLabel = false }: { withLabel?: boolean }) {
  const { theme, toggleDark } = useTheme()
  const { lang } = useTranslation()
  const dark = theme === 'dark'
  const label = lang === 'es' ? 'Modo oscuro' : 'Dark mode'

  return (
    <button
      type="button"
      onClick={toggleDark}
      aria-pressed={dark}
      aria-label={label}
      title={label}
      className="dark-toggle flex items-center gap-1.5 border-2 border-rule px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-ink shadow-pixel-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 cursor-pointer"
    >
      {dark ? <Sun size={12} /> : <Moon size={12} />}
      {withLabel && <span>{label}</span>}
    </button>
  )
}

export function Header() {
  const { t, lang, toggleLang } = useTranslation()
  const reduceMotion = useReducedMotion()
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`xp-header fixed top-0 left-0 right-0 z-50 transition-all duration-150 ${
        scrolled
          ? 'bg-paper border-b-2 border-rule shadow-pixel-sm'
          : 'bg-paper'
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
          <DarkToggle />
          <ThemeToggle />
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
          aria-expanded={mobileOpen}
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
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <DarkToggle withLabel />
                <ThemeToggle withLabel />
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
                  aria-label="GitHub"
                >
                  <GithubIcon size={16} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ReadingProgress />
    </header>
  )
}
