import { useEffect, useRef } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import type { VoxelModelName } from './attrs'
import { MODELS, type Model, type Voxel } from './voxelModels'

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
/** Leaves the object a breath of air inside its frame. */
const FRAME_MARGIN = 0.92
/** Azimuth of the one light in this scene, in the rotated frame. */
const LIGHT_X = -0.34
const LIGHT_Z = 0.94
/** Clamped zoom range and step (design D3) — below 1 there is nothing to
 *  see that framing did not already show; above 2.5 there is no pan to
 *  follow it with. */
const MIN_ZOOM = 1.0
const MAX_ZOOM = 2.5
const ZOOM_STEP = 1.25

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

    const COS30 = Math.cos(Math.PI / 6)
    const SIN30 = Math.sin(Math.PI / 6)
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let model: Model | null = null
    let width = 0
    let height = 0
    /** The framing computation alone — unchanged by zoom. */
    let baseScale = 1
    /** What the draw loop actually reads every frame. */
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

    /** Clamped multiplier on `baseScale`. Resets on remount, not on resize. */
    let zoom = 1
    /** Active touch points, for pinch. */
    const pointers = new Map<number, { x: number; y: number }>()
    let pinching = false
    let pinchStartDist = 0
    let pinchStartZoom = 1

    const clampZoom = (z: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z))

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
      // Framed off what the object actually occupies, at its worst yaw and
      // in both of its arrangements. The half-extent used to be a number
      // typed in per model, and measured, three of the four figures were
      // being cut off by their own canvas.
      //
      // The three limits are the three edges that can catch it: the sides,
      // the top and the bottom. `r` is a ground-plane radius, so the widest
      // the object can ever project is at 45 degrees — hence the SQRT2.
      const { wide, top, bottom } = model.bounds
      baseScale = Math.max(
        3,
        FRAME_MARGIN *
          Math.min(width / 2 / wide, (height * 0.46) / top, (height * 0.54) / bottom),
      )
      // Reapply the current zoom factor over the freshly measured frame —
      // zoom itself does not reset on resize, only on remount.
      scale = baseScale * zoom
    }

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

    /**
     * The hot path: a quad from loose numbers, batched by colour.
     *
     * Canvas2D charges per fill() far more than per pixel. The letter's
     * envelope is a slab thirty-five voxels by twenty-five, so its top alone
     * was some nine hundred separate fills of the SAME colour, and measured,
     * that one figure took the page from 60fps to 30 on its own — with the
     * canvas showing about a screenful of pixels in total, so it was never
     * fill rate.
     *
     * Runs of one colour are collected into a single path and flushed when
     * the colour changes. That preserves the painter's order exactly: two
     * quads only ever share a batch if nothing of another colour was drawn
     * between them.
     */
    let penFill = ''

    const flush = () => {
      if (!penFill) return
      ctx.fillStyle = penFill
      ctx.fill()
      penFill = ''
    }

    const face = (
      x1: number, y1: number, x2: number, y2: number,
      x3: number, y3: number, x4: number, y4: number,
      fill: string,
      flip: boolean,
    ) => {
      if (fill !== penFill) {
        flush()
        ctx.beginPath()
        penFill = fill
      }
      // One path, many subpaths, filled with the nonzero rule — so every
      // subpath in a batch has to wind the same way or an overlap cancels
      // itself out and leaves a hole. The winding of each face kind is fixed
      // for the whole frame, so the caller just says which way to go round.
      ctx.moveTo(x1, y1)
      if (flip) {
        ctx.lineTo(x4, y4)
        ctx.lineTo(x3, y3)
        ctx.lineTo(x2, y2)
      } else {
        ctx.lineTo(x2, y2)
        ctx.lineTo(x3, y3)
        ctx.lineTo(x4, y4)
      }
      ctx.closePath()
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

      // Which vertical faces the camera can see, decided once per frame.
      // The cube's corners rotate with the yaw but the cube does not know it
      // has turned, so the pair facing the lens has to be chosen here.
      const cYaw = Math.cos(yaw)
      const sYaw = Math.sin(yaw)
      // Model +x and +z as they land in the rotated frame.
      const ax0 = cYaw, ax1 = sYaw
      const az0 = -sYaw, az1 = cYaw
      // Depth grows along rx + rz, so a face is turned toward the viewer
      // exactly when its rotated normal sums positive.
      const xFace = ax0 + ax1 > 0 ? 3 : 4
      const zFace = az0 + az1 > 0 ? 1 : 2
      // A fixed light, in the rotated frame rather than the model's. The
      // shading used to be nailed to the model — +z always the lit side and
      // +x always the shadowed one — so it turned with the object, which is
      // exactly what makes a render look painted instead of lit. The lit
      // side is now whichever one is really facing the light.
      const xLit = (xFace === 3 ? 1 : -1) * (ax0 * LIGHT_X + ax1 * LIGHT_Z)
      const zLit = (zFace === 1 ? 1 : -1) * (az0 * LIGHT_X + az1 * LIGHT_Z)
      const xShade = xLit >= zLit ? 1 : 2
      const zShade = xLit >= zLit ? 2 : 1

      // Buried faces are only buried while the object is whole. Culling them
      // is what pays for the detail: a solid model spends most of its voxels
      // on an inside that nobody ever sees.
      const solid = t === 0
      const topBit = 1
      const xBit = 1 << xFace
      const zBit = 1 << zFace
      const hiddenAll = topBit | xBit | zBit

      // Depth is rx + rz + y, which is separable too; project() would have
      // built and thrown away an object per voxel just to read one field.
      const depthX = cYaw + sYaw
      const depthZ = cYaw - sYaw

      const drawn: Array<{ v: Voxel; x: number; y: number; z: number; depth: number }> = []
      for (const v of model.voxels) {
        if (solid && (v.buried & hiddenAll) === hiddenAll) continue
        const x = v.x + (v.ax - v.x) * t
        const y = v.y + (v.ay - v.y) * t
        const z = v.z + (v.az - v.z) * t
        drawn.push({ v, x, y, z, depth: x * depthX + z * depthZ + y })
      }

      drawn.sort((a, b) => a.depth - b.depth)

      // The projection is affine and separable, so a cube's eight corners are
      // one origin plus three constant screen steps. Calling project() per
      // corner meant eight multiplies and eight fresh objects for every voxel
      // — a thousand voxels cost eight thousand allocations a frame, and the
      // letter alone was taking the page from 60fps to 30. These are the same
      // numbers, arrived at by adding.
      const stepXx = (cYaw - sYaw) * COS30 * scale
      const stepXy = (cYaw + sYaw) * SIN30 * scale
      const stepZx = -(cYaw + sYaw) * COS30 * scale
      const stepZy = (cYaw - sYaw) * SIN30 * scale
      const stepYy = -scale
      const originX = width / 2
      const originY = height * 0.46
      const release = 1 - t
      // Winding of each face kind, constant for the frame: the cross product
      // of the two steps that sweep it out.
      const flipTop = stepXx * stepZy - stepXy * stepZx < 0
      const flipZ = stepXx * stepYy < 0
      const flipX = stepZx * stepYy < 0

      for (const { v, x, y, z } of drawn) {
        // Corner (x, y, z) of the cube; the other seven are steps from here.
        const bx = originX + x * stepXx + z * stepZx
        const by = originY + x * stepXy + z * stepZy + y * stepYy

        const toneFills = fills[v.tone] ?? fills[0]
        const ao = v.ao

        if (!solid || !(v.buried & topBit)) {
          // Top: the y-step, then across x and z.
          const ax = bx, ay = by + stepYy
          face(
            ax, ay,
            ax + stepXx, ay + stepXy,
            ax + stepXx + stepZx, ay + stepXy + stepZy,
            ax + stepZx, ay + stepZy,
            toneFills[0][Math.round(ao[0] * release)],
            flipTop,
          )
        }
        if (!solid || !(v.buried & zBit)) {
          // The z-facing wall, at z + 1 or at z depending on which way it looks.
          const ax = zFace === 1 ? bx + stepZx : bx
          const ay = zFace === 1 ? by + stepZy : by
          face(
            ax, ay,
            ax + stepXx, ay + stepXy,
            ax + stepXx, ay + stepXy + stepYy,
            ax, ay + stepYy,
            toneFills[zShade][Math.round(ao[zFace] * release)],
            flipZ,
          )
        }
        if (!solid || !(v.buried & xBit)) {
          const ax = xFace === 3 ? bx + stepXx : bx
          const ay = xFace === 3 ? by + stepXy : by
          face(
            ax, ay,
            ax + stepZx, ay + stepZy,
            ax + stepZx, ay + stepZy + stepYy,
            ax, ay + stepYy,
            toneFills[xShade][Math.round(ao[xFace] * release)],
            flipX,
          )
        }
      }

      flush()

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

    /**
     * Sets `scale = baseScale * zoom` and asks for a frame. The draw loop
     * never multiplies by zoom itself — it only ever reads `scale`, exactly
     * as it did before zoom existed, so nothing was added to the hot path.
     * `requestDraw()` is a no-op while a frame is already scheduled.
     */
    const applyZoom = () => {
      scale = baseScale * zoom
      requestDraw()
    }

    const pinchDist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.hypot(a.x - b.x, a.y - b.y)

    const onDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (pointers.size === 2) {
        // A second contact point ends any yaw drag and starts a pinch.
        dragging = false
        pinching = true
        const [a, b] = [...pointers.values()]
        pinchStartDist = pinchDist(a, b)
        pinchStartZoom = zoom
        return
      }
      if (pointers.size > 2) return // a third touch is ignored entirely

      dragging = true
      vYaw = 0
      lastX = e.clientX
      canvas.setPointerCapture(e.pointerId)
      requestDraw()
    }
    const onMove = (e: PointerEvent) => {
      if (pointers.has(e.pointerId)) {
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      }

      if (pinching) {
        if (pointers.size < 2) return
        const [a, b] = [...pointers.values()]
        const dist = pinchDist(a, b)
        zoom = clampZoom(pinchStartZoom * (dist / Math.max(1, pinchStartDist)))
        applyZoom()
        return
      }

      if (!dragging) return
      const delta = (e.clientX - lastX) * DRAG_YAW_RATE
      yaw += delta
      vYaw = delta
      lastX = e.clientX
    }
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId)

      if (pinching) {
        // Dropping below two pointers ends the pinch — deliberately without
        // resuming yaw drag on whichever pointer is left, which would read
        // as an unrequested jump.
        if (pointers.size < 2) pinching = false
        return
      }

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
    const onWheel = (e: WheelEvent) => {
      // A bare wheel is page scroll, full stop — never hijacked. Only the
      // modifier gesture (which a trackpad pinch also arrives as) zooms.
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      zoom = clampZoom(zoom * (e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP))
      applyZoom()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        strike()
        return
      }
      if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        zoom = clampZoom(zoom * ZOOM_STEP)
        applyZoom()
        return
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        zoom = clampZoom(zoom / ZOOM_STEP)
        applyZoom()
        return
      }
      if (e.key === '0') {
        e.preventDefault()
        zoom = 1
        applyZoom()
      }
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('click', strike)
    canvas.addEventListener('wheel', onWheel, { passive: false })
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
      canvas.removeEventListener('wheel', onWheel)
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
