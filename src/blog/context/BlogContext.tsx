import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react'
import type { BlogPost, BlogFilter, BlogRoute } from '../types'
import { blogPosts } from '../content/posts'
import { applyBlogFilters } from '../hooks/useBlogFilters'

// ─── Defaults ────────────────────────────────────────────────────────────────

const defaultFilter: BlogFilter = {
  tags: [],
  category: null,
  dateRange: null,
}

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

  // Setters
  setFilter: (filter: BlogFilter) => void
  setSearchQuery: (query: string) => void
  setSelectedPost: (post: BlogPost | null) => void
  setCurrentRoute: (route: BlogRoute) => void
  setPage: (page: number) => void
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

  const clearFilters = useCallback(() => {
    setFilter(defaultFilter)
    setSearchQuery('')
    setPage(1)
  }, [])

  // Derive filteredPosts: sort newest first, then apply filter
  const filteredPosts = useMemo(() => {
    const sorted = [...blogPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    return applyBlogFilters(sorted, filter)
  }, [filter])

  const value: BlogContextType = {
    posts: blogPosts,
    filteredPosts,
    selectedPost,
    filter,
    searchQuery,
    currentRoute,
    page,
    setFilter,
    setSearchQuery,
    setSelectedPost,
    setCurrentRoute,
    setPage,
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
