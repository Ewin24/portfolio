import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { useBlogContext } from '../context/BlogContext'
import { applyBlogFilters } from '../hooks/useBlogFilters'
import { TAB_CATEGORY, tabOf, type BlogTab } from '../types'

const TABS: { key: BlogTab; es: string; en: string }[] = [
  { key: 'all', es: 'Todos', en: 'All' },
  { key: 'essays', es: 'Ensayos', en: 'Essays' },
  { key: 'technical', es: 'Técnico', en: 'Technical' },
]

/**
 * One blog, three tabs. A tab is the category filter (essays are the essay
 * category, technical is everything else), so it composes with the tags, the
 * dates, the unread toggle and the search like any other filter. The panel is
 * everything the tab narrows: filters, search and list.
 */
export function BlogTabs({ children }: { children: ReactNode }) {
  const { lang } = useTranslation()
  const { posts, filter, setFilter, setPage } = useBlogContext()
  const active = tabOf(filter.category)
  const refs = useRef<Partial<Record<BlogTab, HTMLButtonElement | null>>>({})

  const select = (tab: BlogTab) => {
    setFilter({ ...filter, category: TAB_CATEGORY[tab] })
    setPage(1)
  }

  // Arrow keys move through the tabs and select as they go; Home and End jump.
  const onKeyDown = (event: KeyboardEvent) => {
    const at = TABS.findIndex((t) => t.key === active)
    const to = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: TABS.length - 1 }[event.key]
    if (to === undefined) return
    event.preventDefault()
    const next = TABS[(to + TABS.length) % TABS.length].key
    select(next)
    refs.current[next]?.focus()
  }

  return (
    <div className="blogfront">
      <div
        role="tablist"
        data-blog-tabs
        aria-label={lang === 'es' ? 'Tipo de texto' : 'Kind of writing'}
        className="blogfront-tabs"
        onKeyDown={onKeyDown}
      >
        {TABS.map((tab) => {
          const selected = tab.key === active
          const count = applyBlogFilters(posts, { tags: [], category: TAB_CATEGORY[tab.key], dateRange: null }).length
          return (
            <button
              key={tab.key}
              ref={(el) => { refs.current[tab.key] = el }}
              type="button"
              role="tab"
              id={`blogfront-tab-${tab.key}`}
              data-blog-tab={tab.key}
              aria-selected={selected}
              aria-controls="blogfront-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.key)}
              className="blogfront-tab"
            >
              {tab[lang]}
              <span className="blogfront-tab-count">{count}</span>
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id="blogfront-panel" aria-labelledby={`blogfront-tab-${active}`}>
        {children}
      </div>
    </div>
  )
}
