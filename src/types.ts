export interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  location: string | null
  blog: string
  company: string | null
  twitter_username: string | null
  created_at: string
  html_url: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
  fork: boolean
  size: number
}

export interface GitHubLanguages {
  [language: string]: number
}

export type Language = 'es' | 'en'

export interface Section {
  id: string
  labelEs: string
  labelEn: string
}
