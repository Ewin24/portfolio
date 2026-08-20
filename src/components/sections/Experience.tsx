import { useMemo } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { useLatch, type LatchBinding } from '../../hooks/useLatch'
import { FadeIn } from '../ui/FadeIn'
import { SectionOpening } from '../ui/SectionOpening'
import { sortedExperience } from '../../content'
import type { WorkExperience } from '../../types'

/**
 * The lineage.
 *
 * The Buendías keep naming their sons Aureliano and José Arcadio, and every
 * generation believes it is starting something. The reader sees what the
 * family cannot: the same name coming back, and coming back.
 *
 * A career reads the same way, and the data already contained it — C# turns
 * up in four unconnected companies, SQL Server in three, Crystal Reports in
 * two roles separated by years. Nobody plans that. You discover it in
 * hindsight, which is exactly the novel's trick.
 *
 * So the recurring tools are marked with how many roles they have survived,
 * and pointing at one lights up every other role it appears in. That is the
 * lineage made visible, and unlike most of this theme it is also the single
 * most useful thing on the page: it says what actually persists in the work.
 */
function countLineage(jobs: WorkExperience[]) {
  const counts = new Map<string, number>()
  for (const job of jobs) {
    // A tool listed twice by one role is still one generation.
    for (const tech of new Set(job.stack)) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1)
    }
  }
  return counts
}

interface CardProps {
  job: WorkExperience
  index: number
  lineage: Map<string, number>
  tracked: string | null
  bind: (tech: string) => LatchBinding
  showLineage: boolean
}

function ExperienceCard({
  job,
  index,
  lineage,
  tracked,
  bind,
  showLineage,
}: CardProps) {
  const { lang } = useTranslation()
  const { t } = useTranslation()

  const carriesTracked = tracked !== null && job.stack.includes(tracked)

  const role         = lang === 'es' ? job.role         : job.roleEn
  const achievements = lang === 'es' ? job.achievements : job.achievementsEn
  const location     = lang === 'es'
    ? job.location
    : (job.locationEn ?? job.location)

  return (
    <FadeIn delay={index * 0.1}>
      <div
        className={`grid md:grid-cols-[200px_1fr] gap-0 border-2 border-rule shadow-pixel hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75${
          carriesTracked ? ' is-lineage-kin' : ''
        }${tracked && !carriesTracked ? ' is-lineage-other' : ''}`}
      >

        {/* Columna izquierda — metadata */}
        <div className="border-b-2 md:border-b-0 md:border-r-2 border-rule p-5 bg-paper-dark flex flex-col gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
              {job.period}
            </p>
            {job.current && (
              <span className="px-badge px-badge-accent text-[10px]">
                {t('experience.current')}
              </span>
            )}
          </div>

          <div>
            {job.companyUrl ? (
              <a
                href={job.companyUrl}
                target="_blank" rel="noopener noreferrer"
                className="font-headline text-lg font-bold text-ink hover:text-accent transition-colors leading-tight block"
              >
                {job.company}
              </a>
            ) : (
              <p className="font-headline text-lg font-bold text-ink leading-tight">
                {job.company}
              </p>
            )}
            <p className="font-mono text-[10px] text-ink-muted mt-1">{location}</p>
          </div>

          {/* Stack tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-rule-light">
            {job.stack.map((tech) => {
              const generations = lineage.get(tech) ?? 1
              const recurs = showLineage && generations > 1

              if (!recurs) {
                return (
                  <span key={tech} className="skill-tag text-[10px]">{tech}</span>
                )
              }

              return (
                <button
                  key={tech}
                  type="button"
                  className={`skill-tag text-[10px] lineage-tag${
                    tracked === tech ? ' is-tracked' : ''
                  }`}
                  {...bind(tech)}
                  aria-label={`${tech} — ${generations} ${
                    lang === 'es' ? 'generaciones' : 'generations'
                  }`}
                >
                  {tech}
                  <span className="lineage-count" aria-hidden="true">
                    {generations}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Columna derecha — rol + logros */}
        <div className="p-5">
          <p className="font-headline text-base font-bold italic text-ink-light mb-4 pb-3 border-b border-rule-light">
            {role}
          </p>

          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-3">
            {t('experience.achievements')}
          </p>

          <ul className="space-y-3">
            {achievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-3">
                {/* Bullet cuadrado — pixel style */}
                <span className="shrink-0 w-2 h-2 bg-ink mt-1.5" />
                <p className="font-sans text-sm text-ink-light leading-relaxed">
                  {achievement}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FadeIn>
  )
}

export function Experience() {
  const { t } = useTranslation()
  const latch = useLatch<string>()
  const tracked = latch.active

  const lineage = useMemo(() => countLineage(sortedExperience), [])
  // The lineage was a Book-only flourish; outside Book it is never shown.
  const showLineage = false

  return (
    <section
      id="experience"
      className={`py-20 px-6 max-w-5xl mx-auto${tracked ? ' is-tracing' : ''}`}
    >

      {/* Section header */}
      <FadeIn>
        <SectionOpening
          section="experience"
          title={t('experience.title')}
          subtitle={t('experience.subtitle')}
          rank="lead"
        />
      </FadeIn>

      {/* Timeline */}
      <div className="space-y-6">
        {sortedExperience.map((job, i) => (
          <ExperienceCard
            key={job.id}
            job={job}
            index={i}
            lineage={lineage}
            tracked={tracked}
            bind={latch.bind}
            showLineage={showLineage}
          />
        ))}
      </div>
    </section>
  )
}
