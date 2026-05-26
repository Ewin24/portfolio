// ─── Blog Core Types ──────────────────────────────────────────────────────────

export interface BlogPost {
  id: string
  slug: string
  series?: string
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

export interface BlogState {
  posts: BlogPost[]
  filteredPosts: BlogPost[]
  selectedPost: BlogPost | null
  filter: BlogFilter
  searchQuery: string
  currentRoute: BlogRoute
  page: number
}
