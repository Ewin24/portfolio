/**
 * Blog deep-link routes.
 *
 * Sitemaps, llms files and JSON-LD once published `#/blog/article/<slug>`, while
 * every router in the app reads `#blog/article/<slug>`. Both forms must open the
 * article, on first load and when the hash changes in an already-open tab.
 *
 * Needs a preview server (BASE_URL, default http://localhost:4193/portfolio/).
 * Exits 0 when every check passes.
 */
import { BASE_URL, VIEWPORTS, newPage, openBrowser } from './helpers.mjs'

const SLUG = 'getdate-vs-sysdatetime-reloj-que-retrocede'
const TITLE = 'GETDATE()'

const failures = []
let checks = 0
function check(name, cond, extra = '') {
  checks++
  if (!cond) failures.push(`  ✗ ${name}${extra ? ` — ${extra}` : ''}`)
  else console.log(`  ✓ ${name}`)
}

/** Waits for the article heading (or times out and reports what rendered instead). */
async function articleState(page) {
  await page
    .waitForFunction((t) => document.querySelector('h1')?.textContent?.includes(t), TITLE, { timeout: 10_000 })
    .catch(() => {})
  return page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent ?? '',
    hash: location.hash,
  }))
}

async function run() {
  const browser = await openBrowser()
  try {
    for (const hash of [`#blog/article/${SLUG}`, `#/blog/article/${SLUG}`]) {
      const { ctx, page } = await newPage(browser, VIEWPORTS[2], 'en')
      try {
        await page.goto(`${BASE_URL}${hash}`, { waitUntil: 'networkidle' })
        const s = await articleState(page)
        check(`first load ${hash.slice(0, 15)}… opens the article`, s.h1.includes(TITLE), JSON.stringify(s))
        check(`first load ${hash.slice(0, 15)}… ends on the canonical hash`, s.hash === `#blog/article/${SLUG}`, s.hash)
        // The article carries one interactive figure: it drew (not its alt-text fallback) and kept its caption.
        await page.waitForSelector('.blog-article-body figure[data-figure] .fig', { timeout: 5_000 }).catch(() => {})
        const fig = await page.evaluate(() => {
          const figure = document.querySelector('.blog-article-body figure[data-figure]')
          if (!figure) return null
          return { width: figure.querySelector('.fig')?.getBoundingClientRect().width ?? 0, caption: figure.querySelector('figcaption')?.textContent ?? '' }
        })
        check(`first load ${hash.slice(0, 15)}… renders the figure with its caption`, !!fig && fig.width > 0 && fig.caption.length > 0, JSON.stringify(fig))
      } finally { await ctx.close() }
    }

    const { ctx, page } = await newPage(browser, VIEWPORTS[2], 'en')
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
      await page.evaluate((h) => { location.hash = h }, `#/blog/article/${SLUG}`)
      const s = await articleState(page)
      check('hashchange to #/blog/… in an open tab opens the article', s.h1.includes(TITLE), JSON.stringify(s))
      check('hashchange to #/blog/… ends on the canonical hash', s.hash === `#blog/article/${SLUG}`, s.hash)
    } finally { await ctx.close() }

    // Previous/next swap the article in place and push a history entry without
    // an event. The browser's Back must bring the earlier article back, not
    // only its address, and the article left behind must not end up read
    // because Back restored a scroll position near the end of the page.
    {
      const { ctx, page } = await newPage(browser, VIEWPORTS[2], 'en')
      try {
        await page.goto(`${BASE_URL}#blog/article/${SLUG}`, { waitUntil: 'networkidle' })
        await articleState(page)
        const next = page.locator('.blog-full nav button').last()
        await next.scrollIntoViewIfNeeded()
        await page.waitForTimeout(400)
        await next.click()
        await page.waitForFunction((t) => !document.querySelector('.blog-full h1')?.textContent?.includes(t), TITLE, { timeout: 10_000 }).catch(() => {})
        const moved = await page.evaluate(() => ({ h1: document.querySelector('.blog-full h1')?.textContent ?? '', slug: location.hash.replace('#blog/article/', '') }))
        check('next opens another article in place', !moved.h1.includes(TITLE) && moved.slug !== SLUG, JSON.stringify(moved))
        await page.waitForTimeout(1200)
        await page.goBack()
        const back = await articleState(page)
        check('browser Back after next shows the earlier article again', back.h1.includes(TITLE) && back.hash === `#blog/article/${SLUG}`, JSON.stringify(back))
        await page.waitForTimeout(4000)
        const read = await page.evaluate(() => localStorage.getItem('portfolio-read-posts') ?? '')
        check('the article left behind is not marked read by going Back', !read.includes(moved.slug), read)
      } finally { await ctx.close() }
    }
  } finally {
    await browser.close()
  }

  console.log(`\nRoute checks: ${checks - failures.length}/${checks} passed`)
  if (failures.length) {
    console.log('FAILED:')
    console.log(failures.join('\n'))
    process.exit(1)
  }
  console.log('ALL PASSED')
}

run().catch((e) => { console.error(e); process.exit(1) })
