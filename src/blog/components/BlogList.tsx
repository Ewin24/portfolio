import { useState } from 'react'
import { motion } from 'motion/react'
import { Clock, Tag, ArrowRight } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../../components/ui/FadeIn'
import { useBlogContext } from '../context/BlogContext'
import { partLabel, seriesOf } from '../content/series'
import { Figure } from '../figures/Figure'
import { formatPostDate } from '../hooks/postDate'
import { EmptyState } from './EmptyState'
import { useReadSnapshot } from '../readState'
import { ReadMark } from './ReadMark'
import { ESSAY_CATEGORY, type BlogPost } from '../types'

const PAGE_SIZE = 6

// ─── Blog Card ─────────────────────────────────────────────────────────────

/**
 * One article on the front. The lead is the same card set wide: a larger
 * headline, the whole excerpt and, when the article has a figure, that figure
 * as a still. Only the lead mounts a figure.
 */
function BlogCard({ post, lead = false, onRead }: { post: BlogPost; lead?: boolean; onRead: () => void }) {
  const { lang } = useTranslation()
  const { posts } = useBlogContext()

  const title = lang === 'es' ? post.title : post.titleEn
  const excerpt = lang === 'es' ? post.excerpt : post.excerptEn
  const readState = useReadSnapshot().stateOf(post.slug)
  const inSeries = seriesOf(post, posts)
  const isEssay = post.category === ESSAY_CATEGORY
  // ![alt](figure/<id> "caption"): the article's first figure, with its alt text.
  const figure = lead ? /!\[([^\]]*)\]\(figure\/([\w-]+)/.exec(lang === 'es' ? post.content : post.contentEn) : null

  return (
    <article
      data-slug={post.slug}
      data-read-state={readState}
      data-lead={lead || undefined}
      className={`blogfront-card px-card px-card-interactive bg-paper ${lead ? 'blogfront-lead' : 'px-card-sm'}`}
    >
      <div className="blogfront-card-text">
        {/* Tags row */}
        <div className="flex flex-wrap gap-1">
          {post.tags.slice(0, lead ? 5 : 3).map((tag) => (
            <span key={tag} className="skill-tag text-xs flex items-center gap-1">
              <Tag size={8} aria-hidden="true" /> {tag}
            </span>
          ))}
        </div>

        {/* Kind of piece and place in its series */}
        {(isEssay || inSeries) && (
          <p className="blogfront-kind">
            {isEssay && <span className="kicker">{lang === 'es' ? 'Ensayo' : 'Essay'}</span>}
            {inSeries && (
              <span data-series-part>{partLabel(inSeries.index, inSeries.parts.length, inSeries.series, lang)}</span>
            )}
          </p>
        )}

        <h3 className="blogfront-card-title">{title}</h3>

        <p className="blogfront-card-excerpt">{excerpt}</p>

        {/* Reading state — a stamp once read, "continue" once started; out of the flow */}
        <ReadMark slug={post.slug} />

        {/* Footer: date + reading time + read button */}
        <div className="blogfront-card-foot">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <time dateTime={post.date} className="font-mono text-xs text-ink-muted">
              {formatPostDate(post.date, lang)}
            </time>
            <span className="font-mono text-xs text-ink-muted flex items-center gap-1">
              <Clock size={10} aria-hidden="true" /> {post.readingTime} min
            </span>
          </div>
          <button
            onClick={onRead}
            className="font-mono text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-dark flex items-center gap-1 transition-colors cursor-pointer"
          >
            {lang === 'es' ? 'Leer' : 'Read'} <ArrowRight size={10} aria-hidden="true" />
          </button>
        </div>
      </div>

      {figure && (
        <div className="blogfront-lead-figure">
          <Figure id={figure[2]} alt={figure[1]} preview />
        </div>
      )}
    </article>
  )
}

// ─── Blog List ─────────────────────────────────────────────────────────────

/**
 * The front: the first article of the result as the lead, the rest as a grid
 * whose rows are level. While the reader is searching there is no lead.
 */
export function BlogList() {
  const { lang } = useTranslation()
  const { filteredPosts, page, setPage, searchQuery } = useBlogContext()
  const [showAll, setShowAll] = useState(false)

  const totalPosts = filteredPosts.length
  const hasLead = searchQuery.trim() === ''
  // A page is six cards of the grid; the lead comes on top of the first one.
  const visibleCount = showAll ? totalPosts : Math.min(page * PAGE_SIZE + (hasLead ? 1 : 0), totalPosts)
  const hasMore = visibleCount < totalPosts

  const handleLoadMore = () => {
    setPage(page + 1)
  }

  const handleShowAll = () => {
    setShowAll(true)
  }

  const handleRead = (post: BlogPost) => {
    // Opening is what makes it started; BlogArticle marks it read at its end.
    // pushState + a manual hashchange rather than assigning location.hash.
    // Same navigation, but it is the pattern App and BlogArticle already use,
    // and assigning to location.hash trips the compiler's "this value cannot
    // be modified" rule now that this component holds hooks.
    history.pushState(null, '', `#blog/article/${post.slug}`)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  if (totalPosts === 0) {
    return <EmptyState context="filters" />
  }

  const visible = filteredPosts.slice(0, visibleCount)
  const lead = hasLead ? visible[0] : null
  const rest = lead ? visible.slice(1) : visible

  return (
    <div>
      {lead && (
        <FadeIn key={lead.id} className="blogfront-lead-wrap">
          <BlogCard post={lead} lead onRead={() => handleRead(lead)} />
        </FadeIn>
      )}

      <div data-blog-grid className="blogfront-grid">
        {rest.map((post, i) => (
          <motion.div
            key={post.id}
            className="blogfront-cell"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (i % PAGE_SIZE) * 0.05 }}
          >
            <FadeIn delay={i * 0.08} className="blogfront-cell">
              <BlogCard post={post} onRead={() => handleRead(post)} />
            </FadeIn>
          </motion.div>
        ))}
      </div>

      {/* Load more / Show all */}
      <div className="flex justify-center gap-3 mt-8">
        {hasMore && (
          <>
            <button
              onClick={handleLoadMore}
              className="px-btn"
            >
              {lang === 'es' ? 'Cargar más' : 'Load more'}
            </button>
            <button
              onClick={handleShowAll}
              className="px-btn px-btn-outline"
            >
              {lang === 'es' ? 'Mostrar todos' : 'Show all'}
            </button>
          </>
        )}
        {!hasMore && totalPosts > PAGE_SIZE && (
          <p className="font-mono text-xs text-ink-muted">
            {totalPosts} {lang === 'es' ? 'artículos' : 'articles'}
          </p>
        )}
      </div>
    </div>
  )
}
