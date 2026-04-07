import { motion } from 'framer-motion'
import { ArrowDown, ExternalLink, Mail } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'

export function Hero() {
  const { user } = useApp()
  const { t } = useTranslation()

  const yearsOnGithub = user
    ? new Date().getFullYear() - new Date(user.created_at).getFullYear()
    : 0

  return (
    <section className="relative min-h-screen flex items-center justify-center grid-bg overflow-hidden">
      {/* Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-12 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            {t('hero.greeting')}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
            {user?.name || 'Edwin Trigos'}
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-2xl md:text-3xl font-medium gradient-text mb-6">
            {t('hero.role')}
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-medium hover:bg-neon-cyan/20 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all duration-300"
            >
              <ExternalLink size={18} />
              {t('hero.cta.projects')}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass glass-hover text-text-secondary hover:text-text-primary font-medium transition-all duration-300"
            >
              <Mail size={18} />
              {t('hero.cta.contact')}
            </a>
          </div>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={0.5}>
          <div className="flex justify-center gap-8 md:gap-16">
            {[
              { value: user?.public_repos || 0, label: t('hero.stats.repos') },
              { value: user?.followers || 0, label: t('hero.stats.followers') },
              { value: yearsOnGithub, label: t('hero.stats.years') },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <motion.p
                  className="text-3xl md:text-4xl font-bold neon-text text-neon-cyan font-mono"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-text-muted text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown className="text-text-muted" size={20} />
        </motion.div>
      </div>
    </section>
  )
}
