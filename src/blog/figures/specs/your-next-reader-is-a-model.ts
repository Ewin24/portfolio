import type { TracksFigure } from '../renderers/tracks'
import type { FigureSet } from '../types'

const whole = { es: 'LLEGA ENTERA', en: 'ARRIVES WHOLE' }
const lost = { es: 'PIERDE SU SENTIDO', en: 'LOSES ITS MEANING' }

const extraction: TracksFigure = {
  type: 'tracks',
  steps: [
    {
      es: 'La frase que nombra su sujeto llega entera, porque no dependía de la anterior.',
      en: 'The sentence that names its subject arrives whole, because it never depended on the one before.',
    },
    {
      es: 'El número también llega entero cuando su método está en la misma frase.',
      en: 'The number also arrives whole when its method is in the same sentence.',
    },
    {
      es: 'El pronombre que apunta a otra frase llega como una palabra suelta: «esto» señala algo que se quedó en la página.',
      en: 'The pronoun that points to another sentence arrives as a loose word: "this" points at something that stayed on the page.',
    },
    {
      es: 'A la referencia a la página le pasa lo mismo: «la tabla de arriba» se quedó en la página.',
      en: 'The same happens to the reference to the page: "the table above" stayed on the page.',
    },
  ],
  stages: [
    { es: 'PÁGINA', en: 'PAGE' },
    { es: 'EXTRACCIÓN', en: 'EXTRACTION' },
    { es: 'RESPUESTA DEL MODELO', en: "THE MODEL'S ANSWER" },
  ],
  rows: [
    {
      title: { es: 'Frase que nombra su sujeto', en: 'Sentence that names its subject' },
      example: { es: '«El grep sin mayúsculas no ve camelCase»', en: '"A case-insensitive grep misses camelCase"' },
      outcome: whole,
      step: 1,
    },
    {
      title: { es: 'Número con su método', en: 'Number with its method' },
      example: { es: '«anterior en 13,339 de 20,000 ejecuciones»', en: '"earlier in 13,339 of 20,000 runs"' },
      outcome: whole,
      step: 2,
    },
    {
      title: { es: 'Pronombre que apunta afuera', en: 'Pronoun that points outside' },
      example: { es: '«Esto es lo que cambié en el proceso»', en: '"This is what I changed in the process"' },
      outcome: lost,
      lost: true,
      step: 3,
    },
    {
      title: { es: 'Referencia a la página', en: 'Reference to the page' },
      example: { es: '«Como muestra la tabla de arriba»', en: '"As the table above shows"' },
      outcome: lost,
      lost: true,
      step: 4,
    },
  ],
}

export default { 'next-reader-extraction': extraction } satisfies FigureSet
