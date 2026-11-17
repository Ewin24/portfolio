import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from 'react'
import { TAB_CATEGORY, tabOf, type BlogPost, type BlogFilter, type BlogRoute } from '../types'
import { onBlogTab, rememberTab, rememberedTab } from '../hooks/blogTab'
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
  const [filter, setFilterState] = useState<BlogFilter>(() => ({ ...defaultFilter, category: TAB_CATEGORY[rememberedTab()] }))
  const setFilter = useCallback((next: BlogFilter) => {
    rememberTab(tabOf(next.category))
    setFilterState(next)
  }, [])
  // A tab chosen from outside the blog (the series showcase's "all essays").
  useEffect(() => onBlogTab((tab) => setFilterState((f) => ({ ...f, category: TAB_CATEGORY[tab] }))), [])
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

  // Clears the filters, not the tab the reader is on, nor the search box,
  // whose text is BlogSearch's own and only mirrored here.
  const clearFilters = useCallback(() => {
    setFilter({ ...defaultFilter, category: TAB_CATEGORY[rememberedTab()] })
    setPage(1)
    setUnreadOnly(false)
  }, [setFilter, setUnreadOnly])

  // Derive filteredPosts: sort newest first, then apply filter
  const matchingPosts = useMemo(() => {
    const sorted = [...blogPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    // The open article stays in whatever the filters say, so its
    // previous/next exist when it was reached from outside the active tab.
    const matching = new Set(applyBlogFilters(sorted, filter))
    return sorted.filter((p) => matching.has(p) || p.id === selectedPost?.id)
  }, [filter, selectedPost])

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
