import { useMemo } from 'react'
import type { BlogPost } from '../types'

export interface ScoredPost extends BlogPost {
  score: number
}

/**
 * Compute recommendations for a given post based on tag-overlap scoring
 * and recency boost.
 *
 * Score formula: tagOverlap + recencyBoost
 * - tagOverlap: number of shared tags between current post and candidate
 * - recencyBoost: up to 1.4 for posts within 14 days (0.1 per day)
 *
 * @param currentPost - The post to find recommendations for
 * @param allPosts - All available posts
 * @param maxResults - Max recommendations to return (default 3)
 * @returns Scored recommendations, excluding current post
 */
export function getRecommendations(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  maxResults: number = 3,
): ScoredPost[] {
  const others = allPosts.filter((p) => p.id !== currentPost.id)

  const scored = others.map((post) => {
    const tagOverlap = post.tags.filter((t) => currentPost.tags.includes(t)).length
    const daysSince = (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24)
    const recencyBoost = Math.max(0, 14 - daysSince) * 0.1

    return { ...post, score: tagOverlap + recencyBoost }
  })

  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, maxResults)
}

/**
 * React hook: memoized recommendations for the current post.
 */
export function useRecommendations(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  maxResults: number = 3,
): ScoredPost[] {
  return useMemo(
    () => getRecommendations(currentPost, allPosts, maxResults),
    [currentPost, allPosts, maxResults],
  )
}
