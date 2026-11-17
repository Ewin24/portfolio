import type { LineFigure } from '../renderers/line'
import type { FigureSet } from '../types'

const ceiling: LineFigure = {
  type: 'line',
  x: { es: 'rondas', en: 'rounds' },
  y: { es: 'defectos encontrados', en: 'defects found' },
  steps: [
    {
      es: 'Cada tipo de revisión tiene un techo: los defectos que puede ver alguien con ese material, esos medios y esa pregunta.',
      en: 'Every kind of review has a ceiling: the defects visible to someone with that material, those means and that question.',
    },
    {
      es: 'Las primeras rondas suben rápido hacia él. Las siguientes suben menos, y ninguna lo cruza.',
      en: 'The first rounds climb toward it quickly. Later rounds climb less, and none of them crosses it.',
    },
    {
      es: 'Los defectos que están por encima no son más difíciles: son de otro tipo, fuera del alcance de leer el código.',
      en: 'The defects above it are not harder: they are of another kind, out of reach of reading the code.',
    },
    {
      es: 'Lo que encontró otro observador estaba por encima del techo.',
      en: 'What another observer found was above the ceiling.',
    },
  ],
  refs: [
    {
      axis: 'y',
      at: 54,
      label: { text: { es: 'techo de este tipo de revisión', en: 'ceiling of this kind of review' }, at: [1, 54] },
      step: 1,
    },
  ],
  series: [
    {
      // Eleven rounds of the same kind: each riser is smaller than the last.
      shape: 'steps',
      points: [
        [0, 0], [0, 26], [8.6, 37.5], [17.2, 43.5], [25.8, 47], [34.4, 49], [43, 50],
        [51.6, 50.5], [60.2, 50.8], [68.8, 51.1], [77.3, 51.4], [85.9, 51.7], [94.5, 51.7],
      ],
      label: {
        text: { es: 'rondas de revisión', en: 'review rounds' },
        note: { es: 'cada una encuentra menos', en: 'each one finds less' },
        at: [34, 38],
        anchor: 'se',
        strong: true,
      },
      step: 2,
    },
  ],
  areas: [
    {
      points: [[0, 54], [100, 54], [100, 100], [0, 100]],
      label: { text: { es: 'fuera del alcance de leer el código', en: 'out of reach of reading the code' }, at: [1, 100], anchor: 'se' },
      step: 3,
    },
  ],
  marks: [
    {
      at: [[83, 72], [91.5, 72]],
      tone: 'accent',
      label: { text: { es: 'otro observador', en: 'another observer' }, at: [99, 76], anchor: 'nw', strong: true },
      step: 4,
    },
  ],
}

export default { 'review-rounds-ceiling': ceiling } satisfies FigureSet
