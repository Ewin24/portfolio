import type { BlogTab } from '../types'

/**
 * The blog's active tab, for the session. The list and an open article are two
 * provider instances (App mounts the blog twice, one per view), so provider
 * state alone would forget the tab on the way to an article and back. The
 * providers keep it in their category filter; this is only what outlives them.
 */
let tab: BlogTab = 'all'
const listeners = new Set<(tab: BlogTab) => void>()

export const rememberedTab = () => tab

export function rememberTab(next: BlogTab): void {
  tab = next
}

/** Selects a tab from outside the blog; the mounted blog follows. */
export function selectBlogTab(next: BlogTab): void {
  tab = next
  for (const listener of listeners) listener(next)
}

export function onBlogTab(listener: (tab: BlogTab) => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
