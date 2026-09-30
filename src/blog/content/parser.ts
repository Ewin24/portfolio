import { micromark } from 'micromark'
import { gfmTable, gfmTableHtml } from 'micromark-extension-gfm-table'

/**
 * Parse markdown to safe HTML using micromark (+ GFM tables).
 * micromark is secure by default — no XSS risk.
 * Post-processing adds what micromark cannot emit: a `data-lang` on fenced
 * code blocks (the CSS label), a scroll box around tables, and real headings
 * for the posts' `**Section**` paragraphs (numbered ones become h3).
 *
 * @param content - Markdown string
 * @returns Safe HTML string
 */
export function parseMarkdown(content: string): string {
  return micromark(content, {
    allowDangerousHtml: false,
    extensions: [gfmTable()],
    htmlExtensions: [gfmTableHtml()],
  })
    .replace(/<pre><code class="language-([\w#+-]+)"/g, '<pre data-lang="$1"><code class="language-$1"')
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<p><strong>([^<]*)<\/strong><\/p>/g, (_, text: string) => {
      const tag = /^\d+\./.test(text) ? 'h3' : 'h2'
      return `<${tag}>${text}</${tag}>`
    })
}
