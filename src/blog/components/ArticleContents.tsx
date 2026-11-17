import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

/** A heading counts as reached once it is this close to the top of the window. */
const REACHED_PX = 140

interface Props {
  /** The article's sections, as `articleSections` returns them. */
  sections: { id: string; title: string }[]
  /** The article's reading time, in minutes. */
  minutes: number
}

/**
 * The sections of the open article: where the reader is, how much of the
 * article is behind and how long is left. Beside the column on a wide window,
 * a collapsed disclosure above the body otherwise (blogfront.css decides).
 *
 * Entries are buttons that scroll, never `#id` links: the hash belongs to the
 * router. The parent keys this by article and language.
 */
export function ArticleContents({ sections, minutes }: Props) {
  const { lang } = useTranslation()
  const rootRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [at, setAt] = useState<{ active: string | null; progress: number }>({ active: null, progress: 0 })
  const listed = sections.length >= 2

  useEffect(() => {
    const body = rootRef.current?.closest('article')?.querySelector<HTMLElement>('.blog-article-body')
    if (!body) return

    let frame = 0
    const measure = () => {
      frame = 0
      const rect = body.getBoundingClientRect()
      // The same measure the reading state saves: 0 with the top of the body
      // at the top of the window, 1 with its end at the bottom.
      const span = rect.height - window.innerHeight
      const raw = span > 0 ? -rect.top / span : rect.bottom <= window.innerHeight ? 1 : 0
      const progress = Math.round(Math.min(1, Math.max(0, raw)) * 100) / 100
      let active: string | null = null
      for (const heading of body.querySelectorAll('h2[id]')) {
        if (heading.getBoundingClientRect().top > REACHED_PX) break
        active = heading.id
      }
      setAt((prev) => (prev.active === active && prev.progress === progress ? prev : { active, progress }))
    }
    const schedule = () => {
      frame ||= requestAnimationFrame(measure)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [listed])

  if (!listed) return null

  const go = (id: string) => {
    rootRef.current
      ?.closest('article')
      ?.querySelector(`#${id}`)
      ?.scrollIntoView({
        block: 'start',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
  }

  const es = lang === 'es'
  const title = es ? 'Contenido' : 'Contents'
  const percent = Math.round(at.progress * 100)
  // Rounded up and never zero while there is article left.
  const left = at.progress >= 1 ? 0 : Math.max(1, Math.ceil(minutes * (1 - at.progress)))
  const remaining = left === 0 ? (es ? 'fin del artículo' : 'end of the article') : es ? `quedan ${left} min` : `${left} min left`

  return (
    <nav ref={rootRef} data-article-contents data-reading-hide aria-label={title} className="blogfront blogfront-toc">
      <div className="blogfront-toc-box">
        <button
          type="button"
          data-contents-toggle
          aria-expanded={open}
          aria-controls="blogfront-toc-list"
          onClick={() => setOpen(!open)}
          className="blogfront-toc-toggle"
        >
          {title}
          <ChevronDown size={14} aria-hidden="true" />
        </button>
        <p className="blogfront-toc-title" aria-hidden="true">{title}</p>

        <p data-time-left={left} data-progress={percent} className="blogfront-toc-status">
          {percent} % · {remaining}
        </p>
        <div className="blogfront-toc-bar" aria-hidden="true" style={{ '--p': at.progress } as CSSProperties} />

        <ol id="blogfront-toc-list" data-open={open} className="blogfront-toc-list">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                data-section={section.id}
                aria-current={at.active === section.id ? 'location' : undefined}
                onClick={() => go(section.id)}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
