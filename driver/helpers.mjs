import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const BASE_URL = process.env.BASE_URL || 'http://localhost:4193/portfolio/'
export const BASELINE_DIR = path.join(__dirname, '.baseline')

export const VIEWPORTS = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1440', width: 1440, height: 900 },
]

export const LOCALES = ['es', 'en']

/**
 * All 7 apps in the XP desktop registry, in z-order/display order (spec M0).
 */
export const APP_IDS = [
  'about',
  'projects',
  'skills-experience',
  'education',
  'testimonials',
  'blog',
  'contact',
]

/**
 * Committed snapshot of the two `api.github.com` responses the app consumes
 * (`src/services/github.ts`: `/users/:login` and `/users/:login/repos`),
 * trimmed to the fields declared by `GitHubUser` / `GitHubRepo` in
 * `src/types.ts` and to the 6 non-fork repositories that can reach
 * `getFeaturedRepos`' top slice.
 *
 * `avatar_url` is deliberately empty: the real value points at a second
 * third-party host (`avatars.githubusercontent.com`), and a pixel baseline that
 * depends on it would be exactly as non-hermetic as one that depends on the
 * API. With it empty, `About` renders its designed initials fallback and the
 * capture reaches only one stubbed origin.
 */
const GITHUB_FIXTURE = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'fixtures', 'github-api.json'), 'utf8')
)

/**
 * Serve `api.github.com` from the committed fixture.
 *
 * The page fetches live GitHub data for the repository panel in `#projects`.
 * That made every capture depend on third-party state — the committed
 * baselines were cut while the API was rate-limited, so the page rendered
 * 295 px shorter than it does when the API answers. A visual baseline is only
 * meaningful when the captured page is hermetic, so the drivers answer that
 * origin themselves.
 */
export async function stubGitHubApi(ctx) {
  await ctx.route('https://api.github.com/**', (route) => {
    const { pathname } = new URL(route.request().url())
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(pathname.endsWith('/repos') ? GITHUB_FIXTURE.repos : GITHUB_FIXTURE.user),
    })
  })
}

export async function newPage(browser, viewport, lang, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    locale: lang === 'es' ? 'es-ES' : 'en-US',
    reducedMotion: opts.reducedMotion ?? 'no-preference',
  })
  await stubGitHubApi(ctx)
  const page = await ctx.newPage()
  return { ctx, page }
}

export function ensureBaselineDir() {
  fs.mkdirSync(BASELINE_DIR, { recursive: true })
}

/**
 * Boot the app in the XP theme: force `portfolio-theme=xp` before any script
 * runs and reflect it on <html> so the XP branch mounts, matching how a real
 * user who chose XP would arrive. Sets `data-xp-driver=1` to gate the test seam.
 */
export async function loadXp(browser, lang = 'en', vp = VIEWPORTS[2], opts = {}) {
  const { ctx, page } = await newPage(browser, vp, lang, opts)
  await page.addInitScript(() => {
    try { localStorage.setItem('portfolio-theme', 'xp') } catch {}
    document.documentElement.dataset.theme = 'xp'
  })
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  return { ctx, page }
}

/**
 * Deterministic full-page capture: scroll through the whole document so every
 * `whileInView` animation settles and lazy chunks resolve, then capture at a
 * stable scroll position. This removes timing noise from the pixel baseline.
 */
export async function capturePage(page, filePath) {
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight
    const step = 600
    for (let y = 0; y < h; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(600)
  await page.screenshot({ path: filePath, fullPage: true })
}

export function shotPath(lang, viewportName) {
  return path.join(BASELINE_DIR, `baseline-${lang}-${viewportName}.png`)
}

export function openBrowser() {
  return chromium.launch({ headless: true })
}

/** Read the manager seam; returns null when it is not present. */
export async function manager(page) {
  return page.evaluate(() => window.__XPMANAGER__ ?? null)
}

/** Maximum number of `bands` entries returned by `pixelDiff`, to bound stdout. */
export const BAND_CAP = 20

/**
 * Pixel-diff two PNG files. Returns
 * `{ diff, total, width, height, reason, firstDiffY, heightDelta, bands }`.
 *
 * `diff`, `total`, `width`, `height` and `reason` keep their original meaning,
 * so the pass rule in `newspaper.mjs` is unchanged. The added keys exist so a
 * baseline re-cut can attribute every differing region to an intended content
 * change instead of absorbing an unexplained layout regression:
 *
 *  - A width mismatch is always chrome or layout, so it stays a hard `diff: -1`.
 *  - A height mismatch no longer bails. The common prefix `min(hA, hB)` is
 *    compared and `heightDelta` is reported, but `|heightDelta| * width` is
 *    added to `diff` so a taller or shorter page can never silently pass.
 *  - Consecutive differing rows collapse into `bands` (capped at `BAND_CAP`),
 *    and the first differing row is reported as `firstDiffY`.
 */
export async function pixelDiff(fileA, fileB) {
  const aBuf = fs.readFileSync(fileA)
  const bBuf = fs.readFileSync(fileB)
  const aDataUrl = `data:image/png;base64,${aBuf.toString('base64')}`
  const bDataUrl = `data:image/png;base64,${bBuf.toString('base64')}`
  const browser = await openBrowser()
  try {
    const page = await browser.newPage()
    const result = await page.evaluate(async ({ a, b, bandCap }) => {
      const load = (src) => new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
      const imgA = await load(a)
      const imgB = await load(b)
      if (imgA.width !== imgB.width) {
        return {
          diff: -1,
          total: imgA.width * imgA.height,
          width: imgA.width,
          height: imgA.height,
          reason: `width mismatch ${imgA.width}x${imgA.height} vs ${imgB.width}x${imgB.height}`,
          firstDiffY: 0,
          heightDelta: imgB.height - imgA.height,
          bands: [],
        }
      }
      const width = imgA.width
      const heightDelta = imgB.height - imgA.height
      // Compare the common prefix; the surplus rows are charged to `diff` below.
      const h = Math.min(imgA.height, imgB.height)
      const c = document.createElement('canvas')
      c.width = width
      c.height = h
      const g = c.getContext('2d')
      g.drawImage(imgA, 0, 0)
      const dA = g.getImageData(0, 0, width, h).data
      g.clearRect(0, 0, width, h)
      g.drawImage(imgB, 0, 0)
      const dB = g.getImageData(0, 0, width, h).data
      let diff = 0
      let firstDiffY = null
      let truncated = false
      const bands = []
      for (let y = 0; y < h; y++) {
        const rowStart = y * width * 4
        let rowDiff = 0
        for (let x = 0; x < width; x++) {
          const i = rowStart + x * 4
          if (dA[i] !== dB[i] || dA[i + 1] !== dB[i + 1] || dA[i + 2] !== dB[i + 2] || dA[i + 3] !== dB[i + 3]) {
            rowDiff++
          }
        }
        if (rowDiff === 0) continue
        diff += rowDiff
        if (firstDiffY === null) firstDiffY = y
        const last = bands[bands.length - 1]
        if (last && last.y1 === y - 1) {
          last.y1 = y
          last.pixels += rowDiff
        } else if (bands.length < bandCap) {
          bands.push({ y0: y, y1: y, pixels: rowDiff })
        } else {
          truncated = true
        }
      }
      const notes = []
      if (heightDelta !== 0) {
        // Keep the gate strict: an unseen tail is still a difference.
        diff += Math.abs(heightDelta) * width
        notes.push(`height delta ${heightDelta}`)
      }
      if (truncated) notes.push(`bands truncated at ${bandCap}`)
      return {
        diff,
        total: width * h,
        width,
        height: h,
        reason: notes.join('; '),
        firstDiffY,
        heightDelta,
        bands,
      }
    }, { a: aDataUrl, b: bDataUrl, bandCap: BAND_CAP })
    return result
  } finally {
    await browser.close()
  }
}
