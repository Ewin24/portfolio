import type { CSSProperties } from 'react'
import type { Language } from '../../../types'
import { reveal, text, type FigureBase, type L, type Renderer, type RendererProps } from '../types'

export interface Bar {
  label: L | string
  value: number
  /** The value as the reader sees it ("+7.5 %", "1.25×"). Defaults to the number. */
  display?: string
  /** A second figure for the same bar, such as its share ("66.7 %"). */
  note?: string
  /** `accent` singles a bar out, `muted` makes it the reference. The label still names it. */
  tone?: 'accent' | 'muted'
  strong?: boolean
  step: number
}

/**
 * Horizontal bars with their values as direct labels.
 *  - default: one row per bar; any negative value turns the chart into bars
 *    diverging from a zero line in the middle.
 *  - `layout: 'split'`: one bar divided into its parts, each as wide as its
 *    value, labelled above and below its own part. On a narrow figure the
 *    parts stack as bars drawn against the total, so the labels still fit.
 */
export interface BarsFigure extends FigureBase {
  type: 'bars'
  layout?: 'split'
  /** Rows only: the label above its bar (default) or in a column to its left. */
  labels?: 'above' | 'side'
  /** Headings of the data table: label, value and, when bars carry a `note`, the note. */
  columns: L[]
  /** A muted line under the chart: the unit, the source or the sample size. */
  note?: L
  bars: Bar[]
}

const shown = (bar: Bar) => bar.display ?? String(bar.value)

function Bars({ figure, lang, step }: RendererProps<BarsFigure>) {
  const { bars } = figure
  const note = figure.note && <p className="fig-bars-note">{figure.note[lang]}</p>

  if (figure.layout === 'split') {
    const total = bars.reduce((sum, b) => sum + b.value, 0)
    return (
      <>
        <div className="fig-split" style={{ '--cols': bars.map((b) => `minmax(0, ${b.value}fr)`).join(' ') } as CSSProperties}>
          {bars.map((bar, i) => (
            <div key={i} className="fig-split-part" style={{ '--v': bar.value / total } as CSSProperties}>
              <span className="fig-bar-label" data-strong={bar.strong} {...reveal(bar.step, step, 'label')}>
                {text(bar.label, lang)}
              </span>
              <span className="fig-bar-fill" data-tone={bar.tone} {...reveal(bar.step, step, 'grow')} />
              <span className="fig-split-value" {...reveal(bar.step, step, 'label')}>
                <span className="fig-bar-value">{shown(bar)}</span>
                {bar.note && <span className="fig-bar-note">{bar.note}</span>}
              </span>
            </div>
          ))}
        </div>
        {note}
      </>
    )
  }

  const max = Math.max(...bars.map((b) => Math.abs(b.value)))
  const diverging = bars.some((b) => b.value < 0)
  return (
    <>
      <div className="fig-bars" data-labels={figure.labels ?? 'above'} data-diverging={diverging}>
        {bars.map((bar, i) => (
          <div key={i} className="fig-bar-row" data-negative={bar.value < 0}>
            <span className="fig-bar-label" data-strong={bar.strong} {...reveal(bar.step, step, 'label')}>
              {text(bar.label, lang)}
            </span>
            <span className="fig-bar-track" style={{ '--v': Math.abs(bar.value) / max } as CSSProperties}>
              <span className="fig-bar-fill" data-tone={bar.tone} {...reveal(bar.step, step, 'grow')} />
              <span className="fig-bar-value" {...reveal(bar.step, step, 'label')}>{shown(bar)}</span>
            </span>
          </div>
        ))}
      </div>
      {note}
    </>
  )
}

Bars.stepsUsed = (figure: BarsFigure) => figure.bars.map((bar) => bar.step)

Bars.table = (figure: BarsFigure, lang: Language) => {
  const withNote = figure.bars.some((bar) => bar.note)
  return {
    head: figure.columns.map((column) => column[lang]),
    rows: figure.bars.map((bar) => [text(bar.label, lang), shown(bar), ...(withNote ? [bar.note ?? ''] : [])]),
  }
}

export default Bars satisfies Renderer<BarsFigure>
