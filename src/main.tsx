import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './theme/ThemeContext'
import './index.css'
import App from './App.tsx'

// Older sitemaps, llms files and JSON-LD published blog links as `#/blog/...`;
// every router here reads `#blog/...`. Normalize on load and on every hash change, so indexed
// links still open the article. Registered before React mounts, so it runs before the routers.
const normalizeHash = () => {
  if (location.hash.startsWith('#/')) history.replaceState(null, '', `#${location.hash.slice(2)}`)
}
normalizeHash()
window.addEventListener('hashchange', normalizeHash)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
  </StrictMode>,
)
