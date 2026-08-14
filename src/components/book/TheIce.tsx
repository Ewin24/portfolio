import { useRef, useState, type ReactNode } from 'react'

interface Props {
  active: boolean
  still: boolean
  children: ReactNode
}

/**
 * The ice.
 *
 * The gypsies charged admission to touch a block of ice, and the child who
 * put his hand on it said it was boiling — because it burned with cold, and
 * because nobody in a town that had never seen winter had a word for that.
 * The marvel in the scene is not the ice. It is that it had to be TOUCHED to
 * be believed.
 *
 * So the portrait arrives frozen over, and thaws only where the reader puts
 * their hand. Not on hover of the whole card — that would be a state change,
 * and a state change is not a touch. The clear patch follows the pointer and
 * closes again behind it, so seeing the whole thing means moving across it,
 * deliberately, the way you would wipe a frosted window.
 *
 * Pointer-driven and therefore mouse-only by nature. On touch and under
 * reduced motion the frost simply never forms: an image a phone cannot
 * uncover would be a broken image, not a marvel.
 */
export function TheIce({ active, still, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [hand, setHand] = useState<{ x: number; y: number } | null>(null)

  if (!active || still) return <>{children}</>

  const onMove = (event: React.PointerEvent) => {
    // Coarse pointers get no frost at all — see the note above.
    if (event.pointerType !== 'mouse') return
    const rect = hostRef.current?.getBoundingClientRect()
    if (!rect) return
    setHand({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div
      ref={hostRef}
      className="ice-host"
      onPointerMove={onMove}
      onPointerLeave={() => setHand(null)}
    >
      {children}

      <div
        className={`ice-sheet${hand ? ' is-touched' : ''}`}
        aria-hidden="true"
        style={
          hand
            ? ({
                '--hand-x': `${hand.x}%`,
                '--hand-y': `${hand.y}%`,
              } as React.CSSProperties)
            : undefined
        }
      />
    </div>
  )
}
