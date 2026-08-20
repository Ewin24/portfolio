import { useEffect, useState } from 'react'
import { useWindowManager } from './WindowManager'
import { useTranslation } from '../../hooks/useTranslation'
import type { AppId } from './registry'

/**
 * The Windows XP taskbar: a Start button, one label per open window, and a
 * clock. Window labels are real buttons that restore/focus/minimize their
 * window via the manager. The Start menu itself is wired in Slice B; here the
 * Start button stays inert (startOpen is always false).
 */
export function Taskbar() {
  const { apps, openSet, order, states, activeId, restore, focus, minimize } = useWindowManager()
  const { t } = useTranslation()
  const [startOpen] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const time = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(now)

  // Order the labels by z-order so the active window is last (rightmost).
  const openWindows = order.filter((id) => openSet.has(id))

  const onLabelClick = (id: AppId) => {
    const state = states[id]
    if (state === 'minimized') {
      restore(id)
      focus(id)
    } else if (activeId !== id) {
      focus(id)
    } else {
      minimize(id)
    }
  }

  return (
    <div className="xp-taskbar">
      <button
        type="button"
        className="xp-start-btn"
        aria-haspopup="menu"
        aria-expanded={startOpen}
        onClick={() => {}}
      >
        <span aria-hidden="true">🪟</span>
        Start
      </button>

      <div role="list" aria-label="Open windows">
        {openWindows.map((id) => (
          <button
            key={id}
            type="button"
            role="listitem"
            className="xp-window-label"
            data-active={activeId === id ? 'true' : 'false'}
            onClick={() => onLabelClick(id)}
          >
            {t(apps[id].titleKey)}
          </button>
        ))}
      </div>

      <div className="xp-clock" role="timer" aria-label="Clock">
        {time}
      </div>
    </div>
  )
}
