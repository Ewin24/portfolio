import { useEffect, type CSSProperties } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { readLabel, useReadSnapshot } from '../readState'

/**
 * The worn-ink filter of `.ink-stamp` is defined inside the experience
 * section, which is not on the page while an article is open. The same filter
 * is added to the document once, under its own id, the first time a read
 * stamp is shown; `readstate.css` points the stamp at it.
 */
function ensureInkWear() {
  if (document.getElementById('read-ink-wear')) return
  document.body.insertAdjacentHTML(
    'beforeend',
    '<svg width="0" height="0" aria-hidden="true" style="position:absolute"><filter id="read-ink-wear">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="noise"/>' +
      '<feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -12 0 0 0 8" result="mask"/>' +
      '<feComposite in="SourceGraphic" in2="mask" operator="in"/></filter></svg>',
  )
}

interface Props {
  slug: string
  /**
   * `corner` stamps the top right corner of the card and takes no room, so the
   * card keeps its height. `inline` sits in the flow, for the small cards.
   */
  variant?: 'corner' | 'inline'
}

/**
 * The reading state of one article, wherever a card offers it: the "LEÍDO"
 * stamp with the date it was read, "Continuar · 40 %" with a progress bar for
 * an article that was opened and not finished, nothing for an unread one.
 *
 * The card itself carries `data-read-state={snapshot.stateOf(slug)}`, which is
 * what tones its title down (`readstate.css`). Both read the same store, so
 * every card on the page changes together and without a reload.
 */
export function ReadMark({ slug, variant = 'corner' }: Props) {
  const { lang } = useTranslation()
  const snapshot = useReadSnapshot()
  const state = snapshot.stateOf(slug)

  useEffect(() => {
    if (state === 'read') ensureInkWear()
  }, [state])

  if (state === 'unread') return null

  if (state === 'started') {
    const percent = Math.round((snapshot.progressOf(slug) ?? 0) * 100)
    return (
      <span data-continue-mark className={`read-mark read-mark-${variant} read-mark-started`}>
        <span>
          {lang === 'es' ? 'Continuar' : 'Continue'} · {percent} %
        </span>
        <span
          data-progress={percent}
          aria-hidden="true"
          className="read-mark-bar"
          style={{ '--p': percent / 100 } as CSSProperties}
        />
      </span>
    )
  }

  // "Leído el 17 nov 2026" → the word is stamped, the date is set under or
  // beside it, and the joining word is kept for whoever hears it read aloud.
  const [word, joiner, ...date] = (readLabel(slug, lang) ?? '').split(' ')
  const dated = joiner && (
    <>
      <span className="sr-only"> {joiner} </span>
      <span className="read-mark-date">{date.join(' ')}</span>
    </>
  )
  // In the corner the date is inside the stamp, like a date stamp; inline it follows it.
  return (
    <span data-read-mark className={`read-mark read-mark-${variant}`}>
      {variant === 'corner' ? (
        <span className="ink-stamp">
          {word}
          {dated}
        </span>
      ) : (
        <>
          <span className="ink-stamp">{word}</span>
          {dated}
        </>
      )}
    </span>
  )
}
