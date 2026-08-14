import { useReducedMotion } from 'motion/react'
import { GithubIcon } from '../ui/GithubIcon'
import { useTranslation } from '../../hooks/useTranslation'
import { useTheme } from '../../theme/ThemeContext'
import { TheWind } from '../book/lazy'

export function Footer() {
  const { t } = useTranslation()
  const { theme, stillness } = useTheme()
  const reduceMotion = useReducedMotion()

  return (
    <footer id="footer" className="border-t-4 border-rule py-6 px-6 bg-paper-dark">
      <TheWind
        active={theme === 'book'}
        still={Boolean(reduceMotion) || stillness}
      >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">

        <p className="font-mono text-[11px] text-ink-muted uppercase tracking-wide">
          {t('footer.built')} React 19 + Vite + Tailwind CSS v4
        </p>

        <p className="flex items-center gap-1.5 font-mono text-[11px] text-ink-muted uppercase tracking-wide">
          <GithubIcon size={12} />
          {t('footer.activity')}
        </p>
      </div>
      </TheWind>
    </footer>
  )
}
