import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useTheme } from '../../theme/ThemeContext'
import type { AppEntry, AppId } from './registry'

/** Height of the fixed taskbar in px — the drag clamp subtracts it (spec). */
export const TASKBAR_HEIGHT = 40

/** Height of the fixed page header in px. The XP theme hides the header
 *  (design D3), so a maximized window now fills to y:0 — the top clamp no
 *  longer needs to clear a 56px bar. Newspaper keeps its own header; this
 *  constant only drives XP window geometry. */
export const HEADER_HEIGHT = 0

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export type WinState = 'open' | 'minimized' | 'maximized'

export interface WindowManagerValue {
  apps: Record<AppId, AppEntry>
  /** Ids currently open, including minimized (session-only, in-memory). */
  openSet: Set<AppId>
  activeId: AppId | null
  /** Z-order — last entry is the topmost window. */
  order: AppId[]
  states: Partial<Record<AppId, WinState>>
  /** Current (restored) rect per window. */
  rects: Partial<Record<AppId, Rect>>
  /** Pre-maximize rects so a second Maximize restores the prior position. */
  maximizedRects: Partial<Record<AppId, Rect>>
  open: (id: AppId) => void
  close: (id: AppId) => void
  minimize: (id: AppId) => void
  restore: (id: AppId) => void
  toggleMaximize: (id: AppId) => void
  focus: (id: AppId) => void
  drag: (id: AppId, dx: number, dy: number) => void
  setRect: (id: AppId, rect: Rect) => void
  closeActive: () => void
}

interface WindowManagerState {
  openSet: Set<AppId>
  activeId: AppId | null
  order: AppId[]
  states: Partial<Record<AppId, WinState>>
  rects: Partial<Record<AppId, Rect>>
  maximizedRects: Partial<Record<AppId, Rect>>
}

const WindowManagerContext = createContext<WindowManagerValue | null>(null)

/** Clamp a drag offset so a window stays inside the desktop, minus the taskbar. */
function clampDrag(x: number, y: number, w: number, h: number, desktopW: number, desktopH: number): Rect {
  const maxX = Math.max(0, desktopW - w)
  const maxY = Math.max(0, desktopH - TASKBAR_HEIGHT - h)
  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
    w,
    h,
  }
}

interface WindowManagerProviderProps {
  apps: AppEntry[]
  children: ReactNode
}

/** Default squared window size (design D2): w = min(0.5×desktopW, 480),
 *  h = min(0.6×desktopH, 420). Applies to `about` on mount and every
 *  subsequent open; later opens cascade +20px from a base y:8 (the header
 *  is gone in XP). */
function defaultSize(desktopW: number, desktopH: number): { w: number; h: number } {
  return {
    w: Math.max(0, Math.min(desktopW * 0.5, 480)),
    h: Math.max(0, Math.min(desktopH * 0.6, 420)),
  }
}

/**
 * Owns all window state for the XP desktop in-memory (spec decision #5:
 * session-only, reload resets to the single default `about` window).
 *
 * Desktop dimensions are read from the window on mount and re-read on resize
 * so the drag clamp tracks the real viewport. `stillness` (reduced motion)
 * makes drag handlers inert — no window moves when the visitor asked for less
 * motion.
 */
export function WindowManagerProvider({ apps, children }: WindowManagerProviderProps) {
  const { stillness } = useTheme()
  const appMap = useMemo(() => {
    const map = {} as Record<AppId, AppEntry>
    for (const app of apps) map[app.id] = app
    return map
  }, [apps])

  const [desktop, setDesktop] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1024,
    h: typeof window !== 'undefined' ? window.innerHeight : 768,
  }))

  useEffect(() => {
    const onResize = () => setDesktop({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const [state, setState] = useState<WindowManagerState>(() => {
    const desktopW = typeof window !== 'undefined' ? window.innerWidth : 1024
    const desktopH = typeof window !== 'undefined' ? window.innerHeight : 768
    // Squared default (design D2): x:100 clears the desktop-icon column
    // (left:12 + 76px wide + gap), y:8 because the header is gone in XP.
    const { w, h } = defaultSize(desktopW, desktopH)
    const defaultRect: Rect = { x: 100, y: 8, w, h }
    return {
      openSet: new Set<AppId>(['about']),
      activeId: 'about',
      order: ['about'],
      states: { about: 'open' },
      rects: { about: defaultRect },
      maximizedRects: {},
    }
  })

  const focus = useCallback((id: AppId) => {
    setState((s) => {
      // Bring the id to the top of the z-order if it is open.
      if (!s.openSet.has(id)) return s
      const order = s.order.includes(id) ? [...s.order.filter((o) => o !== id), id] : [...s.order, id]
      return { ...s, activeId: id, order }
    })
  }, [])

  const open = useCallback(
    (id: AppId) => {
      setState((s) => {
        if (s.openSet.has(id)) return s
        // Squared default (design D2): every open cascades +20px from a base
        // y:8 (header gone), wrapping after 4 windows via the order length.
        const { w, h } = defaultSize(desktop.w, desktop.h)
        const defaultRect: Rect = {
          x: 100 + (s.order.length % 4) * 20,
          y: 8 + (s.order.length % 4) * 20,
          w,
          h,
        }
        return {
          ...s,
          openSet: new Set(s.openSet).add(id),
          order: [...s.order, id],
          activeId: id,
          states: { ...s.states, [id]: 'open' },
          rects: { ...s.rects, [id]: defaultRect },
        }
      })
    },
    [desktop.w, desktop.h],
  )

  const close = useCallback((id: AppId) => {
    setState((s) => {
      if (!s.openSet.has(id)) return s
      const openSet = new Set(s.openSet)
      openSet.delete(id)
      const order = s.order.filter((o) => o !== id)
      let activeId = s.activeId
      if (activeId === id) {
        activeId = order.length ? order[order.length - 1] : null
      }
      const states = { ...s.states }
      delete states[id]
      const rects = { ...s.rects }
      delete rects[id]
      const maximizedRects = { ...s.maximizedRects }
      delete maximizedRects[id]
      return { ...s, openSet, order, activeId, states, rects, maximizedRects }
    })
  }, [])

  const minimize = useCallback((id: AppId) => {
    setState((s) => {
      if (!s.openSet.has(id)) return s
      const states = { ...s.states, [id]: 'minimized' }
      let activeId = s.activeId
      if (activeId === id) {
        const others = s.order.filter((o) => o !== id)
        activeId = others.length ? others[others.length - 1] : null
      }
      return { ...s, states, activeId }
    })
  }, [])

  const restore = useCallback((id: AppId) => {
    setState((s) => {
      if (!s.openSet.has(id)) return s
      const states = { ...s.states, [id]: s.maximizedRects[id] ? 'maximized' : 'open' }
      const order = s.order.includes(id) ? [...s.order.filter((o) => o !== id), id] : [...s.order, id]
      return { ...s, states, order, activeId: id }
    })
  }, [])

  const toggleMaximize = useCallback(
    (id: AppId) => {
      setState((s) => {
        if (!s.openSet.has(id)) return s
        if (s.states[id] === 'maximized') {
          // Restore the pre-maximize rect.
          const restored = s.maximizedRects[id] ?? s.rects[id]
          const maximizedRects = { ...s.maximizedRects }
          delete maximizedRects[id]
          return {
            ...s,
            states: { ...s.states, [id]: 'open' },
            rects: { ...s.rects, [id]: restored },
            maximizedRects,
          }
        }
        const prior = s.rects[id] ?? { x: 24, y: 24, w: 0, h: 0 }
        return {
          ...s,
          states: { ...s.states, [id]: 'maximized' },
          maximizedRects: { ...s.maximizedRects, [id]: prior },
          rects: {
            ...s.rects,
            [id]: {
              x: 0,
              y: HEADER_HEIGHT,
              w: desktop.w,
              h: Math.max(0, desktop.h - HEADER_HEIGHT - TASKBAR_HEIGHT),
            },
          },
        }
      })
    },
    [desktop.w, desktop.h],
  )

  const setRect = useCallback((id: AppId, rect: Rect) => {
    setState((s) => {
      if (!s.openSet.has(id)) return s
      return { ...s, rects: { ...s.rects, [id]: rect } }
    })
  }, [])

  const drag = useCallback(
    (id: AppId, dx: number, dy: number) => {
      // Reduced motion makes drag inert (spec / stillness consumption).
      if (stillness) return
      setState((s) => {
        if (!s.openSet.has(id) || s.states[id] !== 'open') return s
        const cur = s.rects[id] ?? { x: 24, y: 24, w: 0, h: 0 }
        const next = clampDrag(cur.x + dx, cur.y + dy, cur.w, cur.h, desktop.w, desktop.h)
        return { ...s, rects: { ...s.rects, [id]: next } }
      })
    },
    [desktop.w, desktop.h, stillness],
  )

  const closeActive = useCallback(() => {
    setState((s) => {
      if (s.activeId === null) return s
      const id = s.activeId
      const openSet = new Set(s.openSet)
      openSet.delete(id)
      const order = s.order.filter((o) => o !== id)
      const activeId = order.length ? order[order.length - 1] : null
      const states = { ...s.states }
      delete states[id]
      const rects = { ...s.rects }
      delete rects[id]
      const maximizedRects = { ...s.maximizedRects }
      delete maximizedRects[id]
      return { ...s, openSet, order, activeId, states, rects, maximizedRects }
    })
  }, [])

  const value = useMemo<WindowManagerValue>(
    () => ({
      apps: appMap,
      openSet: state.openSet,
      activeId: state.activeId,
      order: state.order,
      states: state.states,
      rects: state.rects,
      maximizedRects: state.maximizedRects,
      open,
      close,
      minimize,
      restore,
      toggleMaximize,
      focus,
      drag,
      setRect,
      closeActive,
    }),
    [appMap, state, open, close, minimize, restore, toggleMaximize, focus, drag, setRect, closeActive],
  )

  // Test seam for the ambient Playwright driver: lets Slice A exercise open/
  // close/focus scenarios that have no UI until Slice B's icons/Start menu.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const seam = {
      openSet: state.openSet,
      activeId: state.activeId,
      open,
      close,
      minimize,
      restore,
      toggleMaximize,
      focus,
    }
    ;(window as unknown as Record<string, unknown>).__XPMANAGER__ = seam
    return () => {
      delete (window as unknown as Record<string, unknown>).__XPMANAGER__
    }
  }, [state, open, close, minimize, restore, toggleMaximize, focus])

  return (
    <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>
  )
}

// The provider and its consuming hook live in one file, matching the existing
// ThemeContext/AppContext pattern already accepted at the eslint baseline
// (react-refresh/only-export-components is a fast-refresh hint, not a defect).
// eslint-disable-next-line react-refresh/only-export-components
export function useWindowManager(): WindowManagerValue {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) throw new Error('useWindowManager must be used within WindowManagerProvider')
  return ctx
}
