import { motion } from 'framer-motion'
import { ArrowRight, Tag } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../../components/ui/FadeIn'
import { useBlogContext } from '../context/BlogContext'
import { useRecommendations } from '../hooks/useRecommendations'
import type { BlogPost } from '../types'

interface Props {
  currentPost: BlogPost
}

/**
 * Related posts panel by tag overlap + recency.
 * Not rendered if fewer than 2 total posts.
 */
export function Recommendations({ currentPost }: Props) {
  const { lang } = useTranslation()
  const { posts } = useBlogContext()

  const recommendations = useRecommendations(currentPost, posts, 3)

  // Don't render if fewer than 2 total posts (spec BR-5)
  if (posts.length < 2) return null

  if (recommendations.length === 0) return null

  const { setSelectedPost } = useBlogContext()

  const handleSelect = (post: BlogPost) => {
    setSelectedPost(post)
    history.pushState(null, '', `#blog/article/${post.slug}`)
  }

  return (
    <FadeIn>
      <div className="border-t-4 border-ink pt-6 mt-10 mb-8">
        <h3 className="font-headline text-xl md:text-2xl font-bold text-ink mb-5">
          {lang === 'es' ? 'Artículos relacionados' : 'Related posts'}
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          {recommendations.map((post, i) => {
            const title = lang === 'es' ? post.title : post.titleEn
            const excerpt = lang === 'es' ? post.excerpt : post.excerptEn

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.08 }}
                className="border-2 border-ink bg-paper shadow-pixel-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all duration-75 flex flex-col"
              >
                <button
                  onClick={() => handleSelect(post)}
                  className="flex flex-col h-full text-left cursor-pointer p-4 gap-2"
                >
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="skill-tag text-[8px] flex items-center gap-1">
                        <Tag size={6} /> {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h4 className="font-headline text-sm font-bold text-ink leading-tight line-clamp-2">
                    {title}
                  </h4>

                  {/* Excerpt */}
                  <p className="font-sans text-[11px] text-ink-light leading-relaxed line-clamp-2 flex-1">
                    {excerpt}
                  </p>

                  {/* Read link */}
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-accent hover:text-accent-dark flex items-center gap-1 mt-auto pt-2 transition-colors">
                    {lang === 'es' ? 'Leer' : 'Read'} <ArrowRight size={9} />
                  </span>
                </button>
              </motion.article>
            )
          })}
        </div>
      </div>
    </FadeIn>
  )
}
