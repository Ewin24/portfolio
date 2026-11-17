import { reveal, type FigureBase, type L, type Renderer, type RendererProps } from '../types'

export interface Track {
  title: L
  /** The quoted example, quotation marks included. */
  example: L
  /** What happens at the far end, in words: the track's shape repeats it. */
  outcome: L
  /** The track turns dashed after the middle stage and ends in an empty marker. */
  lost?: boolean
  step: number
}

/**
 * Numbered rows, each with a track that runs through three named stages. A
 * track reaches the end solid, or is `lost` after the middle stage.
 * Conceptual: the track has no scale.
 */
export interface TracksFigure extends FigureBase {
  type: 'tracks'
  /** Start, middle and end of every track. */
  stages: [L, L, L]
  rows: Track[]
}

function Tracks({ figure, lang, step }: RendererProps<TracksFigure>) {
  return (
    <div className="fig-tracks">
      <div className="fig-tracks-stages">
        {figure.stages.map((stage, i) => (
          <span key={i} className="fig-tracks-stage">{stage[lang]}</span>
        ))}
      </div>
      <ol className="fig-tracks-list">
        {figure.rows.map((row, i) => (
          <li key={i} className="fig-tracks-row" data-lost={row.lost ?? false}>
            <div className="fig-tracks-head" {...reveal(row.step, step)}>
              <span className="fig-tracks-title">
                <span className="fig-tracks-n">{i + 1}</span>
                {row.title[lang]}
              </span>
              <span className="fig-tracks-outcome">{row.outcome[lang]}</span>
            </div>
            <p className="fig-tracks-example" {...reveal(row.step, step)}>{row.example[lang]}</p>
            {/* First half, second half, end marker. The outcome label says the same in words. */}
            <div className="fig-tracks-line" aria-hidden="true" {...reveal(row.step, step, 'wipe')}>
              <i />
              <i />
              <b />
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

Tracks.stepsUsed = (figure: TracksFigure) => figure.rows.map((row) => row.step)

export default Tracks satisfies Renderer<TracksFigure>
