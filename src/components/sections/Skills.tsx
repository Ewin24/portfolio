import { useState, useMemo } from 'react'
import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import {
  Code,
  Terminal,
  Zap,
  Database,
  Package,
  Layout,
  Cloud,
  Smartphone,
} from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { FadeIn } from '../ui/FadeIn'
import { SkillNodeGrid } from './SkillNodeGrid'
import { SkillHUD } from './SkillHUD'

interface TechData {
  id: string
  name: string
  icon: ComponentType<LucideProps>
  color: string
  milestoneKeys: [string, string, string]
  referenceKey: string
  referenceUrl: string
}

const TECH_DATA: TechData[] = [
  {
    id: 'dotnet',
    name: '.NET / C#',
    icon: Terminal,
    color: '#512BD4',
    milestoneKeys: [
      'skills.dotnet.milestone1',
      'skills.dotnet.milestone2',
      'skills.dotnet.milestone3',
    ],
    referenceKey: 'skills.dotnet.reference',
    referenceUrl: '#blog/article/arquitectura-limpa-sistema-originacion-credito',
  },
  {
    id: 'php',
    name: 'PHP / Laravel',
    icon: Terminal,
    color: '#FF2D20',
    milestoneKeys: [
      'skills.php.milestone1',
      'skills.php.milestone2',
      'skills.php.milestone3',
    ],
    referenceKey: 'skills.php.reference',
    referenceUrl: '#projects',
  },
  {
    id: 'sqlserver',
    name: 'SQL Server',
    icon: Database,
    color: '#CC2927',
    milestoneKeys: [
      'skills.sqlserver.milestone1',
      'skills.sqlserver.milestone2',
      'skills.sqlserver.milestone3',
    ],
    referenceKey: 'skills.sqlserver.reference',
    referenceUrl: '#blog/article/dapper-stored-procedures-en-lugar-de-ef-core',
  },
  {
    id: 'react',
    name: 'React',
    icon: Code,
    color: '#61DAFB',
    milestoneKeys: [
      'skills.react.milestone1',
      'skills.react.milestone2',
      'skills.react.milestone3',
    ],
    referenceKey: 'skills.react.reference',
    referenceUrl: '#projects',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: Zap,
    color: '#3178C6',
    milestoneKeys: [
      'skills.typescript.milestone1',
      'skills.typescript.milestone2',
      'skills.typescript.milestone3',
    ],
    referenceKey: 'skills.typescript.reference',
    referenceUrl: '#projects',
  },
  {
    id: 'aws',
    name: 'AWS',
    icon: Cloud,
    color: '#FF9900',
    milestoneKeys: [
      'skills.aws.milestone1',
      'skills.aws.milestone2',
      'skills.aws.milestone3',
    ],
    referenceKey: 'skills.aws.reference',
    referenceUrl: '#projects',
  },
  {
    id: 'flutter',
    name: 'Flutter',
    icon: Smartphone,
    color: '#02569B',
    milestoneKeys: [
      'skills.flutter.milestone1',
      'skills.flutter.milestone2',
      'skills.flutter.milestone3',
    ],
    referenceKey: 'skills.flutter.reference',
    referenceUrl: '#projects',
  },
  {
    id: 'cleanarch',
    name: 'Clean Architecture',
    icon: Layout,
    color: '#6C5CE7',
    milestoneKeys: [
      'skills.cleanarch.milestone1',
      'skills.cleanarch.milestone2',
      'skills.cleanarch.milestone3',
    ],
    referenceKey: 'skills.cleanarch.reference',
    referenceUrl: '#blog/article/orquestacion-cross-system-sin-acoplamiento',
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: Package,
    color: '#2496ED',
    milestoneKeys: [
      'skills.docker.milestone1',
      'skills.docker.milestone2',
      'skills.docker.milestone3',
    ],
    referenceKey: 'skills.docker.reference',
    referenceUrl: '#projects',
  },
]

interface Technology {
  id: string
  name: string
  icon: ComponentType<LucideProps>
  color: string
  milestones: string[]
  reference: {
    text: string
    url: string
  }
}

export function Skills() {
  const { t } = useTranslation()
  const [selectedId, setSelectedId] = useState<string>(TECH_DATA[0].id)

  const technologies: Technology[] = useMemo(
    () =>
      TECH_DATA.map((tech) => ({
        id: tech.id,
        name: tech.name,
        icon: tech.icon,
        color: tech.color,
        milestones: tech.milestoneKeys.map((key) => t(key as any)),
        reference: {
          text: t(tech.referenceKey as any),
          url: tech.referenceUrl,
        },
      })),
    [t],
  )

  const selected =
    technologies.find((tech) => tech.id === selectedId) ?? technologies[0]

  return (
    <section id="skills" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Section header — pixel-art newspaper (Projects.tsx L233-249 verbatim) */}
      <FadeIn>
        <div className="mb-10">
          <div className="border-t-4 border-ink mb-1" />
          <div className="border-t border-ink mb-4" />
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-headline text-4xl md:text-5xl font-black text-ink leading-none">
              {t('skills.title')}
            </h2>
            <p className="font-mono text-xs text-ink-muted text-right max-w-xs hidden md:block">
              {t('skills.subtitle')}
            </p>
          </div>
          <p className="font-mono text-xs text-ink-muted mt-2 md:hidden">
            {t('skills.subtitle')}
          </p>
          <div className="border-t-4 border-ink mt-4" />
        </div>
      </FadeIn>

      {/* Grid / HUD — side by side on desktop, stacked on mobile */}
      <div className="grid md:grid-cols-2 gap-6">
        <FadeIn>
          <SkillNodeGrid
            technologies={technologies}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <SkillHUD technology={selected} />
        </FadeIn>
      </div>
    </section>
  )
}
