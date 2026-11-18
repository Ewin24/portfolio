import { useState } from 'react'
import { Check, Link as LinkIcon } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import type { BlogPost } from '../types'

const CONTROL = 'skill-tag inline-flex items-center gap-1.5 cursor-pointer'

/**
 * Share controls for one article. They share the static page the build emits at
 * `blog/<slug>/` (it carries the post's own preview tags and sends a reader on to
 * the article), never the hash route, which every network previews as the home page.
 */
export function ShareLinks({ post }: { post: BlogPost }) {
  const { lang } = useTranslation()
  const [copied, setCopied] = useState(false)
  const es = lang === 'es'

  const url = `${location.origin}${import.meta.env.BASE_URL}blog/${post.slug}/`
  const title = es ? post.title : post.titleEn
  const u = encodeURIComponent(url)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // No clipboard access (insecure context, denied permission): hand over the URL to copy by hand.
      window.prompt(es ? 'Copia el enlace' : 'Copy the link', url)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-4" data-share-links>
      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted">
        {es ? 'Compartir' : 'Share'}
      </span>
      <button type="button" onClick={copy} className={CONTROL}>
        {copied ? <Check size={10} aria-hidden="true" /> : <LinkIcon size={10} aria-hidden="true" />}
        {/* The confirmation is a text and icon change, announced politely; it does not depend on colour. */}
        <span aria-live="polite">
          {copied ? (es ? 'Enlace copiado' : 'Link copied') : es ? 'Copiar enlace' : 'Copy link'}
        </span>
      </button>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
        target="_blank"
        rel="noopener noreferrer"
        className={CONTROL}
        aria-label={es ? 'Compartir en LinkedIn (abre una pestaña nueva)' : 'Share on LinkedIn (opens a new tab)'}
      >
        LinkedIn
      </a>
      <a
        href={`https://x.com/intent/tweet?url=${u}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={CONTROL}
        aria-label={es ? 'Compartir en X (abre una pestaña nueva)' : 'Share on X (opens a new tab)'}
      >
        X
      </a>
    </div>
  )
}
