import { useReducedMotion } from 'motion/react'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { useTheme } from '../../theme/ThemeContext'
import { FadeIn } from '../ui/FadeIn'
import { TheIce } from '../book/TheIce'

export function About() {
  const { user } = useApp()
  const { t } = useTranslation()
  const { theme, stillness } = useTheme()
  const reduceMotion = useReducedMotion()

  return (
    <section id="about" className="py-20 px-6 max-w-5xl mx-auto">
      <FadeIn>
        <div className="grid md:grid-cols-[1fr_2fr] border-2 border-rule shadow-pixel">

          {/* Columna foto */}
          <div className="border-b-2 md:border-b-0 md:border-r-2 border-rule p-8 bg-paper-dark flex flex-col items-center justify-start gap-4">
            {user?.avatar_url ? (
              <TheIce active={theme === 'book'} still={Boolean(reduceMotion) || stillness}>
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
              </TheIce>
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
            <div className="border-t-4 border-rule mb-1" />
            <div className="border-t border-rule mb-5" />
            <h2 className="font-headline text-3xl md:text-4xl font-black text-ink leading-none mb-1">
              {t('about.title')}
            </h2>
            <p className="font-mono text-[10px] text-ink-muted uppercase tracking-widest mb-6">
              {t('about.subtitle')}
            </p>
            <p className="font-sans text-base text-ink-light leading-relaxed drop-cap">
              {t('about.description')}
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
