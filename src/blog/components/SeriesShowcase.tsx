import { ArrowRight, Clock } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../../components/ui/FadeIn'
import { SectionOpening } from '../../components/ui/SectionOpening'
import { blogPosts } from '../content/posts'
import { SHOWCASED_SERIES, progressLabel, seriesParts } from '../content/series'
import { selectBlogTab } from '../hooks/blogTab'
import { useReadSnapshot } from '../readState'
import { ReadMark } from './ReadMark'

const series = SHOWCASED_SERIES
const parts = seriesParts(series, blogPosts)

/**
 * The home "Essays" block: the series of essays as a path. Its parts in
 * order with their reading state, how far the reader is, and one action that
 * opens the first part still unread. Every other essay is one link away, in
 * the blog's Essays tab directly below.
 */
export function SeriesShowcase() {
  const { lang } = useTranslation()
  const readState = useReadSnapshot()
  const es = lang === 'es'

  if (parts.length === 0) return null

  const states = parts.map((p) => readState.stateOf(p.slug))
  const read = states.filter((s) => s === 'read').length
  const untouched = states.every((s) => s === 'unread')
  const next = states.findIndex((s) => s !== 'read')
  const target = parts[Math.max(next, 0)]
  const action = untouched
    ? es ? 'Empezar la serie' : 'Start the series'
    : next === -1
      ? es ? 'Releer desde el inicio' : 'Reread from the start'
      : es ? `Continuar con la parte ${next + 1}` : `Continue with part ${next + 1}`

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

      <FadeIn className="blogfront-series-wrap">
        <div data-series-showcase className="blogfront blogfront-series px-card bg-paper">
          <div className="blogfront-series-intro">
            <span className="kicker">
              {es ? `Serie · ${parts.length} partes` : `Series · ${parts.length} parts`}
            </span>
            <h3 data-series-name className="font-headline text-3xl md:text-4xl font-black text-ink leading-tight">
              {series.name[lang]}
            </h3>
            <p data-series-description className="font-sans text-sm text-ink-light leading-relaxed">
              {series.description[lang]}
            </p>

            <div>
              <p data-series-progress role="status" className="font-mono text-xs font-bold text-ink">
                {progressLabel(read, parts.length, lang)}
              </p>
              {/* One cell per part, filled once read: the label above says the same in words. */}
              <div className="blogfront-series-bar" aria-hidden="true">
                {states.map((state, i) => (
                  <span key={i} data-state={state} />
                ))}
              </div>
            </div>

            <a data-series-action href={`#blog/article/${target.slug}`} className="px-btn blogfront-series-action">
              {action} <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>

          <ol className="blogfront-series-parts">
            {parts.map((post, i) => (
              <li
                key={post.id}
                data-essay-slug={post.slug}
                data-read-state={states[i]}
                className="blogfront-series-part"
              >
                <span className="blogfront-series-num" aria-hidden="true">{i + 1}</span>
                <div className="blogfront-series-text">
                  {/* The link's ::after covers the row, so the whole row opens the part. */}
                  <a href={`#blog/article/${post.slug}`} data-read-title className="blogfront-series-link">
                    {es ? post.title : post.titleEn}
                  </a>
                  <span className="blogfront-series-meta">
                    <Clock size={10} aria-hidden="true" /> {post.readingTime} min
                  </span>
                </div>
                <span className="blogfront-series-state">
                  <ReadMark slug={post.slug} variant="inline" />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </FadeIn>

      <p className="blogfront mt-8 text-center">
        <a
          data-all-essays
          href="#blog"
          onClick={() => selectBlogTab('essays')}
          className="blogfront-more"
        >
          {es ? 'Ver todos los ensayos' : 'See all essays'} <ArrowRight size={12} aria-hidden="true" />
        </a>
      </p>
    </section>
  )
}
