import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { SectionHeader } from '../ui/SectionHeader'

const LANG_ICONS: Record<string, { color: string; icon: string }> = {
  TypeScript: { color: '#3178c6', icon: 'TS' },
  JavaScript: { color: '#f7df1e', icon: 'JS' },
  Python: { color: '#3572A5', icon: 'PY' },
  'C#': { color: '#178600', icon: 'C#' },
  Java: { color: '#b07219', icon: 'JV' },
  PHP: { color: '#4F5D95', icon: 'PH' },
  HTML: { color: '#e34c26', icon: 'HT' },
  CSS: { color: '#563d7c', icon: 'CS' },
  Go: { color: '#00ADD8', icon: 'GO' },
  Kotlin: { color: '#A97BFF', icon: 'KT' },
  Shell: { color: '#89e051', icon: 'SH' },
  Dart: { color: '#00B4AB', icon: 'DT' },
}

const FRAMEWORKS = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Spring Boot', color: '#6DB33F' },
  { name: '.NET', color: '#512BD4' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Vite', color: '#646CFF' },
  { name: 'Tailwind CSS', color: '#06B6D4' },
]

const TOOLS = [
  { name: 'Docker', color: '#2496ED' },
  { name: 'Git', color: '#F05032' },
  { name: 'GitHub', color: '#ffffff' },
  { name: 'VS Code', color: '#007ACC' },
  { name: 'SQL Server', color: '#CC2927' },
  { name: 'Linux', color: '#FCC624' },
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
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <FadeIn>
        <SectionHeader
          id="skills"
          title={t('skills.title')}
          subtitle={t('skills.subtitle')}
        />
      </FadeIn>

      {/* Languages detected from GitHub */}
      <FadeIn delay={0.1}>
        <div className="mb-16">
          <h3 className="text-lg font-semibold text-text-secondary mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
            {t('skills.languages')}
            <span className="text-text-muted text-xs font-normal ml-2">auto-detected from GitHub</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {languages.map(([lang, count], i) => {
              const info = LANG_ICONS[lang]
              const pct = (count / maxCount) * 100
              return (
                <FadeIn key={lang} delay={i * 0.05}>
                  <div className="glass rounded-xl p-4 flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        backgroundColor: `${info?.color || '#888'}20`,
                        color: info?.color || '#888',
                      }}
                    >
                      {info?.icon || lang.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-text-primary">{lang}</span>
                        <span className="text-xs text-text-muted font-mono">{count} repos</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-700 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: info?.color || '#888',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </FadeIn>

      {/* Frameworks & Tools */}
      <div className="grid md:grid-cols-2 gap-12">
        <FadeIn delay={0.2}>
          <div>
            <h3 className="text-lg font-semibold text-text-secondary mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
              {t('skills.frameworks')}
            </h3>
            <div className="flex flex-wrap gap-3">
              {FRAMEWORKS.map((fw) => (
                <span
                  key={fw.name}
                  className="glass glass-hover rounded-xl px-4 py-2 text-sm font-medium text-text-primary transition-all cursor-default"
                  style={{
                    borderColor: `${fw.color}30`,
                  }}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: fw.color }}
                  />
                  {fw.name}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div>
            <h3 className="text-lg font-semibold text-text-secondary mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-pink" />
              {t('skills.tools')}
            </h3>
            <div className="flex flex-wrap gap-3">
              {TOOLS.map((tool) => (
                <span
                  key={tool.name}
                  className="glass glass-hover rounded-xl px-4 py-2 text-sm font-medium text-text-primary transition-all cursor-default"
                  style={{
                    borderColor: `${tool.color}30`,
                  }}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: tool.color }}
                  />
                  {tool.name}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
