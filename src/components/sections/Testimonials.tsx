import { Quote } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { SectionOpening } from '../ui/SectionOpening'
import { testimonials } from '../../content'

export function Testimonials() {
  const { lang, t } = useTranslation()

  return (
    <section id="testimonials" className="py-20 px-6 max-w-7xl mx-auto">
      <FadeIn>
        <SectionOpening
          section="testimonials"
          title={t('testimonials.title')}
          subtitle={t('testimonials.subtitle')}
        />
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map((item, i) => {
          const text  = lang === 'es' ? item.text  : item.textEn
          const role  = lang === 'es' ? item.role  : item.roleEn

          return (
            <FadeIn key={item.id} delay={i * 0.1}>
              <div
                className="px-card px-card-sm bg-paper flex flex-col h-full"
              >
                {/* Quote */}
                <div className="p-6 flex-1">
                  <Quote size={20} className="text-ink-muted mb-3" />
                  <p className="font-sans text-sm text-ink-light leading-relaxed italic">
                    &ldquo;{text}&rdquo;
                  </p>
                </div>

                {/* Author */}
                <div className="border-t-2 border-rule p-4 flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-rule bg-ink flex items-center justify-center shrink-0">
                    <span className="font-headline text-sm font-black text-paper">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-headline text-sm font-bold text-ink leading-tight">
                      {item.name}
                    </p>
                    <p className="font-mono text-[10px] text-ink-muted">
                      {role} · {item.company}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          )
        })}
      </div>
    </section>
  )
}
