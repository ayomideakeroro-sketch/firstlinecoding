import { createFileRoute, Link } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { ArrowRight, Check, Play } from 'lucide-react'
import { learnerStories, tracks } from '@/data/curriculum'
import { CodeEditor } from '@/components/CodeEditor'
import { TrackCard } from '@/components/TrackCard'
import { runInFrame, type LogLine } from '@/lib/runner'

export const Route = createFileRoute('/')({
  component: Home,
})

const heroStarter = `// Change 'friend' to your name, then press Run
const name = 'friend'

console.log(\`Hello, \${name}!\`)
console.log('You just ran your first program.')
`

function TryIt() {
  const [code, setCode] = useState(heroStarter)
  const [logs, setLogs] = useState<LogLine[] | null>(null)
  const [error, setError] = useState<string>()
  const frame = useRef<HTMLIFrameElement>(null)

  const run = async () => {
    if (!frame.current) return
    setLogs([])
    setError(undefined)
    const r = await runInFrame(frame.current, 'js', code, [], (l) => setLogs((prev) => [...(prev ?? []), l]))
    if (r.timedOut) setError('That took too long — is there a loop that never ends?')
    else if (r.error) setError(r.error)
  }

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-ink shadow-[10px_10px_0_0_var(--color-ink)] bg-night">
      <div className="flex items-center justify-between px-4 h-11 bg-night-soft border-b border-white/10">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-tomato" />
          <span className="w-3 h-3 rounded-full bg-mustard" />
          <span className="w-3 h-3 rounded-full bg-moss" />
        </div>
        <span className="font-mono text-xs text-[#8a8f99]">hello.js</span>
        <button
          onClick={run}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-tomato text-paper hover:bg-tomato-deep active:translate-y-px transition-colors"
        >
          <Play size={12} fill="currentColor" /> Run
        </button>
      </div>
      <div className="h-[190px]">
        <CodeEditor value={code} onChange={setCode} language="javascript" onRun={run} minHeight={190} label="Try some JavaScript" />
      </div>
      <div className="border-t border-white/10 px-4 py-3 min-h-[92px] font-mono text-[13px]">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#5d626d] mb-1.5">Output</p>
        {logs === null ? (
          <p className="text-[#5d626d]">
            Press Run <span className="text-[#8a8f99]">(or ⌘ + Enter)</span>
          </p>
        ) : (
          logs.map((l, i) => (
            <div key={i} className="rise flex gap-3 text-[#e6e2d9]" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="text-[#5d626d]">›</span>
              {l.text}
            </div>
          ))
        )}
        {error && <p className="text-[#f5a58f]">Error: {error}</p>}
      </div>
      <iframe ref={frame} title="Hero code runner" sandbox="allow-scripts" className="hidden" />
    </div>
  )
}

const steps = [
  {
    n: '01',
    title: 'Read a two-minute idea',
    body: 'Each lesson introduces exactly one concept in plain English, with a tiny example you can actually follow.',
    code: "const coffee = 'flat white'",
  },
  {
    n: '02',
    title: 'Write the code yourself',
    body: 'Type into a real editor with syntax colouring. HTML lessons update a live preview with every keystroke.',
    code: 'function order(drink) {\n  return `One ${drink}, please`\n}',
  },
  {
    n: '03',
    title: 'Watch the checks turn green',
    body: 'Automatic checks tell you exactly what works and what does not. Stuck? Hints unlock one at a time.',
    code: '✓ order is a function\n✓ order(coffee) is correct',
  },
]

function Home() {
  const openTracks = tracks.filter((t) => t.status === 'open')
  const totalLessons = openTracks.reduce((n, t) => n + t.lessons.length, 0)

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pt-16 md:pt-24 grid lg:grid-cols-[1.1fr_1fr] gap-14 items-center">
        <div>
          <p className="rise inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft px-3 py-1.5 rounded-full border border-line bg-paper">
            <span className="w-1.5 h-1.5 rounded-full bg-moss" /> Free · runs in your browser · no installs
          </p>
          <h1
            className="rise mt-6 font-display text-[3.2rem] leading-[0.98] md:text-7xl font-semibold tracking-tight"
            style={{ animationDelay: '80ms' }}
          >
            Learn to code,
            <br />
            <span className="italic font-normal text-tomato">one line</span> at a time.
          </h1>
          <p className="rise mt-6 max-w-lg text-lg text-ink-soft leading-relaxed" style={{ animationDelay: '160ms' }}>
            Firstline teaches programming by having you write it. Short lessons, a real editor, and instant feedback —
            so the first thing you do here is run your own code.
          </p>
          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: '240ms' }}>
            <Link
              to="/learn/$trackId/$lessonId"
              params={{ trackId: 'javascript-foundations', lessonId: 'hello-world' }}
              className="inline-flex items-center gap-2 rounded-lg bg-ink text-paper px-6 py-3.5 font-semibold hover:bg-ink-soft active:translate-y-px transition-colors"
            >
              Start lesson one <ArrowRight size={18} />
            </Link>
            <Link to="/tracks" className="px-5 py-3.5 rounded-lg font-semibold text-ink hover:bg-paper-deep transition-colors">
              Browse tracks
            </Link>
          </div>
          <dl className="rise mt-12 flex gap-10 text-sm" style={{ animationDelay: '320ms' }}>
            <div>
              <dt className="text-muted">Learners</dt>
              <dd className="font-display text-2xl font-semibold">29,549</dd>
            </div>
            <div>
              <dt className="text-muted">Lessons</dt>
              <dd className="font-display text-2xl font-semibold">{totalLessons}</dd>
            </div>
            <div>
              <dt className="text-muted">Avg. lesson</dt>
              <dd className="font-display text-2xl font-semibold">6.6 min</dd>
            </div>
          </dl>
        </div>
        <div className="rise lg:rotate-[1.2deg]" style={{ animationDelay: '200ms' }}>
          <TryIt />
          <p className="mt-5 text-sm text-muted text-right font-mono">↑ this is real. go on, edit it.</p>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-5 mt-32 scroll-mt-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">How a lesson works</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-semibold tracking-tight">
            Less watching. More typing.
          </h2>
        </div>
        <div className="mt-14 space-y-6">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`grid md:grid-cols-[120px_1fr_1fr] gap-6 items-center rounded-2xl border border-line bg-paper/70 p-6 md:p-8 ${
                i === 1 ? 'md:ml-16' : i === 2 ? 'md:ml-32' : ''
              }`}
            >
              <span className="font-display text-6xl font-extrabold text-line">{s.n}</span>
              <div>
                <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-ink-soft leading-relaxed">{s.body}</p>
              </div>
              <pre className="rounded-lg bg-night text-[#e6e2d9] px-4 py-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap">
                {s.code.split('\n').map((line, j) => (
                  <div key={j} className={line.startsWith('✓') ? 'text-[#8fc79d]' : ''}>
                    {line}
                  </div>
                ))}
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* Tracks */}
      <section className="mx-auto max-w-7xl px-5 mt-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tomato">Tracks</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl font-semibold tracking-tight">Where to begin</h2>
          </div>
          <Link to="/tracks" className="inline-flex items-center gap-1 font-semibold hover:text-tomato">
            See all tracks <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tracks.map((t) => (
            <TrackCard key={t.id} track={t} />
          ))}
        </div>
      </section>

      {/* Stories */}
      <section className="mt-32 bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-5 py-20 grid lg:grid-cols-[1fr_2fr] gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mustard">From learners</p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">
              Nobody here started as “a tech person.”
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {learnerStories.map((s, i) => (
              <figure key={s.name} className={i === 0 ? 'md:col-span-2' : ''}>
                <blockquote
                  className={`font-display leading-snug ${i === 0 ? 'text-2xl md:text-3xl' : 'text-lg'} text-paper/95`}
                >
                  “{s.quote}”
                </blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-paper/60"> — {s.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 mt-24">
        <div className="rounded-3xl border-2 border-ink bg-tomato text-paper p-10 md:p-14 grid md:grid-cols-[1fr_auto] gap-8 items-center shadow-[10px_10px_0_0_var(--color-ink)]">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">Your first line is waiting.</h2>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-paper/90">
              {['No account needed', 'Progress saved automatically', 'About 4 minutes'].map((x) => (
                <li key={x} className="inline-flex items-center gap-1.5">
                  <Check size={16} /> {x}
                </li>
              ))}
            </ul>
          </div>
          <Link
            to="/learn/$trackId/$lessonId"
            params={{ trackId: 'javascript-foundations', lessonId: 'hello-world' }}
            className="inline-flex items-center gap-2 rounded-lg bg-paper text-ink px-6 py-4 font-semibold hover:bg-white active:translate-y-px transition-colors"
          >
            Write “Hello, world!” <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  )
}
