import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, X } from 'lucide-react'
import MiniSearch from 'minisearch'
import { useTranslation } from '../../hooks/useTranslation'
import { useBlogContext } from '../context/BlogContext'
import { EmptyState } from './EmptyState'
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
  const { posts } = useBlogContext()
  const [query, setQuery] = useState(defaultQuery)
  const [results, setResults] = useState<BlogPost[]>([])
  const [isIndexed, setIsIndexed] = useState(false)
  const miniSearchRef = useRef<MiniSearch | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync external defaultQuery changes (e.g., from hash route)
  useEffect(() => {
    if (defaultQuery) setQuery(defaultQuery)
  }, [defaultQuery])

  const debouncedQuery = useDebounce(query, 200)

  // Build MiniSearch index on mount
  useEffect(() => {
    const miniSearch = new MiniSearch({
      fields: ['title', 'titleEn', 'tags', 'excerpt', 'excerptEn'],
      storeFields: ['id', 'slug', 'title', 'titleEn', 'excerpt', 'excerptEn', 'tags', 'date', 'readingTime'],
      searchOptions: {
        boost: { title: 3, titleEn: 3, tags: 2, excerpt: 1, excerptEn: 1 },
        fuzzy: 0.2,
        prefix: true,
      },
    })

    miniSearch.addAll(posts)
    miniSearchRef.current = miniSearch
    setIsIndexed(true)

    return () => {
      miniSearchRef.current = null
    }
  }, [posts])

  // Search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim() || !miniSearchRef.current) {
      setResults([])
      return
    }

    const rawResults = miniSearchRef.current.search(debouncedQuery)
    const matchedPosts = rawResults
      .map((r) => posts.find((p) => p.id === r.id))
      .filter((p): p is BlogPost => p !== undefined)

    setResults(matchedPosts)
  }, [debouncedQuery, posts])

  const handleClear = useCallback(() => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }, [])

  const handleSelect = useCallback(
    (post: BlogPost) => {
      window.location.hash = `#blog/article/${post.slug}`
      setQuery('')
      setResults([])
    },
    [],
  )

  const hasQuery = query.trim().length > 0
  const hasResults = results.length > 0

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
          className="w-full border-2 border-ink bg-paper px-9 py-2.5 font-mono text-xs text-ink placeholder:text-ink-muted outline-none focus:bg-paper-dark transition-colors"
          aria-label={lang === 'es' ? 'Buscar artículos' : 'Search articles'}
        />
        {hasQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-accent transition-colors cursor-pointer"
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
            className="border-x-2 border-b-2 border-ink bg-paper shadow-pixel-sm mt-0"
          >
            {!isIndexed ? (
              <div className="p-4 text-center">
                <p className="font-mono text-[10px] text-ink-muted">
                  {lang === 'es' ? 'Indexando…' : 'Indexing…'}
                </p>
              </div>
            ) : !hasResults ? (
              <div className="p-4">
                <EmptyState context="search" searchQuery={debouncedQuery} />
              </div>
            ) : (
              <ul className="divide-y divide-rule-light">
                {results.map((post) => {
                  const title = lang === 'es' ? post.title : post.titleEn
                  const excerpt = lang === 'es' ? post.excerpt : post.excerptEn
                  return (
                    <li key={post.id}>
                      <button
                        onClick={() => handleSelect(post)}
                        className="w-full text-left px-4 py-3 hover:bg-paper-dark transition-colors cursor-pointer"
                      >
                        <h4 className="font-headline text-sm font-bold text-ink leading-tight mb-1">
                          {highlightText(title, debouncedQuery)}
                        </h4>
                        <p className="font-sans text-[11px] text-ink-light leading-relaxed line-clamp-2">
                          {highlightText(excerpt, debouncedQuery)}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="font-mono text-[9px] text-ink-muted">{post.date}</span>
                          <span className="font-mono text-[9px] text-ink-muted">{post.readingTime} min</span>
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
