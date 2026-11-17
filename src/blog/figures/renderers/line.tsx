import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { Language } from '../../../types'
import { reveal, text, type FigureBase, type L, type Renderer, type RendererProps } from '../types'

/**
 * A position in the plot: x from 0 (left) to 100 (right), y from 0 (the
 * baseline) to 100 (top). The plot box maps it to its own size, so a sketch
 * keeps its proportions at any width.
 */
export type Point = [x: number, y: number]

/** The corner of the point a label grows towards: `ne` sits above it, to its right. */
export type Anchor = 'ne' | 'nw' | 'se' | 'sw'

export interface LineLabel {
  text: L | string
  at: Point
  /** Defaults to `ne`. */
  anchor?: Anchor
  strong?: boolean
  /** A second, lighter line under the text. */
  note?: L
}

export interface LineSeries {
  points: Point[]
  /** `steps` joins each point to the next with a tread and then a riser: a staircase. */
  shape?: 'steps'
  dashed?: boolean
  /** `accent` singles the series out, `muted` makes it the quieter one. Its label still names it. */
  tone?: 'accent' | 'muted'
  /** A series that continues a labelled one may go without. */
  label?: LineLabel
  step: number
}

/** A shaded region: the gap between two series, or a band. */
export interface LineArea {
  /** The outline of the region. */
  points: Point[]
  /** Closes the region's right edge with an accent bracket: the mark of what the figure is about. */
  bracket?: boolean
  label?: LineLabel
  step: number
}

/** A dashed reference line across the whole plot: `x` is vertical, `y` horizontal. */
export interface LineRef {
  axis: 'x' | 'y'
  at: number
  label?: LineLabel
  step: number
}

/** Square marks on single points, with one label for the group. */
export interface LineMarks {
  at: Point[]
  /** `accent` fills the marks; the default leaves them hollow. */
  tone?: 'accent'
  label?: LineLabel
  step: number
}

/**
 * A conceptual line sketch on two axes that carry a title and no scale.
 * Series draw along their length when their step arrives; each is named by a
 * direct label with a sample of its stroke, never by colour alone.
 */
export interface LineFigure extends FigureBase {
  type: 'line'
  x: L
  y: L
  series: LineSeries[]
  areas?: LineArea[]
  refs?: LineRef[]
  marks?: LineMarks[]
  /** Free remarks inside the plot. */
  notes?: (LineLabel & { step: number })[]
}

/** SVG runs top to bottom; the plot runs bottom to top. */
const svgPoints = (points: Point[]) => points.map(([x, y]) => `${x},${100 - y}`).join(' ')

const stepped = (points: Point[]) =>
  points.flatMap((point, i): Point[] => (i === 0 ? [point] : [[point[0], points[i - 1][1]], point]))

const place = ([x, y]: Point, anchor: Anchor = 'ne'): CSSProperties => ({
  // Anchored by the edge it grows away from, so the text wraps in the room it really has.
  ...(anchor.endsWith('w') ? { right: `${100 - x}%` } : { left: `${x}%` }),
  ...(anchor.startsWith('s') ? { top: `${100 - y}%` } : { bottom: `${y}%` }),
})

function Label({ label, lang, swatch, ...rest }: { label: LineLabel; lang: Language; swatch?: ReactNode } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className="fig-line-label" data-anchor={label.anchor ?? 'ne'} data-strong={label.strong} style={place(label.at, label.anchor)} {...rest}>
      <span className="fig-line-label-text">{swatch}{text(label.text, lang)}</span>
      {label.note && <span className="fig-line-label-note">{label.note[lang]}</span>}
    </span>
  )
}

function Line({ figure, lang, step }: RendererProps<LineFigure>) {
  const { series, areas = [], refs = [], marks = [], notes = [] } = figure

  return (
    <div className="fig-line">
      <span className="fig-line-ytitle">{figure.y[lang]}</span>
      <div className="fig-line-plot">
        {areas.length > 0 && (
          <svg className="fig-line-areas" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {areas.map((area, i) => {
              const right = Math.max(...area.points.map(([x]) => x))
              const edge = area.points.filter(([x]) => x === right).map(([, y]) => 100 - y)
              const [top, bottom] = [Math.min(...edge), Math.max(...edge)]
              return (
                <g key={i} {...reveal(area.step, step, 'label')}>
                  <polygon points={svgPoints(area.points)} />
                  {area.bracket && <polyline points={`${right + 1.5},${top} ${right + 3.5},${top} ${right + 3.5},${bottom} ${right + 1.5},${bottom}`} />}
                </g>
              )
            })}
          </svg>
        )}

        {refs.map((ref, i) => (
          <i
            key={i}
            className="fig-line-ref"
            data-axis={ref.axis}
            style={ref.axis === 'x' ? { left: `${ref.at}%` } : { bottom: `${ref.at}%` }}
            {...reveal(ref.step, step, 'wipe')}
          />
        ))}

        {series.map((s, i) => (
          // One drawing per series, so each is uncovered from where it starts.
          <svg
            key={i}
            className="fig-line-series"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            data-tone={s.tone}
            data-dashed={s.dashed}
            style={{ '--wipe-from': `inset(-1rem ${100 - s.points[0][0]}% -1rem -1rem)` } as CSSProperties}
            {...reveal(s.step, step, 'wipe')}
          >
            <polyline points={svgPoints(s.shape === 'steps' ? stepped(s.points) : s.points)} />
          </svg>
        ))}

        {marks.flatMap((group, g) =>
          group.at.map(([x, y], i) => (
            <i
              key={`${g}-${i}`}
              className="fig-line-mark"
              data-tone={group.tone}
              style={{ left: `${x}%`, bottom: `${y}%`, '--i': i } as CSSProperties}
              {...reveal(group.step, step, 'label')}
            />
          )),
        )}

        {[...areas, ...refs, ...marks].map((el, i) => el.label && (
          <Label key={i} label={el.label} lang={lang} {...reveal(el.step, step, 'label')} />
        ))}
        {series.map((s, i) => s.label && (
          <Label
            key={i}
            label={s.label}
            lang={lang}
            swatch={<i className="fig-line-swatch" data-tone={s.tone} data-dashed={s.dashed} />}
            {...reveal(s.step, step, 'label')}
          />
        ))}
        {notes.map((note, i) => (
          <Label key={i} label={note} lang={lang} data-tone="muted" {...reveal(note.step, step, 'label')} />
        ))}
      </div>
      <span className="fig-line-xtitle">{figure.x[lang]}</span>
    </div>
  )
}

Line.stepsUsed = (figure: LineFigure) =>
  [figure.series, figure.areas, figure.refs, figure.marks, figure.notes].flatMap((group) => (group ?? []).map((el) => el.step))

export default Line satisfies Renderer<LineFigure>
