import type { BarsFigure } from '../renderers/bars'
import type { FigureSet } from '../types'

const dora2024: BarsFigure = {
  type: 'bars',
  columns: [
    { es: 'Medida', en: 'Measure' },
    { es: 'Cambio', en: 'Change' },
  ],
  note: { es: 'DORA 2024', en: 'DORA 2024' },
  steps: [
    {
      es: 'Con más adopción de AI, la calidad de la documentación sube 7.5 %.',
      en: 'With more AI adoption, documentation quality goes up 7.5 %.',
    },
    {
      es: 'También suben la calidad del código (3.4 %) y la velocidad de revisión de código (3.1 %).',
      en: 'Code quality (3.4 %) and code review speed (3.1 %) go up as well.',
    },
    {
      es: 'Bajan el rendimiento de entrega (1.5 %) y la estabilidad de entrega (7.2 %).',
      en: 'Delivery throughput (1.5 %) and delivery stability (7.2 %) go down.',
    },
  ],
  bars: [
    { label: { es: 'calidad de la documentación', en: 'documentation quality' }, value: 7.5, display: '+7.5 %', step: 1 },
    { label: { es: 'calidad del código', en: 'code quality' }, value: 3.4, display: '+3.4 %', step: 2 },
    { label: { es: 'velocidad de revisión de código', en: 'code review speed' }, value: 3.1, display: '+3.1 %', step: 2 },
    { label: { es: 'rendimiento de entrega', en: 'delivery throughput' }, value: -1.5, display: '−1.5 %', tone: 'accent', step: 3 },
    { label: { es: 'estabilidad de entrega', en: 'delivery stability' }, value: -7.2, display: '−7.2 %', tone: 'accent', step: 3 },
  ],
}

export default { 'ai-bottleneck-dora-2024': dora2024 } satisfies FigureSet
