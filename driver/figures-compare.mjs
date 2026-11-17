/**
 * Figure types `compare` and `tracks` (src/blog/figures/renderers).
 *
 * The same hooks as driver/figures.mjs: `.fig[data-fig-type][data-fig-step]
 * [data-fig-steps][data-fig-playing]`, `[data-step][data-on]` on every revealed
 * element, `.fig-narration`, `.fig-count`, `[data-fig-control]`.
 *
 * Needs a server (BASE_URL, default http://localhost:4193/portfolio/).
 * Exits 0 when every check passes.
 */
import { BASE_URL, VIEWPORTS, newPage, openBrowser } from './helpers.mjs'

const MOBILE = VIEWPORTS[0]
const DESKTOP = VIEWPORTS[3]

/** [article slug, figure id, type] */
const FIGURES = [
  ['una-herramienta-para-un-agente-es-una-api', 'agent-tools-steps', 'compare'],
  ['una-herramienta-para-un-agente-es-una-api', 'agent-tools-contrast', 'compare'],
  ['tu-proximo-lector-es-un-modelo', 'next-reader-extraction', 'tracks'],
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
      inBody: el.closest('figure')?.parentElement?.classList.contains('blog-article-body') ?? false,
      step: Number(el.dataset.figStep),
      steps: Number(el.dataset.figSteps),
      playing: el.dataset.figPlaying,
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
  await page.waitForTimeout(700) // longer than any reveal transition
  return figState(page, id)
}

const control = (page, id, name) => page.locator(`${root(id)} [data-fig-control="${name}"]`)

async function run() {
  const browser = await openBrowser()
  try {
    // ── mounting, auto-play and the player, in both languages
    const narrations = { es: {}, en: {} }
    for (const lang of ['es', 'en']) {
      const { ctx, page, errors } = await open(browser, DESKTOP, lang)
      try {
        for (const [slug, id, type] of FIGURES) {
          const name = `${lang} ${id}`
          await openArticle(page, slug)
          const before = await figState(page, id)
          check(`${name}: mounts inside the article body as a ${type} figure`, before?.type === type && before.inBody, JSON.stringify(before))
          if (!before) continue
          check(`${name}: has between 2 and 6 steps and waits on the first`, before.steps >= 2 && before.steps <= 6 && before.step === 1, `${before.step} / ${before.steps}`)
          narrations[lang][id] = before.narration

          await page.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: 'center', behavior: 'instant' }), root(id))
          await page.waitForFunction((sel) => {
            const el = document.querySelector(sel)
            return el.dataset.figStep === el.dataset.figSteps && el.dataset.figPlaying === 'false'
          }, root(id), { timeout: before.steps * 4000 }).catch(() => {})
          const end = await settled(page, id)
          check(`${name}: in view it plays by itself to the last step and stops`,
            end.step === end.steps && end.playing === 'false' && builtUpTo(end) && end.count === `${end.steps} / ${end.steps}`, JSON.stringify(end))

          await control(page, id, 'prev').click()
          const prev = await settled(page, id)
          check(`${name}: previous goes back one step and hides what belongs to the last one`,
            prev.step === end.steps - 1 && prev.count === `${end.steps - 1} / ${end.steps}` && builtUpTo(prev) && prev.els.some(([, v]) => !v), JSON.stringify(prev))
          check(`${name}: the narration changes with the step`, prev.narration.length > 0 && prev.narration !== end.narration, `${prev.narration} | ${end.narration}`)

          await control(page, id, 'next').click()
          const next = await settled(page, id)
          check(`${name}: next advances one step`, next.step === end.steps && builtUpTo(next), JSON.stringify(next))

          await control(page, id, 'restart').click()
          const first = await settled(page, id)
          check(`${name}: restart returns to step one`,
            first.step === 1 && first.count === `1 / ${end.steps}` && builtUpTo(first) && first.narration === before.narration, JSON.stringify(first))

          check(`${name}: a conceptual figure offers no data table`, (await control(page, id, 'data').count()) === 0)
        }

        // Structure a screen reader depends on.
        await openArticle(page, FIGURES[0][0])
        const tables = await page.evaluate((ids) => ids.map((id) => {
          const t = document.querySelector(`figure[data-figure="${id}"] .fig table`)
          return t && {
            cols: t.querySelectorAll('thead th[scope="col"]').length,
            rows: t.querySelectorAll('tbody th[scope="row"]').length,
            cells: t.querySelectorAll('tbody td').length,
            emphasised: t.querySelectorAll('thead th[data-emphasis="true"]').length,
          }
        }), ['agent-tools-steps', 'agent-tools-contrast'])
        check(`${lang} agent-tools-steps: a real table, three column headers, four row headers, one emphasised`,
          JSON.stringify(tables[0]) === JSON.stringify({ cols: 3, rows: 4, cells: 8, emphasised: 1 }), JSON.stringify(tables[0]))
        check(`${lang} agent-tools-contrast: a real table, a header per column and per section, one emphasised`,
          JSON.stringify(tables[1]) === JSON.stringify({ cols: 3, rows: 4, cells: 8, emphasised: 1 }), JSON.stringify(tables[1]))

        await openArticle(page, FIGURES[2][0])
        const tracks = await page.evaluate((sel) => {
          const el = document.querySelector(sel)
          return el && {
            stages: el.querySelectorAll('.fig-tracks-stage').length,
            rows: el.querySelectorAll('.fig-tracks-row').length,
            lost: el.querySelectorAll('.fig-tracks-row[data-lost="true"]').length,
          }
        }, root('next-reader-extraction'))
        check(`${lang} next-reader-extraction: three stages, four tracks, two of them lose their referent`,
          JSON.stringify(tracks) === JSON.stringify({ stages: 3, rows: 4, lost: 2 }), JSON.stringify(tracks))

        check(`${lang}: no page or console errors`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }
    for (const [, id] of FIGURES) {
      const es = narrations.es[id] ?? ''
      const en = narrations.en[id] ?? ''
      check(`${id}: the narration follows the language`, es.length > 0 && en.length > 0 && es !== en, `${es} | ${en}`)
    }

    // ── reduced motion: final state at once, stepping still works
    {
      const { ctx, page, errors } = await open(browser, DESKTOP, 'en', { reducedMotion: 'reduce' })
      try {
        for (const [slug, id] of FIGURES) {
          await openArticle(page, slug)
          const s = await figState(page, id)
          check(`${id}: reduced motion shows the final state at once`, !!s && s.step === s.steps && s.playing === 'false' && builtUpTo(s), JSON.stringify(s))
          if (!s) continue
          await control(page, id, 'prev').click()
          await page.waitForTimeout(100)
          const p = await figState(page, id)
          check(`${id}: reduced motion still steps`, p.step === s.steps - 1 && builtUpTo(p), JSON.stringify(p))
        }
        check('reduced motion: no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── dark theme
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
            const textTokens = [ink, token('--color-ink-light', 'color'), token('--color-ink-muted', 'color'), token('--color-on-ink', 'color')]
            const lightHits = []
            for (const n of [el, ...el.querySelectorAll('*')]) {
              const c = getComputedStyle(n)
              for (const p of ['color', 'backgroundColor', 'borderTopColor', 'borderLeftColor', 'fill', 'stroke']) {
                if (c[p] === light) lightHits.push(`${n.tagName}.${n.getAttribute('class') ?? ''} ${p}`)
              }
            }
            const offToken = []
            const walker = document.createTreeWalker(el.querySelector('.fig-stage'), NodeFilter.SHOW_TEXT)
            for (let n = walker.nextNode(); n; n = walker.nextNode()) {
              if (!n.textContent.trim()) continue
              const color = getComputedStyle(n.parentElement).color
              if (!textTokens.includes(color)) offToken.push(`"${n.textContent.trim().slice(0, 24)}" ${color}`)
            }
            return {
              theme: document.documentElement.dataset.theme,
              bg: getComputedStyle(el).backgroundColor, paper: token('--color-paper', 'backgroundColor'),
              color: getComputedStyle(el).color, ink,
              lightHits: lightHits.slice(0, 5), offToken: offToken.slice(0, 5),
            }
          }, [root(id), LIGHT_PAPER])
          check(`${id}: in the dark theme the figure sits on dark paper with dark-theme ink`,
            !!s && s.theme === 'dark' && s.bg === s.paper && s.color === s.ink && s.paper !== LIGHT_PAPER, JSON.stringify(s))
          check(`${id}: nothing inside the figure computes to the light paper colour`, !!s && s.lightHits.length === 0, JSON.stringify(s?.lightHits))
          check(`${id}: every text in the stage is in a dark-theme ink token`, !!s && s.offToken.length === 0, JSON.stringify(s?.offToken))
        }
        check('dark theme: no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── 375 px, final state
    for (const lang of ['es', 'en']) {
      const { ctx, page, errors } = await open(browser, MOBILE, lang, { reducedMotion: 'reduce' })
      try {
        for (const [slug, id] of FIGURES) {
          await openArticle(page, slug)
          const s = await page.evaluate((id) => {
            const out = { missing: false, small: [], wide: [], pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }
            const figure = document.querySelector(`figure[data-figure="${id}"]`)
            const fig = figure?.querySelector('.fig')
            if (!fig) return { ...out, missing: true }
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
          const name = `${lang} ${id} at 375`
          check(`${name}: mounted`, !s.missing)
          check(`${name}: no text below 12 px`, !s.missing && s.small.length === 0, s.small.slice(0, 4).join(' | '))
          check(`${name}: nothing is wider than the figure and the page does not overflow`,
            !s.missing && s.pageOverflow <= 0 && s.wide.length === 0, `page +${s.pageOverflow}px; ${s.wide.slice(0, 4).join(' | ')}`)
        }
        check(`${lang} at 375: no page or console errors`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }
  } finally {
    await browser.close()
  }

  console.log(`\nCompare and tracks checks: ${checks - failures.length}/${checks} passed`)
  if (failures.length) {
    console.log('FAILED:')
    console.log(failures.join('\n'))
    process.exit(1)
  }
  console.log('ALL PASSED')
}

run().catch((e) => { console.error(e); process.exit(1) })
