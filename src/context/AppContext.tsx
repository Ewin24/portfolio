import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { GitHubUser, GitHubRepo, Language } from '../types'
import { getUser, getRepos } from '../services/github'

interface AppContextType {
  user: GitHubUser | null
  repos: GitHubRepo[]
  loading: boolean
  error: string | null
  lang: Language
  setLang: (lang: Language) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('portfolio-lang')
    if (saved === 'es' || saved === 'en') return saved
    return navigator.language.startsWith('es') ? 'es' : 'en'
  })

  useEffect(() => {
    localStorage.setItem('portfolio-lang', lang)
  }, [lang])

  useEffect(() => {
    async function fetchData() {
      try {
        const [userData, repoData] = await Promise.all([getUser(), getRepos()])
        setUser(userData)
        setRepos(repoData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <AppContext.Provider value={{ user, repos, loading, error, lang, setLang }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
