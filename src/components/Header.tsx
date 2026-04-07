import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'
import { GithubIcon } from './ui/GithubIcon'

const NAV_ITEMS = [
  { key: 'nav.about' as const, href: '#about' },
  { key: 'nav.projects' as const, href: '#projects' },
  { key: 'nav.skills' as const, href: '#skills' },
  { key: 'nav.experience' as const, href: '#experience' },
  { key: 'nav.contact' as const, href: '#contact' },
]

export function Header() {
  const { t, lang, toggleLang } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-surface-900/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-xl font-bold gradient-text">
          {'<ET />'}
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-text-secondary hover:text-neon-cyan transition-colors text-sm font-medium"
            >
              {t(item.key)}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass glass-hover text-xs font-mono text-text-secondary hover:text-neon-cyan transition-colors cursor-pointer"
          >
            <Globe size={14} />
            {lang.toUpperCase()}
          </button>
          <a
            href="https://github.com/Ewin24"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full glass glass-hover text-text-secondary hover:text-neon-cyan transition-colors"
          >
            <GithubIcon size={18} />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-text-secondary cursor-pointer"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-surface-600/30"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-text-secondary hover:text-neon-cyan transition-colors text-sm"
                >
                  {t(item.key)}
                </a>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-surface-600/30">
                <button
                  onClick={toggleLang}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-mono text-text-secondary cursor-pointer"
                >
                  <Globe size={14} />
                  {lang.toUpperCase()}
                </button>
                <a
                  href="https://github.com/Ewin24"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full glass text-text-secondary"
                >
                  <GithubIcon size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
