import { useEffect, useLayoutEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { useTheme } from '../../theme/ThemeContext'

/**
 * Reading mode for the article page: hides the site chrome, narrows the
 * column and lets the reader pick a text size.
 *
 * The state lives on <html> (`data-reading="on"`, `data-reading-size="1|2|3"`)
 * so `src/styles/reading.css` can reach chrome this component does not own.
 * The choice is remembered, but the attributes are only present while an
 * article is open — leaving it always gives the chrome back.
 * Storage is guarded the same way `readState.ts` is: never a thrown error.
 */

const MODE_KEY = 'portfolio-reading-mode'
const SIZE_KEY = 'portfolio-reading-size'

const SIZES = ['1', '2', '3'] as const
type Size = (typeof SIZES)[number]

const SIZE_LABELS: Record<Size, { es: string; en: string; glyph: string }> = {
  '1': { es: 'Texto pequeño', en: 'Small text', glyph: 'text-xs' },
  '2': { es: 'Texto mediano', en: 'Medium text', glyph: 'text-sm' },
  '3': { es: 'Texto grande', en: 'Large text', glyph: 'text-lg' },
}

function stored(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function store(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Persistence is a nicety; the choice still holds for this session.
  }
}

const onArticle = () => /^#\/?blog\/article\//.test(window.location.hash)

const BUTTON =
  'reading-btn hit-44 bg-paper border-2 border-rule font-mono font-bold text-ink hover:bg-ink hover:text-paper aria-pressed:bg-ink aria-pressed:text-paper cursor-pointer'

export function ReadingModeToggle() {
  const { lang } = useTranslation()
  const { theme } = useTheme()
  const [on, setOn] = useState(() => stored(MODE_KEY) === 'on')
  const [size, setSize] = useState<Size>(() => {
    const saved = stored(SIZE_KEY)
    return SIZES.find((s) => s === saved) ?? '2'
  })

  // The XP theme has its own window chrome; reading mode is not offered there.
  const active = theme !== 'xp' && on

  // Layout effect, so a remembered reading mode never paints the chrome first.
  useLayoutEffect(() => {
    const root = document.documentElement
    const apply = () => {
      if (active && onArticle()) {
        root.dataset.reading = 'on'
        root.dataset.readingSize = size
      } else {
        delete root.dataset.reading
        delete root.dataset.readingSize
      }
    }
    apply()
    window.addEventListener('hashchange', apply)
    window.addEventListener('popstate', apply)
    return () => {
      window.removeEventListener('hashchange', apply)
      window.removeEventListener('popstate', apply)
      // Unmounted because the reader left the article: give the chrome back.
      // (Prev/next remounts this while still on an article; leave it alone.)
      if (!onArticle()) {
        delete root.dataset.reading
        delete root.dataset.readingSize
      }
    }
  }, [active, size])

  const setMode = (next: boolean) => {
    setOn(next)
    store(MODE_KEY, next ? 'on' : 'off')
  }

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        setOn(false)
        store(MODE_KEY, 'off')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  if (theme === 'xp') return null

  const es = lang === 'es'

  return (
    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2 ml-auto">
      {on && (
        <div role="group" aria-label={es ? 'Tamaño del texto' : 'Text size'} className="flex gap-1.5">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              data-reading-size-btn={s}
              aria-pressed={size === s}
              onClick={() => {
                setSize(s)
                store(SIZE_KEY, s)
              }}
              className={`${BUTTON} w-8 h-8 flex items-center justify-center`}
            >
              <span aria-hidden="true" className={SIZE_LABELS[s].glyph}>A</span>
              <span className="sr-only">{SIZE_LABELS[s][lang]}</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        data-reading-toggle
        aria-pressed={on}
        onClick={() => setMode(!on)}
        className={`${BUTTON} h-8 px-3 flex items-center gap-1.5 text-[11px] uppercase tracking-widest`}
      >
        <BookOpen size={12} aria-hidden="true" />
        {es ? 'Modo lectura' : 'Reading mode'}
      </button>

      {on && (
        <span className="font-mono text-[11px] text-ink-muted uppercase tracking-wider">
          {es ? 'Esc para salir' : 'Esc to exit'}
        </span>
      )}
    </div>
  )
}
