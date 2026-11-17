import type { MatrixFigure } from '../renderers/matrix'
import type { FigureSet } from '../types'

const matrix: MatrixFigure = {
  type: 'matrix',
  axesStep: 1,
  steps: [
    {
      es: 'Dos preguntas por hipótesis: cuánto cuesta refutarla y qué tan probable parece.',
      en: 'Two questions per hypothesis: what it costs to refute and how likely it seems.',
    },
    { es: 'Probable y barata: probar ya.', en: 'Likely and cheap: test now.' },
    {
      es: 'Probable y cara: probar después, cuando las baratas se agoten.',
      en: 'Likely and expensive: test later, once the cheap ones are exhausted.',
    },
    {
      es: 'Improbable y cara: aparcar hasta que algo la vuelva probable.',
      en: 'Unlikely and expensive: park it until something makes it likely.',
    },
    {
      es: 'Improbable y barata: probar igual, es casi gratis. Es la que se suele saltar.',
      en: 'Unlikely and cheap: test it anyway, it is almost free. It is the one people usually skip.',
    },
  ],
  x: {
    label: { es: 'costo de refutar →', en: 'cost to refute →' },
    ticks: [{ es: 'bajo', en: 'low' }, { es: 'alto', en: 'high' }],
  },
  y: {
    label: { es: 'qué tan probable parece →', en: 'how likely it seems →' },
    ticks: [{ es: 'alta', en: 'high' }, { es: 'baja', en: 'low' }],
  },
  cells: [
    {
      title: { es: '1. PROBAR YA', en: '1. TEST NOW' },
      text: { es: 'Parece probable y cuesta poco.', en: 'Seems likely and cheap to refute.' },
      step: 2,
    },
    {
      title: { es: '3. PROBAR DESPUÉS', en: '3. TEST LATER' },
      text: { es: 'Cuando las baratas se agoten.', en: 'Once the cheap ones are exhausted.' },
      step: 3,
    },
    {
      title: { es: '2. PROBAR IGUAL', en: '2. TEST ANYWAY' },
      text: { es: 'Parece improbable, pero es casi gratis.', en: 'Seems unlikely, but it is almost free.' },
      tag: { es: 'la que se salta', en: 'the one people skip' },
      emphasis: true,
      step: 5,
    },
    {
      title: { es: '4. APARCAR', en: '4. PARK' },
      text: { es: 'Hasta que algo la vuelva probable.', en: 'Until something makes it likely.' },
      step: 4,
    },
  ],
}

export default { 'hypotheses-matrix': matrix } satisfies FigureSet
