import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './theme/ThemeContext'
import './index.css'
import App from './App.tsx'

// Older sitemaps, llms files and JSON-LD published blog links as `#/blog/...`;
// every router here reads `#blog/...`. Normalize once so indexed links still open the article.
if (location.hash.startsWith('#/')) history.replaceState(null, '', `#${location.hash.slice(2)}`)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
  </StrictMode>,
)
