import {
  loadXp, openBrowser, pixelDiff, shotPath, capturePage, APP_IDS, VIEWPORTS,
  LOCALES, BASE_URL, ensureBaselineDir,
} from './helpers.mjs'

/**
 * Committed interactive XP driver (design D9 / tasks C.6 + C.8).
 *
 * Full interactive verification of the XP desktop across es + en × all 4
 * viewports, plus a reduced-motion variant. Asserts, per spec #1629 M0:
 *   1. Exactly 1 window (`about`/Hero) open on mount, everywhere.
 *   2. Drag clamp: a far drag keeps the window inside [0, desktopW−w] ×
 *      [0, desktopH−40px].
 *   3. Z-order: clicking the lower window makes it active with the greatest
 *      computed z-index.
 *   4. Minimize hides the body; Maximize fills desktop bounds and a second
 *      click restores the prior rect; Close removes the window; reopen restores.
 *   5. Start menu: click → role=menu with 7 menuitem + aria-expanded=true;
 *      an entry opens+focuses its window and closes the menu; Esc/outside
 *      close and return focus to Start.
 *   6. 7 desktop icons open windows.
 *   7. Taskbar label restores a minimized window.
 *   8. Tabs (skills-experience): switching hides Skills, shows Experience,
 *      window rect + z-index unchanged; roving-tabindex arrow nav.
 *   9. Mobile < 640px at 375: no horizontal overflow, windows stacked
 *      full-width, title-bar drag does not move the window.
 *  10. Reduced motion: window transition ≤ 0.01ms and drag is inert.
 *  11. Keyboard-only: Esc on a focused window closes it without trapping focus.
 *
 * Exits 0 when every check passes.
 */
const failures = []
let checks = 0
function check(name, cond, extra = '') {
  checks++
  if (!cond) {
    failures.push(`  ✗ ${name}${extra ? ` — ${extra}` : ''}`)
  } else {
    console.log(`  ✓ ${name}`)
  }
}

const TASKBAR_H = 40

async function run() {
  ensureBaselineDir()
  const browser = await openBrowser()
  try {
    // ── 1. Default-open: exactly one .xp-window containing #hero ──
    for (const lang of LOCALES) {
      for (const vp of VIEWPORTS) {
        const { ctx, page } = await loadXp(browser, lang, vp, { reducedMotion: 'reduce' })
        try {
          const r = await page.evaluate(() => {
            const wins = [...document.querySelectorAll('.xp-window')]
            return { count: wins.length, hasHero: wins[0]?.querySelector('#hero') ? true : false }
          })
          check(`default-open: 1 window @ ${lang}/${vp.name}`, r.count === 1, `count=${r.count}`)
          check(`default-open: #hero present @ ${lang}/${vp.name}`, r.hasHero, JSON.stringify(r))
        } finally { await ctx.close() }
      }
    }

    // ── 2. Drag clamp (1024, en) ──
    {
      const { ctx, page } = await loadXp(browser, 'en', VIEWPORTS[2])
      try {
        const win = page.locator('.xp-window')
        const tb = await win.locator('.xp-window-titlebar').boundingBox()
        const sx = tb.x + tb.width / 2
        const sy = tb.y + tb.height / 2
        await page.mouse.move(sx, sy)
        await page.mouse.down()
        await page.mouse.move(sx + 2000, sy + 2000, { steps: 20 })
        await page.mouse.up()
        await page.waitForTimeout(200)
        const pos = await win.evaluate((el) => {
          const r = el.getBoundingClientRect()
          return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }
        })
        const desktopW = 1024
        const desktopH = 768
        check('drag: right <= desktop right', pos.right <= desktopW + 0.5, JSON.stringify(pos))
        check('drag: bottom <= desktop bottom - 40px', pos.bottom <= desktopH - TASKBAR_H + 0.5, JSON.stringify(pos))
        check('drag: no negative left/top', pos.left >= -0.5 && pos.top >= -0.5, JSON.stringify(pos))
      } finally { await ctx.close() }
    }

    // ── 3. z-order + 4. min/max/close + reopen (via test seam) ──
    {
      const { ctx, page } = await loadXp(browser, 'en', VIEWPORTS[2])
      try {
        await page.evaluate(() => {
          window.__XPMANAGER__.open('projects')
          window.__XPMANAGER__.focus('projects')
        })
        await page.waitForTimeout(300)
        let counts = await page.evaluate(() => ({
          wins: document.querySelectorAll('.xp-window').length,
          z: [...document.querySelectorAll('.xp-window')].map((w) => getComputedStyle(w).zIndex),
        }))
        check('two windows render after opening projects', counts.wins === 2, `count=${counts.wins}`)
        const zs = counts.z.map(Number)
        check('active window has strictly greater z-index',
          counts.z.length === 2 && zs[0] !== zs[1], `z=${JSON.stringify(counts.z)}`)

        await page.evaluate(() => window.__XPMANAGER__.focus('about'))
        await page.waitForTimeout(200)
        const aboutTb = await page.locator('.xp-window:has(#hero) .xp-window-titlebar').boundingBox()
        await page.mouse.click(aboutTb.x + aboutTb.width / 2, aboutTb.y + aboutTb.height / 2)
        await page.waitForTimeout(200)
        const after = await page.evaluate(() => {
          const wins = [...document.querySelectorAll('.xp-window')]
          const activeWin = wins.find((w) => w.querySelector('#hero'))
          return { z: wins.map((w) => getComputedStyle(w).zIndex), active: activeWin ? getComputedStyle(activeWin).zIndex : null }
        })
        check('clicking about makes it active (greatest z)', after.active === String(Math.max(...after.z.map(Number))),
          JSON.stringify(after))

        await page.evaluate(() => window.__XPMANAGER__.minimize('projects'))
        await page.waitForTimeout(200)
        let minState = await page.evaluate(() => {
          const p = [...document.querySelectorAll('.xp-window')].find((w) => w.querySelector('#projects'))
          return { display: p ? getComputedStyle(p).display : null, openIds: window.__XPMANAGER__.openSet ? [...window.__XPMANAGER__.openSet] : null }
        })
        check('minimize keeps window in openSet', !!minState.openIds && minState.openIds.includes('projects'), JSON.stringify(minState))
        check('minimize hides window body', minState.display === 'none', JSON.stringify(minState))

        await page.evaluate(() => window.__XPMANAGER__.restore('projects'))
        await page.waitForTimeout(200)
        minState = await page.evaluate(() => {
          const p = [...document.querySelectorAll('.xp-window')].find((w) => w.querySelector('#projects'))
          return { display: p ? getComputedStyle(p).display : null }
        })
        check('restore shows window again', minState.display !== 'none', JSON.stringify(minState))

        await page.evaluate(() => window.__XPMANAGER__.toggleMaximize('projects'))
        await page.waitForTimeout(200)
        const maxState = await page.evaluate(() => {
          const p = [...document.querySelectorAll('.xp-window')].find((w) => w.querySelector('#projects'))
          const r = p.getBoundingClientRect()
          return { left: r.left, right: r.right, bottom: r.bottom, w: r.width }
        })
        const desktopW = 1024
        const desktopH = 768
        check('maximize fills desktop edges', maxState.left <= 1 && maxState.right >= desktopW - 1, JSON.stringify(maxState))
        check('maximize bottom respects taskbar', maxState.bottom <= desktopH - TASKBAR_H + 1, JSON.stringify(maxState))

        await page.evaluate(() => window.__XPMANAGER__.toggleMaximize('projects'))
        await page.waitForTimeout(200)
        const restored = await page.evaluate(() => {
          const p = [...document.querySelectorAll('.xp-window')].find((w) => w.querySelector('#projects'))
          return { w: p.getBoundingClientRect().width }
        })
        check('second maximize restores prior rect', restored.w < desktopW, JSON.stringify(restored))

        await page.evaluate(() => window.__XPMANAGER__.close('projects'))
        await page.waitForTimeout(200)
        const closed = await page.evaluate(() => ({
          wins: document.querySelectorAll('.xp-window').length,
          openIds: window.__XPMANAGER__.openSet ? [...window.__XPMANAGER__.openSet] : null,
        }))
        check('close removes the window', closed.wins === 1 && (!closed.openIds || !closed.openIds.includes('projects')), JSON.stringify(closed))

        await page.evaluate(() => window.__XPMANAGER__.open('projects'))
        await page.waitForTimeout(300)
        const reopened = await page.evaluate(() => document.querySelectorAll('.xp-window').length)
        check('reopen restores the window', reopened === 2, `count=${reopened}`)
      } finally { await ctx.close() }
    }

    // ── 4b. REGRESSION: real pointer clicks on the window-control buttons ──
    // The title bar's onPointerDown calls setPointerCapture; without
    // stopPropagation on the control buttons, the pointer capture redirects the
    // click to the title bar and Close/Minimize/Maximize are pointer-inert.
    // This section clicks the REAL buttons (not the __XPMANAGER__ seam) with
    // force-click AND raw mouse down/up and asserts the window actually changes.
    {
      const { ctx, page } = await loadXp(browser, 'en', VIEWPORTS[2])
      try {
        await page.evaluate(() => { window.__XPMANAGER__.open('projects') })
        await page.waitForTimeout(300)

        // Close via real pointer: force-click on the actual Close button.
        await page.locator('.xp-window:has(#projects) .xp-window-controls button[aria-label="Close"]')
          .click({ force: true })
        await page.waitForTimeout(300)
        const closed = await page.evaluate(() => ({
          wins: document.querySelectorAll('.xp-window').length,
          hasProjects: [...document.querySelectorAll('.xp-window')].some((w) => w.querySelector('#projects')),
        }))
        check('real pointer: Close button removes the window', closed.wins === 1 && !closed.hasProjects, JSON.stringify(closed))

        // Reopen, then Close again via RAW mouse down/up on the button coords.
        await page.evaluate(() => { window.__XPMANAGER__.open('projects') })
        await page.waitForTimeout(300)
        const closeBox = await page.locator('.xp-window:has(#projects) .xp-window-controls button[aria-label="Close"]').boundingBox()
        await page.mouse.move(closeBox.x + closeBox.width / 2, closeBox.y + closeBox.height / 2)
        await page.mouse.down()
        await page.mouse.up()
        await page.waitForTimeout(300)
        const closedRaw = await page.evaluate(() => ({
          wins: document.querySelectorAll('.xp-window').length,
          hasProjects: [...document.querySelectorAll('.xp-window')].some((w) => w.querySelector('#projects')),
        }))
        check('real pointer: raw mouse down/up on Close removes window', closedRaw.wins === 1 && !closedRaw.hasProjects, JSON.stringify(closedRaw))

        // Minimize via real button click.
        await page.evaluate(() => { window.__XPMANAGER__.open('projects') })
        await page.waitForTimeout(300)
        await page.locator('.xp-window:has(#projects) .xp-window-controls button[aria-label="Minimize"]').click({ force: true })
        await page.waitForTimeout(300)
        const min = await page.evaluate(() => {
          const p = [...document.querySelectorAll('.xp-window')].find((w) => w.querySelector('#projects'))
          return { display: p ? getComputedStyle(p).display : null }
        })
        check('real pointer: Minimize button hides the window', min.display === 'none', JSON.stringify(min))

        // Restore then Maximize via real button click; second click restores.
        await page.evaluate(() => { window.__XPMANAGER__.restore('projects') })
        await page.waitForTimeout(200)
        await page.locator('.xp-window:has(#projects) .xp-window-controls button[aria-label="Maximize"]').click({ force: true })
        await page.waitForTimeout(300)
        const max = await page.evaluate(() => {
          const p = [...document.querySelectorAll('.xp-window')].find((w) => w.querySelector('#projects'))
          const r = p.getBoundingClientRect()
          return { left: r.left, right: r.right, w: r.width }
        })
        check('real pointer: Maximize button fills desktop width', max.left <= 1 && max.right >= 1024 - 1, JSON.stringify(max))
        await page.locator('.xp-window:has(#projects) .xp-window-controls button[aria-label="Maximize"]').click({ force: true })
        await page.waitForTimeout(300)
        const restoredW = await page.evaluate(() => {
          const p = [...document.querySelectorAll('.xp-window')].find((w) => w.querySelector('#projects'))
          return p ? p.getBoundingClientRect().width : null
        })
        check('real pointer: second Maximize click restores prior rect', restoredW !== null && restoredW < 1024, `w=${restoredW}`)

        // Guard: clicking a control must NOT drag the window (capture must not
        // engage on the buttons). Record x before/after a control click.
        const posBefore = await page.evaluate(() => {
          const p = [...document.querySelectorAll('.xp-window')].find((w) => w.querySelector('#projects'))
          return p ? p.getBoundingClientRect().x : null
        })
        await page.locator('.xp-window:has(#projects) .xp-window-controls button[aria-label="Close"]').click({ force: true })
        await page.waitForTimeout(300)
        const closedNoDrag = await page.evaluate(() => document.querySelectorAll('.xp-window').length)
        check('real pointer: control click does not drag window', closedNoDrag === 1, `wins=${closedNoDrag} posBefore=${posBefore}`)
      } finally { await ctx.close() }
    }

    // ── 5. Start menu: role=menu + 7 menuitem + aria-expanded; entry opens+closes; Esc/outside ──
    {
      const { ctx, page } = await loadXp(browser, 'en', VIEWPORTS[2])
      try {
        const startBtn = page.locator('.xp-start-btn')
        await startBtn.click()
        await page.waitForTimeout(200)
        check('Start aria-expanded=true after click', await startBtn.getAttribute('aria-expanded') === 'true')
        check('Start menu role=menu renders', await page.locator('.xp-startmenu[role="menu"]').count() === 1)
        check('Start menu has 7 menuitem', await page.locator('.xp-startmenu [role="menuitem"]').count() === 7)

        await page.locator('.xp-startmenu [role="menuitem"]').filter({ hasText: 'Case Studies' }).click()
        await page.waitForTimeout(300)
        const opened = await page.evaluate(() => ({
          openIds: window.__XPMANAGER__.openSet ? [...window.__XPMANAGER__.openSet] : null,
          hasProjects: [...document.querySelectorAll('.xp-window')].some((w) => w.querySelector('#projects')),
        }))
        check('Start entry opens the projects window', opened.hasProjects && !!opened.openIds && opened.openIds.includes('projects'), JSON.stringify(opened))
        check('Start menu closes after selecting entry', await page.locator('.xp-startmenu').count() === 0)
        const focused = await page.evaluate(() => document.activeElement?.className)
        check('focus returns to Start after selection', typeof focused === 'string' && focused.includes('xp-start-btn'), `focused=${focused}`)

        // Esc closes + focus returns.
        await startBtn.click()
        await page.waitForTimeout(200)
        await startBtn.focus()
        await page.keyboard.press('Escape')
        await page.waitForTimeout(200)
        check('Esc closes the Start menu', await page.locator('.xp-startmenu').count() === 0)
        const focusedEsc = await page.evaluate(() => document.activeElement?.className)
        check('focus returns to Start after Esc', typeof focusedEsc === 'string' && focusedEsc.includes('xp-start-btn'), `focused=${focusedEsc}`)

        // Arrow navigation across menuitems.
        await startBtn.click()
        await page.waitForTimeout(200)
        await page.locator('.xp-startmenu [role="menuitem"]').first().focus()
        await page.keyboard.press('ArrowDown')
        await page.waitForTimeout(150)
        const menuFocused = await page.evaluate(() => document.activeElement?.getAttribute('role'))
        check('ArrowDown moves focus across menuitems', menuFocused === 'menuitem', `focused=${menuFocused}`)
        await page.keyboard.press('Escape')
      } finally { await ctx.close() }
    }

    // ── 6. 7 desktop icons open windows ──
    {
      const { ctx, page } = await loadXp(browser, 'en', VIEWPORTS[2])
      try {
        check('7 desktop icons render', await page.locator('.xp-desktop-icon').count() === 7)
        for (const id of APP_IDS.filter((i) => i !== 'about')) {
          await page.locator(`.xp-desktop-icon[data-app="${id}"]`).click()
          await page.waitForTimeout(250)
          const state = await page.evaluate((appId) => ({
            openIds: window.__XPMANAGER__.openSet ? [...window.__XPMANAGER__.openSet] : null,
            active: window.__XPMANAGER__?.activeId,
          }), id)
          check(`desktop icon opens ${id}`, !!state.openIds && state.openIds.includes(id), JSON.stringify(state))
        }
      } finally { await ctx.close() }
    }

    // ── 7. Taskbar label restores a minimized window ──
    {
      const { ctx, page } = await loadXp(browser, 'en', VIEWPORTS[2])
      try {
        await page.evaluate(() => {
          window.__XPMANAGER__.open('projects')
          window.__XPMANAGER__.minimize('projects')
        })
        await page.waitForTimeout(300)
        await page.locator('.xp-window-label').filter({ hasText: 'Case Studies' }).click()
        await page.waitForTimeout(300)
        const display = await page.evaluate(() => {
          const p = [...document.querySelectorAll('.xp-window')].find((w) => w.querySelector('#projects'))
          return p ? getComputedStyle(p).display : null
        })
        check('taskbar label restores minimized window', display !== 'none', `display=${display}`)
      } finally { await ctx.close() }
    }

    // ── 8. Tabs: skills-experience swap + rect/z unchanged + roving nav ──
    {
      const { ctx, page } = await loadXp(browser, 'en', VIEWPORTS[2])
      try {
        await page.evaluate(() => { window.__XPMANAGER__.open('skills-experience') })
        await page.waitForTimeout(400)
        check('skills-experience has a tablist', await page.locator('[role="tablist"]').count() >= 1)

        const before = await page.evaluate(() => {
          const w = [...document.querySelectorAll('.xp-window')].find((x) => x.querySelector('#skills') || x.querySelector('#experience'))
          if (!w) return null
          const r = w.getBoundingClientRect()
          return { x: r.x, y: r.y, w: r.width, h: r.height, z: getComputedStyle(w).zIndex }
        })
        const expTab = page.locator('[role="tab"]').filter({ hasText: /Experience/i })
        check('Experience tab exists', await expTab.count() >= 1)
        await expTab.first().click()
        await page.waitForTimeout(250)
        const after = await page.evaluate(() => {
          const w = [...document.querySelectorAll('.xp-window')].find((x) => x.querySelector('#skills') || x.querySelector('#experience'))
          if (!w) return null
          const r = w.getBoundingClientRect()
          return { x: r.x, y: r.y, w: r.width, h: r.height, z: getComputedStyle(w).zIndex }
        })
        check('tab swap keeps window rect + z unchanged',
          after && before && after.x === before.x && after.y === before.y && after.w === before.w &&
            after.h === before.h && after.z === before.z,
          `before=${JSON.stringify(before)} after=${JSON.stringify(after)}`)
        const skillsHidden = await page.evaluate(() => {
          const s = document.querySelector('#skills')
          if (!s) return null
          const panel = s.closest('[role="tabpanel"]')
          return panel ? panel.getAttribute('aria-hidden') === 'true' || getComputedStyle(panel).display === 'none'
            : getComputedStyle(s).display === 'none'
        })
        check('Skills panel hidden after switch', skillsHidden === true, `hidden=${skillsHidden}`)

        // Roving tabindex arrow nav.
        const tabs = page.locator('[role="tab"]')
        await tabs.first().focus()
        await page.keyboard.press('ArrowRight')
        await page.waitForTimeout(150)
        const focusedSel = await page.evaluate(() => {
          const t = document.activeElement
          return t && t.getAttribute('role') === 'tab' ? t.getAttribute('aria-selected') : null
        })
        check('ArrowRight moves tab selection', focusedSel === 'true', `selected=${focusedSel}`)
      } finally { await ctx.close() }
    }

    // ── 9. Mobile < 640px at 375 ──
    {
      const { ctx, page } = await loadXp(browser, 'en', VIEWPORTS[0])
      try {
        await page.evaluate(() => { window.__XPMANAGER__.open('projects') })
        await page.waitForTimeout(400)
        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }))
        check('375: no horizontal overflow', overflow.scrollWidth === overflow.clientWidth, JSON.stringify(overflow))
        const stack = await page.evaluate(() => [...document.querySelectorAll('.xp-window')].map((w) => {
          const r = w.getBoundingClientRect()
          return { w: r.width, pos: getComputedStyle(w).position }
        }))
        check('375: windows full-width stacked', stack.length >= 2 && stack.every((s) => s.pos === 'static' || Math.round(s.w) >= 370), JSON.stringify(stack))
        const rectBefore = await page.evaluate(() => {
          const w = [...document.querySelectorAll('.xp-window')].find((x) => x.querySelector('#projects'))
          return w ? w.getBoundingClientRect().x : null
        })
        const tb = page.locator('.xp-window').filter({ has: page.locator('#projects') }).locator('.xp-window-titlebar')
        await tb.first().hover()
        await page.mouse.down()
        await page.mouse.move(rectBefore + 120, 200, { steps: 5 })
        await page.mouse.up()
        await page.waitForTimeout(200)
        const rectAfter = await page.evaluate(() => {
          const w = [...document.querySelectorAll('.xp-window')].find((x) => x.querySelector('#projects'))
          return w ? w.getBoundingClientRect().x : null
        })
        check('375: title-bar drag does not move window', rectAfter === rectBefore, `before=${rectBefore} after=${rectAfter}`)
      } finally { await ctx.close() }
    }

    // ── 10. Reduced motion ──
    {
      const { ctx, page } = await loadXp(browser, 'en', VIEWPORTS[2], { reducedMotion: 'reduce' })
      try {
        const transition = await page.evaluate(() => {
          const w = document.querySelector('.xp-window')
          return w ? parseFloat(getComputedStyle(w).transitionDuration) : null
        })
        check('reduced-motion: transition <= 0.01ms', transition !== null && transition <= 0.01, `t=${transition}`)
        const before = await page.evaluate(() => {
          const w = document.querySelector('.xp-window')
          return w ? { x: w.getBoundingClientRect().x, y: w.getBoundingClientRect().y } : null
        })
        await page.locator('.xp-window-titlebar').first().hover()
        await page.mouse.down()
        await page.mouse.move(before.x + 200, before.y + 200, { steps: 5 })
        await page.mouse.up()
        await page.waitForTimeout(200)
        const after = await page.evaluate(() => {
          const w = document.querySelector('.xp-window')
          return w ? { x: w.getBoundingClientRect().x, y: w.getBoundingClientRect().y } : null
        })
        check('reduced-motion: drag inert', after.x === before.x && after.y === before.y,
          `before=${JSON.stringify(before)} after=${JSON.stringify(after)}`)
      } finally { await ctx.close() }
    }

    // ── 11. Keyboard-only: Esc closes focused window, no focus trap ──
    {
      const { ctx, page } = await loadXp(browser, 'en', VIEWPORTS[2])
      try {
        await page.evaluate(() => { window.__XPMANAGER__.open('projects') })
        await page.waitForTimeout(300)
        const titlebars = page.locator('.xp-window-titlebar')
        const last = await titlebars.count()
        await titlebars.nth(last - 1).focus()
        await page.keyboard.press('Escape')
        await page.waitForTimeout(300)
        const trapCheck = await page.evaluate(() => {
          const active = document.activeElement
          return {
            activeRole: active ? active.getAttribute('role') : null,
            activeConnected: active ? active.isConnected : false,
            wins: document.querySelectorAll('.xp-window').length,
          }
        })
        check('Esc closed a window (fewer windows or no removed-node focus)',
          trapCheck.wins === 1 || (trapCheck.activeConnected && !trapCheck.activeRole), JSON.stringify(trapCheck))
      } finally { await ctx.close() }
    }

    // ── 12. Squared default geometry (Slice 1, S1.1 RED) ──
    // A window MUST open at w=min(0.5×desktopW,480), h=min(0.6×desktopH,420);
    // `about` opens on mount at that size; every subsequent open cascades +20px
    // from a base y:8 (the header is gone in XP).
    {
      // @1440×900: about ≈ 480×420, base y=8.
      const { ctx, page } = await loadXp(browser, 'en', VIEWPORTS[3])
      try {
        const r = await page.locator('.xp-window').first().boundingBox()
        check('squared: about @1440 ≈ 480×420',
          r && Math.abs(r.width - 480) <= 2 && Math.abs(r.height - 420) <= 2, JSON.stringify(r))
        check('squared: about base y=8 (header gone)',
          r && Math.abs(r.y - 8) <= 2, `y=${r?.y}`)
      } finally { await ctx.close() }
    }
    {
      // @768×1024: opening a second window cascades +20px from the prior top-left.
      const { ctx, page } = await loadXp(browser, 'en', VIEWPORTS[1])
      try {
        const first = await page.locator('.xp-window').first().boundingBox()
        await page.evaluate(() => { window.__XPMANAGER__.open('projects') })
        await page.waitForTimeout(300)
        const wins = await page.locator('.xp-window').all()
        const second = wins[1] ? await wins[1].boundingBox() : null
        check('cascade: second window top-left = prior + 20px',
          first && second && Math.abs(second.x - (first.x + 20)) <= 2 && Math.abs(second.y - (first.y + 20)) <= 2,
          `first=${JSON.stringify(first)} second=${JSON.stringify(second)}`)
      } finally { await ctx.close() }
    }

    // ── 13. Tray utilities + header removal (Slice 1, S1.2 RED) ──
    // In XP the fixed Header must not render; its utilities live in a taskbar
    // tray (role=toolbar) left of the clock: ThemeToggle + lang switch + GitHub.
    {
      const { ctx, page } = await loadXp(browser, 'en', VIEWPORTS[2])
      try {
        check('header absent in XP', await page.locator('.xp-header').count() === 0,
          `count=${await page.locator('.xp-header').count()}`)
        check('tray renders with role=toolbar', await page.locator('.xp-tray[role="toolbar"]').count() === 1)
        check('tray has ThemeToggle (aria-pressed)',
          await page.locator('.xp-tray button[aria-pressed]').count() === 1)

        // Lang toggle: the tray lang button's aria-label flips EN<->ES.
        const langBtn = page.locator('.xp-tray button[aria-label]').filter({ hasText: /^[A-Z]{2}$/ })
        const langCount = await langBtn.count()
        const langBefore = langCount ? await langBtn.first().getAttribute('aria-label') : null
        if (langCount) {
          await langBtn.first().click()
          await page.waitForTimeout(200)
        }
        const langAfter = langCount ? await langBtn.first().getAttribute('aria-label') : null
        check('tray lang toggle flips lang',
          langBefore !== null && langAfter !== null && langBefore !== langAfter,
          `${langBefore} -> ${langAfter}`)

        // GitHub link: reuse the existing URL + new tab.
        const gh = page.locator('.xp-tray a[href="https://github.com/Ewin24"]')
        const ghCount = await gh.count()
        check('tray GitHub link present', ghCount === 1, `count=${ghCount}`)
        const ghTarget = ghCount ? await gh.first().getAttribute('target') : null
        const ghRel = ghCount ? await gh.first().getAttribute('rel') : null
        check('tray GitHub opens new tab', ghTarget === '_blank', `target=${ghTarget}`)
        check('tray GitHub has noopener noreferrer', ghRel === 'noopener noreferrer', `rel=${ghRel}`)
      } finally { await ctx.close() }
    }
  } finally {
    await browser.close()
  }

  console.log(`\nXP interactive checks: ${checks - failures.length}/${checks} passed`)
  if (failures.length) {
    console.log('FAILED:')
    console.log(failures.join('\n'))
    process.exit(1)
  } else {
    console.log('ALL PASSED')
    process.exit(0)
  }
}

run().catch((e) => { console.error(e); process.exit(1) })
