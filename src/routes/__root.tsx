import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'


import { SiteHeader, SiteFooter } from '@/components/SiteChrome'
import '../styles.css'

const siteName = 'Firstline — Learn to code, one line at a time'
const siteDescription =
  'Bite-sized, hands-on coding lessons that run right in your browser. Write real JavaScript, HTML and CSS from your very first minute.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,800&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-24 text-center">
      <p className="font-mono text-tomato">ReferenceError: page is not defined</p>
      <h1 className="mt-4 font-display text-5xl font-semibold">We couldn’t find that page.</h1>
      <p className="mt-4 text-ink-soft">It may have moved, or it might be a lesson that isn’t written yet.</p>
      <Link
        to="/tracks"
        className="mt-8 inline-block rounded-lg bg-ink text-paper px-6 py-3 font-semibold hover:bg-ink-soft"
      >
        Browse tracks
      </Link>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  )
}
