/**
 * Figure types `layers` and `segments` (src/blog/figures/renderers).
 *
 * Same hooks as driver/figures.mjs: `.fig[data-fig-type][data-fig-step]
 * [data-fig-steps][data-fig-playing]`, `[data-step][data-on]` on every revealed
 * element, `.fig-narration`, `.fig-count`, `[data-fig-control]`.
 *
 * Needs a server (BASE_URL, default http://localhost:4193/portfolio/).
 * Exits 0 when every check passes.
 */
import { BASE_URL, VIEWPORTS, newPage, openBrowser } from './helpers.mjs'

const MOBILE = VIEWPORTS[0]
const DESKTOP = VIEWPORTS[3]
const LIGHT_PAPER = 'rgb(250, 250, 245)'

/** [article slug, figure id, type, a label that must be on the stage per language] */
const FIGURES = [
  ['el-modelo-es-la-parte-facil-el-arnes-decide', 'harness-layers', 'layers', { es: 'cuándo para y pregunta', en: 'when it stops and asks' }],
  ['el-contexto-es-presupuesto', 'context-budget-window', 'segments', { es: 'espacio libre', en: 'free space' }],
]

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

/** A fresh document per article. */
async function openArticle(page, slug) {
  await page.goto('about:blank')
  await page.goto(`${BASE_URL}#blog/article/${slug}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.blog-article-body', { timeout: 10_000 })
  await page.waitForSelector('.blog-article-body figure[data-figure] .figure-mount > *', { timeout: 5_000 }).catch(() => {})
}

const root = (id) => `figure[data-figure="${id}"] .fig`

function figState(page, id) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (!el) return null
    return {
      type: el.dataset.figType,
      inBody: !!el.closest('.blog-article-body'),
      step: Number(el.dataset.figStep),
      steps: Number(el.dataset.figSteps),
      playing: el.dataset.figPlaying,
      stage: el.querySelector('.fig-stage')?.textContent ?? '',
      narration: el.querySelector('.fig-narration')?.textContent?.trim() ?? '',
      count: el.querySelector('.fig-count')?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      // [step the element belongs to, visible now]
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
  await page.waitForTimeout(1100) // longer than any reveal transition, queued ones included
  return figState(page, id)
}

const scrollTo = (page, id) =>
  page.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: 'center', behavior: 'instant' }), root(id))

const control = (page, id, name) => page.locator(`${root(id)} [data-fig-control="${name}"]`)

async function run() {
  const browser = await openBrowser()
  try {
    // ── (1) (2) mounting and the player, per figure and language
    const first = {}
    for (const lang of ['es', 'en']) {
      for (const [slug, id, type, label] of FIGURES) {
        const { ctx, page, errors } = await open(browser, DESKTOP, lang)
        const name = `${lang} ${id}`
        try {
          await openArticle(page, slug)
          const before = await figState(page, id)
          check(`(1) ${name}: mounts inside the article body as a ${type} figure`,
            !!before && before.type === type && before.inBody && before.stage.includes(label[lang]), JSON.stringify(before)?.slice(0, 300))
          if (!before) continue
          check(`(1) ${name}: has between 2 and 6 steps and waits on step one`, before.step === 1 && before.steps >= 2 && before.steps <= 6, `${before.step}/${before.steps}`)
          first[`${id} ${lang}`] = before.narration

          await scrollTo(page, id)
          await page.waitForFunction((sel) => {
            const el = document.querySelector(sel)
            return el.dataset.figStep === el.dataset.figSteps && el.dataset.figPlaying === 'false'
          }, root(id), { timeout: before.steps * 4000 }).catch(() => {})
          const end = await settled(page, id)
          check(`(2) ${name}: in view it plays by itself to the last step and stops`,
            end.step === end.steps && end.playing === 'false' && builtUpTo(end), JSON.stringify(end.els))
          await page.waitForTimeout(3000)
          check(`(2) ${name}: it stays on the last step`, (await figState(page, id)).step === end.steps)

          await control(page, id, 'prev').click()
          const prev = await settled(page, id)
          check(`(2) ${name}: previous moves the indicator back and hides the last step's elements`,
            prev.step === end.steps - 1 && prev.count === `${end.steps - 1} / ${end.steps}` && builtUpTo(prev) && prev.els.some(([, v]) => !v), JSON.stringify(prev.els))
          check(`(2) ${name}: the narration changes with the step`, prev.narration.length > 0 && prev.narration !== end.narration, prev.narration)

          await control(page, id, 'next').click()
          const next = await settled(page, id)
          check(`(2) ${name}: next advances and shows them again`, next.step === end.steps && next.count === `${end.steps} / ${end.steps}` && builtUpTo(next), JSON.stringify(next.els))

          await control(page, id, 'restart').click()
          const one = await settled(page, id)
          check(`(2) ${name}: restart returns to step one`,
            one.step === 1 && one.count === `1 / ${end.steps}` && builtUpTo(one) && one.narration === before.narration, JSON.stringify(one.els))
          check(`(2) ${name}: a conceptual figure offers no data table`, (await control(page, id, 'data').count()) === 0)
          check(`(1-2) ${name}: no page or console errors`, errors.length === 0, errors.join(' | '))
        } finally { await ctx.close() }
      }
    }
    for (const [, id] of FIGURES) {
      const es = first[`${id} es`] ?? ''
      const en = first[`${id} en`] ?? ''
      check(`(2) ${id}: the narration differs between languages`, es.length > 0 && en.length > 0 && es !== en, `${es} | ${en}`)
    }

    // ── (3) reduced motion: the final state at once
    for (const lang of ['es', 'en']) {
      const { ctx, page, errors } = await open(browser, DESKTOP, lang, { reducedMotion: 'reduce' })
      try {
        for (const [slug, id] of FIGURES) {
          await openArticle(page, slug)
          const s = await figState(page, id)
          check(`(3) ${lang} ${id}: reduced motion shows the final state at once`, !!s && s.step === s.steps && s.playing === 'false' && builtUpTo(s), JSON.stringify(s)?.slice(0, 300))
        }
        check(`(3) ${lang}: no page or console errors`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (4) dark theme
    for (const lang of ['es', 'en']) {
      const { ctx, page, errors } = await open(browser, DESKTOP, lang, { reducedMotion: 'reduce', theme: 'dark' })
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
            const cs = getComputedStyle(el)
            const lightHits = []
            for (const n of [el, ...el.querySelectorAll('*')]) {
              const c = getComputedStyle(n)
              for (const p of ['color', 'backgroundColor', 'borderTopColor', 'borderLeftColor', 'outlineColor', 'fill', 'stroke']) {
                if (c[p] === light) lightHits.push(`${n.tagName}.${n.getAttribute('class') ?? ''} ${p}`)
              }
            }
            return {
              theme: document.documentElement.dataset.theme,
              bg: cs.backgroundColor, paper: token('--color-paper', 'backgroundColor'),
              color: cs.color, ink: token('--color-ink', 'color'),
              lightHits: lightHits.slice(0, 5),
            }
          }, [root(id), LIGHT_PAPER])
          check(`(4) ${lang} ${id}: in the dark theme the figure sits on dark paper and its text is the dark ink token`,
            !!s && s.theme === 'dark' && s.bg === s.paper && s.color === s.ink && s.paper !== LIGHT_PAPER, JSON.stringify(s))
          check(`(4) ${lang} ${id}: nothing inside the figure computes to the light paper colour`, !!s && s.lightHits.length === 0, JSON.stringify(s?.lightHits))
        }
        check(`(4) ${lang}: no page or console errors`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (5) 375 px, final state
    for (const lang of ['es', 'en']) {
      const { ctx, page, errors } = await open(browser, MOBILE, lang, { reducedMotion: 'reduce' })
      try {
        for (const [slug, id] of FIGURES) {
          await openArticle(page, slug)
          const s = await page.evaluate((id) => {
            const figure = document.querySelector(`figure[data-figure="${id}"]`)
            const fig = figure?.querySelector('.fig')
            if (!fig) return null
            const out = { small: [], wide: [], pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }
            const box = fig.getBoundingClientRect()
            for (const n of fig.querySelectorAll('*')) {
              const r = n.getBoundingClientRect()
              if (r.width > box.width + 1 || (r.width > 0 && (r.right > box.right + 1 || r.left < box.left - 1))) {
                out.wide.push(`<${n.tagName.toLowerCase()} class="${n.getAttribute('class') ?? ''}"> ${Math.round(r.left)}..${Math.round(r.right)} outside ${Math.round(box.left)}..${Math.round(box.right)}`)
              }
            }
            const walker = document.createTreeWalker(figure, NodeFilter.SHOW_TEXT)
            for (let n = walker.nextNode(); n; n = walker.nextNode()) {
              if (!n.textContent.trim()) continue
              const size = parseFloat(getComputedStyle(n.parentElement).fontSize)
              if (size < 12) out.small.push(`"${n.textContent.trim().slice(0, 24)}" ${size}px`)
              const range = document.createRange()
              range.selectNodeContents(n)
              const r = range.getBoundingClientRect()
              if (r.width > 0 && (r.right > box.right + 1 || r.left < box.left - 1)) {
                out.wide.push(`"${n.textContent.trim().slice(0, 24)}" ${Math.round(r.left)}..${Math.round(r.right)} outside ${Math.round(box.left)}..${Math.round(box.right)}`)
              }
            }
            return out
          }, id)
          const name = `${lang} ${id}`
          check(`(5) ${name}: mounted at 375`, !!s)
          if (!s) continue
          check(`(5) ${name}: no text below 12 px at 375`, s.small.length === 0, s.small.slice(0, 4).join(' | '))
          check(`(5) ${name}: nothing is wider than the figure at 375`, s.wide.length === 0, s.wide.slice(0, 4).join(' | '))
          check(`(5) ${name}: the page has no horizontal overflow at 375`, s.pageOverflow <= 0, `+${s.pageOverflow}px`)
        }
        check(`(5) ${lang}: no page or console errors`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }
  } finally {
    await browser.close()
  }

  console.log(`\nLayers and segments checks: ${checks - failures.length}/${checks} passed`)
  if (failures.length) {
    console.log('FAILED:')
    console.log(failures.join('\n'))
    process.exit(1)
  }
  console.log('ALL PASSED')
}

run().catch((e) => { console.error(e); process.exit(1) })
