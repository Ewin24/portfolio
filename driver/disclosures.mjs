/**
 * Case-study and experience disclosures.
 *
 * The case studies read as a newspaper page: one lead, two secondaries, then
 * one-line briefs that open in place. That only works if (a) nothing was
 * dropped on the way into a disclosure, (b) no text is cut mid-sentence,
 * (c) a brief opens by pointer, by keyboard and by its `#case-<id>` address,
 * and (d) the whole thing still fits and reads on a phone.
 *
 * Needs a preview server (BASE_URL, default http://localhost:4193/portfolio/).
 * Exits 0 when every check passes.
 */
import { BASE_URL, VIEWPORTS, newPage, openBrowser } from './helpers.mjs'
import { caseStudies, featuredCaseStudies, caseOutcomes } from '../src/content/case-studies.ts'
import { workExperience } from '../src/content/experience.ts'

const failures = []
let checks = 0
function check(name, cond, extra = '') {
  checks++
  if (!cond) failures.push(`  ✗ ${name}${extra ? ` — ${extra}` : ''}`)
  else console.log(`  ✓ ${name}`)
}

const norm = (s) => s.replace(/\s+/g, ' ').trim()

/** A missing control is a failed check, not a crashed run. */
const act = (promise) => promise.then(() => true, () => false)
const QUICK = { timeout: 2_000 }

const PHONE = VIEWPORTS[0]
const DESKTOP = VIEWPORTS[3]

// The page order is the data's: the flagged lead, then the next two by `order`, then the rest.
const lead = featuredCaseStudies.find((s) => s.lead) ?? featuredCaseStudies[0]
const others = featuredCaseStudies.filter((s) => s.id !== lead.id)
const wantIds = { lead: [lead.id], secondary: others.slice(0, 2).map((s) => s.id), brief: others.slice(2).map((s) => s.id) }

/** True when `#<id>` sits below the fixed header and inside the viewport. */
const landed = (id) => {
  const r = document.getElementById(id)?.getBoundingClientRect()
  const bar = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
  return !!r && r.top >= bar - 1 && r.top < window.innerHeight
}

const browser = await openBrowser()
try {
  for (const lang of ['es', 'en']) {
    const { ctx, page } = await newPage(browser, PHONE, lang, { reducedMotion: 'reduce' })
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })

      const cards = page.locator('#projects [data-card]')
      check(`[${lang}] one card per case study`, (await cards.count()) === caseStudies.length, `${await cards.count()}`)

      // Lead, two secondaries, briefs — in the data's order.
      const gotIds = await page.evaluate(() => Object.fromEntries(['lead', 'secondary', 'brief'].map((kind) =>
        [kind, [...document.querySelectorAll(`#projects [data-card="${kind}"]`)].map((el) => el.id.replace(/^case-/, ''))])))
      check(`[${lang}] one lead, two secondaries, the rest as briefs, in content order`,
        JSON.stringify(gotIds) === JSON.stringify(wantIds), JSON.stringify(gotIds))

      // Every card states its outcome in one whole sentence.
      const outcomes = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('#projects [data-card]')].map((el) =>
        [el.id.replace(/^case-/, ''), el.querySelector('[data-outcome]')?.textContent ?? null])))
      const badOutcome = caseStudies.filter((cs) => !caseOutcomes[cs.id] || norm(outcomes[cs.id] ?? '') !== norm(caseOutcomes[cs.id][lang]))
      check(`[${lang}] every case carries its outcome sentence, whole`, badOutcome.length === 0, badOutcome.map((m) => m.id).join(', '))

      // (a) every full text is inside its card's disclosure, closed or not.
      const fullTexts = (await page.locator('#projects details.case-full').evaluateAll((els) => els.map((e) => e.textContent))).map(norm)
      const missing = caseStudies.filter((cs) => {
        const parts = lang === 'es' ? [cs.problem, cs.solution, cs.impact] : [cs.problemEn, cs.solutionEn, cs.impactEn]
        return !fullTexts.some((t) => parts.every((p) => t.includes(norm(p))))
      })
      check(`[${lang}] problem, solution and impact are complete in every disclosure`, missing.length === 0, missing.map((m) => m.id).join(', '))

      // (b) nothing in the section is clamped or ellipsed.
      const clamped = await page.evaluate(() => [...document.querySelectorAll('#projects *')].filter((el) => {
        const cs = getComputedStyle(el)
        return (cs.webkitLineClamp && cs.webkitLineClamp !== 'none') || cs.textOverflow === 'ellipsis'
      }).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`))
      check(`[${lang}] no clamped or ellipsed text in the section`, clamped.length === 0, [...new Set(clamped)].join(', '))

      // The hard shadow belongs to the lead and to buttons; everything else is ruled.
      const shadowed = await page.evaluate(() => [...document.querySelectorAll('#projects *')].filter((el) =>
        getComputedStyle(el).boxShadow !== 'none' && el.dataset.card !== 'lead' && !el.matches('button, .px-btn'),
      ).map((el) => `${el.tagName.toLowerCase()}#${el.id}.${String(el.className).split(' ')[0]}`))
      check(`[${lang}] only the lead case and buttons carry a shadow`, shadowed.length === 0, shadowed.slice(0, 4).join(', '))

      // The lead's disclosure opens its full text.
      const leadCard = page.locator('#projects [data-card="lead"]')
      await act(leadCard.locator('summary').click(QUICK))
      check(`[${lang}] the lead's full text shows once opened`, await leadCard.locator('details.case-full > :not(summary)').first().isVisible())

      // (c) a brief opens by click …
      const brief = page.locator(`[id="case-${wantIds.brief[0]}"]`)
      const briefBody = brief.locator(':scope > :not(summary)').first()
      check(`[${lang}] a brief is closed until asked`, (await brief.count()) === 1 && !(await briefBody.isVisible()))
      await act(brief.locator(':scope > summary').click(QUICK))
      check(`[${lang}] a brief opens by click`, await briefBody.isVisible())
      await act(brief.locator(':scope > summary').click(QUICK))
      check(`[${lang}] a brief closes by click`, (await brief.locator(':scope > summary').count()) === 1 && !(await briefBody.isVisible()))

      // … and by keyboard, with a visible focus ring.
      const brief2 = page.locator(`[id="case-${wantIds.brief[1]}"]`)
      await act(brief.locator(':scope > summary').focus(QUICK))
      await page.keyboard.press('Tab')
      const focus = await page.evaluate(() => {
        const el = document.activeElement
        const cs = getComputedStyle(el)
        return { id: el.closest('[data-card]')?.id ?? null, tag: el.tagName, ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2 }
      })
      check(`[${lang}] Tab moves from one brief to the next, with a visible focus ring`,
        focus.tag === 'SUMMARY' && focus.id === `case-${wantIds.brief[1]}` && focus.ring, JSON.stringify(focus))
      await page.keyboard.press('Enter')
      check(`[${lang}] a brief opens by keyboard`, await brief2.locator(':scope > :not(summary)').first().isVisible())

      // (d) everything open at 375px: no horizontal scroll, readable type, reachable targets.
      await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true }))
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      check(`[${lang}] no horizontal overflow at 375px with every disclosure open`, overflow <= 0, `${overflow}px`)

      const small = await page.evaluate(() => {
        const out = new Set()
        const walker = document.createTreeWalker(document.querySelector('#projects'), NodeFilter.SHOW_TEXT)
        for (let n; (n = walker.nextNode());) {
          if (!n.textContent.trim()) continue
          const cs = getComputedStyle(n.parentElement)
          const kicker = cs.textTransform === 'uppercase' && parseFloat(cs.letterSpacing) > 0
          if (parseFloat(cs.fontSize) < (kicker ? 11 : 12)) out.add(`${cs.fontSize} "${n.textContent.trim().slice(0, 24)}"`)
        }
        return [...out]
      })
      check(`[${lang}] no text under 12px at 375px (11px for uppercase kickers)`, small.length === 0, `${small.length}: ${small.slice(0, 4).join(', ')}`)

      const shortTargets = await page.evaluate(() => [...document.querySelectorAll('#projects :is(a, summary, button)')]
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.width > 0 && r.height < 44)
        .map(({ el, r }) => `${el.tagName.toLowerCase()} ${Math.round(r.height)}px "${el.textContent.trim().slice(0, 20)}"`))
      check(`[${lang}] every link, summary and button in the section is at least 44px tall at 375px`, shortTargets.length === 0, `${shortTargets.length}: ${shortTargets.slice(0, 4).join(', ')}`)

      const tallLabels = await page.evaluate(() => [...document.querySelectorAll('#projects dl dt')].filter((dt) => {
        const cs = getComputedStyle(dt)
        return dt.getBoundingClientRect().height > parseFloat(cs.lineHeight) * 2.5
      }).map((dt) => dt.textContent.trim()))
      const labelCount = await page.locator('#projects dl dt').count()
      check(`[${lang}] a stat label never wraps to three lines`, labelCount > 0 && tallLabels.length === 0, `${tallLabels.length}/${labelCount}: ${tallLabels.slice(0, 3).join(' | ')}`)

      // Experience: every achievement is in the DOM, visible or behind the disclosure.
      const items = await page.locator('#experience li').count()
      const expected = workExperience.reduce((n, j) => n + (lang === 'es' ? j.achievements : j.achievementsEn).length, 0)
      check(`[${lang}] every achievement rendered`, items === expected, `${items}/${expected}`)
    } finally { await ctx.close() }
  }

  // A brief is addressable: arriving at, or moving to, `#case-<id>` opens it clear of the header.
  for (const vp of [PHONE, DESKTOP]) {
    const { ctx, page } = await newPage(browser, vp, 'en', { reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    try {
      const [first, last] = [wantIds.brief[0], wantIds.brief.at(-1)]
      const isOpen = (id) => document.getElementById(id)?.open === true

      await page.goto(`${BASE_URL}#case-${last}`, { waitUntil: 'networkidle' })
      await page.waitForFunction(landed, `case-${last}`, { timeout: 5_000 }).catch(() => {})
      await page.waitForTimeout(300)
      check(`[${vp.name}] loading #case-<id> of a brief opens it`, await page.evaluate(isOpen, `case-${last}`))
      check(`[${vp.name}] … and lands on it, clear of the header`, await page.evaluate(landed, `case-${last}`))
      check(`[${vp.name}] … leaving the other briefs closed`, !(await page.evaluate(isOpen, `case-${first}`)))

      await page.evaluate((id) => { location.hash = `#${id}` }, `case-${first}`)
      await page.waitForFunction(landed, `case-${first}`, { timeout: 5_000 }).catch(() => {})
      await page.waitForTimeout(300)
      check(`[${vp.name}] changing the hash to another brief opens that one`, await page.evaluate(isOpen, `case-${first}`))
      check(`[${vp.name}] … and lands on it, clear of the header`, await page.evaluate(landed, `case-${first}`))

      // The blog owns `#blog…`: such a hash opens no brief and breaks nothing.
      const openBefore = await page.locator('#projects [data-card="brief"][open]').count()
      await page.evaluate(() => { location.hash = '#blog' })
      await page.waitForTimeout(300)
      check(`[${vp.name}] a #blog hash is left to the blog`,
        (await page.locator('#projects [data-card="brief"][open]').count()) === openBefore && errors.length === 0, errors.join(' | '))

      if (vp === DESKTOP) {
        const boxes = await page.evaluate(() => Object.fromEntries(['lead', 'secondary', 'brief'].map((kind) =>
          [kind, [...document.querySelectorAll(`#projects [data-card="${kind}"]`)].map((el) => {
            const r = el.getBoundingClientRect()
            return { top: Math.round(r.top + scrollY), bottom: Math.round(r.bottom + scrollY), left: Math.round(r.left) }
          })])))
        const [a, b] = boxes.secondary
        check('[1440] the two secondaries sit side by side under the lead',
          !!a && !!b && a.top === b.top && a.left < b.left && a.top >= boxes.lead[0].bottom, JSON.stringify(boxes.secondary))
        check('[1440] the briefs follow the secondaries',
          boxes.brief.length > 0 && boxes.brief[0].top >= Math.max(a?.bottom ?? 0, b?.bottom ?? 0), JSON.stringify(boxes.brief[0]))
      }
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
