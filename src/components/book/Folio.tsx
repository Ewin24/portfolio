import { useEffect, useState } from 'react'

interface Props {
  stillness: boolean
}

/**
 * The folio.
 *
 * A book counts its own pages, and that count is one of the few pieces of
 * furniture a reader never consciously looks at but immediately misses. It
 * is derived from reading depth rather than from the section, so it advances
 * continuously the way a page number does — a folio that jumped from 12 to
 * 47 between sections would read as a broken widget, not as paper.
 *
 * LEAVES is the length of a plausible novel. It is a fiction, and openly so:
 * the point is the gesture of pagination, not an accurate count of anything.
 */
const LEAVES = 178

export function Folio({ stillness }: Props) {
  const [depth, setDepth] = useState(0)

  useEffect(() => {
    if (stillness) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight
        setDepth(scrollable > 0 ? window.scrollY / scrollable : 0)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [stillness])

  const page = 1 + Math.round(depth * (LEAVES - 1))

  return (
    <div className="book-folio" aria-hidden="true">
      — {page} —
    </div>
  )
}
