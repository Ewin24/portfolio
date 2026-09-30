/**
 * What the reader has already deciphered.
 *
 * A post that has been opened stays legible on return — the blog turns an
 * atmospheric effect into an actual information channel, the same trick the
 * lineage already pulls off. Guarded exactly the way `ThemeContext.tsx`
 * guards `THEME_STORAGE_KEY` (`:54-63`, `:104-108`): try/catch around both
 * read and write, a safe default in the catch, never a thrown error and
 * never a deleted key. Explicitly not modelled on the unguarded
 * `AppContext.tsx` pattern that Commit 0 of this change fixed — copying an
 * unguarded call site would only spread the bug.
 */

/** Matches the `portfolio-lang` / `portfolio-theme` prefix convention. */
const KEY = 'portfolio-read-posts'

/** The key cannot grow without bound — keep only the most recent slugs. */
const CAP = 200

let cache: Set<string> | null = null

export function readPosts(): Set<string> {
  if (cache) return cache

  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    cache = new Set(
      Array.isArray(raw) ? raw.filter((s): s is string => typeof s === 'string') : [],
    )
  } catch {
    // No storage, or a value that is not ours. Everything stays ciphered,
    // which is exactly today's behaviour — never an error, never a reset.
    cache = new Set()
  }

  return cache
}

export function markRead(slug: string): void {
  const set = readPosts()
  set.add(slug)

  try {
    localStorage.setItem(KEY, JSON.stringify([...set].slice(-CAP)))
  } catch {
    // Persistence is a nicety; the session still knows.
  }
}
