import { useCallback, useEffect, useRef, useState } from 'react'
import { voiceKey } from '@/lib/voiceKey'

// Pre-generated ElevenLabs clips (scripts/gen-voices.ts): buddy id → available clip keys.
let buddy = 'bori'
let clips: Record<string, Set<string>> | null = null
let current: HTMLAudioElement | null = null

/** Called by the app whenever the user's buddy changes; also preloads the clip list. */
export function setVoiceBuddy(id: string) {
  buddy = id
  if (clips) return
  clips = {}
  fetch('/voices/manifest.json')
    .then((r) => (r.ok ? r.json() : {}))
    .then((m: Record<string, string[]>) => {
      clips = Object.fromEntries(Object.entries(m).map(([b, keys]) => [b, new Set(keys)]))
    })
    .catch(() => {})
}

// Voices load asynchronously on most browsers — keep the list fresh.
let voices: SpeechSynthesisVoice[] = []
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const load = () => (voices = window.speechSynthesis.getVoices())
  load()
  window.speechSynthesis.addEventListener?.('voiceschanged', load)
}

/** Best-sounding installed voice for a language: neural/premium/Google/Apple Siri voices first. */
function bestVoice(bcp47: string) {
  const lang = bcp47.slice(0, 2)
  const matches = voices.filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith(lang))
  const score = (v: SpeechSynthesisVoice) =>
    (/(natural|neural|premium|enhanced|siri)/i.test(v.name) ? 4 : 0) +
    (/google/i.test(v.name) ? 3 : 0) +
    (/(yuna|sora|jian|tingting|kyoko|linh|kanya|damayanti|samantha)/i.test(v.name) ? 2 : 0) +
    (v.lang.replace('_', '-').toLowerCase() === bcp47.toLowerCase() ? 1 : 0) +
    (v.localService ? 0 : 1)
  return matches.sort((a, b) => score(b) - score(a))[0]
}

function browserVoice(text: string, bcp47: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = bcp47
  u.rate = 0.95
  const v = bestVoice(bcp47)
  if (v) u.voice = v
  window.speechSynthesis.speak(u)
  // Chrome stops long utterances after ~15s unless nudged
  const keepAlive = setInterval(() => (window.speechSynthesis.speaking ? window.speechSynthesis.resume() : clearInterval(keepAlive)), 10000)
}

/** Speaks in the buddy's own ElevenLabs voice when a clip exists, else the browser voice. */
export function speak(text: string, bcp47 = 'ko-KR') {
  current?.pause()
  window.speechSynthesis?.cancel()
  const key = voiceKey(text)
  if (clips?.[buddy]?.has(key)) {
    current = new Audio(`/voices/${buddy}/${key}.mp3`)
    current.play().catch(() => browserVoice(text, bcp47))
    return
  }
  browserVoice(text, bcp47)
}

export function speakKorean(text: string) {
  speak(text, 'ko-KR')
}

// Minimal typing for the Web Speech recognition API (not in lib.dom for all browsers)
type RecognitionResultEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> }
type Recognition = {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((e: RecognitionResultEvent) => void) | null
  onend: (() => void) | null
  onerror: ((e: { error?: string }) => void) | null
  start: () => void
  stop: () => void
}
type RecognitionCtor = new () => Recognition

/** Fired on window when the browser blocks the microphone; the app shows one friendly message. */
export const MIC_DENIED_EVENT = 'kbuddy:mic-denied'

function getRecognitionCtor(): RecognitionCtor | null {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/** Detach a finished/replaced recognizer so its late events can't touch the new one. */
function retire(rec: Recognition | null) {
  if (!rec) return
  rec.onresult = rec.onend = rec.onerror = null
  try {
    rec.stop()
  } catch {
    /* already stopped */
  }
}

export function useSpeechRecognition() {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recRef = useRef<Recognition | null>(null)
  const supported = typeof window !== 'undefined' && getRecognitionCtor() !== null

  const start = useCallback((lang: string) => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return
    retire(recRef.current)
    const rec = new Ctor()
    recRef.current = rec
    rec.lang = lang
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join('')
      setTranscript(text)
    }
    rec.onend = () => {
      if (recRef.current === rec) setListening(false)
    }
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') window.dispatchEvent(new Event(MIC_DENIED_EVENT))
      if (recRef.current === rec) setListening(false)
    }
    setTranscript('')
    setListening(true)
    try {
      rec.start()
    } catch {
      setListening(false)
    }
  }, [])

  const stop = useCallback(() => {
    try {
      recRef.current?.stop() // onend will flip `listening` off once the final words arrive
    } catch {
      setListening(false)
    }
  }, [])

  useEffect(() => () => retire(recRef.current), [])

  return { supported, listening, transcript, setTranscript, start, stop }
}
