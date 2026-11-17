import { useState, useEffect, useCallback } from 'react'
import type { BlogRoute } from '../types'

export interface NavigationState {
  currentRoute: BlogRoute
  selectedSlug: string | null
  currentParams: Record<string, string>
}

/** The route plus a counter of the navigation events seen so far. */
type TrackedNavigation = NavigationState & { tick: number }

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
  const [nav, setNav] = useState<TrackedNavigation>(() => ({ ...parseHash(), tick: 0 }))

  useEffect(() => {
    // Previous/next and the series links swap the article in place: they push
    // a history entry without an event, so this state can still name the
    // article the reader left. The tick lets a consumer react to a real event
    // (the browser's Back, for one) even when the route it yields is the one
    // this state already held.
    const handleHashChange = () => setNav((prev) => ({ ...parseHash(), tick: prev.tick + 1 }))
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
