import { Quote } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { testimonials } from '../../content'

export function Testimonials() {
  const { lang } = useTranslation()

  return (
    <section id="testimonials" className="py-20 px-6 max-w-5xl mx-auto">
      <FadeIn>
        <div className="mb-10">
          <div className="border-t-4 border-ink mb-1" />
          <div className="border-t border-ink mb-4" />
          <h2 className="font-headline text-4xl md:text-5xl font-black text-ink leading-none">
            {lang === 'es' ? 'Referencias' : 'References'}
          </h2>
          <p className="font-mono text-xs text-ink-muted mt-2">
            {lang === 'es'
              ? 'Lo que dicen quienes han trabajado conmigo'
              : 'What people say about working with me'}
          </p>
          <div className="border-t-4 border-ink mt-4" />
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map((t, i) => {
          const text  = lang === 'es' ? t.text  : t.textEn
          const role  = lang === 'es' ? t.role  : t.roleEn

          return (
            <FadeIn key={t.id} delay={i * 0.1}>
              <div className="border-2 border-ink bg-paper shadow-pixel-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-75 flex flex-col h-full">
                {/* Quote */}
                <div className="p-6 flex-1">
                  <Quote size={20} className="text-ink-muted mb-3" />
                  <p className="font-sans text-sm text-ink-light leading-relaxed italic">
                    &ldquo;{text}&rdquo;
                  </p>
                </div>

                {/* Author */}
                <div className="border-t-2 border-ink p-4 flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-ink bg-ink flex items-center justify-center shrink-0">
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
    </section>
  )
}
