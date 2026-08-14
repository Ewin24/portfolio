import { useEffect, useState } from 'react'
import type { Chapter } from '../../theme/chapters'

interface Props {
  chapter: Chapter
  stillness: boolean
}

/**
 * The paper.
 *
 * Four stacked things, none of them a gradient backdrop for its own sake:
 *
 *   1. The page ground, drifting between chapters.
 *   2. The laid grain — closely spaced wire lines with sparser chain lines
 *      across them. This is the single detail that separates "a beige page"
 *      from "paper", and it is why the grain token is restored in this theme.
 *   3. The foxing. A book does not age uniformly; it browns in blooms, worst
 *      where the paper was handled. Here the blooms deepen as the reader goes
 *      further in, so the last chapters are visibly older stock than the
 *      first. This is bound to scroll depth rather than to the chapter,
 *      because ageing is continuous and chapters are steps — stepping it
 *      would read as the page being swapped rather than aged.
 *   4. The margin rules, marking where the text block is allowed to begin.
 *
 * Fixed rather than scrolled: the reader moves through the book, the sheet
 * under them does not slide away.
 */

/** Foxing blooms. Fixed positions — real stains do not wander. */
const FOXING = [
  'radial-gradient(ellipse 18% 12% at 12% 22%, rgba(122, 82, 34, 0.16), transparent 70%)',
  'radial-gradient(ellipse 12% 9% at 78% 14%, rgba(122, 82, 34, 0.13), transparent 70%)',
  'radial-gradient(ellipse 22% 14% at 88% 62%, rgba(110, 72, 28, 0.15), transparent 72%)',
  'radial-gradient(ellipse 14% 10% at 28% 78%, rgba(122, 82, 34, 0.12), transparent 70%)',
  'radial-gradient(ellipse 9% 7% at 54% 44%, rgba(132, 92, 40, 0.10), transparent 68%)',
  'radial-gradient(ellipse 16% 11% at 66% 88%, rgba(110, 72, 28, 0.14), transparent 72%)',
].join(', ')

export function PageLayer({ chapter, stillness }: Props) {
  const [scrolled, setScrolled] = useState(0)

  /**
   * Derived, not stored. Under stillness the page settles at a middle age
   * instead of animating through it — the ageing is atmosphere, not
   * information. Computing that here rather than writing 0.5 back through
   * setState inside the effect is what keeps the effect free of a
   * synchronous state write, and with it the cascading render.
   */
  const depth = stillness ? 0.5 : scrolled

  /**
   * Published to the document root so the whole stylesheet can age with the
   * reader, not just this component.
   *
   * The series built four separate Macondos to carry a hundred years: the
   * same town, standing four times, each older than the last. That is the
   * difference between ageing a page and merely tinting it — what has to
   * change is the SAME furniture, wearing out, rather than a palette being
   * swapped underneath it. So --age drives the ruling, the wear at the edges
   * and the foxing together, and every one of them is the same element the
   * reader met at the top, further gone.
   */
  useEffect(() => {
    document.documentElement.style.setProperty('--age', depth.toFixed(3))
  }, [depth])

  useEffect(() => {
    if (stillness) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight
        setScrolled(scrollable > 0 ? window.scrollY / scrollable : 0)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [stillness])

  const ground = `linear-gradient(180deg, ${chapter.page[0]} 0%, ${chapter.page[1]} 52%, ${chapter.page[2]} 100%)`

  return (
    <div className="book-page" aria-hidden="true">
      <div className="book-page-ground" style={{ background: ground }} />
      <div className="book-page-grain" />
      <div
        className="book-page-foxing"
        style={{ backgroundImage: FOXING, opacity: 0.1 + depth * 0.5 }}
      />
      {/* The ruling wears away with use, so its opacity carries both the
          chapter's own weight and how far the reader has come. */}
      <div
        className="book-page-margins"
        style={{ opacity: chapter.marginOpacity * (1 - depth * 0.75) }}
      />
      <div className="book-page-wear" />
    </div>
  )
}
