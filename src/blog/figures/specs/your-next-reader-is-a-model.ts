import type { TracksFigure } from '../renderers/tracks'
import type { FigureSet } from '../types'

const whole = { es: 'LLEGA ENTERA', en: 'ARRIVES WHOLE' }
const lost = { es: 'PIERDE EL REFERENTE', en: 'LOSES ITS REFERENT' }

const extraction: TracksFigure = {
  type: 'tracks',
  steps: [
    {
      es: 'La frase que nombra su sujeto llega entera: no dependía de la anterior.',
      en: 'The sentence that names its subject arrives whole: it never depended on the one before.',
    },
    {
      es: 'El número con su método también llega entero, siempre que el método esté en la misma frase.',
      en: 'The number with its method arrives whole too, provided the method is in the same sentence.',
    },
    {
      es: 'El pronombre sin antecedente llega como palabras y sin referente: «esto» señala algo que se quedó atrás.',
      en: 'The pronoun with no antecedent arrives as words, minus the referent: "this" points at something left behind.',
    },
    {
      es: 'La referencia a la página corre la misma suerte: «la tabla de arriba» se quedó atrás.',
      en: 'The reference to the page meets the same fate: "the table above" was left behind.',
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
      title: { es: 'Pronombre sin antecedente', en: 'Pronoun with no antecedent' },
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
