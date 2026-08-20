interface StartMenuProps {
  open: boolean
}

/**
 * The Windows XP Start menu panel.
 *
 * Decorative in this change: the Start button always reports `open === false`
 * and no panel renders, so the menu is unreachable. The markup is gated by
 * `open` and ready for a later polish slice that actually opens it.
 */
export function StartMenu({ open }: StartMenuProps) {
  if (!open) return null

  return (
    <div className="xp-startmenu" role="menu">
      <div className="xp-startmenu-header">Portfolio</div>
      <div role="menuitem">Programs</div>
      <div role="menuitem">Documents</div>
      <div role="menuitem">Settings</div>
      <div role="menuitem">Log Off</div>
    </div>
  )
}
