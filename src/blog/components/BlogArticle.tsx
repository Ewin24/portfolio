import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { useBlogContext } from '../context/BlogContext'
import { parseMarkdown } from '../content/parser'
import { Recommendations } from './Recommendations'

/**
 * Full article view with micromark rendering, prev/next navigation,
 * scroll restoration (fixes bug #3), code overflow fix (bug #7),
 * and drop cap via CSS (bug #8).
 */
export function BlogArticle() {
  const { lang } = useTranslation()
  const { filteredPosts, selectedPost } = useBlogContext()
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
    window.location.hash = '#blog/list'
  }

  const handlePrev = () => {
    if (prevPost) {
      window.location.hash = `#blog/article/${prevPost.slug}`
    }
  }

  const handleNext = () => {
    if (nextPost) {
      window.location.hash = `#blog/article/${nextPost.slug}`
    }
  }

  if (!post) {
    return null
  }

  const title = lang === 'es' ? post.title : post.titleEn
  const content = lang === 'es' ? post.content : post.contentEn
  const backLabel = lang === 'es' ? '← Volver a artículos' : '← Back to articles'

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
        <div className="border-t-4 border-ink mb-1" />
        <div className="border-t border-ink mb-6" />

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

        {/* Body — micromark rendered HTML (fixes bugs #5, #6, #7, #8) */}
        <div
          className="
            blog-article-body
            font-sans text-sm md:text-base text-ink-light leading-[1.75] space-y-5 max-w-3xl
            [&_pre]:border-2 [&_pre]:border-ink [&_pre]:bg-paper-dark [&_pre]:p-4 [&_pre]:md:p-5
            [&_pre]:overflow-x-auto [&_pre]:font-mono [&_pre]:text-[11px] [&_pre]:md:text-xs
            [&_pre]:leading-relaxed [&_pre]:shadow-pixel-sm [&_pre]:my-6 [&_pre]:-mx-2 [&_pre]:md:mx-0
            [&_pre_code]:whitespace-pre-wrap [&_pre_code]:break-words
            [&_code]:bg-paper-dark [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs
            [&_code]:border [&_code]:border-rule-light
            [&_h2]:font-headline [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:leading-tight [&_h2]:mt-8 [&_h2]:mb-3
            [&_h3]:font-headline [&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-bold [&_h3]:text-ink [&_h3]:mt-6 [&_h3]:mb-2
            [&_strong]:font-bold [&_strong]:text-ink
            [&_blockquote]:border-l-4 [&_blockquote]:border-ink [&_blockquote]:pl-4 [&_blockquote]:italic
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1
            [&_li]:text-sm [&_li]:md:text-base [&_li]:leading-relaxed
            [&_a]:text-accent [&_a]:underline [&_a]:hover:text-accent-dark [&_a]:transition-colors
            [&_p:first-of-type::first-letter]:font-headline
            [&_p:first-of-type::first-letter]:text-5xl [&_p:first-of-type::first-letter]:md:text-6xl
            [&_p:first-of-type::first-letter]:font-black [&_p:first-of-type::first-letter]:float-left
            [&_p:first-of-type::first-letter]:mr-2 [&_p:first-of-type::first-letter]:mt-1
            [&_p:first-of-type::first-letter]:leading-[0.8] [&_p:first-of-type::first-letter]:text-ink
            [&_hr]:border-t-4 [&_hr]:border-ink [&_hr]:my-8
          "
          dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
        />

        {/* Bottom rule */}
        <div className="border-t-4 border-ink mt-12 mb-1" />
        <div className="border-t border-ink mb-6" />

        {/* Prev / Next navigation (fixes bug #4) */}
        <nav className="flex justify-between items-stretch gap-4 mb-10">
          {prevPost ? (
            <button
              onClick={handlePrev}
              className="flex-1 flex flex-col items-start gap-1 border-2 border-ink bg-paper p-4 shadow-pixel-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-75 text-left cursor-pointer"
            >
              <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted flex items-center gap-1">
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
              className="flex-1 flex flex-col items-end gap-1 border-2 border-ink bg-paper p-4 shadow-pixel-sm hover:shadow-none hover:-translate-x-0.5 hover:translate-y-0.5 transition-all duration-75 text-right cursor-pointer"
            >
              <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted flex items-center gap-1">
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
