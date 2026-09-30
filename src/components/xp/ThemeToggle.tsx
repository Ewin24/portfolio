import { Monitor, Newspaper } from 'lucide-react'
import { useTheme } from '../../theme/ThemeContext'
import { useTranslation } from '../../hooks/useTranslation'

interface ThemeToggleProps {
  /** The mobile menu shows the full label; the header bar shows the icon only. */
  withLabel?: boolean
}

/**
 * The one click that changes the whole design language.
 *
 * Announces itself with aria-pressed and a label that names the destination
 * rather than the current state: when reading the newspaper it offers the
 * XP desktop, and vice-versa. Replaces the old Book toggle.
 */
export function ThemeToggle({ withLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const { lang } = useTranslation()
  const xp = theme === 'xp'

  const label = xp
    ? lang === 'es' ? 'Volver al periódico' : 'Back to the newspaper'
    : lang === 'es' ? 'Abrir Windows XP' : 'Open Windows XP'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={xp}
      aria-label={label}
      title={label}
      className="flex items-center gap-1.5 border-2 border-rule px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-ink hover:bg-ink hover:text-paper transition-colors cursor-pointer"
    >
      {xp ? <Newspaper size={12} /> : <Monitor size={12} />}
      {withLabel && <span>{label}</span>}
    </button>
  )
}
