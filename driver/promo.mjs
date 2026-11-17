/**
 * Essay promotion: the featured essays block, the Essays quick filter, and what
 * the build emits so a shared link carries its own preview (feed.xml, one share
 * page per post, sitemap entries, the RSS <link>).
 *
 *   node driver/promo.mjs              page checks against BASE_URL
 *                                      (default http://localhost:4193/portfolio/)
 *   node driver/promo.mjs <build dir>  build-output checks against that directory
 *
 * Exits 0 when every check passes.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_URL, VIEWPORTS, newPage, openBrowser } from './helpers.mjs'

const failures = []
let checks = 0
function check(name, cond, extra = '') {
  checks++
  if (!cond) failures.push(`  ✗ ${name}${extra ? ` — ${extra}` : ''}`)
  else console.log(`  ✓ ${name}`)
}

/**
 * slug, tags and category of every post, read from the content sources (each post
 * declares slug, then tags, then category). The driver cannot import the TypeScript
 * modules, and the page is what is under test, so it must not be the oracle.
 */
function sourcePosts() {
  const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'blog', 'content')
  const files = [path.join(dir, 'posts.ts'), ...fs.readdirSync(path.join(dir, 'posts')).map((f) => path.join(dir, 'posts', f))]
  const posts = []
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8')
    for (const m of src.matchAll(/\bslug: '([^']+)',[\s\S]*?\btags: \[([^\]]*)\][\s\S]*?\bcategory: '([^']+)'/g)) {
      posts.push({ slug: m[1], tags: [...m[2].matchAll(/'([^']+)'/g)].map((t) => t[1]), category: m[3] })
    }
  }
  return posts
}

const POSTS = sourcePosts()
const ESSAY_SLUGS = new Set(POSTS.filter((p) => p.category === 'ensayo').map((p) => p.slug))
/** A tag carried by some essays and some technical posts, so the composed filter is a strict subset of both. */
const TAG = 'testing'

// ─── Page checks ─────────────────────────────────────────────────────────────

const listTitles = (page) =>
  page.evaluate(() => [...document.querySelectorAll('#blog article h3')].map((h) => h.textContent.trim()))

async function featuredCards(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('#essays [data-essay-slug]')]
      .filter((c) => c.offsetParent !== null)
      .map((c) => ({
        slug: c.dataset.essaySlug,
        title: c.querySelector('h3')?.textContent.trim() ?? '',
        excerpt: c.querySelector('p')?.textContent.trim() ?? '',
        date: c.querySelector('time')?.getAttribute('datetime') ?? '',
        text: c.textContent,
        href: c.querySelector('a')?.getAttribute('href') ?? '',
      })),
  )
}

async function home(browser, lang, hash = '') {
  const { ctx, page } = await newPage(browser, VIEWPORTS[3], lang)
  await page.goto(`${BASE_URL}${hash}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#blog article h3', { timeout: 10_000 }).catch(() => {})
  return { ctx, page }
}

async function pageChecks() {
  check('sources declare essays and technical posts', ESSAY_SLUGS.size > 0 && ESSAY_SLUGS.size < POSTS.length, `${ESSAY_SLUGS.size}/${POSTS.length}`)
  const browser = await openBrowser()
  try {
    for (const lang of ['es', 'en']) {
      const { ctx, page } = await home(browser, lang)
      try {
        const block = await page.evaluate(() => {
          const s = document.querySelector('#essays')
          return s && {
            title: s.querySelector('h2')?.textContent ?? '',
            deck: s.querySelector('[data-deck]')?.textContent ?? '',
            nextId: s.nextElementSibling?.id ?? '',
          }
        })
        check(`[${lang}] featured block exists with its heading`, block?.title === (lang === 'es' ? 'Ensayos' : 'Essays'), JSON.stringify(block))
        check(`[${lang}] featured block has a one-line description`, (block?.deck.length ?? 0) > 10)
        check(`[${lang}] featured block sits immediately before the blog list`, block?.nextId === 'blog', block?.nextId)

        const cards = await featuredCards(page)
        check(`[${lang}] three featured cards on desktop`, cards.length === Math.min(3, ESSAY_SLUGS.size), String(cards.length))
        check(`[${lang}] every featured card is an essay`, cards.length > 0 && cards.every((c) => ESSAY_SLUGS.has(c.slug)), JSON.stringify(cards.map((c) => c.slug)))
        check(
          `[${lang}] every featured card has title, excerpt, date and reading time`,
          cards.length > 0 && cards.every((c) => c.title && c.excerpt.length > 20 && /^\d{4}-\d{2}-\d{2}$/.test(c.date) && /\d+ min/.test(c.text)),
        )

        await page.click('#essays [data-essays-toggle]').catch(() => {})
        const all = await featuredCards(page)
        check(`[${lang}] every essay is reachable from the block`, all.length === ESSAY_SLUGS.size && all.every((c) => ESSAY_SLUGS.has(c.slug)), `${all.length}/${ESSAY_SLUGS.size}`)
        const essayTitles = all.map((c) => c.title).sort()

        // Essays quick filter
        const initial = await listTitles(page)
        const toggle = page.locator('#blog [data-filter-essays]')
        check(`[${lang}] essays filter is labelled`, (await toggle.textContent().catch(() => ''))?.trim() === (lang === 'es' ? 'Ensayos' : 'Essays'))
        await toggle.click({ timeout: 3000 }).catch(() => {})
        await page.waitForTimeout(400)
        // The list pages at six cards; with more essays than that, expand it before comparing.
        await page.getByRole('button', { name: lang === 'es' ? 'Mostrar todos' : 'Show all' }).click({ timeout: 1500 }).catch(() => {})
        await page.waitForTimeout(400)
        const filtered = await listTitles(page)
        check(`[${lang}] essays filter leaves only essays`, filtered.length > 0 && JSON.stringify([...filtered].sort()) === JSON.stringify(essayTitles), JSON.stringify(filtered))
        check(`[${lang}] essays filter reports its state`, (await toggle.getAttribute('aria-pressed').catch(() => null)) === 'true')
        await toggle.click({ timeout: 3000 }).catch(() => {})
        await page.waitForTimeout(400)
        // "Show all" stays on, so the restored list is the unfiltered one in full: it starts
        // with the cards that were there before the filter and is no longer essays only.
        const restored = await listTitles(page)
        check(
          `[${lang}] toggling the essays filter off restores the list`,
          JSON.stringify(restored.slice(0, initial.length)) === JSON.stringify(initial) && restored.length > essayTitles.length,
          `${restored.length} cards`,
        )

        // Open an article from the block
        const first = all[0]
        await page.click(`#essays [data-essay-slug="${first?.slug}"] a`).catch(() => {})
        await page.waitForFunction((t) => document.querySelector('h1')?.textContent?.includes(t), first?.title, { timeout: 10_000 }).catch(() => {})
        const s = await page.evaluate(() => ({ h1: document.querySelector('h1')?.textContent ?? '', hash: location.hash }))
        check(`[${lang}] a featured card opens its article`, !!first && s.hash === `#blog/article/${first.slug}` && s.h1.includes(first.title), JSON.stringify(s))
      } finally { await ctx.close() }
    }

    // Composition with a tag filter (the #blog/tag/<tag> route sets the tag filter).
    const { ctx, page } = await home(browser, 'es', `#blog/tag/${TAG}`)
    try {
      const showAll = async () => {
        await page.getByRole('button', { name: 'Mostrar todos' }).click({ timeout: 1500 }).catch(() => {})
        await page.waitForTimeout(400)
        return listTitles(page)
      }
      const withTag = POSTS.filter((p) => p.tags.includes(TAG))
      const both = withTag.filter((p) => p.category === 'ensayo')
      const tagOnly = await showAll()
      check('tag filter alone lists every post with the tag', tagOnly.length === withTag.length, `${tagOnly.length}/${withTag.length}`)
      await page.click('#blog [data-filter-essays]', { timeout: 3000 }).catch(() => {})
      const composed = await showAll()
      check(
        'essays filter composes with the tag filter',
        both.length > 0 && both.length < withTag.length && composed.length === both.length && composed.every((t) => tagOnly.includes(t)),
        `${composed.length}/${both.length}`,
      )
      await page.click('#blog [data-filter-essays]', { timeout: 3000 }).catch(() => {})
      check('toggling essays off keeps the tag filter', (await showAll()).length === withTag.length)
    } finally { await ctx.close() }
  } finally {
    await browser.close()
  }
}

// ─── Build-output checks ─────────────────────────────────────────────────────

async function buildChecks(dir) {
  const read = (rel) => { try { return fs.readFileSync(path.join(dir, rel), 'utf8') } catch { return null } }
  const feed = read('feed.xml')
  const sitemap = read('sitemap.xml')
  const index = read('index.html')
  const samples = [POSTS.find((p) => p.category === 'ensayo'), POSTS.find((p) => p.category !== 'ensayo')]
  const pages = samples.map((p) => ({ slug: p.slug, html: read(`blog/${p.slug}/index.html`) }))

  const browser = await openBrowser()
  let parsed
  try {
    const page = await browser.newPage()
    parsed = await page.evaluate(({ feed, sitemap, index, pages }) => {
      const meta = (doc, sel) => doc.querySelector(sel)?.getAttribute('content') ?? null
      const xml = (src) => (src === null ? null : new DOMParser().parseFromString(src, 'application/xml'))
      const html = (src) => (src === null ? null : new DOMParser().parseFromString(src, 'text/html'))
      const f = xml(feed)
      const s = xml(sitemap)
      const i = html(index)
      const text = (el, tag) => el.querySelector(tag)?.textContent ?? ''
      return {
        feed: f && {
          wellFormed: !f.querySelector('parsererror'),
          root: f.documentElement.nodeName,
          version: f.documentElement.getAttribute('version'),
          site: text(f, 'channel > link'),
          items: [...f.querySelectorAll('item')].map((it) => ({
            title: text(it, 'title'), link: text(it, 'link'), guid: text(it, 'guid'),
            pubDate: text(it, 'pubDate'), description: text(it, 'description'), category: text(it, 'category'),
          })),
        },
        sitemap: s && { wellFormed: !s.querySelector('parsererror'), locs: [...s.querySelectorAll('loc')].map((l) => l.textContent) },
        rss: i && [...i.querySelectorAll('head link[rel="alternate"][type="application/rss+xml"]')].map((l) => l.getAttribute('href')),
        pages: pages.map(({ slug, html: src }) => {
          const d = html(src)
          return d && {
            slug,
            title: d.title,
            description: meta(d, 'meta[name="description"]'),
            canonical: d.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
            ogType: meta(d, 'meta[property="og:type"]'),
            ogTitle: meta(d, 'meta[property="og:title"]'),
            ogDescription: meta(d, 'meta[property="og:description"]'),
            ogUrl: meta(d, 'meta[property="og:url"]'),
            ogImage: meta(d, 'meta[property="og:image"]'),
            published: meta(d, 'meta[property="article:published_time"]'),
            twitterCard: meta(d, 'meta[name="twitter:card"]'),
            twitterTitle: meta(d, 'meta[name="twitter:title"]'),
            script: [...d.querySelectorAll('script')].map((x) => x.textContent).join('\n'),
            h1: d.querySelector('h1')?.textContent ?? '',
            links: [...d.querySelectorAll('body a')].map((a) => a.getAttribute('href')),
            bodyText: d.body.textContent,
          }
        }),
      }
    }, { feed, sitemap, index, pages })
  } finally {
    await browser.close()
  }

  const f = parsed.feed
  check('feed.xml exists and is well-formed RSS 2.0', !!f && f.wellFormed && f.root === 'rss' && f.version === '2.0', JSON.stringify(f && { root: f.root, v: f.version }))
  const items = f?.items ?? []
  const site = f?.site ?? ''
  check('feed channel link is an absolute site URL', /^https:\/\/[^/]+\/$/.test(site), site)
  check('feed has one item per post', items.length === POSTS.length, `${items.length}/${POSTS.length}`)
  const times = items.map((it) => Date.parse(it.pubDate))
  check('feed items are newest first with valid dates', times.length > 0 && times.every((t, n) => !Number.isNaN(t) && (n === 0 || times[n - 1] >= t)))
  const slugs = new Set(POSTS.map((p) => p.slug))
  check(
    'every feed link is an absolute share-page URL',
    items.length > 0 && items.every((it) => it.link.startsWith(`${site}blog/`) && it.link.endsWith('/') && slugs.has(it.link.slice(`${site}blog/`.length, -1)) && it.guid === it.link),
    items.find((it) => !it.link.startsWith(`${site}blog/`))?.link,
  )
  check('every feed item has title, description and category', items.length > 0 && items.every((it) => it.title && it.description && it.category))
  check(
    'feed categories match the sources',
    items.length > 0 && items.every((it) => POSTS.find((p) => it.link === `${site}blog/${p.slug}/`)?.category === it.category),
  )

  for (const [n, p] of parsed.pages.entries()) {
    const sample = samples[n]
    const kind = sample.category === 'ensayo' ? 'essay' : 'technical'
    const url = `${site}blog/${sample.slug}/`
    const item = items.find((it) => it.link === url)
    check(`[${kind}] share page exists`, !!p)
    if (!p) continue
    check(`[${kind}] og:title is the post title`, !!item && p.ogTitle === item.title && p.title.includes(item.title) && p.twitterTitle === item.title, p.ogTitle)
    check(`[${kind}] og:description and description are the excerpt`, !!item && p.ogDescription === item.description && p.description === item.description)
    check(`[${kind}] og:url and canonical are its own absolute URL`, p.ogUrl === url && p.canonical === url, `${p.ogUrl} | ${p.canonical}`)
    check(`[${kind}] og:type, og:image, published time and twitter card`, p.ogType === 'article' && /^https:\/\/.+/.test(p.ogImage ?? '') && !/\.svg$/.test(p.ogImage) && /^\d{4}-\d{2}-\d{2}T/.test(p.published ?? '') && !!p.twitterCard, JSON.stringify([p.ogType, p.ogImage, p.published, p.twitterCard]))
    const target = p.script.match(/location\.replace\((["'])(.*?)\1\)/)?.[2] ?? ''
    check(`[${kind}] redirects to the SPA article route`, target.endsWith(`#blog/article/${sample.slug}`), target)
    check(
      `[${kind}] readable without JavaScript: title, excerpt and a link to the article`,
      !!item && p.h1 === item.title && p.bodyText.includes(item.description) && p.links.some((h) => h?.endsWith(`#blog/article/${sample.slug}`)),
    )
  }

  const locs = parsed.sitemap?.locs ?? []
  check('sitemap is well-formed and lists every share page', !!parsed.sitemap?.wellFormed && POSTS.every((p) => locs.includes(`${site}blog/${p.slug}/`)))
  check('built index.html links the RSS feed', parsed.rss?.length === 1 && /feed\.xml$/.test(parsed.rss[0]), JSON.stringify(parsed.rss))
}

// ─── Entry ───────────────────────────────────────────────────────────────────

async function run() {
  const dir = process.argv[2]
  if (dir) await buildChecks(dir)
  else await pageChecks()

  console.log(`\nPromo checks (${dir ? 'build output' : 'page'}): ${checks - failures.length}/${checks} passed`)
  if (failures.length) {
    console.log('FAILED:')
    console.log(failures.join('\n'))
    process.exit(1)
  }
  console.log('ALL PASSED')
}

run().catch((e) => { console.error(e); process.exit(1) })
