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
 * fish melts, the alembic pours, the letter opens. That second arrangement is
 * what turns a mascot into a scene.
 *
 * Occlusion is baked here, once, at build time — not recomputed per frame.
 * Each voxel gets a 0-2 darkening level per drawn face (crevice vs exposed),
 * and every palette tone gets its three quantised variants precomputed into
 * `fills`. The renderer only ever indexes into that table.
 */

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
  /** Baked occlusion level (0-2) per drawn face: [top, side, dark]. */
  ao: [number, number, number]
}

export interface Palette {
  /** [top, side, dark] per tone. */
  tones: Array<[string, string, string]>
}

export interface Model {
  voxels: Voxel[]
  palette: Palette
  /** Half-extent used to frame the object. */
  reach: number
  /** Quantised darkened fills, precomputed: [tone][face 0-2][level 0-2]. */
  fills: string[][][]
  /** Ground-plane footprint the contact shadow is drawn from. */
  footprint: { hx: number; hz: number; y: number }
}

const GOLD: [string, string, string] = ['#E3B24A', '#C08C28', '#8A5F16']
const DARK: [string, string, string] = ['#2A1E0C', '#2A1E0C', '#2A1E0C']
const GLASS: [string, string, string] = ['#CFE0DF', '#A9C4C4', '#7A9A9B']
const COPPER: [string, string, string] = ['#C2703C', '#A15628', '#6E3617']
const PAPER: [string, string, string] = ['#F0E4C6', '#D8C8A2', '#A89770']
const INK: [string, string, string] = ['#6E4A22', '#573A1B', '#3B2712']
const WAX: [string, string, string] = ['#9C3327', '#7E2820', '#551A15']

/** Quantised occlusion factors — a JND step, not a gradient (design D2). */
const AO_FACTORS = [1, 0.88, 0.76]

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
  const key = (ax: number, ay: number, az: number) => `${ax},${ay},${az}`
  let neighbours: Array<[number, number, number]>

  if (face === 0) {
    // Top face (+y): tangents in the x/z plane at the layer above.
    neighbours = [
      [x + 1, y + 1, z],
      [x - 1, y + 1, z],
      [x, y + 1, z + 1],
      [x, y + 1, z - 1],
    ]
  } else if (face === 1) {
    // Side face (+z): tangents in the x/y plane at the layer ahead.
    neighbours = [
      [x + 1, y, z + 1],
      [x - 1, y, z + 1],
      [x, y + 1, z + 1],
      [x, y - 1, z + 1],
    ]
  } else {
    // Dark face (+x): tangents in the y/z plane at the layer beside.
    neighbours = [
      [x + 1, y + 1, z],
      [x + 1, y - 1, z],
      [x + 1, y, z + 1],
      [x + 1, y, z - 1],
    ]
  }

  const count = neighbours.filter(([nx, ny, nz]) => occ.has(key(nx, ny, nz))).length
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

/** Bakes occlusion, fills and footprint, and marks the build for D11. */
function finalize(name: string, voxels: Voxel[], palette: Palette, reach: number): Model {
  performance.mark(`voxel-build:${name}`)

  const occ = new Set(voxels.map((v) => `${v.x},${v.y},${v.z}`))
  for (const v of voxels) {
    v.ao = [
      aoLevel(occ, v.x, v.y, v.z, 0),
      aoLevel(occ, v.x, v.y, v.z, 1),
      aoLevel(occ, v.x, v.y, v.z, 2),
    ]
  }

  return {
    voxels,
    palette,
    reach,
    fills: buildFills(palette),
    footprint: computeFootprint(voxels),
  }
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

/**
 * The little gold fish. Aureliano makes them, melts them down, and makes
 * them again; the alternate state is the crucible.
 */
export function fishModel(): Model {
  const voxels: Voxel[] = []

  for (let x = -6; x <= 8; x++) {
    for (let y = -5; y <= 5; y++) {
      for (let z = -3; z <= 3; z++) {
        let solid = false

        if (x <= 4) {
          const taper = 1 - (Math.max(0, x + 1) / 6.5) * 0.62
          if (
            (x / 5.2) ** 2 + (y / (2.5 * taper)) ** 2 + (z / (2 * taper)) ** 2 <= 1
          ) solid = true
        }
        if (!solid && x >= 3 && x <= 7 && Math.abs(z) <= 0.6) {
          if (Math.abs(y) <= (x - 2) * 0.95) solid = true
        }
        if (!solid && Math.abs(z) <= 0.6 && x >= -2 && x <= 2) {
          if (y > 1.6 && y <= 4 - Math.abs(x) * 0.5) solid = true
          if (y < -1.8 && y >= -3.4 + Math.abs(x) * 0.4) solid = true
        }
        if (!solid) continue

        const eye = x === -3 && y === 1 && Math.abs(z) === 1
        voxels.push({ x, y, z, tone: eye ? 1 : 0, ax: 0, ay: 0, az: 0, ao: [0, 0, 0] })
      }
    }
  }

  poolInto(voxels, 6.4, -4.5)
  return finalize('fish', voxels, { tones: [GOLD, DARK] }, 8)
}

/**
 * Melquíades' alembic. A copper vessel with a glass neck; the alternate
 * state tips it over and pours what is inside.
 */
export function alembicModel(): Model {
  const voxels: Voxel[] = []
  const add = (x: number, y: number, z: number, tone: number) =>
    voxels.push({ x, y, z, tone, ax: 0, ay: 0, az: 0, ao: [0, 0, 0] })

  // Rounded copper body.
  for (let x = -4; x <= 4; x++)
    for (let y = -4; y <= 1; y++)
      for (let z = -4; z <= 4; z++)
        if ((x / 4) ** 2 + ((y + 1.5) / 2.8) ** 2 + (z / 4) ** 2 <= 1) add(x, y, z, 0)

  // Glass neck rising out of it, narrowing.
  //
  // Solid rather than a hollow tube. A one-voxel wall at this resolution
  // breaks into separate columns as the radius shrinks, and the result read
  // as a battlement rather than a neck — there is no glass thin enough to
  // survive being three cubes wide.
  for (let y = 2; y <= 8; y++) {
    const r = 2.3 - (y - 2) * 0.24
    for (let x = -3; x <= 3; x++)
      for (let z = -3; z <= 3; z++)
        if (x * x + z * z <= r * r) add(x, y, z, 1)
  }

  // The spout. Each step overlaps the last so the run stays connected —
  // a single voxel per step left a staircase of pieces hanging in the air.
  for (let i = 0; i <= 5; i++) {
    const x = 2 + i
    const y = 6 - i
    add(x, y, 0, 1)
    add(x, y - 1, 0, 1)
  }

  poolInto(voxels, 7, -5)
  return finalize('alembic', voxels, { tones: [COPPER, GLASS] }, 8)
}

/**
 * A sealed letter. Macondo's post takes years and answers anyway, so the
 * alternate state is the same letter opened.
 */
export function letterModel(): Model {
  const voxels: Voxel[] = []
  const add = (x: number, y: number, z: number, tone: number) =>
    voxels.push({ x, y, z, tone, ax: 0, ay: 0, az: 0, ao: [0, 0, 0] })

  // The envelope: a flat slab.
  for (let x = -7; x <= 7; x++)
    for (let z = -5; z <= 5; z++)
      for (let y = -1; y <= 0; y++) add(x, y, z, 0)

  // The flap, folded down the middle.
  for (let x = -7; x <= 7; x++) {
    const fold = Math.round(5 - Math.abs(x) * 0.7)
    for (let z = -5; z <= fold; z++) if (z >= 0) add(x, 1, z, 1)
  }

  // Wax seal.
  for (let x = -2; x <= 2; x++)
    for (let z = -2; z <= 2; z++)
      if (x * x + z * z <= 4) add(x, 2, z, 2)

  // Alternate: the sheet lifts out and unfolds flat.
  voxels.forEach((v, i) => {
    v.ax = v.x
    v.az = v.z
    v.ay = v.tone === 0 ? v.y : v.y + 3 + (i % 3) * 0.3
  })

  return finalize('letter', voxels, { tones: [PAPER, PAPER, WAX] }, 8)
}

/**
 * A rolled parchment. Nobody in the house can read it yet; the alternate
 * state unrolls it.
 */
export function scrollModel(): Model {
  const voxels: Voxel[] = []
  const add = (x: number, y: number, z: number, tone: number) =>
    voxels.push({ x, y, z, tone, ax: 0, ay: 0, az: 0, ao: [0, 0, 0] })

  // A cylinder lying along X.
  for (let x = -7; x <= 7; x++)
    for (let y = -3; y <= 3; y++)
      for (let z = -3; z <= 3; z++) {
        const r = Math.hypot(y, z)
        if (r <= 3 && r >= 1.6) add(x, y, z, Math.abs(x) > 6 ? 1 : 0)
      }

  // Alternate: unrolled into a flat sheet.
  voxels.forEach((v) => {
    const angle = Math.atan2(v.y, v.z)
    v.ax = v.x
    v.ay = -2.5
    v.az = angle * 2.4
  })

  return finalize('scroll', voxels, { tones: [PAPER, INK] }, 8)
}
