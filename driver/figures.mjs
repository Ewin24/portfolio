/**
 * Interactive article figures (src/blog/figures).
 *
 * An article places a figure with `![alt](figure/<id> "Caption")`. The parser
 * emits `<figure data-figure="<id>">` with a mount node, and the article mounts
 * the figure there: a stepwise presentation with a player, a narration line and,
 * for data charts, a table.
 *
 * Hooks this driver reads: `.fig[data-fig-type][data-fig-step][data-fig-steps]
 * [data-fig-playing]`, `[data-step][data-on]` on every revealed element,
 * `.fig-narration`, `.fig-count`, `[data-fig-control]`, `[data-fig-mark]`,
 * `.fig-table`, `.fig-fallback`.
 *
 * Needs a server (BASE_URL, default http://localhost:4193/portfolio/).
 * Exits 0 when every check passes.
 */
import { BASE_URL, VIEWPORTS, newPage, openBrowser } from './helpers.mjs'

const MOBILE = VIEWPORTS[0]
const DESKTOP = VIEWPORTS[3]

/** Every migrated figure, by article slug. */
const ARTICLES = {
  'getdate-vs-sysdatetime-reloj-que-retrocede': ['getdate-earlier-runs'],
  'con-ai-el-cuello-de-botella-son-tus-pruebas': ['ai-bottleneck-dora-2024'],
  'el-contexto-es-presupuesto': ['context-budget-cache'],
  'la-memoria-de-un-agente-es-curaduria': ['agent-memory-sample-types', 'agent-memory-lifecycle'],
  'ordena-las-hipotesis-por-costo-de-refutar': ['hypotheses-matrix'],
  'el-modelo-es-la-parte-facil-el-arnes-decide': ['harness-rule-test'],
  'antes-de-cambiar-lo-que-heredaste': ['characterize-paths'],
  'dale-al-agente-algo-que-pueda-fallar': ['agent-contract-loops'],
  'la-ai-propone-una-transaccion-decide': ['ai-proposes-lanes'],
}

/** One figure of each type: [slug, id, type]. */
const SAMPLES = [
  ['la-memoria-de-un-agente-es-curaduria', 'agent-memory-sample-types', 'bars'],
  ['ordena-las-hipotesis-por-costo-de-refutar', 'hypotheses-matrix', 'matrix'],
  ['antes-de-cambiar-lo-que-heredaste', 'characterize-paths', 'flow'],
]
const MATRIX = SAMPLES[1]
const SAMPLE_COUNTS = ['24', '10', '7', '6', '4', '2', '2', '1']
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
    // Every article opens in a fresh document, so the choice is seeded on each
    // one (about:blank has no storage to seed).
    await page.addInitScript((t) => {
      if (location.protocol.startsWith('http')) localStorage.setItem('portfolio-theme', t)
    }, opts.theme)
  }
  return { ctx, page, errors }
}

async function openArticle(page, slug) {
  // A fresh document each time: hopping between articles by hash alone leaves
  // the previous article view in the DOM (it does on main too), which is not
  // what these checks are about.
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

const scrollTo = (page, id) =>
  page.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: 'center', behavior: 'instant' }), root(id))

const control = (page, id, name) => page.locator(`${root(id)} [data-fig-control="${name}"]`)

async function run() {
  const browser = await openBrowser()
  try {
    // ── (1) (2) mounting, in ES and EN, one figure of each type
    for (const lang of ['es', 'en']) {
      const { ctx, page, errors } = await open(browser, DESKTOP, lang)
      try {
        for (const [slug, id, type] of SAMPLES) {
          await openArticle(page, slug)
          const s = await page.evaluate((sel) => {
            const bodies = document.querySelectorAll('.blog-article-body')
            const body = bodies[0]
            const fig = document.querySelector(sel)
            const figure = fig?.closest('figure')
            const first = body.querySelector(':scope > p:first-of-type')
            const cap = getComputedStyle(first, '::first-letter')
            return {
              bodies: bodies.length,
              type: fig?.dataset.figType ?? null,
              direct: figure?.parentElement === body,
              caption: figure?.querySelector(':scope > figcaption')?.textContent?.trim().length ?? 0,
              capFloat: cap.float,
              capSize: parseFloat(cap.fontSize),
              bodySize: parseFloat(getComputedStyle(body).fontSize),
            }
          }, root(id))
          check(`(1) ${lang} ${type}: the figure mounts inside the article body with its caption`,
            s.type === type && s.direct && s.caption > 0, JSON.stringify(s))
          check(`(1) ${lang} ${type}: the body is one container and its first paragraph keeps the drop cap`,
            s.bodies === 1 && s.capFloat === 'left' && s.capSize > s.bodySize * 2, JSON.stringify(s))
        }

        // (2) The hypotheses article also carries a figure that is still a static SVG.
        await openArticle(page, MATRIX[0])
        const img = await page.evaluate(async () => {
          const el = document.querySelector('.blog-article-body figure:not([data-figure]) img')
          if (!el) return null
          el.loading = 'eager'
          await el.decode().catch(() => {})
          return { src: el.getAttribute('src'), width: el.naturalWidth, caption: el.parentElement.querySelector('figcaption')?.textContent?.length ?? 0 }
        })
        check(`(2) ${lang}: a static SVG figure still renders as an image with its caption`,
          !!img && img.src.endsWith('.svg') && img.width > 0 && img.caption > 0, JSON.stringify(img))
        check(`(1-2) ${lang}: no page or console errors`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (3) an unknown id falls back to the alt text and the caption
    {
      const { ctx, page, errors } = await open(browser, DESKTOP, 'en')
      try {
        // Rewrite the id in whatever script carries the article, so the real
        // parser and the real mount see an id nobody registered.
        await page.route('**/*', async (route) => {
          if (route.request().resourceType() !== 'script') return route.continue()
          const response = await route.fetch()
          const body = await response.text()
          if (!body.includes('figure/getdate-earlier-runs')) return route.fulfill({ response })
          return route.fulfill({ response, body: body.replaceAll('figure/getdate-earlier-runs', 'figure/no-such-figure') })
        })
        await openArticle(page, 'getdate-vs-sysdatetime-reloj-que-retrocede')
        const s = await page.evaluate(() => {
          const figure = document.querySelector('figure[data-figure="no-such-figure"]')
          return {
            found: !!figure,
            fallback: figure?.querySelector('.fig-fallback')?.textContent?.trim() ?? '',
            caption: figure?.querySelector('figcaption')?.textContent?.trim() ?? '',
            player: figure?.querySelectorAll('.fig').length ?? -1,
          }
        })
        check('(3) an unknown id renders the alt text and the caption, and no player',
          s.found && s.fallback.startsWith('One bar split in two') && s.caption.startsWith('Result of the measurement loop') && s.player === 0, JSON.stringify(s))
        check('(3) an unknown id raises no page or console error', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (4) (5) the player
    const narrations = {}
    for (const lang of ['en', 'es']) {
      const { ctx, page, errors } = await open(browser, DESKTOP, lang)
      try {
        const [slug, id] = MATRIX
        await openArticle(page, slug)
        const before = await figState(page, id)
        check(`(4) ${lang}: below the fold the figure waits on step one`, before?.step === 1 && before.steps > 2, JSON.stringify(before))
        narrations[lang] = before?.narration ?? ''

        await scrollTo(page, id)
        await page.waitForFunction((sel) => {
          const el = document.querySelector(sel)
          return el.dataset.figStep === el.dataset.figSteps && el.dataset.figPlaying === 'false'
        }, root(id), { timeout: before.steps * 4000 }).catch(() => {})
        await page.waitForTimeout(3500)
        const end = await settled(page, id)
        check(`(4) ${lang}: in view it plays by itself to the last step and stops`,
          end.step === end.steps && end.playing === 'false' && builtUpTo(end), JSON.stringify(end))
        check(`(4) ${lang}: the indicator reads the last step`, end.count === `${end.steps} / ${end.steps}`, end.count)

        await control(page, id, 'prev').click()
        const prev = await settled(page, id)
        check(`(4) ${lang}: previous goes back one step and hides what belongs to the last one`,
          prev.step === end.steps - 1 && prev.count === `${end.steps - 1} / ${end.steps}` && builtUpTo(prev) && prev.els.some(([, v]) => !v), JSON.stringify(prev))
        check(`(4) ${lang}: the narration changes with the step`, prev.narration.length > 0 && prev.narration !== end.narration, `${prev.narration} | ${end.narration}`)

        await control(page, id, 'next').click()
        const next = await settled(page, id)
        check(`(4) ${lang}: next advances one step`, next.step === end.steps && builtUpTo(next), JSON.stringify(next))

        await control(page, id, 'restart').click()
        const first = await settled(page, id)
        check(`(4) ${lang}: restart returns to step one`,
          first.step === 1 && first.count === `1 / ${end.steps}` && builtUpTo(first) && first.narration === before.narration, JSON.stringify(first))

        await page.locator(`${root(id)} [data-fig-mark="3"]`).click()
        const third = await settled(page, id)
        check(`(4) ${lang}: a step mark jumps to its step`, third.step === 3 && builtUpTo(third), JSON.stringify(third))

        // (5) arrow keys, with a control focused and with the figure focused
        await control(page, id, 'next').focus()
        await page.keyboard.press('ArrowRight')
        const right = await figState(page, id)
        await page.keyboard.press('ArrowLeft')
        await page.keyboard.press('ArrowLeft')
        const left = await figState(page, id)
        check(`(5) ${lang}: arrow keys step while a control has focus`, right.step === 4 && left.step === 2, `${right.step}, ${left.step}`)
        await page.locator(root(id)).focus()
        await page.keyboard.press('ArrowRight')
        check(`(5) ${lang}: arrow keys step while the figure has focus`, (await figState(page, id)).step === 3)

        const names = await page.evaluate((sel) =>
          [...document.querySelectorAll(`${sel} button`)].map((b) => [b.tagName, (b.getAttribute('aria-label') ?? b.textContent ?? '').trim()]), root(id))
        check(`(4) ${lang}: every control is a button with an accessible name`,
          names.length >= 4 + end.steps && names.every(([tag, name]) => tag === 'BUTTON' && name.length > 0), JSON.stringify(names))
        const expected = lang === 'es' ? ['Reiniciar', 'Paso anterior', 'Reproducir', 'Paso siguiente'] : ['Restart', 'Previous step', 'Play', 'Next step']
        check(`(4) ${lang}: the control names are in the active language`, expected.every((n) => names.some(([, name]) => name === n)), JSON.stringify(names))
        check(`(4) ${lang}: the narration is announced politely`,
          (await page.locator(`${root(id)} .fig-narration`).getAttribute('aria-live')) === 'polite')

        // Play resumes from the current step and stops on the last one.
        await control(page, id, 'play').click()
        check(`(4) ${lang}: play starts the presentation`, (await figState(page, id)).playing === 'true')
        await page.waitForFunction((sel) => document.querySelector(sel).dataset.figPlaying === 'false', root(id), { timeout: 12_000 }).catch(() => {})
        const replay = await figState(page, id)
        check(`(4) ${lang}: play runs to the last step and stops`, replay.step === replay.steps && replay.playing === 'false', JSON.stringify(replay))
        check(`(4-5) ${lang}: no page or console errors`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }
    check('(4) the narration follows the language', narrations.en.length > 0 && narrations.es.length > 0 && narrations.en !== narrations.es, JSON.stringify(narrations))

    // ── (4) user interaction stops auto-play
    {
      const { ctx, page } = await open(browser, DESKTOP, 'en')
      try {
        const [slug, id] = MATRIX
        await openArticle(page, slug)
        await scrollTo(page, id)
        await page.waitForFunction((sel) => document.querySelector(sel).dataset.figPlaying === 'true', root(id), { timeout: 3000 }).catch(() => {})
        await control(page, id, 'next').click()
        const at = await figState(page, id)
        await page.waitForTimeout(3500)
        const later = await figState(page, id)
        check('(4) stepping by hand stops auto-play', at.playing === 'false' && later.step === at.step && at.step < at.steps, `${JSON.stringify(at)} → ${later.step}`)
      } finally { await ctx.close() }
    }

    // ── (6) reduced motion: final state at once, stepping still works
    {
      const { ctx, page, errors } = await open(browser, DESKTOP, 'en', { reducedMotion: 'reduce' })
      try {
        for (const [slug, id, type] of SAMPLES) {
          await openArticle(page, slug)
          const s = await figState(page, id)
          check(`(6) ${type}: reduced motion shows the final state at once`, !!s && s.step === s.steps && s.playing === 'false' && builtUpTo(s), JSON.stringify(s))
          await control(page, id, 'prev').click()
          await page.waitForTimeout(100)
          const p = await figState(page, id)
          check(`(6) ${type}: reduced motion still steps, with no transition to wait for`, p.step === s.steps - 1 && builtUpTo(p), JSON.stringify(p))
        }
        check('(6) no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (7) the data table
    {
      const { ctx, page, errors } = await open(browser, DESKTOP, 'en', { reducedMotion: 'reduce' })
      try {
        const [slug, id] = SAMPLES[0]
        await openArticle(page, slug)
        const toggle = control(page, id, 'data')
        check('(7) a data chart starts with its table closed', (await toggle.getAttribute('aria-expanded')) === 'false' && (await page.locator(`${root(id)} .fig-table table`).count()) === 0)
        await toggle.click()
        const table = await page.evaluate((sel) => {
          const t = document.querySelector(`${sel} .fig-table table`)
          if (!t) return null
          return {
            head: [...t.querySelectorAll('thead th')].map((c) => c.textContent.trim()),
            rows: [...t.querySelectorAll('tbody tr')].map((r) => [...r.children].map((c) => c.textContent.trim())),
          }
        }, root(id))
        check('(7) the data toggle shows a real table with the chart\'s numbers',
          !!table && table.head.length === 2 && table.rows.length === 8 && table.rows[0][0] === 'architecture' &&
          JSON.stringify(table.rows.map((r) => r[1])) === JSON.stringify(SAMPLE_COUNTS), JSON.stringify(table))
        check('(7) the toggle reports the table as open', (await toggle.getAttribute('aria-expanded')) === 'true')
        // Direct labels: every bar shows its own value without hovering.
        const labels = await page.evaluate((sel) => [...document.querySelectorAll(`${sel} .fig-bar-value`)].map((n) => n.textContent.trim()), root(id))
        check('(7) every bar carries its value as a direct label', JSON.stringify(labels) === JSON.stringify(SAMPLE_COUNTS), JSON.stringify(labels))

        await openArticle(page, MATRIX[0])
        check('(7) a conceptual figure offers no data table', (await control(page, MATRIX[1], 'data').count()) === 0)
        check('(7) no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (8) dark theme
    {
      const { ctx, page, errors } = await open(browser, DESKTOP, 'en', { reducedMotion: 'reduce', theme: 'dark' })
      try {
        for (const [slug, id, type] of SAMPLES) {
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
            const cs = getComputedStyle(el)
            const lightHits = []
            for (const n of [el, ...el.querySelectorAll('*')]) {
              const c = getComputedStyle(n)
              for (const p of ['color', 'backgroundColor', 'borderTopColor', 'borderLeftColor', 'fill', 'stroke']) {
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
          check(`(8) ${type}: in the dark theme the figure sits on dark paper with dark-theme ink`,
            s.theme === 'dark' && s.bg === s.paper && s.color === s.ink && s.paper !== LIGHT_PAPER, JSON.stringify(s))
          check(`(8) ${type}: nothing inside the figure computes to the light paper colour`, s.lightHits.length === 0, JSON.stringify(s.lightHits))
        }
        check('(8) no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (9) (11) every article with a figure, at 375 px, final state
    for (const lang of ['es', 'en']) {
      const { ctx, page, errors } = await open(browser, MOBILE, lang, { reducedMotion: 'reduce' })
      try {
        for (const [slug, ids] of Object.entries(ARTICLES)) {
          await openArticle(page, slug)
          for (const id of ids) {
            const open = control(page, id, 'data')
            if (await open.count()) await open.click()
          }
          const s = await page.evaluate((ids) => {
            const out = { missing: [], small: [], wide: [], pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }
            for (const id of ids) {
              const figure = document.querySelector(`figure[data-figure="${id}"]`)
              const fig = figure?.querySelector('.fig')
              if (!fig) { out.missing.push(id); continue }
              const box = figure.getBoundingClientRect()
              const walker = document.createTreeWalker(figure, NodeFilter.SHOW_TEXT)
              for (let n = walker.nextNode(); n; n = walker.nextNode()) {
                if (!n.textContent.trim()) continue
                const size = parseFloat(getComputedStyle(n.parentElement).fontSize)
                if (size < 12) out.small.push(`${id}: "${n.textContent.trim().slice(0, 24)}" ${size}px`)
                const range = document.createRange()
                range.selectNodeContents(n)
                const r = range.getBoundingClientRect()
                // Text inside the scrollable table box may run past it by design.
                if (!n.parentElement.closest('.fig-table') && r.width > 0 && (r.right > box.right + 1 || r.left < box.left - 1)) {
                  out.wide.push(`${id}: "${n.textContent.trim().slice(0, 24)}" ${Math.round(r.left)}..${Math.round(r.right)} outside ${Math.round(box.left)}..${Math.round(box.right)}`)
                }
              }
            }
            return out
          }, ids)
          const name = `${lang} ${ids.join(' + ')}`
          check(`(11) ${name}: mounted`, s.missing.length === 0, s.missing.join(', '))
          check(`(9) ${name}: no text below 12 px at 375`, s.small.length === 0, s.small.slice(0, 4).join(' | '))
          check(`(9) ${name}: nothing overflows at 375`, s.pageOverflow <= 0 && s.wide.length === 0, `page +${s.pageOverflow}px; ${s.wide.slice(0, 4).join(' | ')}`)
        }
        check(`(11) ${lang}: no page or console error on any article with a figure`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (10) switching language re-mounts the figure with the other labels
    {
      const { ctx, page, errors } = await open(browser, DESKTOP, 'en', { reducedMotion: 'reduce' })
      try {
        const [slug, id] = MATRIX
        await openArticle(page, slug)
        const en = await page.evaluate((sel) => document.querySelector(sel).textContent, root(id))
        // The article view carries no language switch of its own (the site
        // header is not shown there), so the language is changed where the
        // header's switch changes it: the app context's `setLang`, reached
        // through the React tree above the article.
        const switched = await page.evaluate(() => {
          const body = document.querySelector('.blog-article-body')
          const key = Object.keys(body).find((k) => k.startsWith('__reactFiber'))
          for (let fiber = body[key]; fiber; fiber = fiber.return) {
            const value = fiber.memoizedProps?.value
            if (value && typeof value.setLang === 'function') { value.setLang('es'); return true }
          }
          return false
        })
        check('(10) the language context is reachable from the article', switched)
        await page.waitForFunction(([sel, old]) => {
          const el = document.querySelector(sel)
          return !!el && el.textContent !== old
        }, [root(id), en], { timeout: 5000 }).catch(() => {})
        const es = await page.evaluate((sel) => document.querySelector(sel)?.textContent ?? '', root(id))
        check('(10) switching language re-mounts the figure with the other language\'s labels',
          en.includes('TEST NOW') && es.includes('PROBAR YA') && !es.includes('TEST NOW'), `${en.slice(0, 60)} → ${es.slice(0, 60)}`)
        check('(10) one figure per mount after the switch', (await page.locator(root(id)).count()) === 1)
        check('(10) no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }
  } finally {
    await browser.close()
  }

  console.log(`\nFigure checks: ${checks - failures.length}/${checks} passed`)
  if (failures.length) {
    console.log('FAILED:')
    console.log(failures.join('\n'))
    process.exit(1)
  }
  console.log('ALL PASSED')
}

run().catch((e) => { console.error(e); process.exit(1) })
