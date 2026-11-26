import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export type ThemeId = 'newspaper' | 'xp' | 'dark'

/** Also read by the inline boot script in index.html. Keep both in sync. */
export const THEME_STORAGE_KEY = 'portfolio-theme'

/** Browser UI colour per theme. Dark must match --color-paper in src/styles/dark.css. */
const THEME_COLOR: Record<ThemeId, string> = {
  newspaper: '#FAFAF5',
  dark: '#1A1815',
  xp: '#3a6ea5',
}

interface ThemeContextValue {
  theme: ThemeId
  /** Newspaper ⇄ XP. Leaving XP returns to the newspaper variant it was entered from. */
  toggleTheme: () => void
  /** Light ⇄ dark newspaper. */
  toggleDark: () => void
  /** True when the visitor asked for less motion — layers must stay still. */
  stillness: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/** The newspaper variant the system asks for; used only while nothing is stored. */
function preferredPaper(): ThemeId {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'newspaper'
}

function readStoredTheme(): ThemeId {
  let stored: string | null = null
  try {
    stored = localStorage.getItem(THEME_STORAGE_KEY)
  } catch {
    // Private mode or blocked storage — fall through to the system preference.
  }
  // Only the three known ids are honoured. Any other stored value — including
  // a stale 'book' left behind by the old theme — counts as no choice at all.
  if (stored === 'xp' || stored === 'dark' || stored === 'newspaper') {
    return stored
  }
  return preferredPaper()
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(readStoredTheme)
  const [stillness, setStillness] = useState(false)
  // The newspaper variant to come back to when the visitor leaves XP.
  const paper = useRef<ThemeId>(theme === 'xp' ? preferredPaper() : theme)

  // Track the motion preference live: visitors change it mid-session, and the
  // XP layers must obey it the moment they flip.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setStillness(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  // Reflect the theme onto <html>. The light newspaper is the bare document.
  useEffect(() => {
    const root = document.documentElement

    if (theme === 'newspaper') {
      delete root.dataset.theme
    } else {
      root.dataset.theme = theme
    }
  }, [theme])

  // Keep the browser UI colour in step with the current theme.
  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[theme])
  }, [theme])

  // Only an explicit choice is persisted. Storing on mount would freeze the
  // system preference into a "choice" the visitor never made.
  const choose = useCallback((next: ThemeId) => {
    if (next !== 'xp') paper.current = next
    setTheme(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Persistence is a nicety; the theme still applies for this session.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    choose(theme === 'xp' ? paper.current : 'xp')
  }, [choose, theme])

  const toggleDark = useCallback(() => {
    choose(theme === 'dark' ? 'newspaper' : 'dark')
  }, [choose, theme])

  const value = useMemo(
    () => ({ theme, toggleTheme, toggleDark, stillness }),
    [theme, toggleTheme, toggleDark, stillness],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- the hook lives next to its provider
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
