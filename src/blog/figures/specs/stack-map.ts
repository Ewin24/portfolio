import { STACK, STACK_CASES, inStack, shortTitle } from '../../../content/stack'
import type { GridFigure } from '../renderers/grid'
import type { FigureSet, L } from '../types'

// The technology by case-study map of the stack section. Nothing is typed by
// hand: rows, marks, counts and every narration line are computed from the
// alias table and the case studies, so the figure cannot drift from the data.

const total = STACK_CASES.length

const groups = STACK.map((area, i) => ({
  label: area.label,
  step: i + 1,
  /** Case studies that name at least one technology of the area. */
  count: area.cases.length,
  rows: area.technologies.map((tech) => ({
    label: tech.name,
    marks: STACK_CASES.map((study) => inStack(tech, study.stack)),
  })),
}))

const most = Math.max(...groups.map((group) => group.count))
const top = groups.filter((group) => group.count === most)
const lastStep = groups.length + 1

const perRow = (rows: { label: string; marks: boolean[] }[], word: string) =>
  rows.map((row) => `${row.label} ${word} ${row.marks.filter(Boolean).length}`).join(', ')

const list = (items: string[], and: string) =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`

const areaLine = (group: (typeof groups)[number]): L => ({
  es: `${group.label.es}: ${group.count} de ${total} casos de estudio ${group.count === 1 ? 'nombra' : 'nombran'} alguna de sus tecnologías. ${perRow(group.rows, 'en')}.`,
  en: `${group.label.en}: ${group.count} of ${total} case studies ${group.count === 1 ? 'names' : 'name'} one of its technologies. ${perRow(group.rows, 'in')}.`,
})

const topLine: L = top.length === 1
  ? {
      es: `El área presente en más casos de estudio es ${top[0].label.es}: ${most} de ${total}.`,
      en: `The area present in the most case studies is ${top[0].label.en}: ${most} of ${total}.`,
    }
  : {
      es: `Las áreas presentes en más casos de estudio son ${list(top.map((g) => g.label.es), 'y')}: ${most} de ${total} cada una.`,
      en: `The areas present in the most case studies are ${list(top.map((g) => g.label.en), 'and')}: ${most} of ${total} each.`,
    }

const map: GridFigure = {
  type: 'grid',
  heads: [{ es: 'Área', en: 'Area' }, { es: 'Tecnología', en: 'Technology' }],
  columnsLabel: { es: 'Casos de estudio', en: 'Case studies' },
  columns: STACK_CASES.map((study) => ({ es: shortTitle(study, 'es'), en: shortTitle(study, 'en') })),
  yes: { es: 'sí', en: 'yes' },
  none: { es: 'en ningún caso de estudio', en: 'in no case study' },
  steps: [...groups.map(areaLine), topLine],
  groups: groups.map((group) => ({
    label: group.label,
    step: group.step,
    note: { es: `${group.count} de ${total}`, en: `${group.count} of ${total}` },
    tag: group.count === most ? { label: { es: 'más casos', en: 'most studies' }, step: lastStep } : undefined,
    rows: group.rows,
  })),
}

export default { 'stack-map': map } satisfies FigureSet
