import type { FlowFigure } from '../renderers/flow'
import type { LadderFigure } from '../renderers/ladder'
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

const ladder: LadderFigure = {
  type: 'ladder',
  direction: 'up',
  steps: [
    { es: 'Abajo, la descripción: se cumple si se parece.', en: 'At the bottom, the description: met if it looks close enough.' },
    { es: 'Un criterio escrito: una persona marca sí o no.', en: 'A written criterion: a person ticks yes or no.' },
    {
      es: 'Un ejemplo con su resultado: entrada y salida esperada, por escrito.',
      en: 'An example with its result: input and expected output, written down.',
    },
    { es: 'Arriba, una comprobación que hoy falla: la juzga un comando.', en: 'At the top, a check that fails today: a command judges it.' },
    {
      es: 'Cada peldaño es más comprobable. La regla es subir el encargo un peldaño antes de entregarlo.',
      en: 'Each rung is more checkable. The rule is to move the request up one rung before handing it over.',
    },
  ],
  axis: { label: { es: 'más comprobable →', en: 'more checkable →' }, step: 5 },
  rungs: [
    {
      number: 1,
      title: { es: 'DESCRIPCIÓN', en: 'DESCRIPTION' },
      text: { es: 'Se cumple si se parece.', en: 'Met if it looks close enough.' },
      step: 1,
    },
    {
      number: 2,
      title: { es: 'CRITERIO ESCRITO', en: 'WRITTEN CRITERION' },
      text: { es: 'Una persona marca sí o no.', en: 'A person ticks yes or no.' },
      step: 2,
    },
    {
      number: 3,
      title: { es: 'EJEMPLO CON RESULTADO', en: 'EXAMPLE WITH ITS RESULT' },
      text: { es: 'Entrada y salida esperada, por escrito.', en: 'Input and expected output, written down.' },
      step: 3,
    },
    {
      number: 4,
      title: { es: 'COMPROBACIÓN QUE FALLA HOY', en: 'A CHECK THAT FAILS TODAY' },
      text: { es: 'La juzga un comando.', en: 'A command judges it.' },
      style: 'accent',
      step: 4,
    },
  ],
}

export default { 'agent-contract-loops': loops, 'agent-contract-ladder': ladder } satisfies FigureSet
