import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { ArrowDown, ArrowLeft, ArrowRight, Calendar, Check, Clock } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { useBlogContext } from '../context/BlogContext'
import { articleSections, parseMarkdown } from '../content/parser'
import { partLabel, progressLabel, seriesOf } from '../content/series'
import { formatPostDate } from '../hooks/postDate'
import { ESSAY_CATEGORY, type BlogPost } from '../types'
import { ArticleContents } from './ArticleContents'
import { Figure } from '../figures/Figure'
import { finishReading, flushProgress, getSnapshot, readLabel, saveProgress, useReadSnapshot } from '../readState'
import { ReadMark } from './ReadMark'
import { Recommendations } from './Recommendations'
import { ReadingModeToggle } from './ReadingModeToggle'
import { ShareLinks } from './ShareLinks'

/**
 * The article prose: one element whose children are the parser's HTML, which
 * is what the prose styles select on. Interactive figures are portalled into
 * the mount nodes the parser left, so they live in the app's React tree
 * (language, theme) without becoming children of the prose in React's eyes.
 *
 * The parent keys this by article and language: new HTML means a new element
 * and fresh mounts, never portals pointing at nodes innerHTML has replaced.
 * The element is kept in state, not a ref, so the mounts are found on the
 * render that follows its attachment.
 */
function ArticleBody({ html }: { html: string }) {
  const [body, setBody] = useState<HTMLDivElement | null>(null)
  // React 19 writes innerHTML again whenever this object changes identity,
  // even with the same string, and that would replace the mount nodes under
  // the portals. One object per HTML string keeps them.
  const inner = useMemo(() => ({ __html: html }), [html])
  const mounts = useMemo(
    () => (body ? [...body.querySelectorAll<HTMLElement>('figure[data-figure] > .figure-mount')] : []),
    [body],
  )
  return (
    <>
      <div ref={setBody} className="blog-article-body" dangerouslySetInnerHTML={inner} />
      {mounts.map((mount, i) =>
        createPortal(<Figure id={mount.parentElement?.dataset.figure ?? ''} alt={mount.dataset.alt ?? ''} />, mount, String(i)),
      )}
    </>
  )
}

/** How long the end of the body must stay reached before the article counts as read. */
const DWELL_MS = 1500

/** After this long the scroll position is the reader's own, wherever it is. */
const SETTLE_MS = 1500

/**
 * Full article view with micromark rendering, prev/next navigation and
 * scroll restoration (fixes bug #3). Prose styles live in index.css.
 */
export function BlogArticle() {
  const { lang } = useTranslation()
  const { posts, filteredPosts, selectedPost, setSelectedPost } = useBlogContext()
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

  // Opening an article makes it STARTED, however the reader got here (list,
  // direct link, prev/next, recommendations). It becomes READ when the end of
  // its body is reached and stays reached for a moment: a sentinel after the
  // body, which also covers an article shorter than the viewport. Until then
  // the furthest point reached is saved, to offer it back on the next visit.
  const slug = post?.slug
  const readState = useReadSnapshot()
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!slug || !sentinel || getSnapshot().stateOf(slug) === 'read') return
    saveProgress(slug, 0)

    // Arriving from another view, the window is still wherever that one was
    // left while it scrolls back to the top. Nothing counts until it gets
    // there, or until enough time has passed for the position to be the reader's.
    let armed = false
    let reached = false
    let dwell: ReturnType<typeof setTimeout> | undefined

    const evaluate = () => {
      const rect = sentinel.previousElementSibling?.getBoundingClientRect()
      if (!rect) return
      armed ||= window.scrollY < 8
      if (!armed) return

      const span = rect.height - window.innerHeight
      if (span > 0) saveProgress(slug, -rect.top / span)

      if (!reached) {
        clearTimeout(dwell)
        dwell = undefined
      } else {
        dwell ??= setTimeout(() => finishReading(slug), DWELL_MS)
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      // On screen, or already scrolled past.
      reached = entry.isIntersecting || entry.boundingClientRect.top < 0
      evaluate()
    })
    observer.observe(sentinel)
    window.addEventListener('scroll', evaluate, { passive: true })
    evaluate()
    const settle = setTimeout(() => {
      armed = true
      evaluate()
    }, SETTLE_MS)

    return () => {
      clearTimeout(settle)
      clearTimeout(dwell)
      observer.disconnect()
      window.removeEventListener('scroll', evaluate)
      flushProgress()
    }
  }, [slug])

  // Where the reader left this article, as it was when it was opened. Offered,
  // never applied: the reader decides whether to jump.
  const [resume, setResume] = useState(() => ({ slug, at: slug ? getSnapshot().progressOf(slug) : null }))
  if (resume.slug !== slug) setResume({ slug, at: slug ? readState.progressOf(slug) : null })

  const handleResume = () => {
    const rect = sentinelRef.current?.previousElementSibling?.getBoundingClientRect()
    if (!rect || resume.at === null) return
    window.scrollTo({
      top: window.scrollY + rect.top + resume.at * Math.max(0, rect.height - window.innerHeight),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
    setResume({ slug, at: null })
  }

  const content = post ? (lang === 'es' ? post.content : post.contentEn) : ''
  const html = useMemo(() => parseMarkdown(content), [content])
  const sections = useMemo(() => articleSections(html), [html])

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

  // Another part of the series, opened the way previous/next open theirs.
  const handlePart = (part: BlogPost) => {
    setSelectedPost(part)
    history.pushState(null, '', `#blog/article/${part.slug}`)
  }

  if (!post) {
    return null
  }

  const title = lang === 'es' ? post.title : post.titleEn
  const backLabel = lang === 'es' ? 'Volver a artículos' : 'Back to articles'
  const readMark = readState.stateOf(post.slug) === 'read' ? readLabel(post.slug, lang) : null
  // Gone once used, once the reader scrolls past that point, or once read.
  const resumePercent = Math.round((resume.at ?? 0) * 100)
  const canResume = resumePercent > 0 && (readState.progressOf(post.slug) ?? 1) <= (resume.at ?? 0) + 0.01
  const es = lang === 'es'
  const isEssay = post.category === ESSAY_CATEGORY
  const inSeries = seriesOf(post, posts)
  const nextPart = inSeries?.parts[inSeries.index + 1] ?? null

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
        {/* Back link + reading mode controls. Elements marked
            `data-reading-hide` are hidden by src/styles/reading.css while
            reading mode is on. */}
        <div className="reading-toolbar flex flex-wrap items-center justify-between gap-3 mb-6">
          <button
            data-reading-hide
            onClick={handleBack}
            className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-accent transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            {backLabel}
          </button>
          <ReadingModeToggle />
        </div>

        {/* Masthead style header */}
        <div className="border-t-4 border-rule mb-1" />
        <div className="border-t border-rule mb-6" />

        {/* Kind of piece and place in its series */}
        {(isEssay || inSeries) && (
          <p className="blogfront blogfront-kind mb-3">
            {isEssay && <span data-article-kicker className="kicker">{es ? 'Ensayo' : 'Essay'}</span>}
            {inSeries && (
              <span data-series-part>{partLabel(inSeries.index, inSeries.parts.length, inSeries.series, lang)}</span>
            )}
          </p>
        )}

        {/* Headline */}
        <h1 className="font-headline text-3xl md:text-5xl lg:text-6xl font-black text-ink leading-[1.05] tracking-tight mb-4">
          {title}
        </h1>

        {/* Byline + metadata */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6 pb-4 border-b border-rule-light">
          <span className="font-mono text-xs text-ink-muted flex items-center gap-1.5">
            <Calendar size={12} />
            <time dateTime={post.date}>{formatPostDate(post.date, lang)}</time>
          </span>
          <span className="font-mono text-xs text-ink-muted flex items-center gap-1.5">
            <Clock size={12} />
            {post.readingTime} min {lang === 'es' ? 'de lectura' : 'read'}
          </span>
          <span className="hidden md:inline font-mono text-[10px] text-ink-muted uppercase tracking-wider">
            Por Edwin Trigos
          </span>
          {readMark && (
            <span data-read-mark className="font-mono text-xs text-ink-muted flex items-center gap-1.5">
              <Check size={12} aria-hidden="true" />
              {readMark}
            </span>
          )}
        </div>

        {canResume && (
          <div className="mb-6">
            <button data-continue onClick={handleResume} className="px-btn px-btn-outline flex items-center gap-2">
              <ArrowDown size={14} aria-hidden="true" />
              {lang === 'es' ? 'Continuar donde quedaste' : 'Continue where you left off'} · {resumePercent} %
            </button>
          </div>
        )}

        {/* Tags — hidden in reading mode. */}
        <div data-reading-hide className="flex flex-wrap gap-1.5 mb-8">
          {post.tags.map((tag) => (
            <span key={tag} className="skill-tag text-[10px]">{tag}</span>
          ))}
        </div>

        {/* Sections, progress and time left; nothing for an article with fewer than two sections */}
        <ArticleContents key={`contents-${post.id}-${lang}`} sections={sections} minutes={post.readingTime} />

        {/* Body — micromark HTML, styled by .blog-article-body in index.css */}
        <ArticleBody key={`${post.id}-${lang}`} html={html} />
        {/* Directly after the body: reaching it is reaching the end. */}
        <div ref={sentinelRef} data-read-sentinel aria-hidden="true" />

        {/* Share — offered once the piece has been read, reading mode included. */}
        <div className="mt-10">
          <ShareLinks post={post} />
        </div>

        {/* Bottom rule */}
        <div className="border-t-4 border-rule mt-12 mb-1" />
        <div className="border-t border-rule mb-6" />

        {/* The series this article belongs to: its next part, or its end */}
        {inSeries && (
          <section data-reading-hide data-series-end className="blogfront blogfront-series-end" aria-label={inSeries.series.name[lang]}>
            <p className="blogfront-kind">
              <span className="kicker">{inSeries.series.name[lang]}</span>
              <span data-series-progress>
                {progressLabel(inSeries.parts.filter((p) => readState.stateOf(p.slug) === 'read').length, inSeries.parts.length, lang)}
              </span>
            </p>
            {nextPart ? (
              <button
                onClick={() => handlePart(nextPart)}
                data-series-next={nextPart.slug}
                data-read-state={readState.stateOf(nextPart.slug)}
                className="blogfront-series-next px-card px-card-interactive bg-paper"
              >
                <span className="blogfront-series-next-label">
                  {es ? 'Siguiente de la serie' : 'Next in the series'} ·
                  <span>
                    {es ? 'Parte' : 'Part'} {inSeries.index + 2} {es ? 'de' : 'of'} {inSeries.parts.length}
                    <ArrowRight size={12} aria-hidden="true" />
                  </span>
                </span>
                <span data-read-title className="font-headline text-xl md:text-2xl font-bold text-ink leading-tight">
                  {es ? nextPart.title : nextPart.titleEn}
                </span>
                <ReadMark slug={nextPart.slug} variant="inline" />
              </button>
            ) : (
              <p data-series-closing className="blogfront-series-closing">
                {es
                  ? `Esta es la última parte de la serie «${inSeries.series.name.es}».`
                  : `This is the last part of the series "${inSeries.series.name.en}".`}{' '}
                <button data-series-restart onClick={() => handlePart(inSeries.parts[0])} className="blogfront-more">
                  {es ? 'Volver a la parte 1' : 'Back to part 1'} <ArrowRight size={12} aria-hidden="true" />
                </button>
              </p>
            )}
          </section>
        )}

        {/* Prev / Next navigation (fixes bug #4) */}
        <nav data-reading-hide className="flex justify-between items-stretch gap-4 mb-10">
          {prevPost ? (
            <button
              onClick={handlePrev}
              data-nav-slug={prevPost.slug}
              data-read-state={readState.stateOf(prevPost.slug)}
              className="flex-1 flex flex-col items-start gap-1 px-card px-card-sm px-card-interactive bg-paper p-4 text-left cursor-pointer"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted flex items-center gap-1">
                <ArrowLeft size={10} /> {lang === 'es' ? 'Anterior' : 'Previous'}
              </span>
              <span data-read-title className="font-headline text-sm font-bold text-ink leading-tight line-clamp-2">
                {lang === 'es' ? prevPost.title : prevPost.titleEn}
              </span>
              <ReadMark slug={prevPost.slug} variant="inline" />
            </button>
          ) : (
            <div className="flex-1" />
          )}

          {nextPost ? (
            <button
              onClick={handleNext}
              data-nav-slug={nextPost.slug}
              data-read-state={readState.stateOf(nextPost.slug)}
              className="flex-1 flex flex-col items-end gap-1 px-card px-card-sm px-card-interactive bg-paper p-4 text-right cursor-pointer"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted flex items-center gap-1">
                {lang === 'es' ? 'Siguiente' : 'Next'} <ArrowRight size={10} />
              </span>
              <span data-read-title className="font-headline text-sm font-bold text-ink leading-tight line-clamp-2">
                {lang === 'es' ? nextPost.title : nextPost.titleEn}
              </span>
              <ReadMark slug={nextPost.slug} variant="inline" />
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
        <div data-reading-hide>
          <Recommendations currentPost={post} />
        </div>
      </article>
    </motion.div>
  )
}
