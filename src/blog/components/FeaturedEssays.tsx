import { useState } from 'react'
import { Clock, ArrowRight } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../../components/ui/FadeIn'
import { SectionOpening } from '../../components/ui/SectionOpening'
import { blogPosts } from '../content/posts'
import { useReadSnapshot } from '../readState'
import { ReadMark } from './ReadMark'

/** How many essays the block shows before the reader asks for the rest. */
const FEATURED = 3

const essays = blogPosts
  .filter((p) => p.category === 'ensayo')
  .sort((a, b) => b.date.localeCompare(a.date))

/**
 * The opinion essays, set apart from the technical list directly below so they
 * are not buried among it. Same card recipe as the blog list.
 */
export function FeaturedEssays() {
  const { lang } = useTranslation()
  const [showAll, setShowAll] = useState(false)
  const readState = useReadSnapshot()
  const es = lang === 'es'

  if (essays.length === 0) return null

  return (
    <section id="essays" className="py-20 px-6 max-w-7xl mx-auto">
      <SectionOpening
        section="essays"
        title={es ? 'Ensayos' : 'Essays'}
        subtitle={
          es
            ? 'Textos de opinión sobre cómo decidir, diagnosticar y construir software. Argumentos, no tutoriales.'
            : 'Opinion pieces on deciding, diagnosing and building software. Arguments, not tutorials.'
        }
      />

      <div className="grid md:grid-cols-3 gap-5">
        {essays.slice(0, showAll ? essays.length : FEATURED).map((post, i) => (
          <FadeIn key={post.id} delay={(i % FEATURED) * 0.08}>
            <article
              data-essay-slug={post.slug}
              data-read-state={readState.stateOf(post.slug)}
              className="px-card px-card-sm px-card-interactive bg-paper flex flex-col h-full relative"
            >
              <div className="p-5 flex-1 flex flex-col gap-3">
                <span className="kicker">{es ? 'Ensayo' : 'Essay'}</span>
                <ReadMark slug={post.slug} />

                <h3 className="font-headline text-xl font-bold text-ink leading-tight">
                  {/* The link's ::after covers the card, so the whole card opens the article. */}
                  <a
                    href={`#blog/article/${post.slug}`}
                    className="after:absolute after:inset-0 hover:text-accent transition-colors duration-75"
                  >
                    {es ? post.title : post.titleEn}
                  </a>
                </h3>

                <p className="font-sans text-xs text-ink-light leading-relaxed line-clamp-4 flex-1">
                  {es ? post.excerpt : post.excerptEn}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-rule-light mt-auto">
                  <div className="flex items-center gap-3">
                    <time dateTime={post.date} className="font-mono text-[10px] text-ink-muted">
                      {post.date}
                    </time>
                    <span className="font-mono text-[10px] text-ink-muted flex items-center gap-1">
                      <Clock size={9} /> {post.readingTime} min
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent flex items-center gap-1"
                  >
                    {es ? 'Leer' : 'Read'} <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>

      {essays.length > FEATURED && (
        <div className="flex justify-center mt-8">
          <button
            data-essays-toggle
            aria-expanded={showAll}
            onClick={() => setShowAll(!showAll)}
            className="px-btn px-btn-outline"
          >
            {showAll
              ? es ? 'Mostrar menos' : 'Show fewer'
              : es ? `Ver los ${essays.length} ensayos` : `See all ${essays.length} essays`}
          </button>
        </div>
      )}
    </section>
  )
}
