import { useApp } from '../context/AppContext'
import { t } from '../i18n/translations'

export function useTranslation() {
  const { lang, setLang } = useApp()

  return {
    t: (key: Parameters<typeof t>[0]) => t(key, lang),
    lang,
    setLang,
    toggleLang: () => setLang(lang === 'es' ? 'en' : 'es'),
  }
}
