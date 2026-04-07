import { Loader2 } from 'lucide-react'

export function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-900 grid-bg">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-neon-cyan animate-spin" />
        <div className="absolute inset-0 w-12 h-12 rounded-full bg-neon-cyan/10 blur-xl" />
      </div>
      <p className="mt-4 text-text-muted font-mono text-sm animate-pulse">
        Fetching GitHub data...
      </p>
    </div>
  )
}
