import type { CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'
import { ExternalLink, Lock, GitFork, Star, Code2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { useTheme } from '../../theme/ThemeContext'
import { getFeaturedRepos } from '../../services/github'
import { Crucible } from '../book/Crucible'
import { VoxelFigure } from '../book/VoxelFigure'
import { alembicModel } from '../book/voxelModels'
import { FadeIn } from '../ui/FadeIn'
import { SectionOpening } from '../ui/SectionOpening'
import { featuredCaseStudies } from '../../content'
import type { CaseStudy } from '../../types'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3572A5',
  'C#': '#178600', Java: '#b07219', PHP: '#4F5D95',
  HTML: '#e34c26', CSS: '#563d7c', Go: '#00ADD8',
  Rust: '#dea584', Kotlin: '#A97BFF', Shell: '#89e051',
}

// ─── Case Study Card ────────────────────────────────────────────────────────
function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const { lang } = useTranslation()
  const { t } = useTranslation()
  const { theme, stillness } = useTheme()
  const reduceMotion = useReducedMotion()

  const title    = lang === 'es' ? study.title    : study.titleEn
  const role     = lang === 'es' ? study.role     : study.roleEn
  const problem  = lang === 'es' ? study.problem  : study.problemEn
  const solution = lang === 'es' ? study.solution : study.solutionEn
  const impact   = lang === 'es' ? study.impact   : study.impactEn

  const companyLabel = study.companyAnon
    ? (lang === 'es' ? 'Cliente Confidencial' : 'Confidential Client')
    : study.company

  return (
    <FadeIn delay={index * 0.1}>
      <article className="border-2 border-rule bg-paper shadow-pixel hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75 flex flex-col h-full">

        {/* Header del artículo */}
        <div className="border-b-2 border-rule p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              {study.featured && (
                <span className="kicker">{t('projects.featured')}</span>
              )}
              <h3 className="font-headline text-xl font-bold text-ink leading-tight">
                {title}
              </h3>
            </div>
            {study.hasNDA && (
              <span className="shrink-0 flex items-center gap-1 border border-ink-muted px-2 py-0.5 font-mono text-[10px] text-ink-muted uppercase tracking-wide">
                <Lock size={8} /> NDA
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            <span className="font-mono text-xs text-ink-light font-medium">{companyLabel}</span>
            {study.industry && (
              <>
                <span className="text-rule-light font-mono text-xs">·</span>
                <span className="font-mono text-xs text-ink-muted">{study.industry}</span>
              </>
            )}
            <span className="text-rule-light font-mono text-xs">·</span>
            <span className="font-mono text-xs text-ink-muted">{study.period}</span>
          </div>
          <p className="font-mono text-xs text-ink-muted mt-1 italic">{role}</p>
        </div>

        {/* Body del artículo */}
        <div className="p-5 flex-1 flex flex-col gap-4">

          {/* Problema → Solución. En el libro es una transmutación. */}
          <Crucible
            active={theme === 'book'}
            still={Boolean(reduceMotion) || stillness}
            beforeLabel={t('projects.problem')}
            afterLabel={t('projects.solution')}
            before={
              <p className="font-sans text-sm text-ink-light leading-relaxed line-clamp-3">
                {problem}
              </p>
            }
            after={
              <p className="font-sans text-sm text-ink-light leading-relaxed line-clamp-3">
                {solution}
              </p>
            }
          />

          {/* Impacto */}
          <div className="border-l-4 border-rule pl-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
              {t('projects.impact')}
            </p>
            <p className="font-sans text-sm font-semibold text-ink leading-snug">
              {impact}
            </p>
          </div>

          {/* Architecture Diagram (si existe) */}
          {study.architectureDiagram && (
            <div className="border border-rule-light p-3 bg-paper-dark">
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-ink-muted mb-1">
                {t('projects.architecture')}
              </p>
              <p className="font-mono text-[10px] text-ink-light leading-relaxed">
                {study.architectureDiagram}
              </p>
            </div>
          )}
        </div>

        {/* Footer: stack + links */}
        <div className="border-t-2 border-rule-light p-4 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {study.stack.slice(0, 4).map((tech) => (
              <span key={tech} className="skill-tag text-[10px]">{tech}</span>
            ))}
            {study.stack.length > 4 && (
              <span className="font-mono text-[10px] text-ink-muted self-center">
                +{study.stack.length - 4}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {study.demoUrl && (
              <a href={study.demoUrl} target="_blank" rel="noopener noreferrer"
                className="font-mono text-[10px] font-bold uppercase tracking-wide text-accent hover:text-accent-dark flex items-center gap-1 transition-colors"
              >
                {t('projects.viewDemo')} <ExternalLink size={10} />
              </a>
            )}
            {study.githubUrl && (
              <a href={study.githubUrl} target="_blank" rel="noopener noreferrer"
                className="font-mono text-[10px] font-bold uppercase tracking-wide text-ink-light hover:text-ink flex items-center gap-1 transition-colors"
              >
                {t('projects.viewRepo')} <ExternalLink size={10} />
              </a>
            )}
            {study.hasNDA && !study.githubUrl && (
              <span className="font-mono text-[10px] text-ink-muted flex items-center gap-1">
                <Lock size={9} /> {lang === 'es' ? 'Privado' : 'Private'}
              </span>
            )}
          </div>
        </div>

        {/* NDA disclaimer */}
        {study.hasNDA && (
          <div className="border-t border-rule-light px-4 py-2 bg-paper-dark">
            <p className="font-mono text-[10px] text-ink-muted italic">
              {t('projects.nda')}
            </p>
          </div>
        )}
      </article>
    </FadeIn>
  )
}

// ─── GitHub Activity Widget (secundario) ────────────────────────────────────
function GitHubActivityWidget() {
  const { repos } = useApp()
  const { t } = useTranslation()
  const recent = getFeaturedRepos(repos).slice(0, 4)

  return (
    <div className="border-2 border-rule p-6 shadow-pixel bg-paper">
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-rule">
        <h3 className="font-headline text-lg font-bold">{t('projects.github')}</h3>
        <a
          href="https://github.com/Ewin24"
          target="_blank" rel="noopener noreferrer"
          className="font-mono text-[10px] font-bold uppercase tracking-wide text-ink-light hover:text-ink flex items-center gap-1 transition-colors"
        >
          {t('projects.viewAll')} <ExternalLink size={10} />
        </a>
      </div>

      <div className="space-y-3">
        {recent.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank" rel="noopener noreferrer"
            className="flex items-start gap-3 group py-2 border-b border-rule-light last:border-0"
          >
            <Code2 size={14} className="text-ink-muted mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs font-bold text-ink group-hover:text-accent transition-colors truncate">
                {repo.name}
              </p>
              {repo.description && (
                <p className="font-sans text-xs text-ink-muted mt-0.5 line-clamp-1">
                  {repo.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0 text-ink-muted">
              {repo.language && (
                <span className="flex items-center gap-1">
                  <span className="tech-dot w-2 h-2 inline-block" style={{ '--tech': LANG_COLORS[repo.language] || '#888' } as CSSProperties} />
                  <span className="font-mono text-[10px]">{repo.language}</span>
                </span>
              )}
              {repo.stargazers_count > 0 && (
                <span className="flex items-center gap-0.5 font-mono text-[10px]">
                  <Star size={9} /> {repo.stargazers_count}
                </span>
              )}
              {repo.forks_count > 0 && (
                <span className="flex items-center gap-0.5 font-mono text-[10px]">
                  <GitFork size={9} /> {repo.forks_count}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

// ─── Section ────────────────────────────────────────────────────────────────
export function Projects() {
  const { t, lang } = useTranslation()
  const { theme, stillness } = useTheme()
  const reduceMotion = useReducedMotion()

  return (
    <section id="projects" className="py-20 px-6 max-w-7xl mx-auto">

      {/* Section header estilo periódico */}
      <FadeIn>
        <SectionOpening
          section="projects"
          title={t('projects.title')}
          subtitle={t('projects.subtitle')}
          align="beside"
        />

        {/* Melquíades' alembic: the vessel the workshop actually works in. */}
        <div className="flex justify-center">
          <VoxelFigure
            build={alembicModel}
            active={theme === 'book'}
            still={Boolean(reduceMotion) || stillness}
            label={
              lang === 'es'
                ? 'Alambique: arrástralo para girarlo, presiónalo para verterlo'
                : 'Alembic: drag to turn it, press to pour it'
            }
            hint={lang === 'es' ? 'viértelo' : 'pour it'}
          />
        </div>
      </FadeIn>

      {/* Case Studies grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {featuredCaseStudies.map((study, i) => (
          <CaseStudyCard key={study.id} study={study} index={i} />
        ))}
      </div>

      {/* GitHub Activity — sección secundaria */}
      <FadeIn delay={0.2}>
        <div className="border-t-2 border-rule-light pt-10">
          <div className="max-w-2xl">
            <GitHubActivityWidget />
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
