import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { SectionHeader } from '../ui/SectionHeader'

interface TimelineEvent {
  year: number
  label: string
  labelEn: string
  repos: number
  topLangs: string[]
}

export function Experience() {
  const { repos } = useApp()
  const { t, lang } = useTranslation()

  const timeline = useMemo(() => {
    const yearMap = new Map<number, { count: number; langs: Map<string, number> }>()

    for (const repo of repos) {
      const year = new Date(repo.created_at).getFullYear()
      if (!yearMap.has(year)) {
        yearMap.set(year, { count: 0, langs: new Map() })
      }
      const entry = yearMap.get(year)!
      entry.count++
      if (repo.language) {
        entry.langs.set(repo.language, (entry.langs.get(repo.language) || 0) + 1)
      }
    }

    const events: TimelineEvent[] = []
    const sortedYears = [...yearMap.keys()].sort()

    for (const year of sortedYears) {
      const data = yearMap.get(year)!
      const topLangs = [...data.langs.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([lang]) => lang)

      events.push({
        year,
        label: `${data.count} proyectos creados`,
        labelEn: `${data.count} projects created`,
        repos: data.count,
        topLangs,
      })
    }

    return events.reverse()
  }, [repos])

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <FadeIn>
        <SectionHeader
          id="experience"
          title={t('experience.title')}
          subtitle={t('experience.subtitle')}
        />
      </FadeIn>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan/50 via-neon-purple/50 to-transparent" />

        {timeline.map((event, i) => (
          <FadeIn key={event.year} delay={i * 0.1}>
            <div
              className={`relative flex items-center mb-12 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Dot */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-neon-cyan neon-glow z-10" />

              {/* Content */}
              <div
                className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                  i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:ml-auto'
                }`}
              >
                <div className="glass rounded-xl p-5 glass-hover transition-all">
                  <span className="text-neon-cyan font-mono text-sm font-bold">
                    {event.year}
                  </span>
                  <p className="text-text-primary font-medium mt-1">
                    {lang === 'es' ? event.label : event.labelEn}
                  </p>
                  {event.topLangs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 justify-start">
                      {event.topLangs.map((l) => (
                        <span
                          key={l}
                          className="text-xs px-2 py-0.5 rounded-full bg-surface-700 text-text-muted"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
