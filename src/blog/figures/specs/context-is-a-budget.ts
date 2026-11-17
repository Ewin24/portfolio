import type { BarsFigure } from '../renderers/bars'
import type { SegmentsFigure } from '../renderers/segments'
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

const budgetWindow: SegmentsFigure = {
  type: 'segments',
  steps: [
    {
      es: 'Las instrucciones son lo estable: reglas y definiciones de herramientas, iguales en cada turno.',
      en: 'The instructions are the stable part: rules and tool definitions, unchanged on every turn.',
    },
    {
      es: 'Los archivos leídos y la salida de herramientas son lo que crece sin que nadie lo escriba.',
      en: 'Files read and tool output are what grows without anybody writing it.',
    },
    { es: 'La conversación es el historial.', en: 'The conversation is the history.' },
    {
      es: 'El resto es el espacio que le queda al modelo para trabajar. Con todo adentro, casi no queda.',
      en: 'The remainder is the room the model has left to work. With everything in, hardly any is left.',
    },
    {
      es: 'La misma ventana con solo lo que la tarea usa: las instrucciones miden lo mismo y lo demás es mucho más corto.',
      en: 'The same window with only what the task uses: the instructions are the same size and the rest is much shorter.',
    },
    { es: 'El espacio libre es ahora la parte más grande de la barra.', en: 'Free space is now the largest part of the bar.' },
  ],
  kinds: [
    { letter: 'A', label: { es: 'instrucciones', en: 'instructions' }, tone: 'ink' },
    { letter: 'B', label: { es: 'archivos leídos', en: 'files read' }, tone: 'light' },
    { letter: 'C', label: { es: 'salida de herramientas', en: 'tool output' }, tone: 'muted' },
    { letter: 'D', label: { es: 'conversación', en: 'conversation' }, tone: 'soft' },
    { letter: 'E', label: { es: 'espacio libre', en: 'free space' }, tone: 'paper', emphasis: true },
  ],
  // Sizes are the widths the hand-drawn sketch used: illustrative, not measured.
  bars: [
    {
      title: { es: 'antes: todo entra completo', en: 'before: everything goes in whole' },
      step: 1,
      segments: [
        { kind: 'A', size: 70, step: 1 },
        { kind: 'B', size: 200, step: 2 },
        { kind: 'C', size: 150, step: 2 },
        { kind: 'D', size: 80, step: 3 },
        { kind: 'E', size: 20, step: 4 },
      ],
    },
    {
      title: { es: 'después: entra lo que la tarea usa', en: 'after: what the task uses goes in' },
      step: 5,
      segments: [
        { kind: 'A', size: 70, step: 5 },
        { kind: 'B', size: 60, step: 5 },
        { kind: 'C', size: 40, step: 5 },
        { kind: 'D', size: 70, step: 5 },
        { kind: 'E', size: 280, step: 6 },
      ],
    },
  ],
}

export default { 'context-budget-cache': cache, 'context-budget-window': budgetWindow } satisfies FigureSet
