# Firstline roadmap

Firstline is a website that teaches people to code through short, hands-on lessons that run in the browser. Each milestone below is a self-contained piece of work.

## 1. Product surface ✅
- Landing page with a live, editable JavaScript runner in the hero
- Track catalog (`/tracks`) and track syllabus (`/tracks/:trackId`)
- Lesson player (`/learn/:trackId/:lessonId`): lesson copy, task, editor, console / live preview, automatic checks, progressive hints, solution reveal
- Two playable tracks (JavaScript Foundations, HTML & CSS) plus a "coming soon" Python track
- Progress and code drafts saved in `localStorage`
- All content lives in `src/data/curriculum.ts`

## 2. Learner accounts
- Sign up / log in with Netlify Identity
- Header account menu; "Save your progress" prompt after the first completed lesson
- On first login, import existing `localStorage` progress into the account

## 3. Persistent progress (Netlify Database)
- Tables: `lesson_completions`, `code_drafts` (keyed by user + track + lesson)
- Server functions to read/write progress; swap the internals of `src/lib/progress.ts` while keeping its hook API
- Streaks and "last lesson" resume on the landing page for signed-in learners

## 4. Content in the database
- Move tracks/lessons from the fixtures file into `tracks` and `lessons` tables
- Seed script from the current fixtures
- Real learner counts computed from completions instead of fixture numbers

## 5. Python track
- Run Python in the browser via Pyodide in the same sandboxed-iframe runner
- Write the six planned Python lessons

## 6. AI tutor
- "Explain my error" and "Why is this check failing?" helper in the lesson player via Netlify AI Gateway
- Guardrails so it nudges rather than handing over solutions

## 7. Authoring & community
- Internal lesson editor for adding/editing lessons without code changes
- Shareable project pages (e.g. publish your HTML & CSS page)
- Completion certificates per track
