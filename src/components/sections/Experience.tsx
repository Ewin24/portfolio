import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { sortedExperience } from '../../content'
import type { WorkExperience } from '../../types'

function ExperienceCard({ job, index }: { job: WorkExperience; index: number }) {
  const { lang } = useTranslation()
  const { t } = useTranslation()

  const role         = lang === 'es' ? job.role         : job.roleEn
  const achievements = lang === 'es' ? job.achievements : job.achievementsEn
  const location     = lang === 'es'
    ? job.location
    : (job.locationEn ?? job.location)

  return (
    <FadeIn delay={index * 0.1}>
      <div className="grid md:grid-cols-[200px_1fr] gap-0 border-2 border-ink shadow-pixel hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75">

        {/* Columna izquierda — metadata */}
        <div className="border-b-2 md:border-b-0 md:border-r-2 border-ink p-5 bg-paper-dark flex flex-col gap-3">
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
            {job.stack.map((tech) => (
              <span key={tech} className="skill-tag text-[10px]">{tech}</span>
            ))}
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

  return (
    <section id="experience" className="py-20 px-6 max-w-5xl mx-auto">

      {/* Section header */}
      <FadeIn>
        <div className="mb-10">
          <div className="border-t-4 border-ink mb-1" />
          <div className="border-t border-ink mb-4" />
          <h2 className="font-headline text-4xl md:text-5xl font-black text-ink leading-none">
            {t('experience.title')}
          </h2>
          <p className="font-mono text-xs text-ink-muted mt-2">
            {t('experience.subtitle')}
          </p>
          <div className="border-t-4 border-ink mt-4" />
        </div>
      </FadeIn>

      {/* Timeline */}
      <div className="space-y-6">
        {sortedExperience.map((job, i) => (
          <ExperienceCard key={job.id} job={job} index={i} />
        ))}
      </div>
    </section>
  )
}
