import type { MatrixAxis, MatrixFigure } from '../renderers/matrix'
import type { FigureSet } from '../types'

const yesNo: MatrixAxis['ticks'] = [{ es: 'sí', en: 'yes' }, { es: 'no', en: 'no' }]

const ruleTest: MatrixFigure = {
  type: 'matrix',
  axesStep: 1,
  steps: [
    {
      es: 'Dos preguntas por regla: si nació de un fallo real y si algo puede comprobarla.',
      en: 'Two questions per rule: did a real failure cause it, and can something check it.',
    },
    { es: 'Nació de un fallo y algo la comprueba: se queda.', en: 'It came from a failure and something checks it: keep it.' },
    {
      es: 'Sin fallo pero comprobable: queda a prueba. Si nunca bloquea nada, sobra.',
      en: 'No failure but checkable: on probation. If it never blocks anything, drop it.',
    },
    {
      es: 'Sin fallo y sin comprobación: borrar. Es ceremonia que cuesta y no protege.',
      en: 'No failure and no check: delete it. It is ceremony that costs and protects nothing.',
    },
    {
      es: 'Nació de un fallo y nada la comprueba: hay que volverla prueba, porque se lee y se ignora.',
      en: 'It came from a failure and nothing checks it: make it a check, because it gets read and then ignored.',
    },
  ],
  x: { label: { es: '¿algo puede comprobarla?', en: 'can something check it?' }, ticks: yesNo },
  y: { label: { es: '¿nació de un fallo real?', en: 'did a real failure cause it?' }, ticks: yesNo },
  cells: [
    {
      title: { es: '1. SE QUEDA', en: '1. KEEP' },
      text: { es: 'Tiene causa y algo la hace cumplir.', en: 'It has a cause and something enforces it.' },
      step: 2,
    },
    {
      title: { es: '2. VOLVERLA PRUEBA', en: '2. MAKE IT A CHECK' },
      text: { es: 'Si nada la comprueba, queda de adorno.', en: 'If nothing checks it, it is decoration.' },
      tag: { es: 'se lee y se ignora', en: 'read, then ignored' },
      emphasis: true,
      step: 5,
    },
    {
      title: { es: '3. A PRUEBA', en: '3. ON PROBATION' },
      text: { es: 'Si nunca bloquea nada, sobra.', en: 'If it never blocks anything, drop it.' },
      step: 3,
    },
    {
      title: { es: '4. BORRAR', en: '4. DELETE' },
      text: { es: 'Ceremonia: cuesta y no protege.', en: 'Ceremony: it costs and protects nothing.' },
      step: 4,
    },
  ],
}

export default { 'harness-rule-test': ruleTest } satisfies FigureSet
