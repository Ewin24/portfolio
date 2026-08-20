import { lazy, Suspense } from 'react'

/**
 * The blog carries the heaviest dependencies (post bodies, MiniSearch index,
 * micromark). It loads as its own chunk behind a Suspense boundary, exactly
 * as in App.tsx, so opening the Blog window never blocks the first paint.
 */
const BlogRoot = lazy(() =>
  import('../../blog/BlogRoot').then((m) => ({ default: m.BlogRoot })),
)

/** Placeholder that reserves roughly the blog header height. */
function BlogFallback({ minHeight }: { minHeight: string }) {
  return (
    <div className="py-20 px-6 max-w-7xl mx-auto" style={{ minHeight }} aria-busy="true">
      <div className="border-t-4 border-rule mb-1" />
      <div className="border-t border-rule mb-4" />
      <div className="h-10 w-64 bg-paper-dark" />
      <div className="border-t-4 border-rule mt-4" />
    </div>
  )
}

/** The Blog window content, loaded lazily. */
export function BlogWindow() {
  return (
    <Suspense fallback={<BlogFallback minHeight="24rem" />}>
      <BlogRoot />
    </Suspense>
  )
}
