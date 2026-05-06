import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'

const LANG_ICONS: Record<string, { color: string; icon: string }> = {
  TypeScript:  { color: '#3178c6', icon: 'TS' },
  JavaScript:  { color: '#b07219', icon: 'JS' },
  Python:      { color: '#3572A5', icon: 'PY' },
  'C#':        { color: '#178600', icon: 'C#' },
  Java:        { color: '#b07219', icon: 'JV' },
  PHP:         { color: '#4F5D95', icon: 'PH' },
  HTML:        { color: '#e34c26', icon: 'HT' },
  CSS:         { color: '#563d7c', icon: 'CS' },
  Go:          { color: '#00ADD8', icon: 'GO' },
  Kotlin:      { color: '#A97BFF', icon: 'KT' },
  Shell:       { color: '#4A4A4A', icon: 'SH' },
  Dart:        { color: '#00B4AB', icon: 'DT' },
}

const FRAMEWORKS = [
  'React', 'Spring Boot', '.NET / C#', 'Node.js',
  'Vite', 'Tailwind CSS', 'TypeScript', 'REST APIs',
]

const TOOLS = [
  'Docker', 'Git', 'GitHub Actions', 'SQL Server',
  'PostgreSQL', 'Redis', 'Azure', 'Linux',
]

export function Skills() {
  const { repos } = useApp()
  const { t } = useTranslation()

  const languages = useMemo(() => {
    const langMap = new Map<string, number>()
    for (const repo of repos) {
      if (repo.language) {
        langMap.set(repo.language, (langMap.get(repo.language) || 0) + 1)
      }
    }
    return [...langMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
  }, [repos])

  const maxCount = languages.length > 0 ? languages[0][1] : 1

  return (
    <section id="skills" className="py-20 px-6 max-w-7xl mx-auto">
      <FadeIn>
        <div className="mb-10">
          <div className="border-t-4 border-ink mb-1" />
          <div className="border-t border-ink mb-4" />
          <h2 className="font-headline text-4xl md:text-5xl font-black text-ink leading-none">
            {t('skills.title')}
          </h2>
          <p className="font-mono text-xs text-ink-muted mt-2">
            {t('skills.subtitle')}
          </p>
          <div className="border-t-4 border-ink mt-4" />
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-3 border-2 border-ink shadow-pixel">

        {/* Columna 1: Lenguajes (desde GitHub) */}
        <div className="border-b-2 md:border-b-0 md:border-r-2 border-ink p-6">
          <FadeIn delay={0.1}>
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-4 pb-2 border-b border-rule-light">
              {t('skills.languages')}
            </h3>
            <p className="font-mono text-[9px] text-ink-muted italic mb-4">
              {t('skills.activity')}
            </p>
            <div className="space-y-3">
              {languages.map(([lang, count], i) => {
                const info = LANG_ICONS[lang]
                const pct  = (count / maxCount) * 100
                return (
                  <FadeIn key={lang} delay={i * 0.04}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 border-2 border-ink flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${info?.color || '#888'}18` }}
                      >
                        <span
                          className="font-mono text-[9px] font-bold"
                          style={{ color: info?.color || '#888' }}
                        >
                          {info?.icon || lang.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <span className="font-mono text-xs font-medium text-ink">{lang}</span>
                          <span className="font-mono text-[10px] text-ink-muted">{count}</span>
                        </div>
                        <div className="h-1.5 border border-ink bg-paper-dark overflow-hidden">
                          <div
                            className="h-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: info?.color || '#1A1A1A',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                )
              })}
            </div>
          </FadeIn>
        </div>

        {/* Columna 2: Frameworks */}
        <div className="border-b-2 md:border-b-0 md:border-r-2 border-ink p-6">
          <FadeIn delay={0.2}>
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-4 pb-2 border-b border-rule-light">
              {t('skills.frameworks')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {FRAMEWORKS.map((fw) => (
                <span key={fw} className="skill-tag">{fw}</span>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Columna 3: Tools */}
        <div className="p-6">
          <FadeIn delay={0.3}>
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-4 pb-2 border-b border-rule-light">
              {t('skills.tools')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {TOOLS.map((tool) => (
                <span key={tool} className="skill-tag">{tool}</span>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
