import { useCallback, useEffect, useRef } from 'react'
import { Computer } from 'lucide-react'
import { useWindowManager } from './WindowManager'
import { useTranslation } from '../../hooks/useTranslation'
import type { AppId } from './registry'

interface StartMenuProps {
  open: boolean
  onClose: () => void
  startButtonRef: React.RefObject<HTMLButtonElement | null>
}

/** App ids shown in the "Programs" group, in display order. */
const PROGRAMS: AppId[] = [
  'about',
  'projects',
  'skills-experience',
  'education',
  'testimonials',
  'blog',
  'contact',
]

/**
 * The functional Windows XP Start menu (design D4).
 *
 * Renders a `role=menu` with 7 `role=menuitem` buttons — one per app — that
 * open (and focus) their window and then close the menu. A "Programs" group
 * header labels the list, and a "My Computer" easter egg re-opens the About
 * window. The menu closes on selection, on an outside pointerdown, and on
 * Esc; every close path returns focus to the Start button.
 */
export function StartMenu({ open, onClose, startButtonRef }: StartMenuProps) {
  const { apps, open: openApp, focus } = useWindowManager()
  const { t } = useTranslation()
  const menuRef = useRef<HTMLDivElement>(null)

  // Return focus to the Start button after the menu closes.
  const closeAndReturnFocus = useCallback(() => {
    onClose()
    startButtonRef.current?.focus()
  }, [onClose, startButtonRef])

  // Close on an outside pointerdown, ignoring clicks on the menu itself and
  // on the Start button (which owns its own toggle).
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const target = e.target as Node
      if (menuRef.current?.contains(target)) return
      if (startButtonRef.current?.contains(target)) return
      closeAndReturnFocus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, closeAndReturnFocus, startButtonRef])

  // Close on Escape, returning focus to the Start button.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeAndReturnFocus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, closeAndReturnFocus])

  if (!open) return null

  const launch = (id: AppId) => {
    openApp(id)
    focus(id)
    closeAndReturnFocus()
  }

  return (
    <div ref={menuRef} className="xp-startmenu" role="menu" aria-label="Start menu" id="xp-startmenu">
      <div className="xp-startmenu-header">Portfolio</div>

      <div className="xp-startmenu-group" role="group" aria-label="Programs">
        <div className="xp-startmenu-group-label">Programs</div>
        {PROGRAMS.map((id) => (
          <button
            key={id}
            type="button"
            role="menuitem"
            className="xp-startmenu-item"
            onClick={() => launch(id)}
          >
            {apps[id].icon && (
              <span className="xp-startmenu-item-icon" aria-hidden="true">
                {apps[id].icon}
              </span>
            )}
            <span>{t(apps[id].titleKey)}</span>
          </button>
        ))}
      </div>

      <div className="xp-startmenu-footer">
        <button type="button" className="xp-startmenu-easteregg" onClick={() => launch('about')}>
          <Computer size={18} aria-hidden="true" />
          <span>My Computer</span>
        </button>
      </div>
    </div>
  )
}
