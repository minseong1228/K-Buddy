/**
 * Pre-generates each buddy's voice clips with ElevenLabs, so the key never reaches the browser.
 *
 *   npm run voices          # generate missing clips (skips existing files)
 *   npm run voices -- --dry # only count characters
 *
 * Reads ELEVENLABS_API_KEY from .env.local (node --env-file). Output: public/voices/<buddy>/<key>.mp3 + manifest.json
 */
import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import { BUDDIES } from '../src/data/buddies.ts'
import { DIETS } from '../src/data/food.ts'
import { GUIDES } from '../src/data/guides.ts'
import { SCENARIOS, STAFF_LINES } from '../src/data/phrases.ts'
import { M } from '../src/i18n/messages.ts'
import { BUDDY_VOICES, voiceKey } from '../src/lib/voiceKey.ts'

const LANGS = ['en', 'ko', 'zh', 'ja', 'vi', 'th', 'id'] as const
const MODEL = 'eleven_v4'
const OUT = 'public/voices'
const dry = process.argv.includes('--dry')

const fill = (s: string, name: string) => s.replace('{buddy}', name)

/** Fixed Korean sentences the app plays (dynamic ones fall back to the browser voice). */
const koreanLines = [
  ...SCENARIOS.flatMap((s) => s.phrases.map((p) => p.ko)),
  ...STAFF_LINES.flatMap((l) => l.replies.map((r) => r.ko)),
  ...GUIDES.flatMap((g) => (g.ko ? [g.ko] : [])),
  ...DIETS.flatMap((d) => (d.askKo ? [d.askKo] : [])),
  '줄 서 있는 거예요. 뒤로 서 주세요.',
  '추가 요금 없이 총 얼마예요?',
  '도와주세요! 한국어를 못해요.',
]

type Job = { buddy: string; text: string; lang: string }
const jobs: Job[] = []
for (const b of BUDDIES) {
  for (const text of new Set(koreanLines)) jobs.push({ buddy: b.id, text, lang: 'ko' })
  for (const lang of LANGS) {
    jobs.push({ buddy: b.id, text: fill(M.boriHello[lang] ?? M.boriHello.en, b.name), lang })
    jobs.push({ buddy: b.id, text: fill(M.imBuddy[lang] ?? M.imBuddy.en, b.name), lang })
  }
}

const todo = jobs.filter((j) => !existsSync(join(OUT, j.buddy, `${voiceKey(j.text)}.mp3`)))
const chars = todo.reduce((n, j) => n + j.text.length, 0)
console.log(`${jobs.length} clips total, ${todo.length} to generate, ${chars} characters`)

/** Retries rate-limited (429) calls with a growing pause. */
async function withRetry<T>(fn: () => Promise<T>, tries = 5): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn()
    } catch (e) {
      if ((e as { statusCode?: number }).statusCode !== 429 || i >= tries) throw e
      await new Promise((r) => setTimeout(r, 1500 * i))
    }
  }
}

if (!dry && todo.length) {
  const client = new ElevenLabsClient()
  let done = 0
  const worker = async () => {
    for (let j = todo.shift(); j; j = todo.shift()) {
      const dir = join(OUT, j.buddy)
      mkdirSync(dir, { recursive: true })
      const audio = await withRetry(() =>
        client.textToSpeech.convert(BUDDY_VOICES[j.buddy], {
          text: j.text,
          modelId: MODEL,
          languageCode: j.lang,
          outputFormat: 'mp3_44100_64',
        }),
      )
      writeFileSync(join(dir, `${voiceKey(j.text)}.mp3`), Buffer.from(await new Response(audio).arrayBuffer()))
      if (++done % 20 === 0) console.log(`  ${done} done`)
    }
  }
  // Free plan allows 2 concurrent requests
  await Promise.all([worker(), worker()])
  console.log(`generated ${done} clips`)
}

// Manifest of what exists, so the app only requests real files.
const manifest = Object.fromEntries(
  BUDDIES.map((b) => {
    const dir = join(OUT, b.id)
    return [b.id, existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4)) : []]
  }),
)
if (!dry) {
  mkdirSync(OUT, { recursive: true })
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest))
}
