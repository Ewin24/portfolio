import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { caseStudies } from './src/content/case-studies'
import { workExperience } from './src/content/experience'
import { education } from './src/content/education'
import { blogPosts } from './src/blog/content/posts'
import { testimonials } from './src/content/testimonials'

/**
 * Pre-render plugin: generates comprehensive static HTML from the
 * project content (case studies, blog, experience, education, etc.)
 * and injects it into the <noscript> block at build time.
 *
 * This closes the CSR-only gap for non-JS crawlers (and any
 * crawlers that inspect the HTML source before executing JS).
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function generatePreloadedContent(): string {
  const lines: string[] = []

  // Hero
  lines.push(
    `<h1>Edwin Trigos — Software Architect &amp; Full Stack Developer</h1>`,
  )
  lines.push(
    `<p>Software Architect and Full Stack Developer with 5+ years building production systems in .NET, Clean Architecture, fintech, and cloud infrastructure. Based in Bucaramanga, Colombia. Remote-ready.</p>`,
  )

  // About
  lines.push(`<h2>About</h2>`)
  lines.push(
    `<p>I design and build production-grade systems end-to-end: from clean architecture foundations to cloud deployment. My current focus is on financial systems (loan origination, credit bureaus, risk management) and B2B SaaS platforms. I write detailed case studies documenting the real architecture decisions, metrics, and tradeoffs from systems I've shipped.</p>`,
  )

  // Case Studies — full STAR format
  lines.push(`<h2>Production Case Studies</h2>`)
  caseStudies.forEach((cs) => {
    lines.push(
      `<article>`,
      `<h3>${escapeHtml(cs.title)}</h3>`,
      `<p><strong>Company</strong>: ${escapeHtml(cs.company)}. <strong>Period</strong>: ${escapeHtml(cs.period)}. <strong>Stack</strong>: ${cs.stack.map(escapeHtml).join(', ')}.</p>`,
      `<p><strong>Problem</strong>: ${escapeHtml(cs.problem)}</p>`,
      `<p><strong>Solution</strong>: ${escapeHtml(cs.solution)}</p>`,
      `<p><strong>Impact</strong>: ${escapeHtml(cs.impact)}</p>`,
      `</article>`,
    )
  })

  // Blog Articles — full excerpts
  lines.push(`<h2>Technical Blog</h2>`)
  blogPosts.forEach((post) => {
    lines.push(
      `<article>`,
      `<h3>${escapeHtml(post.title)}</h3>`,
      `<p><strong>Published</strong>: ${escapeHtml(post.date)}.${post.category ? ` <strong>Category</strong>: ${escapeHtml(post.category)}.` : ''} <strong>Tags</strong>: ${post.tags.map(escapeHtml).join(', ')}.</p>`,
      `<p>${escapeHtml(post.excerpt)}</p>`,
      `</article>`,
    )
  })

  // Skills (compute unique technologies)
  const allTechs = new Set<string>([
    ...workExperience.flatMap((j) => j.stack),
    ...caseStudies.flatMap((p) => p.stack),
  ])
  lines.push(`<h2>Technologies (${allTechs.size} production-grade)</h2>`)
  lines.push(`<p>${Array.from(allTechs).map(escapeHtml).join(' · ')}</p>`)

  // Work Experience
  lines.push(`<h2>Work Experience</h2>`)
  workExperience.forEach((job) => {
    lines.push(
      `<article>`,
      `<h3>${escapeHtml(job.role)} — ${escapeHtml(job.company)}</h3>`,
      `<p><strong>Period</strong>: ${escapeHtml(job.period)}. <strong>Location</strong>: ${escapeHtml(job.location)}.${job.current ? ' <strong>Current</strong>.' : ''}</p>`,
      `<ul>`,
      ...job.achievements.map((a) => `<li>${escapeHtml(a)}</li>`),
      `</ul>`,
      `<p><strong>Stack</strong>: ${job.stack.map(escapeHtml).join(', ')}</p>`,
      `</article>`,
    )
  })

  // Education
  lines.push(`<h2>Education</h2>`)
  education.forEach((ed) => {
    lines.push(
      `<article>`,
      `<h3>${escapeHtml(ed.degree)} — ${escapeHtml(ed.institution)}</h3>`,
      `<p><strong>Period</strong>: ${escapeHtml(ed.period)}</p>`,
      ed.description !== undefined ? `<p>${escapeHtml(ed.description)}</p>` : '',
      `</article>`,
    )
  })

  // Testimonials
  lines.push(`<h2>Testimonials</h2>`)
  testimonials.forEach((t) => {
    lines.push(
      `<article>`,
      `<blockquote>${escapeHtml(t.text)}</blockquote>`,
      `<p>— ${escapeHtml(t.name)}, ${escapeHtml(t.role)} at ${escapeHtml(t.company)}</p>`,
      `</article>`,
    )
  })

  // Contact
  lines.push(`<h2>Contact</h2>`)
  lines.push(
    `<ul>`,
    `<li>Email: <a href="mailto:edwintrigos24@gmail.com">edwintrigos24@gmail.com</a></li>`,
    `<li>GitHub: <a href="https://github.com/Ewin24">github.com/Ewin24</a></li>`,
    `<li>LinkedIn: <a href="https://www.linkedin.com/in/edwintrigosguevara">linkedin.com/in/edwintrigosguevara</a></li>`,
    `<li>Location: Bucaramanga, Colombia (Remote)</li>`,
    `</ul>`,
  )

  lines.push(
    `<p><em>To see the full interactive portfolio, please enable JavaScript. Visit <a href="https://ewin24.github.io/portfolio/">ewin24.github.io/portfolio/</a>.</em></p>`,
  )

  return lines.join('\n')
}

/**
 * Vite plugin: injects the pre-rendered content into the <noscript> block.
 * Replaces the entire <noscript>...</noscript> contents in index.html.
 */
function preloadStaticContent(): import('vite').Plugin {
  return {
    name: 'preload-static-content',
    transformIndexHtml(html) {
      const content = generatePreloadedContent()
      return html.replace(
        /<noscript>[\s\S]*?<\/noscript>/,
        `<noscript>\n<div style="max-width:900px;margin:0 auto;padding:2rem;font-family:system-ui,sans-serif;line-height:1.6;color:#1a1a1a;">\n${content}\n</div>\n</noscript>`,
      )
    },
  }
}

export default defineConfig({
  base: '/portfolio/',
  plugins: [react(), tailwindcss(), preloadStaticContent()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
