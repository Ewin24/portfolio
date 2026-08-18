/**
 * The objects of the book.
 *
 * Every chapter that has a thing in it gets that thing, modelled in voxels.
 * They are generated procedurally rather than drawn as flat silhouettes and
 * extruded: under an isometric camera an extruded outline always reads as a
 * slab held up to the lens, because the profile that made it legible is
 * exactly the axis the projection foreshortens. Solid in all three axes or
 * it does not read.
 *
 * Each model also declares where its voxels go in its ALTERNATE state — the
 * fish melts, the alembic distils, the letter opens. That second arrangement
 * is what turns a mascot into a scene.
 *
 * Occlusion is baked here, once, at build time — not recomputed per frame.
 * Each voxel gets a 0-2 darkening level per drawn face (crevice vs exposed),
 * and every palette tone gets its three quantised variants precomputed into
 * `fills`. The renderer only ever indexes into that table.
 */

import type { VoxelModelName } from './attrs'

export interface Voxel {
  x: number
  y: number
  z: number
  /** Index into the model's palette. */
  tone: number
  /** Alternate position. */
  ax: number
  ay: number
  az: number
  /** Baked occlusion (0-2) per drawn face, indexed by `FACES`. */
  ao: [number, number, number, number, number]
  /** Bit i set when face i is buried against a neighbour at rest. */
  buried: number
}

/**
 * The five faces a voxel can ever show.
 *
 * Five and not three. The renderer used to draw +y, +z and +x and nothing
 * else, which is correct for a camera that never moves — but these objects
 * turn, a full revolution every forty-eight seconds, and past forty-five
 * degrees those three faces are the ones pointing away. Measured on the
 * fish: at 120 degrees the body was riddled with holes and at 180 it came
 * apart into loose slivers with the page showing through. Which pair of
 * vertical faces is drawn now follows the yaw.
 *
 * The bottom is still never drawn. The camera is above the object and
 * always will be.
 */
export const FACES: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 0],
  [0, 0, 1],
  [0, 0, -1],
  [1, 0, 0],
  [-1, 0, 0],
]

/** Tangents used to sample a face's neighbourhood, per face of `FACES`. */
const TANGENTS: ReadonlyArray<ReadonlyArray<readonly [number, number, number]>> = [
  [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]],
  [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]],
  [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]],
  [[0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
  [[0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
]

export interface Palette {
  /** [top, lit side, shaded side] per tone. */
  tones: Array<[string, string, string]>
}

export interface Model {
  voxels: Voxel[]
  palette: Palette
  /** Framing envelope, measured over both arrangements and every yaw. */
  bounds: { wide: number; top: number; bottom: number }
  /** Quantised darkened fills, precomputed: [tone][face 0-2][level 0-2]. */
  fills: string[][][]
  /** Ground-plane footprint the contact shadow is drawn from. */
  footprint: { hx: number; hz: number; y: number }
}

/**
 * Materials.
 *
 * Three steps each, and the spread between them matters more than any single
 * value: too narrow and the object reads as a printed silhouette rather than
 * a lit solid, which is most of what "flat" means when a voxel render looks
 * wrong. Still flat fills, though — the art direction this follows shoots the
 * extraordinary as ordinary, so nothing here glints.
 */
const GOLD: [string, string, string] = ['#EFC259', '#C08C28', '#7E5411']
/** The fish's underside — every real one is paler below than above. */
const GOLD_PALE: [string, string, string] = ['#F8E0A4', '#D9BA6C', '#9B7C36']
/** Fins, gill line, the edges where gold is thin. */
const GOLD_DEEP: [string, string, string] = ['#C79A34', '#966E17', '#5F400A']
const DARK: [string, string, string] = ['#2A1E0C', '#241A0A', '#1B1307']
const GLASS: [string, string, string] = ['#DDEBEA', '#B0CBCA', '#7C9EA0']
const COPPER: [string, string, string] = ['#D6803F', '#A55524', '#66300F']
/** Azogue: the quicksilver Melquiades brings with the laboratory. */
const QUICKSILVER: [string, string, string] = ['#CFD2CA', '#A3A69E', '#70736B']
const PAPER: [string, string, string] = ['#F3E8CD', '#D6C49B', '#9E8B63']
const INK: [string, string, string] = ['#6E4A22', '#573A1B', '#3B2712']
const WAX: [string, string, string] = ['#A63A2C', '#7E2820', '#4E1712']
/** The wound edge of a roll, and the crease of a fold — paper in shadow. */
const SEAM: [string, string, string] = ['#C2AC7E', '#A08A5F', '#786443']

/** Quantised occlusion factors — a JND step, not a gradient (design D2). */
const AO_FACTORS = [1, 0.86, 0.72]

/** Multiplicative darken, kept a flat fill — never brighter than the base tone. */
function darken(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.floor(((n >> 16) & 255) * factor)
  const g = Math.floor(((n >> 8) & 255) * factor)
  const b = Math.floor((n & 255) * factor)
  return `rgb(${r}, ${g}, ${b})`
}

function buildFills(palette: Palette): string[][][] {
  return palette.tones.map((tone) => tone.map((hex) => AO_FACTORS.map((f) => darken(hex, f))))
}

/**
 * How enclosed a drawn face is, counted from the neighbours that would sit
 * beside it just outside the voxel — a concave corner collects several, a
 * face standing in open air collects none. Quantised to 0-2 (design D3).
 */
function aoLevel(occ: Set<string>, x: number, y: number, z: number, face: number): number {
  const [nx, ny, nz] = FACES[face]
  let count = 0
  for (const [tx, ty, tz] of TANGENTS[face]) {
    if (occ.has(`${x + nx + tx},${y + ny + ty},${z + nz + tz}`)) count++
  }
  if (count === 0) return 0
  if (count <= 2) return 1
  return 2
}

function computeFootprint(voxels: Voxel[]): { hx: number; hz: number; y: number } {
  const minY = Math.min(...voxels.map((v) => v.y))
  const floor = voxels.filter((v) => v.y === minY)
  const xs = floor.map((v) => v.x)
  const zs = floor.map((v) => v.z)
  const hx = (Math.max(...xs) - Math.min(...xs)) / 2 || 1
  const hz = (Math.max(...zs) - Math.min(...zs)) / 2 || 1
  return { hx, hz, y: minY }
}

const COS30 = Math.cos(Math.PI / 6)
const SIN30 = Math.sin(Math.PI / 6)

/**
 * Measures the room the object needs, over both of its arrangements and over
 * every yaw it will ever be turned to.
 *
 * This replaced a half-extent typed in by hand at each call site, and the
 * hand-typed ones were wrong: measured, three of the four figures were cut
 * off by their own canvas — the alembic lost its entire glass dome off the
 * top, the letter was clipped on both sides, the fish lost its tail.
 *
 * The three numbers are the three edges that can catch it, and each is a
 * maximum taken PER VOXEL rather than by combining independent extremes.
 * That distinction is most of the frame: pairing "the furthest voxel" with
 * "the tallest voxel" describes a voxel that does not exist, and the first
 * version of this did exactly that and framed every figure at roughly half
 * the size it could have had.
 */
function measure(
  voxels: Voxel[],
  footprint: { hx: number; hz: number; y: number },
): { wide: number; top: number; bottom: number } {
  let wide = 0
  let top = 0
  let bottom = 0

  // A point at ground-plane radius rho swings through +/- SQRT2 * rho along
  // both screen axes as the object turns, so that is the reach to budget.
  const consider = (x: number, y: number, z: number, height: number) => {
    const swing = Math.SQRT2 * Math.hypot(x, z)
    wide = Math.max(wide, swing * COS30)
    top = Math.max(top, swing * SIN30 + y + height)
    bottom = Math.max(bottom, swing * SIN30 - y)
  }

  const far = (v: number) => (Math.abs(v) > Math.abs(v + 1) ? v : v + 1)

  for (const v of voxels) {
    consider(far(v.x), v.y, far(v.z), 1)
    consider(far(v.ax), v.ay, far(v.az), 1)
  }

  // The contact shadow is part of the picture and grows by a third as the
  // object comes apart; leaving it out clipped its far corner.
  const shx = (footprint.hx * 1.16 + 0.6) * 1.35
  const shz = (footprint.hz * 1.16 + 0.6) * 1.35
  consider(shx, footprint.y, 0, 0)
  consider(0, footprint.y, shz, 0)

  return { wide, top, bottom }
}

/** Bakes occlusion, fills, footprint and envelope, and marks the build. */
function finalize(name: string, voxels: Voxel[], palette: Palette): Model {
  performance.mark(`voxel-build:${name}`)

  const occ = new Set(voxels.map((v) => `${v.x},${v.y},${v.z}`))
  for (const v of voxels) {
    v.ao = [0, 0, 0, 0, 0] as Voxel['ao']
    v.buried = 0
    for (let f = 0; f < FACES.length; f++) {
      v.ao[f] = aoLevel(occ, v.x, v.y, v.z, f)
      const [nx, ny, nz] = FACES[f]
      if (occ.has(`${v.x + nx},${v.y + ny},${v.z + nz}`)) v.buried |= 1 << f
    }
  }

  const footprint = computeFootprint(voxels)
  const bounds = measure(voxels, footprint)

  // Drop what can never be seen. A voxel qualifies only if it is walled in
  // on every drawable face AND it never moves — the fish's melt scatters
  // every voxel it has, so its core is buried at rest and out in the open a
  // moment later. The letter is the case this exists for: its envelope is a
  // slab thirty-five by twenty-five, and three fifths of it was interior
  // that got scanned and skipped on every single frame.
  const ALL = 0b11111
  const kept = voxels.filter(
    (v) => v.buried !== ALL || v.ax !== v.x || v.ay !== v.y || v.az !== v.z,
  )

  return {
    voxels: kept,
    palette,
    fills: buildFills(palette),
    footprint,
    bounds,
  }
}

// ─── Building blocks ────────────────────────────────────────────────────────

/**
 * A voxel canvas.
 *
 * Later writes win, so a model gets built the way the thing was made: the
 * body first, then what is cut out of it, then what is set on top of it. The
 * models used to be nested loops pushing into an array, and anything that
 * had to land on an existing voxel went looking for it with a linear scan —
 * which is how the scroll's writing ended up addressing the wrong voxel.
 */
interface Grid {
  set: (x: number, y: number, z: number, tone: number) => void
  has: (x: number, y: number, z: number) => boolean
  /** Walk a box; return a tone to fill the cell, or null to leave it alone. */
  carve: (
    box: readonly [number, number, number, number, number, number],
    fn: (x: number, y: number, z: number) => number | null,
  ) => void
  emit: () => Voxel[]
}

function grid(): Grid {
  const map = new Map<string, number>()
  return {
    set: (x, y, z, tone) => void map.set(`${x},${y},${z}`, tone),
    has: (x, y, z) => map.has(`${x},${y},${z}`),
    carve: ([x0, x1, y0, y1, z0, z1], fn) => {
      for (let x = x0; x <= x1; x++)
        for (let y = y0; y <= y1; y++)
          for (let z = z0; z <= z1; z++) {
            const tone = fn(x, y, z)
            if (tone !== null) map.set(`${x},${y},${z}`, tone)
          }
    },
    emit: () =>
      [...map].map(([k, tone]) => {
        const [x, y, z] = k.split(',').map(Number)
        return {
          x, y, z, tone,
          ax: x, ay: y, az: z,
          ao: [0, 0, 0, 0, 0] as Voxel['ao'],
          buried: 0,
        }
      }),
  }
}

/** Normalised radius inside an ellipsoid: at most 1 is inside. */
function ellip(
  x: number, y: number, z: number,
  cx: number, cy: number, cz: number,
  rx: number, ry: number, rz: number,
): number {
  const a = (x - cx) / rx
  const b = (y - cy) / ry
  const c = (z - cz) / rz
  return Math.sqrt(a * a + b * b + c * c)
}

type Pt = readonly [number, number, number]

/**
 * Distance from a point to a polyline — the spine of every tube here.
 *
 * A tube built this way stays connected around a bend. The alembic's first
 * neck was a hand-stepped diagonal one voxel thick, and a one-voxel diagonal
 * under an isometric camera is not a tube, it is a row of separate blocks
 * walking away from the pot.
 */
function alongPath(x: number, y: number, z: number, path: readonly Pt[]): number {
  let best = Infinity
  for (let i = 0; i < path.length - 1; i++) {
    const [ax, ay, az] = path[i]
    const [bx, by, bz] = path[i + 1]
    const ux = bx - ax, uy = by - ay, uz = bz - az
    const vx = x - ax, vy = y - ay, vz = z - az
    const len = ux * ux + uy * uy + uz * uz
    const t = len === 0 ? 0 : Math.max(0, Math.min(1, (vx * ux + vy * uy + vz * uz) / len))
    best = Math.min(best, Math.hypot(vx - ux * t, vy - uy * t, vz - uz * t))
  }
  return best
}

/** Carve box around a path, padded — a search volume, not a shape. */
function pathBox(
  path: readonly Pt[],
  pad: number,
): [number, number, number, number, number, number] {
  const r = Math.ceil(pad) + 1
  const axis = (i: number) => path.map((p) => p[i])
  return [
    Math.min(...axis(0)) - r, Math.max(...axis(0)) + r,
    Math.min(...axis(1)) - r, Math.max(...axis(1)) + r,
    Math.min(...axis(2)) - r, Math.max(...axis(2)) + r,
  ]
}

/** Scatter an alternate arrangement evenly into a disc. */
function poolInto(voxels: Voxel[], radius: number, floor: number) {
  const golden = Math.PI * (3 - Math.sqrt(5))
  voxels.forEach((v, i) => {
    const r = Math.sqrt((i + 0.5) / voxels.length) * radius
    const a = i * golden
    v.ax = Math.cos(a) * r
    v.az = Math.sin(a) * r * 0.72
    v.ay = floor + (1 - r / radius) * 0.5
  })
}

// ─── The objects ────────────────────────────────────────────────────────────

/**
 * The little gold fish.
 *
 * Aureliano makes them, melts them down and makes them again; the alternate
 * state is the crucible.
 *
 * It used to be fifteen voxels long, which is not enough grid to say "fish"
 * with anything but the outline: a flat plate for a tail, no fins at all, one
 * black cube for an eye. At thirty-five there is room for what actually reads
 * — a forked tail, a swept dorsal, pectorals laid back along the flanks, a
 * gill line, a pale belly. The eye is set on BOTH flanks, because this object
 * turns a full revolution and a one-sided face is blind for half of it.
 */
export function fishModel(): Model {
  const g = grid()

  // The profile is widest a little forward of centre and tapers to a stalk,
  // which is the whole difference between a fish and a fat cigar.
  const profile = (x: number) => {
    const t = (x + 2) / 15
    if (t <= -1 || t >= 1) return 0
    return Math.pow(1 - t * t, 0.55)
  }
  const halfZ = (x: number) => 5 * profile(x)
  const halfY = (x: number) => 7.2 * profile(x)

  g.carve([-14, 13, -9, 9, -7, 7], (x, y, z) => {
    if (profile(x) <= 0.06) return null
    // The belly hangs a little lower than the back stands high.
    const yy = y < 0 ? y / 1.08 : y
    if (ellip(0, yy, z, 0, 0, 0, 1, halfY(x), halfZ(x)) > 1) return null
    return y <= -halfY(x) * 0.44 ? 1 : 0
  })

  // Caudal stalk into a forked tail: a thin plate that flares and splits.
  g.carve([11, 22, -13, 13, -2, 2], (x, y, z) => {
    if (Math.abs(z) > 1) return null
    const run = x - 11
    const half = 2.6 + run * 1.02
    const notch = Math.max(0, (run - 3.5) * 1.2)
    const ay = Math.abs(y)
    if (ay > half || ay < notch) return null
    return ay > half - 1.4 ? 3 : 0
  })

  // Dorsal fin, with a swept trailing edge rather than a rectangle on top.
  g.carve([-6, 10, 0, 15, -2, 2], (x, y, z) => {
    if (Math.abs(z) > 1) return null
    const back = halfY(x)
    if (back <= 0 || y <= back - 0.5) return null
    const span = Math.min(1, ((x + 6) / 16) * 1.2)
    const crest = back + 4.8 * Math.sin(Math.PI * span)
    if (y > crest) return null
    return y > crest - 1.3 ? 3 : 0
  })

  // Anal fin, the small one under the stalk.
  g.carve([3, 11, -14, -3, -2, 2], (x, y, z) => {
    if (Math.abs(z) > 1) return null
    const belly = -halfY(x) / 1.08
    if (belly >= 0 || y >= belly + 0.5) return null
    return y < belly - 3.4 + (x - 3) * 0.3 ? null : 3
  })

  // Pectoral fins, one per flank, swept back along the body. Kept short:
  // at full length it stopped reading as a fin and became a shelf.
  for (const side of [-1, 1]) {
    g.carve([-8, -2, -5, 0, -9, 9], (x, y, z) => {
      if (Math.sign(z) !== side) return null
      const rz = halfZ(x)
      if (rz <= 0) return null
      const out = Math.abs(z) - rz
      if (out < -0.5 || out > 1.8) return null
      const drop = -1.2 - (x + 8) * 0.55
      if (y > drop + 1.4 || y < drop - 1.4) return null
      return 3
    })
  }

  // Gill line: an arc cut into the flank, not a stripe painted over it.
  g.carve([-11, -5, -9, 9, -9, 9], (x, y, z) => {
    if (!g.has(x, y, z)) return null
    if (Math.abs(z) < halfZ(x) - 1.3) return null
    return Math.abs(x - (-8.6 + Math.abs(y) * 0.24)) < 0.9 ? 3 : null
  })

  // Mouth: a short seam right at the snout. Run any further back and it
  // stops being a mouth and becomes a scratch down the side of the head.
  g.carve([-14, -12, -2, 0, -4, 4], (x, y, z) => {
    if (!g.has(x, y, z)) return null
    return y === -1 ? 2 : null
  })

  // Eyes, on both flanks, and round rather than square: a disc under three
  // voxels across lands on the grid as a plus sign every time.
  for (const side of [-1, 1]) {
    g.carve([-13, -6, -1, 6, -8, 8], (x, y, z) => {
      if (!g.has(x, y, z) || Math.sign(z) !== side) return null
      if (Math.abs(z) < halfZ(x) - 1.4) return null
      return Math.hypot(x + 9.6, y - 2.4) <= 2.05 ? 2 : null
    })
  }

  const voxels = g.emit()
  poolInto(voxels, 12, -9)
  return finalize('fish', voxels, { tones: [GOLD, GOLD_PALE, DARK, GOLD_DEEP] })
}

/**
 * Melquiades' alembic.
 *
 * The old one was a lumpy copper mound with a staircase of loose glass cubes
 * walking off the side, and it read as nothing at all. The one after that was
 * worse in a more interesting way: correctly built, but a fat pot with a fat
 * dome and a neck that hugged it, which under this camera resolved into a
 * copper snail. An alembic is legible because of its PROPORTIONS — a broad
 * squat pot, a head that tapers to a throat, and a long neck that swings
 * clear of the body before it comes down. Get those wrong and no amount of
 * detail rescues it.
 *
 * The press distils. The vessel holds still and the CHARGE moves — up
 * through the head, around the neck and down into the receiver — because an
 * alembic that pours itself onto the table is not doing its work. What moves
 * is azogue, the quicksilver that came with the laboratory.
 */
export function alembicModel(): Model {
  const g = grid()
  const GROUND = -9
  // Out over the pot, then down onto the mouth of the receiver.
  const NECK: readonly Pt[] = [
    [0, 13, 0], [3, 15, 0], [8, 14, 0], [12, 12, 0],
    [15, 9, 0], [17, 6, 0], [18, 3, 0],
  ]

  // The pot: a cauldron. WIDE and LOW, and that ratio is the whole read —
  // at eight tall by nine across it merged with the head above it into one
  // continuous curve and the object came out as a copper hood. Nine across
  // by five tall cannot be mistaken for anything that continues upward.
  //
  // A shell, not a solid: two voxels of wall reads as copper, costs a
  // quarter of the voxels, and leaves the mouth something to be seen into.
  // CUT OFF AT THE TOP, which took three goes to get right. A closed shell
  // is a dome, and a dome's outline keeps narrowing all the way to a point,
  // so whatever was set on top of it simply continued the same curve — pot,
  // head and neck resolving into one copper hood no matter how the parts
  // above were proportioned. A pot has a mouth. That is what stops the line.
  g.carve([-11, 11, GROUND, -1, -11, 11], (x, y, z) => {
    if (y < GROUND) return null
    const r = ellip(x, y, z, 0, -3.6, 0, 9.4, 5.6, 9.4)
    if (r > 1) return null
    if (y <= GROUND + 1) return 0 // a flat foot, so it stands
    return r > 0.7 ? 0 : null
  })

  // The lip: a flat ring that overhangs the head by a good margin. This is
  // the joint that says pot and head are two things bolted together.
  g.carve([-10, 10, -1, 0, -10, 10], (x, _y, z) => {
    const r = Math.hypot(x, z)
    return r > 6.2 && r < 8.8 ? 0 : null
  })

  // Head: a SHORT cap, then a straight chimney. The cap was a tall cone
  // running the full sixteen units to the neck, and a taper that long simply
  // continues whatever the pot was doing — the object stayed a hood however
  // the pot beneath it was proportioned. Three parts of different kinds beat
  // two parts of the same kind: bowl, cap, pipe.
  g.carve([-7, 7, 1, 8, -7, 7], (x, y, z) => {
    const wall = 6 - (y - 1) * 0.52
    return Math.abs(Math.hypot(x, z) - wall) < 1.05 ? 0 : null
  })

  // The chimney: straight-sided, which is what makes the cap above the pot
  // read as a cap and not as more of the same curve.
  g.carve([-4, 4, 8, 14, -4, 4], (x, _y, z) => {
    const r = Math.hypot(x, z)
    return r > 1.4 && r < 3.1 ? 0 : null
  })

  // One course beaten into the cap. Copper sheet is worked in bands, and a
  // band is what stops a smooth taper from reading as poured plastic.
  g.carve([-7, 7, 4, 4, -7, 7], (x, y, z) => {
    const wall = 6 - (y - 1) * 0.52
    return Math.abs(Math.hypot(x, z) - wall) < 1.75 ? 0 : null
  })

  // Swan neck.
  g.carve(pathBox(NECK, 2.4), (x, y, z) =>
    alongPath(x, y, z, NECK) <= 2.1 ? 0 : null,
  )

  // Receiver: a round-bottomed flask with a straight neck. The bulb alone
  // was a ball of loose cubes that read as crushed ice; glassware is legible
  // because of the neck, which is the part a ball does not have.
  const inside: Pt[] = []
  g.carve([12, 24, GROUND, 6, -7, 7], (x, y, z) => {
    const bulb = ellip(x, y, z, 18, -4.2, 0, 5.4, 4.9, 5.4)
    const neck = Math.hypot(x - 18, z)
    const inNeck = y >= -1 && y <= 5 && neck <= 2.6
    if (bulb > 1 && !inNeck) return null
    if (inNeck) return neck > 1.5 ? 1 : null
    if (bulb > 0.58) return 1
    if (y < -1) inside.push([x, y, z])
    return null
  })

  const vessel = g.emit()

  // The charge, built on its own grid so the vessel never has to know which
  // of its cells are liquid.
  const c = grid()
  c.carve([-9, 9, GROUND + 1, -1, -9, 9], (x, y, z) => {
    if (g.has(x, y, z)) return null
    return ellip(x, y, z, 0, -3.6, 0, 9.4, 5.6, 9.4) < 0.68 ? 2 : null
  })
  const charge = c.emit()

  // Alternate: the charge climbs the neck and settles in the receiver. A
  // quarter of it is strung along the neck as a running thread, so the press
  // reads as travel rather than as the contents teleporting across the frame.
  const inFlight = Math.max(1, Math.min(charge.length >> 2, 170))
  charge.forEach((v, i) => {
    if (i < inFlight) {
      const at = (i / inFlight) * (NECK.length - 1)
      const seg = Math.min(NECK.length - 2, Math.floor(at))
      const f = at - seg
      const from = NECK[seg]
      const to = NECK[seg + 1]
      v.ax = from[0] + (to[0] - from[0]) * f + (((i * 7) % 5) - 2) * 0.4
      v.ay = from[1] + (to[1] - from[1]) * f
      v.az = from[2] + (to[2] - from[2]) * f + (((i * 11) % 5) - 2) * 0.4
      return
    }
    const cell = inside[(i - inFlight) % Math.max(1, inside.length)]
    if (!cell) return
    v.ax = cell[0]
    v.ay = cell[1]
    v.az = cell[2]
  })

  return finalize('alembic', [...vessel, ...charge], {
    tones: [COPPER, GLASS, QUICKSILVER],
  })
}

/**
 * A sealed letter. Macondo's post takes years and answers anyway, so the
 * alternate state is the same letter opened.
 *
 * The seal used to be five voxels across, and five voxels across on an
 * integer grid is a plus sign, not a disc — the same failure the scroll's
 * roll ends had. At this size it is round.
 *
 * The flap is the part that took two goes. Laid flat across the whole top it
 * was invisible: a slab with a diagonal scar on it. An envelope reads as an
 * envelope because you can see the triangle come to a point, so the fold now
 * runs from the far edge down to a tip near the front, with the seal set
 * exactly where the folds meet — which is where a seal goes and why.
 */
export function letterModel(): Model {
  const g = grid()

  // Envelope. Deliberately the coarsest grid of the four: it is the only
  // model that is mostly one big flat face, and a flat face is all top
  // quads. At thirty-five by twenty-five it drew about nine hundred of them
  // every frame and took this section from 60fps to 30 on its own — measured
  // with the figure hidden and shown. Nothing here needs that much grid.
  g.carve([-13, 13, -2, 0, -9, 9], () => 0)

  // The flap: a triangle from the far edge to a point near the front, with
  // its two sloping folds left in shadow. Laid flat across the whole top it
  // was invisible — a slab with a diagonal scar on it. An envelope reads as
  // an envelope because you can watch the triangle come to a point.
  const foldAt = (x: number) => -1.5 + Math.abs(x) * 0.72
  g.carve([-13, 13, 1, 1, -9, 9], (x, _y, z) => {
    const fold = foldAt(x)
    if (z < fold) return null
    return z < fold + 1.2 ? 3 : 0
  })

  // The address: three ruled lines on the front, below the fold.
  const lines: Array<[number, number]> = [[-7, 6], [-5, 1], [-3, -3]]
  lines.forEach(([z, last], line) => {
    g.carve([-11, last, 1, 1, z, z], (x) =>
      (x + line * 3 + 60) % 7 >= 5 ? null : 4,
    )
  })

  // Wax seal, at the point where the folds meet.
  g.carve([-5, 5, 2, 3, -7, 3], (x, y, z) => {
    const r = Math.hypot(x, z + 1.5)
    if (r > 4) return null
    if (y === 3 && r > 3.1) return null
    return 2
  })

  const voxels = g.emit()

  // Alternate: the envelope stays on the table and everything folded over it
  // — flap, seal and writing — lifts away as one sheet.
  voxels.forEach((v, i) => {
    if (v.y <= 0) return
    v.ax = v.x * 1.06
    v.ay = v.y + 5 + (i % 4) * 0.5
    v.az = v.z * 1.06
  })

  return finalize('letter', voxels, { tones: [PAPER, PAPER, WAX, SEAM, INK] })
}

/**
 * The parchments.
 *
 * The first version was a hollow cylinder, and it read as a crate: a
 * one-voxel wall stair-steps into terraces that the isometric camera
 * flattens into shelves. Its unroll was worse — measured at 24874 painted
 * pixels at rest against 24704 open, a 0.7% change nobody could see. A press
 * that does nothing is a press that should not be there.
 *
 * So the object is the scroll already lying open: a written sheet with a
 * solid roll at either end, which is the one scroll silhouette that survives
 * this resolution. Volume is not conserved between the two states of any
 * model here, but a roll unwinding into a flat page is the one case where it
 * cannot be faked — a solid ring of paper unrolls to a ribbon four times the
 * frame, and framing both states then means framing neither.
 *
 * The press does the chapter instead. Melquiades' parchments give up their
 * text to Aureliano at the very end, and reading them is what makes them go:
 * the paper holds still and the INK lifts off it, drifting up and outward.
 * The cards below this figure are already doing the same thing in type.
 */
export function scrollModel(): Model {
  const g = grid()

  const GROUND = -8
  const HALF_Z = 11
  const ROLL_R = 5.6
  const ROLL_X = 17

  // The two rolls: solid, axis along Z, resting on the ground. Solid because
  // hollow is exactly what broke the first attempt — under this camera a
  // thin wall has no curvature to show, only the steps it was built from.
  for (const side of [-1, 1]) {
    const cx = ROLL_X * side
    const cy = GROUND + ROLL_R
    g.carve([cx - 7, cx + 7, GROUND, GROUND + 12, -HALF_Z, HALF_Z], (x, y, z) => {
      const r = Math.hypot(x - cx, y - cy)
      if (r > ROLL_R + 0.4) return null
      // The core, shown only on the two circular faces: it is what you see
      // looking at the end of a roll, and the one mark that separates paper
      // wound around itself from a log sawn to length.
      const cap = Math.abs(z) === HALF_Z
      if (cap && r < ROLL_R * 0.62) return 2
      return 0
    })
  }

  // The sheet between them, running under both rolls the way paper does.
  g.carve([-16, 16, GROUND, GROUND, -HALF_Z, HALF_Z], () => 0)

  // The writing. Ragged right edges and gaps for words: a flush block of ink
  // reads as a painted rectangle, and lines of unequal length read as text
  // long before any glyph is legible.
  const lines = [-8, -5, -2, 1, 4, 7]
  lines.forEach((z, i) => {
    const last = 12 - ((i * 5) % 9)
    g.carve([-12, last, GROUND, GROUND, z, z], (x) =>
      (x + i * 4 + 60) % 7 >= 5 ? null : 1,
    )
  })

  const voxels = g.emit()

  // Alternate: the paper stays exactly where it is and the text leaves it.
  // Rising and spreading outward, seeded off the voxel index so the drift is
  // fixed per build and never per frame.
  //
  // Everything that is not writing holds still — tested against tone 1 and
  // not against tone 0, because the seam is a third tone and an is-it-paper
  // check sent all four roll edges flying along with the text.
  voxels.forEach((v, i) => {
    if (v.tone !== 1) return
    v.ax = v.x * 1.2 + (((i * 7) % 5) - 2) * 0.9
    v.ay = v.y + 5 + ((i * 13) % 7) * 0.6
    v.az = v.z * 1.2 + (((i * 11) % 5) - 2) * 0.85
  })

  return finalize('scroll', voxels, { tones: [PAPER, INK, SEAM] })
}

/** Name -> factory, so the eager `VoxelFigure` shim can ask for a model by
 *  name without importing this (lazy) module's build code directly. */
export const MODELS: Record<VoxelModelName, () => Model> = {
  fish: fishModel,
  alembic: alembicModel,
  letter: letterModel,
  scroll: scrollModel,
}
