import { useTheme } from '../../theme/ThemeContext'
import { useTranslation } from '../../hooks/useTranslation'
import { CHAPTERS } from '../../theme/chapters'

interface Props {
  /** The functional name of the section. Always shown. */
  title: string
  subtitle?: string
  /**
   * DOM id of the section this opens, used to find its chapter.
   * Omit for a section the book has no chapter for.
   */
  section?: string
  /**
   * Newspaper only: `beside` sets the subtitle right-aligned next to the
   * headline, which is how Projects and Skills already read.
   */
  align?: 'below' | 'beside'
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

/**
 * How a section announces itself, in whichever publication is running.
 *
 * This is the component that stops the book from being a re-skin. Colour
 * lived in tokens and so it swapped for free, but LAYOUT was hardcoded in
 * every section — a rule, a headline, a rule — and a rule-headline-rule
 * stack is a newspaper deck. No palette was ever going to overcome it.
 *
 * So the two publications get two different openings for the same data:
 *
 *   Newspaper — the deck it already had. Dense, ruled, immediate. A reader
 *   scans a newspaper, so the section names itself and gets out of the way.
 *
 *   Book — a chapter opening. The numeral, the chapter's own name, and the
 *   section title demoted to a running label above it. Editorial practice is
 *   explicit that a publication where every spread has the same density
 *   fatigues the reader, and that space around an element signals importance
 *   more reliably than size does. So this one is mostly air: it is the rest
 *   before the dense block that follows, and the pacing is the point.
 */
export function SectionOpening({
  title,
  subtitle,
  section,
  align = 'below',
}: Props) {
  const { theme } = useTheme()
  const { lang } = useTranslation()

  if (theme === 'book') {
    const index = CHAPTERS.findIndex((entry) => entry.section === section)
    const chapter = index >= 0 ? CHAPTERS[index] : null

    return (
      <div className="chapter-opening">
        <p className="chapter-running">{title}</p>

        {chapter && (
          <>
            <p className="chapter-numeral">{ROMAN[index]}</p>
            <h2 className="chapter-name">
              {lang === 'es' ? chapter.label.es : chapter.label.en}
            </h2>
          </>
        )}

        {/* No chapter for this section — the title carries the opening. */}
        {!chapter && <h2 className="chapter-name">{title}</h2>}

        {subtitle && <p className="chapter-epigraph">{subtitle}</p>}
      </div>
    )
  }

  // ── Newspaper ──
  return (
    <div className="mb-10">
      <div className="border-t-4 border-rule mb-1" />
      <div className="border-t border-rule mb-4" />

      {align === 'beside' ? (
        <>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-headline text-4xl md:text-5xl font-black text-ink leading-none">
              {title}
            </h2>
            {subtitle && (
              <p className="font-mono text-xs text-ink-muted text-right max-w-xs hidden md:block">
                {subtitle}
              </p>
            )}
          </div>
          {subtitle && (
            <p className="font-mono text-xs text-ink-muted mt-2 md:hidden">
              {subtitle}
            </p>
          )}
        </>
      ) : (
        <>
          <h2 className="font-headline text-4xl md:text-5xl font-black text-ink leading-none">
            {title}
          </h2>
          {subtitle && (
            <p className="font-mono text-xs text-ink-muted mt-2">{subtitle}</p>
          )}
        </>
      )}

      <div className="border-t-4 border-rule mt-4" />
    </div>
  )
}
