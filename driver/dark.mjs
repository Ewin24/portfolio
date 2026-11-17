/**
 * Dark mode.
 *
 * The dark theme is a third theme id (`data-theme="dark"` on <html>) chosen
 * from the header, remembered under `portfolio-theme`, applied by the inline
 * boot script in index.html before React mounts, and defaulting to
 * `prefers-color-scheme` only while nothing is stored.
 *
 * Needs a server (BASE_URL, default http://localhost:4193/portfolio/).
 * Exits 0 when every check passes.
 */
import { BASE_URL, VIEWPORTS, newPage, openBrowser } from './helpers.mjs'

const SLUG = 'getdate-vs-sysdatetime-reloj-que-retrocede'
const ARTICLE = `${BASE_URL}#blog/article/${SLUG}`
const KEY = 'portfolio-theme'
const MOBILE = VIEWPORTS[0]
const DESKTOP = VIEWPORTS[3]
const TOGGLE = 'header button.dark-toggle:visible'

const failures = []
let checks = 0
function check(name, cond, extra = '') {
  checks++
  if (!cond) failures.push(`  ✗ ${name}${extra ? ` — ${extra}` : ''}`)
  else console.log(`  ✓ ${name}`)
}

const state = (page) =>
  page.evaluate((key) => {
    const cs = getComputedStyle(document.body)
    return {
      theme: document.documentElement.dataset.theme ?? null,
      stored: localStorage.getItem(key),
      bodyBg: cs.backgroundColor,
      paper: getComputedStyle(document.documentElement).getPropertyValue('--color-paper').trim(),
      pressed: document.querySelector('header button.dark-toggle')?.getAttribute('aria-pressed') ?? null,
    }
  }, KEY)

/** Relative luminance of an `rgb(r, g, b)` string. */
function luminance(rgb) {
  const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map((v) => {
    const c = Number(v) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

async function open(browser, vp, lang, { scheme = 'light', stored, url = BASE_URL } = {}) {
  const { ctx, page } = await newPage(browser, vp, lang)
  await page.emulateMedia({ colorScheme: scheme })
  if (stored !== undefined) {
    // Seed once: an init script would overwrite the choice again on reload.
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, stored])
  }
  await page.goto(url, { waitUntil: 'networkidle' })
  if (stored !== undefined) await page.reload({ waitUntil: 'networkidle' })
  return { ctx, page }
}

/**
 * Scroll through the document until every in-view fade has run. The page
 * grows while lazy chunks land, so the height is re-read on every step, and
 * anything still faded out afterwards is brought into view by hand.
 */
async function settle(page) {
  await page.evaluate(async () => {
    const pause = (ms) => new Promise((r) => setTimeout(r, ms))
    for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await pause(80)
    }
    for (const el of document.querySelectorAll('[style*="opacity"]')) {
      if (Number(getComputedStyle(el).opacity) < 1 && el.getClientRects().length) {
        el.scrollIntoView({ block: 'center', behavior: 'instant' })
        await pause(150)
      }
    }
    // A figure plays its steps by itself once it is in view, and an element in
    // mid-fade measures as low contrast. Put every figure on its last step.
    for (const mark of document.querySelectorAll('.fig .fig-marks [data-fig-mark]:last-child')) mark.click()
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1200)
}

/**
 * WCAG contrast of every visible text element against the background colours
 * stacked behind it. Returns the named samples plus every element below its
 * threshold (4.5:1, or 3:1 for large text).
 */
function contrastReport(page, samples) {
  return page.evaluate((samples) => {
    const cv = document.createElement('canvas')
    cv.width = cv.height = 1
    const g = cv.getContext('2d', { willReadFrequently: true })
    const cache = new Map()
    // The canvas resolves any CSS colour syntax (color-mix, oklch, hex) to sRGB bytes.
    const rgba = (css) => {
      if (!cache.has(css)) {
        g.clearRect(0, 0, 1, 1)
        g.fillStyle = css
        g.fillRect(0, 0, 1, 1)
        const d = g.getImageData(0, 0, 1, 1).data
        cache.set(css, [d[0], d[1], d[2], d[3] / 255])
      }
      return cache.get(css)
    }
    const over = (top, bottom) => top.slice(0, 3).map((c, i) => c * top[3] + bottom[i] * (1 - top[3]))
    const lum = (c) => {
      const [r, gg, b] = c.map((v) => {
        const s = v / 255
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * r + 0.7152 * gg + 0.0722 * b
    }
    const measure = (el) => {
      const chain = []
      for (let n = el; n; n = n.parentElement) chain.unshift(n)
      let bg = [255, 255, 255]
      let opacity = 1
      for (const n of chain) {
        const cs = getComputedStyle(n)
        bg = over(rgba(cs.backgroundColor), bg)
        opacity *= Number(cs.opacity)
      }
      const cs = getComputedStyle(el)
      const fgRaw = rgba(cs.color)
      const fg = over([fgRaw[0], fgRaw[1], fgRaw[2], fgRaw[3] * opacity], bg)
      const [hi, lo] = [lum(fg), lum(bg)].sort((a, b) => b - a)
      const size = parseFloat(cs.fontSize)
      const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700)
      return {
        ratio: Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100,
        need: large ? 3 : 4.5,
        fg: fg.map(Math.round).join(','),
        bg: bg.map(Math.round).join(','),
      }
    }
    const visible = (el) => {
      // A figure element whose step has not been reached is at opacity 0 on purpose: it is not text a reader sees yet.
      if (el.closest('noscript, script, style, [disabled], [aria-disabled="true"], .fig [data-on="false"]')) return false
      const r = el.getBoundingClientRect()
      if (r.width <= 1 || r.height <= 1) return false
      return getComputedStyle(el).visibility !== 'hidden'
    }

    const named = Object.entries(samples).map(([name, selector]) => {
      const el = [...document.querySelectorAll(selector)].find(visible)
      return el ? { name, ...measure(el) } : { name, missing: selector }
    }).filter((s) => !(s.missing && s.name.endsWith('?')))

    const seen = new Set()
    const low = []
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const el = node.parentElement
      // Separators such as "·" are decoration, not text to be read.
      if (!/[\p{L}\p{N}]/u.test(node.nodeValue) || !el || seen.has(el)) continue
      seen.add(el)
      if (!visible(el)) continue
      const m = measure(el)
      if (m.ratio < m.need) {
        low.push(`${el.tagName.toLowerCase()}.${String(el.className).split(/\s+/).slice(0, 3).join('.')} "${node.nodeValue.trim().slice(0, 30)}" ${m.ratio} (fg ${m.fg} on ${m.bg})`)
      }
    }
    return { named, low, swept: seen.size }
  }, samples)
}

function checkContrast(label, report) {
  for (const s of report.named) {
    if (s.missing) check(`${label}: ${s.name} is on the page`, false, s.missing)
    else check(`${label}: ${s.name} contrast ${s.ratio} >= ${s.need}`, s.ratio >= s.need, `fg ${s.fg} on ${s.bg}`)
  }
  check(`${label}: no visible text below its contrast threshold (${report.swept} elements)`,
    report.low.length === 0, `\n      ${report.low.slice(0, 15).join('\n      ')}`)
}

const HOME_SAMPLES = {
  'body paragraph': '#about p',
  'card title': '#projects .px-card h3',
  'muted metadata': '#projects .text-ink-muted',
  'accent kicker': '#main .kicker, #main .text-accent',
  'button': '#main .px-btn',
  'nav link': 'header .nav-link',
  'blog card title': '#blog h3',
  'blog metadata': '#blog .text-ink-muted',
  'blog filter control': '#blog button',
  'footer text': 'footer p, footer span, footer a',
}

const ARTICLE_SAMPLES = {
  'article paragraph': '.blog-article-body > p',
  'article heading': '.blog-article-body h2',
  // Not every article has these two; the token check below covers their colours.
  'article link?': '.blog-article-body a',
  'code block': '.blog-article-body pre code',
  'inline code?': '.blog-article-body :not(pre) > code',
  'figure caption': '.blog-article-body figcaption',
  'article metadata': '.blog-full .text-ink-muted',
}

async function run() {
  const browser = await openBrowser()
  try {
    // ── 1-3, 5. Default light, choose dark from the header, reload, go back ──
    {
      const { ctx, page } = await open(browser, DESKTOP, 'en')
      try {
        let s = await state(page)
        check('light scheme, empty storage: no dark theme', s.theme === null, JSON.stringify(s))
        check('light scheme, empty storage: nothing is stored on load', s.stored === null, JSON.stringify(s))
        const lightBg = s.bodyBg

        const toggle = page.locator(TOGGLE)
        check('header shows a dark mode control', (await toggle.count()) === 1)
        check('control has an English accessible name', /dark/i.test((await toggle.getAttribute('aria-label')) ?? ''))
        check('control starts unpressed', s.pressed === 'false', String(s.pressed))

        await toggle.click()
        s = await state(page)
        check('click sets data-theme="dark"', s.theme === 'dark', JSON.stringify(s))
        check('click stores the dark choice', s.stored === 'dark', JSON.stringify(s))
        check('click presses the control', s.pressed === 'true', String(s.pressed))
        check('body background becomes dark', luminance(s.bodyBg) < 0.03 && s.bodyBg !== lightBg, `${lightBg} -> ${s.bodyBg}`)
        const themeColor = await page.getAttribute('meta[name="theme-color"]', 'content')
        check('theme-color meta follows the dark paper', luminance(`rgb(${parseInt(themeColor.slice(1, 3), 16)}, ${parseInt(themeColor.slice(3, 5), 16)}, ${parseInt(themeColor.slice(5, 7), 16)})`) < 0.03, themeColor)

        await page.reload({ waitUntil: 'networkidle' })
        s = await state(page)
        check('reload keeps the dark theme', s.theme === 'dark' && s.stored === 'dark' && s.pressed === 'true', JSON.stringify(s))

        // With every script file blocked React never mounts (the root keeps
        // its pre-rendered crawler content), so only the inline boot script
        // in index.html can have set the attribute.
        const bare = await ctx.newPage()
        await bare.route((url) => /\.(tsx?|jsx?)$/.test(url.pathname), (route) => route.abort())
        await bare.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
        const boot = await bare.evaluate(() => ({
          theme: document.documentElement.dataset.theme ?? null,
          mounted: !!document.querySelector('#root header, #root #main'),
        }))
        check('dark is applied before React mounts', boot.theme === 'dark' && !boot.mounted, JSON.stringify(boot))
        await bare.close()

        await page.locator(TOGGLE).click()
        s = await state(page)
        check('second click returns to light', s.theme === null && s.bodyBg === lightBg, JSON.stringify(s))
        check('second click stores the light choice', s.stored === 'newspaper' && s.pressed === 'false', JSON.stringify(s))
      } finally { await ctx.close() }
    }

    // ── 4. prefers-color-scheme is only the fallback ──
    {
      const { ctx, page } = await open(browser, DESKTOP, 'es', { scheme: 'dark' })
      try {
        const s = await state(page)
        check('dark scheme, empty storage: starts dark', s.theme === 'dark' && luminance(s.bodyBg) < 0.03, JSON.stringify(s))
        check('dark scheme, empty storage: the preference is not stored as a choice', s.stored === null, JSON.stringify(s))
        check('control has a Spanish accessible name', /oscuro/i.test((await page.locator(TOGGLE).getAttribute('aria-label')) ?? ''))
      } finally { await ctx.close() }
    }
    {
      const { ctx, page } = await open(browser, DESKTOP, 'en', { scheme: 'dark', stored: 'newspaper' })
      try {
        const s = await state(page)
        check('dark scheme, stored light choice: stays light', s.theme === null && luminance(s.bodyBg) > 0.8, JSON.stringify(s))
      } finally { await ctx.close() }
    }
    {
      const { ctx, page } = await open(browser, DESKTOP, 'en', { scheme: 'light', stored: 'dark' })
      try {
        const s = await state(page)
        check('light scheme, stored dark choice: stays dark', s.theme === 'dark', JSON.stringify(s))
      } finally { await ctx.close() }
    }
    {
      // The mobile menu carries the same control.
      const { ctx, page } = await open(browser, MOBILE, 'es')
      try {
        await page.locator('header button[aria-label="Menu"]').click()
        await page.locator(TOGGLE).click()
        const s = await state(page)
        check('375px: the mobile menu control sets the dark theme', s.theme === 'dark' && s.stored === 'dark', JSON.stringify(s))
      } finally { await ctx.close() }
    }

    // ── 6. XP still activates and keeps its own tokens ──
    {
      const { ctx, page } = await open(browser, DESKTOP, 'en')
      try {
        await page.locator('header button[aria-label="Open Windows XP"]:visible').click()
        await page.waitForSelector('.xp-desktop')
        const s = await state(page)
        check('light -> XP: XP theme activates', s.theme === 'xp' && s.stored === 'xp', JSON.stringify(s))
        check('light -> XP: XP paper token is intact', s.paper.toUpperCase() === '#ECE9D8', s.paper)
      } finally { await ctx.close() }
    }
    {
      const { ctx, page } = await open(browser, DESKTOP, 'en', { stored: 'dark' })
      try {
        await page.locator('header button[aria-label="Open Windows XP"]:visible').click()
        await page.waitForSelector('.xp-desktop')
        let s = await state(page)
        check('dark -> XP: XP theme activates', s.theme === 'xp' && s.stored === 'xp', JSON.stringify(s))
        check('dark -> XP: no dark token leaks into XP', s.paper.toUpperCase() === '#ECE9D8', s.paper)
        check('XP has no dark mode control', (await page.locator('button.dark-toggle').count()) === 0)

        await page.locator('.xp-window-controls button[aria-label="Help"]').first().click()
        await page.locator('#xp-help .xp-help-return').click()
        await page.waitForSelector(TOGGLE)
        s = await state(page)
        check('leaving XP returns to the dark newspaper it came from', s.theme === 'dark' && s.stored === 'dark', JSON.stringify(s))
      } finally { await ctx.close() }
    }

    // ── 7. Contrast in dark ──
    // Every text token against both paper tones: the alternating section
    // bands are painted with a border-image, which no computed
    // background-color reveals to the element sweep below.
    {
      const { ctx, page } = await open(browser, DESKTOP, 'en', { stored: 'dark' })
      try {
        const pairs = await page.evaluate(() => {
          const probe = document.body.appendChild(document.createElement('span'))
          const resolve = (token) => {
            probe.style.color = `var(${token})`
            return getComputedStyle(probe).color
          }
          const out = {}
          for (const t of ['paper', 'paper-dark', 'ink', 'ink-light', 'ink-muted', 'accent', 'accent-dark', 'rule', 'on-ink']) {
            out[t] = resolve(`--color-${t}`)
          }
          probe.remove()
          return out
        })
        const ratio = (a, b) => {
          const [hi, lo] = [luminance(pairs[a]), luminance(pairs[b])].sort((x, y) => y - x)
          return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100
        }
        for (const surface of ['paper', 'paper-dark']) {
          for (const text of ['ink', 'ink-light', 'ink-muted', 'accent', 'accent-dark']) {
            const r = ratio(text, surface)
            check(`dark token ${text} on ${surface}: ${r} >= 4.5`, r >= 4.5)
          }
          const r = ratio('rule', surface)
          check(`dark token rule (borders) on ${surface}: ${r} >= 3`, r >= 3)
        }
        for (const fill of ['ink', 'accent']) {
          const r = ratio('on-ink', fill)
          check(`dark token on-ink on a ${fill} fill: ${r} >= 4.5`, r >= 4.5)
        }
      } finally { await ctx.close() }
    }

    // Then every visible text element on the home page (which carries the
    // blog list) and on one article.
    for (const [vp, lang] of [[DESKTOP, 'en'], [MOBILE, 'es']]) {
      const tag = `dark ${lang} ${vp.name}`
      {
        const { ctx, page } = await open(browser, vp, lang, { stored: 'dark' })
        try {
          await page.waitForSelector('#blog h3', { timeout: 15_000 }).catch(() => {})
          await settle(page)
          const samples = { ...HOME_SAMPLES }
          if (vp === MOBILE) delete samples['nav link']
          checkContrast(`${tag} home`, await contrastReport(page, samples))
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
          check(`${tag} home: no horizontal overflow`, overflow <= 0, `${overflow}px`)
        } finally { await ctx.close() }
      }
      {
        const { ctx, page } = await open(browser, vp, lang, { stored: 'dark', url: ARTICLE })
        try {
          await page.waitForSelector('.blog-article-body pre code', { timeout: 15_000 }).catch(() => {})
          await settle(page)
          const s = await state(page)
          check(`${tag} article: dark theme is active`, s.theme === 'dark', JSON.stringify(s))
          checkContrast(`${tag} article`, await contrastReport(page, ARTICLE_SAMPLES))
        } finally { await ctx.close() }
      }
    }
  } finally {
    await browser.close()
  }

  console.log(`\nDark mode checks: ${checks - failures.length}/${checks} passed`)
  if (failures.length) {
    console.log('FAILED:')
    console.log(failures.join('\n'))
    process.exit(1)
  }
  console.log('ALL PASSED')
}

run().catch((e) => { console.error(e); process.exit(1) })
