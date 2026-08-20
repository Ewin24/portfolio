import { useWindowManager } from './WindowManager'
import { Window } from './Window'

/**
 * Renders every open window from the manager's z-order (design D2).
 * `order` is the source of truth; the last entry is the topmost window.
 */
export function DesktopWindows() {
  const { order } = useWindowManager()
  return (
    <>
      {order.map((id) => (
        <Window key={id} id={id} />
      ))}
    </>
  )
}
