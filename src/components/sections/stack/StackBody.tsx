import { useState } from 'react'
import type { ComponentType, CSSProperties } from 'react'
import type { LucideProps } from 'lucide-react'
import {
  Bot,
  Bug,
  ChevronRight,
  Cloud,
  CloudCog,
  Code,
  Database,
  ExternalLink,
  HardDrive,
  Layout,
  Package,
  ScanSearch,
  Smartphone,
  Terminal,
  TestTube,
  Zap,
} from 'lucide-react'
import { Figure } from '../../../blog/figures/Figure'
import { COPY, STACK, type Evidence, type StackEntry } from '../../../content/stack'
import { useTranslation } from '../../../hooks/useTranslation'
import type { TranslationKeys } from '../../../i18n/translations'
import { periodLabel } from '../../../lib/text'
import { FadeIn } from '../../ui/FadeIn'

/**
 * How each technology is drawn. What it is, where it belongs and where it
 * appears live in `src/content/stack.ts`; this is only its icon, its brand
 * colour (handed to `.tech-chip` as --tech, which picks the surface per theme)
 * and where its reference link goes.
 */
const LOOK: Record<string, { icon: ComponentType<LucideProps>; color: string; referenceUrl: string }> = {
  dotnet: { icon: Terminal, color: '#512BD4', referenceUrl: '#blog/article/arquitectura-limpa-sistema-originacion-credito' },
  php: { icon: Terminal, color: '#FF2D20', referenceUrl: '#projects' },
  sqlserver: { icon: Database, color: '#CC2927', referenceUrl: '#blog/article/dapper-stored-procedures-en-lugar-de-ef-core' },
  // react.dev's dark brand blue. The classic #61DAFB is tuned for dark
  // backgrounds and only reaches 1.55:1 against paper — invisible here.
  react: { icon: Code, color: '#087EA4', referenceUrl: '#projects' },
  typescript: { icon: Zap, color: '#3178C6', referenceUrl: '#projects' },
  // Darkened from #FF9900 (2.04:1 against paper) to clear the 3:1 floor
  aws: { icon: Cloud, color: '#B35B00', referenceUrl: '#projects' },
  flutter: { icon: Smartphone, color: '#02569B', referenceUrl: '#projects' },
  cleanarch: { icon: Layout, color: '#6C5CE7', referenceUrl: '#blog/article/orquestacion-cross-system-sin-acoplamiento' },
  // #2496ED sat exactly on the 3:1 line; this keeps a usable margin
  docker: { icon: Package, color: '#1D7DC7', referenceUrl: '#projects' },
  ai: { icon: Bot, color: '#5B3FA8', referenceUrl: '#projects' },
  cfworkers: { icon: CloudCog, color: '#A85400', referenceUrl: '#projects' },
  indexeddb: { icon: HardDrive, color: '#7A3E9D', referenceUrl: '#projects' },
  playwright: { icon: Bug, color: '#1F7A24', referenceUrl: '#projects' },
  vitest: { icon: TestTube, color: '#8A6B00', referenceUrl: '#projects' },
  geo: { icon: ScanSearch, color: '#0F6E6E', referenceUrl: '#projects' },
}

const KINDS = ['cases', 'roles', 'posts'] as const

/** Posts listed before the rest folds into a disclosure. */
const POSTS_SHOWN = 4

/**
 * "3 casos · 2 roles · 5 artículos"; a source with nothing is left out, never
 * shown as zero, and a technology with no evidence renders nothing at all.
 * Each count is its own span so a narrow line breaks between counts.
 */
function Counts({ evidence, ...rest }: { evidence: Evidence; className?: string } & Record<`data-${string}`, boolean>) {
  const { t } = useTranslation()
  const parts = KINDS.filter((kind) => evidence[kind].length > 0)
    .map((kind) => `${evidence[kind].length} ${t(`stack.count.${kind}.${evidence[kind].length === 1 ? 'one' : 'other'}`)}`)
  if (parts.length === 0) return null
  return (
    <span {...rest}>
      {parts.map((part, i) => (
        <span key={part} className="stack-count">{i > 0 && '· '}{part}{i < parts.length - 1 && ' '}</span>
      ))}
    </span>
  )
}

function Chip({ tech, size }: { tech: StackEntry; size: number }) {
  const { icon: Icon, color } = LOOK[tech.id]
  return (
    <span className="tech-chip stack-chip" style={{ '--tech': color } as CSSProperties}>
      <Icon size={size} strokeWidth={1.5} style={{ color }} aria-hidden="true" />
    </span>
  )
}

function Status({ tech }: { tech: StackEntry }) {
  const { t, lang } = useTranslation()
  if (!tech.status) return null
  return (
    <span className="stack-status" data-stack-status={tech.status}>
      {tech.status === 'active' ? COPY.active[lang] : t(`stack.status.${tech.status}`)}
    </span>
  )
}

/** Where the selected technology appears, then its milestones and its reference link. */
function Detail({ tech }: { tech: StackEntry }) {
  const { t, lang } = useTranslation()
  const key = (suffix: string) => `skills.${tech.id}.${suffix}` as keyof TranslationKeys
  // The title is its own span: the whole row is the link, only the title is underlined.
  const postLink = (post: StackEntry['posts'][number]) => (
    <li key={post.slug}>
      <a href={`#blog/article/${post.slug}`}><span>{lang === 'es' ? post.title : post.titleEn}</span></a>
    </li>
  )
  const more = tech.posts.slice(POSTS_SHOWN)

  return (
    <div data-stack-detail={tech.id}>
      <div className="stack-detail-head">
        <Chip tech={tech} size={28} />
        <div>
          <h3>{tech.name}</h3>
          <Status tech={tech} />
        </div>
      </div>

      <h4 className="stack-label">{t('stack.evidence')}</h4>
      {KINDS.every((kind) => tech[kind].length === 0) && !tech.site && <p className="stack-none">{t('stack.evidence.none')}</p>}

      {/* A file this site serves, under the app's base path. */}
      {tech.site && (
        <div className="stack-evidence" data-stack-evidence="site">
          <h5>{COPY.site[lang]}</h5>
          <ul>
            <li>
              <a href={`${import.meta.env.BASE_URL}${tech.site}`}><span>{tech.site}</span></a>
            </li>
          </ul>
        </div>
      )}

      {tech.cases.length > 0 && (
        <div className="stack-evidence" data-stack-evidence="cases">
          <h5>{t('stack.evidence.cases')} <span>{tech.cases.length}</span></h5>
          <ul>
            {tech.cases.map((study) => (
              <li key={study.id}>
                <a href={`#case-${study.id}`}><span>{lang === 'es' ? study.title : study.titleEn}</span></a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tech.roles.length > 0 && (
        <div className="stack-evidence" data-stack-evidence="roles">
          <h5>{t('stack.evidence.roles')} <span>{tech.roles.length}</span></h5>
          <ul>
            {tech.roles.map((role) => (
              <li key={role.id}>
                <a href="#experience">
                  <span>{lang === 'es' ? role.role : role.roleEn}</span>
                  <span className="stack-meta">
                    {role.company} · {periodLabel(role.period, lang)}
                    {role.current && ` · ${t('experience.stamp')}`}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tech.posts.length > 0 && (
        <div className="stack-evidence" data-stack-evidence="posts">
          <h5>{t('stack.evidence.posts')} <span>{tech.posts.length}</span></h5>
          <ul>{tech.posts.slice(0, POSTS_SHOWN).map(postLink)}</ul>
          {more.length > 0 && (
            <details>
              <summary className="disclosure">{t('stack.evidence.more').replace('{n}', String(more.length))}</summary>
              <ul>{more.map(postLink)}</ul>
            </details>
          )}
        </div>
      )}

      <h4 className="stack-label">{t('skills.milestones')}</h4>
      <ul className="stack-milestones">
        {(['milestone1', 'milestone2', 'milestone3'] as const).map((milestone) => (
          <li key={milestone} data-stack-milestone>
            <span className="tech-dot" style={{ '--tech': LOOK[tech.id].color } as CSSProperties} aria-hidden="true" />
            {t(key(milestone))}
          </li>
        ))}
      </ul>

      <a href={LOOK[tech.id].referenceUrl} className="px-btn px-btn-outline" data-stack-reference>
        {t(key('reference'))}
        <ExternalLink size={14} aria-hidden="true" />
      </a>
    </div>
  )
}

export default function StackBody() {
  const { t, lang } = useTranslation()
  const [selectedId, setSelectedId] = useState(STACK[0].technologies[0].id)
  const selected = STACK.flatMap((area) => area.technologies).find((tech) => tech.id === selectedId)

  return (
    <div className="stack">
      <FadeIn>
        <div className="stack-notes">
          <div data-stack-rule>
            <p>{t('stack.rule')}</p>
          </div>
          <p>{t('stack.counts.note')}</p>
        </div>

        <div className="stack-layout">
          <div className="stack-areas" role="group" aria-label={t('stack.groups')}>
            {/* Each area is a div, not a section: XP pads every <section> inside a window as if it were a page section. */}
            {STACK.map((area) => (
              <div key={area.id} className="stack-area" data-stack-area={area.id}>
                <header>
                  <h3 data-stack-area-label>{area.label[lang]}</h3>
                  <p><Counts evidence={area} data-stack-area-counts /></p>
                </header>
                <ul>
                  {area.technologies.map((tech) => {
                    const isSelected = tech.id === selectedId
                    return (
                      <li key={tech.id}>
                        <button
                          type="button"
                          className="stack-tech"
                          data-stack-tech={tech.id}
                          aria-pressed={isSelected}
                          onClick={() => setSelectedId(tech.id)}
                        >
                          <Chip tech={tech} size={22} />
                          <span className="stack-tech-text">
                            <span className="stack-tech-name" data-stack-name>{tech.name}</span>
                            <Counts evidence={tech} className="stack-tech-counts" data-stack-counts />
                            {tech.site && <span className="stack-tech-counts" data-stack-site>{COPY.site[lang]}: {tech.site}</span>}
                            <Status tech={tech} />
                          </span>
                          {/* The selected state has a shape of its own, not only the inverted fill. */}
                          <ChevronRight className="stack-tech-arrow" size={18} aria-hidden="true" />
                        </button>
                        {/* On a narrow section the evidence opens right under its technology. */}
                        {isSelected && (
                          <div className="stack-detail stack-detail-inline">
                            <Detail tech={tech} />
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* On a wide section the same evidence sits beside the list. */}
          {selected && (
            <aside className="stack-detail stack-detail-side" aria-label={selected.name}>
              <Detail tech={selected} />
            </aside>
          )}
        </div>
      </FadeIn>

      <FadeIn>
        <figure className="stack-map" data-stack-map>
          <h3>{t('stack.map.title')}</h3>
          <Figure id="stack-map" alt={t('stack.map.alt')} />
          <figcaption>{t('stack.map.caption')}</figcaption>
        </figure>
      </FadeIn>
    </div>
  )
}
