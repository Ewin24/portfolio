import { useTheme } from '../../theme/ThemeContext'

interface Props {
  /** The functional name of the section. Always shown. */
  title: string
  subtitle?: string
  /**
   * DOM id of the section this opens. Kept for callers that already pass
   * it; the book opening no longer looks anything up by it — the palette
   * swap under the reader is the only chapter announcement now.
   */
  section?: string
  /**
   * Newspaper only: `beside` sets the subtitle right-aligned next to the
   * headline, which is how Projects and Skills already read.
   */
  align?: 'below' | 'beside'
  /**
   * Newspaper only, expressed purely through headline scale, rule weight
   * and section padding — never read before the book branch has already
   * returned, so book output stays byte-identical for every value.
   */
  rank?: 'lead' | 'standard'
}

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
 *   Book — a chapter opening. The chapter change is already announced by the
 *   palette swapping under the reader as they cross the boundary; naming it
 *   again in type would be a second announcement. So the opening carries only
 *   the section's own functional title, inside the same generous air.
 *   Editorial practice is explicit that a publication where every spread has
 *   the same density fatigues the reader, and that space around an element
 *   signals importance more reliably than size does. So this one is mostly
 *   air: it is the rest before the dense block that follows, and the pacing
 *   is the point.
 */
export function SectionOpening({
  title,
  subtitle,
  align = 'below',
  rank = 'standard',
}: Props) {
  const { theme } = useTheme()

  if (theme === 'book') {
    return (
      <div className="chapter-opening">
        <h2 className="chapter-name">{title}</h2>
        {subtitle && <p className="chapter-epigraph">{subtitle}</p>}
      </div>
    )
  }

  // ── Newspaper ──
  const isLead = rank === 'lead'
  const h2Class = isLead
    ? 'font-headline text-5xl md:text-6xl font-black text-ink leading-none'
    : 'font-headline text-4xl md:text-5xl font-black text-ink leading-none'

  return (
    <div data-opening-rank={rank} className={isLead ? 'mb-14' : 'mb-10'}>
      <div className={isLead ? 'border-t-8 border-rule mb-1' : 'border-t-4 border-rule mb-1'} />
      <div className={isLead ? 'border-t-2 border-rule mb-6' : 'border-t border-rule mb-4'} />

      {align === 'beside' ? (
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-8">
          <h2 className={h2Class}>{title}</h2>
          {subtitle && (
            <p
              data-deck
              className="font-mono text-xs text-ink-muted text-left md:max-w-xs md:shrink-0 md:border-l-2 md:border-rule md:pl-4"
            >
              {subtitle}
            </p>
          )}
        </div>
      ) : (
        <>
          <h2 className={h2Class}>{title}</h2>
          {subtitle && (
            <p data-deck className="font-mono text-xs text-ink-muted mt-2">{subtitle}</p>
          )}
        </>
      )}

      <div className="border-t-4 border-rule mt-4" />
    </div>
  )
}
