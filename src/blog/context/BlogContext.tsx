import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react'
import type { BlogPost, BlogFilter, BlogRoute } from '../types'
import { blogPosts } from '../content/posts'
import { applyBlogFilters } from '../hooks/useBlogFilters'
import { useReadSnapshot } from '../readState'

// ─── Defaults ────────────────────────────────────────────────────────────────

const defaultFilter: BlogFilter = {
  tags: [],
  category: null,
  dateRange: null,
}

/**
 * The "unread only" choice, for the session. The list and an open article are
 * two provider instances (App mounts the blog twice, one per view), so state
 * alone would forget it on the way to an article and back.
 */
let rememberedUnreadOnly = false

// ─── Context Type ─────────────────────────────────────────────────────────────

export interface BlogContextType {
  /** All posts (unsorted — use filteredPosts for display) */
  posts: BlogPost[]
  /** Filtered + sorted posts (newest first) */
  filteredPosts: BlogPost[]
  /** Currently selected article */
  selectedPost: BlogPost | null
  /** Active filter */
  filter: BlogFilter
  /** Current search query */
  searchQuery: string
  /** Active route */
  currentRoute: BlogRoute
  /** Current pagination page */
  page: number
  /** Only articles that are not read yet. Kept apart from `filter`, which the router resets on every route. */
  unreadOnly: boolean

  // Setters
  setFilter: (filter: BlogFilter) => void
  setSearchQuery: (query: string) => void
  setSelectedPost: (post: BlogPost | null) => void
  setCurrentRoute: (route: BlogRoute) => void
  setPage: (page: number) => void
  setUnreadOnly: (unreadOnly: boolean) => void
  clearFilters: () => void
}

// ─── Context ─────────────────────────────────────────────────────────────────

const BlogContext = createContext<BlogContextType | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function BlogProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<BlogFilter>(defaultFilter)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [currentRoute, setCurrentRoute] = useState<BlogRoute>('list')
  const [page, setPage] = useState(1)
  const [unreadOnly, setUnreadOnlyState] = useState(rememberedUnreadOnly)
  const setUnreadOnly = useCallback((next: boolean) => {
    rememberedUnreadOnly = next
    setUnreadOnlyState(next)
  }, [])
  const readState = useReadSnapshot()

  const clearFilters = useCallback(() => {
    setFilter(defaultFilter)
    setSearchQuery('')
    setPage(1)
    setUnreadOnly(false)
  }, [setUnreadOnly])

  // Derive filteredPosts: sort newest first, then apply filter
  const matchingPosts = useMemo(() => {
    const sorted = [...blogPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    return applyBlogFilters(sorted, filter)
  }, [filter])

  // "Unread" composes with the filters above. The open article stays in, so
  // finishing it does not take its previous/next away under the reader.
  const filteredPosts = useMemo(
    () =>
      unreadOnly
        ? matchingPosts.filter((p) => readState.stateOf(p.slug) !== 'read' || p.id === selectedPost?.id)
        : matchingPosts,
    [matchingPosts, unreadOnly, readState, selectedPost],
  )

  const value: BlogContextType = {
    posts: blogPosts,
    filteredPosts,
    selectedPost,
    filter,
    searchQuery,
    currentRoute,
    page,
    unreadOnly,
    setFilter,
    setSearchQuery,
    setSelectedPost,
    setCurrentRoute,
    setPage,
    setUnreadOnly,
    clearFilters,
  }

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBlogContext() {
  const ctx = useContext(BlogContext)
  if (!ctx) throw new Error('useBlogContext must be used within BlogProvider')
  return ctx
}
