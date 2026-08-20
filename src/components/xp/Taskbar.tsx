import { useEffect, useState } from 'react'

interface TaskbarWindow {
  id: string
  title: string
  active?: boolean
}

interface TaskbarProps {
  windows: TaskbarWindow[]
}

/**
 * The Windows XP taskbar: a Start button, one label per open window, and a
 * clock on the right.
 *
 * The Start button is a real focusable button with the correct accessibility
 * contract (aria-haspopup, aria-expanded), but in this change `startOpen` is
 * always false — the Start menu is decorative and opens nothing. A later
 * polish slice flips the flag.
 *
 * The clock ticks every 30 seconds and formats with Intl.DateTimeFormat so it
 * follows the visitor's locale and language.
 */
export function Taskbar({ windows }: TaskbarProps) {
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
        {windows.map((w) => (
          <span
            key={w.id}
            role="listitem"
            className="xp-window-label"
            data-active={w.active ? 'true' : 'false'}
          >
            {w.title}
          </span>
        ))}
      </div>

      <div className="xp-clock" role="timer" aria-label="Clock">
        {time}
      </div>
    </div>
  )
}
