export type Rgb = [number, number, number]

/**
 * Parses `#RRGGBB` / `#RGB` into channels.
 *
 * Chapter palettes are authored as hex because that is how a designer reads
 * them, but the dune silhouettes and the particle field both need channels:
 * one to build an alpha cast, the other to interpolate between chapters
 * without flipping colour on a single frame.
 */
export function hexToRgb(hex: string): Rgb {
  const raw = hex.replace('#', '')
  const full =
    raw.length === 3
      ? raw.split('').map((c) => c + c).join('')
      : raw

  const value = Number.parseInt(full, 16)

  if (full.length !== 6 || Number.isNaN(value)) return [0, 0, 0]

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** Moves `from` a fraction of the way toward `to`. Used per animation frame. */
export function lerpRgb(from: Rgb, to: Rgb, amount: number): Rgb {
  return [
    from[0] + (to[0] - from[0]) * amount,
    from[1] + (to[1] - from[1]) * amount,
    from[2] + (to[2] - from[2]) * amount,
  ]
}
