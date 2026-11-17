import type { BarsFigure } from '../renderers/bars'
import type { FigureSet } from '../types'

const earlierRuns: BarsFigure = {
  type: 'bars',
  layout: 'split',
  columns: [
    { es: 'Resultado', en: 'Result' },
    { es: 'Ejecuciones', en: 'Runs' },
    { es: 'Porcentaje', en: 'Share' },
  ],
  note: { es: 'n = 20,000', en: 'n = 20,000' },
  steps: [
    {
      es: 'De 20,000 lecturas consecutivas, en 13,339 (66.7 %) GETDATE() comparó como anterior a SYSDATETIME().',
      en: 'Of 20,000 back-to-back reads, in 13,339 (66.7 %) GETDATE() compared as earlier than SYSDATETIME().',
    },
    { es: 'En las 6,661 restantes (33.3 %) no.', en: 'In the remaining 6,661 (33.3 %) it did not.' },
  ],
  bars: [
    { label: 'GETDATE() < SYSDATETIME()', value: 13339, display: '13,339', note: '66.7 %', tone: 'accent', strong: true, step: 1 },
    { label: 'GETDATE() ≥ SYSDATETIME()', value: 6661, display: '6,661', note: '33.3 %', step: 2 },
  ],
}

export default { 'getdate-earlier-runs': earlierRuns } satisfies FigureSet
