import { createFileRoute } from '@tanstack/react-router'
import { tracks } from '@/data/curriculum'
import { TrackCard } from '@/components/TrackCard'

export const Route = createFileRoute('/tracks/')({
  head: () => ({ meta: [{ title: 'Tracks — Firstline' }] }),
  component: TracksPage,
})

function TracksPage() {
  const [first, ...rest] = tracks
  return (
    <main className="mx-auto max-w-7xl px-5 pt-14">
      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">Tracks</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl font-semibold tracking-tight">Pick a path.</h1>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">
            Each track is a short sequence of hands-on lessons. No installs, no setup — every lesson runs right here in
            your browser.
          </p>
        </div>
        <p className="text-sm text-muted md:text-right">
          Not sure? Most people start with
          <br />
          <span className="text-ink font-medium">JavaScript Foundations.</span>
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rise lg:row-span-2">
          <TrackCard track={first} featured />
        </div>
        {rest.map((t, i) => (
          <div key={t.id} className="rise" style={{ animationDelay: `${(i + 1) * 90}ms` }}>
            <TrackCard track={t} />
          </div>
        ))}
      </div>
    </main>
  )
}
