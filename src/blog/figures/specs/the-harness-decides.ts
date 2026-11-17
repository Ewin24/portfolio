import type { LayersFigure } from '../renderers/layers'
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

// Outside in, as the layers are numbered; the model, the one piece the accent marks, comes last.
const layers: LayersFigure = {
  type: 'layers',
  steps: [
    {
      es: 'La capa de afuera es cómo se parte el trabajo: decide cuánto puede salir mal de una sola vez.',
      en: 'The outer layer is how the work is split: it decides how much can go wrong in one go.',
    },
    {
      es: 'Las reglas le dicen al agente qué se espera, pero una regla no impide nada.',
      en: 'Rules tell the agent what is expected, but a rule prevents nothing.',
    },
    {
      es: 'La lista de lo que puede tocar limita el daño de un error. No dice si lo que se escribió es correcto.',
      en: 'The list of what it may touch limits the damage of a mistake. It does not say whether what was written is correct.',
    },
    {
      es: 'Las comprobaciones dicen si es correcto, siempre que puedan fallar.',
      en: 'Checks say whether it is correct, provided they can fail.',
    },
    {
      es: 'Las condiciones de parada cubren lo que ninguna comprobación puede saber.',
      en: 'Stop conditions cover what no check can know.',
    },
    {
      es: 'En el centro queda el modelo: lo que se compara, y la pieza que un equipo solo puede elegir. Las cinco de afuera las escribe el equipo.',
      en: 'In the middle sits the model: what gets compared, and the one piece a team can only choose. The five around it are written by the team.',
    },
  ],
  layers: [
    { label: { es: 'cómo se parte el trabajo', en: 'how the work is split' }, step: 1 },
    { label: { es: 'reglas que lee antes de escribir', en: 'rules it reads before writing' }, step: 2 },
    { label: { es: 'archivos y comandos que puede tocar', en: 'files and commands it may touch' }, step: 3 },
    { label: { es: 'comprobaciones que debe pasar', en: 'checks its work must pass' }, step: 4 },
    { label: { es: 'cuándo para y pregunta', en: 'when it stops and asks' }, step: 5 },
  ],
  core: {
    title: { es: 'modelo', en: 'model' },
    text: { es: 'lo que se compara', en: 'what gets compared' },
    step: 6,
  },
}

export default { 'harness-rule-test': ruleTest, 'harness-layers': layers } satisfies FigureSet
