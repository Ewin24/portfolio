import type { ReactNode } from 'react'

interface XPShellProps {
  children: ReactNode
}

/**
 * The Windows XP desktop layer: a full-bleed Luna gradient that hosts the
 * absolute-positioned window layer. The desktop is `position: relative` so
 * the child windows (absolutely positioned by the manager) anchor to it.
 */
export function XPShell({ children }: XPShellProps) {
  return (
    <div className="xp-desktop">
      <div className="xp-window-layer">{children}</div>
    </div>
  )
}
