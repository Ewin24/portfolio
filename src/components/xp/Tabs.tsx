import { useRef, type KeyboardEvent, type ReactNode } from 'react'

export interface TabDef {
  /** Stable id, used as the value passed to `onChange` and as panel id. */
  key: string
  label: string
  content?: ReactNode
}

interface TabsProps {
  tabs: TabDef[]
  /** The currently active tab key (controlled by the parent). */
  active: string
  onChange: (key: string) => void
  /** Optional accessible name for the tablist (e.g. the window title). */
  label?: string
  /** Optional unique id prefix so tab/panel ids do not collide across windows. */
  idPrefix?: string
}

/**
 * Reusable accessible tab bar (design D6).
 *
 * Renders `role=tablist` + `role=tab` (with `aria-selected` and `aria-controls`)
 * + `role=tabpanel` (with `aria-labelledby` and `aria-hidden`). Keyboard uses
 * the roving-tabindex pattern: arrow keys move the active tab; the tab button
 * carries the full tabpanel content so the panel is always in the DOM and only
 * toggled via `aria-hidden`/`hidden` — a tab swap never remounts the content.
 */
export function Tabs({ tabs, active, onChange, label, idPrefix = 'tabs' }: TabsProps) {
  // Keep a reference to each tab button so arrow navigation can move focus.
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const activeTab = tabs.find((t) => t.key === active) ?? tabs[0]
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.key === activeTab.key),
  )

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    let nextIndex = activeIndex
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextIndex = (activeIndex + 1) % tabs.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = (activeIndex - 1 + tabs.length) % tabs.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIndex = tabs.length - 1
    } else {
      return
    }
    const next = tabs[nextIndex]
    onChange(next.key)
    // Roving tabindex: move focus to the newly selected tab button.
    tabRefs.current[next.key]?.focus()
  }

  return (
    <div className="xp-tabs">
      <div className="xp-tablist" role="tablist" aria-label={label ?? 'Tabs'}>
        {tabs.map((tab) => {
          const selected = tab.key === activeTab.key
          return (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[tab.key] = el
              }}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${tab.key}`}
              aria-selected={selected}
              aria-controls={`${idPrefix}-panel-${tab.key}`}
              tabIndex={selected ? 0 : -1}
              className={`xp-tab${selected ? ' xp-tab-active' : ''}`}
              onClick={() => onChange(tab.key)}
              onKeyDown={onKeyDown}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {tabs.map((tab) => {
        const selected = tab.key === activeTab.key
        return (
          <div
            key={tab.key}
            role="tabpanel"
            id={`${idPrefix}-panel-${tab.key}`}
            aria-labelledby={`${idPrefix}-tab-${tab.key}`}
            aria-hidden={!selected}
            hidden={!selected}
            className="xp-tabpanel"
          >
            {tab.content}
          </div>
        )
      })}
    </div>
  )
}
