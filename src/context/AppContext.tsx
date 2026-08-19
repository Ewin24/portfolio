import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { GitHubUser, GitHubRepo, Language } from '../types'
import { getUser, getRepos } from '../services/github'

/**
 * GitHub is enrichment, never a gate. Every consumer renders from static
 * fallbacks first (`user?.name || 'Edwin Trigos'`, `repos` starting as `[]`),
 * so the fetch has no loading or error state to expose: the page is already
 * complete when it starts, and stays complete if it never lands.
 */
interface AppContextType {
  user: GitHubUser | null
  repos: GitHubRepo[]
  lang: Language
  setLang: (lang: Language) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('portfolio-lang')
      if (saved === 'es' || saved === 'en') return saved
    } catch {
      // Private mode or blocked storage — fall through to the browser locale.
    }
    return navigator.language.startsWith('es') ? 'es' : 'en'
  })

  useEffect(() => {
    try {
      localStorage.setItem('portfolio-lang', lang)
    } catch {
      // Persistence is a nicety; the language still applies for this session.
    }
  }, [lang])

  useEffect(() => {
    async function fetchData() {
      try {
        const [userData, repoData] = await Promise.all([getUser(), getRepos()])
        setUser(userData)
        setRepos(repoData)
      } catch (err) {
        // Rate limits and offline visitors are GitHub's problem, not the
        // reader's. The avatar falls back to initials and the activity
        // widget hides itself; nothing else on the page notices.
        console.warn('GitHub data unavailable, rendering without it:', err)
      }
    }
    fetchData()
  }, [])

  return (
    <AppContext.Provider value={{ user, repos, lang, setLang }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
