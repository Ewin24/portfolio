import { Star, GitFork, ExternalLink, Code2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { getFeaturedRepos } from '../../services/github'
import { FadeIn } from '../ui/FadeIn'
import { SectionHeader } from '../ui/SectionHeader'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  'C#': '#178600',
  Java: '#b07219',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Go: '#00ADD8',
  Rust: '#dea584',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Dart: '#00B4AB',
  Ruby: '#701516',
  Shell: '#89e051',
}

export function Projects() {
  const { repos } = useApp()
  const { t } = useTranslation()
  const featured = getFeaturedRepos(repos)

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <FadeIn>
        <SectionHeader
          id="projects"
          title={t('projects.title')}
          subtitle={t('projects.subtitle')}
        />
      </FadeIn>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((repo, i) => (
          <FadeIn key={repo.id} delay={i * 0.1}>
            <article className="group glass glass-hover rounded-2xl p-6 h-full flex flex-col transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <Code2 className="text-neon-cyan shrink-0" size={20} />
                <div className="flex items-center gap-3 text-text-muted text-xs">
                  {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Star size={12} /> {repo.stargazers_count}
                    </span>
                  )}
                  {repo.forks_count > 0 && (
                    <span className="flex items-center gap-1">
                      <GitFork size={12} /> {repo.forks_count}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-neon-cyan transition-colors">
                {repo.name}
              </h3>

              <p className="text-text-secondary text-sm flex-1 mb-4 leading-relaxed">
                {repo.description || t('projects.noDescription')}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-600/30">
                {repo.language && (
                  <span className="flex items-center gap-1.5 text-xs text-text-muted">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: LANG_COLORS[repo.language] || '#888' }}
                    />
                    {repo.language}
                  </span>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neon-purple hover:text-neon-pink transition-colors flex items-center gap-1"
                    >
                      {t('projects.viewDemo')} <ExternalLink size={10} />
                    </a>
                  )}
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-text-muted hover:text-neon-cyan transition-colors flex items-center gap-1"
                  >
                    {t('projects.viewRepo')} <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.3}>
        <div className="text-center mt-12">
          <a
            href="https://github.com/Ewin24?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass glass-hover text-text-secondary hover:text-neon-cyan font-medium transition-all"
          >
            {t('projects.viewAll')} <ExternalLink size={16} />
          </a>
        </div>
      </FadeIn>
    </section>
  )
}
