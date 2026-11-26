import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { SectionOpening } from '../ui/SectionOpening'
import { CurrentStamp } from '../ui/CurrentStamp'
import { sortedExperience } from '../../content'
import { periodLabel } from '../../lib/text'
import type { WorkExperience } from '../../types'

interface CardProps {
  job: WorkExperience
  index: number
}

/** Achievements are written most-important-first, so the first four carry
 *  the role; the rest stay one click away instead of stretching the page. */
const VISIBLE_ACHIEVEMENTS = 4

function AchievementList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-10 gap-y-3 @2xl:grid-cols-2">
      {items.map((achievement, i) => (
        <li key={i} className="flex items-start gap-3">
          {/* Bullet cuadrado — pixel style */}
          <span className="shrink-0 w-2 h-2 bg-ink mt-1.5" />
          <p className="font-sans text-sm text-ink-light leading-relaxed">
            {achievement}
          </p>
        </li>
      ))}
    </ul>
  )
}

function ExperienceCard({ job, index }: CardProps) {
  const { lang, t } = useTranslation()

  const role         = lang === 'es' ? job.role         : job.roleEn
  const achievements = lang === 'es' ? job.achievements : job.achievementsEn
  const location     = lang === 'es'
    ? job.location
    : (job.locationEn ?? job.location)

  return (
    <FadeIn delay={index * 0.1}>
      {/* The current role is the section's lead and keeps the pixel shadow. */}
      <div className={`grid md:grid-cols-[220px_1fr] gap-0 px-card${index === 0 ? '' : ' px-card-quiet'}`}>

        {/* Columna izquierda — metadata */}
        <div className="border-b-2 md:border-b-0 md:border-r-2 border-rule p-5 bg-paper-dark flex flex-col gap-3">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-1">
              {periodLabel(job.period, lang)}
            </p>
            <p className="font-mono text-xs text-ink-muted">
              {t(`experience.employment.${job.employment}`)}
            </p>
            {/* Decorative: the period above already reads Presente/Present. */}
            {job.current && <CurrentStamp className="mt-2" />}
          </div>

          <div>
            {job.companyUrl ? (
              <a
                href={job.companyUrl}
                target="_blank" rel="noopener noreferrer"
                className="hit-44 font-headline text-lg font-bold text-ink hover:text-accent transition-colors leading-tight block"
              >
                {job.company}
              </a>
            ) : (
              <p className="font-headline text-lg font-bold text-ink leading-tight">
                {job.company}
              </p>
            )}
            <p className="font-mono text-xs text-ink-muted mt-1">{location}</p>
          </div>

          {/* Stack tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-rule-light">
            {job.stack.map((tech) => (
              <span key={tech} className="skill-tag">{tech}</span>
            ))}
          </div>
        </div>

        {/* Columna derecha — rol + logros. A container: with room, the logros
            set in two columns instead of one line of 130 characters. */}
        <div className="p-5 @container">
          <p className="font-headline text-base font-bold italic text-ink-light mb-4 pb-3 border-b border-rule-light">
            {role}
          </p>

          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-3">
            {t('experience.achievements')}
          </p>

          <AchievementList items={achievements.slice(0, VISIBLE_ACHIEVEMENTS)} />
          {achievements.length > VISIBLE_ACHIEVEMENTS && (
            <details className="mt-3">
              <summary className="disclosure">
                {achievements.length - VISIBLE_ACHIEVEMENTS} {t('experience.more')}
              </summary>
              <div className="pt-3">
                <AchievementList items={achievements.slice(VISIBLE_ACHIEVEMENTS)} />
              </div>
            </details>
          )}
        </div>
      </div>
    </FadeIn>
  )
}

export function Experience() {
  const { t } = useTranslation()

  return (
    <section id="experience" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Worn-ink filter for .ink-stamp, defined once: noise thresholded
          into an alpha mask, then the stamp is kept only where ink "took". */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <filter id="ink-wear">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -12 0 0 0 8" result="mask" />
          <feComposite in="SourceGraphic" in2="mask" operator="in" />
        </filter>
      </svg>

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
          />
        ))}
      </div>
    </section>
  )
}
