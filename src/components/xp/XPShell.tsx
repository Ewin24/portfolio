import type { ReactNode } from 'react'
import { DesktopIcons } from './DesktopIcons'

interface XPShellProps {
  children: ReactNode
}

/**
 * The Windows XP desktop layer: a full-bleed Luna gradient that hosts the
 * absolute-positioned desktop-icon layer (z:1) and the window layer (z:10+,
 * design D7). The desktop is `position: relative` so the child layers anchor
 * to it.
 */
export function XPShell({ children }: XPShellProps) {
  return (
    <div className="xp-desktop">
      <div className="xp-desktop-icons-layer">
        <DesktopIcons />
      </div>
      <div className="xp-window-layer">{children}</div>
    </div>
  )
}
