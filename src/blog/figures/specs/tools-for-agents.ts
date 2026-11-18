import type { CompareFigure } from '../renderers/compare'
import type { FigureSet } from '../types'

const steps: CompareFigure = {
  type: 'compare',
  layout: 'table',
  steps: [
    {
      es: 'Elegir: el modelo lee el nombre y la descripción. Falla llamando a otra herramienta, o a ninguna.',
      en: 'Pick: the model reads the name and the description. It fails by calling another tool, or none.',
    },
    {
      es: 'Llenar: lee los nombres de los parámetros y su esquema. Falla inventando o confundiendo un valor.',
      en: 'Fill: it reads the parameter names and their schema. It fails by inventing or mixing up a value.',
    },
    {
      es: 'Leer: lee el resultado devuelto. Falla perdiéndose entre filas e identificadores.',
      en: 'Read: it reads the returned result. It fails by getting lost among rows and identifiers.',
    },
    {
      es: 'Corregir: lee el mensaje de error. Falla repitiendo la misma llamada.',
      en: 'Recover: it reads the error message. It fails by repeating the same call.',
    },
  ],
  corner: { es: 'PASO', en: 'STEP' },
  columns: [
    { heading: { es: 'LO QUE LEE EL MODELO', en: 'WHAT THE MODEL READS' } },
    { heading: { es: 'CÓMO FALLA', en: 'HOW IT FAILS' }, emphasis: true },
  ],
  rows: [
    {
      title: { es: '1. ELEGIR', en: '1. PICK' },
      cells: [
        { text: { es: 'nombre y descripción', en: 'name and description' } },
        { text: { es: 'llama a otra, o a ninguna', en: 'calls another one, or none' } },
      ],
      step: 1,
    },
    {
      title: { es: '2. LLENAR', en: '2. FILL' },
      cells: [
        { text: { es: 'nombres de parámetros y su esquema', en: 'parameter names and their schema' } },
        { text: { es: 'inventa o confunde un valor', en: 'invents or mixes up a value' } },
      ],
      step: 2,
    },
    {
      title: { es: '3. LEER', en: '3. READ' },
      cells: [
        { text: { es: 'el resultado devuelto', en: 'the returned result' } },
        { text: { es: 'se pierde entre filas e ids', en: 'gets lost among rows and ids' } },
      ],
      step: 3,
    },
    {
      title: { es: '4. CORREGIR', en: '4. RECOVER' },
      cells: [
        { text: { es: 'el mensaje de error', en: 'the error message' } },
        { text: { es: 'repite la misma llamada', en: 'repeats the same call' } },
      ],
      step: 4,
    },
  ],
}

const contrast: CompareFigure = {
  type: 'compare',
  layout: 'side',
  steps: [
    {
      es: 'El nombre: get_tasks describe el endpoint. buscar_tareas_atrasadas describe la tarea.',
      en: 'The name: get_tasks describes the endpoint. find_overdue_tasks describes the task.',
    },
    {
      es: 'Los parámetros: id, f y n no dicen de qué son. proyecto_id y dias_atraso llevan unidad y ejemplo.',
      en: 'The parameters: id, f and n do not say what they refer to. project_id and days_overdue come with a unit and an example.',
    },
    {
      es: 'El resultado: todas las filas con ids internos, o 20 filas, el total y cómo pedir las siguientes.',
      en: 'The result: every row with internal ids, or 20 rows, the total and how to ask for the next ones.',
    },
    {
      es: 'El error: 400 Bad Request, o un mensaje que dice qué no existe y qué herramienta usar.',
      en: 'The error: 400 Bad Request, or a message that says what was not found and which tool to use.',
    },
  ],
  corner: { es: 'PARTE', en: 'PART' },
  columns: [
    { heading: { es: 'ENVUELVE EL ENDPOINT', en: 'WRAPS THE ENDPOINT' } },
    { heading: { es: 'HECHA PARA LA TAREA', en: 'BUILT FOR THE TASK' }, emphasis: true },
  ],
  rows: [
    {
      title: { es: 'NOMBRE', en: 'NAME' },
      cells: [
        { text: 'get_tasks' },
        { text: { es: 'buscar_tareas_atrasadas', en: 'find_overdue_tasks' } },
      ],
      step: 1,
    },
    {
      title: { es: 'PARÁMETROS', en: 'PARAMETERS' },
      cells: [
        { text: 'id, f, n', note: { es: '¿id de qué?', en: 'id of what?' } },
        {
          text: { es: 'proyecto_id, dias_atraso', en: 'project_id, days_overdue' },
          note: { es: 'con unidad y ejemplo', en: 'with unit and example' },
        },
      ],
      step: 2,
    },
    {
      title: { es: 'RESULTADO', en: 'RESULT' },
      cells: [
        { text: { es: 'todas las filas, ids internos', en: 'every row, internal ids' } },
        {
          text: {
            es: '20 filas, el total y cómo pedir las siguientes',
            en: '20 rows, the total, and how to ask for the next',
          },
        },
      ],
      step: 3,
    },
    {
      title: { es: 'ERROR', en: 'ERROR' },
      cells: [
        { text: '400 Bad Request' },
        { text: { es: 'proyecto_id no existe. Usa buscar_proyectos', en: 'project_id not found. Use find_projects' } },
      ],
      step: 4,
    },
  ],
}

export default {
  'agent-tools-steps': steps,
  'agent-tools-contrast': contrast,
} satisfies FigureSet
