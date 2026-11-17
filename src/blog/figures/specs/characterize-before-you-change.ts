import type { FlowFigure } from '../renderers/flow'
import type { FigureSet } from '../types'

const paths: FlowFigure = {
  type: 'flow',
  layout: 'rows',
  steps: [
    {
      es: 'Camino A, cambiar primero: se cambia sin registro, algo falla días después y toca averiguar qué hacía antes.',
      en: 'Path A, change first: you change with no record, something breaks days later, and you have to find out what it used to do.',
    },
    { es: 'Y se vuelve al inicio: otra vuelta.', en: 'And back to the start: another round.' },
    {
      es: 'Camino B, caracterizar primero: escribir lo que hace hoy, cambiar un paso y comparar con lo escrito.',
      en: 'Path B, characterize first: write what it does today, change one step and compare with the record.',
    },
    { es: 'Si no coincide, se revierte ese paso.', en: 'If it differs, that step is reverted.' },
  ],
  lanes: [
    {
      title: { es: 'A. Cambiar primero', en: 'A. Change first' },
      nodes: [
        { label: { es: 'Cambiar sin registro', en: 'Change with no record' }, step: 1 },
        { label: { es: 'Algo falla días después', en: 'Something breaks days later' }, step: 1 },
        { label: { es: 'Averiguar qué hacía antes', en: 'Find out what it used to do' }, step: 1 },
      ],
      loop: { to: 1, label: { es: 'otra vuelta', en: 'another round' }, step: 2, dashed: true, tone: 'accent' },
    },
    {
      title: { es: 'B. Caracterizar primero', en: 'B. Characterize first' },
      nodes: [
        { label: { es: 'Escribir lo que hace hoy', en: 'Write what it does today' }, emphasis: 'invert', step: 3 },
        { label: { es: 'Cambiar un paso', en: 'Change one step' }, step: 3 },
        { label: { es: 'Comparar con lo escrito', en: 'Compare with the record' }, step: 3 },
      ],
      note: { text: { es: 'Si no coincide: revertir ese paso', en: 'If it differs: revert that step' }, step: 4 },
    },
  ],
}

export default { 'characterize-paths': paths } satisfies FigureSet
