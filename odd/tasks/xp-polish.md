# xp-polish

Objective: make the Windows XP theme look closer to the real Luna desktop.
Branch: `feat/xp-polish`. Delivery: single PR (ask-on-risk). Runner: `npx tsc -b`, `npm run build`, `npm run test:xp`, `npm run test:newspaper`, `npm run test:routes`.

## Specs

- S1: "ya hiciste ajustes visuales sobre el modo de windows cp, la idea es que investigues de que forma podemos hacer que se vea mejor"
- S2: "si, y luego sigues con el resto" (answer to "¿Implemento 1, 2 y 4?": 1 desktop background, 2 window interior, 4 scrollbar; the rest is 3 colour icons and 5 minor chrome details)
- S3: "sigue con las mejoras visuales para xp, el blog, etc, usa plugins que te permitan animaciones y mejoras en la web"

## Tasks

- [x] T1 (S2, inline) Hill-and-sky wallpaper drawn with gradients; white window body with flat group-box cards, Luna tabs and headings sized against the window; Luna scrollbar. Commit b1b8d5e.
- [x] T2 (S2, inline) Seven original colour SVG icons (`src/components/xp/icons.tsx`) on the desktop, title bars, taskbar labels and Start menu; 3px window frame with a dark outer edge; Trebuchet MS title bar; heavier control glyphs. Commit b13f198.
- [x] T3 (S3, inline) Default window 60% x 70% of the desktop, capped at 760x560 (was 480x420). Changes design D2; driver expectation and resize grow threshold updated. Commit 6b4576d.
- [x] T4 (S3, inline) Window open animation with `motion` (already a dependency) and Start menu rise; full-page article in XP as a maximized window (Luna title bar, white pane, segmented green reading progress, console-style code blocks). Commit bac1ead.

## Log

- L1 (2026-11-11, user, verbatim): "ya hiciste ajustes visuales sobre el modo de windows cp, la idea es que investigues de que forma podemos hacer que se vea mejor"
- L2 (2026-11-11, user, verbatim): "si, y luego sigues con el resto"
- L3 Found while capturing at 1440x900: three windows scrolled horizontally at the default 480px width. Causes were viewport media queries applied inside a narrow window (case-study grid at three 126px columns, `.lead-track` spanning an implicit column, stack grid split in two, section-opening subtitle with `md:shrink-0`). Fixed in T1 with container queries; all eight window bodies now report scrollWidth == clientWidth.
- L4 Result: `test:xp` 100/100, `test:newspaper` 8/8 with 0 differing pixels, `test:routes` 6/6, `tsc -b` and `build` clean, lint unchanged at 15 pre-existing errors. `gentle-ai review assess` on the branch: medium, `under_budget`, no review due.
- L5 (2026-11-11, user, verbatim): "sigue con las mejoras visuales para xp, el blog, etc, usa plugins que te permitan animaciones y mejoras en la web"
- L6 Decisions for S3: no new dependency — `motion` was already installed and covers the animations. S3 came as the reply to the open question about the default window size, so it was read as approval (assumption; isolated in commit 6b4576d so it reverts alone). Closing a window stays instant: an exit animation would keep the closing title bar connected and break the close-focus safety net in `Window.tsx`. CSS keyframes were not used on windows because a z-order change re-inserts the node and replays them.
- L7 Result after T3-T4: `test:xp` 100/100, `test:newspaper` 8/8 with 0 differing pixels, `test:routes` 6/6, `test:disclosures` 14/14, `tsc -b` and `build` clean, lint unchanged at 15 pre-existing errors.
- L8 Not done: the newspaper blog was left as is (list, article and reading progress were already finished; any change there means re-cutting the pixel baselines). Taskbar stays at 40px (`TASKBAR_HEIGHT` drives the window clamp and the driver asserts it). No minimize animation, sounds or boot screen.
- L9 Review (lineage review-87dd74bd9d6e1648, readability + reliability): approved and acknowledged, no blockers. Follow-up commit applies three advisory findings: stale 2px comments after the 3px frame, the driver comment that explained the 150px threshold by vertical room only, and the paper tokens duplicated between `.xp-window-body` and `.blog-full` (now one shared rule). Not applied: the suggested animation-timing risk (the driver waits 600ms, the animation lasts 140ms) and the weaker resize threshold (a consequence of the larger default window).
