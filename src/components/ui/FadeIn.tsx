import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { useTheme } from '../../theme/ThemeContext'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
}

export function FadeIn({ children, className = '', delay = 0 }: Props) {
  const reduceMotion = useReducedMotion()
  const { theme } = useTheme()

  // The newspaper answers fast because that is what a newspaper does — you
  // scan it. Book is paced the other way: content surfaces rather than
  // snaps, so it travels further and takes roughly twice as long. Same
  // component, same easing curve, different tempo.
  const book = theme === 'book'

  // With reduced motion the content still fades in, but it never travels
  // and it never waits: no vertical displacement, no staggered delay.
  const offset = reduceMotion ? 0 : book ? 46 : 30

  return (
    <motion.div
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: reduceMotion ? 0.2 : book ? 1.15 : 0.6,
        delay: reduceMotion ? 0 : book ? delay * 1.6 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
