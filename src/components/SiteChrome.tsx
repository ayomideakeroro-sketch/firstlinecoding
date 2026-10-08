import { Link } from '@tanstack/react-router'
import { useProgress } from '@/lib/progress'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-extrabold tracking-tight ${className}`}>
      <span className="grid place-items-center w-8 h-8 rounded-md bg-ink text-paper font-mono text-sm">
        &gt;<span className="caret text-tomato">_</span>
      </span>
      Firstline
    </span>
  )
}

export function SiteHeader() {
  const { totalCompleted } = useProgress()
  const linkCls =
    'px-3 py-1.5 rounded-md text-sm font-medium text-ink-soft hover:text-ink hover:bg-paper-deep transition-colors'

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl text-ink">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/tracks" className={linkCls} activeProps={{ className: 'text-ink bg-paper-deep' }}>
            Tracks
          </Link>
          <a href="/#how" className={`${linkCls} hidden sm:inline-block`}>
            How it works
          </a>
          {totalCompleted > 0 && (
            <span className="hidden md:inline-flex items-center gap-1.5 ml-2 px-3 py-1 rounded-full bg-moss/10 text-moss text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-moss" />
              {totalCompleted} lesson{totalCompleted === 1 ? '' : 's'} done
            </span>
          )}
          <Link
            to="/learn/$trackId/$lessonId"
            params={{ trackId: 'javascript-foundations', lessonId: 'hello-world' }}
            className="ml-2 px-4 py-2 rounded-md bg-tomato text-paper text-sm font-semibold hover:bg-tomato-deep active:translate-y-px transition-colors"
          >
            Start coding
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto max-w-7xl px-5 py-10 flex flex-col md:flex-row gap-6 md:items-center justify-between text-sm text-muted">
        <div className="flex items-center gap-4">
          <Logo className="text-ink text-lg" />
          <span>Learn to code, one line at a time.</span>
        </div>
        <div className="flex gap-5">
          <Link to="/tracks" className="hover:text-ink">
            All tracks
          </Link>
          <a href="/#how" className="hover:text-ink">
            How it works
          </a>
          <span>© 2026 Firstline</span>
        </div>
      </div>
    </footer>
  )
}
