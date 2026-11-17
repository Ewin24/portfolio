import type { BarsFigure } from '../renderers/bars'
import type { FigureSet } from '../types'

const cache: BarsFigure = {
  type: 'bars',
  columns: [
    { es: 'Uso', en: 'Use' },
    { es: 'Múltiplo', en: 'Multiple' },
  ],
  note: { es: 'múltiplos del precio base de entrada', en: 'multiples of the base input price' },
  steps: [
    { es: 'La entrada normal es la referencia: 1× el precio base.', en: 'Normal input is the reference: 1× the base price.' },
    {
      es: 'Escribir en caché con vida de 5 minutos cuesta 1.25×.',
      en: 'Writing to the cache with a 5-minute lifetime costs 1.25×.',
    },
    { es: 'Escribir en caché con vida de 1 hora cuesta 2×.', en: 'Writing to the cache with a 1-hour lifetime costs 2×.' },
    { es: 'Leer de la caché cuesta 0.1×.', en: 'Reading from the cache costs 0.1×.' },
  ],
  bars: [
    { label: { es: 'entrada normal (precio base)', en: 'normal input (base price)' }, value: 1, display: '1×', tone: 'muted', step: 1 },
    { label: { es: 'escritura en caché, 5 minutos', en: 'cache write, 5 minutes' }, value: 1.25, display: '1.25×', step: 2 },
    { label: { es: 'escritura en caché, 1 hora', en: 'cache write, 1 hour' }, value: 2, display: '2×', step: 3 },
    { label: { es: 'lectura de caché', en: 'cache read' }, value: 0.1, display: '0.1×', tone: 'accent', strong: true, step: 4 },
  ],
}

export default { 'context-budget-cache': cache } satisfies FigureSet
