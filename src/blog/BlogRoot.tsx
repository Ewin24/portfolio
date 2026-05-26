import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '../hooks/useTranslation'
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
  const { posts, setSelectedPost, setFilter } = useBlogContext()

  // Sync hash navigation → BlogContext state
  useEffect(() => {
    if (nav.currentRoute === 'article' && nav.selectedSlug) {
      const post = posts.find((p) => p.slug === nav.selectedSlug)
      if (post) {
        setSelectedPost(post)
      }
    } else if (nav.currentRoute === 'tag' && nav.currentParams.tag) {
      setFilter({ tags: [nav.currentParams.tag], category: null, dateRange: null })
      setSelectedPost(null)
    } else if (nav.currentRoute === 'list') {
      setSelectedPost(null)
      setFilter({ tags: [], category: null, dateRange: null })
    }
  }, [nav.currentRoute, nav.selectedSlug, nav.currentParams.tag])

  // AnimatePresence key: unique per route so transitions work
  const viewKey =
    nav.currentRoute === 'article' ? `article-${nav.selectedSlug}` : nav.currentRoute

  const renderView = (): ReactNode => {
    if (nav.currentRoute === 'article') {
      return <BlogArticle />
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
        <div className="border-t-4 border-ink mb-1" />
        <div className="border-t border-ink mb-4" />
        <h2 className="font-headline text-4xl md:text-5xl font-black text-ink leading-none">
          {t('blog.title')}
        </h2>
        <p className="font-mono text-xs text-ink-muted mt-2">{t('blog.subtitle')}</p>
        <div className="border-t-4 border-ink mt-4" />
      </div>

      <AnimatePresence mode="wait">
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
