import { Globe } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { GithubIcon } from '../ui/GithubIcon'
import { ThemeToggle } from './ThemeToggle'

/**
 * The XP taskbar tray (design D3): the header's utilities relocated to the
 * taskbar, left of the clock — theme toggle, language switch, and the GitHub
 * link. Rendered as a single focusable toolbar so keyboard navigation flows
 * Start → window labels → tray → clock.
 */
export function Tray() {
  const { lang, toggleLang } = useTranslation()

  return (
    <div className="xp-tray" role="toolbar" aria-label="System tray">
      <ThemeToggle />
      <button
        type="button"
        onClick={toggleLang}
        className="xp-tray-btn"
        aria-label={lang.toUpperCase()}
      >
        <Globe size={12} />
        {lang.toUpperCase()}
      </button>
      <a
        href="https://github.com/Ewin24"
        target="_blank"
        rel="noopener noreferrer"
        className="xp-tray-btn"
        aria-label="GitHub"
      >
        <GithubIcon size={16} />
      </a>
    </div>
  )
}
