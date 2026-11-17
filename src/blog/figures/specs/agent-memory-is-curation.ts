import type { BarsFigure } from '../renderers/bars'
import type { FlowFigure } from '../renderers/flow'
import type { FigureSet } from '../types'

const sampleTypes: BarsFigure = {
  type: 'bars',
  labels: 'side',
  columns: [
    { es: 'Tipo', en: 'Type' },
    { es: 'Notas', en: 'Notes' },
  ],
  steps: [
    {
      es: 'De las 56 notas de la muestra, 24 son de tipo architecture.',
      en: 'Of the 56 notes in the sample, 24 are of type architecture.',
    },
    {
      es: 'Siguen session_summary con 10, decision con 7 y discovery con 6.',
      en: 'Then come session_summary with 10, decision with 7 and discovery with 6.',
    },
    { es: 'El resto: bugfix 4, pattern 2, config 2 y feedback 1.', en: 'The rest: bugfix 4, pattern 2, config 2 and feedback 1.' },
  ],
  // The labels are the store's own type names, so they are not translated.
  bars: [
    { label: 'architecture', value: 24, step: 1 },
    { label: 'session_summary', value: 10, step: 2 },
    { label: 'decision', value: 7, step: 2 },
    { label: 'discovery', value: 6, step: 2 },
    { label: 'bugfix', value: 4, step: 3 },
    { label: 'pattern', value: 2, step: 3 },
    { label: 'config', value: 2, step: 3 },
    { label: 'feedback', value: 1, step: 3 },
  ],
}

const lifecycle: FlowFigure = {
  type: 'flow',
  layout: 'columns',
  steps: [
    {
      es: 'Escrita: lleva fecha, razón y un solo tema. Aquí se decide si merece existir.',
      en: 'Written: dated, with its reason, one topic. Here you decide it should exist.',
    },
    {
      es: 'Recordada: vuelve en una búsqueda y se usa. Es una pista, falta comprobarla.',
      en: 'Recalled: a search brings it back into use. It is a lead, not yet a fact.',
    },
    {
      es: 'Vencida: el código cambió y la nota no. Nada la marca y sigue activa.',
      en: 'Stale: the code changed and the note did not. Nothing flags it and it is still active.',
    },
    {
      es: 'Reemplazada: una nota nueva dice cuál gana y la vieja apunta a la nueva.',
      en: 'Replaced: a newer note says which one wins, and the old one points to the new one.',
    },
  ],
  lanes: [
    {
      nodes: [
        {
          label: { es: 'ESCRITA', en: 'WRITTEN' },
          strong: true,
          step: 1,
          aside: [
            { text: { es: 'Lleva fecha, razón y un solo tema.', en: 'Dated, with its reason, one topic.' } },
            { text: { es: 'Aquí se decide si merece existir.', en: 'Here you decide it should exist.' } },
          ],
        },
        {
          label: { es: 'RECORDADA', en: 'RECALLED' },
          strong: true,
          step: 2,
          aside: [
            { text: { es: 'Vuelve en una búsqueda y se usa.', en: 'A search brings it back into use.' } },
            { text: { es: 'Es una pista, falta comprobarla.', en: 'It is a lead, not yet a fact.' } },
          ],
        },
        {
          label: { es: 'VENCIDA', en: 'STALE' },
          emphasis: 'accent',
          step: 3,
          aside: [
            { text: { es: 'El código cambió y la nota no.', en: 'The code changed; the note did not.' } },
            { text: { es: 'Nada la marca: sigue activa.', en: 'Nothing flags it: still active.' }, strong: true },
          ],
        },
        {
          label: { es: 'REEMPLAZADA', en: 'REPLACED' },
          strong: true,
          step: 4,
          aside: [
            { text: { es: 'Una nota nueva dice cuál gana.', en: 'A newer note says which one wins.' } },
            { text: { es: 'La vieja apunta a la nueva.', en: 'The old one points to the new one.' } },
          ],
        },
      ],
    },
  ],
}

export default {
  'agent-memory-sample-types': sampleTypes,
  'agent-memory-lifecycle': lifecycle,
} satisfies FigureSet
