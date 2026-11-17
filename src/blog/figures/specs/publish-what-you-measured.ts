import type { LadderFigure } from '../renderers/ladder'
import type { FigureSet } from '../types'

const check: LadderFigure = {
  type: 'ladder',
  direction: 'down',
  steps: [
    { es: 'La afirmación: el lector solo puede creerla o no.', en: 'The claim: the reader can only believe it or not.' },
    {
      es: 'El número sin método: el lector puede comparar y preguntar, pero no repetirlo.',
      en: 'The number without a method: the reader can compare and ask, but cannot rerun it.',
    },
    {
      es: 'El número con su método publicado: el lector puede repetirlo y refutarlo.',
      en: 'The number with its method published: the reader can rerun it and refute it.',
    },
    { es: 'Del 1 al 3 crece lo que el lector puede verificar.', en: 'From 1 to 3, what the reader can check grows.' },
  ],
  axis: { step: 4 },
  note: { text: { es: 'Más verificable por el lector, de 1 a 3', en: 'More checkable by the reader, from 1 to 3' }, step: 4 },
  rungs: [
    {
      number: 1,
      title: { es: 'AFIRMACIÓN', en: 'CLAIM' },
      text: { es: 'SQL Server, Clean Architecture, Dapper', en: 'SQL Server, Clean Architecture, Dapper' },
      detail: { es: 'El lector puede: creer o no creer', en: 'The reader can: believe it or not' },
      style: 'dashed',
      step: 1,
    },
    {
      number: 2,
      title: { es: 'NÚMERO SIN MÉTODO', en: 'NUMBER WITHOUT METHOD' },
      text: { es: 'consultas: de 3s a 400ms', en: 'query times: from 3s to 400ms' },
      detail: { es: 'El lector puede: comparar y preguntar', en: 'The reader can: compare and ask' },
      style: 'filled',
      step: 2,
    },
    {
      number: 3,
      title: { es: 'NÚMERO CON MÉTODO', en: 'NUMBER WITH METHOD' },
      text: { es: '13,339 de 20,000 + el bucle que lo cuenta', en: '13,339 of 20,000 + the loop that counts it' },
      strong: { es: 'El lector puede: repetirlo y refutarlo', en: 'The reader can: rerun it and refute it' },
      style: 'accent',
      step: 3,
    },
  ],
}

export default { 'publish-measured-check': check } satisfies FigureSet
