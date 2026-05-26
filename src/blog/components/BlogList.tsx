import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Tag, ArrowRight } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../../components/ui/FadeIn'
import { useBlogContext } from '../context/BlogContext'
import { EmptyState } from './EmptyState'
import type { BlogPost } from '../types'

const PAGE_SIZE = 6

// ─── Blog Card ─────────────────────────────────────────────────────────────

function BlogCard({ post, index, onRead }: { post: BlogPost; index: number; onRead: () => void }) {
  const { lang } = useTranslation()
  const title = lang === 'es' ? post.title : post.titleEn
  const excerpt = lang === 'es' ? post.excerpt : post.excerptEn

  return (
    <FadeIn delay={index * 0.08}>
      <article className="border-2 border-ink bg-paper shadow-pixel-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-75 flex flex-col h-full">
        <div className="p-5 flex-1 flex flex-col gap-3">
          {/* Tags row */}
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="skill-tag text-[9px] flex items-center gap-1">
                <Tag size={7} /> {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-headline text-lg font-bold text-ink leading-tight line-clamp-2">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="font-sans text-xs text-ink-light leading-relaxed line-clamp-3 flex-1">
            {excerpt}
          </p>

          {/* Footer: date + reading time + read button */}
          <div className="flex items-center justify-between pt-3 border-t border-rule-light mt-auto">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-ink-muted">{post.date}</span>
              <span className="font-mono text-[10px] text-ink-muted flex items-center gap-1">
                <Clock size={9} /> {post.readingTime} min
              </span>
            </div>
            <button
              onClick={onRead}
              className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent hover:text-accent-dark flex items-center gap-1 transition-colors cursor-pointer"
            >
              {lang === 'es' ? 'Leer' : 'Read'} <ArrowRight size={10} />
            </button>
          </div>
        </div>
      </article>
    </FadeIn>
  )
}

// ─── Blog List ─────────────────────────────────────────────────────────────

export function BlogList() {
  const { lang } = useTranslation()
  const { filteredPosts, setSelectedPost, setCurrentRoute, page, setPage } = useBlogContext()
  const [showAll, setShowAll] = useState(false)

  const totalPosts = filteredPosts.length
  const visibleCount = showAll ? totalPosts : Math.min(page * PAGE_SIZE, totalPosts)
  const hasMore = visibleCount < totalPosts

  const handleLoadMore = () => {
    setPage(page + 1)
  }

  const handleShowAll = () => {
    setShowAll(true)
  }

  const handleRead = (post: BlogPost) => {
    setSelectedPost(post)
    setCurrentRoute('article')
  }

  if (totalPosts === 0) {
    return <EmptyState context="filters" />
  }

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.slice(0, visibleCount).map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (i % PAGE_SIZE) * 0.05 }}
          >
            <BlogCard
              post={post}
              index={i}
              onRead={() => handleRead(post)}
            />
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
          <p className="font-mono text-[10px] text-ink-muted">
            {totalPosts} {lang === 'es' ? 'artículos' : 'articles'}
          </p>
        )}
      </div>
    </div>
  )
}
