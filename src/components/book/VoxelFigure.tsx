import { useEffect, useMemo, useRef } from 'react'
import type { Model } from './voxelModels'

interface Props {
  build: () => Model
  active: boolean
  still: boolean
  /** Read out to assistive tech and shown as the title. */
  label: string
  /** Two words under the object, naming what pressing it does. */
  hint: string
  size?: 'lead' | 'inline'
}

/**
 * A voxel object you can take hold of, rendered by hand.
 *
 * A voxel is a cube, a cube is three parallelograms under an isometric
 * projection, and the draw order is a painter's algorithm. That is the whole
 * renderer, which is why the figures cost about a kilobyte between them
 * instead of the ~140 kB a 3D engine would have added to a critical bundle
 * that was deliberately cut twice.
 *
 * Every object has two arrangements and the press moves between them: the
 * fish melts, the alembic pours, the letter opens. A mascot that only spins
 * is decoration; an object that DOES the thing its chapter is about is the
 * scene. Dragging turns it, pressing works it, and under reduced motion it
 * simply never turns on its own — the press still works, because that is
 * content rather than ornament.
 *
 * Flat fills only. The art direction this follows shoots the extraordinary
 * as ordinary, so metal that glints would be the wrong object.
 */
export function VoxelFigure({
  build,
  active,
  still,
  label,
  hint,
  size = 'inline',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const model = useMemo(() => (active ? build() : null), [active, build])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active || !model) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { voxels, palette, reach } = model

    let width = 0
    let height = 0
    let scale = 1
    let frame = 0
    let last = performance.now()

    let yaw = -0.5
    let dragging = false
    let lastX = 0

    /** 0 = at rest, 1 = worked. */
    let phase = 0
    let working = false
    let holdUntil = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Framed off the model's own reach, so a bigger object is given a
      // bigger stage instead of being squeezed into the same box.
      scale = Math.max(3, Math.min(width, height * 1.5) / (reach * 2.6))
    }

    const COS30 = Math.cos(Math.PI / 6)
    const SIN30 = Math.sin(Math.PI / 6)

    const project = (x: number, y: number, z: number) => {
      const c = Math.cos(yaw)
      const s = Math.sin(yaw)
      const rx = x * c - z * s
      const rz = x * s + z * c
      return {
        sx: width / 2 + (rx - rz) * COS30 * scale,
        sy: height / 2 + ((rx + rz) * SIN30 - y) * scale,
        depth: rx + rz + y,
      }
    }

    const quad = (pts: Array<{ sx: number; sy: number }>, fill: string) => {
      ctx.beginPath()
      ctx.moveTo(pts[0].sx, pts[0].sy)
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].sx, pts[i].sy)
      ctx.closePath()
      ctx.fillStyle = fill
      ctx.fill()
    }

    const draw = (now: number) => {
      const dt = Math.min(now - last, 48)
      last = now

      if (!dragging && !still) yaw += dt * 0.00013

      if (working) {
        phase = Math.min(1, phase + dt * 0.004)
        if (phase >= 1 && now > holdUntil) working = false
      } else if (phase > 0) {
        // Returning is slower than going: gold pours fast and sets slowly.
        phase = Math.max(0, phase - dt * 0.0016)
      }

      ctx.clearRect(0, 0, width, height)

      const t =
        phase < 0.5 ? 2 * phase * phase : 1 - Math.pow(-2 * phase + 2, 2) / 2

      const drawn = voxels.map((v) => {
        const x = v.x + (v.ax - v.x) * t
        const y = v.y + (v.ay - v.y) * t
        const z = v.z + (v.az - v.z) * t
        return { v, x, y, z, depth: project(x, y, z).depth }
      })

      drawn.sort((a, b) => a.depth - b.depth)

      for (const { v, x, y, z } of drawn) {
        const px = project(x + 1, y, z)
        const py = project(x, y + 1, z)
        const pz = project(x, y, z + 1)
        const pxy = project(x + 1, y + 1, z)
        const pyz = project(x, y + 1, z + 1)
        const pxyz = project(x + 1, y + 1, z + 1)
        const pxz = project(x + 1, y, z + 1)

        const tone = palette.tones[v.tone] ?? palette.tones[0]

        quad([py, pxy, pxyz, pyz], tone[0])
        quad([pz, pxz, pxyz, pyz], tone[1])
        quad([px, pxy, pxyz, pxz], tone[2])
      }

      frame = requestAnimationFrame(draw)
    }

    const onDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      canvas.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      yaw += (e.clientX - lastX) * 0.012
      lastX = e.clientX
    }
    const onUp = (e: PointerEvent) => {
      dragging = false
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch {
        // The pointer may already be gone; releasing is best-effort.
      }
    }
    const strike = () => {
      if (working || phase > 0) return
      working = true
      holdUntil = performance.now() + 420
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        strike()
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('click', strike)
    canvas.addEventListener('keydown', onKey)

    if (still) {
      draw(performance.now())
      cancelAnimationFrame(frame)
    } else {
      last = performance.now()
      frame = requestAnimationFrame(draw)
    }

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('click', strike)
      canvas.removeEventListener('keydown', onKey)
    }
  }, [active, still, model])

  if (!active) return null

  return (
    <div className={`figure figure-${size}`}>
      <canvas
        ref={canvasRef}
        className="figure-canvas"
        tabIndex={0}
        role="img"
        aria-label={label}
        title={label}
      />
      <p className="figure-hint" aria-hidden="true">
        {hint}
      </p>
    </div>
  )
}
