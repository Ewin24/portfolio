import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  CHAPTERS,
  OPENING_CHAPTER,
  applyChapter,
  clearChapter,
  type Chapter,
} from './chapters'

export type ThemeId = 'newspaper' | 'book'

/** Also read by the inline boot script in index.html. Keep both in sync. */
export const THEME_STORAGE_KEY = 'portfolio-theme'

interface ThemeContextValue {
  theme: ThemeId
  toggleTheme: () => void
  /** Current chapter. Meaningless outside the Book theme, never null. */
  chapter: Chapter
  /** True when the visitor asked for less motion — layers must stay still. */
  stillness: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * The handwriting face is only ever painted by the book theme — the insomnia
 * labels are the one place it appears. Loading it from index.html would cost
 * the newspaper theme a font request it never uses, so it is injected the
 * first time the book is opened and then left in place.
 */
const HAND_FONT_ID = 'hand-font'
const HAND_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&display=swap'

function ensureHandFont(): void {
  if (document.getElementById(HAND_FONT_ID)) return

  const link = document.createElement('link')
  link.id = HAND_FONT_ID
  link.rel = 'stylesheet'
  link.href = HAND_FONT_HREF
  document.head.appendChild(link)
}

function readStoredTheme(): ThemeId {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'book'
      ? 'book'
      : 'newspaper'
  } catch {
    // Private mode or blocked storage — the newspaper is the safe default.
    return 'newspaper'
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(readStoredTheme)
  const [observedChapter, setObservedChapter] = useState<Chapter>(OPENING_CHAPTER)
  const [stillness, setStillness] = useState(false)

  /**
   * Derived rather than stored.
   *
   * Leaving the theme, or switching stillness on, both mean "the opening
   * desert is the only chapter". Computing that here instead of writing it
   * back through setState keeps the reset out of the effects entirely —
   * there is no cascading render, and no window where the observed chapter
   * and the active theme disagree.
   */
  const chapter =
    theme !== 'book' || stillness ? OPENING_CHAPTER : observedChapter

  // Track the motion preference live: visitors change it mid-session, and a
  // page full of drifting sand is exactly what that setting is meant to stop.
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

    if (theme === 'book') {
      root.dataset.theme = 'book'
      ensureHandFont()
    } else {
      delete root.dataset.theme
      clearChapter(root)
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Persistence is a nicety; the theme still applies for this session.
    }
  }, [theme])

  /**
   * Chapter tracking.
   *
   * A middle band is carved out of the viewport with rootMargin, so exactly
   * one section owns the light at a time and the handoff happens when that
   * section crosses the centre of the screen — not when it first appears at
   * the bottom edge, which would swap the palette while the previous section
   * is still the one being read.
   *
   * Under reduced motion the page stays frozen on the opening desert. Large
   * luminance swings between chapters are the very thing that setting exists
   * to prevent, and an instant swap would be worse than a slow one.
   *
   * Sections mount immediately — there is no loading gate — but #blog is
   * swapped for a different element later, when its lazy chunk lands.
   * Binding once would miss that swap entirely, so the target set is
   * re-scanned on DOM changes and rebound only when it actually differs.
   */
  useEffect(() => {
    const root = document.documentElement

    if (theme !== 'book') return

    if (stillness) {
      applyChapter(OPENING_CHAPTER, root)
      return
    }

    /** True once the reader has reached the true bottom of the document. */
    let atEnd = false

    let observer: IntersectionObserver | null = null
    let bound: HTMLElement[] = []
    let pending = 0

    const bind = () => {
      const found = CHAPTERS.map((entry) => ({
        entry,
        el: document.getElementById(entry.section),
      })).filter((pair): pair is { entry: Chapter; el: HTMLElement } =>
        pair.el !== null,
      )

      const targets = found.map((pair) => pair.el)
      const unchanged =
        targets.length === bound.length &&
        targets.every((el, i) => el === bound[i])

      if (unchanged || targets.length === 0) return

      observer?.disconnect()
      bound = targets

      observer = new IntersectionObserver(
        (records) => {
          // At the true bottom the last chapter owns the light. #contact
          // still crosses the middle band down there, so without this the
          // observer fires after the end-of-document trigger and takes the
          // chapter straight back to IX — measured: remaining=0 and the
          // ribbon still read "The Letter".
          if (atEnd) return

          const hit = records.find((record) => record.isIntersecting)
          if (!hit) return

          const match = found.find((pair) => pair.el === hit.target)
          if (!match) return

          applyChapter(match.entry, root)
          setObservedChapter(match.entry)
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
      )

      for (const pair of found) observer.observe(pair.el)
    }

    // Coalesce mutation bursts into one rebind per frame.
    const scheduleBind = () => {
      if (pending) return
      pending = requestAnimationFrame(() => {
        pending = 0
        bind()
      })
    }

    // Paint the opening chapter immediately; the observer only reports on the
    // next crossing, which would otherwise leave the first frame unstyled.
    applyChapter(OPENING_CHAPTER, root)
    bind()

    /**
     * The last chapter needs its own trigger.
     *
     * The observer only reports a section that crosses a band carved out of
     * the middle of the viewport, and the footer is 66px tall. Scrolled to
     * the very bottom it sits at 834-900 in a 900px window while the band is
     * 405-495, so it never crosses and chapter X never fires — measured. The
     * book had no ending: the ribbon stayed on IX at the true bottom.
     *
     * Reaching the end of the document IS reaching the last chapter, so that
     * is what triggers it. Only the entry is forced; scrolling back up lets
     * the observer take over again on the next crossing, with no restore
     * logic to keep in sync.
     */
    const LAST = CHAPTERS[CHAPTERS.length - 1]
    let endFrame = 0

    const onScrollEnd = () => {
      cancelAnimationFrame(endFrame)
      endFrame = requestAnimationFrame(() => {
        const doc = document.documentElement
        const remaining = doc.scrollHeight - window.innerHeight - window.scrollY
        const nowAtEnd = remaining <= 4
        if (nowAtEnd === atEnd) return
        atEnd = nowAtEnd
        if (!nowAtEnd) return
        applyChapter(LAST, root)
        setObservedChapter(LAST)
      })
    }

    window.addEventListener('scroll', onScrollEnd, { passive: true })
    onScrollEnd()

    const mutations = new MutationObserver(scheduleBind)
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(pending)
      cancelAnimationFrame(endFrame)
      window.removeEventListener('scroll', onScrollEnd)
      mutations.disconnect()
      observer?.disconnect()
    }
  }, [theme, stillness])

  // Keep the browser UI colour in step with the sky.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (!meta) return
    meta.setAttribute(
      'content',
      theme === 'book' ? chapter.page[1] : '#FAFAF5',
    )
  }, [theme, chapter])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'book' ? 'newspaper' : 'book'))
  }, [])

  const value = useMemo(
    () => ({ theme, toggleTheme, chapter, stillness }),
    [theme, toggleTheme, chapter, stillness],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
