import type { ReactNode } from 'react'
import { reveal, type FigureBase, type L, type Renderer, type RendererProps } from '../types'

export interface Layer {
  label: L
  step: number
}

/**
 * Nested frames around a core. Layers are listed from the outermost in and are
 * numbered in that order; their steps decide whether the figure builds from
 * the outside in or from the inside out. Conceptual: it has no scale.
 */
export interface LayersFigure extends FigureBase {
  type: 'layers'
  layers: Layer[]
  /** The small box in the middle, the one the accent singles out. */
  core: { title: L; text: L; step: number }
}

function Layers({ figure, lang, step }: RendererProps<LayersFigure>) {
  const { core } = figure
  const middle: ReactNode = (
    <div className="fig-layers-core" {...reveal(core.step, step)}>
      <span className="fig-layers-core-title">{core.title[lang]}</span>
      <span className="fig-layers-core-text">{core.text[lang]}</span>
    </div>
  )
  return (
    <div className="fig-layers">
      {figure.layers.reduceRight(
        (inner, layer, i) => (
          // The frame is a sibling of what it surrounds, not its parent: a
          // hidden frame must not hide the layers inside it.
          <div key={i} className="fig-layers-layer">
            <i className="fig-layers-frame" {...reveal(layer.step, step, 'label')} />
            <span className="fig-layers-label" {...reveal(layer.step, step, 'label')}>
              <b>{i + 1}</b>
              <span>{layer.label[lang]}</span>
            </span>
            {inner}
          </div>
        ),
        middle,
      )}
    </div>
  )
}

Layers.stepsUsed = (figure: LayersFigure) => [...figure.layers.map((layer) => layer.step), figure.core.step]

export default Layers satisfies Renderer<LayersFigure>
