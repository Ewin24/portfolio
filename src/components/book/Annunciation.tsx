import { useEffect, useRef, type RefObject } from 'react'
import { ANNOUNCE_ATTR } from './attrs'

/**
 * The annunciation.
 *
 * In the novel the yellow butterflies do not follow Mauricio Babilonia —
 * they precede him. The house knows he is coming because they arrive first.
 * That is the whole behaviour encoded here, and it is why this is not a
 * cursor-reactive particle field:
 *
 *   - A card is *announced* when it enters the viewport, before it can be
 *     read. The butterflies converge on it ahead of the reader's attention.
 *   - Hovering only deepens what has already begun. It is reinforcement,
 *     not the trigger.
 *   - They accumulate. A card held in view gathers more of them, the way the
 *     house filled up until the family started swatting at them.
 *   - They LAND, on the card's own edge, and fold their wings to a slow idle.
 *     Particles that merely orbit read as decoration; particles that come to
 *     rest on a specific object read as having chosen it.
 *
 * Legibility, which is the trap this chapter sets for itself: the chapter is
 * named for yellow butterflies and its page is yellow, so a filled yellow
 * wing measures 1.44:1 against it and disappears. Darkening the wing until it
 * passes turns it brown, which is no longer the image. So the wing keeps the
 * true yellow and gains a dark outline and body — the silhouette carries
 * legibility (9:1), the fill carries identity.
 *
 * Flight is steering, not a sine wave: each butterfly seeks a point with a
 * clamped force, so the path curves and overshoots the way a real one does,
 * and the heading it ends up with is what orients the wings.
 */

const WING = '#E8B93A'
const EDGE = '#4A3610'
const BODY = '#3E2D0C'

type Phase = 'wander' | 'seek' | 'landed'

interface Butterfly {
  x: number
  y: number
  vx: number
  vy: number
  /** Desynchronises the wingbeat so they never flap in unison. */
  phase: number
  size: number
  speed: number
  state: Phase
  target: Element | null
  landX: number
  landY: number
  /** Heading is smoothed separately so landing does not snap the wings. */
  angle: number
}

export interface AnnunciationCanvasProps {
  /** Turns the whole layer off — the wrong theme. */
  active: boolean
  /** Under stillness they are drawn once, already at rest. */
  still: boolean
  /**
   * The card host, owned by the eager shim (`lazy.tsx`). The cards render
   * *inside* it so their rects are measured in the same coordinate space as
   * the canvas, and so the pointer listener that tracks hovering sits on
   * their common ancestor — this component only takes a ref to it.
   */
  hostRef: RefObject<HTMLDivElement | null>
}

/** The canvas layer alone. The host div and the cards themselves stay in the
 *  eager shim so the theme flip never remounts them (see `lazy.tsx`). */
export function AnnunciationCanvas({ active, still, hostRef }: AnnunciationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas || !active) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let frame = 0
    let last = performance.now()

    /** Cards currently in view, most-attended first. */
    let announced: Element[] = []
    let hovered: Element | null = null

    const butterflies: Butterfly[] = []

    const resize = () => {
      const rect = host.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const seed = () => {
      butterflies.length = 0
      const count = Math.max(5, Math.round(10 * Math.min(1, width / 1100)))
      for (let i = 0; i < count; i++) {
        butterflies.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.05,
          vy: (Math.random() - 0.5) * 0.05,
          phase: Math.random() * Math.PI * 2,
          size: 4.5 + Math.random() * 3,
          speed: 0.05 + Math.random() * 0.05,
          state: 'wander',
          target: null,
          landX: 0,
          landY: 0,
          angle: Math.random() * Math.PI * 2,
        })
      }
    }

    /**
     * A point just OUTSIDE the card's edge, in canvas space.
     *
     * Landing exactly on the perimeter put wings over the first and last
     * words of every line, because a text block runs close to its own edge —
     * "brea(k)ing", "Edw(i)n". A butterfly covering the word you are reading
     * is not atmosphere, it is a defect.
     *
     * So they grip the outside of the leaf. OUTSET pushes them clear of the
     * type, which is also the truthful image: something settling on a page
     * lands on its edge, not on the middle of a paragraph.
     */
    const OUTSET = 7

    const landingPoint = (el: Element) => {
      const card = el.getBoundingClientRect()
      const base = host.getBoundingClientRect()
      const left = card.left - base.left
      const top = card.top - base.top

      const edge = Math.floor(Math.random() * 4)
      const along = 0.15 + Math.random() * 0.7

      switch (edge) {
        case 0:
          return { x: left + card.width * along, y: top - OUTSET }
        case 1:
          return { x: left + card.width + OUTSET, y: top + card.height * along }
        case 2:
          return { x: left + card.width * along, y: top + card.height + OUTSET }
        default:
          return { x: left - OUTSET, y: top + card.height * along }
      }
    }

    /**
     * How many butterflies a card has earned. A hovered card pulls hardest,
     * but simply being in view already summons some — the announcement has
     * to precede the reading, or it is not an announcement.
     */
    const quotaFor = (el: Element) =>
      el === hovered ? 0.3 : 0.1

    const assign = () => {
      if (announced.length === 0) {
        for (const b of butterflies) {
          if (b.state !== 'wander') {
            b.state = 'wander'
            b.target = null
          }
        }
        return
      }

      for (const card of announced) {
        const want = Math.round(butterflies.length * quotaFor(card))
        const have = butterflies.filter((b) => b.target === card).length
        if (have >= want) continue

        let need = want - have
        for (const b of butterflies) {
          if (need === 0) break
          if (b.target !== null) continue
          const point = landingPoint(card)
          b.target = card
          b.landX = point.x
          b.landY = point.y
          b.state = 'seek'
          need--
        }
      }

      // Release anyone whose card stopped being attended.
      for (const b of butterflies) {
        if (b.target && !announced.includes(b.target)) {
          b.target = null
          b.state = 'wander'
        }
      }
    }

    const step = (dt: number, t: number) => {
      for (const b of butterflies) {
        if (b.state === 'landed') {
          // Resting. Only the wings move, and slowly.
          continue
        }

        let ax = 0
        let ay = 0

        if (b.state === 'seek' && b.target) {
          const dx = b.landX - b.x
          const dy = b.landY - b.y
          const dist = Math.hypot(dx, dy) || 1

          if (dist < 3) {
            b.state = 'landed'
            b.x = b.landX
            b.y = b.landY
            continue
          }

          // Seek with a clamped force, so the path curves instead of
          // snapping to a straight line.
          ax = (dx / dist) * b.speed * 0.02
          ay = (dy / dist) * b.speed * 0.02
        } else {
          // Wander: a slowly rotating impulse rather than fresh randomness
          // each frame, which would read as jitter.
          ax = Math.cos(t * 0.5 + b.phase) * 0.006
          ay = Math.sin(t * 0.37 + b.phase * 1.7) * 0.006
        }

        b.vx += ax * dt
        b.vy += ay * dt

        // Damping keeps them from accelerating forever.
        b.vx *= 0.985
        b.vy *= 0.985

        const speed = Math.hypot(b.vx, b.vy)
        const max = b.speed * 1.6
        if (speed > max) {
          b.vx = (b.vx / speed) * max
          b.vy = (b.vy / speed) * max
        }

        b.x += b.vx * dt
        b.y += b.vy * dt

        // Wrap only while wandering; a seeking one must not teleport.
        if (b.state === 'wander') {
          if (b.x < -20) b.x = width + 20
          if (b.x > width + 20) b.x = -20
          if (b.y < -20) b.y = height + 20
          if (b.y > height + 20) b.y = -20
        }

        if (speed > 0.001) {
          const want = Math.atan2(b.vy, b.vx)
          // Shortest-arc smoothing, so crossing PI does not spin the wings.
          let delta = want - b.angle
          while (delta > Math.PI) delta -= Math.PI * 2
          while (delta < -Math.PI) delta += Math.PI * 2
          b.angle += delta * 0.08
        }
      }
    }

    const paint = (t: number) => {
      ctx.clearRect(0, 0, width, height)

      for (const b of butterflies) {
        // A landed butterfly breathes; a flying one beats.
        const rate = b.state === 'landed' ? 0.9 : 7
        const open = b.state === 'landed' ? 0.28 : 1
        const flap = Math.abs(Math.sin(t * rate + b.phase))
        const span = b.size * (0.35 + open * flap)

        // In transit they have to cross the card to reach its far edge, and
        // a solid wing passing over a word is a defect no matter how brief.
        // So flight is translucent and only the landed ones are solid: the
        // ones in the air read as atmosphere, the ones that have chosen a
        // card read as present.
        ctx.globalAlpha = b.state === 'landed' ? 1 : 0.4

        ctx.save()
        ctx.translate(b.x, b.y)
        // +PI/2 so the body points along the heading and the wings open
        // across it, which is the view you get from above.
        ctx.rotate(b.angle + Math.PI / 2)

        ctx.lineWidth = 0.9
        ctx.strokeStyle = EDGE
        ctx.fillStyle = WING

        for (const side of [-1, 1]) {
          ctx.beginPath()
          ctx.ellipse(
            side * span * 0.55,
            0,
            span * 0.55,
            b.size * 0.95,
            side * 0.3,
            0,
            Math.PI * 2,
          )
          ctx.fill()
          ctx.stroke()
        }

        ctx.fillStyle = BODY
        ctx.beginPath()
        ctx.ellipse(0, 0, b.size * 0.16, b.size * 0.85, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      ctx.globalAlpha = 1
    }

    const loop = (now: number) => {
      const dt = Math.min(now - last, 48)
      last = now
      const t = now / 1000

      assign()
      step(dt, t)
      paint(t)

      frame = requestAnimationFrame(loop)
    }

    resize()
    seed()

    // Which cards are in view — this is the announcement itself.
    const cards = Array.from(host.querySelectorAll(`[${ANNOUNCE_ATTR}]`))

    /**
     * Under stillness there is no animation loop, so nothing would ever
     * repaint. The observer fires asynchronously and always *after* the
     * initial pass, which means an immediate one-shot paint would run with
     * an empty `announced` list and draw nothing at all. So the still branch
     * repaints from here instead: whenever the set of visible cards changes,
     * the butterflies are placed and drawn once, already at rest.
     */
    const settleStill = () => {
      assign()
      for (const b of butterflies) {
        if (b.target) {
          b.x = b.landX
          b.y = b.landY
          b.state = 'landed'
        }
      }
      paint(0)
    }

    const inView = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) {
            if (!announced.includes(record.target)) announced.push(record.target)
          } else {
            announced = announced.filter((el) => el !== record.target)
          }
        }
        if (still) settleStill()
      },
      { rootMargin: '-10% 0px -10% 0px', threshold: 0 },
    )
    for (const card of cards) inView.observe(card)

    const onOver = (event: Event) => {
      const el = (event.target as Element | null)?.closest?.(`[${ANNOUNCE_ATTR}]`)
      hovered = el ?? null
    }
    const onLeave = () => { hovered = null }

    host.addEventListener('pointermove', onOver)
    host.addEventListener('pointerleave', onLeave)

    const observer = new ResizeObserver(() => {
      resize()
      seed()
      // Landing points were measured against the old rects; recompute them.
      if (still) settleStill()
    })
    observer.observe(host)

    if (!still) {
      last = performance.now()
      frame = requestAnimationFrame(loop)
    }
    // The still branch is driven entirely by settleStill() from the observer
    // and the resize handler — there is no loop to start.

    return () => {
      cancelAnimationFrame(frame)
      inView.disconnect()
      observer.disconnect()
      host.removeEventListener('pointermove', onOver)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [active, still, hostRef])

  return (
    <canvas ref={canvasRef} className="annunciation-canvas" aria-hidden="true" />
  )
}
