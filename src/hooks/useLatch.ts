import { useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from 'react'

export interface LatchBinding {
  'aria-pressed': boolean
  onClick: () => void
  onPointerEnter: (event: PointerEvent) => void
  onPointerLeave: (event: PointerEvent) => void
  onFocus: (event: FocusEvent) => void
  onBlur: (event: FocusEvent) => void
  onKeyDown: (event: KeyboardEvent) => void
}

/**
 * One exclusive-key latch, shared by the crucible (C3) and the lineage (C4).
 *
 * Both mechanisms had the identical defect: bound to `onPointerOver`/
 * `onPointerOut`, so the effect existed only while a coarse pointer held
 * contact and reverted on lift — on touch that means it never persists, and
 * for the lineage the payoff lands on cards that are usually already
 * scrolled off-screen by the time a finger lifts.
 *
 * A click (real click, including the synthetic one a touch tap and an
 * Enter/Space on a focused `<button>` both produce) LATCHES a key, so the
 * result survives the lift and survives a scroll. A second activation of the
 * same key releases it. Mouse hover still only PREVIEWS — it never latches —
 * and the latch always wins when both are present, because the reader who
 * committed to a tap or a click asked for more than a passing glance.
 *
 * `hovered` is mouse-only by construction: the `pointerType` gate means a
 * touch tap never sets it, which is what keeps a touch tap from reading as
 * "visible under your own finger, gone on lift".
 */
export function useLatch<K>() {
  const [latched, setLatched] = useState<K | null>(null)
  const [hovered, setHovered] = useState<K | null>(null)

  const active = latched ?? hovered

  const bind = (key: K): LatchBinding => ({
    'aria-pressed': latched === key,
    onClick: () => setLatched((current) => (current === key ? null : key)),
    onPointerEnter: (event) => {
      if (event.pointerType === 'mouse') setHovered(key)
    },
    onPointerLeave: (event) => {
      if (event.pointerType === 'mouse') {
        setHovered((current) => (current === key ? null : current))
      }
    },
    onFocus: () => setHovered(key),
    onBlur: () => setHovered((current) => (current === key ? null : current)),
    onKeyDown: (event) => {
      if (event.key === 'Escape') setLatched(null)
    },
  })

  return { latched, hovered, active, bind }
}
