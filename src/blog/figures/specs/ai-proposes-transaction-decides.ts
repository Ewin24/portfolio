import type { FlowFigure } from '../renderers/flow'
import type { FigureSet } from '../types'

const lanes: FlowFigure = {
  type: 'flow',
  layout: 'columns',
  steps: [
    {
      es: 'El carril del modelo: requisito escrito, modelo y validación de esquema.',
      en: 'The model lane: written requirement, model and schema validation.',
    },
    { es: 'Lo que sale es una propuesta, y queda pendiente.', en: 'What comes out is a proposal, and it stays pending.' },
    {
      es: 'Ahí termina la autoridad del modelo: su carril no llega a los datos.',
      en: "The model's authority ends there: its lane does not reach the data.",
    },
    {
      es: 'La propuesta pasa al carril determinístico, donde una persona confirma.',
      en: 'The proposal moves to the deterministic lane, where a person confirms.',
    },
    {
      es: 'Las guardas comprueban permiso, estado y plazo. El commit escribe todo o nada y queda un registro de la decisión.',
      en: 'Guards check permission, state and expiry. The commit writes all or nothing and a record of the decision is kept.',
    },
    { es: 'Solo entonces se llega a los datos del producto.', en: 'Only then is the product data reached.' },
  ],
  link: { step: 4 },
  lanes: [
    {
      title: { es: 'EL MODELO PROPONE', en: 'THE MODEL PROPOSES' },
      tone: 'muted',
      nodes: [
        { label: { es: 'requisito escrito', en: 'written requirement' }, step: 1 },
        { label: { es: 'modelo', en: 'model' }, step: 1 },
        { label: { es: 'validación de esquema', en: 'schema validation' }, step: 1 },
        { label: { es: 'PROPUESTA', en: 'PROPOSAL' }, sub: { es: 'pendiente', en: 'pending' }, emphasis: 'soft', step: 2 },
      ],
      end: { label: { es: 'aquí termina su autoridad', en: 'its authority ends here' }, step: 3 },
    },
    {
      title: { es: 'UNA TRANSACCIÓN DECIDE', en: 'A TRANSACTION DECIDES' },
      nodes: [
        { label: { es: 'una persona confirma', en: 'a person confirms' }, step: 4 },
        {
          label: { es: 'guardas', en: 'guards' },
          sub: { es: 'permiso, estado, plazo', en: 'permission, state, expiry' },
          step: 5,
        },
        { label: { es: 'commit: todo o nada', en: 'commit: all or nothing' }, step: 5 },
        { label: { es: 'registro de la decisión', en: 'record of the decision' }, step: 5 },
        { label: { es: 'DATOS DEL PRODUCTO', en: 'PRODUCT DATA' }, emphasis: 'invert', step: 6 },
      ],
    },
  ],
}

export default { 'ai-proposes-lanes': lanes } satisfies FigureSet
