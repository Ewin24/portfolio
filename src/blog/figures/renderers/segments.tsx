import type { CSSProperties } from 'react'
import { reveal, type FigureBase, type L, type Renderer, type RendererProps } from '../types'

export interface SegmentKind {
  /** The letter drawn on every segment of this kind and in the legend. */
  letter: string
  label: L
  /** The fill. The letter carries the identity; the fill only tells neighbours apart. */
  tone: 'ink' | 'light' | 'muted' | 'soft' | 'paper'
  /** Outlined with the accent: the kind the figure is about. */
  emphasis?: boolean
}

export interface SegmentBar {
  title: L
  /** The step on which the heading appears. */
  step: number
  /** Left to right. `size` is a share of the bar, illustrative and never shown. */
  segments: { kind: string; size: number; step: number }[]
}

/**
 * Bars of the same length, each split into lettered segments, with one legend
 * for all of them. A legend entry appears with the first segment of its kind.
 * Conceptual: the proportions are illustrative, so no number and no table.
 */
export interface SegmentsFigure extends FigureBase {
  type: 'segments'
  kinds: SegmentKind[]
  bars: SegmentBar[]
}

function Segments({ figure, lang, step }: RendererProps<SegmentsFigure>) {
  const kinds = new Map(figure.kinds.map((kind) => [kind.letter, kind]))
  const firstStep = (letter: string) =>
    Math.min(...figure.bars.flatMap((bar) => bar.segments.filter((s) => s.kind === letter).map((s) => s.step)))

  return (
    <div className="fig-segments">
      {figure.bars.map((bar, b) => (
        <div key={b} className="fig-segments-bar">
          <p className="fig-segments-title" {...reveal(bar.step, step, 'label')}>{bar.title[lang]}</p>
          <div className="fig-segments-track">
            {bar.segments.map((segment, i) => {
              const kind = kinds.get(segment.kind)
              // Segments of one step enter left to right.
              const queue = { '--i': bar.segments.slice(0, i).filter((s) => s.step === segment.step).length } as CSSProperties
              return (
                <span key={i} className="fig-segments-seg" style={{ '--size': segment.size } as CSSProperties}>
                  <i className="fig-segments-fill" data-tone={kind?.tone} data-emphasis={kind?.emphasis} style={queue} {...reveal(segment.step, step, 'grow')} />
                  <b className="fig-segments-letter" data-tone={kind?.tone} style={queue} {...reveal(segment.step, step, 'label')}>{segment.kind}</b>
                </span>
              )
            })}
          </div>
        </div>
      ))}
      <ul className="fig-segments-legend">
        {figure.kinds.map((kind) => (
          <li key={kind.letter} {...reveal(firstStep(kind.letter), step, 'label')}>
            <i className="fig-segments-fill" data-tone={kind.tone} data-emphasis={kind.emphasis} />
            <b>{kind.letter}</b>
            <span>{kind.label[lang]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

Segments.stepsUsed = (figure: SegmentsFigure) =>
  figure.bars.flatMap((bar) => [bar.step, ...bar.segments.map((segment) => segment.step)])

export default Segments satisfies Renderer<SegmentsFigure>
