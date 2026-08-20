import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemeId = 'newspaper' | 'xp'

/** Also read by the inline boot script in index.html. Keep both in sync. */
export const THEME_STORAGE_KEY = 'portfolio-theme'

interface ThemeContextValue {
  theme: ThemeId
  toggleTheme: () => void
  /** True when the visitor asked for less motion — layers must stay still. */
  stillness: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): ThemeId {
  try {
    // Only an explicit 'xp' is honoured. Any other stored value — including a
    // stale 'book' left behind by the old theme — falls back to the newspaper.
    return localStorage.getItem(THEME_STORAGE_KEY) === 'xp'
      ? 'xp'
      : 'newspaper'
  } catch {
    // Private mode or blocked storage — the newspaper is the safe default.
    return 'newspaper'
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(readStoredTheme)
  const [stillness, setStillness] = useState(false)

  // Track the motion preference live: visitors change it mid-session, and the
  // XP layers must obey it the moment they flip.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setStillness(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  // Reflect the theme onto <html> and persist it.
  useEffect(() => {
    const root = document.documentElement

    if (theme === 'xp') {
      root.dataset.theme = 'xp'
    } else {
      delete root.dataset.theme
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Persistence is a nicety; the theme still applies for this session.
    }
  }, [theme])

  // Keep the browser UI colour in step with the current theme.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (!meta) return
    meta.setAttribute('content', theme === 'xp' ? '#3a6ea5' : '#FAFAF5')
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'xp' ? 'newspaper' : 'xp'))
  }, [])

  const value = useMemo(
    () => ({ theme, toggleTheme, stillness }),
    [theme, toggleTheme, stillness],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
