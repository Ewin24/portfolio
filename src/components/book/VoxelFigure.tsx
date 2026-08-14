import { useEffect, useRef } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import type { VoxelModelName } from './attrs'
import { MODELS, type Model } from './voxelModels'

export interface VoxelFigureProps {
  /** Which registered model to build (see `MODELS` in voxelModels.ts). */
  model: VoxelModelName
  active: boolean
  still: boolean
  /** Read out to assistive tech and shown as the title. */
  label: string
  /** Two words under the object, naming what pressing it does. */
  hint: string
  size?: 'lead' | 'inline'
}

/** How long the entry assembly takes, from first paint to rest (design D10). */
const ENTRY_MS = 700
const STRIKE_RATE = 0.004
const RETURN_RATE = 0.0016
const IDLE_YAW_RATE = 0.00013
const DRAG_YAW_RATE = 0.012
/** Per-frame velocity decay after release — proportionate under stillness (D7). */
const DAMPING = 0.94
const DAMPING_STILL = 0.86
const RELEASE_CAP = 0.05
const RELEASE_CAP_STILL = RELEASE_CAP / 2
const VELOCITY_EPS = 0.0006

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
 * The render loop is demand-driven: a single `busy` predicate — visible, and
 * dragging, or settling, or mid-transition, or mid-entry, or simply not
 * stillness-locked — decides whether another frame is scheduled. That one
 * rule replaces a `still` special case that used to schedule a frame and
 * cancel it in the same tick, leaving nothing painted once an async resize
 * cleared the canvas behind it.
 *
 * Flat fills only. The art direction this follows shoots the extraordinary
 * as ordinary, so metal that glints would be the wrong object. Occlusion is
 * baked per-voxel, quantised to three steps, and released as the object
 * melts; the contact shadow is a hard-edged diamond, coloured from the
 * chapter's own shadow token rather than its ink, so it never inverts to a
 * highlight in the two dark chapters.
 */
export function VoxelFigure({
  model: modelName,
  active,
  still,
  label,
  hint,
  size = 'inline',
}: VoxelFigureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { chapter } = useTheme()
  // Read from the React object, not getComputedStyle — no per-frame recalc.
  const glowRef = useRef(chapter.glow)

  useEffect(() => {
    glowRef.current = chapter.glow
  }, [chapter.glow])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let model: Model | null = null
    let width = 0
    let height = 0
    let scale = 1
    let frame = 0
    let last = performance.now()
    let looping = false

    let visible = false
    let yaw = -0.5
    let dragging = false
    let lastX = 0
    /** Yaw change carried into the release, decayed each frame. */
    let vYaw = 0

    /** 0 = at rest, 1 = worked (or, before entry finishes, alternate). */
    let phase = still ? 0 : 1
    let working = false
    let holdUntil = 0
    /** Entry plays once; scrolling away and back must not replay it. */
    let entered = still
    let entryStart: number | null = null

    const resize = () => {
      if (!model) return
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Framed off the model's own reach, so a bigger object is given a
      // bigger stage instead of being squeezed into the same box.
      scale = Math.max(3, Math.min(width, height * 1.5) / (model.reach * 2.6))
    }

    const COS30 = Math.cos(Math.PI / 6)
    const SIN30 = Math.sin(Math.PI / 6)

    const project = (x: number, y: number, z: number) => {
      const c = Math.cos(yaw)
      const s = Math.sin(yaw)
      const rx = x * c - z * s
      const rz = x * s + z * c
      return {
        // Shifted down from centre (design D4): a diamond shadow's lower
        // vertex needs headroom below the object at the 150px inline size.
        sx: width / 2 + (rx - rz) * COS30 * scale,
        sy: height * 0.46 + ((rx + rz) * SIN30 - y) * scale,
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

    const isBusy = () =>
      visible &&
      (dragging ||
        working ||
        Math.abs(vYaw) > VELOCITY_EPS ||
        phase > 0 ||
        !entered ||
        !still)

    const draw = (now: number) => {
      // The rAF timestamp can predate the performance.now() call that seeded
      // `last` in requestDraw() (it marks when the frame began, not when the
      // callback runs) — clamp so a mid-strike frame never sees negative dt
      // and reads phase backwards past zero.
      const dt = Math.max(0, Math.min(now - last, 48))
      last = now

      // Invariant: `looping` means "a frame is scheduled and will run".
      // Every exit from draw() — including this early one — MUST clear it
      // before returning, or requestDraw() becomes a permanent no-op. This
      // early return fires when the ResizeObserver's initial callback (which
      // always fires once on observe(), synchronously with layout) wins the
      // race against the IntersectionObserver that builds the model: the
      // resize-triggered requestDraw() runs a frame before `model` exists,
      // and without the reset below the IO's later requestDraw() would see
      // `looping` still true and never schedule the frame that actually
      // paints. Order between the two observers is not guaranteed, so this
      // must be safe no matter which one wins.
      if (!model) {
        looping = false
        return
      }

      if (!dragging && !still) yaw += dt * IDLE_YAW_RATE

      if (!dragging && vYaw !== 0) {
        yaw += vYaw
        vYaw *= still ? DAMPING_STILL : DAMPING
        if (Math.abs(vYaw) < VELOCITY_EPS) vYaw = 0
      }

      if (working) {
        phase = Math.min(1, phase + dt * STRIKE_RATE)
        if (phase >= 1 && now > holdUntil) working = false
      } else if (!entered) {
        if (entryStart === null) entryStart = now
        phase = Math.max(0, 1 - (now - entryStart) / ENTRY_MS)
        if (phase <= 0) entered = true
      } else if (phase > 0) {
        // Returning is slower than going: gold pours fast and sets slowly.
        phase = Math.max(0, phase - dt * RETURN_RATE)
      }

      ctx.clearRect(0, 0, width, height)

      const t =
        phase < 0.5 ? 2 * phase * phase : 1 - Math.pow(-2 * phase + 2, 2) / 2

      // Contact shadow first, before the painter's sort: a hard-edged
      // diamond at the ground plane, growing as the object comes apart.
      const { footprint, fills } = model
      // The pad is proportional, not a constant. A fixed 0.6 gave the small
      // fish a 17% overhang but the wide letter only 9%, and the letter is a
      // solid rectangular slab — at 9% the diamond's corners fall inside its
      // own side faces and the shadow is invisible for that model. Scaling
      // the pad with the footprint gives every object the same relative
      // overhang, so a shadow either reads for all three or for none.
      const shadowScale = 1 + 0.35 * t
      const shx = (footprint.hx * 1.16 + 0.6) * shadowScale
      const shz = (footprint.hz * 1.16 + 0.6) * shadowScale
      const sN = project(0, footprint.y, -shz)
      const sE = project(shx, footprint.y, 0)
      const sS = project(0, footprint.y, shz)
      const sW = project(-shx, footprint.y, 0)
      ctx.globalAlpha = 1
      quad([sN, sE, sS, sW], glowRef.current)

      const drawn = model.voxels.map((v) => {
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

        const toneFills = fills[v.tone] ?? fills[0]
        // Occlusion releases toward the exposed value as the object melts.
        const eff = (face: number) => Math.round(v.ao[face] * (1 - t))

        quad([py, pxy, pxyz, pyz], toneFills[0][eff(0)])
        quad([pz, pxz, pxyz, pyz], toneFills[1][eff(1)])
        quad([px, pxy, pxyz, pxz], toneFills[2][eff(2)])
      }

      if (isBusy()) {
        frame = requestAnimationFrame(draw)
      } else {
        looping = false
      }
    }

    const requestDraw = () => {
      if (looping) return
      looping = true
      last = performance.now()
      frame = requestAnimationFrame(draw)
    }

    const onDown = (e: PointerEvent) => {
      dragging = true
      vYaw = 0
      lastX = e.clientX
      canvas.setPointerCapture(e.pointerId)
      requestDraw()
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const delta = (e.clientX - lastX) * DRAG_YAW_RATE
      yaw += delta
      vYaw = delta
      lastX = e.clientX
    }
    const onUp = (e: PointerEvent) => {
      dragging = false
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch {
        // The pointer may already be gone; releasing is best-effort.
      }
      const cap = still ? RELEASE_CAP_STILL : RELEASE_CAP
      vYaw = Math.max(-cap, Math.min(cap, vYaw))
      requestDraw()
    }
    const strike = () => {
      if (working || phase > 0) return
      working = true
      holdUntil = performance.now() + 420
      requestDraw()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        strike()
      }
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('click', strike)
    canvas.addEventListener('keydown', onKey)

    const ro = new ResizeObserver(() => {
      resize()
      // A resize must always repaint — the canvas resize just cleared it,
      // and without this the loop being idle (e.g. a settled still figure)
      // would leave nothing on screen until the next interaction.
      requestDraw()
    })
    ro.observe(canvas)

    // Off-screen figures are never built (D11): the model is resolved only
    // once the canvas actually enters the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        const nowVisible = entry.isIntersecting
        if (nowVisible && !model) {
          model = MODELS[modelName]()
          resize()
        }
        visible = nowVisible
        if (visible) requestDraw()
      },
      { threshold: 0.01 },
    )
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('click', strike)
      canvas.removeEventListener('keydown', onKey)
    }
  }, [active, still, modelName])

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
