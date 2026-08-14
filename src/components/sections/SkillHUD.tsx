import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { ComponentType, CSSProperties } from 'react'
import type { LucideProps } from 'lucide-react'
import { ExternalLink } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

interface Technology {
  id: string
  name: string
  icon: ComponentType<LucideProps>
  color: string
  milestones: string[]
  reference: { text: string; url: string }
}

interface SkillHUDProps {
  technology: Technology
}

export function SkillHUD({ technology }: SkillHUDProps) {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const Icon = technology.icon

  // The panel swaps content on every selection, so under reduced motion it
  // cross-fades in place instead of sliding.
  const shift = reduceMotion ? 0 : 10

  return (
    <div className="border-2 border-rule bg-paper shadow-pixel p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={technology.id}
          initial={{ opacity: 0, y: shift }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -shift }}
          transition={{
            duration: reduceMotion ? 0.1 : 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Header — icon + name */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-rule-light">
            <div
              className="tech-chip border-2 border-rule p-3 shrink-0"
              style={{ '--tech': technology.color } as CSSProperties}
            >
              <Icon
                size={32}
                strokeWidth={1.5}
                style={{ color: technology.color }}
              />
            </div>
            <div>
              <h3 className="font-headline text-2xl font-black text-ink leading-none">
                {technology.name}
              </h3>
              <p className="font-mono text-[10px] text-ink-muted uppercase tracking-widest mt-1">
                {t('skills.heading')}
              </p>
            </div>
          </div>

          {/* Milestones list — newspaper style with ink bullets */}
          <div className="mb-6">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-3">
              {t('skills.milestones')}
            </h4>
            <div className="space-y-2">
              {technology.milestones.map((ms, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="tech-dot w-3 h-3 mt-1 shrink-0"
                    style={{ '--tech': technology.color } as CSSProperties}
                  />
                  <p className="font-sans text-sm text-ink-light leading-relaxed">
                    {ms}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reference link — newspaper outline button */}
          <a
            href={technology.reference.url}
            className="px-btn px-btn-outline"
          >
            {technology.reference.text}
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
