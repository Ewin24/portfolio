import type { ComponentType } from 'react'
import type { Language } from '../../types'

/** Every visible string of a figure, in both languages. */
export interface L {
  es: string
  en: string
}

/** What every description has, whatever its type. */
export interface FigureBase {
  /** The renderer: the file name in `renderers/` without its extension. */
  type: string
  /** One narration line per step, in order. Its length is the number of steps. */
  steps: L[]
}

/** What a renderer component receives from the shell. */
export interface RendererProps<D extends FigureBase> {
  figure: D
  lang: Language
  /** The step being shown, from 1 to `figure.steps.length`. */
  step: number
}

/** The numbers of a data chart, as the shell's table shows them. */
export interface FigureTable {
  head: string[]
  rows: string[][]
}

/**
 * The default export of every file in `renderers/`: the component that draws
 * the stage, with what the shell needs to know about a description attached to
 * it as static members.
 */
export type Renderer<D extends FigureBase = FigureBase> = ComponentType<RendererProps<D>> & {
  /** The 1-based step of every element the description holds; the shell checks them against `steps`. */
  stepsUsed(figure: D): number[]
  /** Data charts only: the chart's numbers. Its presence is what adds the "data" toggle. */
  table?(figure: D, lang: Language): FigureTable
}

/** The default export of every file in `specs/`: descriptions keyed by figure id. */
export type FigureSet = Record<string, FigureBase>

/** A label in the reader's language; a plain string is the same in both (an identifier, a number). */
export function text(value: L | string, lang: Language): string {
  return typeof value === 'string' ? value : value[lang]
}

export type RevealKind = 'box' | 'label' | 'grow' | 'draw' | 'wipe'

/**
 * The attributes that tie an element to its step. Spread them on the element:
 * `<div className="fig-node" {...reveal(node.step, step)}>`. The stylesheet does
 * the rest: an element is hidden until its step is reached, and `kind` picks the
 * entrance (`box` fades and slides, `label` fades, `grow` scales a bar from its
 * baseline, `draw` strokes an SVG line along its length, `wipe` uncovers an
 * elbow connector from its start).
 */
export function reveal(at: number, step: number, kind: RevealKind = 'box') {
  return { 'data-step': at, 'data-on': at <= step, 'data-reveal': kind }
}
