import { Fragment, type CSSProperties, type ReactNode } from 'react'
import type { Language } from '../../../types'
import { reveal, type FigureBase, type L, type Renderer, type RendererProps } from '../types'

export interface FlowNode {
  label: L
  /** A second, lighter line inside the box. A box with one is titled in bold. */
  sub?: L
  /** `columns` layout with a single lane only: lines written beside the box. */
  aside?: { text: L; strong?: boolean }[]
  /** `invert` is ink on paper reversed, `accent` a red frame and label, `soft` a tinted box. */
  emphasis?: 'invert' | 'accent' | 'soft'
  strong?: boolean
  step: number
}

export interface FlowLane {
  /** Appears with the lane's first box. */
  title?: L
  /** `muted` draws the lane's boxes with a lighter frame. */
  tone?: 'muted'
  /** Joined by arrows in order; an arrow appears with the box it points to. */
  nodes: FlowNode[]
  /** `rows` layout only: an arrow from the last box back to box `to` (1-based). */
  loop?: { to: number; label: L; step: number; dashed?: boolean; tone?: 'accent' }
  /** `columns` layout only: a dead-end mark under the last box. */
  end?: { label: L; step: number }
  /** A sentence under the lane. */
  note?: { text: L; step: number; strong?: boolean }
}

/**
 * Boxes joined by arrows, in one or more lanes.
 *  - `rows`: each lane runs left to right and the lanes stack. On a narrow
 *    figure every lane turns to run top to bottom, its arrows with it.
 *  - `columns`: each lane runs top to bottom and the lanes sit side by side.
 *    On a narrow figure the lanes stack.
 */
export interface FlowFigure extends FigureBase {
  type: 'flow'
  layout: 'rows' | 'columns'
  lanes: FlowLane[]
  /** `columns` with two lanes only: a dashed connector from the last box of the first lane to the first box of the second. */
  link?: { step: number }
}

const NODE = 'minmax(0, 1fr)'
const ARROW = '1.75rem'
const GUTTER = '1.5rem'

type Line = string | number

/** Where a grid item sits when the figure is wide (`c`, `r`) and when it is narrow (`nc`, `nr`). */
const place = (c: Line, r: Line, nc: Line, nr: Line, extra?: Record<string, Line>) =>
  ({ '--c': c, '--r': r, '--nc': nc, '--nr': nr, ...extra }) as CSSProperties

/** Boxes of one lane that share a step enter one after another: their position in that queue. */
const queue = (lane: FlowLane, i: number) =>
  lane.nodes.slice(0, i).filter((node) => node.step === lane.nodes[i].step).length

function Arrow({ at, step, style }: { at: number; step: number; style: CSSProperties }) {
  return (
    <span className="fig-arrow" aria-hidden="true" style={style} {...reveal(at, step, 'draw')}>
      <svg viewBox="0 0 12 28" width="12" height="28">
        <line x1="6" y1="0" x2="6" y2="20" pathLength={1} />
        <path d="M1 19h10l-5 9z" />
      </svg>
    </span>
  )
}

/** A connector that turns corners: a loop back or the link between two lanes. */
function Elbow({ kind, at, step, style, dashed, tone }: {
  kind: 'loop' | 'link'; at: number; step: number; style: CSSProperties; dashed?: boolean; tone?: 'accent'
}) {
  return (
    <span className="fig-elbow" aria-hidden="true" data-kind={kind} data-dashed={dashed} data-tone={tone} style={style} {...reveal(at, step, 'wipe')}>
      <i />
      <i />
      <svg viewBox="0 0 10 10" width="10" height="10"><path d="M0 10l5-10 5 10z" /></svg>
    </span>
  )
}

interface NodeProps { node: FlowNode; lane: FlowLane; lang: Language; step: number; style: CSSProperties }

function Node({ node, lane, lang, step, style }: NodeProps) {
  return (
    <div className="fig-node" data-emphasis={node.emphasis} data-tone={lane.tone} data-strong={node.strong || !!node.sub} style={style} {...reveal(node.step, step)}>
      <span className="fig-node-label">{node.label[lang]}</span>
      {node.sub && <span className="fig-node-sub">{node.sub[lang]}</span>}
    </div>
  )
}

function Rows({ figure, lang, step }: RendererProps<FlowFigure>) {
  return figure.lanes.map((lane, l) => {
    const count = lane.nodes.length
    const { loop, note } = lane
    const span = loop ? `${2 * loop.to - 1} / ${2 * count}` : ''
    return (
      <div key={l} className="fig-lane">
        {lane.title && <p className="fig-lane-title" {...reveal(lane.nodes[0].step, step, 'label')}>{lane.title[lang]}</p>}
        <div
          className="fig-flow-grid"
          data-layout="rows"
          style={{ '--cols': lane.nodes.map(() => NODE).join(` ${ARROW} `), '--ncols': loop ? `${NODE} ${GUTTER}` : NODE } as CSSProperties}
        >
          {lane.nodes.map((node, i) => {
            const order = { '--i': queue(lane, i) }
            return (
              <Fragment key={i}>
                {i > 0 && <Arrow at={node.step} step={step} style={place(2 * i, 1, 1, 2 * i, order)} />}
                <Node node={node} lane={lane} lang={lang} step={step} style={place(2 * i + 1, 1, 1, 2 * i + 1, order)} />
              </Fragment>
            )
          })}
          {loop && (
            <>
              <Elbow kind="loop" at={loop.step} step={step} dashed={loop.dashed} tone={loop.tone} style={place(span, 2, 2, span, { '--k': count - loop.to + 1 })} />
              <span className="fig-loop-label" data-tone={loop.tone} style={place(span, 3, '1 / -1', 2 * count)} {...reveal(loop.step, step, 'label')}>
                {loop.label[lang]}
              </span>
            </>
          )}
        </div>
        {note && <p className="fig-lane-note" data-strong={note.strong} {...reveal(note.step, step, 'label')}>{note.text[lang]}</p>}
      </div>
    )
  })
}

function Columns({ figure, lang, step }: RendererProps<FlowFigure>) {
  const { lanes, link } = figure
  const single = lanes.length === 1
  const aside = single && lanes[0].nodes.some((node) => node.aside)
  const cols = aside ? `minmax(0, 10rem) ${NODE}` : lanes.map(() => NODE).join(' 2.5rem ')
  const narrowCols = single ? cols : link ? `${NODE} ${GUTTER}` : NODE

  const items: ReactNode[] = []
  // The narrow layout is one column, so every item takes the next row.
  let row = 1
  const firstRow: number[] = []
  const lastRow: number[] = []
  lanes.forEach((lane, l) => {
    const c = 1 + 2 * l
    const count = lane.nodes.length
    if (lane.title) {
      items.push(
        <p key={`${l}t`} className="fig-lane-title" data-later={l > 0} style={place(c, 1, 1, row++)} {...reveal(lane.nodes[0].step, step, 'label')}>
          {lane.title[lang]}
        </p>,
      )
    }
    lane.nodes.forEach((node, i) => {
      const order = { '--i': queue(lane, i) }
      if (i > 0) items.push(<Arrow key={`${l}a${i}`} at={node.step} step={step} style={place(c, 2 * i + 1, 1, row++, order)} />)
      if (i === 0) firstRow[l] = row
      lastRow[l] = row
      items.push(<Node key={`${l}n${i}`} node={node} lane={lane} lang={lang} step={step} style={place(c, 2 * i + 2, 1, row, order)} />)
      if (node.aside) {
        items.push(
          <p key={`${l}s${i}`} className="fig-aside" style={place(2, 2 * i + 2, 2, row, order)} {...reveal(node.step, step, 'label')}>
            {node.aside.map((line, k) => <span key={k} data-strong={line.strong}>{line.text[lang]}</span>)}
          </p>,
        )
      }
      row++
    })
    if (lane.end) {
      items.push(
        // Two rows tall when wide, so it never stretches the arrow row it shares with a longer lane.
        <p key={`${l}e`} className="fig-end" style={place(c, `${2 * count + 1} / span 2`, 1, row++)} {...reveal(lane.end.step, step)}>
          <i aria-hidden="true" />
          {lane.end.label[lang]}
        </p>,
      )
    }
    if (lane.note) {
      items.push(
        <p key={`${l}o`} className="fig-lane-note" data-strong={lane.note.strong} style={place(c, 2 * count + 3, 1, row++)} {...reveal(lane.note.step, step, 'label')}>
          {lane.note.text[lang]}
        </p>,
      )
    }
  })
  if (link && lanes.length === 2) {
    items.push(
      <Elbow key="link" kind="link" at={link.step} step={step} dashed style={place(2, `2 / ${2 * lanes[0].nodes.length + 1}`, 2, `${lastRow[0]} / ${firstRow[1] + 1}`)} />,
    )
  }

  return (
    <div className="fig-flow-grid" data-layout="columns" style={{ '--cols': cols, '--ncols': narrowCols } as CSSProperties}>
      {items}
    </div>
  )
}

function Flow(props: RendererProps<FlowFigure>) {
  return <div className="fig-flow">{props.figure.layout === 'rows' ? <Rows {...props} /> : <Columns {...props} />}</div>
}

Flow.stepsUsed = (figure: FlowFigure) => [
  ...(figure.link ? [figure.link.step] : []),
  ...figure.lanes.flatMap((lane) => [
    ...lane.nodes.map((node) => node.step),
    ...[lane.loop, lane.end, lane.note].flatMap((part) => (part ? [part.step] : [])),
  ]),
]

export default Flow satisfies Renderer<FlowFigure>
