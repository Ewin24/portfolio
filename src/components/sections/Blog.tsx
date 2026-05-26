import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Tag, ArrowLeft, ArrowRight, Calendar } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { blogPosts } from '../../content'
import type { BlogPost } from '../../types'

// ─── Blog Card (lista) ──────────────────────────────────────────────────────
function BlogCard({ post, index, onRead }: { post: BlogPost; index: number; onRead: () => void }) {
  const { lang } = useTranslation()
  const title   = lang === 'es' ? post.title   : post.titleEn
  const excerpt = lang === 'es' ? post.excerpt : post.excerptEn

  return (
    <FadeIn delay={index * 0.08}>
      <article className="border-2 border-ink bg-paper shadow-pixel-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-75 flex flex-col h-full">
        <div className="p-5 flex-1 flex flex-col gap-3">
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="skill-tag text-[9px] flex items-center gap-1">
                <Tag size={7} /> {tag}
              </span>
            ))}
          </div>

          <h3 className="font-headline text-lg font-bold text-ink leading-tight line-clamp-2">
            {title}
          </h3>

          <p className="font-sans text-xs text-ink-light leading-relaxed line-clamp-3 flex-1">
            {excerpt}
          </p>

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

// ─── Artículo completo (vista periódico) ─────────────────────────────────────
function ArticleView({ post, onBack }: { post: BlogPost; onBack: () => void }) {
  const { lang } = useTranslation()
  const title    = lang === 'es' ? post.title    : post.titleEn
  const content  = lang === 'es' ? post.content  : post.contentEn
  const backLabel = lang === 'es' ? '← Volver a artículos' : '← Back to articles'

  const paragraphs = content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)

  return (
    <motion.div
      key={`article-${post.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
    >
      <article className="max-w-4xl mx-auto">
        {/* Back link */}
        <button
          onClick={onBack}
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

        {/* Body */}
        <div className="font-sans text-sm md:text-base text-ink-light leading-[1.75] space-y-5 max-w-3xl">
          {paragraphs.map((para, i) => {
            // Code block (``` ... ```)
            if (para.startsWith('```') && para.endsWith('```')) {
              const lines = para.split('\n')
              const codeLines = lines.slice(1, -1)
              // Remove language identifier if present
              const firstLine = codeLines[0]
              const code = firstLine && (firstLine === 'csharp' || firstLine === 'typescript' || firstLine === 'sql')
                ? codeLines.slice(1)
                : codeLines
              return (
                <pre
                  key={i}
                  className="border-2 border-ink bg-paper-dark p-4 md:p-5 overflow-x-auto font-mono text-[11px] md:text-xs leading-relaxed shadow-pixel-sm my-6 -mx-2 md:mx-0"
                  style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                >
                  <code>{code.join('\n')}</code>
                </pre>
              )
            }

            // Section heading: **Heading**
            const headingMatch = para.match(/^\*\*(.+?)\*\*$/)
            if (headingMatch) {
              return (
                <div key={i} className="pt-4">
                  <div className="border-t-2 border-ink mb-3" />
                  <h2 className="font-headline text-xl md:text-2xl font-bold text-ink leading-tight">
                    {headingMatch[1]}
                  </h2>
                </div>
              )
            }

            // Inline bold **text** → <strong>
            const rendered = para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

            // First paragraph: drop cap
            if (i === 0) {
              const firstChar = rendered.charAt(0)
              const rest = rendered.slice(1)
              return (
                <p key={i} className="leading-[1.75]">
                  <span className="font-headline text-5xl md:text-6xl font-black float-left mr-2 mt-1 leading-[0.8] text-ink">
                    {firstChar}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: rest }} />
                </p>
              )
            }

            return (
              <p key={i} dangerouslySetInnerHTML={{ __html: rendered }} />
            )
          })}
        </div>

        {/* Bottom rule + back */}
        <div className="border-t-4 border-ink mt-12 mb-1" />
        <div className="border-t border-ink mb-6" />

        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-accent transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          {backLabel}
        </button>
      </article>
    </motion.div>
  )
}

// ─── Section ────────────────────────────────────────────────────────────────
export function Blog() {
  const { t } = useTranslation()
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const isReading = selectedPost !== null

  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <section id="blog" className="py-20 px-6 max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        {isReading && selectedPost ? (
          <ArticleView
            key="article"
            post={selectedPost}
            onBack={() => setSelectedPost(null)}
          />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Section header */}
            <FadeIn>
              <div className="mb-10">
                <div className="border-t-4 border-ink mb-1" />
                <div className="border-t border-ink mb-4" />
                <h2 className="font-headline text-4xl md:text-5xl font-black text-ink leading-none">
                  {t('blog.title')}
                </h2>
                <p className="font-mono text-xs text-ink-muted mt-2">
                  {t('blog.subtitle')}
                </p>
                <div className="border-t-4 border-ink mt-4" />
              </div>
            </FadeIn>

            {sortedPosts.length === 0 ? (
              <FadeIn>
                <div className="border-2 border-ink p-8 text-center bg-paper-dark">
                  <p className="font-headline text-xl font-bold italic text-ink-muted">
                    {t('blog.empty')}
                  </p>
                </div>
              </FadeIn>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sortedPosts.map((post, i) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    index={i}
                    onRead={() => {
                      setSelectedPost(post)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
