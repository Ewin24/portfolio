interface Props {
  title: string
  subtitle?: string
  id?: string
}

/** @deprecated Use inline section headers with pixel-art-newspaper style */
export function SectionHeader({ title, subtitle, id }: Props) {
  return (
    <div className="mb-10" id={id}>
      <div className="border-t-4 border-ink mb-1" />
      <div className="border-t border-ink mb-4" />
      <h2 className="font-headline text-4xl md:text-5xl font-black text-ink leading-none">
        {title}
      </h2>
      {subtitle && (
        <p className="font-mono text-xs text-ink-muted mt-2">{subtitle}</p>
      )}
      <div className="border-t-4 border-ink mt-4" />
    </div>
  )
}
