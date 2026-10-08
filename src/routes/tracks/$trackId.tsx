import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Check, Clock } from 'lucide-react'
import { getTrack } from '@/data/curriculum'
import { useProgress } from '@/lib/progress'
import { accentClasses } from '@/components/TrackCard'

export const Route = createFileRoute('/tracks/$trackId')({
  loader: ({ params }) => {
    const track = getTrack(params.trackId)
    if (!track || track.status !== 'open') throw notFound()
    return { title: track.title }
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.title ?? 'Track'} — Firstline` }] }),
  component: TrackPage,
})

function TrackPage() {
  const { trackId } = Route.useParams()
  const track = getTrack(trackId)!
  const progress = useProgress()
  const a = accentClasses[track.accent]
  const done = progress.completedIn(track.id)
  const nextUp = track.lessons.find((l) => !progress.isComplete(track.id, l.id)) ?? track.lessons[0]
  const minutes = track.lessons.reduce((m, l) => m + l.minutes, 0)

  return (
    <main className="mx-auto max-w-7xl px-5 pt-10">
      <Link to="/tracks" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft size={14} /> All tracks
      </Link>

      <div className="mt-6 grid lg:grid-cols-[1fr_380px] gap-12">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${a.text}`}>{track.level}</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl font-semibold tracking-tight leading-[1.02]">
            {track.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft leading-relaxed">{track.description}</p>

          <ol className="mt-12 relative">
            <span aria-hidden className="absolute left-[19px] top-4 bottom-4 w-px bg-line" />
            {track.lessons.map((l, i) => {
              const complete = progress.isComplete(track.id, l.id)
              const isNext = l.id === nextUp.id && !complete
              return (
                <li key={l.id} className="rise relative" style={{ animationDelay: `${i * 60}ms` }}>
                  <Link
                    to="/learn/$trackId/$lessonId"
                    params={{ trackId: track.id, lessonId: l.id }}
                    className={`group flex items-center gap-5 py-4 pr-4 rounded-xl transition-colors hover:bg-paper-deep/70 ${
                      isNext ? 'bg-paper-deep/70' : ''
                    }`}
                  >
                    <span
                      className={`relative z-10 grid place-items-center w-10 h-10 shrink-0 rounded-full border-2 font-mono text-sm ${
                        complete
                          ? `${a.bg} border-transparent text-paper`
                          : isNext
                            ? 'border-ink bg-ink text-paper'
                            : 'border-line bg-paper text-muted'
                      }`}
                    >
                      {complete ? <Check size={16} strokeWidth={3} /> : String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-[0.12em] text-muted">{l.concept}</p>
                      <p className="font-display text-xl font-semibold">{l.title}</p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 text-sm text-muted">
                      <Clock size={14} /> {l.minutes} min
                    </span>
                    <ArrowRight size={18} className="text-muted group-hover:translate-x-1 group-hover:text-ink transition" />
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>

        <aside className="lg:sticky lg:top-24 self-start rounded-2xl border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--color-ink)]">
          <p className="text-sm text-muted">Your progress</p>
          <p className="mt-1 font-display text-4xl font-semibold">
            {done}
            <span className="text-muted text-2xl"> / {track.lessons.length}</span>
          </p>
          <div className="mt-4 h-2 rounded-full bg-paper-deep overflow-hidden">
            <div className={`h-full ${a.bg}`} style={{ width: `${(done / track.lessons.length) * 100}%` }} />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted">Total time</dt>
              <dd className="font-medium">~{minutes} minutes</dd>
            </div>
            <div>
              <dt className="text-muted">Learners</dt>
              <dd className="font-medium">{track.learners.toLocaleString('en-US')}</dd>
            </div>
          </dl>
          <Link
            to="/learn/$trackId/$lessonId"
            params={{ trackId: track.id, lessonId: nextUp.id }}
            className="mt-6 flex items-center justify-center gap-2 w-full rounded-lg bg-tomato text-paper py-3 font-semibold hover:bg-tomato-deep active:translate-y-px transition-colors"
          >
            {done === 0 ? 'Start the first lesson' : done === track.lessons.length ? 'Review lessons' : 'Continue'}
            <ArrowRight size={16} />
          </Link>
          <p className="mt-3 text-xs text-muted text-center">Progress is saved on this device.</p>
        </aside>
      </div>
    </main>
  )
}
