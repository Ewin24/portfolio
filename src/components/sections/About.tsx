import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { SectionHeader } from '../ui/SectionHeader'

export function About() {
  const { user } = useApp()
  const { t } = useTranslation()

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <FadeIn>
        <SectionHeader
          id="about"
          title={t('about.title')}
          subtitle={t('about.subtitle')}
        />
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="glass rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
          {user?.avatar_url && (
            <div className="relative shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden neon-glow">
                <img
                  src={user.avatar_url}
                  alt={user.name || 'Avatar'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-neon-green border-4 border-surface-900" />
            </div>
          )}

          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              {user?.name || 'Edwin Trigos'}
            </h3>
            <p className="text-neon-cyan font-mono text-sm mb-4">@{user?.login || 'Ewin24'}</p>
            <p className="text-text-secondary leading-relaxed text-lg">
              {t('about.description')}
            </p>
            {user?.location && (
              <p className="text-text-muted text-sm mt-4">
                📍 {user.location}
              </p>
            )}
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
