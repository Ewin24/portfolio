import { Quote } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { useTranslation } from '../../hooks/useTranslation'
import { useTheme } from '../../theme/ThemeContext'
import { FadeIn } from '../ui/FadeIn'
import { SectionOpening } from '../ui/SectionOpening'
import { Annunciation, ANNOUNCE_ATTR } from '../book/Annunciation'
import { testimonials } from '../../content'

export function Testimonials() {
  const { lang } = useTranslation()
  const { theme, stillness } = useTheme()
  const reduceMotion = useReducedMotion()

  // This section maps to the butterflies chapter, where they arrive ahead of
  // whoever is about to be read.
  const announcing = theme === 'book'

  return (
    <section id="testimonials" className="py-20 px-6 max-w-5xl mx-auto">
      <FadeIn>
        <SectionOpening
          section="testimonials"
          title={lang === 'es' ? 'Referencias' : 'References'}
          subtitle={
            lang === 'es'
              ? 'Lo que dicen quienes han trabajado conmigo'
              : 'What people say about working with me'
          }
        />
      </FadeIn>

      <Annunciation
        active={announcing}
        still={Boolean(reduceMotion) || stillness}
      >
      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map((t, i) => {
          const text  = lang === 'es' ? t.text  : t.textEn
          const role  = lang === 'es' ? t.role  : t.roleEn

          return (
            <FadeIn key={t.id} delay={i * 0.1}>
              <div
                {...{ [ANNOUNCE_ATTR]: '' }}
                className="border-2 border-rule bg-paper shadow-pixel-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all duration-75 flex flex-col h-full"
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
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-headline text-sm font-bold text-ink leading-tight">
                      {t.name}
                    </p>
                    <p className="font-mono text-[10px] text-ink-muted">
                      {role} · {t.company}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          )
        })}
      </div>
      </Annunciation>
    </section>
  )
}
