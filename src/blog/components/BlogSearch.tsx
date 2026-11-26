import { useState, useEffect, useMemo, useRef, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, X } from 'lucide-react'
import MiniSearch from 'minisearch'
import { useTranslation } from '../../hooks/useTranslation'
import { useBlogContext } from '../context/BlogContext'
import { EmptyState } from './EmptyState'
import { useReadSnapshot } from '../readState'
import { formatPostDate } from '../hooks/postDate'
import type { BlogPost } from '../types'

// ─── Helpers ───────────────────────────────────────────────────────────────

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Split text at query boundaries and wrap matches in `<mark>`.
 */
function highlightText(text: string, query: string): (string | ReactNode)[] {
  if (!query.trim()) return [text]
  const escaped = escapeRegex(query)
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-accent/20 text-ink font-bold px-0.5 rounded-none">{part}</mark>
      : part,
  )
}

// ─── Debounce hook ─────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

// ─── Component ─────────────────────────────────────────────────────────────

export function BlogSearch({ defaultQuery = '' }: { defaultQuery?: string }) {
  const { lang } = useTranslation()
  const { posts, setSearchQuery, unreadOnly } = useBlogContext()
  const readState = useReadSnapshot()
  const [query, setQuery] = useState(defaultQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  // Follow a new defaultQuery (e.g., from the hash route), adjusted during
  // render; an empty one leaves what the reader typed.
  const [seenDefault, setSeenDefault] = useState(defaultQuery)
  if (defaultQuery !== seenDefault) {
    setSeenDefault(defaultQuery)
    if (defaultQuery) setQuery(defaultQuery)
  }

  const debouncedQuery = useDebounce(query, 200)

  // The list reads the query from the context: while searching it has no lead.
  useEffect(() => {
    setSearchQuery(query)
  }, [query, setSearchQuery])

  const miniSearch = useMemo(() => {
    const index = new MiniSearch({
      fields: ['title', 'titleEn', 'tags', 'excerpt', 'excerptEn'],
      storeFields: ['id', 'slug', 'title', 'titleEn', 'excerpt', 'excerptEn', 'tags', 'date', 'readingTime'],
      searchOptions: {
        boost: { title: 3, titleEn: 3, tags: 2, excerpt: 1, excerptEn: 1 },
        fuzzy: 0.2,
        prefix: true,
      },
    })
    index.addAll(posts)
    return index
  }, [posts])

  // The debounced query drives the search; clearing the input empties the
  // results at once, without waiting for the debounce.
  const results = useMemo(() => {
    if (!query.trim() || !debouncedQuery.trim()) return []
    return miniSearch
      .search(debouncedQuery)
      .map((r) => posts.find((p) => p.id === r.id))
      .filter((p): p is BlogPost => p !== undefined)
  }, [query, debouncedQuery, miniSearch, posts])

  const handleClear = useCallback(() => {
    setQuery('')
    inputRef.current?.focus()
  }, [])

  const handleSelect = useCallback((post: BlogPost) => {
    window.location.hash = `#blog/article/${post.slug}`
    setQuery('')
  }, [])

  const hasQuery = query.trim().length > 0
  // The Unread toggle of the filters hides read articles here too, as it does in the list.
  const shown = unreadOnly ? results.filter((post) => readState.stateOf(post.slug) !== 'read') : results
  const hasResults = shown.length > 0

  return (
    <div className="mb-8">
      {/* Search input */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            lang === 'es'
              ? 'Buscar artículos…'
              : 'Search articles…'
          }
          className="w-full border-2 border-rule bg-paper px-9 py-2.5 font-mono text-xs text-ink placeholder:text-ink-muted outline-none focus:bg-paper-dark transition-colors"
          aria-label={lang === 'es' ? 'Buscar artículos' : 'Search articles'}
        />
        {hasQuery && (
          <button
            onClick={handleClear}
            className="hit-44 absolute right-1 top-1/2 -translate-y-1/2 px-2 text-ink-muted hover:text-accent transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {hasQuery && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="border-x-2 border-b-2 border-rule bg-paper shadow-pixel-sm mt-0"
          >
            {!hasResults ? (
              <div className="p-4">
                <EmptyState context="search" searchQuery={debouncedQuery} />
              </div>
            ) : (
              <ul className="divide-y divide-rule-light">
                {shown.map((post) => {
                  const title = lang === 'es' ? post.title : post.titleEn
                  const excerpt = lang === 'es' ? post.excerpt : post.excerptEn
                  return (
                    <li key={post.id} data-search-slug={post.slug}>
                      <button
                        onClick={() => handleSelect(post)}
                        className="w-full text-left px-4 py-3 hover:bg-paper-dark transition-colors cursor-pointer"
                      >
                        <h4 className="font-headline text-sm font-bold text-ink leading-tight mb-1">
                          {highlightText(title, debouncedQuery)}
                        </h4>
                        <p className="font-sans text-xs text-ink-light leading-relaxed line-clamp-2">
                          {highlightText(excerpt, debouncedQuery)}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="font-mono text-xs text-ink-muted">{formatPostDate(post.date, lang)}</span>
                          <span className="font-mono text-xs text-ink-muted">{post.readingTime} min</span>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
