import { useState, type ReactNode } from 'react'

export interface CrucibleProps {
  active: boolean
  still: boolean
  /** What went into the crucible. */
  before: ReactNode
  /** What came out of it. */
  after: ReactNode
  beforeLabel: string
  afterLabel: string
}

/**
 * The crucible.
 *
 * Melquíades' laboratory is where raw matter is worked on until it becomes
 * something else, and the novel is honest that the work mostly fails: the
 * gold is never produced, the family keeps at it for generations anyway.
 *
 * A case study is the same operation. The problem is the base metal and the
 * solution is what came out, and stacking them as two labelled paragraphs
 * makes them read as unrelated facts instead of as one thing turning into
 * another.
 *
 * So the card shows only what went in. Pointing at it — the deliberate act,
 * not a page-load animation — runs the transmutation, and the problem gives
 * way to the solution in the same block of space. Same footprint, so nothing
 * around it moves; you are watching one thing become another, which is the
 * entire content of the scene.
 *
 * Both paragraphs stay in the DOM throughout and only their opacity is
 * driven, so a screen reader and a crawler always read the problem AND the
 * solution. The transmutation is for the eye alone.
 */
export function Crucible({
  active,
  still,
  before,
  after,
  beforeLabel,
  afterLabel,
}: CrucibleProps) {
  const [worked, setWorked] = useState(false)

  if (!active) {
    return (
      <>
        <div>
          <p
            data-landmark="problem"
            className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent mb-1"
          >
            {beforeLabel}
          </p>
          {before}
        </div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
            {afterLabel}
          </p>
          {after}
        </div>
      </>
    )
  }

  // Under stillness the crucible is simply already worked: both states are
  // shown stacked, because a reader who asked for less motion should not have
  // to hover anything to reach the content.
  if (still) {
    return (
      <>
        <div>
          <p className="crucible-label">{beforeLabel}</p>
          {before}
        </div>
        <div>
          <p className="crucible-label is-after">{afterLabel}</p>
          {after}
        </div>
      </>
    )
  }

  return (
    <div
      className={`crucible${worked ? ' is-worked' : ''}`}
      onPointerOver={() => setWorked(true)}
      onPointerOut={() => setWorked(false)}
      onFocus={() => setWorked(true)}
      onBlur={() => setWorked(false)}
      tabIndex={0}
    >
      <p className="crucible-label">
        <span className="crucible-label-before">{beforeLabel}</span>
        <span className="crucible-label-after">{afterLabel}</span>
      </p>

      <div className="crucible-stack">
        <div className="crucible-face crucible-before">{before}</div>
        <div className="crucible-face crucible-after">{after}</div>
      </div>
    </div>
  )
}
