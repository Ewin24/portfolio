import type { ReactNode } from 'react'
import { Minus, Square, X } from 'lucide-react'

interface WindowProps {
  title: string
  icon?: ReactNode
  className?: string
  children: ReactNode
}

/**
 * A static Windows XP window chrome frame.
 *
 * In this change the window is a pure decorative shell: title bar, the three
 * window controls (minimize / maximize / close) and a beveled body. The
 * controls are real focusable buttons for accessibility, but their onClick
 * is a no-op — there is no window manager to act on them yet (drag and
 * window management are deferred to a later polish slice).
 */
export function Window({ title, icon, className = '', children }: WindowProps) {
  return (
    <div className={`xp-window ${className}`.trim()}>
      <div className="xp-window-titlebar">
        <div className="xp-window-title">
          {icon && <span aria-hidden="true">{icon}</span>}
          <span>{title}</span>
        </div>
        <div className="xp-window-controls">
          <button type="button" aria-label="Minimize" onClick={() => {}}>
            <Minus size={10} strokeWidth={2.5} />
          </button>
          <button type="button" aria-label="Maximize" onClick={() => {}}>
            <Square size={8} strokeWidth={2.5} />
          </button>
          <button type="button" aria-label="Close" onClick={() => {}}>
            <X size={10} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      <div className="xp-window-body">{children}</div>
    </div>
  )
}
