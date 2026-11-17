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
 */

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
