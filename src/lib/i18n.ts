import { createContext, useContext } from 'react'

export const LANGS = [
  { id: 'en', label: 'English', flag: '🇺🇸', speech: 'en-US' },
  { id: 'ko', label: '한국어', flag: '🇰🇷', speech: 'ko-KR' },
  { id: 'zh', label: '中文', flag: '🇨🇳', speech: 'zh-CN' },
  { id: 'ja', label: '日本語', flag: '🇯🇵', speech: 'ja-JP' },
  { id: 'vi', label: 'Tiếng Việt', flag: '🇻🇳', speech: 'vi-VN' },
  { id: 'th', label: 'ไทย', flag: '🇹🇭', speech: 'th-TH' },
  { id: 'id', label: 'Bahasa', flag: '🇮🇩', speech: 'id-ID' },
] as const

export type Lang = (typeof LANGS)[number]['id']

/** Translatable text. English is required and is the fallback for any missing language. */
export type Tx = { en: string } & Partial<Record<Lang, string>>

/** Languages ordered for a picker: the guessed/current one first, then by visitor share. */
const SHARE: Lang[] = ['zh', 'ja', 'en', 'vi', 'th', 'id', 'ko']
export function langsFor(first: Lang) {
  return [first, ...SHARE.filter((l) => l !== first)].map((id) => LANGS.find((l) => l.id === id)!)
}

export function speechLang(lang: Lang) {
  return LANGS.find((l) => l.id === lang)!.speech
}

export const LangContext = createContext<Lang>('en')

/** t(tx) picks the current language, falling back to English. */
export function useT() {
  const lang = useContext(LangContext)
  const t = (v: Tx) => v[lang] ?? v.en
  return { lang, t }
}
