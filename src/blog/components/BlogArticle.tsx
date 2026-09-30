import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { useBlogContext } from '../context/BlogContext'
import { parseMarkdown } from '../content/parser'
import { Recommendations } from './Recommendations'

/**
 * Full article view with micromark rendering, prev/next navigation and
 * scroll restoration (fixes bug #3). Prose styles live in index.css.
 */
export function BlogArticle() {
  const { lang } = useTranslation()
  const { filteredPosts, selectedPost, setSelectedPost } = useBlogContext()
  const articleRef = useRef<HTMLDivElement>(null)

  const post = selectedPost

  // Compute prev/next from sorted filteredPosts (fixes bug #4)
  const currentIndex = filteredPosts.findIndex((p) => p.id === post?.id)
  const prevPost = currentIndex > 0 ? filteredPosts[currentIndex - 1] : null
  const nextPost = currentIndex >= 0 && currentIndex < filteredPosts.length - 1
    ? filteredPosts[currentIndex + 1]
    : null

  // Scroll to top on mount / article change (fixes bug #3)
  useEffect(() => {
    if (articleRef.current) {
      articleRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [post?.id])

  const handleBack = () => {
    // Use pushState + manual hashchange to avoid browser's native scroll-to-anchor,
    // which would scroll to the EXITING blog-full's #blog (still in DOM during transition).
    history.pushState(null, '', '#blog')
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  const handlePrev = () => {
    if (prevPost) {
      setSelectedPost(prevPost)
      history.pushState(null, '', `#blog/article/${prevPost.slug}`)
    }
  }

  const handleNext = () => {
    if (nextPost) {
      setSelectedPost(nextPost)
      history.pushState(null, '', `#blog/article/${nextPost.slug}`)
    }
  }

  if (!post) {
    return null
  }

  const title = lang === 'es' ? post.title : post.titleEn
  const content = lang === 'es' ? post.content : post.contentEn
  const backLabel = lang === 'es' ? 'Volver a artículos' : 'Back to articles'

  return (
    <motion.div
      key={`article-${post.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
      ref={articleRef}
    >
      <article className="max-w-4xl mx-auto">
        {/* Back link */}
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-accent transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={14} />
          {backLabel}
        </button>

        {/* Masthead style header */}
        <div className="border-t-4 border-rule mb-1" />
        <div className="border-t border-rule mb-6" />

        {/* Headline */}
        <h1 className="font-headline text-3xl md:text-5xl lg:text-6xl font-black text-ink leading-[1.05] tracking-tight mb-4">
          {title}
        </h1>

        {/* Byline + metadata */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6 pb-4 border-b border-rule-light">
          <span className="font-mono text-xs text-ink-muted flex items-center gap-1.5">
            <Calendar size={12} />
            {post.date}
          </span>
          <span className="font-mono text-xs text-ink-muted flex items-center gap-1.5">
            <Clock size={12} />
            {post.readingTime} min {lang === 'es' ? 'de lectura' : 'read'}
          </span>
          <span className="hidden md:inline font-mono text-[10px] text-ink-muted uppercase tracking-wider">
            Por Edwin Trigos
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-8">
          {post.tags.map((tag) => (
            <span key={tag} className="skill-tag text-[10px]">{tag}</span>
          ))}
        </div>

        {/* Body — micromark HTML, styled by .blog-article-body in index.css */}
        <div
          className="blog-article-body"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
        />

        {/* Bottom rule */}
        <div className="border-t-4 border-rule mt-12 mb-1" />
        <div className="border-t border-rule mb-6" />

        {/* Prev / Next navigation (fixes bug #4) */}
        <nav className="flex justify-between items-stretch gap-4 mb-10">
          {prevPost ? (
            <button
              onClick={handlePrev}
              className="flex-1 flex flex-col items-start gap-1 px-card px-card-sm px-card-interactive bg-paper p-4 text-left cursor-pointer"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted flex items-center gap-1">
                <ArrowLeft size={10} /> {lang === 'es' ? 'Anterior' : 'Previous'}
              </span>
              <span className="font-headline text-sm font-bold text-ink leading-tight line-clamp-2">
                {lang === 'es' ? prevPost.title : prevPost.titleEn}
              </span>
            </button>
          ) : (
            <div className="flex-1" />
          )}

          {nextPost ? (
            <button
              onClick={handleNext}
              className="flex-1 flex flex-col items-end gap-1 px-card px-card-sm px-card-interactive bg-paper p-4 text-right cursor-pointer"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted flex items-center gap-1">
                {lang === 'es' ? 'Siguiente' : 'Next'} <ArrowRight size={10} />
              </span>
              <span className="font-headline text-sm font-bold text-ink leading-tight line-clamp-2">
                {lang === 'es' ? nextPost.title : nextPost.titleEn}
              </span>
            </button>
          ) : (
            <div className="flex-1" />
          )}
        </nav>

        {/* Back link at bottom */}
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-accent transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={14} />
          {backLabel}
        </button>

        {/* Recommendations */}
        {post && <Recommendations currentPost={post} />}
      </article>
    </motion.div>
  )
}
