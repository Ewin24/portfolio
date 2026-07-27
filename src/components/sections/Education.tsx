import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { education } from '../../content'
import type { Education as EducationType } from '../../types'

const sorted = [...education].sort((a, b) => b.order - a.order)

function EducationCard({ item, index }: { item: EducationType; index: number }) {
  const { lang } = useTranslation()
  const degree = lang === 'es' ? item.degree : item.degreeEn
  const description = lang === 'es' ? item.description : item.descriptionEn

  return (
    <FadeIn delay={index * 0.1}>
      <div className="grid md:grid-cols-[200px_1fr] gap-0 border-2 border-ink shadow-pixel hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75">

        {/* Left column — metadata */}
        <div className="border-b-2 md:border-b-0 md:border-r-2 border-ink p-5 bg-paper-dark flex flex-col gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
              {item.period}
            </p>
            {item.current && (
              <span className="px-badge px-badge-accent text-[10px]">
                {lang === 'es' ? 'En curso' : 'In progress'}
              </span>
            )}
          </div>
          <p className="font-headline text-lg font-bold text-ink leading-tight">
            {item.institution}
          </p>
        </div>

        {/* Right column — degree + description */}
        <div className="p-5">
          <p className="font-headline text-base font-bold italic text-ink-light mb-3">
            {degree}
          </p>
          {description && (
            <p className="font-sans text-sm text-ink-light leading-relaxed">
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
    <section id="education" className="py-20 px-6 max-w-5xl mx-auto">

      {/* Section header */}
      <FadeIn>
        <div className="mb-10">
          <div className="border-t-4 border-ink mb-1" />
          <div className="border-t border-ink mb-4" />
          <h2 className="font-headline text-4xl md:text-5xl font-black text-ink leading-none">
            {t('education.title')}
          </h2>
          <p className="font-mono text-xs text-ink-muted mt-2">
            {t('education.subtitle')}
          </p>
          <div className="border-t-4 border-ink mt-4" />
        </div>
      </FadeIn>

      {/* Timeline */}
      <div className="space-y-6">
        {sorted.map((item, i) => (
          <EducationCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
