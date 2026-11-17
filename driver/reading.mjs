/**
 * Blog reading mode and dated read marks.
 *
 * Read marks live in `localStorage['portfolio-read-posts']`: an array whose
 * items are a slug string (legacy, no date) or a `[slug, isoDate]` pair.
 * Reading mode lives on <html> as `data-reading="on"` + `data-reading-size`.
 *
 * Needs a server (BASE_URL, default http://localhost:4193/portfolio/).
 * Exits 0 when every check passes.
 */
import { BASE_URL, VIEWPORTS, newPage, openBrowser } from './helpers.mjs'

const A = 'getdate-vs-sysdatetime-reloj-que-retrocede'
const B = 'asynclocal-no-sube-al-llamador'
const KEY = 'portfolio-read-posts'

const failures = []
let checks = 0
function check(name, cond, extra = '') {
  checks++
  if (!cond) failures.push(`  ✗ ${name}${extra ? ` — ${extra}` : ''}`)
  else console.log(`  ✓ ${name}`)
}

const articleUrl = (slug) => `${BASE_URL}#blog/article/${slug}`
const stored = (page) => page.evaluate((k) => localStorage.getItem(k), KEY)
const today = (page) =>
  page.evaluate(() => new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date()))

/** A fresh context, optionally with localStorage seeded once (not on reloads). */
async function open(browser, seed = {}) {
  const { ctx, page } = await newPage(browser, VIEWPORTS[3], 'en')
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.addInitScript((s) => {
    if (sessionStorage.getItem('seeded')) return
    sessionStorage.setItem('seeded', '1')
    for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v)
  }, seed)
  return { ctx, page, errors }
}

async function openArticle(page, slug) {
  await page.goto(articleUrl(slug), { waitUntil: 'networkidle' })
  await page.waitForSelector('.blog-article-body', { timeout: 10_000 })
}

/** The article's own read line, or null. Waits briefly because it is set after mount. */
async function articleMark(page) {
  await page.waitForSelector('.blog-full article [data-read-mark]', { timeout: 3_000 }).catch(() => {})
  return page.evaluate(() => document.querySelector('.blog-full article [data-read-mark]')?.textContent?.trim() ?? null)
}

/** Opens the home list with every card shown; returns { slug: markText | null }. */
async function listMarks(page, navigate = true) {
  if (navigate) await page.goto(`${BASE_URL}#blog`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#blog article h3', { timeout: 10_000 }).catch(() => {})
  const showAll = page.getByRole('button', { name: 'Show all' })
  if (await showAll.count()) await showAll.first().click()
  await page.waitForTimeout(300)
  return page.evaluate(() => {
    const out = { cards: document.querySelectorAll('#blog article h3').length, marks: {} }
    for (const el of document.querySelectorAll('#blog article[data-slug]')) {
      out.marks[el.dataset.slug] = el.querySelector('[data-read-mark]')?.textContent?.trim() ?? null
    }
    return out
  })
}

const readingState = (page) =>
  page.evaluate(() => {
    const vis = (el) => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'
    return {
      attr: document.documentElement.dataset.reading ?? null,
      size: document.documentElement.dataset.readingSize ?? null,
      header: vis(document.querySelector('.chrome-bar button')),
      progress: vis(document.querySelector('.reading-progress')),
      recs: [...document.querySelectorAll('.blog-full article [data-reading-hide]')].some(vis),
      hideCount: document.querySelectorAll('.blog-full article [data-reading-hide]').length,
      column: document.querySelector('.blog-full article')?.getBoundingClientRect().width ?? 0,
      font: parseFloat(getComputedStyle(document.querySelector('.blog-article-body')).fontSize),
      pressed: document.querySelector('[data-reading-toggle]')?.getAttribute('aria-pressed') ?? null,
      toggleVisible: vis(document.querySelector('[data-reading-toggle]')),
    }
  })

async function run() {
  const browser = await openBrowser()
  try {
    // ── (1) (2) (4) direct link marks read with today's date; list shows it; date is sticky
    {
      const { ctx, page, errors } = await open(browser)
      try {
        await openArticle(page, A)
        const date = await today(page)
        const mark = await articleMark(page)
        check('(1) direct link shows the read line with today\'s date', mark === `Read on ${date}`, JSON.stringify({ mark, date }))
        const raw1 = await stored(page)
        const parsed = JSON.parse(raw1 ?? 'null')
        check('(1) direct link stores [slug, isoDate]',
          Array.isArray(parsed) && parsed.length === 1 && parsed[0]?.[0] === A && !Number.isNaN(Date.parse(parsed[0]?.[1])), raw1 ?? 'null')

        const list = await listMarks(page)
        check('(2) the read card shows the mark with the date', list.marks[A] === `Read on ${date}`, JSON.stringify(list.marks[A]))
        const others = Object.entries(list.marks).filter(([s, m]) => s !== A && m !== null)
        check('(2) other cards carry no mark', Object.keys(list.marks).length > 1 && others.length === 0, JSON.stringify(others))

        await page.waitForTimeout(1100)
        await openArticle(page, A)
        await articleMark(page)
        check('(4) re-opening a dated article keeps its stored date', (await stored(page)) === raw1, `${raw1} → ${await stored(page)}`)
        check('(1-4) no page errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (3) legacy array of slugs survives, undated; new marks are appended with a date
    {
      const { ctx, page, errors } = await open(browser, { [KEY]: JSON.stringify([A]) })
      try {
        const list = await listMarks(page)
        check('(3) legacy slug is marked read without a date in the list', list.marks[A] === 'Read', JSON.stringify(list.marks[A]))
        await openArticle(page, A)
        check('(3) legacy slug is marked read without a date on the article', (await articleMark(page)) === 'Read')
        check('(3) opening a legacy article leaves the stored value untouched', (await stored(page)) === JSON.stringify([A]), (await stored(page)) ?? 'null')
        await openArticle(page, B)
        await articleMark(page)
        const raw = await stored(page)
        const v = JSON.parse(raw ?? 'null')
        check('(3) stored value keeps the legacy slug and adds the new one with a date',
          Array.isArray(v) && v.length === 2 && v[0] === A && v[1]?.[0] === B && !Number.isNaN(Date.parse(v[1]?.[1])), raw ?? 'null')
        check('(3) no page errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (5) garbage in the key: list renders, nothing marked, nothing thrown
    for (const garbage of ['{"a":1}', 'not json', '[1,null,{"x":2},["only-one"],["a",5]]']) {
      const { ctx, page, errors } = await open(browser, { [KEY]: garbage })
      try {
        const list = await listMarks(page)
        const marked = Object.values(list.marks).filter((m) => m !== null)
        check(`(5) garbage ${garbage.slice(0, 12)}… renders the list and marks nothing`,
          list.cards > 1 && marked.length === 0 && errors.length === 0, JSON.stringify({ cards: list.cards, marked, errors }))
        check(`(5) garbage ${garbage.slice(0, 12)}… is not cleared by rendering`, (await stored(page)) === garbage, (await stored(page)) ?? 'null')
      } finally { await ctx.close() }
    }

    // ── (6) (7) (8) reading mode
    {
      const { ctx, page, errors } = await open(browser)
      try {
        await openArticle(page, A)
        const toggle = page.locator('[data-reading-toggle]')
        const off = await readingState(page)
        check('(6) reading mode starts off with the chrome visible',
          off.attr === null && off.header && off.recs && off.hideCount > 0 && off.pressed === 'false', JSON.stringify(off))
        check('(6) the toggle has an accessible name', ((await toggle.getAttribute('aria-label')) ?? (await toggle.textContent()) ?? '').trim().length > 0)

        await toggle.focus()
        await page.keyboard.press('Enter')
        const on = await readingState(page)
        check('(6) toggling hides the site header and the recommendations', on.attr === 'on' && !on.header && !on.recs && on.pressed === 'true', JSON.stringify(on))
        check('(6) toggling narrows the column', on.column > 0 && on.column < off.column, `${off.column} → ${on.column}`)
        check('(6) the toggle and the progress bar stay visible in reading mode', on.toggleVisible && on.progress, JSON.stringify(on))

        await page.keyboard.press('Escape')
        const esc = await readingState(page)
        check('(6) Escape restores the chrome', esc.attr === null && esc.header && esc.recs && esc.pressed === 'false', JSON.stringify(esc))

        await toggle.click()
        await page.reload({ waitUntil: 'networkidle' })
        await page.waitForSelector('.blog-article-body')
        const reloaded = await readingState(page)
        check('(6) reading mode survives a reload', reloaded.attr === 'on' && !reloaded.header && reloaded.pressed === 'true', JSON.stringify(reloaded))

        // (7) text size
        const fonts = {}
        for (const n of ['1', '2', '3']) {
          await page.locator(`[data-reading-size-btn="${n}"]`).click()
          fonts[n] = (await readingState(page)).font
        }
        check('(7) three text sizes, each larger than the last', fonts['1'] < fonts['2'] && fonts['2'] < fonts['3'], JSON.stringify(fonts))
        check('(7) the active size is exposed with aria-pressed',
          (await page.locator('[data-reading-size-btn="3"]').getAttribute('aria-pressed')) === 'true' &&
          (await page.locator('[data-reading-size-btn="1"]').getAttribute('aria-pressed')) === 'false')
        await page.reload({ waitUntil: 'networkidle' })
        await page.waitForSelector('.blog-article-body')
        const sized = await readingState(page)
        check('(7) text size survives a reload', sized.size === '3' && sized.font === fonts['3'], JSON.stringify(sized))

        // (8) leaving the article restores the chrome, and the choice is still remembered
        await page.evaluate(() => {
          history.pushState(null, '', '#blog')
          window.dispatchEvent(new HashChangeEvent('hashchange'))
        })
        await page.waitForSelector('header', { state: 'visible', timeout: 5_000 }).catch(() => {})
        await page.waitForTimeout(600)
        const left = await page.evaluate(() => ({
          attr: document.documentElement.dataset.reading ?? null,
          header: (document.querySelector('header')?.getClientRects().length ?? 0) > 0,
          footer: (document.querySelector('footer')?.getClientRects().length ?? 0) > 0,
          remembered: localStorage.getItem('portfolio-reading-mode'),
        }))
        check('(8) back in the list the header and footer are visible with reading mode on',
          left.attr === null && left.header && left.footer && left.remembered === 'on', JSON.stringify(left))
        check('(6-8) no page errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── (9) XP theme: no toggle, and a remembered reading mode is not applied
    {
      const { ctx, page, errors } = await open(browser, { 'portfolio-theme': 'xp', 'portfolio-reading-mode': 'on' })
      try {
        await openArticle(page, A)
        await page.waitForTimeout(300)
        const s = await page.evaluate(() => ({
          theme: document.documentElement.dataset.theme ?? null,
          toggles: document.querySelectorAll('[data-reading-toggle]').length,
          attr: document.documentElement.dataset.reading ?? null,
        }))
        check('(9) XP theme does not render the reading toggle', s.theme === 'xp' && s.toggles === 0 && s.attr === null, JSON.stringify(s))
        check('(9) no page errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── Storage that throws must not break the article
    {
      const { ctx, page, errors } = await open(browser)
      try {
        await page.addInitScript(() => {
          Storage.prototype.setItem = () => { throw new Error('quota') }
        })
        await openArticle(page, A)
        const mark = await articleMark(page)
        await page.locator('[data-reading-toggle]').click()
        const s = await readingState(page)
        check('blocked storage: the article still marks itself read and toggles for the session',
          (mark ?? '').startsWith('Read on') && s.attr === 'on' && errors.length === 0, JSON.stringify({ mark, attr: s.attr, errors }))
      } finally { await ctx.close() }
    }
  } finally {
    await browser.close()
  }

  console.log(`\nReading checks: ${checks - failures.length}/${checks} passed`)
  if (failures.length) {
    console.log('FAILED:')
    console.log(failures.join('\n'))
    process.exit(1)
  }
  console.log('ALL PASSED')
}

run().catch((e) => { console.error(e); process.exit(1) })
