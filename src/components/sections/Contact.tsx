import { Mail, ArrowUpRight, MapPin } from 'lucide-react'
import { GithubIcon } from '../ui/GithubIcon'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'

export function Contact() {
  const { user } = useApp()
  const { t } = useTranslation()

  return (
    <section id="contact" className="py-20 px-6 max-w-4xl mx-auto">
      <FadeIn>
        <div className="border-2 border-ink shadow-pixel">
          {/* Header periódico */}
          <div className="border-b-4 border-ink p-6 bg-ink text-paper">
            <div className="border-t-4 border-paper mb-1" />
            <div className="border-t border-paper mb-4" />
            <h2 className="font-headline text-4xl md:text-5xl font-black leading-none">
              {t('contact.title')}
            </h2>
            <p className="font-mono text-xs text-paper/70 mt-2 uppercase tracking-widest">
              {t('contact.subtitle')}
            </p>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12">
            <p className="font-headline text-2xl md:text-3xl font-bold italic text-ink mb-8">
              {t('contact.cta')}
            </p>

            {/* Location */}
            <div className="flex items-center gap-2 font-mono text-xs text-ink-muted mb-8 pb-6 border-b border-rule-light">
              <MapPin size={12} />
              {t('contact.location')}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-3 flex-wrap">
              <a
                href={user?.html_url || 'https://github.com/Ewin24'}
                target="_blank" rel="noopener noreferrer"
                className="px-btn px-btn-outline flex items-center gap-2"
              >
                <GithubIcon size={16} />
                {t('contact.github')}
                <ArrowUpRight size={14} />
              </a>

              <a
                href="mailto:edwintrigos24@gmail.com"
                className="px-btn flex items-center gap-2"
              >
                <Mail size={16} />
                {t('contact.email')}
              </a>

              <a
                href="https://www.linkedin.com/in/edwintrigosguevara"
                target="_blank" rel="noopener noreferrer"
                className="px-btn px-btn-outline flex items-center gap-2"
              >
                {/* LinkedIn inline SVG — lucide-react no lo incluye */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                {t('contact.linkedin')}
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
