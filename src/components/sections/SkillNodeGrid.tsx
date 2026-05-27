import { motion } from 'framer-motion'
import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'

interface Technology {
  id: string
  name: string
  icon: ComponentType<LucideProps>
  color: string
  milestones: string[]
  reference: { text: string; url: string }
}

interface SkillNodeGridProps {
  technologies: Technology[]
  selectedId: string
  onSelect: (id: string) => void
}

export function SkillNodeGrid({
  technologies,
  selectedId,
  onSelect,
}: SkillNodeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {technologies.map((tech) => {
        const isSelected = selectedId === tech.id
        const Icon = tech.icon

        return (
          <motion.div
            key={tech.id}
            layout
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onSelect(tech.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(tech.id)
              }
            }}
            tabIndex={0}
            role="button"
            aria-pressed={isSelected}
            className={`
              border-2 cursor-pointer p-4 select-none
              transition-all duration-75
              ${isSelected
                ? 'bg-ink text-paper shadow-none translate-x-1 translate-y-1 border-ink'
                : 'bg-paper text-ink shadow-pixel border-ink hover:shadow-none hover:translate-x-1 hover:translate-y-1'
              }
            `}
          >
            <div className="flex items-center gap-3">
              {/* Icon box - newspaper style */}
              <div
                className={`
                  border-2 p-2 shrink-0 transition-colors duration-75
                  ${isSelected ? 'border-white/30' : 'border-ink'}
                `}
                style={{
                  backgroundColor: isSelected
                    ? `${tech.color}30`
                    : `${tech.color}18`,
                }}
              >
                <Icon
                  size={24}
                  strokeWidth={1.5}
                  className={isSelected ? 'text-paper' : ''}
                  style={!isSelected ? { color: tech.color } : undefined}
                />
              </div>

              {/* Name + meta */}
              <div className="min-w-0">
                <h4
                  className={`
                    font-headline text-base font-bold leading-tight
                    ${isSelected ? 'text-paper' : 'text-ink'}
                  `}
                >
                  {tech.name}
                </h4>
                <p
                  className={`
                    font-mono text-[10px] mt-0.5
                    ${isSelected ? 'text-paper/70' : 'text-ink-muted'}
                  `}
                >
                  {tech.milestones.length} milestones
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
