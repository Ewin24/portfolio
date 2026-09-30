import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { SectionOpening } from '../ui/SectionOpening'

export function About() {
  const { user } = useApp()
  const { t } = useTranslation()

  return (
    <section id="about" className="py-20 px-6 max-w-7xl mx-auto">
      <FadeIn>
        <SectionOpening section="about" title={t('about.title')} subtitle={t('about.subtitle')} />
        <div className="grid md:grid-cols-[1fr_2fr] px-card">

          {/* Columna foto */}
          <div className="border-b-2 md:border-b-0 md:border-r-2 border-rule p-8 bg-paper-dark flex flex-col items-center justify-start gap-4">
            {user?.avatar_url ? (
              <div className="border-4 border-rule shadow-pixel overflow-hidden">
                {/* width/height match w-36 h-36 (144px) so the box is
                    reserved before the remote avatar arrives — no layout shift */}
                <img
                  src={user.avatar_url}
                  alt={user.name || 'Avatar'}
                  width={144}
                  height={144}
                  loading="lazy"
                  decoding="async"
                  className="w-36 h-36 object-cover block"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            ) : (
              <div className="w-36 h-36 border-4 border-rule bg-paper-dark flex items-center justify-center">
                <span className="font-headline text-4xl font-black text-ink-muted">ET</span>
              </div>
            )}

            <div className="text-center">
              <p className="font-headline text-xl font-bold text-ink">
                {user?.name || 'Edwin Trigos'}
              </p>
              <p className="font-mono text-[10px] text-accent font-bold uppercase tracking-widest mt-1">
                @{user?.login || 'Ewin24'}
              </p>
              {user?.location && (
                <p className="font-mono text-xs text-ink-muted mt-2">
                  {user.location}
                </p>
              )}
            </div>
          </div>

          {/* Columna texto */}
          <div className="p-8">
            <p className="font-sans text-base text-ink-light leading-relaxed drop-cap max-w-prose">
              {t('about.description')}
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
