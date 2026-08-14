import { useEffect, useRef, useState } from 'react'

export interface DecipherProps {
  text: string
  /** Milliseconds before this line begins to give itself up. */
  delay?: number
  active: boolean
  still: boolean
  className?: string
}

/**
 * Text that arrives in a script nobody in the house can read yet.
 *
 * Melquíades wrote his parchments in Sanskrit, and the family spent
 * generations learning to decipher them. So education and the blog do not
 * fade their titles in — they arrive already written, in a script the reader
 * cannot use, and give themselves up letter by letter as the reader gets
 * close enough to work at them.
 *
 * Devanagari rather than a scramble of the Latin alphabet, which is a
 * deliberate choice: shuffling A-Z into place is the "decoding" trope of
 * every hacker interface ever made, and it reads as a terminal, not as a
 * manuscript. A script the reader genuinely cannot read is the point, and
 * it is the one the novel actually names.
 *
 * The real string stays on the wrapper as aria-label and every glyph span is
 * hidden from assistive tech, so a screen reader is handed the finished
 * sentence and never a stream of unreadable characters. Under reduced motion
 * the text is simply already deciphered — the effect is atmosphere, and the
 * information must never depend on it.
 */

// Consonants only: vowel marks hang above the line and made the ciphered
// state taller than the deciphered one, which shifted the layout on resolve.
const GLYPHS = [...'कखगघचछजझटठडढतथदधनपफबभमयरलवशषसह']

function cipherChar(seed: number) {
  return GLYPHS[seed % GLYPHS.length]
}

export function Decipher({
  text,
  delay = 0,
  active,
  still,
  className = '',
}: DecipherProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [revealed, setRevealed] = useState(active && !still ? 0 : text.length)

  useEffect(() => {
    if (!active || still) {
      setRevealed(text.length)
      return
    }

    setRevealed(0)

    const el = ref.current
    if (!el) return

    let timer = 0
    let frame = 0

    const run = () => {
      const started = performance.now()
      // Roughly 22ms a letter, so a headline resolves in well under a second.
      const step = () => {
        const elapsed = performance.now() - started
        const n = Math.floor(elapsed / 22)
        if (n >= text.length) {
          setRevealed(text.length)
          return
        }
        setRevealed(n)
        frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) {
            timer = window.setTimeout(run, delay)
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [text, delay, active, still])

  if (!active) return <span className={className}>{text}</span>

  return (
    <span ref={ref} className={className} aria-label={text}>
      {[...text].map((char, i) => {
        if (i < revealed || char === ' ') {
          return (
            <span key={i} aria-hidden="true">
              {char}
            </span>
          )
        }
        return (
          <span key={i} className="decipher-glyph" aria-hidden="true">
            {cipherChar(i * 7 + char.charCodeAt(0))}
          </span>
        )
      })}
    </span>
  )
}
