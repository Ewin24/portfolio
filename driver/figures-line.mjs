/**
 * Figures of type `line` (src/blog/figures/renderers/line.tsx): conceptual
 * line sketches on two axes without a scale.
 *
 * For each figure, in Spanish and English, in a fresh document per article: it
 * mounts in the article body, plays by itself to the last step, the controls
 * step it, the narration follows the step and the language, reduced motion
 * shows the final state at once, the dark theme leaves no light paper inside
 * it, and at 375 px nothing is below 12 px or wider than the figure.
 *
 * Reads the same hooks as driver/figures.mjs. Needs a server (BASE_URL,
 * default http://localhost:4193/portfolio/). Exits 0 when every check passes.
 */
import { BASE_URL, VIEWPORTS, newPage, openBrowser } from './helpers.mjs'

const MOBILE = VIEWPORTS[0]
const DESKTOP = VIEWPORTS[3]

/** [article slug, figure id, series drawn] */
const FIGURES = [
  ['el-arreglo-que-funciona-no-decide', 'workaround-cost', 2],
  ['con-ai-el-cuello-de-botella-son-tus-pruebas', 'ai-bottleneck-gap', 4],
  ['once-rondas-de-revision-no-son-un-usuario', 'review-rounds-ceiling', 1],
]
const LIGHT_PAPER = 'rgb(250, 250, 245)'

const failures = []
let checks = 0
function check(name, cond, extra = '') {
  checks++
  if (!cond) failures.push(`  ✗ ${name}${extra ? ` — ${extra}` : ''}`)
  else console.log(`  ✓ ${name}`)
}

async function open(browser, vp, lang, opts = {}) {
  const { ctx, page } = await newPage(browser, vp, lang, opts)
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  if (opts.theme) {
    await page.addInitScript((t) => {
      if (location.protocol.startsWith('http')) localStorage.setItem('portfolio-theme', t)
    }, opts.theme)
  }
  return { ctx, page, errors }
}

/** A fresh document per article: see driver/figures.mjs. */
async function openArticle(page, slug) {
  await page.goto('about:blank')
  await page.goto(`${BASE_URL}#blog/article/${slug}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.blog-article-body', { timeout: 10_000 })
  await page.waitForSelector('.blog-article-body figure[data-figure] .figure-mount > *', { timeout: 5_000 }).catch(() => {})
}

const root = (id) => `figure[data-figure="${id}"] .fig`

/** Player state plus, for every stepped element, whether it is actually visible. */
function figState(page, id) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (!el) return null
    return {
      type: el.dataset.figType,
      inBody: el.closest('figure')?.parentElement?.matches('.blog-article-body') ?? false,
      step: Number(el.dataset.figStep),
      steps: Number(el.dataset.figSteps),
      playing: el.dataset.figPlaying,
      narration: el.querySelector('.fig-narration')?.textContent?.trim() ?? '',
      count: el.querySelector('.fig-count')?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      series: el.querySelectorAll('.fig-line-series polyline').length,
      table: el.querySelectorAll('[data-fig-control="data"]').length,
      els: [...el.querySelectorAll('[data-step]')].map((n) => {
        const cs = getComputedStyle(n)
        return [Number(n.dataset.step), cs.visibility !== 'hidden' && Number(cs.opacity) > 0.9]
      }),
    }
  }, root(id))
}

/** True when exactly the elements of steps 1..step are visible. */
const builtUpTo = (s) => s.els.length > 0 && s.els.every(([at, vis]) => vis === (at <= s.step))

async function settled(page, id) {
  await page.waitForTimeout(900) // longer than any reveal transition
  return figState(page, id)
}

const control = (page, id, name) => page.locator(`${root(id)} [data-fig-control="${name}"]`)

async function run() {
  const browser = await openBrowser()
  try {
    // ── (1) (2) mounting, auto-play and the controls
    const narrations = { es: {}, en: {} }
    for (const lang of ['es', 'en']) {
      const { ctx, page, errors } = await open(browser, DESKTOP, lang)
      try {
        for (const [slug, id, series] of FIGURES) {
          const name = `${lang} ${id}`
          await openArticle(page, slug)
          const before = await figState(page, id)
          check(`(1) ${name}: mounts inside the article body as a line figure, waiting on step one`,
            !!before && before.type === 'line' && before.inBody && before.step === 1 && before.steps >= 2 && before.steps <= 6, JSON.stringify(before))
          if (!before) continue
          check(`(1) ${name}: draws its series and offers no data table`, before.series === series && before.table === 0, `${before.series} series, ${before.table} table`)

          await page.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: 'center', behavior: 'instant' }), root(id))
          await page.waitForFunction((sel) => {
            const el = document.querySelector(sel)
            return el.dataset.figStep === el.dataset.figSteps && el.dataset.figPlaying === 'false'
          }, root(id), { timeout: before.steps * 4000 }).catch(() => {})
          await page.waitForTimeout(2600) // one more step interval: it must not move again
          const end = await settled(page, id)
          check(`(2) ${name}: in view it plays by itself to the last step and stops`,
            end.step === end.steps && end.playing === 'false' && builtUpTo(end) && end.count === `${end.steps} / ${end.steps}`, JSON.stringify(end))

          await control(page, id, 'prev').click()
          const prev = await settled(page, id)
          check(`(2) ${name}: previous goes back one step and hides what belongs to the last one`,
            prev.step === end.steps - 1 && prev.count === `${end.steps - 1} / ${end.steps}` && builtUpTo(prev) && prev.els.some(([, v]) => !v), JSON.stringify(prev))

          await control(page, id, 'next').click()
          const next = await settled(page, id)
          check(`(2) ${name}: next advances one step`, next.step === end.steps && builtUpTo(next), JSON.stringify(next))

          await control(page, id, 'restart').click()
          const first = await settled(page, id)
          check(`(2) ${name}: restart returns to step one`,
            first.step === 1 && first.count === `1 / ${end.steps}` && builtUpTo(first) && first.els.some(([, v]) => !v), JSON.stringify(first))

          // Walk every step for its narration line.
          const lines = [first.narration]
          for (let i = 2; i <= end.steps; i++) {
            await control(page, id, 'next').click()
            lines.push((await figState(page, id)).narration)
          }
          narrations[lang][id] = lines
          check(`(3) ${name}: every step has its own narration line`,
            lines.every((l) => l.length > 0) && new Set(lines).size === lines.length, JSON.stringify(lines))
        }
        check(`(1-3) ${lang}: no page or console errors`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }
    for (const [, id] of FIGURES) {
      const es = narrations.es[id] ?? []
      const en = narrations.en[id] ?? []
      check(`(3) ${id}: the narration differs between languages on every step`,
        es.length > 0 && es.length === en.length && es.every((l, i) => l !== en[i]), JSON.stringify([es, en]))
    }

    // ── (4) reduced motion: final state at once, stepping still works
    {
      const { ctx, page, errors } = await open(browser, DESKTOP, 'en', { reducedMotion: 'reduce' })
      try {
        for (const [slug, id] of FIGURES) {
          await openArticle(page, slug)
          const s = await figState(page, id)
          check(`(4) ${id}: reduced motion shows the final state at once`, !!s && s.step === s.steps && s.playing === 'false' && builtUpTo(s), JSON.stringify(s))
          if (!s) continue
          await control(page, id, 'prev').click()
          const p = await settled(page, id)
          check(`(4) ${id}: reduced motion still steps`, p.step === s.steps - 1 && builtUpTo(p), JSON.stringify(p))
        }
        check('(4) no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (5) dark theme
    {
      const { ctx, page, errors } = await open(browser, DESKTOP, 'en', { reducedMotion: 'reduce', theme: 'dark' })
      try {
        for (const [slug, id] of FIGURES) {
          await openArticle(page, slug)
          const s = await page.evaluate(([sel, light]) => {
            const token = (name, prop) => {
              const probe = document.createElement('i')
              probe.style[prop] = `var(${name})`
              document.body.append(probe)
              const v = getComputedStyle(probe)[prop]
              probe.remove()
              return v
            }
            const el = document.querySelector(sel)
            if (!el) return null
            const ink = token('--color-ink', 'color')
            const inks = [ink, token('--color-ink-light', 'color')]
            const lightHits = []
            const offInk = []
            for (const n of [el, ...el.querySelectorAll('*')]) {
              const c = getComputedStyle(n)
              for (const p of ['color', 'backgroundColor', 'borderTopColor', 'borderLeftColor', 'fill', 'stroke']) {
                if (c[p] === light) lightHits.push(`${n.tagName}.${n.getAttribute('class') ?? ''} ${p}`)
              }
              // The labels of the drawing are ink; the remarks are the lighter ink.
              if (n.matches('.fig-line-label') && !inks.includes(c.color)) offInk.push(`${n.textContent.slice(0, 20)} ${c.color}`)
            }
            const cs = getComputedStyle(el)
            return {
              theme: document.documentElement.dataset.theme,
              bg: cs.backgroundColor, paper: token('--color-paper', 'backgroundColor'),
              color: cs.color, ink,
              labels: el.querySelectorAll('.fig-line-label').length,
              lightHits: lightHits.slice(0, 5), offInk: offInk.slice(0, 5),
            }
          }, [root(id), LIGHT_PAPER])
          check(`(5) ${id}: in the dark theme the figure sits on dark paper and its text is the dark ink token`,
            !!s && s.theme === 'dark' && s.bg === s.paper && s.paper !== LIGHT_PAPER && s.color === s.ink && s.labels > 0 && s.offInk.length === 0, JSON.stringify(s))
          check(`(5) ${id}: nothing inside the figure computes to the light paper colour`, !!s && s.lightHits.length === 0, JSON.stringify(s?.lightHits))
        }
        check('(5) no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (6) 375 px, final state
    for (const lang of ['es', 'en']) {
      const { ctx, page, errors } = await open(browser, MOBILE, lang, { reducedMotion: 'reduce' })
      try {
        for (const [slug, id] of FIGURES) {
          await openArticle(page, slug)
          const s = await page.evaluate((id) => {
            const out = { mounted: false, small: [], wide: [], pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }
            const figure = document.querySelector(`figure[data-figure="${id}"]`)
            const fig = figure?.querySelector('.fig')
            if (!fig) return out
            out.mounted = true
            const box = fig.getBoundingClientRect()
            const outside = (r) => r.width > 0 && (r.right > box.right + 1 || r.left < box.left - 1)
            for (const n of fig.querySelectorAll('*')) {
              const r = n.getBoundingClientRect()
              if (outside(r)) out.wide.push(`<${n.tagName.toLowerCase()} class="${n.getAttribute('class') ?? ''}"> ${Math.round(r.left)}..${Math.round(r.right)}`)
            }
            const walker = document.createTreeWalker(figure, NodeFilter.SHOW_TEXT)
            for (let n = walker.nextNode(); n; n = walker.nextNode()) {
              if (!n.textContent.trim()) continue
              const size = parseFloat(getComputedStyle(n.parentElement).fontSize)
              if (size < 12) out.small.push(`"${n.textContent.trim().slice(0, 24)}" ${size}px`)
              const range = document.createRange()
              range.selectNodeContents(n)
              const r = range.getBoundingClientRect()
              if (outside(r)) out.wide.push(`"${n.textContent.trim().slice(0, 24)}" ${Math.round(r.left)}..${Math.round(r.right)}`)
            }
            out.box = `${Math.round(box.left)}..${Math.round(box.right)}`
            return out
          }, id)
          const name = `${lang} ${id}`
          check(`(6) ${name}: mounted at 375`, s.mounted)
          check(`(6) ${name}: no text below 12 px at 375`, s.mounted && s.small.length === 0, s.small.slice(0, 4).join(' | '))
          check(`(6) ${name}: nothing is wider than the figure and the page does not overflow at 375`,
            s.mounted && s.pageOverflow <= 0 && s.wide.length === 0, `page +${s.pageOverflow}px; figure ${s.box}; ${s.wide.slice(0, 4).join(' | ')}`)
        }
        check(`(6) ${lang}: no page or console errors`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }
  } finally {
    await browser.close()
  }

  console.log(`\nLine figure checks: ${checks - failures.length}/${checks} passed`)
  if (failures.length) {
    console.log('FAILED:')
    console.log(failures.join('\n'))
    process.exit(1)
  }
  console.log('ALL PASSED')
}

run().catch((e) => { console.error(e); process.exit(1) })
