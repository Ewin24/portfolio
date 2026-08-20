import {
  newPage, openBrowser, capturePage, shotPath, pixelDiff, ensureBaselineDir,
  VIEWPORTS, LOCALES, BASE_URL,
} from './helpers.mjs'

/**
 * Committed newspaper regression driver (design D9 / tasks C.6 + C.8).
 *
 * The newspaper theme is the byte-identical invariant of the whole change
 * (spec M0): its JSX must never change. This driver captures the current
 * newspaper rendering at every viewport × locale and pixel-diffs it against
 * the committed baseline in `driver/.baseline/`.
 *
 * Passes when every capture has 0 differing pixels (≤ 0.1% tolerance for
 * font rasterisation noise).
 */
const failures = []
let checks = 0
let totalPixels = 0
let diffPixels = 0
function check(name, cond, extra = '') {
  checks++
  if (!cond) {
    failures.push(`  ✗ ${name}${extra ? ` — ${extra}` : ''}`)
  } else {
    console.log(`  ✓ ${name}`)
  }
}

async function run() {
  ensureBaselineDir()
  const browser = await openBrowser()
  try {
    for (const lang of LOCALES) {
      for (const vp of VIEWPORTS) {
        const ctx = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          locale: lang === 'es' ? 'es-ES' : 'en-US',
          reducedMotion: 'reduce',
        })
        const page = await ctx.newPage()
        try {
          await page.goto(BASE_URL, { waitUntil: 'networkidle' })
          const cur = `${shotPath(lang, vp.name)}`.replace('baseline-', 'current-')
          await capturePage(page, cur)
          const base = shotPath(lang, vp.name)
          if (!existsSync(base)) {
            check(`[${lang}] baseline exists @ ${vp.name}`, false, `missing ${base}`)
            continue
          }
          const r = await pixelDiff(base, cur)
          totalPixels += r.total ?? 0
          diffPixels += r.diff ?? -1
          const ratio = r.total ? (r.diff ?? Infinity) / r.total : 0
          const passes = r.diff === 0 || ratio <= 0.001
          check(`[${lang}] newspaper pixel-identical @ ${vp.name}`,
            passes,
            `diff=${r.diff} total=${r.total} (${(ratio * 100).toFixed(4)}%) ${r.reason || ''}`)
        } finally { await ctx.close() }
      }
    }
    console.log(`\nPixel coverage: ${diffPixels}/${totalPixels} differing pixels across ${LOCALES.length * VIEWPORTS.length} captures`)
  } finally {
    await browser.close()
  }

  console.log(`Newspaper checks: ${checks - failures.length}/${checks} passed`)
  if (failures.length) {
    console.log('FAILED:')
    console.log(failures.join('\n'))
    process.exit(1)
  } else {
    console.log('ALL PASSED')
    process.exit(0)
  }
}

import { existsSync } from 'node:fs'

run().catch((e) => { console.error(e); process.exit(1) })
