import { BookOpen, Newspaper } from 'lucide-react'
import { useTheme } from '../../theme/ThemeContext'
import { useTranslation } from '../../hooks/useTranslation'
import { preloadBook } from './preload'

interface Props {
  /** Mobile menu shows the full label; the header bar shows the icon only. */
  withLabel?: boolean
}

/**
 * The one click that changes everything.
 *
 * Deliberately not a dark-mode switch: it swaps an entire design language,
 * so it announces itself with aria-pressed and a label that names the
 * destination rather than the current state.
 */
export function BookToggle({ withLabel = false }: Props) {
  const { theme, toggleTheme } = useTheme()
  const { lang } = useTranslation()
  const reading = theme === 'book'

  const label = reading
    ? lang === 'es' ? 'Volver al periódico' : 'Back to the newspaper'
    : lang === 'es' ? 'Abrir el libro' : 'Open the book'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      onPointerEnter={preloadBook}
      onFocus={preloadBook}
      aria-pressed={reading}
      aria-label={label}
      title={label}
      className="flex items-center gap-1.5 border-2 border-rule px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-ink hover:bg-ink hover:text-paper transition-colors cursor-pointer"
    >
      {reading ? <Newspaper size={12} /> : <BookOpen size={12} />}
      {withLabel && <span>{label}</span>}
    </button>
  )
}
