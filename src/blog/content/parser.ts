import { micromark } from 'micromark'

/**
 * Parse markdown to safe HTML using micromark.
 * micromark is secure by default — no XSS risk.
 * No `dangerouslySetInnerHTML` needed anywhere in the render path
 * (fixes bugs #5, #6).
 *
 * @param content - Markdown string
 * @returns Safe HTML string
 */
export function parseMarkdown(content: string): string {
  return micromark(content, { allowDangerousHtml: false })
}
