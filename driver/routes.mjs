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
