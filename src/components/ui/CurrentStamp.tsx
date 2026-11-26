import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from '../../hooks/useTranslation'

/**
 * The one mark for "this is still going on": the worn ink stamp, pressed onto
 * the card the first time it comes into view. Decorative, because the period
 * beside it already reads Presente/Present.
 */
export function CurrentStamp({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  return (
    <motion.span
      aria-hidden="true"
      className={`ink-stamp ${className}`}
      initial={reduceMotion ? false : { scale: 1.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.22, ease: [0.5, 0, 0.75, 0] }}
    >
      {t('experience.stamp')}
    </motion.span>
  )
}
