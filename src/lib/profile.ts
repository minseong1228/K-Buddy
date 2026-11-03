import { createContext, useContext } from 'react'
import type { Diet } from '@/data/food'
import { LANGS, type Lang } from '@/lib/i18n'

/** Per-user personalization. Shape kept flat so it can move to a Firestore doc as-is. */
export type Profile = {
  onboarded: boolean
  lang: Lang
  buddy: string
  nickname: string
  /** Belief/lifestyle id from data/beliefs.ts (optional, never required) */
  belief: string
  /** Food rule preset derived from belief; null = no preset */
  diet: Diet | null
  /** Allergy ids from data/allergies.ts */
  allergies: string[]
}

/** Onboarding steps, in order. Each can be reopened alone from settings. */
export const STEPS = ['lang', 'buddy', 'belief', 'allergy'] as const
export type Step = (typeof STEPS)[number]

const KEY = 'kbuddy.profile'

/** First-visit default: guess language from the browser. */
function guessLang(): Lang {
  const nav = (navigator.language || 'en').slice(0, 2)
  return LANGS.find((l) => l.id === nav)?.id ?? 'en'
}

export function loadProfile(): Profile {
  const fallback: Profile = { onboarded: false, lang: guessLang(), buddy: 'bori', nickname: '', belief: '', diet: null, allergies: [] }
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

export function saveProfile(p: Profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* ignore */
  }
}

export const ProfileContext = createContext<Profile>({ onboarded: true, lang: 'en', buddy: 'bori', nickname: '', belief: '', diet: null, allergies: [] })

export const useProfile = () => useContext(ProfileContext)

/** Fills {name}/{buddy} placeholders in a translated string. */
export function fmt(s: string, vars: Record<string, string>) {
  return s.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '')
}
