import { useEffect, useRef } from 'react'

/**
 * A thin accent bar along the bottom edge of its (positioned) parent that
 * mirrors how far the page has been read. One passive scroll listener,
 * throttled to a frame, writes `--p` (0..1); CSS does the drawing. It only
 * follows the reader's own scroll, so reduced motion needs no special case.
 */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const root = document.documentElement
      const max = root.scrollHeight - root.clientHeight
      ref.current?.style.setProperty('--p', String(max > 0 ? root.scrollTop / max : 0))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return <div ref={ref} aria-hidden="true" className="reading-progress" />
}
