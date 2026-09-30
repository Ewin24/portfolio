import { useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { Tabs } from './Tabs'
import { Skills } from '../sections/Skills'
import { Experience } from '../sections/Experience'

/**
 * The merged Skills/Experience window (spec M0 — 7-app registry).
 *
 * Renders the reusable Tabs bar with two panels — Skills and Experience —
 * toggled via `aria-hidden` so the swap stays inside the same window and
 * never changes the window rect or z-index (design D2/D6).
 */
export function SkillsExperienceWindow() {
  const { t } = useTranslation()
  const [active, setActive] = useState('skills')

  return (
    <Tabs
      idPrefix="se"
      label={t('nav.skills')}
      active={active}
      onChange={setActive}
      tabs={[
        { key: 'skills', label: t('nav.skills'), content: <Skills /> },
        { key: 'experience', label: t('nav.experience'), content: <Experience /> },
      ]}
    />
  )
}
