/**
 * A post's date in the reader's language: "17 nov 2026" / "Nov 17, 2026".
 * Post dates are calendar days (`YYYY-MM-DD`), so they are read in UTC and do
 * not slip a day west of Greenwich.
 */
export function formatPostDate(date: string, lang: 'es' | 'en'): string {
  const day = new Date(date)
  if (Number.isNaN(day.getTime())) return date
  return new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeZone: 'UTC' }).format(day)
}
