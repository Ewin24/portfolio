import type { ReactNode } from 'react'
import { User, FolderKanban, Layers, GraduationCap, MessageSquareQuote, FileText, Mail } from 'lucide-react'
import type { TranslationKeys } from '../../i18n/translations'
import { Hero } from '../sections/Hero'
import { About } from '../sections/About'
import { Projects } from '../sections/Projects'
import { Education } from '../sections/Education'
import { Testimonials } from '../sections/Testimonials'
import { Contact } from '../sections/Contact'
import { BlogWindow } from './BlogWindow'
import { SkillsExperienceWindow } from './SkillsExperienceWindow'

export type AppId =
  | 'about'
  | 'projects'
  | 'skills-experience'
  | 'education'
  | 'testimonials'
  | 'blog'
  | 'contact'

/** A single entry in the desktop app registry. */
export interface AppEntry {
  id: AppId
  /** Translation key for the window title / taskbar label / Start menu. */
  titleKey: keyof TranslationKeys
  icon?: ReactNode
  render: () => ReactNode
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
]
