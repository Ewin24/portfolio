import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { useBlogContext } from '../context/BlogContext'
import type { BlogTag } from '../types'

// ─── Tag definitions (themed) ──────────────────────────────────────────────

const BLOG_TAGS: BlogTag[] = [
  { name: 'arquitectura', label: 'Arquitectura', labelEn: 'Architecture', color: 'red' },
  { name: '.NET', label: '.NET', labelEn: '.NET', color: 'blue' },
  { name: 'clean architecture', label: 'Clean Architecture', labelEn: 'Clean Architecture', color: 'green' },
  { name: 'DDD', label: 'DDD', labelEn: 'DDD', color: 'purple' },
  { name: 'patrones', label: 'Patrones', labelEn: 'Patterns', color: 'orange' },
  { name: 'C#', label: 'C#', labelEn: 'C#', color: 'blue' },
  { name: 'design patterns', label: 'Design Patterns', labelEn: 'Design Patterns', color: 'green' },
]

const CATEGORIES = ['arquitectura']

// ─── Component ─────────────────────────────────────────────────────────────

export function BlogFilters() {
  const { lang } = useTranslation()
  const { filter, setFilter, clearFilters } = useBlogContext()
  const [showCategory, setShowCategory] = useState(false)
  const [showDateRange, setShowDateRange] = useState(false)

  const activeCount = (filter.tags?.length ?? 0) + (filter.category ? 1 : 0) + (filter.dateRange ? 1 : 0)

  // ─── Tag toggle ──────────────────────────────────────────────────────────
  const handleTagToggle = (tagName: string) => {
    const current = filter.tags ?? []
    const next = current.includes(tagName)
      ? current.filter((t) => t !== tagName)
      : [...current, tagName]
    setFilter({ ...filter, tags: next })
  }

  // ─── Category select ─────────────────────────────────────────────────────
  const handleCategorySelect = (cat: string | null) => {
    setFilter({ ...filter, category: cat })
    setShowCategory(false)
  }

  // ─── Date range ──────────────────────────────────────────────────────────
  const handleDateStart = (value: string) => {
    setFilter({
      ...filter,
      dateRange: { start: value, end: filter.dateRange?.end ?? '' },
    })
  }

  const handleDateEnd = (value: string) => {
    setFilter({
      ...filter,
      dateRange: { start: filter.dateRange?.start ?? '', end: value },
    })
  }

  const clearDateRange = () => {
    setFilter({ ...filter, dateRange: null })
    setShowDateRange(false)
  }

  // ─── Get tag info ────────────────────────────────────────────────────────
  const getTagInfo = (name: string) =>
    BLOG_TAGS.find((t) => t.name === name) ?? {
      name,
      label: name,
      labelEn: name,
      color: 'purple' as const,
    }

  return (
    <div className="mb-8">
      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {filter.tags?.map((tag) => {
            const info = getTagInfo(tag)
            const label = lang === 'es' ? info.label : info.labelEn
            return (
              <motion.span
                key={`tag-${tag}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="skill-tag text-[10px] flex items-center gap-1.5 pr-1"
              >
                {label}
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="hover:text-accent transition-colors cursor-pointer"
                  aria-label={`Remove ${label} filter`}
                >
                  <X size={10} />
                </button>
              </motion.span>
            )
          })}

          {filter.category && (
            <motion.span
              key="cat-chip"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="skill-tag text-[10px] flex items-center gap-1.5 pr-1"
            >
              {filter.category}
              <button
                onClick={() => handleCategorySelect(null)}
                className="hover:text-accent transition-colors cursor-pointer"
                aria-label="Remove category filter"
              >
                <X size={10} />
              </button>
            </motion.span>
          )}

          {filter.dateRange && (
            <motion.span
              key="date-chip"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="skill-tag text-[10px] flex items-center gap-1.5 pr-1"
            >
              {filter.dateRange.start} – {filter.dateRange.end}
              <button
                onClick={clearDateRange}
                className="hover:text-accent transition-colors cursor-pointer"
                aria-label="Remove date range filter"
              >
                <X size={10} />
              </button>
            </motion.span>
          )}

          {/* Clear all */}
          <button
            onClick={clearFilters}
            className="font-mono text-[9px] uppercase tracking-wider text-accent hover:text-accent-dark underline transition-colors cursor-pointer"
          >
            {lang === 'es' ? 'Limpiar todo' : 'Clear all'}
          </button>
        </div>
      )}

      {/* Filter controls row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Tag chips */}
        <div className="flex flex-wrap gap-1.5">
          {BLOG_TAGS.map((tag) => {
            const isActive = filter.tags?.includes(tag.name) ?? false
            const label = lang === 'es' ? tag.label : tag.labelEn
            return (
              <button
                key={tag.name}
                onClick={() => handleTagToggle(tag.name)}
                className={`
                  skill-tag text-[10px] cursor-pointer transition-all duration-75
                  ${isActive ? 'bg-ink text-paper hover:bg-ink hover:text-paper' : ''}
                `}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Category dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowCategory(!showCategory); setShowDateRange(false) }}
            className="skill-tag text-[10px] flex items-center gap-1 cursor-pointer"
          >
            {filter.category
              ? filter.category
              : lang === 'es'
                ? 'Categoría'
                : 'Category'}
            <ChevronDown size={10} />
          </button>

          <AnimatePresence>
            {showCategory && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-1 z-20 border-2 border-ink bg-paper shadow-pixel-sm min-w-[140px]"
              >
                <button
                  onClick={() => handleCategorySelect(null)}
                  className="block w-full text-left font-mono text-[10px] px-3 py-2 hover:bg-paper-dark transition-colors cursor-pointer"
                >
                  {lang === 'es' ? 'Todas' : 'All'}
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`block w-full text-left font-mono text-[10px] px-3 py-2 hover:bg-paper-dark transition-colors cursor-pointer ${filter.category === cat ? 'bg-ink text-paper' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Date range toggle */}
        <div className="relative">
          <button
            onClick={() => { setShowDateRange(!showDateRange); setShowCategory(false) }}
            className="skill-tag text-[10px] flex items-center gap-1 cursor-pointer"
          >
            {filter.dateRange
              ? `${filter.dateRange.start} – ${filter.dateRange.end}`
              : lang === 'es'
                ? 'Fechas'
                : 'Dates'}
          </button>

          <AnimatePresence>
            {showDateRange && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-1 z-20 border-2 border-ink bg-paper shadow-pixel-sm p-3 flex flex-col gap-2"
              >
                <label className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">
                  {lang === 'es' ? 'Desde' : 'From'}
                </label>
                <input
                  type="date"
                  value={filter.dateRange?.start ?? ''}
                  onChange={(e) => handleDateStart(e.target.value)}
                  className="border-2 border-ink bg-paper-dark font-mono text-[10px] px-2 py-1"
                />
                <label className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">
                  {lang === 'es' ? 'Hasta' : 'To'}
                </label>
                <input
                  type="date"
                  value={filter.dateRange?.end ?? ''}
                  onChange={(e) => handleDateEnd(e.target.value)}
                  className="border-2 border-ink bg-paper-dark font-mono text-[10px] px-2 py-1"
                />
                {filter.dateRange && (
                  <button
                    onClick={clearDateRange}
                    className="font-mono text-[9px] text-accent hover:text-accent-dark underline mt-1 cursor-pointer"
                  >
                    {lang === 'es' ? 'Limpiar' : 'Clear'}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
