import type { CSSProperties } from 'react'
import { reveal, type FigureBase, type L, type Renderer, type RendererProps } from '../types'

export interface Rung {
  /** Shown before the title as "3.". Identity rests on it and on the title, never on colour. */
  number?: number
  title: L
  text?: L
  /** A second, lighter line. */
  detail?: L
  /** A last line in bold, for what the rung is about. */
  strong?: L
  /** `accent` is the rung the figure is about: accent outline with a thick edge. Default `plain`. */
  style?: 'plain' | 'dashed' | 'filled' | 'accent'
  /** A heading above this rung, opening a group that runs until the next heading. */
  group?: L
  /** `layout: 'ranked'` only: the bar's relative length, from 0 to 1. It conveys order, not a value. */
  rank?: number
  /** `layout: 'ranked'` only: the bar in the accent colour. Its group heading names it. */
  tone?: 'accent'
  step: number
}

/**
 * An ordered stack of rungs. Conceptual: it has no scale and no data table.
 *  - default: boxes, read bottom-to-top (`direction: 'up'`, a ladder to climb)
 *    or top-to-bottom, with an optional arrow beside the stack.
 *  - `layout: 'ranked'`: one line per rung with a bar whose length only says
 *    "more"; the axis label sits under the bars. Always read top-to-bottom.
 */
export interface LadderFigure extends FigureBase {
  type: 'ladder'
  layout?: 'ranked'
  direction: 'up' | 'down'
  /** The arrow along the stack, pointing in `direction`, and its optional label. */
  axis?: { label?: L; step: number }
  /** A closing line under the stack. */
  note?: { text: L; step: number }
  /** In order: the first rung is number one, wherever the direction draws it. */
  rungs: Rung[]
}

function Ladder({ figure, lang, step }: RendererProps<LadderFigure>) {
  const { axis, note } = figure
  const ranked = figure.layout === 'ranked'
  return (
    <div className="fig-ladder" data-layout={figure.layout ?? 'stack'} data-direction={figure.direction}>
      {axis && !ranked && (
        <div className="fig-ladder-axis">
          {axis.label && <span className="fig-ladder-axis-label" {...reveal(axis.step, step, 'label')}>{axis.label[lang]}</span>}
          <span className="fig-ladder-arrow" aria-hidden="true" {...reveal(axis.step, step, 'draw')}>
            <svg className="fig-ladder-head" viewBox="0 0 12 10" width="12" height="10"><path d="M0 10l6-10 6 10z" /></svg>
            <svg className="fig-ladder-shaft" width="12"><line x1="6" y1="100%" x2="6" y2="0" pathLength={1} /></svg>
          </span>
        </div>
      )}
      <ol className="fig-ladder-rungs">
        {figure.rungs.map((rung, i) => (
          <li key={i} className="fig-ladder-item">
            {rung.group && <span className="fig-ladder-group" {...reveal(rung.step, step, 'label')}>{rung.group[lang]}</span>}
            {ranked ? (
              <div className="fig-ladder-ranked">
                <span className="fig-ladder-bar" data-tone={rung.tone} style={{ '--v': rung.rank ?? 1 } as CSSProperties} {...reveal(rung.step, step, 'grow')} />
                <span className="fig-ladder-label" {...reveal(rung.step, step, 'label')}>{rung.title[lang]}</span>
              </div>
            ) : (
              <div className="fig-ladder-rung" data-style={rung.style ?? 'plain'} {...reveal(rung.step, step)}>
                <span className="fig-ladder-title">
                  {rung.number !== undefined && <span className="fig-ladder-number">{rung.number}.</span>}
                  {rung.title[lang]}
                </span>
                {rung.text && <span className="fig-ladder-text">{rung.text[lang]}</span>}
                {rung.detail && <span className="fig-ladder-detail">{rung.detail[lang]}</span>}
                {rung.strong && <span className="fig-ladder-strong">{rung.strong[lang]}</span>}
              </div>
            )}
          </li>
        ))}
      </ol>
      {axis && ranked && axis.label && <p className="fig-ladder-xaxis" {...reveal(axis.step, step, 'label')}>{axis.label[lang]}</p>}
      {note && <p className="fig-ladder-note" {...reveal(note.step, step, 'label')}>{note.text[lang]}</p>}
    </div>
  )
}

Ladder.stepsUsed = (figure: LadderFigure) => [
  ...figure.rungs.map((rung) => rung.step),
  ...(figure.axis ? [figure.axis.step] : []),
  ...(figure.note ? [figure.note.step] : []),
]

export default Ladder satisfies Renderer<LadderFigure>
