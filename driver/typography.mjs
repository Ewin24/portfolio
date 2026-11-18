/**
 * Type floor, touch targets and article measure.
 *
 * On the home page and on one article, in light and dark, at 375 and 1440:
 *
 *  - no visible text node is under 12px; 11px is allowed only for uppercase
 *    labels (kickers, stamps);
 *  - at 375, every link, button and summary in `main` can be hit over at least
 *    44px of height (the article page has no `main`: its `.blog-full` wrapper
 *    stands in). The hit area is probed with `elementFromPoint`, so padding
 *    and pseudo-elements that extend a compact chip count. A link that sits
 *    inline in running text is exempt (WCAG 2.5.8, inline exception);
 *  - at 1440, article paragraphs render 65-75 characters per full line, in the
 *    normal view and in reading mode.
 *
 * The case studies (`#projects`) and the stack (`#skills`) have their own
 * drivers and are left out here.
 *
 * Needs a server (BASE_URL, default http://localhost:4193/portfolio/).
 * Exits 0 when every check passes.
 */
import { BASE_URL, VIEWPORTS, newPage, openBrowser } from './helpers.mjs'

const SLUG = 'getdate-vs-sysdatetime-reloj-que-retrocede'
const PAGES = [
  { name: 'home', url: BASE_URL },
  { name: 'article', url: `${BASE_URL}#blog/article/${SLUG}` },
]
const VPS = VIEWPORTS.filter((v) => v.name === '375' || v.name === '1440')
const EXCLUDED = '#projects, #skills'
const MIN_TEXT = 12
const MIN_LABEL = 11
const MIN_TARGET = 44
const MEASURE = [65, 75]

const failures = []
let checks = 0
function check(name, cond, extra = '') {
  checks++
  if (!cond) failures.push(`  ✗ ${name}${extra ? `\n${extra}` : ''}`)
  else console.log(`  ✓ ${name}`)
}

async function open(browser, vp, theme, url) {
  const { ctx, page } = await newPage(browser, vp, 'es', { reducedMotion: 'reduce' })
  await page.addInitScript((t) => {
    try { localStorage.setItem('portfolio-theme', t) } catch { /* private mode */ }
  }, theme)
  await page.goto(url, { waitUntil: 'networkidle' })
  // Walk the page once so lazy sections mount and entrances settle.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 40))
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
  await page.waitForTimeout(300)
  return { ctx, page }
}

/** Text nodes under the floor, grouped by the element that sets their size. */
function smallText(page) {
  return page.evaluate(({ excluded, minText, minLabel }) => {
    const groups = new Map()
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const el = node.parentElement
      if (!node.textContent.trim() || !el || el.closest(`${excluded}, script, style, noscript`)) continue
      const rect = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      // Nothing rendered, or clipped to a pixel for screen readers only.
      if (rect.width <= 1 || rect.height <= 1 || cs.visibility === 'hidden') continue
      const size = parseFloat(cs.fontSize)
      const floor = cs.textTransform === 'uppercase' ? minLabel : minText
      if (size >= floor - 0.01) continue
      const key = `${size}px ${el.tagName.toLowerCase()}.${String(el.className?.baseVal ?? el.className).slice(0, 70)}`
      const g = groups.get(key) ?? { count: 0, sample: node.textContent.trim().slice(0, 40) }
      g.count++
      groups.set(key, g)
    }
    return [...groups].map(([key, g]) => ({ key, ...g })).sort((a, b) => b.count - a.count)
  }, { excluded: EXCLUDED, minText: MIN_TEXT, minLabel: MIN_LABEL })
}

/** Controls in `main` whose hit area is shorter than the minimum. */
function shortTargets(page) {
  return page.evaluate(({ excluded, min }) => {
    const out = []
    for (const el of document.querySelectorAll(':is(main, .blog-full) :is(a, button, summary, [role="button"])')) {
      if (el.closest(excluded)) continue
      // An inline link inside a sentence cannot grow without pushing the lines apart.
      if (el.tagName === 'A' && getComputedStyle(el).display === 'inline' &&
        [...el.parentElement.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 1)) continue
      el.scrollIntoView({ block: 'center', behavior: 'instant' })
      const rect = el.getClientRects()[0]
      if (!rect || rect.width === 0 || rect.height === 0) continue
      const x = Math.min(Math.max(rect.left + rect.width / 2, 1), window.innerWidth - 2)
      const cy = rect.top + rect.height / 2
      const owns = (y) => el.contains(document.elementFromPoint(x, y))
      if (!owns(cy)) continue // covered by something else: not reachable here at all
      let height = 1
      for (let d = 1; d <= min && owns(cy - d); d++) height++
      for (let d = 1; d <= min && owns(cy + d); d++) height++
      if (height < min) {
        out.push(`${height}px ${el.tagName.toLowerCase()}.${String(el.className?.baseVal ?? el.className).slice(0, 60)} "${(el.textContent.trim() || el.getAttribute('aria-label') || '').slice(0, 30)}"`)
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    return out
  }, { excluded: EXCLUDED, min: MIN_TARGET })
}

/** Characters per full line of each body paragraph that runs four lines or more. */
function paragraphMeasures(page) {
  return page.evaluate(() => {
    const out = []
    const range = document.createRange()
    for (const p of document.querySelectorAll('.blog-article-body > p')) {
      const lineHeight = parseFloat(getComputedStyle(p).lineHeight)
      const lines = []
      let top = -Infinity
      const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT)
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        for (let i = 0; i < node.length; i++) {
          range.setStart(node, i)
          range.setEnd(node, i + 1)
          const r = range.getBoundingClientRect()
          if (r.height === 0) continue
          if (r.top > top + lineHeight / 2) { lines.push(0); top = r.top }
          lines[lines.length - 1]++
        }
      }
      if (lines.length < 4) continue
      const full = lines.slice(0, -1)
      out.push(Math.round(full.reduce((a, b) => a + b, 0) / full.length))
    }
    return out
  })
}

const list = (items, n = 30) => items.slice(0, n).map((s) => `      ${s}`).join('\n') + (items.length > n ? `\n      … ${items.length - n} more` : '')

async function run() {
  const browser = await openBrowser()
  try {
    for (const theme of ['light', 'dark']) {
      for (const vp of VPS) {
        for (const target of PAGES) {
          const where = `${target.name} ${vp.name} ${theme}`
          const { ctx, page } = await open(browser, vp, theme, target.url)
          try {
            const small = await smallText(page)
            const total = small.reduce((n, g) => n + g.count, 0)
            check(`${where}: no text under ${MIN_TEXT}px (uppercase labels ${MIN_LABEL}px)`, total === 0,
              `      ${total} text nodes\n${list(small.map((g) => `${g.count}× ${g.key} "${g.sample}"`))}`)

            if (vp.name === '375') {
              const short = await shortTargets(page)
              check(`${where}: links and buttons in main are hit over ${MIN_TARGET}px`, short.length === 0,
                `      ${short.length} controls\n${list(short)}`)
            }

            if (vp.name === '1440' && target.name === 'article') {
              for (const mode of ['normal', 'reading']) {
                if (mode === 'reading') {
                  await page.locator('[data-reading-toggle]').click()
                  await page.waitForTimeout(200)
                }
                const m = await paragraphMeasures(page)
                const off = m.filter((c) => c < MEASURE[0] || c > MEASURE[1])
                check(`${where} ${mode}: paragraphs render ${MEASURE[0]}-${MEASURE[1]} characters per line`,
                  m.length > 0 && off.length === 0, `      per paragraph: ${m.join(', ')}`)
              }
            }
          } finally { await ctx.close() }
        }
      }
    }
  } finally { await browser.close() }

  console.log(`\n${checks - failures.length}/${checks} checks passed`)
  if (failures.length) {
    console.log(failures.join('\n'))
    process.exit(1)
  }
}

run().catch((e) => { console.error(e); process.exit(1) })
