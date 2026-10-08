import { useSyncExternalStore } from 'react'

/**
 * Learner progress, kept in localStorage for now. A later milestone swaps
 * this for account-backed persistence; the hook API is what screens depend on.
 */

interface ProgressState {
  completed: Record<string, number>
  drafts: Record<string, string>
}

const KEY = 'firstline:progress:v1'
const EMPTY: ProgressState = { completed: {}, drafts: {} }

let state: ProgressState = EMPTY
let loaded = false
const listeners = new Set<() => void>()

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) state = { ...EMPTY, ...JSON.parse(raw) }
  } catch {
    state = EMPTY
  }
}

function save(next: ProgressState) {
  state = next
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Storage full or disabled — progress simply won't persist.
  }
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

const getSnapshot = () => {
  load()
  return state
}

export const lessonKey = (trackId: string, lessonId: string) => `${trackId}/${lessonId}`

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)
  return {
    isComplete: (trackId: string, lessonId: string) => lessonKey(trackId, lessonId) in progress.completed,
    completedIn: (trackId: string) =>
      Object.keys(progress.completed).filter((k) => k.startsWith(`${trackId}/`)).length,
    totalCompleted: Object.keys(progress.completed).length,
    draft: (trackId: string, lessonId: string) => progress.drafts[lessonKey(trackId, lessonId)],
  }
}

export function markComplete(trackId: string, lessonId: string) {
  load()
  const key = lessonKey(trackId, lessonId)
  if (state.completed[key]) return
  save({ ...state, completed: { ...state.completed, [key]: Date.now() } })
}

export function saveDraft(trackId: string, lessonId: string, code: string) {
  load()
  save({ ...state, drafts: { ...state.drafts, [lessonKey(trackId, lessonId)]: code } })
}

export function clearDraft(trackId: string, lessonId: string) {
  load()
  const drafts = { ...state.drafts }
  delete drafts[lessonKey(trackId, lessonId)]
  save({ ...state, drafts })
}
