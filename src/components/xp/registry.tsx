import type { ReactNode } from 'react'
import { User, FolderKanban, Layers, GraduationCap, MessageSquareQuote, FileText, Mail, CircleHelp } from 'lucide-react'
import type { TranslationKeys } from '../../i18n/translations'
import { Hero } from '../sections/Hero'
import { About } from '../sections/About'
import { Projects } from '../sections/Projects'
import { Education } from '../sections/Education'
import { Testimonials } from '../sections/Testimonials'
import { Contact } from '../sections/Contact'
import { BlogWindow } from './BlogWindow'
import { SkillsExperienceWindow } from './SkillsExperienceWindow'
import { HelpWindow } from './HelpWindow'

export type AppId =
  | 'about'
  | 'projects'
  | 'skills-experience'
  | 'education'
  | 'testimonials'
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
    icon: <User size={14} />,
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
    icon: <FolderKanban size={14} />,
    render: () => <Projects />,
  },
  {
    id: 'skills-experience',
    titleKey: 'nav.skills',
    icon: <Layers size={14} />,
    render: () => <SkillsExperienceWindow />,
  },
  {
    id: 'education',
    titleKey: 'nav.education',
    icon: <GraduationCap size={14} />,
    render: () => <Education />,
  },
  {
    id: 'testimonials',
    titleKey: 'nav.testimonials',
    icon: <MessageSquareQuote size={14} />,
    render: () => <Testimonials />,
  },
  {
    id: 'blog',
    titleKey: 'nav.blog',
    icon: <FileText size={14} />,
    render: () => <BlogWindow />,
  },
  {
    id: 'contact',
    titleKey: 'nav.contact',
    icon: <Mail size={14} />,
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
    icon: <CircleHelp size={14} />,
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
