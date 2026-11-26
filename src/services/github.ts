import type { GitHubUser, GitHubRepo } from '../types'

const GITHUB_USERNAME = 'Ewin24'
const BASE_URL = 'https://api.github.com'

async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}

export async function getUser(): Promise<GitHubUser> {
  return fetchGitHub<GitHubUser>(`/users/${GITHUB_USERNAME}`)
}

export async function getRepos(): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = []
  let page = 1
  const perPage = 100

  while (true) {
    const repos = await fetchGitHub<GitHubRepo[]>(
      `/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${perPage}&page=${page}`
    )
    allRepos.push(...repos)
    if (repos.length < perPage) break
    page++
  }

  return allRepos.filter((r) => !r.fork)
}

/** How many repositories have each main language, most common first. */
export function getLanguageStats(repos: GitHubRepo[]): [string, number][] {
  const langMap = new Map<string, number>()

  for (const repo of repos) {
    if (repo.language) {
      langMap.set(repo.language, (langMap.get(repo.language) || 0) + 1)
    }
  }

  return [...langMap.entries()].sort((a, b) => b[1] - a[1])
}

/**
 * The repositories by last push, newest first. The profile repository (named
 * after the account) holds a README, not a project, and is left out.
 */
export function getRecentRepos(repos: GitHubRepo[]): GitHubRepo[] {
  return repos
    .filter((repo) => repo.name !== GITHUB_USERNAME)
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
}
