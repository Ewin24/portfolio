import type { CSSProperties } from 'react'

export interface InsomniaTagProps {
  /** Stable index, so every tag keeps the same tilt across re-renders. */
  index: number
  text: string
  /** The selected object is the one being looked at, so its ink is fresh. */
  legible: boolean
  still: boolean
}

/**
 * A paper card tied to an object, in the manner of a town that has stopped
 * sleeping and is trying not to forget what things are for.
 *
 * Two details carry the whole idea:
 *
 *   - The tilt and the sway are derived from the index, never from random.
 *     A tag that re-tilts on every render reads as a glitch; a tag that keeps
 *     its own crooked angle reads as tied by hand.
 *   - The ink fades on everything except the object currently being looked
 *     at. That is the plague itself: the writing is going, and only what has
 *     your attention stays legible. It is a real opacity change rather than a
 *     colour swap, so the text underneath is still selectable and still read
 *     by a screen reader at full strength.
 */
export function InsomniaTag({ index, text, legible, still }: InsomniaTagProps) {
  // Deterministic pseudo-jitter: same tag, same crookedness, every time.
  const tilt = ((index * 37) % 9) - 4
  const drift = ((index * 53) % 5) - 2
  const delay = (index % 6) * 0.4

  const style: CSSProperties = {
    '--tag-tilt': `${tilt}deg`,
    '--tag-drift': `${drift}px`,
    '--tag-delay': `${delay}s`,
  } as CSSProperties

  return (
    <span className="insomnia-tag" style={style}>
      {/* The thread is the only decorative part, so it is the only part
          hidden from assistive tech. The card text is real content. */}
      <svg
        className="insomnia-thread"
        viewBox="0 0 24 18"
        preserveAspectRatio="none"
        focusable="false"
        aria-hidden="true"
      >
        <path d="M12 0 C 12 6, 8 8, 9 18" />
      </svg>

      <span
        className={`insomnia-card${legible ? ' is-legible' : ''}${
          still ? ' is-still' : ''
        }`}
      >
        {text}
      </span>
    </span>
  )
}
