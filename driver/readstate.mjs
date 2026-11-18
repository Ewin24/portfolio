/**
 * Reading state, visible everywhere: started versus read.
 *
 * Opening an article makes it STARTED; reaching the end of its body makes it
 * READ. The same mark is shown in the blog list, the home essays block, the
 * related articles and the previous/next cards.
 *
 *  - `localStorage['portfolio-read-posts']` keeps its format: an array of
 *    legacy slug strings and `[slug, isoDate]` pairs, all of them read.
 *  - `localStorage['portfolio-reading-progress']` holds started articles:
 *    `{ slug: [fraction, isoDate] }`.
 *
 * Needs a server (BASE_URL, default http://localhost:4193/portfolio/).
 * Exits 0 when every check passes.
 */
import { BASE_URL, VIEWPORTS, newPage, openBrowser } from './helpers.mjs'

const A = 'getdate-vs-sysdatetime-reloj-que-retrocede'
const B = 'asynclocal-no-sube-al-llamador'
const READ = 'portfolio-read-posts'
const PROGRESS = 'portfolio-reading-progress'
const DESKTOP = VIEWPORTS[3]
const MOBILE = VIEWPORTS[0]

const failures = []
let checks = 0
function check(name, cond, extra = '') {
  checks++
  if (!cond) failures.push(`  ✗ ${name}${extra ? ` — ${extra}` : ''}`)
  else console.log(`  ✓ ${name}`)
}

const T = {
  es: { showAll: 'Mostrar todos', read: 'Leído', readOn: 'Leído el', cont: 'Continuar', resume: 'Continuar donde quedaste', unread: 'No leídos', tag: 'Arquitectura',
    counter: (n, total) => (n ? `Leíste ${n} de ${total}` : `Aún no has leído ninguno de ${total}`) },
  en: { showAll: 'Show all', read: 'Read', readOn: 'Read on', cont: 'Continue', resume: 'Continue where you left off', unread: 'Unread', tag: 'Architecture',
    counter: (n, total) => (n ? `You have read ${n} of ${total}` : `You have not read any of ${total} yet`) },
}

/** A fresh context, with localStorage seeded once (not on reloads). */
async function open(browser, { seed = {}, lang = 'en', viewport = DESKTOP } = {}) {
  const { ctx, page } = await newPage(browser, viewport, lang)
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  await page.addInitScript((s) => {
    if (sessionStorage.getItem('seeded')) return
    sessionStorage.setItem('seeded', '1')
    for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v)
  }, seed)
  await page.goto(`${BASE_URL}#blog`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#blog article[data-slug]', { timeout: 10_000 })
  // Survives hash navigation, dies on a reload: proves "without a reload".
  await page.evaluate(() => { window.__sameDocument = true })
  return { ctx, page, errors, lang }
}

const stored = (page, key) => page.evaluate((k) => localStorage.getItem(k), key)

/** In-page navigation, the way the blog itself navigates. Never a reload. */
async function go(page, hash) {
  await page.evaluate((h) => {
    history.pushState(null, '', h)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }, hash)
}

async function openArticle(page, slug) {
  // Going from one article to another, the previous body is still in the page
  // when the hash changes. Wait for the headline to change too, or a slow
  // machine moves on before the new article has mounted and recorded its open.
  const before = await page.evaluate((s) => ({
    same: location.hash.endsWith(s),
    h1: document.querySelector('.blog-full h1')?.textContent ?? null,
  }), slug)
  await go(page, `#blog/article/${slug}`)
  await page.waitForFunction(
    ([s, b]) => location.hash.endsWith(s) && !!document.querySelector('.blog-full .blog-article-body') &&
      (b.same || (document.querySelector('.blog-full h1')?.textContent ?? null) !== b.h1),
    [slug, before],
    { timeout: 15_000 },
  )
  // The article scrolls itself to the top on open; let that settle, and let the first write land.
  await page.waitForTimeout(900)
}

/**
 * Back to the list. Only ever the plain list route: an in-page change between
 * two blog routes that are not the list (list to tag, article to article)
 * leaves the outgoing view mounted beside the incoming one, on the deployed
 * site too, so filters are driven through their controls instead.
 */
async function openList(page, lang) {
  await go(page, '#blog')
  // The outgoing view fades out next to the incoming one: wait until one set of filters is left.
  await page.waitForFunction(() => document.querySelectorAll('#blog [role="tablist"]').length === 1 && !document.querySelector('.blog-full'), null, { timeout: 10_000 })
  await page.waitForTimeout(500)
  await showAll(page, lang)
}

async function showAll(page, lang) {
  const btn = page.getByRole('button', { name: T[lang].showAll })
  if (await btn.count()) await btn.first().click()
  await page.waitForTimeout(400)
}

/** Scrolls so the end of the article body is in the middle of the viewport, then dwells. */
async function finish(page) {
  await page.evaluate(() => {
    const r = document.querySelector('.blog-full .blog-article-body').getBoundingClientRect()
    window.scrollTo({ top: window.scrollY + r.bottom - window.innerHeight / 2, behavior: 'instant' })
  })
  await page.waitForTimeout(2300)
}

/** Every place an article is offered: { place: { slug: { state, mark, cont } } }. */
const places = (page) =>
  page.evaluate(() => {
    const collect = (sel, attr) =>
      Object.fromEntries([...document.querySelectorAll(sel)].map((el) => [el.getAttribute(attr), {
        state: el.dataset.readState ?? null,
        mark: el.querySelector('[data-read-mark]')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
        cont: el.querySelector('[data-continue-mark]')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
      }]))
    return {
      list: collect('#blog article[data-slug]', 'data-slug'),
      essays: collect('#essays [data-essay-slug]', 'data-essay-slug'),
      recs: collect('.blog-full [data-rec-slug]', 'data-rec-slug'),
      nav: collect('.blog-full [data-nav-slug]', 'data-nav-slug'),
    }
  })

/** The tag chip in the filters row (not the route: see the note on openList). */
const tagChip = (page, lang) => page.locator('#blog').getByRole('button', { name: T[lang].tag, exact: true })
const listSlugs = (page) => page.evaluate(() => [...document.querySelectorAll('#blog article[data-slug]')].map((el) => el.dataset.slug))
const counterText = (page) => page.evaluate(() => document.querySelector('#blog [data-read-counter]')?.textContent.replace(/\s+/g, ' ').trim() ?? null)
const today = (page, lang) => page.evaluate((l) => new Intl.DateTimeFormat(l, { dateStyle: 'medium' }).format(new Date()), lang)
const isStarted = (lang) => (c) => c?.state === 'started' && c.mark === null && new RegExp(`^${T[lang].cont} · \\d+ %$`).test(c.cont ?? '')
const j = (v) => JSON.stringify(v)

/** WCAG contrast ratio of two `rgb()` strings. */
function contrast(a, b) {
  const lum = (rgb) => {
    const [r, g, bl] = rgb.match(/[\d.]+/g).slice(0, 3).map((v) => {
      const c = Number(v) / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

async function run() {
  const browser = await openBrowser()
  try {
    // ── (1) (2) started on open, read at the end, in all four places, without a reload
    {
      const { ctx, page, errors, lang } = await open(browser)
      try {
        const E = await page.evaluate(() => document.querySelector('#essays [data-essay-slug]')?.dataset.essaySlug ?? null)
        await openArticle(page, A)
        const around = await places(page)
        const T1 = Object.keys(around.nav)[0]
        const T2 = Object.keys(around.recs).find((s) => s !== T1 && s !== E)
        check('(1) previous/next and related cards are identifiable', !!E && !!T1 && !!T2, j({ E, T1, T2 }))
        if (!E || !T1 || !T2) throw new Error('cannot continue without the cards')

        for (const slug of [T1, T2, E]) await openArticle(page, slug)
        check('(1) opening an article does not mark it read', (await stored(page, READ)) === null, (await stored(page, READ)) ?? 'null')
        const progress = JSON.parse((await stored(page, PROGRESS)) ?? '{}')
        check('(1) opening an article stores it as started under the new key', [A, T1, T2, E].every((s) => Array.isArray(progress[s])), j(progress))

        await openList(page, lang)
        let p = await places(page)
        const started = isStarted(lang)
        check('(1) started in the blog list', [T1, T2, E].every((s) => started(p.list[s])), j([T1, T2, E].map((s) => p.list[s])))
        check('(1) started in the essays block', started(p.essays[E]), j(p.essays[E]))
        check('(1) an article never opened is unread, with no mark', Object.values(p.list).some((c) => c.state === 'unread' && !c.mark && !c.cont))
        await openArticle(page, A)
        p = await places(page)
        check('(1) started in previous/next', started(p.nav[T1]), j(p.nav))
        check('(1) started in related articles', started(p.recs[T2]), j(p.recs))

        const date = await today(page, lang)
        const label = `${T[lang].readOn} ${date}`
        await openArticle(page, T1)
        check('(2) the article has no read line before its end is reached',
          (await page.evaluate(() => document.querySelector('.blog-full article [data-read-mark]'))) === null)
        await finish(page)
        check('(2) reaching the end shows the read line on the article, live',
          (await page.evaluate(() => document.querySelector('.blog-full article [data-read-mark]')?.textContent.trim() ?? null)) === label)
        for (const slug of [T2, E]) { await openArticle(page, slug); await finish(page) }

        const raw = JSON.parse((await stored(page, READ)) ?? '[]')
        check('(2) finished articles are stored as [slug, isoDate], in order',
          raw.length === 3 && raw.every((it, i) => it[0] === [T1, T2, E][i] && !Number.isNaN(Date.parse(it[1]))), j(raw))
        const left = JSON.parse((await stored(page, PROGRESS)) ?? '{}')
        check('(2) reaching the end clears the saved position', [T1, T2, E].every((s) => !(s in left)) && A in left, j(left))

        const isRead = (c) => c?.state === 'read' && c.cont === null && c.mark === label
        await openList(page, lang)
        p = await places(page)
        check('(2) read, with stamp and date, in the blog list', [T1, T2, E].every((s) => isRead(p.list[s])), j([T1, T2, E].map((s) => p.list[s])))
        check('(2) read, with stamp and date, in the essays block', isRead(p.essays[E]), j(p.essays[E]))
        check('(2) the read mark is the ink stamp',
          await page.evaluate((s) => !!document.querySelector(`#blog article[data-slug="${s}"] [data-read-mark]`)?.closest('[data-read-state]')?.querySelector('.ink-stamp'), T1))
        await openArticle(page, A)
        p = await places(page)
        check('(2) read, with stamp and date, in previous/next', isRead(p.nav[T1]), j(p.nav))
        check('(2) read, with stamp and date, in related articles', isRead(p.recs[T2]), j(p.recs))
        check('(1-2) all of it without a reload', await page.evaluate(() => window.__sameDocument === true))
        check('(1-2) no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (3) what is already stored stays read, byte for byte
    {
      const seed = JSON.stringify([A, [B, '2026-01-05T15:00:00.000Z']])
      const { ctx, page, errors, lang } = await open(browser, { seed: { [READ]: seed } })
      try {
        await showAll(page, lang)
        const p = await places(page)
        check('(3) a legacy slug is read, undated', p.list[A]?.state === 'read' && p.list[A].mark === 'Read', j(p.list[A]))
        check('(3) a dated pair is read, with its own date', p.list[B]?.state === 'read' && p.list[B].mark === 'Read on Jan 5, 2026', j(p.list[B]))
        check('(3) the stored value is byte-identical after the page loads', (await stored(page, READ)) === seed, (await stored(page, READ)) ?? 'null')

        const other = (await listSlugs(page)).find((s) => s !== A && s !== B)
        await openArticle(page, A)
        await finish(page)
        await openArticle(page, other)
        check('(3) byte-identical after re-reading a stored article and opening another', (await stored(page, READ)) === seed, (await stored(page, READ)) ?? 'null')
        check('(3) an article that is already read does not become started', !(A in JSON.parse((await stored(page, PROGRESS)) ?? '{}')))
        await finish(page)
        const raw = (await stored(page, READ)) ?? ''
        const v = JSON.parse(raw || 'null')
        check('(3) finishing one appends [slug, isoDate] and leaves the rest byte-identical',
          raw.startsWith(`${seed.slice(0, -1)},`) && v.length === 3 && v[0] === A && v[2][0] === other && !Number.isNaN(Date.parse(v[2][1])), raw)
        check('(3) no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (4) garbage in either key: nothing thrown, nothing marked, nothing cleared by reading
    for (const [key, garbage] of [
      [READ, '{"a":1}'], [READ, 'not json'], [READ, '[1,null,{"x":2},["only-one"],["a",5]]'],
      [PROGRESS, 'not json'], [PROGRESS, '[1,2]'], [PROGRESS, `{"${A}":"x","${B}":[2,"d"],"c":[0.5],"d":null,"e":["0.5","d"]}`],
    ]) {
      const { ctx, page, errors, lang } = await open(browser, { seed: { [key]: garbage } })
      try {
        await showAll(page, lang)
        const p = await places(page)
        const marked = Object.entries(p.list).filter(([, c]) => c.state !== 'unread' || c.mark || c.cont)
        const name = `${key === READ ? 'read' : 'progress'} key = ${garbage.slice(0, 14)}…`
        check(`(4) garbage ${name}: the list renders and marks nothing`,
          Object.keys(p.list).length > 1 && marked.length === 0 && errors.length === 0, j({ cards: Object.keys(p.list).length, marked, errors }))
        check(`(4) garbage ${name}: not cleared by rendering`, (await stored(page, key)) === garbage, (await stored(page, key)) ?? 'null')
        await openArticle(page, A)
        await finish(page)
        check(`(4) garbage ${name}: an article still opens and finishes`,
          errors.length === 0 && ((await page.evaluate(() => document.querySelector('.blog-full article [data-read-mark]')?.textContent ?? '')).startsWith('Read on')), errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (5) continue where you left off: offered, never automatic
    {
      const { ctx, page, errors, lang } = await open(browser)
      try {
        await openArticle(page, A)
        const target = await page.evaluate(() => {
          const r = document.querySelector('.blog-full .blog-article-body').getBoundingClientRect()
          const top = Math.round(window.scrollY + r.top + r.height * 0.45)
          window.scrollTo({ top, behavior: 'instant' })
          return top
        })
        await page.waitForTimeout(1200)
        const saved = JSON.parse((await stored(page, PROGRESS)) ?? '{}')[A]
        check('(5) scrolling saves a position between 0 and 1', Array.isArray(saved) && saved[0] > 0.2 && saved[0] < 0.8 && !Number.isNaN(Date.parse(saved[1])), j(saved))
        const pct = Math.round((saved?.[0] ?? 0) * 100)

        await openList(page, lang)
        const card = (await places(page)).list[A]
        check('(5) the card shows "Continue · N %" with the saved percentage', card?.state === 'started' && card.cont === `Continue · ${pct} %`, j(card))
        check('(5) the card carries a progress indication with that value',
          (await page.evaluate((s) => document.querySelector(`#blog article[data-slug="${s}"] [data-continue-mark] [data-progress]`)?.getAttribute('data-progress') ?? null, A)) === String(pct))

        await openArticle(page, A)
        await page.waitForTimeout(1200)
        const resume = page.locator('.blog-full [data-continue]')
        check('(5) reopening does not scroll to the saved position by itself', (await page.evaluate(() => window.scrollY)) < 200, String(await page.evaluate(() => window.scrollY)))
        check('(5) reopening offers "Continue where you left off"',
          (await resume.count()) === 1 && (await resume.isVisible()) && ((await resume.textContent()) ?? '').includes(T[lang].resume), (await resume.textContent().catch(() => '')) ?? '')
        check('(5) the control is a real button', (await resume.evaluate((el) => el.tagName).catch(() => '')) === 'BUTTON')
        await resume.focus()
        await page.keyboard.press('Enter')
        await page.waitForTimeout(1500)
        const y = await page.evaluate(() => window.scrollY)
        check('(5) the control scrolls to roughly the saved position', Math.abs(y - target) < 200, `${y} vs ${target}`)
        check('(5) the control goes away once used', (await resume.count()) === 0)
        check('(5) the saved position is not lost by reopening', JSON.parse((await stored(page, PROGRESS)) ?? '{}')[A]?.[0] >= saved[0] - 0.01)

        await finish(page)
        check('(5) reaching the end clears the saved position and marks it read',
          !(A in JSON.parse((await stored(page, PROGRESS)) ?? '{}')) && JSON.parse((await stored(page, READ)) ?? '[]')[0]?.[0] === A)
        await openArticle(page, B)
        await openArticle(page, A)
        check('(5) a read article offers no continue control', (await resume.count()) === 0)
        check('(5) no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (6) the Unread toggle and the counter, ES and EN, composing with the other filters
    for (const lang of ['es', 'en']) {
      const t = T[lang]
      // Discover the data from the page itself: an essay, a tag and the totals.
      const probe = await open(browser, { lang })
      let total, essay, tagged, technical
      try {
        await showAll(probe.page, lang)
        const slugs = await listSlugs(probe.page)
        total = slugs.length
        const toggle = probe.page.locator('#blog [data-filter-unread]')
        check(`[${lang}] (6) the toggle is a labelled button, off by default`,
          ((await toggle.textContent().catch(() => '')) ?? '').trim() === t.unread && (await toggle.getAttribute('aria-pressed').catch(() => null)) === 'false')
        check(`[${lang}] (6) with nothing read the counter reads naturally`, (await counterText(probe.page)) === t.counter(0, total), (await counterText(probe.page)) ?? 'null')
        await toggle.click({ timeout: 3000 }).catch(() => {})
        await probe.page.waitForTimeout(400)
        check(`[${lang}] (6) with nothing read the toggle changes nothing`, (await listSlugs(probe.page)).length === total, String((await listSlugs(probe.page)).length))
        check(`[${lang}] (6) the toggle reports its state`, (await toggle.getAttribute('aria-pressed').catch(() => null)) === 'true')
        await toggle.click({ timeout: 3000 }).catch(() => {})

        essay = await probe.page.evaluate(() => document.querySelector('#essays [data-essay-slug]')?.dataset.essaySlug)
        await tagChip(probe.page, lang).click()
        await probe.page.waitForTimeout(400)
        await showAll(probe.page, lang)
        tagged = await listSlugs(probe.page)
        technical = tagged.find((s) => s !== essay)
        check(`[${lang}] (6) probe found an essay and a tagged article`, !!essay && !!technical && tagged.length > 1 && tagged.length < total, j({ essay, technical, tagged: tagged.length, total }))
      } finally { await probe.ctx.close() }

      const seed = JSON.stringify([essay, [technical, '2026-01-05T15:00:00.000Z']])
      const { ctx, page, errors } = await open(browser, { lang, seed: { [READ]: seed } })
      try {
        await showAll(page, lang)
        check(`[${lang}] (6) the counter counts what is read`, (await counterText(page)) === t.counter(2, total), (await counterText(page)) ?? 'null')
        const mark = (await places(page)).list[technical]
        check(`[${lang}] (6) the read card is labelled in the active language`, (mark?.mark ?? '').startsWith(`${t.readOn} `), j(mark))
        // The title of a read article: a query that is sure to find it.
        const readTitle = await page.evaluate((s) => document.querySelector(`#blog article[data-slug="${s}"] h3`)?.textContent ?? '', technical)

        const toggle = page.locator('#blog [data-filter-unread]')
        await toggle.click()
        await page.waitForTimeout(400)
        await showAll(page, lang)
        let slugs = await listSlugs(page)
        check(`[${lang}] (6) Unread leaves only unread articles`, slugs.length === total - 2 && !slugs.includes(essay) && !slugs.includes(technical), `${slugs.length}/${total}`)

        const essays = page.locator('#blog [role="tab"][data-blog-tab="essays"]')
        await essays.click()
        await page.waitForTimeout(400)
        await showAll(page, lang)
        const unreadEssays = await listSlugs(page)
        await toggle.click()
        await page.waitForTimeout(400)
        await showAll(page, lang)
        const allEssays = await listSlugs(page)
        check(`[${lang}] (6) Unread composes with the Essays filter`,
          allEssays.includes(essay) && unreadEssays.length < allEssays.length && j(unreadEssays) === j(allEssays.filter((s) => s !== essay && s !== technical)), `${unreadEssays.length} of ${allEssays.length}`)
        await page.locator('#blog [role="tab"][data-blog-tab="all"]').click()
        await toggle.click()

        await tagChip(page, lang).click()
        await page.waitForTimeout(400)
        await showAll(page, lang)
        slugs = await listSlugs(page)
        const readTagged = tagged.filter((s) => s === essay || s === technical)
        check(`[${lang}] (6) Unread composes with a tag filter`,
          (await toggle.getAttribute('aria-pressed')) === 'true' && slugs.length === tagged.length - readTagged.length && readTagged.every((s) => !slugs.includes(s)) && slugs.every((s) => tagged.includes(s)),
          `${slugs.length} of ${tagged.length}`)

        const input = page.locator('#blog input').first()
        await input.fill('sql')
        await page.waitForTimeout(700)
        check(`[${lang}] (6) search still answers with Unread on`, (await page.evaluate(() => document.querySelectorAll('#blog article[data-slug]').length)) > 0 && errors.length === 0, errors.join(' | '))

        // Search results obey the toggle: what the query finds with it off, minus what is read.
        const found = async () => {
          await page.waitForTimeout(700)
          return page.evaluate(() => [...document.querySelectorAll('#blog [data-search-slug]')].map((el) => el.dataset.searchSlug))
        }
        await toggle.click()
        await input.fill(readTitle)
        const foundAll = await found()
        await toggle.click()
        const foundUnread = await found()
        check(`[${lang}] (6) search results leave out read articles while Unread is on`,
          foundAll.includes(technical) && j(foundUnread) === j(foundAll.filter((s) => s !== essay && s !== technical)), `${foundUnread.length} of ${foundAll.length}, the read one found: ${foundAll.includes(technical)}`)
        await input.fill('')

        const next = slugs[0]
        await openArticle(page, next)
        await finish(page)
        const nav = await places(page)
        check(`[${lang}] (6) finishing an article under Unread keeps its previous/next`, Object.keys(nav.nav).length > 0, j(nav.nav))
        await openList(page, lang)
        check(`[${lang}] (6) the counter updates when an article becomes read, without a reload`,
          (await counterText(page)) === t.counter(3, total) && (await page.evaluate(() => window.__sameDocument === true)), (await counterText(page)) ?? 'null')
        check(`[${lang}] (6) Unread survives the visit to the article and now hides it`,
          (await toggle.getAttribute('aria-pressed')) === 'true' && !(await listSlugs(page)).includes(next))
        check(`[${lang}] (6) no page or console errors`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (7) Spanish labels for started and for the continue control
    {
      const seed = { [PROGRESS]: JSON.stringify({ [A]: [0.4, '2026-01-05T15:00:00.000Z'] }), [READ]: JSON.stringify([[B, '2026-01-05T15:00:00.000Z']]) }
      const { ctx, page, errors, lang } = await open(browser, { lang: 'es', seed })
      try {
        await showAll(page, lang)
        const p = await places(page)
        check('[es] (7) a seeded position shows "Continuar · 40 %"', p.list[A]?.state === 'started' && p.list[A].cont === 'Continuar · 40 %', j(p.list[A]))
        check('[es] (7) a dated mark shows "Leído el 5 ene 2026"', p.list[B]?.mark === 'Leído el 5 ene 2026', j(p.list[B]))
        check('[es] (7) rendering leaves both keys untouched', (await stored(page, PROGRESS)) === seed[PROGRESS] && (await stored(page, READ)) === seed[READ])
        await openArticle(page, A)
        const resume = page.locator('.blog-full [data-continue]')
        check('[es] (7) the control reads "Continuar donde quedaste"', ((await resume.textContent().catch(() => '')) ?? '').includes(T.es.resume))
        check('[es] (7) no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (8) (9) (10) same height, contrast in both themes, nothing overflows at 375
    {
      const probe = await open(browser)
      const row = await probe.page.evaluate(() =>
        [...document.querySelectorAll('#blog [data-blog-grid] article[data-slug]')].slice(0, 3).map((el) => ({ slug: el.dataset.slug, h: el.getBoundingClientRect().height, top: Math.round(el.getBoundingClientRect().top) })))
      const essay = await probe.page.evaluate(() => document.querySelector('#essays [data-essay-slug]')?.dataset.essaySlug)
      const essayRow = await probe.page.evaluate(() => [...document.querySelectorAll('#essays [data-essay-slug]')].slice(0, 3).map((el) => el.getBoundingClientRect().height))
      await probe.ctx.close()
      const seed = {
        [READ]: JSON.stringify([[row[1].slug, '2026-01-05T15:00:00.000Z'], essay]),
        [PROGRESS]: JSON.stringify({ [row[0].slug]: [0.4, '2026-01-05T15:00:00.000Z'] }),
      }

      for (const theme of ['light', 'dark']) {
        const { ctx, page, errors } = await open(browser, { seed: { ...seed, 'portfolio-theme': theme } })
        try {
          const now = await page.evaluate(() =>
            [...document.querySelectorAll('#blog [data-blog-grid] article[data-slug]')].slice(0, 3).map((el) => ({ slug: el.dataset.slug, state: el.dataset.readState, h: el.getBoundingClientRect().height, top: Math.round(el.getBoundingClientRect().top) })))
          check(`[${theme}] (8) one row holds a started, a read and an unread card`,
            j(now.map((c) => c.state)) === j(['started', 'read', 'unread']) && new Set(now.map((c) => c.top)).size === 1, j(now))
          // The row is level before anything is read; it must still be with a read card in it.
          check(`[${theme}] (8) a read card and the unread card beside it, level before, are the same height`,
            row[1].h === row[2].h && now[1].h === now[2].h, `before ${j(row.map((c) => c.h))}, now ${j(now.map((c) => c.h))}`)
          check(`[${theme}] (8) no card changed height by being read or started`, j(now.map((c) => c.h)) === j(row.map((c) => c.h)), `${j(row.map((c) => c.h))} → ${j(now.map((c) => c.h))}`)
          const essaysNow = await page.evaluate(() => [...document.querySelectorAll('#essays [data-essay-slug]')].slice(0, 3).map((el) => el.getBoundingClientRect().height))
          check(`[${theme}] (8) the essays block keeps its card heights with a read essay`, j(essaysNow) === j(essayRow), `${j(essayRow)} → ${j(essaysNow)}`)

          const colours = await page.evaluate((slug) => {
            const card = document.querySelector(`#blog article[data-slug="${slug}"]`)
            const unread = document.querySelector('#blog article[data-read-state="unread"] h3')
            const css = (el, p = 'color') => getComputedStyle(el)[p]
            const stamp = card.querySelector('.ink-stamp')
            return {
              theme: document.documentElement.dataset.theme ?? 'light',
              bg: css(card, 'backgroundColor'),
              stamp: css(stamp),
              stampSize: parseFloat(css(stamp, 'fontSize')),
              title: css(card.querySelector('h3')),
              unreadTitle: css(unread),
              date: css(card.querySelector('[data-read-mark]').lastElementChild),
            }
          }, row[1].slug)
          check(`[${theme}] the theme is applied`, colours.theme === theme, colours.theme)
          check(`[${theme}] (9) the stamp meets 4.5:1 on its card`, contrast(colours.stamp, colours.bg) >= 4.5, `${contrast(colours.stamp, colours.bg).toFixed(2)} ${j(colours)}`)
          check(`[${theme}] (9) the muted title meets 4.5:1 and differs from an unread title`,
            contrast(colours.title, colours.bg) >= 4.5 && colours.title !== colours.unreadTitle, `${contrast(colours.title, colours.bg).toFixed(2)}`)
          check(`[${theme}] (9) the date in the mark meets 4.5:1`, contrast(colours.date, colours.bg) >= 4.5, contrast(colours.date, colours.bg).toFixed(2))
          check(`[${theme}] (8-9) no page or console errors`, errors.length === 0, errors.join(' | '))
        } finally { await ctx.close() }
      }

      // 375 px: the home page and an article whose neighbours are read and started.
      const wide = await open(browser, { seed })
      await openArticle(wide.page, row[1].slug)
      const near = await places(wide.page)
      await wide.ctx.close()
      const neighbours = [...Object.keys(near.nav), ...Object.keys(near.recs)]
      const seed375 = {
        [READ]: JSON.stringify([...neighbours.filter((_, i) => i % 2 === 0), row[1].slug, essay]),
        [PROGRESS]: JSON.stringify({ ...Object.fromEntries(neighbours.filter((_, i) => i % 2 === 1).map((s) => [s, [0.4, '2026-01-05T15:00:00.000Z']])), [row[2].slug]: [0.4, '2026-01-05T15:00:00.000Z'] }),
      }
      for (const lang of ['es', 'en']) {
        const { ctx, page, errors } = await open(browser, { lang, viewport: MOBILE, seed: seed375 })
        try {
          await showAll(page, lang)
          const measure = () => page.evaluate(() => {
            const small = [...document.querySelectorAll('[data-read-mark], [data-continue-mark], [data-read-counter], [data-filter-unread], [data-continue]')]
              .flatMap((el) => [el, ...el.querySelectorAll('*')])
              .filter((el) => el.getClientRects().length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && !el.classList.contains('sr-only'))
              .map((el) => parseFloat(getComputedStyle(el).fontSize))
            const vw = document.documentElement.clientWidth
            const out = [...document.querySelectorAll('[data-read-mark], [data-continue-mark], [data-read-counter], [data-filter-unread], [data-continue]')]
              .filter((el) => el.getClientRects().length && (el.getBoundingClientRect().right > vw + 0.5 || el.getBoundingClientRect().left < -0.5)).length
            return { scroll: document.documentElement.scrollWidth, vw, minFont: Math.min(...small), marks: small.length, out }
          })
          const home = await measure()
          check(`[${lang}] (10) 375 px: the home page does not overflow`, home.scroll <= home.vw && home.out === 0, j(home))
          check(`[${lang}] (10) 375 px: no text of the reading state is below 12 px`, home.marks > 3 && home.minFont >= 12, j(home))
          await openArticle(page, row[1].slug)
          const p = await places(page)
          check(`[${lang}] (10) 375 px: the article shows read and started neighbours`,
            [...Object.values(p.nav), ...Object.values(p.recs)].some((c) => c.state === 'read') && [...Object.values(p.nav), ...Object.values(p.recs)].some((c) => c.state === 'started'), j(p))
          const art = await measure()
          check(`[${lang}] (10) 375 px: the article does not overflow`, art.scroll <= art.vw && art.out === 0, j(art))
          check(`[${lang}] (10) 375 px: no text of the reading state is below 12 px in the article`, art.marks > 1 && art.minFont >= 12, j(art))
          check(`[${lang}] (10) no page or console errors`, errors.length === 0, errors.join(' | '))
        } finally { await ctx.close() }
      }
    }

    // ── (11) storage that throws: the session still knows
    {
      const { ctx, page, errors, lang } = await open(browser)
      try {
        await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('quota') } })
        await openArticle(page, A)
        await openList(page, lang)
        check('(11) blocked storage: the article is still started for the session', isStarted(lang)((await places(page)).list[A]))
        await openArticle(page, A)
        await finish(page)
        await openList(page, lang)
        check('(11) blocked storage: and still read for the session', (await places(page)).list[A]?.state === 'read' && errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }
  } finally {
    await browser.close()
  }

  console.log(`\nRead state checks: ${checks - failures.length}/${checks} passed`)
  if (failures.length) {
    console.log('FAILED:')
    console.log(failures.join('\n'))
    process.exit(1)
  }
  console.log('ALL PASSED')
}

run().catch((e) => { console.error(e); console.log(failures.join('\n')); process.exit(1) })
