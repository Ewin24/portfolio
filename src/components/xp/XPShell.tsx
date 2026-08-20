import type { ReactNode } from 'react'

interface XPShellProps {
  children: ReactNode
}

/**
 * The Windows XP desktop: a full-bleed Luna gradient that hosts the windows
 * laid out in normal document flow (they are static frames in this change).
 */
export function XPShell({ children }: XPShellProps) {
  return <div className="xp-desktop">{children}</div>
}
