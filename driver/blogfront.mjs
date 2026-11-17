/**
 * The blog's front: one blog with three tabs, a lead article over a level
 * grid, a still of the lead's figure, series (card, article, end of article,
 * the home showcase) and the contents list inside an article.
 *
 * What a tab, a tag or a series must hold is read from the content sources;
 * the page is what is under test, so it is never its own oracle.
 *
 * Needs a server (BASE_URL, default http://localhost:4193/portfolio/).
 * Exits 0 when every check passes.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_URL, VIEWPORTS, loadXp, newPage, openBrowser } from './helpers.mjs'

const READ = 'portfolio-read-posts'
const PROGRESS = 'portfolio-reading-progress'
const [MOBILE, TABLET, , DESKTOP] = VIEWPORTS
const STAMP = '2026-01-05T15:00:00.000Z'

const failures = []
let checks = 0
function check(name, cond, extra = '') {
  checks++
  if (!cond) failures.push(`  ✗ ${name}${extra ? ` — ${extra}` : ''}`)
  else console.log(`  ✓ ${name}`)
}
const j = (v) => JSON.stringify(v)
const same = (a, b) => j([...a].sort()) === j([...b].sort())

// ─── What the sources say ────────────────────────────────────────────────────

/** Every post: id, slug, titles, date, tags, category, series and the alt text of its first figure per language. */
function sourcePosts() {
  const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'blog', 'content')
  const files = [path.join(dir, 'posts.ts'), ...fs.readdirSync(path.join(dir, 'posts')).map((f) => path.join(dir, 'posts', f))]
  const posts = []
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8')
    const heads = [...src.matchAll(/\bid: '([^']+)',\s*slug: '([^']+)',/g)]
    heads.forEach((m, i) => {
      const chunk = src.slice(m.index, heads[i + 1]?.index ?? src.length)
      const field = (re) => re.exec(chunk)?.[1] ?? null
      const str = (name) => field(new RegExp(`\\b${name}:\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)")`))
        ?? new RegExp(`\\b${name}:\\s*"((?:[^"\\\\]|\\\\.)*)"`).exec(chunk)?.[1] ?? null
      const figures = [...chunk.matchAll(/!\[([^\]]*)\]\(figure\/([\w-]+)/g)]
      const firstId = figures[0]?.[2] ?? null
      // The Spanish body comes first, so the same figure's second appearance is the English one.
      const sameFigure = figures.filter((f) => f[2] === firstId)
      posts.push({
        id: m[1],
        slug: m[2],
        title: { es: str('title')?.replace(/\\'/g, "'"), en: str('titleEn')?.replace(/\\'/g, "'") },
        date: field(/\bdate: '([^']+)'/),
        tags: [...(field(/\btags: \[([^\]]*)\]/) ?? '').matchAll(/'([^']+)'/g)].map((t) => t[1]),
        category: field(/\bcategory: '([^']+)'/),
        series: field(/\bseries: '([^']+)'/),
        seriesOrder: Number(field(/\bseriesOrder: (\d+)/) ?? NaN),
        figure: firstId && { id: firstId, alt: { es: sameFigure[0][1], en: sameFigure[1]?.[1] ?? null } },
      })
    })
  }
  return posts
}

const POSTS = sourcePosts()
const bySlug = Object.fromEntries(POSTS.map((p) => [p.slug, p]))
const slugOf = (id) => POSTS.find((p) => p.id === id)?.slug
const ESSAYS = POSTS.filter((p) => p.category === 'ensayo')
const TECHNICAL = POSTS.filter((p) => p.category !== 'ensayo')
const EXPECTED = { all: POSTS, essays: ESSAYS, technical: TECHNICAL }

/** The path the series was specified to read as. */
const AI_ORDER = [
  'the-harness-decides', 'give-the-agent-something-that-fails', 'tools-for-agents', 'context-is-a-budget',
  'agent-memory-is-curation', 'review-rounds-are-not-a-user', 'ai-proposes-transaction-decides', 'your-next-reader-is-a-model',
].map(slugOf)
const AI_SERIES = { es: 'Trabajar con AI', en: 'Working with AI' }
const PLAIN = POSTS.find((p) => !p.series && p.category !== 'ensayo').slug
const TAG = 'arquitectura'

const T = {
  es: { tabs: ['Todos', 'Ensayos', 'Técnico'], showAll: 'Mostrar todos', more: 'Cargar más', tag: 'Arquitectura', unread: 'No leídos', essay: 'Ensayo',
    part: (n, t) => `Parte ${n} de ${t} · ${AI_SERIES.es}`, read: (n, t) => (n ? `Leíste ${n} de ${t}` : `Aún no has leído ninguna de las ${t} partes`),
    start: 'Empezar la serie', cont: (n) => `Continuar con la parte ${n}`, again: 'Releer desde el inicio', allEssays: 'Ver todos los ensayos',
    next: 'Siguiente de la serie', contents: 'Contenido', left: /quedan (\d+) min/ },
  en: { tabs: ['All', 'Essays', 'Technical'], showAll: 'Show all', more: 'Load more', tag: 'Architecture', unread: 'Unread', essay: 'Essay',
    part: (n, t) => `Part ${n} of ${t} · ${AI_SERIES.en}`, read: (n, t) => (n ? `You have read ${n} of ${t}` : `You have not read any of the ${t} parts yet`),
    start: 'Start the series', cont: (n) => `Continue with part ${n}`, again: 'Reread from the start', allEssays: 'See all essays',
    next: 'Next in the series', contents: 'Contents', left: /(\d+) min left/ },
}

// ─── Page helpers ────────────────────────────────────────────────────────────

/** A fresh context on `hash`, with localStorage seeded once and errors collected. */
async function open(browser, { lang = 'en', viewport = DESKTOP, hash = '#blog', seed = {}, reducedMotion } = {}) {
  const { ctx, page } = await newPage(browser, viewport, lang, { reducedMotion })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  await page.addInitScript((s) => {
    if (sessionStorage.getItem('seeded')) return
    sessionStorage.setItem('seeded', '1')
    for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v)
  }, seed)
  await page.goto(`${BASE_URL}${hash}`, { waitUntil: 'networkidle' })
  if (hash.startsWith('#blog/article/')) await page.waitForSelector('.blog-full .blog-article-body', { timeout: 10_000 }).catch(() => {})
  else await page.waitForSelector('#blog article[data-slug]', { timeout: 10_000 }).catch(() => {})
  await page.waitForTimeout(500)
  return { ctx, page, errors }
}

const articleHash = (slug) => `#blog/article/${slug}`
const tab = (page, key) => page.locator(`#blog [role="tab"][data-blog-tab="${key}"]`)
const tagChip = (page, lang) => page.locator('#blog').getByRole('button', { name: T[lang].tag, exact: true })
const listSlugs = (page) => page.evaluate(() => [...document.querySelectorAll('#blog article[data-slug]')].map((el) => el.dataset.slug))

async function showAll(page, lang) {
  const btn = page.locator('#blog').getByRole('button', { name: T[lang].showAll })
  if (await btn.count()) await btn.first().click()
  await page.waitForTimeout(400)
}

async function selectTab(page, key, lang) {
  await tab(page, key).click({ timeout: 3000 }).catch(() => {})
  await page.waitForTimeout(400)
  await showAll(page, lang)
}

const tabStates = (page) =>
  page.evaluate(() => [...document.querySelectorAll('#blog [role="tablist"] [role="tab"]')].map((t) => ({
    key: t.dataset.blogTab, label: t.firstChild?.textContent?.trim() ?? '', selected: t.getAttribute('aria-selected'), tabindex: t.tabIndex,
    focused: document.activeElement === t,
  })))

/** The front as drawn: the lead, the cards under it and the figures mounted in the list. */
const front = (page) =>
  page.evaluate(() => {
    const card = (el) => {
      const r = el.getBoundingClientRect()
      return {
        slug: el.dataset.slug, lead: el.hasAttribute('data-lead'), state: el.dataset.readState ?? null, w: r.width, h: r.height, top: Math.round(r.top + window.scrollY),
        title: el.querySelector('h3')?.textContent.trim() ?? '', excerpt: el.querySelector('h3 ~ p')?.textContent.trim() ?? '',
        date: el.querySelector('time')?.getAttribute('datetime') ?? null, shown: el.querySelector('time')?.textContent.trim() ?? null,
        min: /\d+ min/.test(el.textContent), tags: el.querySelectorAll('.skill-tag').length, series: el.querySelector('[data-series-part]')?.textContent.trim() ?? null,
        excerptClipped: (() => { const p = el.querySelector('h3 ~ p'); return !!p && p.scrollHeight > p.clientHeight + 1 })(),
      }
    }
    const cards = [...document.querySelectorAll('#blog article[data-slug]')].map(card)
    const figs = [...document.querySelectorAll('#blog .fig')].map((f) => ({
      inLead: !!f.closest('article[data-lead]'), preview: f.hasAttribute('data-fig-preview'), role: f.getAttribute('role'), name: f.getAttribute('aria-label'),
      buttons: f.querySelectorAll('button, [data-fig-control], .fig-narration').length, focusable: f.hasAttribute('tabindex') || !!f.querySelector('[tabindex], a[href], button'),
      inert: !!f.querySelector('.fig-stage')?.inert, w: f.getBoundingClientRect().width, playing: f.getAttribute('data-fig-playing'),
    }))
    return { cards, figs, text: document.querySelector('#blog')?.innerText ?? '' }
  })

/** Cards of the grid grouped by the row they sit on: [[heights…], …]. */
const rows = (cards) => {
  const by = new Map()
  for (const c of cards.filter((x) => !x.lead)) by.set(c.top, [...(by.get(c.top) ?? []), c.h])
  return [...by.values()]
}
const level = (rs) => rs.some((r) => r.length > 1) && rs.every((r) => r.every((h) => Math.abs(h - r[0]) < 1))

const showcase = (page) =>
  page.evaluate(() => {
    const s = document.querySelector('#essays')
    if (!s) return null
    const action = s.querySelector('[data-series-action]')
    return {
      nextId: s.nextElementSibling?.id ?? '', heading: s.querySelector('h2')?.textContent.trim() ?? '', deck: s.querySelector('[data-deck]')?.textContent.trim() ?? '',
      name: s.querySelector('[data-series-name]')?.textContent.trim() ?? '', description: s.querySelector('[data-series-description]')?.textContent.trim() ?? '',
      progress: s.querySelector('[data-series-progress]')?.textContent.trim() ?? '',
      ordered: s.querySelector('[data-essay-slug]')?.parentElement?.tagName ?? '',
      parts: [...s.querySelectorAll('[data-essay-slug]')].map((el) => ({
        slug: el.dataset.essaySlug, state: el.dataset.readState, title: el.querySelector('a')?.textContent.trim() ?? '', href: el.querySelector('a')?.getAttribute('href') ?? '',
        mark: !!el.querySelector('[data-read-mark]'), cont: !!el.querySelector('[data-continue-mark]'),
      })),
      action: action && { text: action.textContent.trim(), href: action.getAttribute('href'), primary: action.classList.contains('px-btn') },
      actions: s.querySelectorAll('.px-btn').length,
      all: s.querySelector('[data-all-essays]')?.textContent.trim() ?? '',
      // Text is clipped where a box that hides its overflow holds more than it shows.
      clipped: [...s.querySelectorAll('*')].filter((el) => {
        const c = getComputedStyle(el)
        return !el.closest('.sr-only, svg') && el.clientHeight > 0 && (c.overflowX !== 'visible' || c.overflowY !== 'visible')
          && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)
      }).map((el) => `${el.tagName}:${el.textContent.trim().slice(0, 30)}`),
      textBlocks: s.querySelectorAll('h2, h3, p, li, a').length,
      clampUsed: [...s.querySelectorAll('*')].some((el) => { const c = getComputedStyle(el); return c.webkitLineClamp !== 'none' || c.textOverflow === 'ellipsis' }),
    }
  })

const articleState = (page) =>
  page.evaluate(() => {
    const root = document.querySelector('.blog-full')
    const article = root?.querySelector('article')
    const next = root?.querySelector('[data-series-next]')
    const nav = root?.querySelector('[data-nav-slug]')?.closest('nav')
    return {
      hash: location.hash, articles: root?.querySelectorAll('article h1').length ?? 0, h1: article?.querySelector('h1')?.textContent.trim() ?? '',
      masthead: root?.querySelector('#blog h2')?.textContent.trim() ?? '', text: root?.innerText ?? '',
      kicker: root?.querySelector('[data-article-kicker]')?.textContent.trim() ?? null,
      part: root?.querySelector('article [data-series-part]')?.textContent.trim() ?? null,
      end: !!root?.querySelector('[data-series-end]'), endProgress: root?.querySelector('[data-series-end] [data-series-progress]')?.textContent.trim() ?? null,
      next: next && { slug: next.dataset.seriesNext, text: next.textContent.replace(/\s+/g, ' ').trim(), state: next.dataset.readState ?? null, tag: next.tagName,
        beforeNav: !!nav && !!(next.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING) },
      closing: root?.querySelector('[data-series-closing]')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
      shownDate: article?.querySelector('time')?.textContent.trim() ?? null,
    }
  })

const contents = (page) =>
  page.evaluate(() => {
    const nav = document.querySelector('.blog-full [data-article-contents]')
    if (!nav) return null
    const vis = (el) => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'
    const status = nav.querySelector('[data-time-left]')
    const box = nav.firstElementChild.getBoundingClientRect()
    const body = document.querySelector('.blog-full .blog-article-body').getBoundingClientRect()
    const toggle = nav.querySelector('[data-contents-toggle]')
    return {
      visible: vis(nav), label: nav.getAttribute('aria-label'),
      entries: [...nav.querySelectorAll('[data-section]')].map((b) => ({ id: b.dataset.section, text: b.textContent.trim(), tag: b.tagName, current: b.getAttribute('aria-current'), visible: vis(b), href: b.getAttribute('href') })),
      headings: [...document.querySelectorAll('.blog-full .blog-article-body h2')].map((h) => ({ id: h.id, text: h.textContent.trim(), top: Math.round(h.getBoundingClientRect().top) })),
      left: Number(status?.dataset.timeLeft), percent: Number(status?.dataset.progress), status: status?.textContent.trim() ?? '',
      box: { left: box.left, right: box.right, top: box.top }, body: { left: body.left, right: body.right },
      article: document.querySelector('.blog-full article').getBoundingClientRect().right,
      toggle: toggle && { visible: vis(toggle), expanded: toggle.getAttribute('aria-expanded'), tag: toggle.tagName },
      links: nav.querySelectorAll('a[href^="#"]').length,
    }
  })

/** Scrolls the open article so that `fraction` of its body is behind the reader. */
async function scrollBody(page, fraction) {
  await page.evaluate((f) => {
    const r = document.querySelector('.blog-full .blog-article-body').getBoundingClientRect()
    window.scrollTo({ top: window.scrollY + r.top + f * (r.height - window.innerHeight), behavior: 'instant' })
  }, fraction)
  await page.waitForTimeout(250)
}

/** Font sizes under 12 px and horizontal overflow, among the blocks this unit draws. */
const smallAndWide = (page, selector) =>
  page.evaluate((sel) => {
    const own = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
    const els = [...document.querySelectorAll(sel)].flatMap((el) => [el, ...el.querySelectorAll('*')])
      .filter((el) => el.getClientRects().length > 0 && !el.closest('.sr-only') && !el.closest('svg'))
    return {
      blocks: document.querySelectorAll(sel).length,
      small: els.filter((el) => own(el) && parseFloat(getComputedStyle(el).fontSize) < 12).map((el) => `${el.tagName}.${el.className}:${el.textContent.trim().slice(0, 20)}`),
      wide: els.filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1 || el.getBoundingClientRect().left < -1).map((el) => `${el.tagName}.${String(el.className).slice(0, 30)}`),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    }
  }, selector)

const FRONT_BLOCKS = '#blog [role="tablist"], #blog article[data-slug], #essays [data-series-showcase], #essays [data-all-essays]'
const ARTICLE_BLOCKS = '.blog-full [data-article-contents], .blog-full [data-series-end], .blog-full .blogfront-kind'

// ─── Checks ──────────────────────────────────────────────────────────────────

async function run() {
  check('sources: essays, technical posts and the eight parts of the series are found',
    ESSAYS.length > 0 && TECHNICAL.length > 0 && AI_ORDER.every(Boolean) && new Set(AI_ORDER).size === 8, j({ essays: ESSAYS.length, technical: TECHNICAL.length, AI_ORDER }))
  check('sources: the series is ordered as specified',
    j(POSTS.filter((p) => p.series === 'Working with AI').sort((a, b) => a.seriesOrder - b.seriesOrder).map((p) => p.slug)) === j(AI_ORDER))

  const browser = await openBrowser()
  try {
    for (const lang of ['es', 'en']) {
      const t = T[lang]

      // ── Tabs ──────────────────────────────────────────────────────────────
      {
        const { ctx, page, errors } = await open(browser, { lang })
        try {
          const head = await page.evaluate(() => ({ title: document.querySelector('#blog h2')?.textContent.trim(), deck: document.querySelector('#blog [data-deck]')?.textContent ?? '' }))
          check(`[${lang}] the section is titled "Blog"`, head.title === 'Blog', head.title)
          check(`[${lang}] the subtitle covers both kinds of writing`, /ensayos/i.test(head.deck) === (lang === 'es') && /essays/i.test(head.deck) === (lang === 'en') && /t[eé]c[h]?n/i.test(head.deck), head.deck)

          let tabs = await tabStates(page)
          check(`[${lang}] a tablist holds the three tabs, labelled`, j(tabs.map((x) => x.label)) === j(t.tabs) && j(tabs.map((x) => x.key)) === j(['all', 'essays', 'technical']), j(tabs))
          check(`[${lang}] "all" is selected at first, and only it is in the tab order`, j(tabs.map((x) => x.selected)) === j(['true', 'false', 'false']) && j(tabs.map((x) => x.tabindex)) === j([0, -1, -1]), j(tabs))
          check(`[${lang}] the old essays quick filter is gone`, (await page.locator('#blog [data-filter-essays]').count()) === 0)
          const panel = await page.evaluate(() => {
            const p = document.querySelector('#blog [role="tabpanel"]')
            return p && { by: p.getAttribute('aria-labelledby'), controls: document.querySelector('#blog [role="tab"][aria-selected="true"]')?.getAttribute('aria-controls'), id: p.id, selected: document.querySelector('#blog [role="tab"][aria-selected="true"]')?.id, holds: !!p.querySelector('article[data-slug]') }
          })
          check(`[${lang}] the list is the tab panel of the selected tab`, !!panel && panel.by === panel.selected && panel.controls === panel.id && panel.holds, j(panel))

          await showAll(page, lang)
          const initial = await listSlugs(page)
          check(`[${lang}] the "all" tab lists every post`, same(initial, POSTS.map((p) => p.slug)), `${initial.length}/${POSTS.length}`)
          for (const key of ['essays', 'technical', 'all']) {
            await selectTab(page, key, lang)
            const got = await listSlugs(page)
            tabs = await tabStates(page)
            check(`[${lang}] the ${key} tab leaves exactly its posts`, same(got, EXPECTED[key].map((p) => p.slug)), `${got.length}/${EXPECTED[key].length}`)
            check(`[${lang}] the ${key} tab reports its state`, tabs.every((x) => (x.selected === 'true') === (x.key === key) && (x.tabindex === 0) === (x.key === key)), j(tabs))
          }

          // Arrow keys, Home and End.
          await tab(page, 'all').focus()
          await page.keyboard.press('ArrowRight')
          await page.waitForTimeout(300)
          let keyed = await tabStates(page)
          check(`[${lang}] ArrowRight selects and focuses the next tab`, keyed[1].selected === 'true' && keyed[1].focused, j(keyed))
          await page.keyboard.press('End')
          await page.waitForTimeout(300)
          keyed = await tabStates(page)
          check(`[${lang}] End goes to the last tab`, keyed[2].selected === 'true' && keyed[2].focused, j(keyed))
          await page.keyboard.press('ArrowRight')
          await page.waitForTimeout(300)
          keyed = await tabStates(page)
          check(`[${lang}] ArrowRight wraps to the first tab`, keyed[0].selected === 'true' && keyed[0].focused, j(keyed))
          await page.keyboard.press('ArrowLeft')
          await page.waitForTimeout(300)
          check(`[${lang}] ArrowLeft wraps to the last tab`, (await tabStates(page))[2].selected === 'true')
          await page.keyboard.press('Home')
          await page.waitForTimeout(300)
          check(`[${lang}] Home returns to the first tab`, (await tabStates(page))[0].selected === 'true')
          check(`[${lang}] tabs: no page or console errors`, errors.length === 0, errors.join(' | '))
        } finally { await ctx.close() }
      }

      // ── Tab + tag + unread compose; the tab survives a visit to an article ──
      {
        const key = ['technical', 'essays'].find((k) => EXPECTED[k].filter((p) => p.tags.includes(TAG)).length >= 2)
        const both = EXPECTED[key].filter((p) => p.tags.includes(TAG)).map((p) => p.slug)
        const withTag = POSTS.filter((p) => p.tags.includes(TAG)).map((p) => p.slug)
        const read = both[0]
        const { ctx, page, errors } = await open(browser, { lang, seed: { [READ]: JSON.stringify([[read, STAMP]]) } })
        try {
          await tagChip(page, lang).click()
          await page.waitForTimeout(400)
          await showAll(page, lang)
          check(`[${lang}] the tag filter alone lists every post with the tag`, same(await listSlugs(page), withTag))
          await selectTab(page, key, lang)
          const composed = await listSlugs(page)
          check(`[${lang}] the ${key} tab composes with the tag filter`, both.length < withTag.length && both.length < EXPECTED[key].length && same(composed, both), `${composed.length}/${both.length}`)
          const unread = page.locator('#blog [data-filter-unread]')
          await unread.click()
          await page.waitForTimeout(400)
          await showAll(page, lang)
          const three = await listSlugs(page)
          check(`[${lang}] tab, tag and unread compose`, same(three, both.filter((s) => s !== read)) && (await unread.getAttribute('aria-pressed')) === 'true', `${three.length}/${both.length - 1}`)
          check(`[${lang}] the counter and the search box are still there`,
            (await page.locator('#blog [data-read-counter]').count()) === 1 && (await page.locator('#blog input').count()) >= 1)
          await selectTab(page, 'all', lang)
          check(`[${lang}] back on "all", tag and unread still apply`, same(await listSlugs(page), withTag.filter((s) => s !== read)))
          await unread.click()

          // Leave for an article and come back: the tab is still the one chosen.
          await selectTab(page, 'essays', lang)
          await page.evaluate((h) => { history.pushState(null, '', h); window.dispatchEvent(new HashChangeEvent('hashchange')) }, articleHash(ESSAYS[0].slug))
          await page.waitForSelector('.blog-full .blog-article-body', { timeout: 10_000 }).catch(() => {})
          await page.waitForTimeout(700)
          await page.evaluate(() => { history.pushState(null, '', '#blog'); window.dispatchEvent(new HashChangeEvent('hashchange')) })
          await page.waitForFunction(() => !document.querySelector('.blog-full') && document.querySelectorAll('#blog [role="tablist"]').length === 1, null, { timeout: 10_000 }).catch(() => {})
          await page.waitForTimeout(600)
          await showAll(page, lang)
          const back = await tabStates(page)
          check(`[${lang}] the active tab survives opening an article`, back.find((x) => x.key === 'essays')?.selected === 'true' && same(await listSlugs(page), ESSAYS.map((p) => p.slug)), j(back))
          check(`[${lang}] composition: no page or console errors`, errors.length === 0, errors.join(' | '))
        } finally { await ctx.close() }
      }

      // ── The lead, its figure, the grid, dates, pagination, search ─────────
      {
        const { ctx, page, errors } = await open(browser, { lang })
        try {
          let f = await front(page)
          const newest = (set) => { const max = set.map((p) => p.date).sort().at(-1); return set.filter((p) => p.date === max).map((p) => p.slug) }
          const lead = f.cards[0]
          check(`[${lang}] the lead is the first card and the only lead`, !!lead?.lead && f.cards.filter((c) => c.lead).length === 1, j(f.cards.map((c) => c.lead)))
          check(`[${lang}] the lead is the newest post of the result`, newest(POSTS).includes(lead?.slug), lead?.slug)
          check(`[${lang}] the lead carries headline, excerpt, date, reading time, tags and its read state`,
            !!lead && lead.title === bySlug[lead.slug]?.title[lang] && lead.excerpt.length > 60 && lead.date === bySlug[lead.slug]?.date && lead.min && lead.tags > 0 && lead.state === 'unread', j(lead))
          check(`[${lang}] the lead's excerpt is whole, the grid's are shorter`,
            !lead.excerptClipped && f.cards.slice(1).some((c) => c.excerptClipped), j(f.cards.map((c) => c.excerptClipped)))
          const second = f.cards[1]
          check(`[${lang}] the lead is wider than a card of the grid`, lead.w > second.w * 1.8, `${lead.w} vs ${second.w}`)
          check(`[${lang}] the first page is the lead and six cards`, f.cards.length === 7, String(f.cards.length))
          check(`[${lang}] cards in the same row have equal heights at 1440`, level(rows(f.cards)), j(rows(f.cards)))

          const expectDate = await page.evaluate(({ d, l }) => new Intl.DateTimeFormat(l, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(d)), { d: lead.date, l: lang })
          check(`[${lang}] dates are shown in the reader's language`, lead.shown === expectDate && /[a-z]{3}/i.test(lead.shown), `${lead.shown} vs ${expectDate}`)
          check(`[${lang}] no ISO date is visible in the list`, !/\b\d{4}-\d{2}-\d{2}\b/.test(f.text), f.text.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0])

          // The figure of the lead.
          const src = bySlug[lead.slug]
          check(`[${lang}] this lead's article has a figure in the sources`, !!src?.figure, lead.slug)
          const fig = f.figs[0]
          check(`[${lang}] the lead shows its figure as a still`, f.figs.length === 1 && fig.inLead && fig.preview && fig.w > 100, j(f.figs))
          check(`[${lang}] the still has no player, no narration and nothing to focus`, !!fig && fig.buttons === 0 && !fig.focusable && fig.inert && fig.playing === null, j(fig))
          check(`[${lang}] the still is named by the article's alt text`, !!fig && fig.role === 'img' && fig.name === src.figure.alt[lang] && fig.name.length > 20, `${fig?.name} | ${src?.figure?.alt[lang]}`)
          const finalState = await page.evaluate(() => {
            const el = document.querySelector('#blog .fig')
            return { hidden: el.querySelectorAll('[data-on="false"]').length, shown: el.querySelectorAll('[data-on="true"]').length }
          })
          check(`[${lang}] the still is the figure's final state`, finalState.hidden === 0 && finalState.shown > 0, j(finalState))
          await page.waitForTimeout(3000)
          check(`[${lang}] the still does not play`, (await page.evaluate(() => document.querySelectorAll('#blog .fig [data-on="false"]').length)) === 0)

          // Pagination keeps its behaviour.
          await page.locator('#blog').getByRole('button', { name: t.more }).click()
          await page.waitForTimeout(500)
          check(`[${lang}] "load more" adds six cards`, (await listSlugs(page)).length === 13, String((await listSlugs(page)).length))
          await showAll(page, lang)
          f = await front(page)
          check(`[${lang}] "show all" shows every post, newest first`, f.cards.length === POSTS.length && f.cards.every((c, i) => i === 0 || f.cards[i - 1].date >= c.date), String(f.cards.length))
          check(`[${lang}] only one figure is mounted in the whole list`, f.figs.length === 1 && f.figs[0].inLead, String(f.figs.length))
          check(`[${lang}] every row of the full grid is level`, level(rows(f.cards)), j(rows(f.cards).filter((r) => new Set(r.map((h) => Math.round(h))).size > 1)))
          const aiCard = f.cards.find((c) => c.slug === AI_ORDER[2])
          check(`[${lang}] a card of the series says which part it is`, aiCard?.series === t.part(3, 8), aiCard?.series)
          check(`[${lang}] a card outside any series says nothing of the kind`, f.cards.find((c) => c.slug === PLAIN)?.series === null)

          // Each tab has its own lead.
          for (const key of ['essays', 'technical']) {
            await selectTab(page, key, lang)
            const g = await front(page)
            check(`[${lang}] the ${key} tab leads with its own newest post`, g.cards[0]?.lead && newest(EXPECTED[key]).includes(g.cards[0].slug), g.cards[0]?.slug)
          }
          await selectTab(page, 'all', lang)

          // A lead without a figure shows none.
          await page.locator('#blog').getByRole('button', { name: '.NET', exact: true }).click()
          await page.waitForTimeout(500)
          const plain = await front(page)
          check(`[${lang}] a result whose first post has no figure has a lead without one`,
            plain.cards[0]?.lead && bySlug[plain.cards[0].slug]?.figure === null && plain.figs.length === 0, j({ slug: plain.cards[0]?.slug, figs: plain.figs.length }))
          await page.locator('#blog').getByRole('button', { name: '.NET', exact: true }).first().click()
          await page.waitForTimeout(400)

          // Searching: results only, no lead.
          const input = page.locator('#blog input').first()
          await input.fill('sql')
          await page.waitForTimeout(700)
          const searching = await front(page)
          check(`[${lang}] with a search query there is no lead and no figure`, searching.cards.length > 0 && searching.cards.every((c) => !c.lead) && searching.figs.length === 0, j(searching.cards.filter((c) => c.lead)))
          check(`[${lang}] search results show no ISO date`, !/\b\d{4}-\d{2}-\d{2}\b/.test(searching.text))
          await input.fill('')
          await page.waitForTimeout(700)
          check(`[${lang}] clearing the search brings the lead back`, (await front(page)).cards[0]?.lead === true)
          check(`[${lang}] front: no page or console errors`, errors.length === 0, errors.join(' | '))
        } finally { await ctx.close() }
      }

      // ── Level rows at 768 ─────────────────────────────────────────────────
      {
        const { ctx, page } = await open(browser, { lang, viewport: TABLET })
        try {
          await showAll(page, lang)
          const f = await front(page)
          check(`[${lang}] cards in the same row have equal heights at 768`, level(rows(f.cards)) && f.cards[0].lead, j(rows(f.cards).slice(0, 4)))
        } finally { await ctx.close() }
      }

      // ── The series showcase ───────────────────────────────────────────────
      {
        const { ctx, page, errors } = await open(browser, { lang, hash: '#essays' })
        try {
          const s = await showcase(page)
          check(`[${lang}] the essays block keeps its id, its heading and its place before the blog`, s?.heading === (lang === 'es' ? 'Ensayos' : 'Essays') && s.nextId === 'blog' && s.deck.length > 10, j(s && [s.heading, s.nextId]))
          check(`[${lang}] it presents the series by name, with a description`, s?.name === AI_SERIES[lang] && s.description.length > 40, j(s && [s.name, s.description]))
          check(`[${lang}] it lists the eight parts in the specified order, as an ordered list`, j(s?.parts.map((p) => p.slug)) === j(AI_ORDER) && s.ordered === 'OL', j(s?.parts.map((p) => p.slug)))
          check(`[${lang}] every part has its title and a link to its article`, s?.parts.every((p) => p.title === bySlug[p.slug].title[lang] && p.href === articleHash(p.slug)), j(s?.parts.map((p) => p.title)))
          check(`[${lang}] with nothing read: every part unread, the progress says so`, s?.parts.every((p) => p.state === 'unread' && !p.mark && !p.cont) && s.progress === t.read(0, 8), s?.progress)
          check(`[${lang}] with nothing read the one primary action starts the series at part 1`,
            s?.action?.text === t.start && s.action.href === articleHash(AI_ORDER[0]) && s.action.primary && s.actions === 1, j(s?.action))
          check(`[${lang}] one link offers every essay`, s?.all === t.allEssays, s?.all)
          check(`[${lang}] no text of the showcase is clipped, and none is clamped`, s?.clipped.length === 0 && !s.clampUsed && s.textBlocks > 20, j(s?.clipped))

          // "All essays" lands on the blog with the Essays tab selected.
          await page.click('#essays [data-all-essays]')
          await page.waitForTimeout(900)
          const place = await page.evaluate(() => ({ hash: location.hash, top: document.querySelector('#blog').getBoundingClientRect().top }))
          await showAll(page, lang)
          const tabs = await tabStates(page)
          check(`[${lang}] "all essays" lands on the blog`, place.hash === '#blog' && place.top < window_h(DESKTOP) && place.top > -200, j(place))
          check(`[${lang}] "all essays" selects the Essays tab, which lists every essay`, tabs.find((x) => x.key === 'essays')?.selected === 'true' && same(await listSlugs(page), ESSAYS.map((p) => p.slug)), j(tabs))
          check(`[${lang}] showcase: no page or console errors`, errors.length === 0, errors.join(' | '))
        } finally { await ctx.close() }
      }

      // Two parts read and one started: progress, states, and the action opens the first unread part.
      {
        const seed = { [READ]: JSON.stringify([[AI_ORDER[0], STAMP], AI_ORDER[1]]), [PROGRESS]: JSON.stringify({ [AI_ORDER[2]]: [0.4, STAMP] }) }
        const { ctx, page, errors } = await open(browser, { lang, hash: '#essays', seed })
        try {
          const s = await showcase(page)
          check(`[${lang}] two read, one started: the progress follows the read state`, s?.progress === t.read(2, 8), s?.progress)
          check(`[${lang}] two read, one started: each part shows its state`,
            j(s?.parts.map((p) => p.state)) === j(['read', 'read', 'started', 'unread', 'unread', 'unread', 'unread', 'unread']) && s.parts[0].mark && s.parts[1].mark && s.parts[2].cont && !s.parts[3].mark, j(s?.parts.map((p) => p.state)))
          check(`[${lang}] the action continues with part 3`, s?.action?.text === t.cont(3) && s.action.href === articleHash(AI_ORDER[2]), j(s?.action))
          check(`[${lang}] with marks shown, still no clipped text`, s?.clipped.length === 0, j(s?.clipped))
          await page.click('#essays [data-series-action]')
          await page.waitForSelector('.blog-full .blog-article-body', { timeout: 10_000 }).catch(() => {})
          await page.waitForTimeout(500)
          const a = await articleState(page)
          check(`[${lang}] the action opens the first unread part`, a.hash === articleHash(AI_ORDER[2]) && a.h1 === bySlug[AI_ORDER[2]].title[lang], j([a.hash, a.h1]))
          check(`[${lang}] the article says how much of its series is read`, a.endProgress === t.read(2, 8), a.endProgress)
          check(`[${lang}] partial: no page or console errors`, errors.length === 0, errors.join(' | '))
        } finally { await ctx.close() }
      }

      // A gap: parts 1 and 3 read. The first unread part is 2.
      {
        const { ctx, page } = await open(browser, { lang, hash: '#essays', seed: { [READ]: JSON.stringify([AI_ORDER[0], AI_ORDER[2]]) } })
        try {
          const s = await showcase(page)
          check(`[${lang}] with a gap the action opens the first unread part, not the furthest`, s?.action?.text === t.cont(2) && s.action.href === articleHash(AI_ORDER[1]), j(s?.action))
        } finally { await ctx.close() }
      }

      // All read.
      {
        const { ctx, page } = await open(browser, { lang, hash: '#essays', seed: { [READ]: JSON.stringify(AI_ORDER.map((s) => [s, STAMP])) } })
        try {
          const s = await showcase(page)
          check(`[${lang}] all read: the progress is complete and the action rereads from part 1`,
            s?.progress === t.read(8, 8) && s.action?.text === t.again && s.action.href === articleHash(AI_ORDER[0]) && s.parts.every((p) => p.state === 'read'), j([s?.progress, s?.action]))
          check(`[${lang}] all read: no clipped text`, s?.clipped.length === 0, j(s?.clipped))
        } finally { await ctx.close() }
      }

      // ── A part of the series: kicker, part N of 8, next part ──────────────
      {
        const seed = { [READ]: JSON.stringify([[AI_ORDER[3], STAMP]]) }
        const { ctx, page, errors } = await open(browser, { lang, hash: articleHash(AI_ORDER[2]), seed })
        try {
          let a = await articleState(page)
          check(`[${lang}] an essay's masthead names the blog, not "Blog Técnico"`, a.masthead === 'Blog' && !/Blog Técnico|Technical Blog/i.test(a.text), a.masthead)
          check(`[${lang}] the kind of piece is a kicker`, a.kicker === t.essay, a.kicker)
          check(`[${lang}] the article says which part of the series it is`, a.part === t.part(3, 8), a.part)
          check(`[${lang}] the article's date is in the reader's language`, !!a.shownDate && !/\d{4}-\d{2}-\d{2}/.test(a.shownDate), a.shownDate)
          check(`[${lang}] its end offers the next part, before previous/next, as a button`,
            a.next?.slug === AI_ORDER[3] && a.next.text.includes(t.next) && a.next.text.includes(bySlug[AI_ORDER[3]].title[lang]) && a.next.beforeNav && a.next.tag === 'BUTTON', j(a.next))
          check(`[${lang}] the next part shows its read state`, a.next?.state === 'read' && (await page.locator('.blog-full [data-series-next] [data-read-mark]').count()) === 1, a.next?.state)
          check(`[${lang}] an article with a next part has no closing line`, a.closing === null)
          await page.click('.blog-full [data-series-next]')
          await page.waitForFunction((s) => location.hash.endsWith(s), AI_ORDER[3], { timeout: 5000 }).catch(() => {})
          await page.waitForTimeout(900)
          a = await articleState(page)
          check(`[${lang}] the next part opens`, a.hash === articleHash(AI_ORDER[3]) && a.h1 === bySlug[AI_ORDER[3]].title[lang] && a.part === t.part(4, 8), j([a.hash, a.h1, a.part]))
          check(`[${lang}] opening it leaves one article on the page`, a.articles === 1, String(a.articles))
          check(`[${lang}] series article: no page or console errors`, errors.length === 0, errors.join(' | '))
        } finally { await ctx.close() }
      }

      // The last part closes the series; a plain article shows none of it.
      {
        const { ctx, page } = await open(browser, { lang, hash: articleHash(AI_ORDER[7]) })
        try {
          let a = await articleState(page)
          check(`[${lang}] the last part says so and offers no next part`, a.part === t.part(8, 8) && a.next === null && !!a.closing && a.closing.includes(AI_SERIES[lang]), j([a.part, a.closing]))
          await page.click('.blog-full [data-series-restart]')
          await page.waitForTimeout(900)
          a = await articleState(page)
          check(`[${lang}] its link goes back to the start of the series`, a.hash === articleHash(AI_ORDER[0]) && a.part === t.part(1, 8) && a.articles === 1, j([a.hash, a.part]))
        } finally { await ctx.close() }
      }
      {
        const { ctx, page } = await open(browser, { lang, hash: articleHash(PLAIN) })
        try {
          const a = await articleState(page)
          check(`[${lang}] an article outside any series shows no part, no next part and no closing line`, a.part === null && !a.end && a.next === null && a.closing === null, j(a))
          check(`[${lang}] a technical article has no "essay" kicker and its masthead names the blog`, a.kicker === null && a.masthead === 'Blog', j([a.kicker, a.masthead]))
        } finally { await ctx.close() }
      }

      // ── Contents inside the article ───────────────────────────────────────
      {
        const { ctx, page, errors } = await open(browser, { lang, hash: articleHash(AI_ORDER[2]), reducedMotion: 'reduce' })
        try {
          let c = await contents(page)
          check(`[${lang}] the article lists its contents under a name`, !!c?.visible && c.label === t.contents, j(c && [c.visible, c.label]))
          check(`[${lang}] one entry per section, in order, as buttons and never as #links`,
            !!c && c.headings.length >= 2 && j(c.entries.map((e) => [e.id, e.text])) === j(c.headings.map((h) => [h.id, h.text])) && c.entries.every((e) => e.tag === 'BUTTON' && e.href === null) && c.links === 0, j(c?.entries))
          check(`[${lang}] on a wide window it sits beside the article column, without overlapping it`, c.box.left >= c.article && c.box.left >= c.body.right && c.box.right <= DESKTOP.width && c.toggle?.visible === false, j([c.box, c.article]))
          check(`[${lang}] at the top: nothing read, time left is the article's reading time, in words`, c.percent === 0 && c.left > 1 && t.left.exec(c.status)?.[1] === String(c.left), c.status)
          const total = c.left

          // Time left decreases, and never reads zero before the end.
          const samples = []
          for (const f of [0.25, 0.5, 0.75, 0.97, 0.995]) { await scrollBody(page, f); const s = await contents(page); samples.push({ f, left: s.left, percent: s.percent }) }
          check(`[${lang}] time left decreases as the reader advances`, samples.every((s, i) => s.left <= (samples[i - 1]?.left ?? total)) && samples[1].left < total, j(samples))
          check(`[${lang}] time left never reads zero before the end`, samples.every((s) => s.percent >= 100 || s.left >= 1) && samples.some((s) => s.percent < 100 && s.left === 1), j(samples))
          await scrollBody(page, 1.02)
          c = await contents(page)
          check(`[${lang}] at the end the progress is complete and no time is left`, c.percent === 100 && c.left === 0 && !t.left.test(c.status), c.status)

          // The section in view is the highlighted one.
          for (const n of [0, 2, c.headings.length - 1]) {
            await page.evaluate((id) => { const h = document.querySelector(`.blog-full .blog-article-body #${id}`); window.scrollTo({ top: window.scrollY + h.getBoundingClientRect().top - 100, behavior: 'instant' }) }, c.headings[n].id)
            await page.waitForTimeout(250)
            const now = await contents(page)
            check(`[${lang}] scrolled to section ${n + 1}, that entry alone is the current one`,
              j(now.entries.map((e) => e.current)) === j(now.entries.map((_, i) => (i === n ? 'location' : null))), j(now.entries.map((e) => e.current)))
          }
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
          await page.waitForTimeout(250)
          check(`[${lang}] before the first section no entry is current`, (await contents(page)).entries.every((e) => e.current === null))

          // Selecting an entry scrolls to it and leaves the hash alone.
          const hash = await page.evaluate(() => location.hash)
          await page.click(`.blog-full [data-section="${c.headings[1].id}"]`)
          await page.waitForTimeout(600)
          let now = await contents(page)
          check(`[${lang}] an entry scrolls to its section`, now.headings[1].top >= 0 && now.headings[1].top < 160 && now.entries[1].current === 'location', String(now.headings[1].top))
          check(`[${lang}] it does not change location.hash`, (await page.evaluate(() => location.hash)) === hash && hash === articleHash(AI_ORDER[2]))
          await page.locator(`.blog-full [data-section="${c.headings[3 % c.headings.length].id}"]`).focus()
          await page.keyboard.press('Enter')
          await page.waitForTimeout(600)
          now = await contents(page)
          check(`[${lang}] an entry works from the keyboard`, now.headings[3 % c.headings.length].top >= 0 && now.headings[3 % c.headings.length].top < 160, String(now.headings[3 % c.headings.length].top))
          check(`[${lang}] the article is still the only one open`, (await articleState(page)).articles === 1)

          // Reading mode hides it.
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
          await page.click('.blog-full [data-reading-toggle]')
          await page.waitForTimeout(400)
          check(`[${lang}] reading mode hides the contents list`, (await page.evaluate(() => document.documentElement.dataset.reading)) === 'on' && (await contents(page)).visible === false)
          check(`[${lang}] contents: no page or console errors`, errors.length === 0, errors.join(' | '))
        } finally { await ctx.close() }
      }

      // ── 375 px ────────────────────────────────────────────────────────────
      {
        const seed = { [READ]: JSON.stringify([[AI_ORDER[0], STAMP], AI_ORDER[1]]), [PROGRESS]: JSON.stringify({ [AI_ORDER[2]]: [0.4, STAMP] }) }
        const home = await open(browser, { lang, viewport: MOBILE, seed })
        try {
          await showAll(home.page, lang)
          const m = await smallAndWide(home.page, FRONT_BLOCKS)
          check(`[${lang}] 375: the new blocks of the home page are all there`, m.blocks >= POSTS.length + 3, String(m.blocks))
          check(`[${lang}] 375: nothing overflows on the home page`, m.overflow <= 0 && m.wide.length === 0, j([m.overflow, m.wide.slice(0, 5)]))
          check(`[${lang}] 375: no text under 12 px in the tabs, the cards or the showcase`, m.small.length === 0, j(m.small.slice(0, 8)))
          const s = await showcase(home.page)
          check(`[${lang}] 375: no text of the showcase is clipped`, s?.clipped.length === 0 && s.parts.length === 8, j(s?.clipped))
          check(`[${lang}] 375: no page or console errors on the home page`, home.errors.length === 0, home.errors.join(' | '))
        } finally { await home.ctx.close() }

        const art = await open(browser, { lang, viewport: MOBILE, hash: articleHash(AI_ORDER[2]), seed, reducedMotion: 'reduce' })
        try {
          let c = await contents(art.page)
          check(`[${lang}] 375: the contents list is a collapsed disclosure`, c?.toggle?.visible && c.toggle.tag === 'BUTTON' && c.toggle.expanded === 'false' && c.entries.every((e) => !e.visible), j(c?.toggle))
          check(`[${lang}] 375: it sits near the top, above the body`, c.box.top < 900 && c.box.top > 0, String(c.box.top))
          await art.page.click('.blog-full [data-contents-toggle]')
          await art.page.waitForTimeout(300)
          c = await contents(art.page)
          check(`[${lang}] 375: opening it shows every entry`, c.toggle.expanded === 'true' && c.entries.length >= 2 && c.entries.every((e) => e.visible), j(c.toggle))
          await art.page.click(`.blog-full [data-section="${c.headings[1].id}"]`)
          await art.page.waitForTimeout(600)
          c = await contents(art.page)
          check(`[${lang}] 375: an entry scrolls to its section`, c.headings[1].top >= 0 && c.headings[1].top < 160, String(c.headings[1].top))
          await art.page.evaluate(() => document.querySelector('.blog-full [data-series-end]').scrollIntoView({ block: 'center' }))
          await art.page.waitForTimeout(300)
          const m = await smallAndWide(art.page, ARTICLE_BLOCKS)
          check(`[${lang}] 375: nothing overflows in the article`, m.blocks >= 3 && m.overflow <= 0 && m.wide.length === 0, j([m.blocks, m.overflow, m.wide.slice(0, 5)]))
          check(`[${lang}] 375: no text under 12 px in the contents, the kicker or the end of the series`, m.small.length === 0, j(m.small.slice(0, 8)))
          check(`[${lang}] 375: no page or console errors in the article`, art.errors.length === 0, art.errors.join(' | '))
        } finally { await art.ctx.close() }
      }
    }

    // ── Dark theme: nothing in the new blocks is left on the light paper ────
    {
      const probe = await open(browser)
      const paper = await probe.page.evaluate(() => getComputedStyle(document.querySelector('#blog article[data-slug]')).backgroundColor)
      await probe.ctx.close()
      const seed = { 'portfolio-theme': 'dark', [READ]: JSON.stringify([[AI_ORDER[0], STAMP]]), [PROGRESS]: JSON.stringify({ [AI_ORDER[1]]: [0.4, STAMP] }) }
      const light = (page, selector) => page.evaluate(({ sel, paper }) => ({
        theme: document.documentElement.dataset.theme,
        blocks: document.querySelectorAll(sel).length,
        left: [...document.querySelectorAll(sel)].flatMap((el) => [el, ...el.querySelectorAll('*')])
          .filter((el) => el.getClientRects().length > 0 && getComputedStyle(el).backgroundColor === paper).map((el) => `${el.tagName}.${String(el.className).slice(0, 30)}`),
      }), { sel: selector, paper })
      const home = await open(browser, { seed })
      try {
        await showAll(home.page, 'en')
        const d = await light(home.page, FRONT_BLOCKS)
        check('dark: the theme is applied and the light paper colour is known', d.theme === 'dark' && /^rgb/.test(paper), j([d.theme, paper]))
        check('dark: nothing in the front or the showcase computes to the light paper colour', d.blocks > 10 && d.left.length === 0, j(d.left.slice(0, 8)))
        check('dark: no page or console errors on the home page', home.errors.length === 0, home.errors.join(' | '))
      } finally { await home.ctx.close() }
      const art = await open(browser, { seed, hash: articleHash(AI_ORDER[2]) })
      try {
        const d = await light(art.page, ARTICLE_BLOCKS)
        check('dark: nothing in the contents or the end of the series computes to the light paper colour', d.theme === 'dark' && d.blocks >= 3 && d.left.length === 0, j(d.left.slice(0, 8)))
      } finally { await art.ctx.close() }
    }

    // ── XP: the blog window shows the front and opens an article ─────────────
    {
      const { ctx, page } = await loadXp(browser, 'en', DESKTOP)
      const errors = []
      page.on('pageerror', (e) => errors.push(String(e)))
      try {
        await page.locator('.xp-desktop-icon[data-app="blog"]').click()
        await page.waitForSelector('#blog article[data-slug]', { timeout: 10_000 }).catch(() => {})
        await page.waitForTimeout(600)
        const xp = await page.evaluate(() => {
          const body = document.querySelector('#blog').closest('.xp-window-body')
          const lead = document.querySelector('#blog article[data-lead]')
          return {
            theme: document.documentElement.dataset.theme, inWindow: !!body, tabs: document.querySelectorAll('#blog [role="tablist"][data-blog-tabs] [role="tab"]').length,
            cards: document.querySelectorAll('#blog article[data-slug]').length, lead: !!lead,
            scroll: body ? body.scrollWidth - body.clientWidth : null,
            inside: !!lead && !!body && lead.getBoundingClientRect().right <= body.getBoundingClientRect().right + 1,
          }
        })
        check('XP: the blog window shows the tabs, the lead and the cards', xp.theme === 'xp' && xp.inWindow && xp.tabs === 3 && xp.lead && xp.cards === 7, j(xp))
        check('XP: the window has no horizontal scroll', xp.scroll !== null && xp.scroll <= 0 && xp.inside, j(xp))
        await tab(page, 'essays').click()
        await page.waitForTimeout(500)
        const essays = await listSlugs(page)
        check('XP: the tabs work inside the window', essays.length > 0 && essays.every((s) => bySlug[s]?.category === 'ensayo'), j(essays))
        await page.locator('#blog button').filter({ hasText: /^Read/ }).first().click()
        await page.waitForFunction(() => location.hash.startsWith('#blog/article/') && !!document.querySelector('.blog-full .blog-article-body'), null, { timeout: 10_000 }).catch(() => {})
        await page.waitForTimeout(800)
        const art = await page.evaluate(() => ({
          hash: location.hash, h1: document.querySelector('.blog-full article h1')?.textContent.trim() ?? '',
          overflow: document.documentElement.scrollWidth - window.innerWidth, contents: !!document.querySelector('.blog-full [data-article-contents]'),
        }))
        check('XP: an article opens from the window', art.hash === articleHash(essays[0]) && art.h1 === bySlug[essays[0]].title.en, j(art))
        check('XP: the article has no horizontal scroll and shows its contents', art.overflow <= 0 && art.contents, j(art))
        check('XP: no page errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }
  } finally {
    await browser.close()
  }

  console.log('\n  – not exercised: "absent in an article with fewer than two sections" (every article in the repository has at least three)')
  console.log(`\nBlog front checks: ${checks - failures.length}/${checks} passed`)
  if (failures.length) {
    console.log('FAILED:')
    console.log(failures.join('\n'))
    process.exit(1)
  }
  console.log('ALL PASSED')
}

/** The viewport height, for "is it on screen". */
function window_h(viewport) {
  return viewport.height
}

run().catch((e) => { console.error(e); process.exit(1) })
