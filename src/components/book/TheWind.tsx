import { useEffect, useRef, useState, type ReactNode } from 'react'

interface Props {
  active: boolean
  still: boolean
  children: ReactNode
}

/**
 * The wind.
 *
 * The novel ends the instant the parchments are finished: the town is swept
 * off the map by a wind, and it happens as the last line is read, not after.
 * So this does not run on a timer and it is not decoration on the footer —
 * it is bound to the one thing that means "you have finished reading": the
 * true bottom of the page.
 *
 * Reaching the last screen begins to carry the letters off. Scrolling back
 * up brings them home. That reversibility is deliberate on two counts: it is
 * an effect the reader controls rather than one inflicted on them, and it
 * means the footer never becomes permanently unreadable — this is a portfolio
 * and the contact line has to survive its own literary conceit.
 *
 * Accessibility: only the visual layer is split. The original text stays in
 * the DOM inside an aria-hidden wrapper with a readable copy beside it, so a
 * screen reader gets an intact sentence and never a stream of loose letters.
 */

/**
 * How much of a screen height the dissolve occupies, measured back from the
 * true bottom of the document.
 *
 * Bound to the viewport and NOT to a fraction of total scroll: a document
 * fraction meant the wind started at 62% of the page — halfway through the
 * references — because "the last 55% of a long page" is most of the page.
 * The end of the novel is the last screen, not the second half of the book.
 */
const RANGE_SCREENS = 0.5

function scatter(text: string, progress: number, still: boolean) {
  const chars = [...text]

  return chars.map((char, i) => {
    if (char === ' ') return ' '

    // Deterministic per-character drift: same letter, same path, every time.
    // Random here would make the sentence shimmer on every scroll frame.
    const seed = (i * 73) % 17
    const dir = seed % 2 === 0 ? 1 : -1
    const lead = (i % 7) / 7

    // Letters do not leave at once. The ones further along the line go first,
    // so the sentence unravels from the end the way a line of type would.
    const local = still ? 0 : Math.max(0, Math.min(1, (progress - lead * 0.35) / 0.65))

    // The dissolve is capped rather than completed. Letting it reach zero
    // emptied the footer entirely at rest, and an empty footer does not read
    // as "the wind took it" — it reads as a bug. Leaving the last fragments
    // legible keeps the gesture and keeps the credit line readable.
    const style = local > 0
      ? {
          transform: `translate(${local * (26 + seed * 5) * dir}px, ${-local * (10 + seed * 2)}px) rotate(${local * dir * (14 + seed)}deg)`,
          opacity: 1 - local * 0.8,
        }
      : undefined

    return (
      <span key={i} className="wind-letter" style={style}>
        {char}
      </span>
    )
  })
}

export function TheWind({ active, still, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [lines, setLines] = useState<string[]>([])

  // Read the footer's own text once, so this component never has to be told
  // what it is dissolving.
  useEffect(() => {
    if (!active || !hostRef.current) return

    // Scoped to .wind-source on purpose. Querying the whole host also matched
    // the <p> elements this component had just rendered into .wind-scattered,
    // so every pass re-read its own output and the footer grew a fresh copy
    // of itself each time — 192 letters, then 256, then 320.
    const source = hostRef.current.querySelector('.wind-source')
    if (!source) return

    const found = Array.from(source.querySelectorAll('p'))
      .map((p) => p.textContent?.trim() ?? '')
      .filter(Boolean)
    setLines(found)
  }, [active, children])

  useEffect(() => {
    if (!active || still) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const doc = document.documentElement
        const scrollable = doc.scrollHeight - window.innerHeight
        if (scrollable <= 0) return

        // Distance still to travel before the true bottom, in pixels.
        const remaining = scrollable - window.scrollY
        const span = window.innerHeight * RANGE_SCREENS

        // 0 anywhere above the last half-screen; 1 at the very end.
        setProgress(Math.max(0, Math.min(1, 1 - remaining / span)))
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [active, still])

  if (!active) return <>{children}</>

  return (
    <div ref={hostRef} className="wind-host">
      {/* The intact sentence, for assistive tech and for measuring. */}
      <div className="wind-source">{children}</div>

      {lines.length > 0 && (
        <div className="wind-scattered" aria-hidden="true">
          {lines.map((line, i) => (
            <p key={i} className="wind-line">
              {scatter(line, progress, still)}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
