/**
 * Case-study and experience disclosures.
 *
 * Cards show a clamped teaser; the full text lives in a native <details>.
 * That only works if (a) nothing was dropped on the way into the disclosure,
 * (b) opening it replaces the teaser instead of repeating it, and (c) the
 * long form still fits a phone.
 *
 * Needs a preview server (BASE_URL, default http://localhost:4193/portfolio/).
 * Exits 0 when every check passes.
 */
import { BASE_URL, VIEWPORTS, newPage, openBrowser } from './helpers.mjs'
import { caseStudies } from '../src/content/case-studies.ts'
import { workExperience } from '../src/content/experience.ts'

const failures = []
let checks = 0
function check(name, cond, extra = '') {
  checks++
  if (!cond) failures.push(`  ✗ ${name}${extra ? ` — ${extra}` : ''}`)
  else console.log(`  ✓ ${name}`)
}

const norm = (s) => s.replace(/\s+/g, ' ').trim()

const browser = await openBrowser()
try {
  for (const lang of ['es', 'en']) {
    const { ctx, page } = await newPage(browser, VIEWPORTS[0], lang, { reducedMotion: 'reduce' })
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })

      const cards = page.locator('#projects article')
      check(`[${lang}] one card per case study`, (await cards.count()) === caseStudies.length, `${await cards.count()}`)

      // (a) every full text is inside its card's disclosure, closed or not.
      const fullTexts = (await page.locator('#projects details.case-full').evaluateAll((els) => els.map((e) => e.textContent))).map(norm)
      const missing = caseStudies.filter((cs) => {
        const parts = lang === 'es' ? [cs.problem, cs.solution, cs.impact] : [cs.problemEn, cs.solutionEn, cs.impactEn]
        return !fullTexts.some((t) => parts.every((p) => t.includes(norm(p))))
      })
      check(`[${lang}] problem, solution and impact are complete in every disclosure`, missing.length === 0, missing.map((m) => m.id).join(', '))

      // (b) opening swaps the teaser for the full text.
      const first = cards.first()
      check(`[${lang}] teaser visible while closed`, await first.locator('.case-teaser').isVisible())
      await first.locator('summary').click()
      check(`[${lang}] teaser hidden while open`, !(await first.locator('.case-teaser').isVisible()))
      check(`[${lang}] full text visible while open`, await first.locator('details.case-full > div').isVisible())

      // (c) everything open at 375px: no horizontal scroll.
      await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true }))
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      check(`[${lang}] no horizontal overflow at 375px with every disclosure open`, overflow <= 0, `${overflow}px`)

      // Experience: every achievement is in the DOM, visible or behind the disclosure.
      const items = await page.locator('#experience li').count()
      const expected = workExperience.reduce((n, j) => n + (lang === 'es' ? j.achievements : j.achievementsEn).length, 0)
      check(`[${lang}] every achievement rendered`, items === expected, `${items}/${expected}`)
    } finally { await ctx.close() }
  }
} finally {
  await browser.close()
}

console.log(`\nDisclosure checks: ${checks - failures.length}/${checks} passed`)
if (failures.length) {
  console.log('FAILED:')
  console.log(failures.join('\n'))
  process.exit(1)
}
console.log('ALL PASSED')
