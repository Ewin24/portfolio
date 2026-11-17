// ─── Blog Core Types ──────────────────────────────────────────────────────────

export interface BlogPost {
  id: string
  slug: string
  /** The id of a series in `content/series.ts`. */
  series?: string
  /** 1-based place of this post in its series. */
  seriesOrder?: number
  title: string
  titleEn: string
  date: string
  tags: string[]
  category?: string
  featured: boolean
  excerpt: string
  excerptEn: string
  content: string
  contentEn: string
  readingTime: number
  coverImage?: string
  relatedIds?: string[]
}

export interface BlogFilter {
  /** AND logic — post must have ALL tags */
  tags: string[]
  /** Exact match; `!name` keeps every post that is NOT in that category. */
  category: string | null
  dateRange: { start: string; end: string } | null
}

export interface BlogTag {
  name: string
  label: string
  labelEn: string
  color: 'red' | 'blue' | 'green' | 'purple' | 'orange'
  icon?: string
}

export type BlogRoute = 'list' | 'article' | 'tag' | 'search'

/**
 * The blog's tabs. A tab is the category filter seen from the front: essays
 * are the posts of the essay category, technical is everything else.
 */
export type BlogTab = 'all' | 'essays' | 'technical'

export const ESSAY_CATEGORY = 'ensayo'

export const TAB_CATEGORY: Record<BlogTab, string | null> = {
  all: null,
  essays: ESSAY_CATEGORY,
  technical: `!${ESSAY_CATEGORY}`,
}

/** The tab a category filter belongs to (a technical category sits under Technical). */
export const tabOf = (category: string | null): BlogTab =>
  category === null ? 'all' : category === ESSAY_CATEGORY ? 'essays' : 'technical'

export interface BlogState {
  posts: BlogPost[]
  filteredPosts: BlogPost[]
  selectedPost: BlogPost | null
  filter: BlogFilter
  searchQuery: string
  currentRoute: BlogRoute
  page: number
}
