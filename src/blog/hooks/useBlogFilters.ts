import { useMemo } from 'react'
import type { BlogPost, BlogFilter } from '../types'

/**
 * Apply BlogFilter to a list of posts — pure filter logic.
 * Tags use AND semantics, category is exact match, dateRange is inclusive.
 */
export function applyBlogFilters(posts: BlogPost[], filter: BlogFilter): BlogPost[] {
  return posts.filter((post) => {
    // Tag AND: post must have ALL requested tags
    if (filter.tags.length > 0) {
      if (!filter.tags.every((tag) => post.tags.includes(tag))) return false
    }

    // Category exact match
    if (filter.category && post.category !== filter.category) return false

    // Date range (inclusive)
    if (filter.dateRange) {
      const postDate = new Date(post.date)
      const start = new Date(filter.dateRange.start)
      const end = new Date(filter.dateRange.end)
      if (postDate < start || postDate > end) return false
    }

    return true
  })
}

/**
 * React hook: memoized filtered + sorted (newest first) posts.
 */
export function useBlogFilters(posts: BlogPost[], filter: BlogFilter): BlogPost[] {
  return useMemo(() => {
    const sorted = [...posts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    return applyBlogFilters(sorted, filter)
  }, [posts, filter])
}
