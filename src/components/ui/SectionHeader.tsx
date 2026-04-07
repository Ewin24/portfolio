interface Props {
  title: string
  subtitle: string
  id: string
}

export function SectionHeader({ title, subtitle, id }: Props) {
  return (
    <div className="text-center mb-16" id={id}>
      <h2 className="text-4xl md:text-5xl font-bold gradient-text inline-block mb-4">
        {title}
      </h2>
      <p className="text-text-secondary max-w-2xl mx-auto text-lg">
        {subtitle}
      </p>
    </div>
  )
}
