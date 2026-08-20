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

export async function newPage(browser, viewport, lang, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    locale: lang === 'es' ? 'es-ES' : 'en-US',
    reducedMotion: opts.reducedMotion ?? 'no-preference',
  })
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

/**
 * Pixel-diff two PNG files. Returns { diff, total, width, height, reason }.
 * Reads the PNGs as Node buffers, passes them into a headless page as data
 * URLs, and compares them pixel-by-pixel on a canvas.
 */
export async function pixelDiff(fileA, fileB) {
  const aBuf = fs.readFileSync(fileA)
  const bBuf = fs.readFileSync(fileB)
  const aDataUrl = `data:image/png;base64,${aBuf.toString('base64')}`
  const bDataUrl = `data:image/png;base64,${bBuf.toString('base64')}`
  const browser = await openBrowser()
  try {
    const page = await browser.newPage()
    const result = await page.evaluate(async ({ a, b }) => {
      const load = (src) => new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
      const imgA = await load(a)
      const imgB = await load(b)
      if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
        return { diff: -1, reason: `size mismatch ${imgA.width}x${imgA.height} vs ${imgB.width}x${imgB.height}` }
      }
      const c = document.createElement('canvas')
      c.width = imgA.width
      c.height = imgA.height
      const g = c.getContext('2d')
      g.drawImage(imgA, 0, 0)
      const dA = g.getImageData(0, 0, c.width, c.height).data
      g.drawImage(imgB, 0, 0)
      const dB = g.getImageData(0, 0, c.width, c.height).data
      let diff = 0
      for (let i = 0; i < dA.length; i += 4) {
        if (dA[i] !== dB[i] || dA[i + 1] !== dB[i + 1] || dA[i + 2] !== dB[i + 2] || dA[i + 3] !== dB[i + 3]) {
          diff++
        }
      }
      return { diff, total: dA.length / 4, width: imgA.width, height: imgA.height }
    }, { a: aDataUrl, b: bDataUrl })
    return result
  } finally {
    await browser.close()
  }
}
