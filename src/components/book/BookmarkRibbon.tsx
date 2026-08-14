import { useEffect, useState } from 'react'
import type { Chapter } from '../../theme/chapters'
import { CHAPTERS } from '../../theme/chapters'
import { useTranslation } from '../../hooks/useTranslation'

interface Props {
  chapter: Chapter
  stillness: boolean
}

/**
 * The registro — the ribbon sewn into the spine.
 *
 * It replaces the scarf that used to track progress here, and the difference
 * is not cosmetic: a scarf is a character's possession, a ribbon is part of
 * the book's own construction. It hangs from the top of the page, lengthens
 * as you read deeper, and carries the chapter's name and number the way a
 * running head does.
 *
 * The number is the chapter's position in the book, set in small caps
 * roman, because that is how a book numbers its own parts.
 */
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

export function BookmarkRibbon({ chapter, stillness }: Props) {
  const { lang } = useTranslation()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (stillness) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight
        setProgress(scrollable > 0 ? window.scrollY / scrollable : 0)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [stillness])

  const index = CHAPTERS.findIndex((entry) => entry.id === chapter.id)
  const numeral = ROMAN[index] ?? ''

  // The ribbon always shows some length, or it reads as broken rather than
  // as "you have only just begun".
  const length = 18 + progress * 64

  return (
    <div className="book-ribbon" aria-hidden="true">
      <div
        className="book-ribbon-tail"
        style={{ height: `${length}vh` }}
      />
      <div className="book-ribbon-label">
        <span className="book-ribbon-numeral">{numeral}</span>
        <span className="book-ribbon-name">
          {lang === 'es' ? chapter.label.es : chapter.label.en}
        </span>
      </div>
    </div>
  )
}
