import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Clock, Users } from 'lucide-react'
import type { Track } from '@/data/curriculum'
import { useProgress } from '@/lib/progress'

export const accentClasses = {
  tomato: { bg: 'bg-tomato', text: 'text-tomato', soft: 'bg-tomato/10' },
  moss: { bg: 'bg-moss', text: 'text-moss', soft: 'bg-moss/10' },
  mustard: { bg: 'bg-mustard', text: 'text-[#a67612]', soft: 'bg-mustard/15' },
} as const

const glyph: Record<string, string> = {
  'javascript-foundations': '{ }',
  'html-and-css': '</>',
  'python-basics': 'py',
}

export function TrackCard({ track, featured = false }: { track: Track; featured?: boolean }) {
  const { completedIn } = useProgress()
  const a = accentClasses[track.accent]
  const done = completedIn(track.id)
  const total = track.lessons.length
  const minutes = track.lessons.reduce((m, l) => m + l.minutes, 0)
  const soon = track.status === 'soon'

  const inner = (
    <article
      className={`group relative h-full rounded-2xl border-2 border-ink bg-paper p-6 transition-transform ${
        soon ? 'opacity-80' : 'hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)]'
      } ${featured ? 'md:p-8' : ''}`}
    >
      <div className="flex items-start justify-between">
        <span className={`grid place-items-center w-14 h-14 rounded-xl ${a.bg} text-paper font-mono font-semibold text-lg`}>
          {glyph[track.id] ?? '>_'}
        </span>
        {soon ? (
          <span className="text-xs font-semibold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full bg-paper-deep text-muted">
            Coming soon
          </span>
        ) : (
          <ArrowUpRight className="text-muted group-hover:text-ink transition-colors" />
        )}
      </div>
      <p className={`mt-6 text-xs font-semibold uppercase tracking-[0.14em] ${a.text}`}>{track.level}</p>
      <h3 className={`mt-1 font-display font-semibold leading-tight ${featured ? 'text-3xl' : 'text-2xl'}`}>{track.title}</h3>
      <p className="mt-2 text-ink-soft">{track.tagline}</p>

      {soon ? (
        <p className="mt-6 text-sm text-muted">{track.upcoming?.length} lessons in the works</p>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            <span>{total} lessons</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={14} /> ~{minutes} min
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={14} /> {track.learners.toLocaleString('en-US')} learners
            </span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-paper-deep overflow-hidden">
            <div className={`h-full ${a.bg} transition-all`} style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted">
            {done === 0 ? 'Not started' : done === total ? 'Completed' : `${done} of ${total} done`}
          </p>
        </>
      )}
    </article>
  )

  if (soon) return inner
  return (
    <Link to="/tracks/$trackId" params={{ trackId: track.id }} className="block h-full">
      {inner}
    </Link>
  )
}
