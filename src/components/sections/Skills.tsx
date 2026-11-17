import { lazy, Suspense } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { SectionOpening } from '../ui/SectionOpening'

/**
 * The body counts where each technology appears in the blog posts and draws a
 * figure, so it reads the post bodies and the figure registry. Both already
 * live behind the blog's lazy boundary; loading the body the same way keeps
 * them out of the chunk that paints the Hero.
 */
const StackBody = lazy(() => import('./stack/StackBody'))

export function Skills() {
  const { t } = useTranslation()

  return (
    <section id="skills" className="py-20 px-6 max-w-7xl mx-auto">
      <FadeIn>
        <SectionOpening
          section="skills"
          title={t('skills.title')}
          subtitle={t('skills.subtitle')}
          align="beside"
        />
      </FadeIn>

      {/* The placeholder holds the section's height so the page below does not jump when the chunk lands. */}
      <Suspense fallback={<div className="stack-fallback" aria-hidden="true" />}>
        <StackBody />
      </Suspense>
    </section>
  )
}
