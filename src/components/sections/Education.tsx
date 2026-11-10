import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { SectionOpening } from '../ui/SectionOpening'
import { education } from '../../content'
import { periodLabel } from '../../lib/text'
import type { Education as EducationType } from '../../types'

const sorted = [...education].sort((a, b) => b.order - a.order)

function EducationCard({ item, index }: { item: EducationType; index: number }) {
  const { lang } = useTranslation()

  const degree = lang === 'es' ? item.degree : item.degreeEn
  const description = lang === 'es' ? item.description : item.descriptionEn

  return (
    <FadeIn delay={index * 0.1} className="h-full">
      {/* Stacked, two to a row: half the entries have no description, and a
          wide two-column card left their right side empty. */}
      <div className="px-card h-full flex flex-col">
        <div className="border-b-2 border-rule px-5 py-3 bg-paper-dark flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-muted">
            {periodLabel(item.period, lang)}
          </p>
          {item.current && (
            <span className="px-badge px-badge-accent text-[10px]">
              {lang === 'es' ? 'En curso' : 'In progress'}
            </span>
          )}
        </div>

        <div className="p-5">
          <p className="font-headline text-lg font-bold text-ink leading-tight">
            {degree}
          </p>
          <p className="font-mono text-xs text-ink-muted mt-2">
            {item.institution}
          </p>
          {description && (
            <p className="font-sans text-sm text-ink-light leading-relaxed mt-3">
              {description}
            </p>
          )}
        </div>
      </div>
    </FadeIn>
  )
}

export function Education() {
  const { t } = useTranslation()

  return (
    <section id="education" className="py-20 px-6 max-w-7xl mx-auto">

      {/* Section header */}
      <FadeIn>
        <SectionOpening
          section="education"
          title={t('education.title')}
          subtitle={t('education.subtitle')}
        />
      </FadeIn>

      {/* Timeline */}
      <div className="edu-grid grid md:grid-cols-2 gap-6">
        {sorted.map((item, i) => (
          <EducationCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
