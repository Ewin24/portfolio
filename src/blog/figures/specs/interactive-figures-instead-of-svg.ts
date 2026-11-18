import type { BarsFigure } from '../renderers/bars'
import type { FlowFigure } from '../renderers/flow'
import type { FigureSet } from '../types'

// Measured on this branch against main with `npm run build`: JS plus CSS in
// dist/assets, gzip, summed. Recorded in odd/tasks/interactive-figures.md (L9).
const costBytes: BarsFigure = {
  type: 'bars',
  columns: [
    { es: 'Build', en: 'Build' },
    { es: 'Bytes (gzip)', en: 'Bytes (gzip)' },
  ],
  note: { es: 'JavaScript + CSS, bytes con gzip', en: 'JavaScript + CSS, gzip bytes' },
  steps: [
    {
      es: 'Con los 40 archivos SVG, el total de JavaScript y CSS con gzip era de 444,549 bytes.',
      en: 'With the 40 SVG files, total JavaScript and CSS after gzip was 444,549 bytes.',
    },
    {
      es: 'Con el componente es de 466,634 bytes: 22,085 más. El sitio ahora pesa más.',
      en: 'With the component it is 466,634 bytes: 22,085 more. The site is heavier now.',
    },
  ],
  bars: [
    { label: { es: 'antes: 40 archivos SVG', en: 'before: 40 SVG files' }, value: 444549, display: '444,549', tone: 'muted', step: 1 },
    { label: { es: 'después: componente propio', en: 'after: in-house component' }, value: 466634, display: '466,634', tone: 'accent', strong: true, step: 2 },
  ],
}

const embedPipeline: FlowFigure = {
  type: 'flow',
  layout: 'rows',
  steps: [
    {
      es: 'El artículo coloca la figura con la sintaxis de imagen de siempre y una ruta que empieza con figure/.',
      en: 'The article places the figure with the usual image syntax and a path that starts with figure/.',
    },
    {
      es: 'El conversor de markdown reconoce esa ruta y deja un nodo vacío con el identificador y el texto alternativo.',
      en: 'The markdown parser recognises that path and leaves an empty node holding the id and the alt text.',
    },
    {
      es: 'El cuerpo del artículo sigue siendo un único contenedor con el HTML del conversor.',
      en: 'The article body is still a single container holding the parser\'s HTML.',
    },
    {
      es: 'Un portal de React monta la figura dentro del nodo vacío.',
      en: 'A React portal mounts the figure inside the empty node.',
    },
    {
      es: 'El armazón común pone el reproductor y la línea de narración.',
      en: 'The shared shell adds the player and the narration line.',
    },
    {
      es: 'El renderizador del tipo dibuja la figura a partir de su descripción.',
      en: 'The renderer for that type draws the figure from its description.',
    },
  ],
  lanes: [
    {
      title: { es: 'al convertir el markdown', en: 'when the markdown is parsed' },
      nodes: [
        { label: { es: 'sintaxis de imagen', en: 'image syntax' }, sub: { es: 'ruta figure/<id>', en: 'figure/<id> path' }, step: 1 },
        { label: { es: 'conversor', en: 'parser' }, sub: { es: 'deja un nodo vacío', en: 'leaves an empty node' }, step: 2 },
        { label: { es: 'cuerpo del artículo', en: 'article body' }, sub: { es: 'un solo contenedor', en: 'one container' }, step: 3 },
      ],
    },
    {
      title: { es: 'en la página', en: 'on the page' },
      nodes: [
        { label: { es: 'portal', en: 'portal' }, sub: { es: 'monta en el nodo', en: 'mounts into the node' }, step: 4 },
        { label: { es: 'armazón', en: 'shell' }, sub: { es: 'reproductor y narración', en: 'player and narration' }, step: 5 },
        { label: { es: 'renderizador', en: 'renderer' }, sub: { es: 'dibuja desde la descripción', en: 'draws from the description' }, emphasis: 'accent', step: 6 },
      ],
    },
  ],
}

export default {
  'figures-cost-bytes': costBytes,
  'figures-embed-pipeline': embedPipeline,
} satisfies FigureSet
