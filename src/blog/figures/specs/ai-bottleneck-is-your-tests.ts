import type { BarsFigure } from '../renderers/bars'
import type { LineFigure } from '../renderers/line'
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

const gap: LineFigure = {
  type: 'line',
  x: { es: 'tiempo', en: 'time' },
  y: { es: 'volumen', en: 'volume' },
  steps: [
    {
      es: 'Mientras escribir es caro, el código escrito y el verificado crecen despacio y más o menos juntos.',
      en: 'While writing is expensive, code written and code verified grow slowly and roughly together.',
    },
    {
      es: 'Cuando escribir se abarata, el código escrito se dispara.',
      en: 'When writing gets cheap, code written takes off.',
    },
    {
      es: 'El código verificado no se dispara, porque depende de herramientas de prueba, entornos y tiempo de ejecución contra sistemas reales.',
      en: 'Code verified does not take off, because it depends on test tooling, environments and run time against real systems.',
    },
    {
      es: 'La brecha entre las dos es código que existe, compila, pasa revisión y nadie comprobó.',
      en: 'The gap between them is code that exists, compiles, passes review, and that nobody checked.',
    },
  ],
  // Each line is drawn in two stretches, before and after the marker.
  series: [
    {
      points: [[0, 24], [39, 38]],
      label: { text: { es: 'código escrito', en: 'code written' }, at: [38, 39], anchor: 'nw', strong: true },
      step: 1,
    },
    {
      points: [[0, 18], [39, 31]],
      dashed: true,
      tone: 'muted',
      label: { text: { es: 'código verificado', en: 'code verified' }, at: [37, 17], anchor: 'sw' },
      step: 1,
    },
    { points: [[39, 38], [94, 94]], step: 2 },
    { points: [[39, 31], [94, 46]], dashed: true, tone: 'muted', step: 3 },
  ],
  refs: [{ axis: 'x', at: 39, label: { text: 'AI', at: [39, 100], anchor: 'se', strong: true }, step: 2 }],
  areas: [
    {
      points: [[39, 38], [94, 94], [94, 46], [39, 31]],
      bracket: true,
      label: { text: { es: 'sin verificar', en: 'unverified' }, at: [93, 55], anchor: 'sw', strong: true },
      step: 4,
    },
  ],
}

export default { 'ai-bottleneck-dora-2024': dora2024, 'ai-bottleneck-gap': gap } satisfies FigureSet
