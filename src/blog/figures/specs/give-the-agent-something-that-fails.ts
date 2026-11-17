import type { FlowFigure } from '../renderers/flow'
import type { FigureSet } from '../types'

const generate = { es: 'generar', en: 'generate' }

const loops: FlowFigure = {
  type: 'flow',
  layout: 'rows',
  steps: [
    { es: 'Con una descripción: describir, generar y leer.', en: 'With a description: describe, generate and read.' },
    {
      es: 'Se repite mientras alguien juzga si el resultado se parece.',
      en: 'It repeats while someone judges whether the result is close enough.',
    },
    { es: 'Sale cuando alguien opina que ya está.', en: 'It ends when someone feels it is done.' },
    {
      es: 'Con algo que falla: una prueba en rojo, generar y ejecutar.',
      en: 'With something that fails: a failing test, generate and run.',
    },
    { es: 'Se repite mientras la prueba siga en rojo.', en: 'It repeats while the test is still red.' },
    { es: 'Sale cuando el comando pasa.', en: 'It ends when the command passes.' },
  ],
  lanes: [
    {
      title: { es: 'A. CON UNA DESCRIPCIÓN', en: 'A. WITH A DESCRIPTION' },
      nodes: [
        { label: { es: 'describir', en: 'describe' }, step: 1 },
        { label: generate, step: 1 },
        { label: { es: 'leer', en: 'read' }, step: 1 },
      ],
      loop: { to: 2, label: { es: '¿se parece? otra vuelta', en: 'close enough? go again' }, step: 2 },
      note: { text: { es: 'Sale cuando alguien opina que ya está.', en: 'Ends when someone feels it is done.' }, step: 3 },
    },
    {
      title: { es: 'B. CON ALGO QUE FALLA', en: 'B. WITH SOMETHING THAT FAILS' },
      nodes: [
        { label: { es: 'prueba en rojo', en: 'failing test' }, emphasis: 'accent', step: 4 },
        { label: generate, step: 4 },
        { label: { es: 'ejecutar', en: 'run' }, step: 4 },
      ],
      loop: { to: 2, label: { es: 'sigue en rojo: otra vuelta', en: 'still red: go again' }, step: 5 },
      note: { text: { es: 'Sale cuando el comando pasa.', en: 'Ends when the command passes.' }, step: 6, strong: true },
    },
  ],
}

export default { 'agent-contract-loops': loops } satisfies FigureSet
