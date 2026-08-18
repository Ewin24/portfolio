import { Suspense, useRef, type ReactNode } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import { lazyBook } from './preload'
import type { VoxelFigureProps } from './VoxelFigure'
import type { AnnunciationCanvasProps } from './Annunciation'
import type { TheIceProps } from './TheIce'
import type { TheWindProps } from './TheWind'
import type { DecipherProps } from './Decipher'
import type { CrucibleProps } from './Crucible'
import type { InsomniaTagProps } from './InsomniaTag'

/**
 * The book's lazy boundary.
 *
 * `ThemeContext`, `chapters.ts` and `BookToggle` are how a visitor enters the
 * book, so they stay eager, along with `attrs.ts` (a zero-dep leaf) and this
 * file. Everything the book actually paints — the voxel engine, the
 * butterflies, the ice, the wind, the deciphering text — loads behind a
 * dynamic import, so a newspaper-default first load never pays for it.
 *
 * No file moves. The engine components keep their existing paths and export
 * names; call sites change only which module they import from.
 *
 * `lazyBook` and `preloadBook` themselves live in `preload.ts`: it exports no
 * components, only functions, keeping this file's fast-refresh boundary
 * clean (a component-only module can hot-reload; mixing in a plain function
 * export here would opt this whole file out of that).
 */

// ─── BookStage ──────────────────────────────────────────────────────────────

const BookStageLazy = lazyBook<object>(
  () => import('./BookStage').then((m) => ({ default: m.BookStage })),
  () => null,
)

/** Renders nothing at all outside the book theme, and only then loads the
 *  chunk — mirrors the original component's own early return. */
export function BookStage() {
  const { theme } = useTheme()
  if (theme !== 'book') return null
  return (
    <Suspense fallback={null}>
      <BookStageLazy />
    </Suspense>
  )
}

// ─── VoxelFigure ────────────────────────────────────────────────────────────

const VoxelFigureLazy = lazyBook<VoxelFigureProps>(
  () => import('./VoxelFigure').then((m) => ({ default: m.VoxelFigure })),
  () => null,
)

export function VoxelFigure(props: VoxelFigureProps) {
  if (!props.active) return null
  return (
    <Suspense fallback={null}>
      <VoxelFigureLazy {...props} />
    </Suspense>
  )
}

// ─── Annunciation ───────────────────────────────────────────────────────────

const AnnunciationCanvasLazy = lazyBook<AnnunciationCanvasProps>(
  () => import('./Annunciation').then((m) => ({ default: m.AnnunciationCanvas })),
  () => null,
)

interface AnnunciationProps {
  active: boolean
  still: boolean
  children: ReactNode
}

/** Split shell (design D8): the host and the cards stay eager and mounted
 *  regardless of theme, so they never remount when the theme flips — only
 *  the canvas layer comes and goes behind Suspense. */
export function Annunciation({ active, still, children }: AnnunciationProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={hostRef} className="annunciation-host">
      {active && (
        <Suspense fallback={null}>
          <AnnunciationCanvasLazy active={active} still={still} hostRef={hostRef} />
        </Suspense>
      )}
      {children}
    </div>
  )
}

// ─── TheIce / TheWind — plain children shim ────────────────────────────────

const TheIceLazy = lazyBook<TheIceProps>(
  () => import('./TheIce').then((m) => ({ default: m.TheIce })),
  ({ children }) => <>{children}</>,
)

export function TheIce({ active, still, children }: TheIceProps) {
  if (!active) return <>{children}</>
  return (
    <Suspense fallback={<>{children}</>}>
      <TheIceLazy active={active} still={still}>{children}</TheIceLazy>
    </Suspense>
  )
}

const TheWindLazy = lazyBook<TheWindProps>(
  () => import('./TheWind').then((m) => ({ default: m.TheWind })),
  ({ children }) => <>{children}</>,
)

export function TheWind({ active, still, children }: TheWindProps) {
  if (!active) return <>{children}</>
  return (
    <Suspense fallback={<>{children}</>}>
      <TheWindLazy active={active} still={still}>{children}</TheWindLazy>
    </Suspense>
  )
}

// ─── Decipher — text fallback, never blanks the real string ───────────────

function decipherFallback({ text, className = '' }: DecipherProps) {
  return <span className={className}>{text}</span>
}

const DecipherLazy = lazyBook<DecipherProps>(
  () => import('./Decipher').then((m) => ({ default: m.Decipher })),
  decipherFallback,
)

export function Decipher(props: DecipherProps) {
  if (!props.active) return decipherFallback(props)
  return <Suspense fallback={decipherFallback(props)}><DecipherLazy {...props} /></Suspense>
}

// ─── Crucible — before/after fallback, matches its own off-theme output ───

function crucibleFallback({ before, after, beforeLabel, afterLabel }: CrucibleProps) {
  return (
    <>
      <div>
        <p
          data-landmark="problem"
          className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent mb-1"
        >
          {beforeLabel}
        </p>
        {before}
      </div>
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
          {afterLabel}
        </p>
        {after}
      </div>
    </>
  )
}

const CrucibleLazy = lazyBook<CrucibleProps>(
  () => import('./Crucible').then((m) => ({ default: m.Crucible })),
  crucibleFallback,
)

export function Crucible(props: CrucibleProps) {
  if (!props.active) return crucibleFallback(props)
  return <Suspense fallback={crucibleFallback(props)}><CrucibleLazy {...props} /></Suspense>
}

// ─── InsomniaTag ────────────────────────────────────────────────────────────
//
// Call sites already gate this behind `theme === 'book'` before rendering it
// at all (the label they pass in is null otherwise), so there is no active
// prop to check here — only a text fallback so the label is never blanked.

const InsomniaTagLazy = lazyBook<InsomniaTagProps>(
  () => import('./InsomniaTag').then((m) => ({ default: m.InsomniaTag })),
  ({ text }) => <span className="insomnia-tag-fallback">{text}</span>,
)

export function InsomniaTag(props: InsomniaTagProps) {
  return (
    <Suspense fallback={<span className="insomnia-tag-fallback">{props.text}</span>}>
      <InsomniaTagLazy {...props} />
    </Suspense>
  )
}
