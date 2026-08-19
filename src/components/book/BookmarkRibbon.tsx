import { useEffect, useState } from 'react'

interface Props {
  stillness: boolean
}

/**
 * The registro — the ribbon sewn into the spine.
 *
 * It replaces the scarf that used to track progress here, and the difference
 * is not cosmetic: a scarf is a character's possession, a ribbon is part of
 * the book's own construction. It hangs from the top of the page and
 * lengthens as you read deeper — genuine scroll progress, nothing declared
 * about which chapter you are in. The palette swapping under the reader
 * already announces that.
 */
export function BookmarkRibbon({ stillness }: Props) {
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

  // The ribbon always shows some length, or it reads as broken rather than
  // as "you have only just begun".
  const length = 18 + progress * 64

  return (
    <div className="book-ribbon" aria-hidden="true">
      <div
        className="book-ribbon-tail"
        style={{ height: `${length}vh` }}
      />
    </div>
  )
}
