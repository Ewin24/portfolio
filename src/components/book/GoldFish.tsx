import { useEffect, useRef } from 'react'
import { useTranslation } from '../../hooks/useTranslation'

interface Props {
  active: boolean
  still: boolean
}

/**
 * The little gold fish.
 *
 * Colonel Aureliano Buendía spends his last years in the workshop making
 * little gold fishes. He makes them, melts them down, and makes them again,
 * and the novel is explicit that this is not madness but the only thing left
 * that he can finish. It is the most concrete object in the book, and it is
 * a loop of making and unmaking — which is also what building software is.
 *
 * So the figure does not merely rotate. Dragging turns it; pressing it MELTS
 * it, and it reforges itself. The interaction is the scene, not a mascot
 * spinning for attention.
 *
 * Rendered by hand rather than with a 3D engine. Voxels are cubes, a cube is
 * three parallelograms under an isometric projection, and depth sorting is a
 * painter's algorithm — which is the entire renderer. Reaching for three.js
 * would have doubled a critical bundle that was deliberately cut twice, in
 * exchange for lighting this deliberately does not want: the art direction
 * here is flat and matter-of-fact, so metal that glints would be the wrong
 * fish.
 */

/**
 * The fish is generated in three dimensions rather than extruded from a
 * drawing, and that is the whole difference between a fish and a loaf.
 *
 * The first attempt punched a flat silhouette and gave it thickness. Under an
 * isometric camera an extruded outline always reads as a slab held up to the
 * lens — the profile that made it legible is exactly the axis the projection
 * foreshortens. A voxel model that reads from any angle has to be solid in
 * all three: a body that tapers toward the tail, fins that are thin in Z, and
 * an eye on each flank.
 */
const NOSE = -5.4
const TAIL = 7.2

const GOLD_TOP = '#E3B24A'
const GOLD_SIDE = '#C08C28'
const GOLD_DARK = '#8A5F16'
const EYE = '#2A1E0C'

interface Voxel {
  x: number
  y: number
  z: number
  eye: boolean
  /** Where this voxel goes when the fish is molten. */
  mx: number
  my: number
  mz: number
}

function buildFish(): Voxel[] {
  const out: Voxel[] = []

  for (let x = Math.floor(NOSE); x <= Math.ceil(TAIL); x++) {
    for (let y = -5; y <= 5; y++) {
      for (let z = -3; z <= 3; z++) {
        let solid = false

        // Body: an ellipsoid that narrows toward the tail, so the animal has
        // a peduncle instead of ending in a wall.
        if (x <= 4) {
          const taper = 1 - Math.max(0, x + 1) / 6.5 * 0.62
          const ry = 2.5 * taper
          const rz = 2.0 * taper
          if ((x / 5.2) ** 2 + (y / ry) ** 2 + (z / rz) ** 2 <= 1) solid = true
        }

        // Tail fin: thin across, flaring the further back it goes.
        if (!solid && x >= 3 && Math.abs(z) <= 0.6) {
          const flare = (x - 2) * 0.95
          if (Math.abs(y) <= flare && x <= TAIL) solid = true
        }

        // Dorsal fin, and a smaller one underneath.
        if (!solid && Math.abs(z) <= 0.6 && x >= -2 && x <= 2) {
          if (y > 1.6 && y <= 4 - Math.abs(x) * 0.5) solid = true
          if (y < -1.8 && y >= -3.4 + Math.abs(x) * 0.4) solid = true
        }

        if (!solid) continue

        // One eye per flank, set into the head.
        const eye = x === -3 && y === 1 && Math.abs(z) === 1

        out.push({ x, y, z, eye, mx: 0, my: 0, mz: 0 })
      }
    }
  }

  /**
   * Molten targets: a round pool, not a scattered pile.
   *
   * Keeping each voxel near its own column made the melt read as the fish
   * being pulled apart into rows — the grid survived, so nothing looked
   * liquid. Distributing by the golden angle instead packs them evenly into
   * a disc with no seams and no clumping, and flattening every one of them
   * onto the same level is what makes it read as a surface rather than a
   * heap.
   */
  const golden = Math.PI * (3 - Math.sqrt(5))
  const floor = -4.5

  out.forEach((v, i) => {
    const radius = Math.sqrt((i + 0.5) / out.length) * 6.2
    const angle = i * golden
    v.mx = Math.cos(angle) * radius
    v.mz = Math.sin(angle) * radius * 0.72
    // A shallow dome, so the pool has a little body at its centre.
    v.my = floor + (1 - radius / 6.2) * 0.5
  })

  return out
}

export function GoldFish({ active, still }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { lang } = useTranslation()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const fish = buildFish()

    let width = 0
    let height = 0
    let scale = 1
    let frame = 0
    let last = performance.now()

    let yaw = -0.5
    let spin = still ? 0 : 0.22
    let dragging = false
    let lastX = 0

    /** 0 = forged, 1 = molten. */
    let melt = 0
    let melting = false
    let holdUntil = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scale = Math.max(4, Math.min(width / 17, height / 12))
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

    const quad = (
      pts: Array<{ sx: number; sy: number }>,
      fill: string,
    ) => {
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

      if (!dragging && !still) yaw += spin * dt * 0.0006

      if (melting) {
        melt = Math.min(1, melt + dt * 0.004)
        if (melt >= 1 && now > holdUntil) melting = false
      } else if (melt > 0) {
        // Reforging is slower than melting: gold pours fast and sets slowly.
        melt = Math.max(0, melt - dt * 0.0016)
      }

      ctx.clearRect(0, 0, width, height)

      // Ease so the collapse leads and the settle trails.
      const t = melt < 0.5 ? 2 * melt * melt : 1 - Math.pow(-2 * melt + 2, 2) / 2

      const drawn = fish.map((v) => {
        const x = v.x + (v.mx - v.x) * t
        const y = v.y + (v.my - v.y) * t
        const z = v.z + (v.mz - v.z) * t
        return { v, p: project(x, y, z), x, y, z }
      })

      // Painter's algorithm: farthest first.
      drawn.sort((a, b) => a.p.depth - b.p.depth)

      for (const { v, x, y, z } of drawn) {
        const o = project(x, y, z)
        const px = project(x + 1, y, z)
        const py = project(x, y + 1, z)
        const pz = project(x, y, z + 1)
        const pxy = project(x + 1, y + 1, z)
        const pyz = project(x, y + 1, z + 1)
        const pxyz = project(x + 1, y + 1, z + 1)
        const pxz = project(x + 1, y, z + 1)

        const top = v.eye ? EYE : GOLD_TOP
        const side = v.eye ? EYE : GOLD_SIDE
        const dark = v.eye ? EYE : GOLD_DARK

        // Three faces, three flat tones. No gradient, no specular: the art
        // direction is a thing lying in daylight, not a rendered showpiece.
        quad([py, pxy, pxyz, pyz], top)
        quad([pz, pxz, pxyz, pyz], side)
        quad([px, pxy, pxyz, pxz], dark)
        void o
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
        // The pointer may already be gone; releasing it is best-effort.
      }
    }

    const strike = () => {
      if (melting || melt > 0) return
      melting = true
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
      // One frame, forged and motionless. Pressing it still works; it simply
      // is never animating on its own.
      spin = 0
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
  }, [active, still])

  if (!active) return null

  const hint =
    lang === 'es'
      ? 'Pescadito de oro: arrástralo para girarlo, presiónalo para fundirlo'
      : 'Little gold fish: drag to turn it, press to melt it down'

  return (
    <div className="goldfish">
      <canvas
        ref={canvasRef}
        className="goldfish-canvas"
        tabIndex={0}
        role="img"
        aria-label={hint}
        title={hint}
      />
      <p className="goldfish-hint" aria-hidden="true">
        {lang === 'es' ? 'fúndelo' : 'melt it'}
      </p>
    </div>
  )
}
