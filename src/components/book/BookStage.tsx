import { useTheme } from '../../theme/ThemeContext'
import { PageLayer } from './PageLayer'
import { BookmarkRibbon } from './BookmarkRibbon'
import { ParticleField } from '../book/ParticleField'

/**
 * Everything the book paints behind the content, mounted only while the
 * theme is on.
 *
 * What is deliberately NOT here matters as much as what is. The previous
 * stage carried a dune horizon, a walking figure, wind ribbons and floating
 * glyphs — the furniture of a desert game. Every one of them read as "game"
 * before a single colour was considered, and no palette was ever going to
 * overcome a silhouette walking across the bottom of the screen. They are
 * gone rather than restyled.
 *
 * What replaces them is what a book actually has: a page with a grain and a
 * margin, something drifting in the air over it, and a ribbon marking where
 * you are.
 */
export function BookStage() {
  const { theme, chapter, stillness } = useTheme()

  if (theme !== 'book') return null

  return (
    <>
      {/*
        Ink bleed.

        A ruled line printed on absorbent stock does not have a mathematically
        straight edge — the ink creeps a fraction of a millimetre into the
        fibre. feTurbulence generates that fibre and feDisplacementMap pushes
        the edge along it.

        Deliberately applied to RULES ONLY, never to type. A url() filter on
        text forces the glyphs through an offscreen raster pass, which both
        costs a repaint on every scroll and visibly softens the letterforms.
        The effect is worth having on a hairline and never worth it on a
        paragraph.
      */}
      <svg className="book-defs" aria-hidden="true" focusable="false">
        <filter id="ink-bleed" x="-4%" y="-40%" width="108%" height="180%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9 0.05"
            numOctaves={2}
            seed={7}
            result="fibre"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="fibre"
            scale={1.6}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Back to front: the paper itself, whatever hangs in the air above
          it, and the marker lying on top of the open page. */}
      <PageLayer chapter={chapter} stillness={stillness} />
      <ParticleField chapter={chapter} stillness={stillness} />
      <BookmarkRibbon stillness={stillness} />
    </>
  )
}
