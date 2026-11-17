import { reveal, type FigureBase, type L, type Renderer, type RendererProps } from '../types'

export interface MatrixCell {
  title: L
  text: L
  /** A short remark under the text, for the cell the figure is about. */
  tag?: L
  emphasis?: boolean
  step: number
}

export interface MatrixAxis {
  label: L
  /** The two values along the axis: left then right, or top then bottom. */
  ticks: [L, L]
}

/** A two-by-two grid with a labelled axis on each side. Conceptual: it has no scale. */
export interface MatrixFigure extends FigureBase {
  type: 'matrix'
  /** The step on which both axes appear. */
  axesStep: number
  x: MatrixAxis
  y: MatrixAxis
  /** In reading order: top left, top right, bottom left, bottom right. */
  cells: [MatrixCell, MatrixCell, MatrixCell, MatrixCell]
}

function Matrix({ figure, lang, step }: RendererProps<MatrixFigure>) {
  const axis = reveal(figure.axesStep, step, 'label')
  return (
    <div className="fig-matrix">
      <span className="fig-matrix-ylabel" {...axis}>{figure.y.label[lang]}</span>
      {figure.y.ticks.map((tick, i) => (
        <span key={i} className="fig-matrix-ytick" style={{ gridRow: i + 1 }} {...axis}>{tick[lang]}</span>
      ))}
      <div className="fig-matrix-plot">
        {figure.cells.map((cell, i) => (
          // The quadrant is always there; its content arrives with its step.
          <div key={i} className="fig-matrix-cell">
            <div className="fig-matrix-content" data-emphasis={cell.emphasis} {...reveal(cell.step, step)}>
              <span className="fig-matrix-title">{cell.title[lang]}</span>
              <span className="fig-matrix-text">{cell.text[lang]}</span>
              {cell.tag && <span className="fig-matrix-tag">{cell.tag[lang]}</span>}
            </div>
          </div>
        ))}
      </div>
      {figure.x.ticks.map((tick, i) => (
        <span key={i} className="fig-matrix-xtick" style={{ gridColumn: i + 3 }} {...axis}>{tick[lang]}</span>
      ))}
      <span className="fig-matrix-xlabel" {...axis}>{figure.x.label[lang]}</span>
    </div>
  )
}

Matrix.stepsUsed = (figure: MatrixFigure) => [figure.axesStep, ...figure.cells.map((cell) => cell.step)]

export default Matrix satisfies Renderer<MatrixFigure>
