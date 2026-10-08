# AGENTS.md

Firstline is a learn-to-code website built with TanStack Start and deployed on Netlify. **Continue work from `PLAN.md`** — milestone 1 (the product surface) is done; start at milestone 2.

## Architecture

| Path | Purpose |
|------|---------|
| `src/routes/__root.tsx` | HTML shell, fonts, site header/footer, 404 |
| `src/routes/index.tsx` | Landing page (hero `TryIt` runner, how-it-works, tracks, stories, CTA) |
| `src/routes/tracks/index.tsx` | Track catalog |
| `src/routes/tracks/$trackId.tsx` | Track syllabus + progress sidebar |
| `src/routes/learn/$trackId.$lessonId.tsx` | Lesson player (the core screen) |
| `src/data/curriculum.ts` | **All content fixtures** — tracks, lessons, checks, learner stories. Swap for DB in milestone 4 |
| `src/lib/runner.ts` | Sandboxed iframe code runner (console capture, errors, checks, timeout) |
| `src/lib/progress.ts` | Progress + drafts store (`localStorage`, `useSyncExternalStore`). Keep the `useProgress` / `markComplete` / `saveDraft` API when moving to the database |
| `src/components/CodeEditor.tsx` | Textarea-over-highlighted-`<pre>` editor (Tab indents, ⌘/Ctrl+Enter runs) |
| `src/components/RichText.tsx` | Tiny renderer for lesson copy: `` `code` `` and `**bold**` |
| `src/components/TrackCard.tsx` | Track card + accent colour map |
| `src/components/SiteChrome.tsx` | Logo, header, footer |

## Non-obvious decisions

- **Runner:** learner code runs in `<iframe sandbox="allow-scripts">` (opaque origin, no access to the parent). JS lessons: harness script → learner script → check script, each a separate classic `<script>` so top-level `const`/`function` declarations are visible to checks through indirect `eval`. HTML lessons: learner markup is the document; checks run on `load`. Messages are tagged with a per-run id.
- **Checks are strings**, not functions, so lesson data stays serialisable (loaders, future DB storage).
- HTML lessons re-run on every edit (debounced) for a live preview; only explicit runs show the failure banner.
- The `.code-layer` class must be shared by the `<pre>` and `<textarea>` in the editor — they rely on identical font metrics.

## Conventions

- Design tokens are Tailwind `@theme` variables in `src/styles.css` (`paper`, `ink`, `tomato`, `moss`, `mustard`, `night`). Fonts: Fraunces (display), IBM Plex Sans (body), JetBrains Mono (code).
- Visual language: warm paper background, 2px ink borders, hard offset shadows (`shadow-[6px_6px_0_0_var(--color-ink)]`), `.rise` entrance animation.
- Components PascalCase, `@/` import alias for `src/`, TypeScript strict.
- Persistence must use Netlify primitives (Netlify Database / Identity) — see PLAN.md.
