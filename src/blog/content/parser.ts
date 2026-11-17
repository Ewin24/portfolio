import { micromark } from 'micromark'
import { gfmTable, gfmTableHtml } from 'micromark-extension-gfm-table'

/**
 * Parse markdown to safe HTML using micromark (+ GFM tables).
 * micromark is secure by default — no XSS risk.
 * Post-processing adds what micromark cannot emit: a `data-lang` on fenced
 * code blocks (the CSS label), a scroll box around tables, figures with a
 * caption for standalone images (a mount node instead of the image when the
 * path is `figure/<id>`), and real headings for the posts'
 * `**Section**` paragraphs (numbered ones become h3).
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
    // A paragraph holding only an image becomes a figure; the markdown title is
    // the caption: ![alt](blog/figures/x.svg "Caption"). Site-relative paths are
    // resolved against the deploy base, which is / or /portfolio/ by host.
    .replace(
      /<p><img src="([^"]*)" alt="([^"]*)"(?: title="([^"]*)")? \/><\/p>/g,
      (_, src: string, alt: string, title?: string) => {
        const caption = title ? `<figcaption>${title}</figcaption>` : ''
        // ![alt](figure/<id> "Caption") is an interactive figure: the article
        // mounts it into this node (src/blog/figures). The alt rides along as
        // the text shown when the figure cannot draw.
        const figureId = /^figure\/([\w-]+)$/.exec(src)?.[1]
        if (figureId) {
          return `<figure data-figure="${figureId}"><div class="figure-mount" data-alt="${alt}"></div>${caption}</figure>`
        }
        const url = /^(?:[a-z]+:)?\/\//i.test(src) ? src : import.meta.env.BASE_URL + src.replace(/^\//, '')
        return `<figure><img src="${url}" alt="${alt}" loading="lazy" />${caption}</figure>`
      },
    )
    .replace(/<p><strong>([^<]*)<\/strong><\/p>/g, (_, text: string) => {
      const tag = /^\d+\./.test(text) ? 'h3' : 'h2'
      return `<${tag}>${text}</${tag}>`
    })
}
