interface Props {
  /** The functional name of the section. Always shown. */
  title: string
  subtitle?: string
  /**
   * DOM id of the section this opens. Kept for callers that already pass it.
   */
  section?: string
  /**
   * `beside` sets the subtitle right-aligned next to the headline, which is
   * how Projects and Skills already read.
   */
  align?: 'below' | 'beside'
  /**
   * Expressed purely through headline scale, rule weight and section padding.
   */
  rank?: 'lead' | 'standard'
}

/**
 * How a section announces itself in the newspaper: a dense, ruled deck. A
 * reader scans a newspaper, so the section names itself and gets out of the
 * way.
 */
export function SectionOpening({
  title,
  subtitle,
  align = 'below',
  rank = 'standard',
}: Props) {
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
