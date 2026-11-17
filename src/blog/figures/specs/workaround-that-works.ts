import type { LineFigure } from '../renderers/line'
import type { FigureSet } from '../types'

const cost: LineFigure = {
  type: 'line',
  x: { es: 'tiempo', en: 'time' },
  y: { es: 'costo acumulado', en: 'cumulative cost' },
  steps: [
    {
      es: 'La corrección de raíz cuesta mucho una vez. Después su costo queda plano.',
      en: 'The root fix costs a lot once. After that its cost stays flat.',
    },
    {
      es: 'El arreglo cuesta casi nada el primer día y sube un escalón con cada copia.',
      en: 'The workaround costs almost nothing on day one and climbs a step with every copy.',
    },
    {
      es: 'En algún punto las dos líneas se cruzan. Nadie sabe dónde en el momento de elegir.',
      en: 'At some point the two lines cross. Nobody knows where at the moment of choosing.',
    },
  ],
  series: [
    {
      shape: 'steps',
      points: [[0, 0], [6, 62.5], [100, 62.5]],
      label: { text: { es: 'corrección de raíz', en: 'root fix' }, at: [66, 62.5], anchor: 'nw', strong: true },
      step: 1,
    },
    {
      shape: 'steps',
      tone: 'accent',
      points: [[0, 0], [6, 6], [21.5, 16.5], [37, 30], [52.5, 45.5], [68.5, 65.5], [84, 84.5], [100, 84.5]],
      label: { text: { es: 'arreglo que funciona', en: 'workaround' }, at: [100, 84.5], anchor: 'nw', strong: true },
      step: 2,
    },
  ],
  // Each riser is one more copy of the workaround.
  notes: [
    { text: { es: '+1 copia', en: '+1 copy' }, at: [21.5, 15.5], anchor: 'se', step: 2 },
    { text: '+1', at: [37, 29], anchor: 'se', step: 2 },
    { text: '+1', at: [52.5, 44.5], anchor: 'se', step: 2 },
    { text: '+1', at: [68.5, 60], anchor: 'se', step: 2 },
    { text: '+1', at: [84, 83.5], anchor: 'se', step: 2 },
  ],
  marks: [{ at: [[68.5, 62.5]], step: 3 }],
}

export default { 'workaround-cost': cost } satisfies FigureSet
