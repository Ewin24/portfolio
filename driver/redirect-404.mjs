// Runs public/404.html's redirect script against a table of hosts and paths (no browser needed).
// GitHub Pages serves the app under /portfolio/, Vercel at /; every unknown path must land on the app.
import { readFileSync } from 'node:fs'
const src = readFileSync(new URL('../public/404.html', import.meta.url), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1]
const cases = [
  ['ewin24.github.io', '/portfolio/missing', '#blog/article/x', 'https://ewin24.github.io/portfolio/#blog/article/x'],
  ['ewin24.github.io', '/portfolio/', '', null],
  ['portfolio.vercel.app', '/missing', '#x', 'https://portfolio.vercel.app/#x'],
  ['portfolio.vercel.app', '/portfolio/', '#blog/article/x', 'https://portfolio.vercel.app/#blog/article/x'],
  ['portfolio.pages.dev', '/portfolio/', '#blog/article/x', 'https://portfolio.pages.dev/#blog/article/x'],
  ['portfolio.vercel.app', '/portfolio-old', '', 'https://portfolio.vercel.app/'],
  ['portfolio.vercel.app', '/', '', null],
]
let fail = 0
for (const [hostname, pathname, hash, want] of cases) {
  let got = null
  const window = { location: { hostname, pathname, hash, origin: `https://${hostname}`, replace: (u) => { got = u } } }
  new Function('window', src)(window)
  const ok = got === want
  if (!ok) fail++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${hostname}${pathname}${hash} -> ${got}`)
}
process.exit(fail ? 1 : 0)
