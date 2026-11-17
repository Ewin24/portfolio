import { Component, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Table2 } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { resolveFigure, type ResolvedFigure } from './registry'
import type { L } from './types'

/** How long a step stays up during auto-play: long enough to read its narration line. */
const STEP_MS = 2400

const UI = {
  restart: { es: 'Reiniciar', en: 'Restart' },
  prev: { es: 'Paso anterior', en: 'Previous step' },
  play: { es: 'Reproducir', en: 'Play' },
  pause: { es: 'Pausar', en: 'Pause' },
  next: { es: 'Paso siguiente', en: 'Next step' },
  step: { es: 'Paso', en: 'Step' },
  of: { es: 'de', en: 'of' },
  data: { es: 'Datos', en: 'Data' },
} satisfies Record<string, L>

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** A renderer that throws must not take the article down with it. */
class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/**
 * The frame every figure shares: the stage its renderer draws on, the
 * narration line, the presentation player and, for data charts, the table.
 */
function Player({ figure, renderer, alt }: ResolvedFigure & { alt: string }) {
  const { lang } = useTranslation()
  const total = figure.steps.length
  const [reduced] = useState(prefersReducedMotion)
  // Reduced motion rests on the finished figure; the controls still step.
  const [step, setStep] = useState(reduced ? total : 1)
  const [playing, setPlaying] = useState(false)
  const [tableOpen, setTableOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const touched = useRef(false)

  // Play once, the first time the figure is really on screen.
  useEffect(() => {
    const el = rootRef.current
    if (!el || reduced) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      if (!touched.current) setPlaying(true)
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduced])

  useEffect(() => {
    if (!playing) return
    const timer = setTimeout(() => {
      if (step < total) setStep(step + 1)
      if (step + 1 >= total) setPlaying(false)
    }, STEP_MS)
    return () => clearTimeout(timer)
  }, [playing, step, total])

  // Any step taken by hand ends auto-play.
  const go = (to: number) => {
    touched.current = true
    setPlaying(false)
    setStep(Math.min(total, Math.max(1, to)))
  }

  const togglePlay = () => {
    touched.current = true
    if (!playing && step >= total) setStep(1)
    setPlaying(!playing)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    go(event.key === 'ArrowRight' ? step + 1 : step - 1)
  }

  const table = renderer.table?.(figure, lang)
  const Stage = renderer

  return (
    <div
      ref={rootRef}
      className="fig"
      role="group"
      aria-label={alt}
      tabIndex={0}
      onKeyDown={onKeyDown}
      data-fig-type={figure.type}
      data-fig-step={step}
      data-fig-steps={total}
      data-fig-playing={playing}
    >
      <div className="fig-stage">
        <Stage figure={figure} lang={lang} step={step} />
      </div>

      <p className="fig-narration" aria-live="polite">{figure.steps[step - 1][lang]}</p>

      <div className="fig-controls">
        <button type="button" className="fig-btn" data-fig-control="restart" aria-label={UI.restart[lang]} onClick={() => go(1)}>
          <RotateCcw size={14} aria-hidden="true" />
        </button>
        {/* aria-disabled, not disabled: a disabled button would drop the focus the arrow keys depend on. */}
        <button type="button" className="fig-btn" data-fig-control="prev" aria-label={UI.prev[lang]} aria-disabled={step <= 1} onClick={() => go(step - 1)}>
          <ChevronLeft size={14} aria-hidden="true" />
        </button>
        <button type="button" className="fig-btn" data-fig-control="play" aria-label={(playing ? UI.pause : UI.play)[lang]} onClick={togglePlay}>
          {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
        </button>
        <button type="button" className="fig-btn" data-fig-control="next" aria-label={UI.next[lang]} aria-disabled={step >= total} onClick={() => go(step + 1)}>
          <ChevronRight size={14} aria-hidden="true" />
        </button>

        <span className="fig-marks">
          {figure.steps.map((_, i) => (
            <button
              key={i}
              type="button"
              className="fig-mark"
              data-fig-mark={i + 1}
              data-done={i + 1 <= step}
              aria-label={`${UI.step[lang]} ${i + 1} ${UI.of[lang]} ${total}`}
              aria-current={i + 1 === step ? 'step' : undefined}
              onClick={() => go(i + 1)}
            />
          ))}
        </span>
        <span className="fig-count">{step} / {total}</span>

        {table && (
          <button type="button" className="fig-btn fig-btn-data" data-fig-control="data" aria-expanded={tableOpen} onClick={() => setTableOpen(!tableOpen)}>
            <Table2 size={14} aria-hidden="true" />
            {UI.data[lang]}
          </button>
        )}
      </div>

      {table && tableOpen && (
        <div className="fig-table table-wrap">
          <table>
            <thead>
              {/* Keyed by position: two columns or two rows can carry the same text. */}
              <tr>{table.head.map((cell, i) => <th key={i} scope="col">{cell}</th>)}</tr>
            </thead>
            <tbody>
              {table.rows.map((row, r) => (
                <tr key={r}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Resolved({ id, alt, fallback }: { id: string; alt: string; fallback: ReactNode }) {
  const resolved = resolveFigure(id)
  return resolved ? <Player {...resolved} alt={alt} /> : fallback
}

/**
 * An article figure by id. Anything that keeps it from drawing (an unknown id,
 * a type with no renderer, a description that is not playable, a renderer that
 * throws) leaves the alt text in its place; the caption is the article's.
 */
export function Figure({ id, alt }: { id: string; alt: string }) {
  const fallback = <p className="fig-fallback">{alt}</p>
  return (
    <Boundary fallback={fallback}>
      <Resolved id={id} alt={alt} fallback={fallback} />
    </Boundary>
  )
}
