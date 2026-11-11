import type { ReactNode } from 'react'
import { XpIcon } from './icons'
import type { TranslationKeys } from '../../i18n/translations'
import { Hero } from '../sections/Hero'
import { About } from '../sections/About'
import { Projects } from '../sections/Projects'
import { Education } from '../sections/Education'
import { Contact } from '../sections/Contact'
import { BlogWindow } from './BlogWindow'
import { SkillsExperienceWindow } from './SkillsExperienceWindow'
import { HelpWindow } from './HelpWindow'

export type AppId =
  | 'about'
  | 'projects'
  | 'skills-experience'
  | 'education'
  | 'blog'
  | 'contact'
  | 'help'

/** A single entry in the desktop app registry. */
export interface AppEntry {
  id: AppId
  /** Translation key for the window title / taskbar label / Start menu. */
  titleKey: keyof TranslationKeys
  icon?: ReactNode
  render: () => ReactNode
  /** Hide from the desktop-icon column (e.g. the "?" Help window). */
  hidden?: boolean
  /** Optional fixed geometry used when the app opens (design D5). */
  defaultRect?: (desktopW: number, desktopH: number) => { x: number; y: number; w: number; h: number }
}

/**
 * The 7-app desktop registry (spec M0). `about` renders Hero + About stacked;
 * `skills-experience` merges Skills + Experience into one window. Tabs for the
 * merged window land in Slice C; here both sections stack in the window body.
 */
export const APP_REGISTRY: AppEntry[] = [
  {
    id: 'about',
    titleKey: 'nav.about',
    icon: <XpIcon name="about" />,
    render: () => (
      <>
        <Hero />
        <About />
      </>
    ),
  },
  {
    id: 'projects',
    titleKey: 'nav.projects',
    icon: <XpIcon name="projects" />,
    render: () => <Projects />,
  },
  {
    id: 'skills-experience',
    titleKey: 'nav.skills',
    icon: <XpIcon name="skills-experience" />,
    render: () => <SkillsExperienceWindow />,
  },
  {
    id: 'education',
    titleKey: 'nav.education',
    icon: <XpIcon name="education" />,
    render: () => <Education />,
  },
  {
    id: 'blog',
    titleKey: 'nav.blog',
    icon: <XpIcon name="blog" />,
    render: () => <BlogWindow />,
  },
  {
    id: 'contact',
    titleKey: 'nav.contact',
    icon: <XpIcon name="contact" />,
    render: () => <Contact />,
  },
  {
    // "?" Help (design D5): a hidden registry app so it reuses the shared
    // WindowManager open-set — no remount or duplicate window state. Hidden
    // from the desktop-icon column (DesktopIcons filters !hidden) and absent
    // from the Start menu (StartMenu's PROGRAMS is explicit). Reachable via the
    // "?" control on any window's title bar.
    id: 'help',
    titleKey: 'window.help',
    icon: <XpIcon name="help" />,
    hidden: true,
    defaultRect: (dw, dh) => ({
      x: Math.max(0, Math.floor((dw - 400) / 2)),
      y: Math.max(0, Math.floor((dh - 300 - 40) / 2)),
      w: Math.min(400, dw),
      h: Math.min(300, Math.max(0, dh - 40)),
    }),
    render: () => <HelpWindow />,
  },
]
