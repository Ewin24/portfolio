import { useEffect, useRef, useState } from 'react'
import { useWindowManager } from './WindowManager'
import { StartMenu } from './StartMenu'
import { Tray } from './Tray'
import { useTranslation } from '../../hooks/useTranslation'
import type { AppId } from './registry'

/**
 * The Windows XP taskbar (design D4): a functional Start button that toggles
 * the StartMenu, one label per open window, and a clock. Window labels are
 * real buttons that restore/focus/minimize their window via the manager.
 * The Start button carries `aria-haspopup=menu` + `aria-expanded`, and focus
 * returns to it whenever the menu closes.
 */
export function Taskbar() {
  const { apps, openSet, order, states, activeId, restore, focus, minimize } = useWindowManager()
  const { t } = useTranslation()
  const [startOpen, setStartOpen] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const startBtnRef = useRef<HTMLButtonElement>(null)

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

  const toggleStart = () => {
    setStartOpen((v) => {
      const next = !v
      if (!next) startBtnRef.current?.focus()
      return next
    })
  }

  return (
    <div className="xp-taskbar">
      <button
        ref={startBtnRef}
        type="button"
        className="xp-start-btn"
        aria-haspopup="menu"
        aria-expanded={startOpen}
        aria-controls="xp-startmenu"
        onClick={toggleStart}
      >
        <span aria-hidden="true">🪟</span>
        Start
      </button>

      <StartMenu open={startOpen} onClose={() => setStartOpen(false)} startButtonRef={startBtnRef} />

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

      <Tray />

      <div className="xp-clock" role="timer" aria-label="Clock">
        {time}
      </div>
    </div>
  )
}
