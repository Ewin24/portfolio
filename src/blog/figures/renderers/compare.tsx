import type { CSSProperties } from 'react'
import { reveal, text, type FigureBase, type L, type Renderer, type RendererProps } from '../types'

export interface CompareColumn {
  heading: L
  /** The column the figure is about: the accent marks it, its heading still names it. */
  emphasis?: boolean
  /** The step on which the whole column appears. Defaults to 1. */
  step?: number
}

export interface CompareCell {
  text: L | string
  /** A muted remark under the text. */
  note?: L
}

export interface CompareRow {
  title: L
  /** One cell per column, in column order. */
  cells: CompareCell[]
  /** The step on which the whole row appears. Defaults to 1. */
  step?: number
}

/**
 * Text cells under column headings, as a real table. Conceptual: no data toggle.
 *  - `layout: 'table'`: a first column of row titles and further columns of
 *    text. Narrow, each row turns into a block and every cell is labelled with
 *    its column heading.
 *  - `layout: 'side'`: each column is a card with its heading and the same
 *    ordered sections, each labelled with its row title. Narrow, the cards stack.
 * A cell appears on the later of its row's and its column's step.
 */
export interface CompareFigure extends FigureBase {
  type: 'compare'
  layout: 'table' | 'side'
  /** Heading of the row titles. `table` shows it; `side` only reads it to screen readers. */
  corner: L
  columns: CompareColumn[]
  rows: CompareRow[]
}

const at = (item: { step?: number }) => item.step ?? 1

// The roles are spelled out because the stylesheet lays the table out as a
// grid, and a table element whose `display` changes can lose its role.
function Compare({ figure, lang, step }: RendererProps<CompareFigure>) {
  const { columns, rows } = figure
  const side = figure.layout === 'side'
  return (
    <table
      role="table"
      className="fig-compare"
      data-layout={figure.layout}
      style={{ '--cols': columns.length, '--rows': rows.length } as CSSProperties}
    >
      <thead role="rowgroup">
        <tr role="row">
          <th role="columnheader" scope="col" className="fig-compare-corner">{figure.corner[lang]}</th>
          {columns.map((column, c) => (
            <th key={c} role="columnheader" scope="col" className="fig-compare-head" data-emphasis={column.emphasis} style={{ '--c': c } as CSSProperties}>
              <span className="fig-compare-heading" {...reveal(at(column), step, 'label')}>{column.heading[lang]}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup">
        {rows.map((row, r) => (
          <tr key={r} role="row">
            <th role="rowheader" scope="row" className="fig-compare-title">
              <span {...reveal(at(row), step, 'label')}>{row.title[lang]}</span>
            </th>
            {row.cells.map((cell, c) => (
              <td key={c} role="cell" className="fig-compare-cell" data-emphasis={columns[c].emphasis} style={{ '--c': c, '--r': r } as CSSProperties}>
                <div className="fig-compare-in" style={{ '--i': c } as CSSProperties} {...reveal(Math.max(at(row), at(columns[c])), step)}>
                  {/* What the header cells already say to a screen reader, repeated where the eye needs it. */}
                  <span className="fig-compare-label" aria-hidden="true">{(side ? row.title : columns[c].heading)[lang]}</span>
                  <span className="fig-compare-text">{text(cell.text, lang)}</span>
                  {cell.note && <span className="fig-compare-note">{cell.note[lang]}</span>}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

Compare.stepsUsed = (figure: CompareFigure) => [...figure.columns, ...figure.rows].map(at)

export default Compare satisfies Renderer<CompareFigure>
