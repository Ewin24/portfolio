const ABBREVIATIONS = new Set([
  'etc', 'vs', 'dr', 'dra', 'sr', 'sra', 'srta', 'ing', 'lic', 'av', 'núm',
  'no', 'pág', 'ej', 'aprox', 'inc', 'ltd', 'co', 'mr', 'mrs', 'ms', 'prof',
  'st', 'jr', 'approx', 'fig', 'eg', 'ie', 'pp', 'vol',
])

const CLOSERS = new Set(['"', "'", '»', ')', '”', '’'])
const TERMINATORS = new Set(['.', '!', '?', '…'])
const TRAILING_STRIP = new Set([',', ';', ':', '-', '–', '—', '('])

function isLetter(ch: string | undefined): boolean {
  return !!ch && /\p{L}/u.test(ch)
}

function isDigit(ch: string | undefined): boolean {
  return !!ch && /\d/.test(ch)
}

function isWhitespace(ch: string | undefined): boolean {
  return !!ch && /\s/.test(ch)
}

/**
 * True when the period at `i` closes an abbreviation rather than a
 * sentence — a single-letter initial (`S.A.`), a listed abbreviation
 * (`etc.`, `vs.`), or a short all-caps acronym block (`EE.`, `UU.`).
 */
function isAbbreviationPeriod(text: string, i: number): boolean {
  let k = i - 1
  while (k >= 0 && isLetter(text[k])) k--
  const run = text.slice(k + 1, i)
  if (run.length === 0) return false
  if (run.length === 1) return true
  if (ABBREVIATIONS.has(run.toLowerCase())) return true
  if (run.length <= 3 && run === run.toUpperCase() && run !== run.toLowerCase()) {
    return true
  }
  return false
}

export interface ClampResult {
  /** Text to render in the visible, clamped element. */
  head: string
  /** Remaining source text — belongs in a `sr-only` sibling, never nested. */
  rest: string
}

/**
 * Cuts `text` at the last sentence boundary that fits within `budget`
 * characters (searched in the back half of the budget, so a short opening
 * sentence does not throw away a paragraph the budget could hold). Falls
 * back to the last complete word, plus a trailing ellipsis, when no
 * boundary fits.
 *
 * `head` never ends mid-token, and — once a trailing "…" (present only in
 * the fallback case) is stripped — `head + rest` always reassembles `text`
 * exactly. No character is ever silently dropped; the ellipsis is a visual
 * marker layered on top, not a cut.
 */
export function clampToSentence(text: string, budget: number): ClampResult {
  if (text.length <= budget) {
    return { head: text, rest: '' }
  }

  const min = budget * 0.5
  const scanLimit = Math.min(budget, text.length)
  let boundaryEnd = -1

  for (let i = 0; i < scanLimit; i++) {
    const ch = text[i]
    if (!TERMINATORS.has(ch)) continue

    // Only the last '.' in a run of periods ("...") may be a boundary.
    if (ch === '.' && text[i + 1] === '.') continue

    // Numeric — a digit on both sides of the period is not a sentence end.
    if (ch === '.' && isDigit(text[i - 1]) && isDigit(text[i + 1])) continue

    if (ch === '.' && isAbbreviationPeriod(text, i)) continue

    // Absorb an immediately following closer (quote, paren, guillemet).
    let j = i + 1
    while (j < text.length && CLOSERS.has(text[j])) j++

    const headLen = j
    if (headLen < min || headLen > budget) continue

    const isEnd = j >= text.length
    if (!isEnd && !isWhitespace(text[j])) continue

    if (!isEnd) {
      let afterIdx = j
      while (afterIdx < text.length && isWhitespace(text[afterIdx])) afterIdx++
      const nextChar = text[afterIdx]
      // Lowercase next — the sentence after the terminator does not open
      // with a capital, so this was not really a sentence start.
      if (isLetter(nextChar) && nextChar === nextChar.toLowerCase() && nextChar !== nextChar.toUpperCase()) {
        continue
      }
    }

    boundaryEnd = headLen
  }

  if (boundaryEnd !== -1) {
    return { head: text.slice(0, boundaryEnd), rest: text.slice(boundaryEnd) }
  }

  // No sentence boundary fits — fall back to the last complete word.
  let cut = scanLimit
  while (cut > 0 && !isWhitespace(text[cut])) cut--

  if (cut === 0) {
    // The first word alone overflows the budget.
    let end = 0
    while (end < text.length && !isWhitespace(text[end])) end++
    return { head: `${text.slice(0, end)}…`, rest: text.slice(end) }
  }

  while (cut > 0 && TRAILING_STRIP.has(text[cut - 1])) cut--

  return { head: `${text.slice(0, cut)}…`, rest: text.slice(cut) }
}
