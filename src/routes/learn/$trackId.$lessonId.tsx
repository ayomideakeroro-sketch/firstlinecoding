import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDashed,
  Lightbulb,
  Play,
  RotateCcw,
  TerminalSquare,
  Eye,
  X,
  PartyPopper,
} from 'lucide-react'
import { getLesson, type Lesson, type Track } from '@/data/curriculum'
import { CodeEditor } from '@/components/CodeEditor'
import { Blocks, Inline } from '@/components/RichText'
import { runInFrame, type LogLine } from '@/lib/runner'
import { clearDraft, markComplete, saveDraft, useProgress } from '@/lib/progress'

export const Route = createFileRoute('/learn/$trackId/$lessonId')({
  loader: ({ params }) => {
    const found = getLesson(params.trackId, params.lessonId)
    if (!found) throw notFound()
    return { title: `${found.lesson.title} · ${found.track.title}` }
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.title ?? 'Lesson'} — Firstline` }] }),
  component: LessonRoute,
})

function LessonRoute() {
  const { trackId, lessonId } = Route.useParams()
  const found = getLesson(trackId, lessonId)!
  return <LessonPlayer key={`${trackId}/${lessonId}`} {...found} />
}

type Status = 'idle' | 'running' | 'passed' | 'failed'

function LessonPlayer({
  track,
  lesson,
  index,
  prev,
  next,
}: {
  track: Track
  lesson: Lesson
  index: number
  prev?: Lesson
  next?: Lesson
}) {
  const progress = useProgress()
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [code, setCode] = useState(lesson.starter)
  const [logs, setLogs] = useState<LogLine[]>([])
  const [error, setError] = useState<string>()
  const [checks, setChecks] = useState<boolean[] | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [hintsShown, setHintsShown] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const alreadyDone = progress.isComplete(track.id, lesson.id)
  const isHtml = track.mode === 'html'

  // Restore a saved draft once on the client
  useEffect(() => {
    const d = progress.draft(track.id, lesson.id)
    if (d !== undefined) setCode(d)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateCode = (value: string) => {
    setCode(value)
    saveDraft(track.id, lesson.id, value)
  }

  const run = useCallback(
    async (source: string, grade: boolean) => {
      if (!frameRef.current) return
      if (grade) setStatus('running')
      setLogs([])
      setError(undefined)
      const result = await runInFrame(
        frameRef.current,
        track.mode,
        source,
        lesson.checks.map((c) => c.test),
        (line) => setLogs((l) => [...l, line]),
      )
      if (result.timedOut) setError('Your code took too long to finish. Is there a loop that never ends?')
      else if (result.error) setError(result.error)
      setChecks(result.checks)
      const allPassed = result.checks.length > 0 && result.checks.every(Boolean)
      // Live previews only celebrate a pass; explicit runs also report failures
      setStatus(allPassed ? 'passed' : grade ? 'failed' : 'idle')
      if (allPassed) markComplete(track.id, lesson.id)
    },
    [track.id, track.mode, lesson],
  )

  // HTML lessons get a live preview as you type
  useEffect(() => {
    if (!isHtml) return
    const t = setTimeout(() => run(code, false), 350)
    return () => clearTimeout(t)
  }, [code, isHtml, run])

  const reset = () => {
    setCode(lesson.starter)
    clearDraft(track.id, lesson.id)
    setChecks(null)
    setStatus('idle')
    setLogs([])
    setError(undefined)
  }

  const passedCount = checks?.filter(Boolean).length ?? 0
  const accentBg = track.accent === 'moss' ? 'bg-moss' : 'bg-tomato'

  return (
    <div className="lg:h-[calc(100vh-4rem)] grid lg:grid-cols-[minmax(340px,440px)_1fr]">
      {/* Lesson column */}
      <aside className="border-r border-line bg-paper flex flex-col min-h-0">
        <div className="px-6 pt-5 pb-4 border-b border-line">
          <div className="flex items-center justify-between text-xs">
            <Link
              to="/tracks/$trackId"
              params={{ trackId: track.id }}
              className="inline-flex items-center gap-1 text-muted hover:text-ink"
            >
              <ArrowLeft size={14} /> {track.title}
            </Link>
            <span className="font-mono text-muted">
              {String(index + 1).padStart(2, '0')} / {String(track.lessons.length).padStart(2, '0')}
            </span>
          </div>
          <div className="mt-3 flex gap-1">
            {track.lessons.map((l, i) => (
              <Link
                key={l.id}
                to="/learn/$trackId/$lessonId"
                params={{ trackId: track.id, lessonId: l.id }}
                title={l.title}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  progress.isComplete(track.id, l.id) ? accentBg : i === index ? 'bg-ink' : 'bg-line hover:bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">{lesson.concept}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink">{lesson.title}</h1>
          <p className="mt-1 text-sm text-muted">About {lesson.minutes} minutes</p>

          <div className="mt-6">
            <Blocks blocks={lesson.body} />
          </div>

          <section className="mt-6 rounded-xl border-2 border-ink bg-white/60 p-5 shadow-[4px_4px_0_0_var(--color-ink)]">
            <h2 className="font-display text-lg font-semibold">Your task</h2>
            <ol className="mt-3 space-y-2 text-sm text-ink-soft">
              {lesson.task.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-xs mt-0.5 text-tomato">{i + 1}.</span>
                  <span className="prose-lesson [&_code]:text-[0.82em]">
                    <Inline text={t} />
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Checks {checks && `· ${passedCount}/${lesson.checks.length}`}
            </h2>
            <ul className="mt-3 space-y-2">
              {lesson.checks.map((c, i) => {
                const state = checks ? (checks[i] ? 'pass' : 'fail') : 'pending'
                return (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    {state === 'pass' ? (
                      <span className="mt-0.5 grid place-items-center w-4 h-4 rounded-full bg-moss text-paper">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    ) : state === 'fail' ? (
                      <span className="mt-0.5 grid place-items-center w-4 h-4 rounded-full bg-tomato text-paper">
                        <X size={11} strokeWidth={3} />
                      </span>
                    ) : (
                      <CircleDashed size={16} className="mt-0.5 text-muted" />
                    )}
                    <span className={`prose-lesson ${state === 'pass' ? 'text-ink' : 'text-ink-soft'}`}>
                      <Inline text={c.label} />
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="mt-6 space-y-2">
            {lesson.hints.slice(0, hintsShown).map((h, i) => (
              <div key={i} className="rise flex gap-2.5 rounded-lg bg-mustard/15 border border-mustard/40 p-3 text-sm">
                <Lightbulb size={16} className="shrink-0 mt-0.5 text-[#a67612]" />
                <span className="prose-lesson [&_p]:m-0">
                  <Inline text={h} />
                </span>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              {hintsShown < lesson.hints.length ? (
                <button
                  onClick={() => setHintsShown((n) => n + 1)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border border-line hover:border-ink transition-colors"
                >
                  <Lightbulb size={14} /> {hintsShown === 0 ? 'I need a hint' : 'Another hint'}
                </button>
              ) : (
                <button
                  onClick={() => setShowSolution((s) => !s)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border border-line hover:border-ink transition-colors"
                >
                  <Eye size={14} /> {showSolution ? 'Hide solution' : 'Show a solution'}
                </button>
              )}
            </div>
            {showSolution && (
              <div className="rise prose-lesson">
                <pre>
                  <code>{lesson.solution}</code>
                </pre>
                <p className="text-xs">Try typing it out yourself rather than copying — your fingers learn too.</p>
              </div>
            )}
          </section>
        </div>

        <div className="border-t border-line px-6 py-3 flex items-center justify-between text-sm">
          {prev ? (
            <Link
              to="/learn/$trackId/$lessonId"
              params={{ trackId: track.id, lessonId: prev.id }}
              className="inline-flex items-center gap-1 text-muted hover:text-ink"
            >
              <ArrowLeft size={14} /> Previous
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to="/learn/$trackId/$lessonId"
              params={{ trackId: track.id, lessonId: next.id }}
              className={`inline-flex items-center gap-1 ${alreadyDone ? 'text-ink font-medium' : 'text-muted hover:text-ink'}`}
            >
              {alreadyDone ? 'Next lesson' : 'Skip ahead'} <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </aside>

      {/* Workspace column */}
      <section className="flex flex-col min-h-0 bg-night">
        <div className="flex items-center justify-between gap-3 px-4 h-12 border-b border-white/10 bg-night-soft text-[#c9c4ba]">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-1 rounded bg-night text-[#e6e2d9]">{isHtml ? 'index.html' : 'main.js'}</span>
            {alreadyDone && (
              <span className="inline-flex items-center gap-1 text-[#8fc79d]">
                <Check size={12} /> completed
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors"
              title="Reset to starter code"
            >
              <RotateCcw size={13} /> Reset
            </button>
            <button
              onClick={() => run(code, true)}
              disabled={status === 'running'}
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-md bg-tomato text-paper hover:bg-tomato-deep active:translate-y-px disabled:opacity-60 transition-colors"
            >
              <Play size={14} fill="currentColor" /> {isHtml ? 'Check' : 'Run'}
              <kbd className="hidden md:inline ml-1 text-[10px] font-mono opacity-70">⌘↵</kbd>
            </button>
          </div>
        </div>

        <div className={`grid min-h-0 flex-1 ${isHtml ? 'lg:grid-rows-[1fr_1fr]' : 'lg:grid-rows-[1fr_220px]'}`}>
          <div className="min-h-[280px] overflow-hidden">
            <CodeEditor
              value={code}
              onChange={updateCode}
              language={isHtml ? 'xml' : 'javascript'}
              onRun={() => run(code, true)}
              label={`Code for ${lesson.title}`}
            />
          </div>

          <div className="relative border-t border-white/10 flex flex-col min-h-[220px]">
            <div className="flex items-center gap-2 px-4 h-9 text-[11px] uppercase tracking-[0.14em] text-[#8a8f99] border-b border-white/5">
              {isHtml ? <Eye size={13} /> : <TerminalSquare size={13} />}
              {isHtml ? 'Live preview' : 'Console'}
              {status === 'running' && <span className="ml-auto normal-case tracking-normal">running…</span>}
            </div>
            <iframe
              ref={frameRef}
              title="Code output"
              sandbox="allow-scripts"
              className={isHtml ? 'flex-1 w-full bg-white' : 'hidden'}
            />
            {!isHtml && (
              <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed">
                {logs.length === 0 && !error && (
                  <p className="text-[#5d626d]">
                    {status === 'running' ? '' : 'Output from console.log() shows up here. Press Run to try it.'}
                  </p>
                )}
                {logs.map((l, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${l.level === 'error' ? 'text-[#f08a6c]' : l.level === 'warn' ? 'text-[#e8c170]' : 'text-[#e6e2d9]'}`}
                  >
                    <span className="text-[#5d626d] select-none">›</span>
                    <span className="whitespace-pre-wrap break-all">{l.text}</span>
                  </div>
                ))}
                {error && (
                  <div className="mt-2 rounded-md bg-tomato/15 border border-tomato/40 px-3 py-2 text-[#f5a58f]">
                    <span className="font-semibold">Error:</span> {error}
                  </div>
                )}
              </div>
            )}
            {isHtml && error && (
              <div className="absolute bottom-3 left-3 right-3 rounded-md bg-night/95 border border-tomato/40 px-3 py-2 font-mono text-xs text-[#f5a58f]">
                {error}
              </div>
            )}

            {(status === 'passed' || status === 'failed') && (
              <ResultBanner
                passed={status === 'passed'}
                track={track}
                next={next}
                failedCount={lesson.checks.length - passedCount}
                onDismiss={() => setStatus('idle')}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function ResultBanner({
  passed,
  track,
  next,
  failedCount,
  onDismiss,
}: {
  passed: boolean
  track: Track
  next?: Lesson
  failedCount: number
  onDismiss: () => void
}) {
  return (
    <div
      className={`rise absolute left-3 right-3 bottom-3 rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl ${
        passed ? 'bg-moss text-paper' : 'bg-paper text-ink border-2 border-tomato'
      }`}
    >
      {passed ? <PartyPopper size={20} className="shrink-0" /> : <X size={20} className="shrink-0 text-tomato" />}
      <div className="flex-1 text-sm">
        {passed ? (
          <>
            <p className="font-semibold">Every check passed. Nicely done.</p>
            <p className="opacity-80">{next ? `Up next: ${next.title}` : `That’s the whole ${track.title} track!`}</p>
          </>
        ) : (
          <>
            <p className="font-semibold">
              {failedCount} check{failedCount === 1 ? '' : 's'} still to go
            </p>
            <p className="text-ink-soft">Look at the list on the left, tweak your code and run it again.</p>
          </>
        )}
      </div>
      {passed ? (
        next ? (
          <Link
            to="/learn/$trackId/$lessonId"
            params={{ trackId: track.id, lessonId: next.id }}
            className="inline-flex items-center gap-1 rounded-md bg-paper text-ink px-3 py-1.5 text-sm font-semibold hover:bg-white"
          >
            Next lesson <ArrowRight size={14} />
          </Link>
        ) : (
          <Link
            to="/tracks"
            className="inline-flex items-center gap-1 rounded-md bg-paper text-ink px-3 py-1.5 text-sm font-semibold hover:bg-white"
          >
            Pick a new track <ArrowRight size={14} />
          </Link>
        )
      ) : (
        <button onClick={onDismiss} className="p-1 rounded hover:bg-paper-deep" aria-label="Dismiss">
          <X size={16} />
        </button>
      )}
    </div>
  )
}
