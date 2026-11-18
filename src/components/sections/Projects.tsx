import { useEffect, type CSSProperties } from 'react'
import { ExternalLink, Lock, GitFork, Star, Code2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { getFeaturedRepos } from '../../services/github'
import { FadeIn } from '../ui/FadeIn'
import { SectionOpening } from '../ui/SectionOpening'
import { caseOutcomes, featuredCaseStudies } from '../../content/case-studies'
import { periodLabel } from '../../lib/text'
import type { CaseStudy } from '../../types'

/**
 * The section reads as a newspaper page, not a wall of equal cards: one lead
 * story, two secondaries, and every other case as a one-line brief that opens
 * in place. Nothing is clamped: each case states one whole outcome sentence
 * (`caseOutcomes`) and keeps its full problem, solution and impact behind a
 * native disclosure, in the DOM whether it is open or not. Layout and type
 * live in src/styles/cases.css and follow the container's width, so the same
 * markup fits an XP window.
 */

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3572A5',
  'C#': '#178600', Java: '#b07219', PHP: '#4F5D95',
  HTML: '#e34c26', CSS: '#563d7c', Go: '#00ADD8',
  Rust: '#dea584', Kotlin: '#A97BFF', Shell: '#89e051',
}

// ─── Case study parts ───────────────────────────────────────────────────────
interface CaseProps { study: CaseStudy }

/** Company, industry and period on one line. */
function CaseMeta({ study }: CaseProps) {
  const { lang } = useTranslation()
  const company = study.companyAnon
    ? (lang === 'es' ? 'Cliente Confidencial' : 'Confidential Client')
    : study.company
  return (
    <p className="case-meta">
      {[company, study.industry, periodLabel(study.period, lang)].filter(Boolean).join(' · ')}
    </p>
  )
}

/** The one sentence a reader takes away without opening the case. */
function CaseOutcome({ study }: CaseProps) {
  const { lang } = useTranslation()
  const outcome = caseOutcomes[study.id]?.[lang]
  return outcome ? <p data-outcome className="case-outcome">{outcome}</p> : null
}

/** The figures, one per row: the number, and its label beside it. */
function CaseStats({ study }: CaseProps) {
  const { lang } = useTranslation()
  if (!study.highlights) return null
  return (
    <dl className="case-stats">
      {study.highlights.map((h) => (
        <div key={h.label} className="case-stat">
          <dt>{lang === 'es' ? h.label : h.labelEn}</dt>
          <dd>{lang === 'es' ? h.value : (h.valueEn ?? h.value)}</dd>
        </div>
      ))}
    </dl>
  )
}

/** The whole case, set in newspaper columns where the measure allows. */
function CaseText({ study }: CaseProps) {
  const { lang, t } = useTranslation()
  const es = lang === 'es'
  const parts: [string, string][] = [
    [t('projects.problem'), es ? study.problem : study.problemEn],
    [t('projects.solution'), es ? study.solution : study.solutionEn],
    [t('projects.impact'), es ? study.impact : study.impactEn],
  ]
  return (
    <div className="case-text">
      {parts.map(([label, text]) => (
        <section key={label}>
          <h4 className="case-label">{label}</h4>
          <p>{text}</p>
        </section>
      ))}
      {study.architectureDiagram && (
        <section className="case-arch">
          <h4 className="case-label">{t('projects.architecture')}</h4>
          <p>{study.architectureDiagram}</p>
        </section>
      )}
    </div>
  )
}

/** Stack as a plain line, then the links or the confidentiality note. */
function CaseFoot({ study }: CaseProps) {
  const { t } = useTranslation()
  return (
    <footer className="case-foot">
      <p className="case-stack">{study.stack.join(' · ')}</p>
      {study.demoUrl && (
        <a href={study.demoUrl} target="_blank" rel="noopener noreferrer" className="case-link">
          {t('projects.viewDemo')} <ExternalLink size={12} aria-hidden="true" />
        </a>
      )}
      {study.githubUrl && (
        <a href={study.githubUrl} target="_blank" rel="noopener noreferrer" className="case-link">
          {t('projects.viewRepo')} <ExternalLink size={12} aria-hidden="true" />
        </a>
      )}
      {study.hasNDA && (
        <p className="case-nda"><Lock size={12} aria-hidden="true" /> {t('projects.nda')}</p>
      )}
    </footer>
  )
}

/** Lead and secondaries: the outcome and figures up front, the case behind a disclosure. */
function CaseCard({ study, kind }: CaseProps & { kind: 'lead' | 'secondary' }) {
  const { lang, t } = useTranslation()
  return (
    <article
      id={`case-${study.id}`}
      data-card={kind}
      className={kind === 'lead' ? 'case case-lead px-card bg-paper' : 'case case-secondary'}
    >
      <div className="case-head">
        <h3 className="case-title">{lang === 'es' ? study.title : study.titleEn}</h3>
        <CaseMeta study={study} />
        <p className="case-role">{lang === 'es' ? study.role : study.roleEn}</p>
        <CaseOutcome study={study} />
      </div>
      <CaseStats study={study} />
      <details className="case-full">
        <summary className="case-more">{t('projects.readMore')}</summary>
        <CaseText study={study} />
      </details>
      <CaseFoot study={study} />
    </article>
  )
}

/** One line — title, role, one figure — that opens in place. The native
 *  disclosure brings keyboard and screen-reader behaviour with it. */
function CaseBrief({ study }: CaseProps) {
  const { lang } = useTranslation()
  const figure = study.highlights?.[0]
  return (
    <details id={`case-${study.id}`} data-card="brief" className="case-brief case-full">
      <summary className="case-brief-line">
        <h3 className="case-brief-title">{lang === 'es' ? study.title : study.titleEn}</h3>
        <span className="case-brief-role">{lang === 'es' ? study.role : study.roleEn}</span>
        {figure && (
          <span className="case-brief-figure">
            <b>{lang === 'es' ? figure.value : (figure.valueEn ?? figure.value)}</b>{' '}
            {lang === 'es' ? figure.label : figure.labelEn}
          </span>
        )}
      </summary>
      <div className="case-brief-body">
        <div>
          <CaseMeta study={study} />
          <CaseOutcome study={study} />
        </div>
        <CaseStats study={study} />
        <CaseText study={study} />
        <CaseFoot study={study} />
      </div>
    </details>
  )
}

// ─── GitHub Activity Widget (secundario) ────────────────────────────────────
function GitHubActivityWidget() {
  const { repos } = useApp()
  const { t } = useTranslation()
  const recent = getFeaturedRepos(repos).slice(0, 4)

  // Before the fetch lands — and forever, if GitHub rate-limits us — there is
  // nothing to list. An empty framed card with a heading and a "view all" link
  // reads as broken; no card at all reads as a page that never had one.
  if (recent.length === 0) return null

  return (
    <div className="border-2 border-rule p-6 bg-paper">
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-rule">
        <h3 className="font-headline text-lg font-bold">{t('projects.github')}</h3>
        <a
          href="https://github.com/Ewin24"
          target="_blank" rel="noopener noreferrer"
          className="font-mono text-xs font-bold uppercase tracking-wide text-ink-light hover:text-ink flex items-center gap-1 transition-colors"
        >
          {t('projects.viewAll')} <ExternalLink size={12} aria-hidden="true" />
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
              <p className="font-mono text-xs font-bold text-ink group-hover:text-accent transition-colors break-words">
                {repo.name}
              </p>
              {repo.description && (
                <p className="font-sans text-xs text-ink-muted mt-0.5">
                  {repo.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0 text-ink-muted">
              {repo.language && (
                <span className="flex items-center gap-1">
                  <span className="tech-dot w-2 h-2 inline-block" style={{ '--tech': LANG_COLORS[repo.language] || '#888' } as CSSProperties} />
                  <span className="font-mono text-xs">{repo.language}</span>
                </span>
              )}
              {repo.stargazers_count > 0 && (
                <span className="flex items-center gap-0.5 font-mono text-xs">
                  <Star size={9} /> {repo.stargazers_count}
                </span>
              )}
              {repo.forks_count > 0 && (
                <span className="flex items-center gap-0.5 font-mono text-xs">
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

// The page order is the data's, never taste. The lead is the study flagged
// `lead` (the only one architecture-owned end to end; `featured` is true on
// every entry and cannot discriminate), the two secondaries are the next two
// by `order`, and the rest follow in `order` as briefs.
const lead = featuredCaseStudies.find((study) => study.lead) ?? featuredCaseStudies[0]
const others = featuredCaseStudies.filter((study) => study.id !== lead.id)
const secondaries = others.slice(0, 2)
const briefs = others.slice(2)

/** `#case-<id>` opens the brief it names and brings it into view. Any other
 *  hash (the blog owns `#blog…`) is ignored. */
function openCaseFromHash() {
  if (!location.hash.startsWith('#case-')) return
  const target = document.getElementById(location.hash.slice(1))
  if (!target?.closest('#projects')) return
  if (target instanceof HTMLDetailsElement) target.open = true
  // `scroll-margin-top` on `[id^='case-']` clears the fixed header; the scroll
  // behaviour is the page's own, which is already instant under reduced motion.
  target.scrollIntoView()
}

// ─── Section ────────────────────────────────────────────────────────────────
export function Projects() {
  const { t } = useTranslation()

  useEffect(() => {
    openCaseFromHash()
    window.addEventListener('hashchange', openCaseFromHash)
    return () => window.removeEventListener('hashchange', openCaseFromHash)
  }, [])

  return (
    <section id="projects" className="py-20 px-6 max-w-7xl mx-auto">

      {/* Section header estilo periódico */}
      <FadeIn>
        <SectionOpening
          section="projects"
          title={t('projects.title')}
          subtitle={t('projects.subtitle')}
          align="beside"
          rank="lead"
        />
      </FadeIn>

      <div className="cases">
        <FadeIn>
          <CaseCard study={lead} kind="lead" />
        </FadeIn>
        <FadeIn className="case-secondaries">
          {secondaries.map((study) => <CaseCard key={study.id} study={study} kind="secondary" />)}
        </FadeIn>
        <FadeIn className="case-briefs">
          {briefs.map((study) => <CaseBrief key={study.id} study={study} />)}
        </FadeIn>
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
