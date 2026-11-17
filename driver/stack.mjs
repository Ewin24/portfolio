/**
 * The technology stack section: areas, evidence per technology, status and
 * the technology by case-study map.
 *
 * The driver is its own oracle: it reads the content sources (roles and case
 * studies imported as modules, posts parsed from their files) and matches them
 * with alias lists written here, not with the page's table in
 * `src/content/stack.ts`. A disagreement is either a wrong alias or a wrong
 * derivation, and both are worth a failure.
 *
 * Needs a server (BASE_URL, default http://localhost:4193/portfolio/).
 * Exits 0 when every check passes.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { BASE_URL, VIEWPORTS, newPage, openBrowser } from './helpers.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
// Node strips the types; both modules only import types.
const { workExperience } = await import(pathToFileURL(path.join(root, 'src/content/experience.ts')).href)
const { featuredCaseStudies } = await import(pathToFileURL(path.join(root, 'src/content/case-studies.ts')).href)

/** slug and tags of every post (each post declares slug, then tags), as `driver/promo.mjs` reads them. */
function sourcePosts() {
  const dir = path.join(root, 'src', 'blog', 'content')
  const files = [path.join(dir, 'posts.ts'), ...fs.readdirSync(path.join(dir, 'posts')).map((f) => path.join(dir, 'posts', f))]
  const posts = []
  for (const file of files) {
    for (const m of fs.readFileSync(file, 'utf8').matchAll(/\bslug: '([^']+)',[\s\S]*?\btags: \[([^\]]*)\]/g)) {
      posts.push({ slug: m[1], tags: [...m[2].matchAll(/'([^']+)'/g)].map((t) => t[1]) })
    }
  }
  return posts
}
const POSTS = sourcePosts()

const AREAS = {
  es: ['Backend', 'Datos', 'Frontend', 'Nube y entrega', 'Calidad', 'IA'],
  en: ['Backend', 'Data', 'Frontend', 'Cloud and delivery', 'Quality', 'AI'],
}
const NAMES = [
  '.NET / C#', 'PHP / Laravel', 'SQL Server', 'React', 'TypeScript', 'AWS', 'Flutter', 'Clean Architecture',
  'Docker', 'LLM / AI Agents', 'Cloudflare Workers', 'IndexedDB', 'Playwright', 'Vitest', 'AI Discoverability',
]

/** The driver's own aliases for the technologies it checks. */
const ORACLE = {
  react: { name: 'React', stack: ['React', 'React 19'], tags: ['react', 'React'] },
  sqlserver: { name: 'SQL Server', stack: ['SQL Server'], tags: ['SQL Server', 'T-SQL'] },
  playwright: { name: 'Playwright', stack: ['Playwright'], tags: ['playwright'] },
  flutter: { name: 'Flutter', stack: ['Flutter', 'Flutter 3.44+', 'Dart'], tags: ['flutter'] },
  geo: { name: 'AI Discoverability', stack: [], tags: [] },
}
const any = (aliases, values) => values.some((v) => aliases.includes(v))
function expected(id) {
  const o = ORACLE[id]
  const cases = featuredCaseStudies.filter((s) => any(o.stack, s.stack))
  const roles = workExperience.filter((r) => any(o.stack, r.stack))
  const posts = POSTS.filter((p) => any(o.tags, p.tags))
  const status = roles.some((r) => r.current) ? 'current' : roles.length || cases.length ? 'past' : null
  return { cases, roles, posts, status }
}
const WORDS = {
  es: { cases: ['caso', 'casos'], roles: ['rol', 'roles'], posts: ['artículo', 'artículos'] },
  en: { cases: ['case study', 'case studies'], roles: ['role', 'roles'], posts: ['post', 'posts'] },
}
const STATUS = {
  es: { current: 'En producción hoy', past: 'Usado antes' },
  en: { current: 'In production today', past: 'Used before' },
}
function countsLine(e, lang) {
  return ['cases', 'roles', 'posts']
    .filter((k) => e[k].length > 0)
    .map((k) => `${e[k].length} ${WORDS[lang][k][e[k].length === 1 ? 0 : 1]}`)
    .join(' · ')
}
/** The column label of a study in the map: its title up to the dash. */
const shortTitle = (study, lang) => (lang === 'es' ? study.title : study.titleEn).split(' — ')[0]

const failures = []
let checks = 0
function check(name, cond, extra = '') {
  checks++
  if (!cond) failures.push(`  ✗ ${name}${extra ? ` — ${extra}` : ''}`)
  else console.log(`  ✓ ${name}`)
}

const DESKTOP = VIEWPORTS[3]
const PHONE = VIEWPORTS[0]

async function open(browser, vp, lang, { theme } = {}) {
  const { ctx, page } = await newPage(browser, vp, lang)
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  if (theme) {
    await page.addInitScript((t) => {
      try { localStorage.setItem('portfolio-theme', t) } catch {}
    }, theme)
  }
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })
  if (theme === 'xp') {
    await page.waitForTimeout(600)
    await page.evaluate(() => { window.__XPMANAGER__.open('skills-experience') })
  }
  await page.waitForSelector('#skills [data-stack-tech]', { timeout: 10_000 }).catch(() => {})
  if (theme !== 'xp') await page.locator('#skills').scrollIntoViewIfNeeded().catch(() => {})
  await page.waitForTimeout(500)
  return { ctx, page, errors }
}

const visibleText = (el) => el.evaluate((n) => n.textContent.replace(/\s+/g, ' ').trim())

/** What the section shows: areas with their technologies, counts and status. */
const readSection = (page) =>
  page.evaluate(() => {
    const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : null)
    const areas = [...document.querySelectorAll('#skills [data-stack-area]')].map((area) => ({
      id: area.dataset.stackArea,
      label: txt(area.querySelector('[data-stack-area-label]')),
      counts: txt(area.querySelector('[data-stack-area-counts]')),
      techs: [...area.querySelectorAll('button[data-stack-tech]')].map((b) => ({
        id: b.dataset.stackTech,
        name: txt(b.querySelector('[data-stack-name]')),
        counts: txt(b.querySelector('[data-stack-counts]')),
        status: b.querySelector('[data-stack-status]')?.dataset.stackStatus ?? null,
        statusText: txt(b.querySelector('[data-stack-status]')),
        pressed: b.getAttribute('aria-pressed'),
      })),
    }))
    const section = document.querySelector('#skills')
    const rule = section?.querySelector('[data-stack-rule]')
    return {
      areas,
      rule: txt(rule),
      ruleVisible: !!rule && rule.getClientRects().length > 0,
      percent: (section?.innerText ?? '').includes('%'),
      bars: section?.querySelectorAll('progress, meter, [role="progressbar"], [role="meter"]').length ?? -1,
    }
  })

/** The detail panel that is on screen (the section renders one beside the list and one inside it). */
const readDetail = (page) =>
  page.evaluate(() => {
    const detail = [...document.querySelectorAll('#skills [data-stack-detail]')].find((d) => d.getClientRects().length > 0)
    if (!detail) return null
    const links = (kind) => [...detail.querySelectorAll(`[data-stack-evidence="${kind}"] a`)].map((a) => a.getAttribute('href'))
    return {
      tech: detail.dataset.stackDetail,
      title: detail.querySelector('h3')?.textContent.trim() ?? null,
      cases: links('cases'),
      roles: links('roles'),
      posts: links('posts'),
      groups: [...detail.querySelectorAll('[data-stack-evidence]')].map((g) => g.dataset.stackEvidence),
      milestones: detail.querySelectorAll('[data-stack-milestone]').length,
      reference: detail.querySelector('[data-stack-reference]')?.getAttribute('href') ?? null,
    }
  })

/** Smallest rendered text and anything sticking out of the viewport, inside `selector`. */
const measure = (page, selector) =>
  page.evaluate((sel) => {
    const rootEl = document.querySelector(sel)
    const out = { small: [], wide: [], docOverflow: document.documentElement.scrollWidth - window.innerWidth }
    if (!rootEl) return { ...out, missing: true }
    const scrolls = (el) => {
      for (let p = el.parentElement; p && p !== rootEl.parentElement; p = p.parentElement) {
        if (['auto', 'scroll'].includes(getComputedStyle(p).overflowX)) return true
      }
      return false
    }
    for (const el of rootEl.querySelectorAll('*')) {
      if (el.getClientRects().length === 0 || el.closest('svg')) continue
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden') continue
      const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
      if (ownText && parseFloat(cs.fontSize) < 12) out.small.push(`${el.className || el.tagName}:${cs.fontSize}`)
      const r = el.getBoundingClientRect()
      if (r.width > 0 && r.right > window.innerWidth + 0.5 && !scrolls(el)) out.wide.push(`${el.className || el.tagName}:${Math.round(r.right)}`)
    }
    return out
  }, selector)

async function run() {
  const browser = await openBrowser()
  try {
    // ── Areas, technologies, counts, status: ES and EN
    for (const lang of ['es', 'en']) {
      const { ctx, page, errors } = await open(browser, DESKTOP, lang)
      try {
        const s = await readSection(page)
        check(`[${lang}] the six areas render in order with their labels`,
          JSON.stringify(s.areas.map((a) => a.label)) === JSON.stringify(AREAS[lang]), JSON.stringify(s.areas.map((a) => a.label)))
        check(`[${lang}] every area holds at least one technology`, s.areas.length === 6 && s.areas.every((a) => a.techs.length > 0),
          JSON.stringify(s.areas.map((a) => a.techs.length)))
        const techs = s.areas.flatMap((a) => a.techs)
        const names = techs.map((t) => t.name)
        check(`[${lang}] every technology of today is present exactly once`,
          names.length === NAMES.length && NAMES.every((n) => names.filter((x) => x === n).length === 1), JSON.stringify(names))

        for (const id of ['react', 'sqlserver', 'playwright']) {
          const t = techs.find((x) => x.id === id)
          const want = countsLine(expected(id), lang)
          check(`[${lang}] ${id} shows the counts the driver computes`, t?.counts === want, `${JSON.stringify(t?.counts)} vs ${JSON.stringify(want)}`)
        }
        const geo = techs.find((x) => x.id === 'geo')
        check(`[${lang}] a technology with no evidence shows no count and no zero`, !!geo && !geo.counts, JSON.stringify(geo))
        check(`[${lang}] area counts are shown and carry no zero`,
          s.areas.length === 6 && s.areas.every((a) => a.counts && !/(^|\D)0 /.test(a.counts)), JSON.stringify(s.areas.map((a) => a.counts)))

        for (const id of Object.keys(ORACLE)) {
          const t = techs.find((x) => x.id === id)
          const want = expected(id).status
          check(`[${lang}] ${id} status is ${want ?? 'absent'}`,
            t?.status === want && (want ? t.statusText === STATUS[lang][want] : t?.statusText === null), JSON.stringify(t))
        }
        check(`[${lang}] no status outside the two the rule decides`,
          techs.every((t) => t.status === null || Object.values(STATUS[lang]).includes(t.statusText)), JSON.stringify(techs.map((t) => t.statusText)))
        check(`[${lang}] the rule line is visible and names both labels`,
          s.ruleVisible && Object.values(STATUS[lang]).every((label) => s.rule.toLowerCase().includes(label.toLowerCase())), s.rule ?? 'null')
        check(`[${lang}] no percentage sign and no progress bar in the section`, !s.percent && s.bars === 0, JSON.stringify({ percent: s.percent, bars: s.bars }))
        check(`[${lang}] no page or console errors`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── Selecting a technology shows its evidence; the links work
    {
      const { ctx, page, errors } = await open(browser, DESKTOP, 'en')
      try {
        const want = expected('react')
        await page.locator('#skills button[data-stack-tech="react"]').click()
        await page.waitForTimeout(400)
        const s = await readSection(page)
        const pressed = s.areas.flatMap((a) => a.techs).filter((t) => t.pressed === 'true').map((t) => t.id)
        check('selecting React presses it and only it', JSON.stringify(pressed) === '["react"]', JSON.stringify(pressed))
        const d = await readDetail(page)
        check('the detail panel is about React', d?.tech === 'react' && d.title === 'React', JSON.stringify(d))
        check('it lists the case studies whose stack includes React', d?.cases.length === want.cases.length && d.cases.every((h) => h === '#projects'),
          `${JSON.stringify(d?.cases)} vs ${want.cases.length}`)
        check('it lists the roles whose stack includes React', d?.roles.length === want.roles.length && d.roles.every((h) => h === '#experience'),
          `${JSON.stringify(d?.roles)} vs ${want.roles.length}`)
        check('it lists the posts tagged React',
          JSON.stringify([...(d?.posts ?? [])].sort()) === JSON.stringify(want.posts.map((p) => `#blog/article/${p.slug}`).sort()), JSON.stringify(d?.posts))
        check('the three milestones and the reference link sit in the panel', d?.milestones === 3 && !!d.reference, JSON.stringify(d))

        // A technology with evidence in one source only shows that source and nothing else.
        await page.locator('#skills button[data-stack-tech="playwright"]').click()
        await page.waitForTimeout(400)
        const p = await readDetail(page)
        const wantP = expected('playwright')
        const wantGroups = ['cases', 'roles', 'posts'].filter((k) => wantP[k].length > 0)
        check('a source with no evidence shows no line', JSON.stringify(p?.groups) === JSON.stringify(wantGroups), `${JSON.stringify(p?.groups)} vs ${JSON.stringify(wantGroups)}`)

        // A case-study link reaches the case studies section.
        await page.locator('#skills button[data-stack-tech="react"]').click()
        await page.waitForTimeout(400)
        const visibleDetail = page.locator('#skills [data-stack-detail]:visible')
        await visibleDetail.locator('[data-stack-evidence="cases"] a').first().click()
        await page.waitForTimeout(1200)
        const reached = await page.evaluate(() => {
          const r = document.querySelector('#projects')?.getBoundingClientRect()
          return { hash: location.hash, top: r?.top ?? null, bottom: r?.bottom ?? null, vh: window.innerHeight }
        })
        check('a case-study link reaches the case studies section',
          reached.hash === '#projects' && reached.top !== null && reached.top < reached.vh && reached.bottom > 0, JSON.stringify(reached))

        // A post link opens that article.
        const slug = want.posts[0].slug
        await visibleDetail.locator(`[data-stack-evidence="posts"] a[href="#blog/article/${slug}"]`).click()
        await page.waitForSelector('.blog-article-body', { timeout: 10_000 }).catch(() => {})
        const article = await page.evaluate(() => ({ hash: location.hash, body: !!document.querySelector('.blog-article-body') }))
        check('a post link opens that article', article.hash === `#blog/article/${slug}` && article.body, JSON.stringify(article))
        check('selection and links raise no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── Keyboard
    {
      const { ctx, page, errors } = await open(browser, DESKTOP, 'en')
      try {
        const buttons = page.locator('#skills button[data-stack-tech]')
        const ids = await buttons.evaluateAll((els) => els.map((b) => b.dataset.stackTech))
        await buttons.first().focus()
        const ring = await buttons.first().evaluate((b) => {
          const cs = getComputedStyle(b)
          return b.matches(':focus-visible') ? `${cs.outlineStyle} ${cs.outlineWidth}` : 'not focus-visible'
        })
        check('a focused technology shows a focus ring', /^solid [1-9]/.test(ring), ring)
        // Tab moves on through the list: within a few stops focus is on another technology.
        let reachedId = null
        for (let i = 0; i < 12 && !reachedId; i++) {
          await page.keyboard.press('Tab')
          reachedId = await page.evaluate(() => document.activeElement?.dataset?.stackTech ?? null)
        }
        check('Tab reaches the next technology', !!reachedId && reachedId !== ids[0], String(reachedId))
        await page.keyboard.press('Enter')
        await page.waitForTimeout(300)
        const afterEnter = await page.locator('#skills button[aria-pressed="true"]').evaluateAll((els) => els.map((b) => b.dataset.stackTech))
        check('Enter selects the focused technology and exposes it with aria-pressed', JSON.stringify(afterEnter) === JSON.stringify([reachedId]), JSON.stringify(afterEnter))
        check('the panel follows the keyboard selection', (await readDetail(page))?.tech === reachedId)
        await buttons.last().focus()
        await page.keyboard.press('Space')
        await page.waitForTimeout(300)
        const afterSpace = await page.locator('#skills button[aria-pressed="true"]').evaluateAll((els) => els.map((b) => b.dataset.stackTech))
        check('Space selects too', JSON.stringify(afterSpace) === JSON.stringify([ids[ids.length - 1]]), JSON.stringify(afterSpace))
        check('every technology button has an accessible name',
          (await buttons.evaluateAll((els) => els.every((b) => b.textContent.trim().length > 0))) === true)
        check('keyboard raises no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── The map figure: mounts, plays, offers its table, and the marks are the data
    for (const lang of ['es', 'en']) {
      const { ctx, page, errors } = await open(browser, DESKTOP, lang)
      try {
        const fig = page.locator('#skills [data-stack-map] .fig')
        check(`[${lang}] the map mounts through the figure shell as a grid`,
          (await fig.count()) === 1 && (await fig.getAttribute('data-fig-type')) === 'grid' && (await page.locator('#skills .fig-fallback').count()) === 0)
        await fig.scrollIntoViewIfNeeded()
        const total = Number(await fig.getAttribute('data-fig-steps'))
        check(`[${lang}] the map has one step per area at least`, total >= 6, String(total))
        // Auto-play starts when the figure is on screen.
        await page.waitForFunction(() => Number(document.querySelector('#skills [data-stack-map] .fig')?.dataset.figStep) >= 2, null, { timeout: 6_000 }).catch(() => {})
        check(`[${lang}] the map plays by itself once on screen`, Number(await fig.getAttribute('data-fig-step')) >= 2, await fig.getAttribute('data-fig-step'))

        await fig.locator('[data-fig-control="restart"]').click()
        const narration = []
        const shown = []
        for (let step = 1; step <= total; step++) {
          if (step > 1) await fig.locator('[data-fig-control="next"]').click()
          await page.waitForTimeout(120)
          narration.push(await visibleText(fig.locator('.fig-narration')))
          shown.push(await fig.locator('[data-step][data-on="true"]').count())
        }
        check(`[${lang}] each step reveals more of the map`, shown[0] > 0 && shown.every((n, i) => i === 0 || n >= shown[i - 1]) && shown[total - 1] > shown[0], JSON.stringify(shown))
        check(`[${lang}] at the last step nothing is left hidden`, (await fig.locator('[data-step][data-on="false"]').count()) === 0)
        check(`[${lang}] every step has its own narration line`, new Set(narration).size === total && narration.every((n) => n.length > 0), JSON.stringify(narration))
        for (const [i, label] of AREAS[lang].entries()) {
          check(`[${lang}] step ${i + 1} narrates ${label}`, narration[i].startsWith(label), narration[i])
        }

        await fig.locator('[data-fig-control="data"]').click()
        const table = await fig.locator('.fig-table table').evaluate((t) => ({
          head: [...t.querySelectorAll('thead th')].map((c) => c.textContent.trim()),
          rows: [...t.querySelectorAll('tbody tr')].map((r) => [...r.querySelectorAll('td')].map((c) => c.textContent.trim())),
        })).catch(() => null)
        check(`[${lang}] the map offers its table: one row per technology, one column per case study`,
          !!table && table.rows.length === NAMES.length && table.head.length === featuredCaseStudies.length + 2, JSON.stringify(table?.head))
        const yes = lang === 'es' ? 'sí' : 'yes'
        for (const id of ['react', 'sqlserver']) {
          const row = table?.rows.find((r) => r[1] === ORACLE[id].name)
          const got = row ? Object.fromEntries(table.head.slice(2).map((h, i) => [h, row[i + 2] === yes])) : null
          const want = Object.fromEntries(featuredCaseStudies.map((s) => [shortTitle(s, lang), any(ORACLE[id].stack, s.stack)]))
          check(`[${lang}] the table's marks for ${id} equal the driver's computation`,
            JSON.stringify(got, Object.keys(want).sort()) === JSON.stringify(want, Object.keys(want).sort()) && Object.values(want).some(Boolean),
            `${JSON.stringify(got)} vs ${JSON.stringify(want)}`)
        }
        check(`[${lang}] the map raises no page or console errors`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── 375 px: legible, nothing overflows, the map is a list
    for (const lang of ['es', 'en']) {
      const { ctx, page, errors } = await open(browser, PHONE, lang)
      try {
        const fig = page.locator('#skills [data-stack-map] .fig')
        await fig.scrollIntoViewIfNeeded()
        const total = Number(await fig.getAttribute('data-fig-steps'))
        await fig.locator(`[data-fig-mark="${total}"]`).click()
        await page.waitForTimeout(500)
        const rest = await measure(page, '#skills')
        check(`[${lang}] 375: no text under 12 px`, !rest.missing && rest.small.length === 0, rest.small.slice(0, 6).join(', '))
        check(`[${lang}] 375: nothing overflows`, rest.docOverflow <= 0 && rest.wide.length === 0, `doc+${rest.docOverflow} ${rest.wide.slice(0, 6).join(', ')}`)
        const mode = await fig.evaluate((f) => ({
          grid: (f.querySelector('.fig-grid-map')?.getClientRects().length ?? 0) > 0,
          list: (f.querySelector('.fig-grid-list')?.getClientRects().length ?? 0) > 0,
        }))
        check(`[${lang}] 375: the map is a per-technology list, not a shrunken grid`, mode.list && !mode.grid, JSON.stringify(mode))
        const reactLine = await fig.locator('.fig-grid-list [data-grid-row="React"]').evaluate((n) => n.textContent).catch(() => '')
        const wantTitles = featuredCaseStudies.filter((s) => any(ORACLE.react.stack, s.stack)).map((s) => shortTitle(s, lang))
        check(`[${lang}] 375: the list names the studies React appears in`, wantTitles.length > 0 && wantTitles.every((t) => reactLine.includes(t)), reactLine)

        await fig.locator('[data-fig-control="data"]').click()
        await page.locator('#skills button[data-stack-tech="react"]').click()
        await page.waitForTimeout(400)
        const selected = await measure(page, '#skills')
        check(`[${lang}] 375: still legible and contained with a technology selected and the table open`,
          selected.small.length === 0 && selected.docOverflow <= 0 && selected.wide.length === 0,
          `${selected.small.slice(0, 4).join(', ')} doc+${selected.docOverflow} ${selected.wide.slice(0, 4).join(', ')}`)
        const d = await readDetail(page)
        check(`[${lang}] 375: the evidence of the selected technology is on screen`, d?.tech === 'react' && d.cases.length > 0, JSON.stringify(d))
        check(`[${lang}] 375: no page or console errors`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── Dark theme: nothing in the section keeps the light paper colour
    for (const vp of [DESKTOP, PHONE]) {
      const { ctx, page, errors } = await open(browser, vp, 'es', { theme: 'dark' })
      try {
        await page.locator('#skills [data-stack-map] .fig [data-fig-control="data"]').click()
        await page.waitForTimeout(300)
        const light = await page.evaluate(() => {
          const PAPER = 'rgb(250, 250, 245)'
          const hits = []
          for (const el of [document.querySelector('#skills'), ...document.querySelectorAll('#skills *')]) {
            if (!el || el.getClientRects().length === 0) continue
            const cs = getComputedStyle(el)
            if (cs.backgroundColor === PAPER) hits.push(`${el.className || el.tagName}`)
          }
          return { theme: document.documentElement.dataset.theme, hits, count: document.querySelectorAll('#skills [data-stack-tech]').length }
        })
        check(`dark ${vp.name}: no element of the section computes to the light paper colour`,
          light.theme === 'dark' && light.count === NAMES.length && light.hits.length === 0, JSON.stringify(light.hits.slice(0, 6)))
        check(`dark ${vp.name}: no page or console errors`, errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }

    // ── XP: the skills window shows the section without horizontal scroll
    {
      const { ctx, page, errors } = await open(browser, DESKTOP, 'en', { theme: 'xp' })
      try {
        const xp = await page.evaluate(() => {
          const section = document.querySelector('.xp-window #skills')
          const body = section?.closest('.xp-window-body')
          return {
            theme: document.documentElement.dataset.theme,
            techs: section?.querySelectorAll('button[data-stack-tech]').length ?? 0,
            areas: section?.querySelectorAll('[data-stack-area]').length ?? 0,
            scroll: body ? body.scrollWidth - body.clientWidth : null,
            width: body?.clientWidth ?? null,
            map: section?.querySelectorAll('[data-stack-map] .fig').length ?? 0,
          }
        })
        check('XP: the skills window shows the six areas and every technology', xp.theme === 'xp' && xp.areas === 6 && xp.techs === NAMES.length && xp.map === 1, JSON.stringify(xp))
        check('XP: the window has no horizontal scroll', xp.scroll !== null && xp.scroll <= 0, JSON.stringify(xp))
        await page.locator('.xp-window #skills button[data-stack-tech="flutter"]').click()
        await page.waitForTimeout(400)
        const d = await readDetail(page)
        const after = await page.evaluate(() => {
          const body = document.querySelector('.xp-window #skills')?.closest('.xp-window-body')
          return body ? body.scrollWidth - body.clientWidth : null
        })
        check('XP: selecting a technology shows its evidence, still without horizontal scroll',
          d?.tech === 'flutter' && d.cases.length === expected('flutter').cases.length && after !== null && after <= 0, JSON.stringify({ d, after }))
        check('XP: no page or console errors', errors.length === 0, errors.join(' | '))
      } finally { await ctx.close() }
    }
  } finally {
    await browser.close()
  }

  console.log(`\nStack checks: ${checks - failures.length}/${checks} passed`)
  if (failures.length) {
    console.log('FAILED:')
    console.log(failures.join('\n'))
    process.exit(1)
  }
  console.log('ALL PASSED')
}

run().catch((e) => { console.error(e); process.exit(1) })
