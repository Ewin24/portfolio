import { lazy, type ComponentType } from 'react'
import { THEME_STORAGE_KEY } from '../../theme/ThemeContext'

/**
 * The book's preload machinery, split out from `lazy.tsx` itself: this file
 * exports no components, only functions, so it does not trip the fast-refresh
 * "only exports components" rule the way mixing them in one file would.
 *
 * Two attempts, then a silent degrade rather than an error boundary: a
 * rejected `React.lazy` promise otherwise unmounts the whole subtree — a
 * white page for someone who merely toggled the theme. One retry covers a
 * transient network blip; the second covers a stale-hash 404 after a
 * redeploy, which no retry fixes anyway. The degraded state stays coherent
 * because the theme, the chapter palette and the real text around these
 * components are all eager already.
 */
export function lazyBook<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  degraded: ComponentType<P>,
) {
  preloadQueue.push(() => loader().catch(() => undefined))
  return lazy(() => loader().catch(loader).catch(() => ({ default: degraded })))
}

const preloadQueue: Array<() => Promise<unknown>> = []
let preloaded = false

/** Fire every registered chunk load, idempotently. Call on hover/focus of
 *  the book toggle, well before the visitor actually needs any of it. */
export function preloadBook(): void {
  if (preloaded) return
  preloaded = true
  for (const load of preloadQueue) load()
}

// A returning book visitor should not wait for React to render the toggle
// before the fetch starts. No <link rel="modulepreload"> in index.html —
// that would touch the GEO byte-diff — so this module-eval guard is the
// earliest hook available.
try {
  if (localStorage.getItem(THEME_STORAGE_KEY) === 'book') preloadBook()
} catch {
  // Private mode or blocked storage — the first hover/focus still preloads.
}
