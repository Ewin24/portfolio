/**
 * What the reader has already deciphered, and when.
 *
 * A post that has been opened stays legible on return — the blog turns an
 * atmospheric effect into an actual information channel, the same trick the
 * lineage already pulls off. Guarded exactly the way `ThemeContext.tsx`
 * guards `THEME_STORAGE_KEY` (`:54-63`, `:104-108`): try/catch around both
 * read and write, a safe default in the catch, never a thrown error and
 * never a deleted key. Explicitly not modelled on the unguarded
 * `AppContext.tsx` pattern that Commit 0 of this change fixed — copying an
 * unguarded call site would only spread the bug.
 *
 * Stored shape: a JSON array, oldest first, whose items are either
 *   - `"slug"`              a legacy mark from before dates were kept, or
 *   - `["slug", "isoDate"]` a mark with the first time it was read.
 * Legacy strings are written back as strings, so they stay undated rather
 * than gaining an invented date. Code that only understands the old shape
 * filters to strings and simply does not see the dated marks.
 *
 * Everything under that key is READ. An article that was opened but not
 * finished is STARTED, and lives under a second key so the first one never
 * changes shape: `portfolio-reading-progress`, a JSON object of
 *   `slug → [fraction, isoDate]`
 * where the fraction (0 to 1) is the furthest point of the body reached and
 * the date is when it was last saved. Reaching the end moves the article to
 * the read key and drops its entry here.
 */

import { useSyncExternalStore } from 'react'

/** Matches the `portfolio-lang` / `portfolio-theme` prefix convention. */
const KEY = 'portfolio-read-posts'

/** The key cannot grow without bound — keep only the most recent slugs. */
const CAP = 200

/** slug → ISO date of the first read, or null for a legacy undated mark. */
let cache: Map<string, string | null> | null = null

function load(): Map<string, string | null> {
  if (cache) return cache

  cache = new Map()
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    if (Array.isArray(raw)) {
      for (const item of raw) {
        if (typeof item === 'string') {
          if (!cache.has(item)) cache.set(item, null)
        } else if (
          Array.isArray(item) &&
          item.length === 2 &&
          typeof item[0] === 'string' &&
          typeof item[1] === 'string'
        ) {
          // The first date wins; a dated entry upgrades an undated duplicate.
          if (cache.get(item[0]) == null) cache.set(item[0], item[1])
        }
      }
    }
  } catch {
    // No storage, or a value that is not ours. Everything stays ciphered,
    // which is exactly today's behaviour — never an error, never a reset.
  }

  return cache
}

// ─── Started articles ────────────────────────────────────────────────────────

const PROGRESS_KEY = 'portfolio-reading-progress'

/** Unfinished articles worth remembering; the oldest saves fall off. */
const PROGRESS_CAP = 50

/** Scrolling reports a position on every frame; storage hears of it this often. */
const WRITE_EVERY_MS = 400

type Progress = [fraction: number, savedAt: string]

let progress: Map<string, Progress> | null = null
let pendingWrite: ReturnType<typeof setTimeout> | null = null

function loadProgress(): Map<string, Progress> {
  if (progress) return progress

  progress = new Map()
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '{}')
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      for (const [slug, item] of Object.entries(raw)) {
        if (
          Array.isArray(item) &&
          item.length === 2 &&
          typeof item[0] === 'number' &&
          item[0] >= 0 &&
          item[0] <= 1 &&
          typeof item[1] === 'string'
        ) {
          progress.set(slug, [item[0], item[1]])
        }
      }
    }
  } catch {
    // No storage, or a value that is not ours: nothing is started. Reading
    // never clears the key.
  }

  return progress
}

function writeProgress(): void {
  if (pendingWrite) clearTimeout(pendingWrite)
  pendingWrite = null
  try {
    const items = [...loadProgress()].sort((a, b) => a[1][1].localeCompare(b[1][1])).slice(-PROGRESS_CAP)
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(Object.fromEntries(items)))
  } catch {
    // Persistence is a nicety; the session still knows.
  }
  notify()
}

/**
 * Remembers how far into an article the reader got (0 to 1). The furthest
 * point wins, so scrolling back up never loses the place. The first call for
 * an article is what makes it started and is written at once; later ones are
 * throttled. An article that is already read is left alone.
 */
export function saveProgress(slug: string, fraction: number): void {
  if (load().has(slug) || !Number.isFinite(fraction)) return
  const map = loadProgress()
  const known = map.get(slug)
  const next = Math.min(1, Math.max(0, fraction, known?.[0] ?? 0))
  if (known && next === known[0]) return

  map.set(slug, [next, new Date().toISOString()])
  if (!known) writeProgress()
  else pendingWrite ??= setTimeout(writeProgress, WRITE_EVERY_MS)
}

/** Writes a throttled position now. For when the article is being left. */
export function flushProgress(): void {
  if (pendingWrite) writeProgress()
}

/** The reader reached the end: read from now on, and no position to resume. */
export function finishReading(slug: string): void {
  markRead(slug)
  if (loadProgress().delete(slug)) writeProgress()
  else notify()
}

// ─── What the components see ─────────────────────────────────────────────────

export type ReadState = 'unread' | 'started' | 'read'

/** An immutable view of both keys; a new object whenever either changes. */
export interface ReadSnapshot {
  /** unread, started (opened, not finished) or read. */
  stateOf(slug: string): ReadState
  /** 0 to 1 for a started article, otherwise null. */
  progressOf(slug: string): number | null
}

function takeSnapshot(): ReadSnapshot {
  const read = load()
  const started = loadProgress()
  return {
    stateOf: (slug) => (read.has(slug) ? 'read' : started.has(slug) ? 'started' : 'unread'),
    progressOf: (slug) => (read.has(slug) ? null : started.get(slug)?.[0] ?? null),
  }
}

let snapshot: ReadSnapshot | null = null
const listeners = new Set<() => void>()

function notify(): void {
  snapshot = null
  for (const listener of listeners) listener()
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): ReadSnapshot {
  return (snapshot ??= takeSnapshot())
}

/** The reading state, re-rendering the caller whenever an article starts, advances or is finished. */
export function useReadSnapshot(): ReadSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot)
}

// ─── Read articles ───────────────────────────────────────────────────────────

export function readPosts(): Set<string> {
  return new Set(load().keys())
}

/** ISO date of the first read; null when unread or when the mark is undated. */
export function readAt(slug: string): string | null {
  return load().get(slug) ?? null
}

/** Marks a post read now. A post that is already marked keeps its date. */
export function markRead(slug: string): void {
  const map = load()
  if (map.has(slug)) return
  map.set(slug, new Date().toISOString())

  try {
    const items = [...map].slice(-CAP).map(([s, at]) => (at === null ? s : [s, at]))
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // Persistence is a nicety; the session still knows.
  }
}

/**
 * The visible read mark: "Leído el 17 nov 2026" / "Read on Nov 17, 2026",
 * plain "Leído" / "Read" for an undated (or unparseable) mark, null if unread.
 */
export function readLabel(slug: string, lang: 'es' | 'en'): string | null {
  const map = load()
  if (!map.has(slug)) return null

  const read = lang === 'es' ? 'Leído' : 'Read'
  const date = new Date(map.get(slug) ?? NaN)
  if (Number.isNaN(date.getTime())) return read

  const day = new Intl.DateTimeFormat(lang, { dateStyle: 'medium' }).format(date)
  return `${read} ${lang === 'es' ? 'el' : 'on'} ${day}`
}
