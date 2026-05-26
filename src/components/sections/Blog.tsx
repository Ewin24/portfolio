import { useState } from 'react'
import { Clock, Tag, ArrowRight } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { BlogModal } from '../ui/BlogModal'
import { blogPosts } from '../../content'
import type { BlogPost } from '../../types'

function BlogCard({ post, index, onRead }: { post: BlogPost; index: number; onRead: () => void }) {
  const { lang } = useTranslation()
  const title   = lang === 'es' ? post.title   : post.titleEn
  const excerpt = lang === 'es' ? post.excerpt : post.excerptEn

  return (
    <FadeIn delay={index * 0.08}>
      <article className="border-2 border-ink bg-paper shadow-pixel-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-75 flex flex-col h-full">
        <div className="p-5 flex-1 flex flex-col gap-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="skill-tag text-[9px] flex items-center gap-1">
                <Tag size={7} /> {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-headline text-lg font-bold text-ink leading-tight line-clamp-2">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="font-sans text-xs text-ink-light leading-relaxed line-clamp-3 flex-1">
            {excerpt}
          </p>

          {/* Meta + CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-rule-light mt-auto">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-ink-muted">{post.date}</span>
              <span className="font-mono text-[10px] text-ink-muted flex items-center gap-1">
                <Clock size={9} /> {post.readingTime} min
              </span>
            </div>
            <button
              onClick={onRead}
              className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent hover:text-accent-dark flex items-center gap-1 transition-colors cursor-pointer"
            >
              Leer <ArrowRight size={10} />
            </button>
          </div>
        </div>
      </article>
    </FadeIn>
  )
}

export function Blog() {
  const { t } = useTranslation()
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <>
      <section id="blog" className="py-20 px-6 max-w-7xl mx-auto">
        <FadeIn>
          <div className="mb-10">
            <div className="border-t-4 border-ink mb-1" />
            <div className="border-t border-ink mb-4" />
            <h2 className="font-headline text-4xl md:text-5xl font-black text-ink leading-none">
              {t('blog.title')}
            </h2>
            <p className="font-mono text-xs text-ink-muted mt-2">
              {t('blog.subtitle')}
            </p>
            <div className="border-t-4 border-ink mt-4" />
          </div>
        </FadeIn>

        {sortedPosts.length === 0 ? (
          <FadeIn>
            <div className="border-2 border-ink p-8 text-center bg-paper-dark">
              <p className="font-headline text-xl font-bold italic text-ink-muted">
                {t('blog.empty')}
              </p>
            </div>
          </FadeIn>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedPosts.map((post, i) => (
              <BlogCard
                key={post.id}
                post={post}
                index={i}
                onRead={() => setSelectedPost(post)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal for reading full post */}
      {selectedPost && (
        <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  )
}
