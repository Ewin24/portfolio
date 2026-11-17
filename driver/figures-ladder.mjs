/**
 * Figures of type `ladder` (src/blog/figures/renderers/ladder.tsx).
 *
 * For each figure, in ES and EN, in a fresh document per article: it mounts
 * inside the article body, plays by itself to the last step, the controls move
 * the step and what is shown, the narration follows step and language, reduced
 * motion rests on the final state, the dark theme leaves no light paper
 * behind, and at 375 px nothing is small or overflows.
 *
 * Needs a server (BASE_URL, default http://localhost:4193/portfolio/).
 * SHOTS=<directory> also writes screenshots there (final and middle step,
 * 1440 and 375 px, light and dark). Exits 0 when every check passes.
 */
import path from 'node:path'
import { BASE_URL, VIEWPORTS, newPage, openBrowser } from './helpers.mjs'

const MOBILE = VIEWPORTS[0]
const DESKTOP = VIEWPORTS[3]
const LIGHT_PAPER = 'rgb(250, 250, 245)'
const SHOTS = process.env.SHOTS

/** [article slug, figure id] */
const FIGURES = [
  ['dale-al-agente-algo-que-pueda-fallar', 'agent-contract-ladder'],
  ['publica-lo-que-mediste', 'publish-measured-check'],
  ['ordena-las-hipotesis-por-costo-de-refutar', 'hypotheses-case-checks'],
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

async function openArticle(page, slug, id) {
  await page.goto('about:blank')
  await page.goto(`${BASE_URL}#blog/article/${slug}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.blog-article-body', { timeout: 10_000 })
  await page.waitForSelector(`figure[data-figure="${id}"] .figure-mount > *`, { timeout: 5_000 }).catch(() => {})
}

const root = (id) => `figure[data-figure="${id}"] .fig`

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

const scrollTo = (page, id) =>
  page.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: 'center', behavior: 'instant' }), root(id))

const control = (page, id, name) => page.locator(`${root(id)} [data-fig-control="${name}"]`)

async function shot(page, id, name) {
  if (!SHOTS) return
  await page.locator(`figure[data-figure="${id}"]`).screenshot({ path: path.join(SHOTS, `${name}.png`) })
}

async function run() {
  const browser = await openBrowser()
  try {
    // ── mounting and the player
    const narrations = {}
    for (const lang of ['es', 'en']) {
      const { ctx, page, errors } = await open(browser, DESKTOP, lang)
      try {
        for (const [slug, id] of FIGURES) {
          const name = `${lang} ${id}`
          await openArticle(page, slug, id)
          const before = await figState(page, id)
          check(`${name}: mounts as a ladder inside the article body`, before?.type === 'ladder' && before.inBody, JSON.stringify(before))
          if (!before) continue
          check(`${name}: has between 2 and 6 steps and waits on the first`, before.step === 1 && before.steps >= 2 && before.steps <= 6, JSON.stringify(before))

          await scrollTo(page, id)
          await page.waitForFunction((sel) => {
            const el = document.querySelector(sel)
            return el.dataset.figStep === el.dataset.figSteps && el.dataset.figPlaying === 'false'
          }, root(id), { timeout: before.steps * 4000 }).catch(() => {})
          await page.waitForTimeout(3000)
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

          narrations[id] ??= {}
          narrations[id][lang] = [before.narration, prev.narration, end.narration]
          check(`${name}: a conceptual figure offers no data table`, (await control(page, id, 'data').count()) === 0)
        }
        check(`${lang}: no page or console errors while playing`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }
    for (const [, id] of FIGURES) {
      const n = narrations[id] ?? {}
      check(`${id}: the narration differs between languages on every step sampled`,
        !!n.es && !!n.en && n.es.every((line, i) => line.length > 0 && line !== n.en[i]), JSON.stringify(n))
    }

    // ── reduced motion, light and dark, 1440 and 375
    for (const lang of ['es', 'en']) {
      for (const theme of ['light', 'dark']) {
        for (const vp of [DESKTOP, MOBILE]) {
          const { ctx, page, errors } = await open(browser, vp, lang, { reducedMotion: 'reduce', theme })
          try {
            for (const [slug, id] of FIGURES) {
              const name = `${lang} ${theme} ${vp.name} ${id}`
              await openArticle(page, slug, id)
              const s = await figState(page, id)
              check(`${name}: reduced motion shows the final state at once`, !!s && s.step === s.steps && s.playing === 'false' && builtUpTo(s), JSON.stringify(s))
              if (!s) continue
              await scrollTo(page, id)
              await shot(page, id, `${id}-${lang}-${theme}-${vp.name}-final`)

              const m = await page.evaluate(([figId, light]) => {
                const token = (name, prop) => {
                  const probe = document.createElement('i')
                  probe.style[prop] = `var(${name})`
                  document.body.append(probe)
                  const v = getComputedStyle(probe)[prop]
                  probe.remove()
                  return v
                }
                const figure = document.querySelector(`figure[data-figure="${figId}"]`)
                const fig = figure.querySelector('.fig')
                const box = fig.getBoundingClientRect()
                const out = {
                  theme: document.documentElement.dataset.theme ?? 'light',
                  bg: getComputedStyle(fig).backgroundColor, paper: token('--color-paper', 'backgroundColor'),
                  color: getComputedStyle(fig).color, ink: token('--color-ink', 'color'),
                  lightHits: [], small: [], wide: [],
                  pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
                }
                for (const n of [fig, ...fig.querySelectorAll('*')]) {
                  const c = getComputedStyle(n)
                  for (const p of ['color', 'backgroundColor', 'borderTopColor', 'borderLeftColor', 'fill', 'stroke']) {
                    if (c[p] === light) out.lightHits.push(`${n.tagName}.${n.getAttribute('class') ?? ''} ${p}`)
                  }
                  const r = n.getBoundingClientRect()
                  if (r.width > box.width + 1 || r.right > box.right + 1 || r.left < box.left - 1) {
                    out.wide.push(`${n.tagName}.${n.getAttribute('class') ?? ''} ${Math.round(r.left)}..${Math.round(r.right)} outside ${Math.round(box.left)}..${Math.round(box.right)}`)
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
                  if (r.width > 0 && (r.right > box.right + 1 || r.left < box.left - 1)) out.wide.push(`"${n.textContent.trim().slice(0, 24)}" ${Math.round(r.left)}..${Math.round(r.right)}`)
                }
                return out
              }, [id, LIGHT_PAPER])

              if (theme === 'dark') {
                check(`${name}: dark paper and dark-theme ink`, m.theme === 'dark' && m.bg === m.paper && m.color === m.ink && m.paper !== LIGHT_PAPER, JSON.stringify(m))
                check(`${name}: nothing computes to the light paper colour`, m.lightHits.length === 0, m.lightHits.slice(0, 5).join(' | '))
              }
              check(`${name}: no text below 12 px`, m.small.length === 0, m.small.slice(0, 4).join(' | '))
              check(`${name}: nothing is wider than the figure and the page does not overflow`, m.pageOverflow <= 0 && m.wide.length === 0, `page +${m.pageOverflow}px; ${m.wide.slice(0, 4).join(' | ')}`)

              // A middle step: the controls still step, with no transition to wait for.
              const middle = Math.ceil(s.steps / 2)
              await page.locator(`${root(id)} [data-fig-mark="${middle}"]`).click()
              await page.waitForTimeout(150)
              const mid = await figState(page, id)
              check(`${name}: a step mark jumps to its step under reduced motion`, mid.step === middle && builtUpTo(mid) && mid.els.some(([, v]) => !v), JSON.stringify(mid))
              await shot(page, id, `${id}-${lang}-${theme}-${vp.name}-step${middle}`)
            }
            check(`${lang} ${theme} ${vp.name}: no page or console errors`, errors.length === 0, errors.join(' | '))
          } finally { await ctx.close() }
        }
      }
    }
  } finally {
    await browser.close()
  }

  console.log(`\nLadder figure checks: ${checks - failures.length}/${checks} passed`)
  if (failures.length) {
    console.log('FAILED:')
    console.log(failures.join('\n'))
    process.exit(1)
  }
  console.log('ALL PASSED')
}

run().catch((e) => { console.error(e); process.exit(1) })
