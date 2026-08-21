import { useTheme } from '../../theme/ThemeContext'
import { useTranslation } from '../../hooks/useTranslation'

/**
 * The "?" Help window body (design D5, Slice 3).
 *
 * A compact, self-contained list of the XP desktop's keyboard shortcuts and
 * how to return to the newspaper theme. It reuses the standard Window chrome
 * and lives entirely in the shared WindowManager open-set (hidden registry
 * app) — no remount or duplicate window state.
 *
 * "Return to newspaper" calls `toggleTheme()` from ThemeContext, flipping
 * `data-theme` off xp so the newspaper branch renders.
 */
export function HelpWindow() {
  const { toggleTheme } = useTheme()
  const { t } = useTranslation()

  const shortcuts: { key: string; desc: string }[] = [
    { key: t('help.drag'), desc: t('help.dragDesc') },
    { key: t('help.resize'), desc: t('help.resizeDesc') },
    { key: t('help.shiftArrow'), desc: t('help.shiftArrowDesc') },
    { key: t('help.enter'), desc: t('help.enterDesc') },
    { key: t('help.esc'), desc: t('help.escDesc') },
  ]

  return (
    <div id="xp-help" className="xp-help">
      <div className="xp-help-shortcuts">
        <h3 className="xp-help-title">{t('help.shortcutsTitle')}</h3>
        <ul>
          {shortcuts.map((s) => (
            <li key={s.key}>
              <kbd>{s.key}</kbd>
              <span>{s.desc}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="xp-help-return-row">
        <button type="button" className="xp-help-return" onClick={toggleTheme}>
          {t('help.return')}
        </button>
      </div>
    </div>
  )
}
