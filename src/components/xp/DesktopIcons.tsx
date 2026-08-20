import { useWindowManager } from './WindowManager'
import { useTranslation } from '../../hooks/useTranslation'
import { APP_REGISTRY } from './registry'

/**
 * Desktop launcher icons (design D5).
 *
 * An absolutely-positioned column on the desktop, one focusable button per
 * app, rendered from the shared registry. Each icon opens (and focuses) its
 * window on click. Sits below the window layer (z-index:1).
 */
export function DesktopIcons() {
  const { open, focus } = useWindowManager()
  const { t } = useTranslation()

  return (
    <div className="xp-desktop-icons" role="toolbar" aria-label="Desktop">
      {APP_REGISTRY.map((app) => (
        <button
          key={app.id}
          type="button"
          className="xp-desktop-icon"
          data-app={app.id}
          aria-label={t(app.titleKey)}
          onClick={() => {
            open(app.id)
            focus(app.id)
          }}
        >
          <span className="xp-desktop-icon-glyph" aria-hidden="true">
            {app.icon}
          </span>
          <span className="xp-desktop-icon-label">{t(app.titleKey)}</span>
        </button>
      ))}
    </div>
  )
}
