import { lazy, Suspense, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { Tabs } from './Tabs'

/**
 * The blog carries the heaviest dependencies (post bodies, MiniSearch index,
 * micromark). It loads as its own chunk behind a Suspense boundary, exactly
 * as in App.tsx, so opening the Blog window never blocks the first paint.
 */
const BlogRoot = lazy(() =>
  import('../../blog/BlogRoot').then((m) => ({ default: m.BlogRoot })),
)

/** Placeholder that reserves roughly the blog header height. */
function BlogFallback({ minHeight }: { minHeight: string }) {
  return (
    <div className="py-20 px-6 max-w-7xl mx-auto" style={{ minHeight }} aria-busy="true">
      <div className="border-t-4 border-rule mb-1" />
      <div className="border-t border-rule mb-4" />
      <div className="h-10 w-64 bg-paper-dark" />
      <div className="border-t-4 border-rule mt-4" />
    </div>
  )
}

/**
 * The Blog window content (design D2/D6).
 *
 * Renders the reusable Tabs bar with two panels. The "Articles" panel mounts
 * the lazy BlogRoot chunk (list, search, article router). Switching tabs uses
 * `aria-hidden`/`hidden` (NOT conditional render), so the BlogRoot subtree
 * stays mounted — the MiniSearch index and post bodies are never re-fetched
 * when the visitor flips between tabs (spec Risk 5).
 */
export function BlogWindow() {
  const { t } = useTranslation()
  const [active, setActive] = useState('articles')

  return (
    <Tabs
      idPrefix="blog"
      label={t('nav.blog')}
      active={active}
      onChange={setActive}
      tabs={[
        {
          key: 'articles',
          label: t('blog.articles'),
          content: (
            <Suspense fallback={<BlogFallback minHeight="24rem" />}>
              <BlogRoot />
            </Suspense>
          ),
        },
        {
          key: 'reading',
          label: t('blog.reading'),
          content: (
            <div className="xp-blog-reading" role="group" aria-label={t('blog.reading')}>
              <p className="xp-blog-reading-hint">{t('blog.title')}</p>
              <p className="xp-blog-reading-sub">{t('blog.subtitle')}</p>
            </div>
          ),
        },
      ]}
    />
  )
}
