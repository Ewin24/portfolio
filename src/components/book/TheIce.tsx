import { useEffect, useRef, useState, type ReactNode } from 'react'

export interface TheIceProps {
  active: boolean
  still: boolean
  children: ReactNode
}

/**
 * No pointer input for this long clears the sheet for good. Exported so a
 * measurement harness can read the real constant rather than hardcoding it.
 */
export const ICE_CLEAR_MS = 4000
/** Matches the `.ice-sheet` opacity transition in index.css. */
export const ICE_FADE_MS = 700
/** Roughly how far a pointer has to travel before it leaves a new stamp. */
const STAMP_STEP_PX = 24
/** Stamps are a wiped window, not an infinite one. */
const STAMP_CAP = 12

interface Point {
  x: number
  y: number
}

/**
 * The ice.
 *
 * The gypsies charged admission to touch a block of ice, and the child who
 * put his hand on it said it was boiling — because it burned with cold, and
 * because nobody in a town that had never seen winter had a word for that.
 * The marvel in the scene is not the ice. It is that it had to be TOUCHED to
 * be believed — on every device a visitor is holding, not only a mouse.
 *
 * The live patch follows the pointer in real time, exactly as it always did
 * for a mouse (`--hand-x`/`--hand-y` driving the existing `.is-touched` mask
 * rule). A coarse pointer additionally leaves a trail of stamps behind it,
 * because a touch that vanishes the instant the finger lifts is unreachable
 * on the device this section exists for — the browser can reclaim the
 * gesture for scrolling at any moment and fire `pointercancel`, so a wipe
 * that only exists while the finger is down would reproduce exactly the
 * defect this fixes.
 *
 * Left alone, the frost clears itself after `ICE_CLEAR_MS` of no input and
 * never re-forms for that mount — the portrait must not stay permanently
 * obscured for a reader who never touches it.
 */
export function TheIce({ active, still, children }: TheIceProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [hand, setHand] = useState<Point | null>(null)
  const [stamps, setStamps] = useState<Point[]>([])
  const [thawed, setThawed] = useState(false)

  const lastStampClient = useRef<Point | null>(null)
  const clearTimer = useRef<number | undefined>(undefined)
  const hasIntersected = useRef(false)

  const armClearTimer = () => {
    window.clearTimeout(clearTimer.current)
    clearTimer.current = window.setTimeout(() => setThawed(true), ICE_CLEAR_MS)
  }

  useEffect(() => {
    if (!active || still) return
    const host = hostRef.current
    if (!host) return

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      if (hasIntersected.current) return
      hasIntersected.current = true
      armClearTimer()
      observer.disconnect()
    })
    observer.observe(host)

    return () => {
      observer.disconnect()
      window.clearTimeout(clearTimer.current)
    }
  }, [active, still])

  if (!active || still) return <>{children}</>

  if (thawed) {
    return (
      <div ref={hostRef} className="ice-host">
        {children}
        <div className="ice-sheet is-thawed" aria-hidden="true" />
      </div>
    )
  }

  const onMove = (event: React.PointerEvent) => {
    const rect = hostRef.current?.getBoundingClientRect()
    if (!rect) return

    const point: Point = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    }
    setHand(point)

    if (hasIntersected.current) armClearTimer()

    // Coarse pointers leave a trail; a mouse keeps the single live patch it
    // always had, closing again the instant it moves on.
    if (event.pointerType === 'mouse') return

    const last = lastStampClient.current
    const travelled =
      !last || Math.hypot(event.clientX - last.x, event.clientY - last.y) >= STAMP_STEP_PX

    if (travelled) {
      lastStampClient.current = { x: event.clientX, y: event.clientY }
      setStamps((prev) => {
        const next = [...prev, point]
        return next.length > STAMP_CAP ? next.slice(next.length - STAMP_CAP) : next
      })
    }
  }

  const onEnd = () => setHand(null)

  const gradients = stamps.length > 0 ? [...(hand ? [hand] : []), ...stamps] : []
  const maskImage =
    gradients.length > 0
      ? gradients
          .map(
            (g) =>
              `radial-gradient(circle 74px at ${g.x}% ${g.y}%, transparent 0%, transparent 38%, rgba(0, 0, 0, 0.6) 62%, black 100%)`,
          )
          .join(', ')
      : undefined

  const style = {
    ...(hand
      ? { '--hand-x': `${hand.x}%`, '--hand-y': `${hand.y}%` }
      : undefined),
    ...(maskImage
      ? {
          maskImage,
          WebkitMaskImage: maskImage,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }
      : undefined),
  } as React.CSSProperties

  return (
    <div
      ref={hostRef}
      className="ice-host"
      onPointerMove={onMove}
      onPointerUp={onEnd}
      onPointerCancel={onEnd}
      onPointerLeave={onEnd}
    >
      {children}

      <div
        className={`ice-sheet${hand ? ' is-touched' : ''}`}
        aria-hidden="true"
        style={style}
      />
    </div>
  )
}
