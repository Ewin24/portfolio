import { useLayoutEffect, type ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useTranslation } from '../hooks/useTranslation'
import { SectionOpening } from '../components/ui/SectionOpening'
import { BlogProvider, useBlogContext } from './context/BlogContext'
import { useBlogNavigation } from './hooks/useBlogNavigation'
import { BlogList } from './components/BlogList'
import { BlogArticle } from './components/BlogArticle'
import { BlogFilters } from './components/BlogFilters'
import { BlogSearch } from './components/BlogSearch'
import { BlogTabs } from './components/BlogTabs'
import { rememberedTab } from './hooks/blogTab'
import { TAB_CATEGORY } from './types'

// ─── Inner Router ────────────────────────────────────────────────────────────

function BlogRouter() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const nav = useBlogNavigation()
  const { posts, selectedPost, setSelectedPost, setFilter } = useBlogContext()

  // Find target article during render (no flicker — post resolved before paint)
  const targetPost =
    nav.currentRoute === 'article' && nav.selectedSlug
      ? posts.find((p) => p.slug === nav.selectedSlug) ?? null
      : null

  // Sync hash → context for non-article routes (tag, list, search). A route
  // resets the filters and keeps the tab.
  useLayoutEffect(() => {
    const category = TAB_CATEGORY[rememberedTab()]
    if (nav.currentRoute === 'tag' && nav.currentParams.tag) {
      setFilter({ tags: [nav.currentParams.tag], category, dateRange: null })
    } else if (nav.currentRoute === 'list' || nav.currentRoute === 'search') {
      setFilter({ tags: [], category, dateRange: null })
    }
    if (nav.currentRoute !== 'article') {
      setSelectedPost(null)
    }
  }, [nav.currentRoute, nav.selectedSlug, nav.currentParams.tag, setFilter, setSelectedPost])

  // Sync selectedPost for article route (useLayoutEffect = before paint)
  // nav.tick: after an in-place swap (previous/next, next in the series) the
  // route state still names the article the reader left, so going Back yields
  // the same target as before; the tick is what says the reader moved.
  useLayoutEffect(() => {
    if (targetPost && targetPost !== selectedPost) {
      setSelectedPost(targetPost)
    }
    // selectedPost is left out on purpose: an in-place swap changes it without
    // changing the route, and this effect must not undo that swap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPost, nav.tick])

  // AnimatePresence key: unique per route so transitions work
  const viewKey =
    nav.currentRoute === 'article' ? `article-${nav.selectedSlug}` : nav.currentRoute

  const renderView = (): ReactNode => {
    if (nav.currentRoute === 'article') {
      // Only render BlogArticle when we have the post resolved
      // (targetPost is set during render, before first paint)
      return selectedPost || targetPost ? <BlogArticle /> : null
    }

    return (
      <BlogTabs>
        <BlogFilters />
        <BlogSearch defaultQuery={nav.currentRoute === 'search' ? nav.currentParams.q ?? '' : ''} />
        <BlogList />
      </BlogTabs>
    )
  }

  return (
    <section id="blog" className="py-20 px-6 max-w-7xl mx-auto">
      <SectionOpening
        section="blog"
        title={t('blog.title')}
        subtitle={t('blog.subtitle')}
      />

      <AnimatePresence mode="sync">
        <motion.div
          key={viewKey}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

// ─── Entry Point ─────────────────────────────────────────────────────────────

export function BlogRoot() {
  return (
    <BlogProvider>
      <BlogRouter />
    </BlogProvider>
  )
}
