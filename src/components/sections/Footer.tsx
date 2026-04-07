import { Heart } from 'lucide-react'
import { GithubIcon } from '../ui/GithubIcon'
import { useTranslation } from '../../hooks/useTranslation'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-surface-700/50 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        <p className="flex items-center gap-1.5">
          {t('footer.built')} <Heart size={14} className="text-neon-pink" /> React + Tailwind
        </p>
        <p className="flex items-center gap-1.5">
          <GithubIcon size={14} className="text-neon-cyan" />
          {t('footer.powered')}
        </p>
      </div>
    </footer>
  )
}
