import { useEffect, useRef } from 'react'
import type { Chapter } from '../../theme/chapters'
import { hexToRgb, lerpRgb, type Rgb } from '../../theme/color'

interface Props {
  chapter: Chapter
  stillness: boolean
}

/** Allocated once, above the busiest chapter's count. */
const MAX_GRAINS = 64

interface Grain {
  /** Normalised 0..1 so a resize never invalidates a position. */
  x: number
  y: number
  size: number
  speed: number
  phase: number
}

function seedGrains(): Grain[] {
  return Array.from({ length: MAX_GRAINS }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: 0.6 + Math.random() * 1.9,
    speed: 0.5 + Math.random() * 1.4,
    phase: Math.random() * Math.PI * 2,
  }))
}

/**
 * The air.
 *
 * One canvas carries every chapter's airborne material — drifting sand,
 * rising motes, falling snow, fixed stars — because the difference between
 * them is a motion rule, not a different system.
 *
 * Three things keep it cheap enough to leave running:
 *   - the grain pool is allocated once and only the first N are drawn, so a
 *     chapter change never reallocates;
 *   - colour is interpolated per frame toward the new chapter instead of
 *     being swapped, which is what stops a hard flip on the handoff;
 *   - the loop stops entirely when the tab is hidden, and never starts at
 *     all when the visitor asked for reduced motion.
 */
export function ParticleField({ chapter, stillness }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Read inside the loop so a chapter change does not restart the simulation.
  const chapterRef = useRef(chapter)
  chapterRef.current = chapter

  useEffect(() => {
    if (stillness) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const grains = seedGrains()
    let width = 0
    let height = 0
    let colour: Rgb = hexToRgb(chapter.particle.color)
    let frame = 0
    let last = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now: number) => {
      // Clamp the step so a backgrounded tab does not teleport every grain.
      const dt = Math.min(now - last, 48)
      last = now
      const t = now / 1000

      const { kind, color, count } = chapterRef.current.particle
      colour = lerpRgb(colour, hexToRgb(color), 0.04)
      const [r, g, b] = colour.map(Math.round)

      // Density follows viewport width — a phone gets a fraction of the field.
      const active = Math.max(
        10,
        Math.round(count * Math.min(1, width / 1280)),
      )

      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < active; i++) {
        const grain = grains[i]
        let alpha = 0.5

        switch (kind) {
          case 'dust':
            // Motes turning over in a shaft of light: they rise, because warm
            // air in a closed room is what keeps them up.
            grain.y -= grain.speed * 0.000028 * dt
            grain.x += Math.sin(t * 0.22 + grain.phase) * 0.00009
            if (grain.y < -0.02) grain.y = 1.02
            alpha = 0.34 + 0.3 * Math.abs(Math.sin(t * 0.5 + grain.phase))
            break

          case 'rain':
            // Steep and fast, with barely any sideways drift. This is the
            // downpour that settles in for years, not a passing shower.
            grain.y += grain.speed * 0.00028 * dt
            grain.x -= grain.speed * 0.000018 * dt
            if (grain.y > 1.02) {
              grain.y = -0.02
              grain.x = grain.x < -0.02 ? 1.02 : grain.x
            }
            alpha = 0.3
            break

          case 'ink':
            // Suspended rather than falling — specks held in the fibre of a
            // page that has already been written on.
            grain.x += Math.sin(t * 0.16 + grain.phase) * 0.00007
            grain.y += Math.cos(t * 0.13 + grain.phase) * 0.00005
            alpha = 0.28 + 0.24 * Math.abs(Math.sin(t * 0.34 + grain.phase))
            break

          case 'ash':
            // Falling, but taken sideways by the wind that is erasing the town.
            grain.y += grain.speed * 0.00006 * dt
            grain.x += grain.speed * 0.00011 * dt
            if (grain.y > 1.02) grain.y = -0.02
            if (grain.x > 1.02) grain.x = -0.02
            alpha = 0.42 + 0.2 * Math.sin(t * 0.4 + grain.phase)
            break
        }

        const px = grain.x * width
        const py = grain.y * height

        if (kind === 'rain') {
          // A short streak reads as speed; a disc at this size reads as snow.
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
          ctx.lineWidth = Math.max(0.6, grain.size * 0.5)
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(px - grain.size * 0.8, py + grain.size * 7)
          ctx.stroke()
          continue
        }

        // A wide dim disc under a small bright core reads as glow without
        // paying for shadowBlur, which is the expensive way to do this.
        if (kind === 'dust' || kind === 'ink') {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.22})`
          ctx.beginPath()
          ctx.arc(px, py, grain.size * 3.2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.beginPath()
        ctx.arc(px, py, grain.size, 0, Math.PI * 2)
        ctx.fill()
      }

      frame = requestAnimationFrame(draw)
    }

    const start = () => {
      last = performance.now()
      frame = requestAnimationFrame(draw)
    }

    const stop = () => cancelAnimationFrame(frame)

    const onVisibility = () => {
      stop()
      if (!document.hidden) start()
    }

    resize()
    start()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
    // chapter is intentionally absent: the loop reads it through chapterRef,
    // and restarting the simulation on every chapter would reseed the field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stillness])

  if (stillness) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
