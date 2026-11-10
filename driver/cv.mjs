// Generates the downloadable CV (public/cv/Edwin-Trigos-CV-{ES,EN}.pdf) from the
// same content files the site renders, so the CV cannot drift from the page.
// Plain one-column HTML with real text: ATS parsers read it, recruiters print it.
// Usage: npm run cv
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { workExperience } from '../src/content/experience.ts'
import { education } from '../src/content/education.ts'
import { featuredCaseStudies } from '../src/content/case-studies.ts'
import { t } from '../src/i18n/translations.ts'
import { periodLabel as period } from '../src/lib/text.ts'

const OUT = new URL('../public/cv/', import.meta.url)
const CASES_IN_CV = 3
const ACHIEVEMENTS_PER_JOB = 3

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

const LABELS = {
  es: { summary: 'Perfil', experience: 'Experiencia', projects: 'Proyectos destacados', education: 'Formación', stack: 'Stack' },
  en: { summary: 'Profile', experience: 'Experience', projects: 'Selected projects', education: 'Education', stack: 'Stack' },
}

const firstSentence = (s) => s.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? s

// Spanish words that must never reach the English CV. Fails the build of the
// PDF instead of shipping it, since nothing else reads the generated text.
const SPANISH_IN_EN = /\b(Presente|Proyecto de grado|Tiempo completo|Contrato)\b/

function html(lang) {
  const L = LABELS[lang]
  const es = lang === 'es'
  const jobs = [...workExperience].sort((a, b) => b.order - a.order)
  const cases = featuredCaseStudies.slice(0, CASES_IN_CV)
  const edu = [...education].sort((a, b) => b.order - a.order)

  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>Edwin Trigos — CV</title>
<style>
  @page { size: A4; margin: 12mm; }
  body { font: 9.5pt/1.35 Georgia, 'Times New Roman', serif; color: #1a1a1a; margin: 0; }
  h1 { font-size: 22pt; margin: 0; }
  .role { font-size: 12pt; font-style: italic; color: #b3261e; margin: 2px 0; }
  .meta { font: 8.5pt/1.4 Consolas, monospace; color: #444; }
  .meta a { color: inherit; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: .08em; border-bottom: 2px solid #1a1a1a; margin: 14px 0 6px; padding-bottom: 2px; }
  .item { margin-bottom: 8px; break-inside: avoid; }
  .head { display: flex; justify-content: space-between; gap: 12px; font-weight: bold; }
  .sub { font-style: italic; color: #444; }
  ul { margin: 3px 0 0 16px; padding: 0; }
  li { margin: 1px 0; }
  .stack { font: 8pt Consolas, monospace; color: #555; }
</style></head><body>
<h1>Edwin Trigos Guevara</h1>
<p class="role">${esc(t('hero.role', lang))}</p>
<p class="meta">${esc(t('hero.availability', lang))}<br>
edwintrigos24@gmail.com · <a href="https://www.linkedin.com/in/edwintrigosguevara">linkedin.com/in/edwintrigosguevara</a> · <a href="https://github.com/Ewin24">github.com/Ewin24</a> · <a href="https://ewin24.github.io/portfolio/">ewin24.github.io/portfolio</a></p>

<h2>${L.summary}</h2>
<p>${esc(t('hero.subtitle', lang))}</p>

<h2>${L.experience}</h2>
${jobs.map((j) => `<div class="item">
  <div class="head"><span>${esc(es ? j.role : j.roleEn)} — ${esc(j.company)}</span><span>${esc(period(j.period, lang))}</span></div>
  <div class="sub">${esc(t(`experience.employment.${j.employment}`, lang))} · ${esc(es ? j.location : (j.locationEn ?? j.location))}</div>
  <ul>${(es ? j.achievements : j.achievementsEn).slice(0, ACHIEVEMENTS_PER_JOB).map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
  <div class="stack">${L.stack}: ${j.stack.map(esc).join(', ')}</div>
</div>`).join('')}

<h2>${L.projects}</h2>
${cases.map((c) => `<div class="item">
  <div class="head"><span>${esc(es ? c.title : c.titleEn)}</span><span>${esc(period(c.period, lang))}</span></div>
  <p>${esc(firstSentence(es ? c.impact : c.impactEn))}</p>
  <div class="stack">${L.stack}: ${c.stack.map(esc).join(', ')}</div>
</div>`).join('')}

<h2>${L.education}</h2>
${edu.map((e) => `<div class="item"><div class="head"><span>${esc(es ? e.degree : e.degreeEn)} — ${esc(e.institution)}</span><span>${esc(period(e.period, lang))}</span></div></div>`).join('')}
</body></html>`
}

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage()
for (const lang of ['es', 'en']) {
  await page.setContent(html(lang), { waitUntil: 'load' })
  const leak = lang === 'en' && (await page.innerText('body')).match(SPANISH_IN_EN)
  if (leak) throw new Error(`English CV contains Spanish text: "${leak[0]}"`)
  const path = fileURLToPath(new URL(`Edwin-Trigos-CV-${lang.toUpperCase()}.pdf`, OUT))
  await page.pdf({ path, format: 'A4', printBackground: true })
  console.log(`wrote ${path}`)
}
await browser.close()
