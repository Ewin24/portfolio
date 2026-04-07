import { Mail, ArrowUpRight } from 'lucide-react'
import { GithubIcon } from '../ui/GithubIcon'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { SectionHeader } from '../ui/SectionHeader'

export function Contact() {
  const { user } = useApp()
  const { t } = useTranslation()

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <FadeIn>
        <SectionHeader
          id="contact"
          title={t('contact.title')}
          subtitle={t('contact.subtitle')}
        />
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="glass rounded-3xl p-8 md:p-12 text-center neon-glow">
          <p className="text-2xl md:text-3xl font-bold gradient-text mb-8">
            {t('contact.cta')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={user?.html_url || 'https://github.com/Ewin24'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-700 hover:bg-surface-600 border border-surface-500/50 text-text-primary font-medium transition-all group"
            >
              <GithubIcon size={20} />
              {t('contact.github')}
              <ArrowUpRight size={14} className="text-text-muted group-hover:text-neon-cyan transition-colors" />
            </a>

            <a
              href="mailto:contact@edwintrigos.dev"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-medium hover:bg-neon-cyan/20 transition-all"
            >
              <Mail size={20} />
              {t('contact.email')}
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
