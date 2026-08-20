import { useCallback, useEffect, useRef, useState } from 'react'
import { Minus, Square, X } from 'lucide-react'
import { useWindowManager } from './WindowManager'
import { useTheme } from '../../theme/ThemeContext'
import { useTranslation } from '../../hooks/useTranslation'
import type { AppId } from './registry'

interface WindowProps {
  id: AppId
}

const DRAG_STEP = 8 // px per arrow key (design D3)

/** True below 640px (Tailwind `sm`) — drag is disabled on mobile (design D8). */
const MOBILE_QUERY = '(max-width: 639px)'

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY).matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return mobile
}

/**
 * An interactive Windows XP window bound to the shared WindowManager.
 *
 * The title bar starts a pointer drag (with pointer capture and boundary
 * clamp), the three controls call the manager's min/max/close actions, and
 * the whole window is keyboard-operable: arrows drag, Enter focuses/restores,
 * Esc closes the active window. Under reduced motion (`stillness`) drag is
 * inert — the window never moves.
 */
export function Window({ id }: WindowProps) {
  const { apps, states, rects, order, activeId, focus, drag, minimize, restore, toggleMaximize, close, closeActive } =
    useWindowManager()
  const { stillness } = useTheme()
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const app = apps[id]
  const title = app ? t(app.titleKey) : id
  const icon = app?.icon
  const state = states[id] ?? 'open'
  const rect = rects[id]

  const dragRef = useRef<{ startX: number; startY: number } | null>(null)
  const titlebarRef = useRef<HTMLDivElement>(null)

  const active = activeId === id

  const onTitlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (stillness || isMobile) return
      // Focus on pointer-down, then begin a drag from the current pointer pos.
      focus(id)
      const el = titlebarRef.current
      if (el) {
        try {
          el.setPointerCapture(e.pointerId)
        } catch {
          /* pointer capture not supported — drag still works via move/up */
        }
      }
      dragRef.current = { startX: e.clientX, startY: e.clientY }
    },
    [focus, id, stillness, isMobile],
  )

  const onTitlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (stillness || isMobile || !dragRef.current) return
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      dragRef.current = { startX: e.clientX, startY: e.clientY }
      drag(id, dx, dy)
    },
    [drag, id, stillness, isMobile],
  )

  const onTitlePointerUp = useCallback(() => {
    // Pointer capture is released automatically on pointerup.
    dragRef.current = null
  }, [])

  // Focus safety net (design a11y / spec Risk 6): closing a window must never
  // leave focus on the removed node. Compute the next topmost title bar before
  // the close unmounts this window, then focus it (or blur) on the next frame.
  const handleClose = useCallback(
    (targetId: AppId) => {
      const titlebars = [...document.querySelectorAll<HTMLElement>('.xp-window .xp-window-titlebar')]
      close(targetId)
      requestAnimationFrame(() => {
        const next = titlebars.find((tb) => tb.isConnected)
        if (next) next.focus()
        else (document.activeElement as HTMLElement | null)?.blur()
      })
    },
    [close],
  )

  // Esc on the title bar closes the active window with the same focus safety.
  const onEscClose = useCallback(() => {
    const titlebars = [...document.querySelectorAll<HTMLElement>('.xp-window .xp-window-titlebar')]
    closeActive()
    requestAnimationFrame(() => {
      const next = titlebars.find((tb) => tb.isConnected)
      if (next) next.focus()
      else (document.activeElement as HTMLElement | null)?.blur()
    })
  }, [closeActive])

  const onTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (!stillness && !isMobile && state !== 'maximized') drag(id, -DRAG_STEP, 0)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (!stillness && !isMobile && state !== 'maximized') drag(id, DRAG_STEP, 0)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (!stillness && !isMobile && state !== 'maximized') drag(id, 0, -DRAG_STEP)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (!stillness && !isMobile && state !== 'maximized') drag(id, 0, DRAG_STEP)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (state === 'minimized') restore(id)
        else focus(id)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onEscClose()
      }
    },
    [drag, id, restore, focus, onEscClose, stillness, isMobile, state],
  )

  // Window style: absolute positioning from the manager rect. When minimized
  // the window is removed from view (display:none) but stays in the openSet.
  // z-index = 10 + index in z-order, so the active (last in order) is strictly
  // the greatest (design D7).
  const zIndex = 10 + order.indexOf(id)
  const style: React.CSSProperties = {
    position: 'absolute',
    left: rect?.x ?? 24,
    top: rect?.y ?? 24,
    width: rect?.w,
    height: rect?.h,
    zIndex,
    display: state === 'minimized' ? 'none' : undefined,
  }

  return (
    <div
      className="xp-window"
      data-active={active ? 'true' : 'false'}
      style={style}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`xp-title-${id}`}
      onPointerDown={() => focus(id)}
    >
      <div
        ref={titlebarRef}
        className="xp-window-titlebar"
        tabIndex={0}
        role="button"
        aria-label={title}
        style={{ cursor: stillness || isMobile ? 'default' : 'move' }}
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onKeyDown={onTitleKeyDown}
      >
        <div className="xp-window-title" id={`xp-title-${id}`}>
          {icon && <span aria-hidden="true">{icon}</span>}
          <span>{title}</span>
        </div>
        <div className="xp-window-controls">
          <button type="button" aria-label="Minimize" onClick={() => minimize(id)}>
            <Minus size={10} strokeWidth={2.5} />
          </button>
          <button type="button" aria-label="Maximize" onClick={() => toggleMaximize(id)}>
            <Square size={8} strokeWidth={2.5} />
          </button>
          <button type="button" aria-label="Close" onClick={() => handleClose(id)}>
            <X size={10} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      <div className="xp-window-body">{app?.render()}</div>
    </div>
  )
}
