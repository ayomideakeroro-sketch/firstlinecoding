# Firstline

**Learn to code, one line at a time.** Firstline is a website that teaches programming by having people write real code from their first minute. Short lessons explain one idea each, learners type into a real editor, and automatic checks tell them what works — all inside the browser, no installs.

## What's here

- **Landing page** (`/`) with a live, editable JavaScript snippet in the hero
- **Tracks** (`/tracks`) — JavaScript Foundations (6 lessons), HTML & CSS (4 lessons), Python (coming soon)
- **Track syllabus** (`/tracks/:trackId`) with per-lesson progress
- **Lesson player** (`/learn/:trackId/:lessonId`) — lesson copy, task, syntax-highlighted editor, console output or live HTML preview, pass/fail checks, step-by-step hints and a solution reveal

Progress and in-progress code are saved to the learner's device.

## Tech

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing) on Vite
- Tailwind CSS 4
- highlight.js for editor syntax colouring
- Learner code runs in a sandboxed `<iframe sandbox="allow-scripts">`
- Deployed on Netlify

## Run locally

```bash
pnpm install
netlify dev    # or: pnpm dev
```

## Adding a lesson

Lessons live in `src/data/curriculum.ts`. Each lesson has body copy, a task list, starter and solution code, hints, and `checks` — JavaScript expressions evaluated inside the sandbox after the learner's code runs (`__logs` holds console output; for HTML lessons the learner's page is the `document`).

## Roadmap

See [PLAN.md](./PLAN.md). Next up: learner accounts, database-backed progress, moving content into the database, a Python track, and an AI tutor.
