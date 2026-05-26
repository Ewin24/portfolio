import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Tag } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import type { BlogPost } from '../../types'

export function BlogModal({
  post,
  onClose,
}: {
  post: BlogPost
  onClose: () => void
}) {
  const { lang } = useTranslation()

  const title   = lang === 'es' ? post.title   : post.titleEn
  const content = lang === 'es' ? post.content : post.contentEn

  // Split content into paragraphs on double newlines
  const paragraphs = content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-12 md:pt-20 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal content */}
        <motion.article
          className="relative z-10 w-full max-w-3xl border-2 border-ink bg-paper shadow-pixel-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="border-b-2 border-ink p-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-headline text-2xl md:text-3xl font-black text-ink leading-tight">
                {title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="font-mono text-[11px] text-ink-muted">{post.date}</span>
                <span className="font-mono text-[11px] text-ink-muted flex items-center gap-1">
                  <Clock size={11} /> {post.readingTime} min
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="skill-tag text-[9px] flex items-center gap-1">
                    <Tag size={8} /> {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 border-2 border-ink p-1.5 hover:bg-ink hover:text-paper transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto">
            {paragraphs.map((para, i) => {
              // Detect code blocks (``` ... ```)
              if (para.startsWith('```') && para.endsWith('```')) {
                const codeLines = para.split('\n').slice(1, -1) // Remove ``` fences
                const lang_label = codeLines[0]?.startsWith('csharp') ? 'csharp' : ''
                const code = lang_label ? codeLines.slice(1) : codeLines
                return (
                  <pre key={i} className="border-2 border-ink bg-paper-dark p-4 my-4 overflow-x-auto font-mono text-xs leading-relaxed">
                    <code>{code.join('\n')}</code>
                  </pre>
                )
              }

              // Detect headings (lines starting with ** at the very start)
              const headingMatch = para.match(/^\*\*(.+?)\*\*$/)
              if (headingMatch) {
                return (
                  <h3 key={i} className="font-headline text-lg font-bold text-ink mt-6 mb-3">
                    {headingMatch[1]}
                  </h3>
                )
              }

              // Inline bold: **text** → <strong>text</strong>
              const rendered = para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

              // Regular paragraph
              return (
                <p
                  key={i}
                  className="font-sans text-sm md:text-base text-ink-light leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: rendered }}
                />
              )
            })}
          </div>

          {/* Footer */}
          <div className="border-t-2 border-ink p-4 flex justify-center">
            <button
              onClick={onClose}
              className="px-btn px-btn-outline text-xs"
            >
              ← {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
            </button>
          </div>
        </motion.article>
      </motion.div>
    </AnimatePresence>
  )
}
