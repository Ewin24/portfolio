import type { FigureBase, FigureSet, Renderer } from './types'

// Both folders are discovered, so a new renderer or a new article's figures
// are one new file and no edit here.
// ponytail: eager globs put every renderer and description in the blog chunk;
// switch to lazy imports per article if that chunk's growth starts to matter.
const rendererFiles = import.meta.glob<{ default: Renderer }>('./renderers/*.tsx', { eager: true })
const specFiles = import.meta.glob<{ default: FigureSet }>('./specs/*.ts', { eager: true })

const renderers = new Map<string, Renderer>()
for (const [path, file] of Object.entries(rendererFiles)) {
  renderers.set(path.slice(path.lastIndexOf('/') + 1, -'.tsx'.length), file.default)
}

const figures = new Map<string, FigureBase>()
for (const [path, file] of Object.entries(specFiles)) {
  for (const [id, figure] of Object.entries(file.default)) {
    // Ids are site-wide. In production the first description wins.
    if (figures.has(id)) {
      if (import.meta.env.DEV) throw new Error(`Figure id "${id}" is declared twice (second time in ${path})`)
      continue
    }
    figures.set(id, figure)
  }
}

export interface ResolvedFigure {
  figure: FigureBase
  renderer: Renderer
}

/**
 * The description and its renderer, or null when the id is unknown, the type
 * has no renderer, or the description is not playable (no steps, or an element
 * placed on a step that does not exist). Null means: show the fallback.
 */
export function resolveFigure(id: string): ResolvedFigure | null {
  const figure = figures.get(id)
  const renderer = figure && renderers.get(figure.type)
  const count = figure && Array.isArray(figure.steps) ? figure.steps.length : 0
  const why = !figure
    ? 'no description has this id'
    : !renderer
      ? `no renderer for type "${figure.type}"`
      : count === 0
        ? 'it has no steps'
        : !renderer.stepsUsed(figure).every((s) => Number.isInteger(s) && s >= 1 && s <= count)
          ? 'an element sits on a step that does not exist'
          : null
  if (why || !figure || !renderer) {
    // The reader gets the alt text either way; the author gets the reason while writing.
    if (import.meta.env.DEV) console.warn(`[figures] "${id}" falls back to its alt text: ${why}`)
    return null
  }
  return { figure, renderer }
}
