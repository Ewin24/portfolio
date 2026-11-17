import type { CSSProperties } from 'react'
import type { Language } from '../../../types'
import { reveal, type FigureBase, type L, type Renderer, type RendererProps } from '../types'

export interface GridRow {
  label: string
  /** One per column, in column order: whether the row is marked there. */
  marks: boolean[]
}

export interface GridGroup {
  label: L
  /** A short count beside the label ("8 de 11"). */
  note?: L
  /** A remark that arrives on a later step, for the group the figure ends on. */
  tag?: { label: L; step: number }
  /** The step on which the group and its rows appear. */
  step: number
  rows: GridRow[]
}

/**
 * Rows against columns, a mark where they meet. Data: every mark is a fact,
 * and the table lists them all.
 *  - wide: a grid with numbered columns and a key that names each number.
 *  - narrow: the columns would not fit, so each row lists the columns it is
 *    marked in by name instead of the grid shrinking.
 */
export interface GridFigure extends FigureBase {
  type: 'grid'
  /** Headings of the two label columns of the table: the group, then the row. */
  heads: [L, L]
  /** What a column is, as a heading for the key ("Casos de estudio"). */
  columnsLabel: L
  columns: L[]
  groups: GridGroup[]
  /** A mark, in words, for the table. */
  yes: L
  /** What a row with no mark says in the narrow list. */
  none: L
}

function GroupHead({ group, lang, step }: { group: GridGroup; lang: Language; step: number }) {
  return (
    <>
      <span className="fig-grid-group-label">{group.label[lang]}</span>
      {group.note && <span className="fig-grid-note">{group.note[lang]}</span>}
      {group.tag && <span className="fig-grid-tag" {...reveal(group.tag.step, step, 'label')}>{group.tag.label[lang]}</span>}
    </>
  )
}

function Grid({ figure, lang, step }: RendererProps<GridFigure>) {
  const { columns, groups } = figure
  return (
    <div className="fig-grid" style={{ '--n': columns.length } as CSSProperties}>
      <div className="fig-grid-map">
        <span className="fig-grid-corner" />
        {columns.map((column, c) => (
          <span key={c} className="fig-grid-col" title={column[lang]}>{c + 1}</span>
        ))}
        {groups.map((group, g) => (
          // Fragment-free on purpose: every cell is a grid item, so each carries its own reveal.
          [
            <div key={`g${g}`} className="fig-grid-group" {...reveal(group.step, step, 'label')}>
              <GroupHead group={group} lang={lang} step={step} />
            </div>,
            ...group.rows.flatMap((row, r) => [
              <span key={`g${g}r${r}`} className="fig-grid-row" {...reveal(group.step, step, 'label')}>{row.label}</span>,
              ...row.marks.map((marked, c) => (
                <span key={`g${g}r${r}c${c}`} className="fig-grid-cell">
                  {marked && (
                    <span
                      className="fig-grid-mark"
                      role="img"
                      aria-label={`${row.label}: ${columns[c][lang]}`}
                      style={{ '--i': r } as CSSProperties}
                      {...reveal(group.step, step)}
                    />
                  )}
                </span>
              )),
            ]),
          ]
        ))}
      </div>
      <div className="fig-grid-key">
        <span className="fig-grid-key-title">{figure.columnsLabel[lang]}</span>
        <ol>
          {columns.map((column, c) => <li key={c}>{column[lang]}</li>)}
        </ol>
      </div>

      <div className="fig-grid-list">
        {groups.map((group, g) => (
          <div key={g} className="fig-grid-list-group" {...reveal(group.step, step)}>
            <div className="fig-grid-group">
              <GroupHead group={group} lang={lang} step={step} />
            </div>
            <dl>
              {group.rows.map((row, r) => {
                const names = columns.filter((_, c) => row.marks[c]).map((column) => column[lang])
                return (
                  <div key={r} data-grid-row={row.label}>
                    <dt>{row.label}</dt>
                    <dd data-empty={names.length === 0}>{names.length > 0 ? names.join(' · ') : figure.none[lang]}</dd>
                  </div>
                )
              })}
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}

Grid.stepsUsed = (figure: GridFigure) => figure.groups.flatMap((group) => [group.step, ...(group.tag ? [group.tag.step] : [])])

Grid.table = (figure: GridFigure, lang: Language) => ({
  head: [...figure.heads, ...figure.columns].map((cell) => cell[lang]),
  rows: figure.groups.flatMap((group) =>
    group.rows.map((row) => [group.label[lang], row.label, ...row.marks.map((marked) => (marked ? figure.yes[lang] : '—'))]),
  ),
})

export default Grid satisfies Renderer<GridFigure>
