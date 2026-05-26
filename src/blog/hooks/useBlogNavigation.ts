import { useState, useEffect, useCallback } from 'react'
import type { BlogRoute } from '../types'

export interface NavigationState {
  currentRoute: BlogRoute
  selectedSlug: string | null
  currentParams: Record<string, string>
}

function parseHash(): NavigationState {
  const hash = window.location.hash.slice(1) // remove '#'

  // #blog/list
  if (hash === 'blog/list' || hash === 'blog' || hash === '') {
    return { currentRoute: 'list', selectedSlug: null, currentParams: {} }
  }

  // #blog/article/:slug
  const articleMatch = hash.match(/^blog\/article\/(.+)$/)
  if (articleMatch) {
    return { currentRoute: 'article', selectedSlug: articleMatch[1], currentParams: {} }
  }

  // #blog/tag/:tag
  const tagMatch = hash.match(/^blog\/tag\/(.+)$/)
  if (tagMatch) {
    return { currentRoute: 'tag', selectedSlug: tagMatch[1], currentParams: { tag: tagMatch[1] } }
  }

  // #blog/search?q=...
  const searchMatch = hash.match(/^blog\/search\?(.+)$/)
  if (searchMatch) {
    const params = Object.fromEntries(new URLSearchParams(searchMatch[1]))
    return { currentRoute: 'search', selectedSlug: params.q ?? null, currentParams: params }
  }

  // Fallback: unknown hash → list
  return { currentRoute: 'list', selectedSlug: null, currentParams: {} }
}

/**
 * Hash-based router for blog views.
 * Routes: #blog/list, #blog/article/:slug, #blog/tag/:tag, #blog/search?q=
 * Does NOT interfere with existing anchors (#about, #projects, etc.)
 */
export function useBlogNavigation() {
  const [nav, setNav] = useState<NavigationState>(parseHash)

  useEffect(() => {
    const handleHashChange = () => setNav(parseHash())
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('popstate', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('popstate', handleHashChange)
    }
  }, [])

  const navigate = useCallback((hash: string) => {
    window.location.hash = hash
  }, [])

  return { ...nav, navigate }
}
