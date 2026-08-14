import { useLayoutEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from '../hooks/useTranslation'
import { SectionOpening } from '../components/ui/SectionOpening'
import { BlogProvider, useBlogContext } from './context/BlogContext'
import { useBlogNavigation } from './hooks/useBlogNavigation'
import { BlogList } from './components/BlogList'
import { BlogArticle } from './components/BlogArticle'
import { BlogFilters } from './components/BlogFilters'
import { BlogSearch } from './components/BlogSearch'

// ─── Inner Router ────────────────────────────────────────────────────────────

function BlogRouter() {
  const { t } = useTranslation()
  const nav = useBlogNavigation()
  const { posts, selectedPost, setSelectedPost, setFilter } = useBlogContext()

  // Find target article during render (no flicker — post resolved before paint)
  const targetPost =
    nav.currentRoute === 'article' && nav.selectedSlug
      ? posts.find((p) => p.slug === nav.selectedSlug) ?? null
      : null

  // Sync hash → context for non-article routes (tag, list, search)
  useLayoutEffect(() => {
    if (nav.currentRoute === 'tag' && nav.currentParams.tag) {
      setFilter({ tags: [nav.currentParams.tag], category: null, dateRange: null })
    } else if (nav.currentRoute === 'list' || nav.currentRoute === 'search') {
      setFilter({ tags: [], category: null, dateRange: null })
    }
    if (nav.currentRoute !== 'article') {
      setSelectedPost(null)
    }
  }, [nav.currentRoute, nav.selectedSlug, nav.currentParams.tag])

  // Sync selectedPost for article route (useLayoutEffect = before paint)
  useLayoutEffect(() => {
    if (targetPost && targetPost !== selectedPost) {
      setSelectedPost(targetPost)
    }
  }, [targetPost])

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
      <>
        <BlogFilters />
        <BlogSearch defaultQuery={nav.currentRoute === 'search' ? nav.currentParams.q ?? '' : ''} />
        <BlogList />
      </>
    )
  }

  return (
    <section id="blog" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Section header — style from original Blog.tsx */}
      <div className="mb-10">
        <SectionOpening
          section="blog"
          title={t('blog.title')}
          subtitle={t('blog.subtitle')}
        />
      </div>

      <AnimatePresence mode="sync">
        <motion.div
          key={viewKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
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
