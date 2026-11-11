# xp-polish

Objective: make the Windows XP theme look closer to the real Luna desktop.
Branch: `feat/xp-polish`. Delivery: single PR (ask-on-risk). Runner: `npx tsc -b`, `npm run build`, `npm run test:xp`, `npm run test:newspaper`, `npm run test:routes`.

## Specs

- S1: "ya hiciste ajustes visuales sobre el modo de windows cp, la idea es que investigues de que forma podemos hacer que se vea mejor"
- S2: "si, y luego sigues con el resto" (answer to "¿Implemento 1, 2 y 4?": 1 desktop background, 2 window interior, 4 scrollbar; the rest is 3 colour icons and 5 minor chrome details)

## Tasks

- [x] T1 (S2, inline) Hill-and-sky wallpaper drawn with gradients; white window body with flat group-box cards, Luna tabs and headings sized against the window; Luna scrollbar. Commit b1b8d5e.
- [x] T2 (S2, inline) Seven original colour SVG icons (`src/components/xp/icons.tsx`) on the desktop, title bars, taskbar labels and Start menu; 3px window frame with a dark outer edge; Trebuchet MS title bar; heavier control glyphs. Commit b13f198.

## Log

- L1 (2026-11-11, user, verbatim): "ya hiciste ajustes visuales sobre el modo de windows cp, la idea es que investigues de que forma podemos hacer que se vea mejor"
- L2 (2026-11-11, user, verbatim): "si, y luego sigues con el resto"
- L3 Found while capturing at 1440x900: three windows scrolled horizontally at the default 480px width. Causes were viewport media queries applied inside a narrow window (case-study grid at three 126px columns, `.lead-track` spanning an implicit column, stack grid split in two, section-opening subtitle with `md:shrink-0`). Fixed in T1 with container queries; all eight window bodies now report scrollWidth == clientWidth.
- L4 Result: `test:xp` 100/100, `test:newspaper` 8/8 with 0 differing pixels, `test:routes` 6/6, `tsc -b` and `build` clean, lint unchanged at 15 pre-existing errors. `gentle-ai review assess` on the branch: medium, `under_budget`, no review due.
- L5 Not done: taskbar stays at 40px (the real one is 30px) because `TASKBAR_HEIGHT` drives the window clamp and the driver asserts it. Default window size stays 480x420 (design D2, asserted by the driver) — needs the owner's decision, see L6. No window animations, sounds or boot screen.
- L6 Needs the owner's decision: on a 1440x900 desktop the default window covers about 16% of the screen and every section needs scrolling. A larger default (for example 60% x 70% of the desktop) would change design D2 and its two driver checks.
