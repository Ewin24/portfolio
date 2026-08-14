import { motion, useReducedMotion } from 'motion/react'
import { ArrowDown, Mail } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { useTheme } from '../../theme/ThemeContext'
import { VoxelFigure } from '../book/lazy'
import { FadeIn } from '../ui/FadeIn'
import { workExperience, caseStudies } from '../../content'

/**
 * Stats que venden INGENIERÍA, no GitHub metrics
 *
 * yearsExp    → calculado desde el trabajo más antiguo en content/experience
 * systems     → número de case studies (proyectos en producción)
 * stack       → número de tecnologías únicas en todos los casos + experience
 */
/**
 * Año en que arranca la carrera: el menor año que aparezca en cualquier período.
 *
 * No se puede usar `order` para esto — es un rango de visualización, no una
 * línea de tiempo (hay valores repetidos y no siguen la cronología). Tampoco
 * sirve leer un solo período: conviven dos formatos, '2021 – 2023' y
 * 'Ene 2022 – Ene 2023', así que parsear el string completo produce NaN en
 * los que empiezan con el mes. Se busca el primer año de cuatro dígitos de
 * cada período y se toma el mínimo.
 */
function earliestCareerYear(): number | null {
  const years = workExperience
    .map((job) => job.period.match(/\d{4}/)?.[0])
    .filter((year): year is string => year !== undefined)
    .map(Number)

  return years.length > 0 ? Math.min(...years) : null
}

function computeStats() {
  // Años de experiencia desde el trabajo más antiguo
  const currentYear = new Date().getFullYear()
  const startYear = earliestCareerYear() ?? currentYear - 5
  const yearsExp = Math.max(0, currentYear - startYear)

  // Sistemas en producción = case studies con NDA (proyectos reales de empresa)
  const systems = caseStudies.length

  // Stack único: unión de todos los stacks
  const allTechs = new Set([
    ...workExperience.flatMap((j) => j.stack),
    ...caseStudies.flatMap((p) => p.stack),
  ])

  return { yearsExp, systems, stackCount: allTechs.size }
}

export function Hero() {
  const { user } = useApp()
  const { t, lang } = useTranslation()
  const { theme, stillness } = useTheme()
  const reduceMotion = useReducedMotion()
  const { yearsExp, systems, stackCount } = computeStats()

  const stats = [
    { value: `${yearsExp}+`, label: t('hero.stats.yearsExp') },
    { value: `${systems}`,   label: t('hero.stats.systems') },
    { value: `${stackCount}`, label: t('hero.stats.stack') },
  ]

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-paper">

      {/* Fondo: líneas tipográficas decorativas (newspaper columns ghost) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #1A1A1A 0px, #1A1A1A 1px, transparent 1px, transparent calc((100% - 8px) / 12))',
          backgroundSize: 'calc(100% / 12) 100%',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 w-full">

        {/* The figure. It greets before the name does, because the object is
            the thing a reader remembers after closing the page. */}
        <VoxelFigure
          model="fish"
          size="lead"
          active={theme === 'book'}
          still={Boolean(reduceMotion) || stillness}
          label={lang === 'es'
            ? 'Pescadito de oro: arrastralo para girarlo, presionalo para fundirlo'
            : 'Little gold fish: drag to turn it, press to melt it down'}
          hint={lang === 'es' ? 'fundelo' : 'melt it'}
        />

        {/* Kicker */}
        <FadeIn>
          <div className="flex items-center gap-4 mb-6">
            <div className="border-t-4 border-rule flex-1 max-w-12" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink-muted">
              {t('hero.greeting')}
            </span>
            <div className="border-t-4 border-rule flex-1 max-w-12" />
          </div>
        </FadeIn>

        {/* Nombre — el MASTHEAD */}
        <FadeIn delay={0.1}>
          <div className="border-t-4 border-rule pt-4 mb-2">
            <h1 className="font-headline font-black leading-none tracking-tight"
              style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}>
              {user?.name || 'Edwin Trigos'}
            </h1>
          </div>
          <div className="border-t border-rule mb-4" />
        </FadeIn>

        {/* Rol + subtitle en dos columnas estilo periódico */}
        <FadeIn delay={0.2}>
          <div className="grid md:grid-cols-[1fr_2fr] gap-6 border-b-4 border-rule pb-8 mb-8">
            <div>
              <p className="font-headline text-xl md:text-2xl font-bold italic text-accent leading-tight">
                {t('hero.role')}
              </p>
              <p className="font-mono text-xs text-ink-muted mt-2">
                {user?.location || 'Colombia'}
              </p>
            </div>
            <p className="font-sans text-base text-ink-light leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={0.3}>
          <div className="flex flex-wrap gap-4 mb-12">
            <a href="#projects" className="px-btn">
              {t('hero.cta.projects')}
            </a>
            <a href="#contact" className="px-btn px-btn-outline">
              <Mail size={14} />
              {t('hero.cta.contact')}
            </a>
          </div>
        </FadeIn>

        {/* Stats — valores de negocio, no GitHub metrics */}
        <FadeIn delay={0.4}>
          <div className="grid grid-cols-3 border-2 border-rule shadow-pixel-sm">
            {stats.map((stat, i) => (
              /*
               * The founding: a world so recent that many things had no name
               * yet, and to mention them you had to point.
               *
               * So in the book the quantities are there from the first frame
               * and their names are not — you point at a number to learn what
               * it counts. Applied to the stats and deliberately NOT to the
               * headline: the h1 is the first thing a reader and a crawler
               * both meet, and a name withheld there is a cost, not a joke.
               *
               * The label element is always in the DOM at full text, only
               * faded. Nothing is withheld from a screen reader or a crawler.
               */
              <div
                key={stat.label}
                className={`p-5 text-center${i < stats.length - 1 ? ' border-r-2 border-rule' : ''}${
                  theme === 'book' ? ' unnamed' : ''
                }`}
              >
                <motion.p
                  className="font-headline text-3xl md:text-4xl font-black text-ink leading-none"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.5 + i * 0.1 }}
                >
                  {stat.value}
                </motion.p>
                <p className="font-mono text-[11px] text-ink-muted mt-1 uppercase tracking-wide unnamed-label">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* Scroll indicator — the loop is decorative, so it stops entirely
          under reduced motion instead of running forever off-screen. */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
        transition={reduceMotion ? undefined : { repeat: Infinity, duration: 2 }}
        aria-hidden="true"
      >
        <ArrowDown className="text-ink-muted" size={20} />
      </motion.div>
    </section>
  )
}
