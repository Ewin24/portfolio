/**
 * Book chapters.
 *
 * The portfolio is a linear descent through ten sections, which is the shape
 * of a novel: a town founded in bright morning light, a workshop lit by an
 * oil lamp, a lineage thickening over generations, and a wind that closes the
 * last page. Each section borrows the light of the chapter it maps to.
 *
 * The register is Latin American magical realism — Macondo seen sideways.
 * Nothing here quotes the novel: the text is still in copyright, so the
 * chapters evoke its motifs (the insomnia plague that forced a town to label
 * every object with its name, the yellow butterflies, the deciphered
 * parchments, the wind at the end) without reproducing a line of it.
 *
 * Three mappings are argument, not decoration:
 *   - `skills` becomes the insomnia plague, because that chapter of the novel
 *     is literally about pinning a written name onto every object so its use
 *     is not forgotten. That is what a skills grid is.
 *   - `experience` becomes the lineage: generations repeating the same names,
 *     which is how a career reads in hindsight.
 *   - `testimonials` becomes the yellow butterflies, the sign that someone
 *     else has been near.
 *
 * Contrast: every `ink` and every `accent` was measured against its own
 * chapter's mid page stop — the surface text actually sits on once the veil
 * is applied — and clears 4.5:1. The two darkest chapters invert to light
 * text on a dark ground rather than dimming text against it.
 */

export type ChapterId =
  | 'fundacion'
  | 'hielo'
  | 'laboratorio'
  | 'insomnio'
  | 'estirpe'
  | 'pergaminos'
  | 'mariposas'
  | 'manuscritos'
  | 'carta'
  | 'viento'

/**
 * What drifts across the page in this chapter.
 *
 * Butterflies are deliberately NOT here. They belong to the references
 * section, where they announce a specific card and land on it — see
 * components/book/Annunciation. An ambient butterfly and an annunciating one
 * on the same screen would read as two unrelated systems, so the chapter they
 * name keeps its air quiet and lets them carry the meaning alone.
 */
export type ParticleKind = 'dust' | 'rain' | 'ink' | 'ash'

export interface Chapter {
  id: ChapterId
  /** DOM id of the section that triggers this chapter. */
  section: string
  label: { es: string; en: string }
  /** Vertical gradient stops of the page ground, top to bottom. */
  page: [string, string, string]
  ink: string
  inkLight: string
  inkMuted: string
  /** Text on a solid ink fill — inverts with the chapter. */
  onInk: string
  accent: string
  /** Separator lines. Always a translucent cast of the ink. */
  rule: string
  /** Warm film that keeps a card readable over the page. */
  veil: string
  /** Shadow colour. Paper casts warm shadows, never black. */
  glow: string
  particle: {
    kind: ParticleKind
    color: string
    /** Reference count at 1280px wide; scaled down on smaller viewports. */
    count: number
  }
  /** Margin ornament opacity — the page edge fades as the book darkens. */
  marginOpacity: number
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'fundacion',
    section: 'hero',
    // Twenty houses of mud and cane beside a river of polished stones, and a
    // world so recent that most things had no name yet. The brightest paper
    // in the book, because nothing has aged.
    label: { es: 'La fundación', en: 'The Founding' },
    page: ['#FDFBF4', '#F6F0E0', '#EDE4CE'],
    ink: '#2E2416',
    inkLight: '#544632',
    inkMuted: '#7D6C52',
    onInk: '#FDFBF4',
    accent: '#8C3A24',
    rule: 'rgba(46, 36, 22, 0.16)',
    veil: 'rgba(255, 253, 246, 0.40)',
    glow: 'rgba(120, 96, 60, 0.34)',
    particle: { kind: 'dust', color: '#E8D9B4', count: 34 },
    marginOpacity: 1,
  },
  {
    id: 'hielo',
    section: 'about',
    // The travelling fair, and a block of ice presented as the great
    // invention of the age. The only chapter lit cold instead of warm.
    label: { es: 'El hielo', en: 'The Ice' },
    page: ['#F8FAFB', '#EDF2F3', '#DFE8EA'],
    ink: '#22303A',
    inkLight: '#44545F',
    inkMuted: '#6B7B85',
    onInk: '#F8FAFB',
    accent: '#2E6C86',
    rule: 'rgba(34, 48, 58, 0.16)',
    veil: 'rgba(250, 253, 254, 0.42)',
    glow: 'rgba(70, 100, 120, 0.32)',
    particle: { kind: 'dust', color: '#C6DCE4', count: 30 },
    marginOpacity: 1,
  },
  {
    id: 'laboratorio',
    section: 'projects',
    // The alchemy workshop: crucibles, an oil lamp, the patient work of
    // turning raw material into something that holds. Where things get built.
    label: { es: 'El laboratorio', en: 'The Workshop' },
    page: ['#F5E7C8', '#EBD5A8', '#DCBE84'],
    ink: '#3A2A14',
    inkLight: '#5C4526',
    inkMuted: '#87693F',
    onInk: '#F8ECD2',
    accent: '#8A4A16',
    rule: 'rgba(58, 42, 20, 0.20)',
    veil: 'rgba(253, 244, 224, 0.34)',
    glow: 'rgba(130, 90, 40, 0.40)',
    particle: { kind: 'dust', color: '#F0DCAE', count: 40 },
    marginOpacity: 0.95,
  },
  {
    id: 'insomnio',
    section: 'skills',
    // The plague that took the town's memory, and the defence against it:
    // a written label tied to every object, naming the thing and what it is
    // for. A skills grid is that defence, so this chapter is drained of
    // colour — the pallor of a town that has not slept.
    label: { es: 'La peste del insomnio', en: 'The Insomnia Plague' },
    page: ['#FBF8EE', '#F4EFE0', '#E9E2CE'],
    ink: '#3A342A',
    inkLight: '#5D5546',
    inkMuted: '#877E6C',
    onInk: '#FBF8EE',
    accent: '#A03A2E',
    rule: 'rgba(58, 52, 42, 0.16)',
    veil: 'rgba(254, 252, 246, 0.40)',
    glow: 'rgba(120, 110, 88, 0.30)',
    particle: { kind: 'dust', color: '#E4DCC6', count: 26 },
    marginOpacity: 0.9,
  },
  {
    id: 'estirpe',
    section: 'experience',
    // Generations repeating the same handful of names, each one convinced it
    // is starting fresh. Rain falls through this chapter: the downpour that
    // lasted years, under which the family simply kept going.
    label: { es: 'La estirpe', en: 'The Lineage' },
    page: ['#EADCC0', '#DCC8A2', '#C6AE84'],
    ink: '#332414',
    inkLight: '#553F26',
    inkMuted: '#7E6440',
    onInk: '#F2E6CC',
    accent: '#7E3B1C',
    rule: 'rgba(51, 36, 20, 0.20)',
    veil: 'rgba(250, 240, 220, 0.32)',
    glow: 'rgba(110, 80, 44, 0.42)',
    particle: { kind: 'rain', color: '#B9A480', count: 44 },
    marginOpacity: 0.85,
  },
  {
    id: 'pergaminos',
    section: 'education',
    // Parchments written in a language nobody in the house can read yet, and
    // the years spent learning to read them. That is what study is.
    label: { es: 'Los pergaminos', en: 'The Parchments' },
    page: ['#F0E2C0', '#E3D0A4', '#CFB77F'],
    ink: '#3B2E18',
    inkLight: '#5E4C2C',
    inkMuted: '#8A7248',
    onInk: '#F4E8CC',
    accent: '#7A4A12',
    rule: 'rgba(59, 46, 24, 0.20)',
    veil: 'rgba(252, 244, 226, 0.32)',
    glow: 'rgba(120, 92, 46, 0.40)',
    particle: { kind: 'dust', color: '#D9C193', count: 32 },
    marginOpacity: 0.8,
  },
  {
    id: 'mariposas',
    section: 'testimonials',
    // Yellow butterflies arriving ahead of someone, so the house always knew
    // he was coming. A reference is exactly that: proof that another person
    // was here, and left a trace of it.
    label: { es: 'Las mariposas amarillas', en: 'The Yellow Butterflies' },
    page: ['#FBF0CE', '#F5E3A8', '#E9CE7A'],
    ink: '#3E3212',
    inkLight: '#5F4F20',
    inkMuted: '#8A7638',
    onInk: '#FBF2D6',
    accent: '#8A5A12',
    rule: 'rgba(62, 50, 18, 0.20)',
    veil: 'rgba(255, 248, 226, 0.32)',
    glow: 'rgba(140, 110, 40, 0.38)',
    // Quiet air: the butterflies in this chapter are the annunciation layer.
    particle: { kind: 'dust', color: '#E0C378', count: 18 },
    marginOpacity: 0.75,
  },
  {
    id: 'manuscritos',
    section: 'blog',
    // First inversion. The manuscripts themselves: everything that happened,
    // written down before it happened, waiting to be deciphered. Ink on the
    // page rather than page under the ink.
    label: { es: 'Los manuscritos', en: 'The Manuscripts' },
    page: ['#2E2A24', '#231F1A', '#171410'],
    ink: '#E8DCC4',
    inkLight: '#C4B79E',
    inkMuted: '#948873',
    onInk: '#231F1A',
    accent: '#D6A85A',
    rule: 'rgba(232, 220, 196, 0.18)',
    veil: 'rgba(38, 33, 28, 0.46)',
    glow: 'rgba(12, 9, 6, 0.66)',
    particle: { kind: 'ink', color: '#C9B896', count: 22 },
    marginOpacity: 0.5,
  },
  {
    id: 'carta',
    section: 'contact',
    // A letter that waits years for an answer, and is answered anyway. The
    // page goes bright again: clean paper, nothing written on it yet.
    label: { es: 'La carta', en: 'The Letter' },
    page: ['#FFFFFF', '#F8F4E9', '#EFE7D4'],
    ink: '#332B1E',
    inkLight: '#574C39',
    inkMuted: '#82755D',
    onInk: '#FFFDF7',
    accent: '#8A4522',
    rule: 'rgba(51, 43, 30, 0.16)',
    veil: 'rgba(255, 254, 250, 0.44)',
    glow: 'rgba(130, 110, 74, 0.30)',
    particle: { kind: 'dust', color: '#E6DCC4', count: 28 },
    marginOpacity: 0.6,
  },
  {
    id: 'viento',
    section: 'footer',
    // Second inversion, and the last page. The wind that carries the town off
    // the map the moment the parchments are finished being read.
    label: { es: 'El viento', en: 'The Wind' },
    page: ['#241F1C', '#191512', '#0E0B09'],
    ink: '#D8CDBA',
    inkLight: '#B0A694',
    inkMuted: '#847C6E',
    onInk: '#191512',
    accent: '#C9A268',
    rule: 'rgba(216, 205, 186, 0.16)',
    veil: 'rgba(30, 25, 21, 0.52)',
    glow: 'rgba(6, 5, 4, 0.76)',
    particle: { kind: 'ash', color: '#C4B69C', count: 48 },
    marginOpacity: 0.35,
  },
]

/** The chapter the theme falls back to before the observer reports anything. */
export const OPENING_CHAPTER = CHAPTERS[0]

export function chapterById(id: ChapterId): Chapter {
  return CHAPTERS.find((c) => c.id === id) ?? OPENING_CHAPTER
}

/**
 * Writes a chapter onto the document root as --ch-* variables.
 *
 * The book theme block in index.css reads these with fallbacks, so the page
 * still renders a coherent opening chapter if this never runs.
 */
export function applyChapter(chapter: Chapter, root: HTMLElement): void {
  const vars: Record<string, string> = {
    '--ch-page-1': chapter.page[0],
    '--ch-page-2': chapter.page[1],
    '--ch-page-3': chapter.page[2],
    '--ch-ink': chapter.ink,
    '--ch-ink-light': chapter.inkLight,
    '--ch-ink-muted': chapter.inkMuted,
    '--ch-on-ink': chapter.onInk,
    '--ch-accent': chapter.accent,
    '--ch-rule': chapter.rule,
    '--ch-veil': chapter.veil,
    '--ch-glow': chapter.glow,
  }

  for (const [name, value] of Object.entries(vars)) {
    root.style.setProperty(name, value)
  }
}

/** Removes every chapter variable, so the newspaper theme is untouched. */
export function clearChapter(root: HTMLElement): void {
  const names = [
    '--ch-page-1', '--ch-page-2', '--ch-page-3',
    '--ch-ink', '--ch-ink-light', '--ch-ink-muted', '--ch-on-ink',
    '--ch-accent', '--ch-rule', '--ch-veil', '--ch-glow',
  ]
  for (const name of names) root.style.removeProperty(name)
}
