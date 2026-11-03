import { ApiError, GoogleGenAI } from '@google/genai'
import { InvalidApiKeyError, MissingKeyError } from '@/api/errors'
import type { ExplainKind, Explanation, OcrKind } from '@/api/types'
import { getApiKey } from '@/lib/apiKey'
import { encodeImage } from '@/lib/image'
import { LANGS, type Lang } from '@/lib/i18n'

const MODEL = 'gemini-3.5-flash-lite'

const langName = (l: Lang) => ({ en: 'English', ko: 'Korean', zh: 'Simplified Chinese', ja: 'Japanese', vi: 'Vietnamese', th: 'Thai', id: 'Indonesian' })[l] ?? LANGS[0].label

type Part = { text: string } | { inlineData: { mimeType: string; data: string } }

async function generate(parts: Part[], schema?: object): Promise<string> {
  const apiKey = getApiKey()
  if (!apiKey) throw new MissingKeyError()
  const ai = new GoogleGenAI({ apiKey })
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await ai.models.generateContent({
        model: MODEL,
        contents: [{ role: 'user', parts }],
        config: schema ? { responseMimeType: 'application/json', responseJsonSchema: schema } : undefined,
      })
      if (!res.text) throw new Error('empty response')
      return res.text.trim()
    } catch (err) {
      if (err instanceof ApiError && [400, 401, 403].includes(err.status) && /api key|API_KEY|permission|unauthori/i.test(err.message)) {
        throw new InvalidApiKeyError()
      }
      // Busy (429) or briefly unavailable (5xx): wait and try again, up to 3 times
      const retryable = err instanceof ApiError && (err.status === 429 || err.status >= 500)
      if (!retryable || attempt >= 3) throw err
      await new Promise((r) => setTimeout(r, 1200 * attempt))
    }
  }
}

export async function geminiReadText(image: File, kind: OcrKind): Promise<string> {
  const img = await encodeImage(image)
  const what = { label: 'a Korean food package ingredient list (원재료명)', ad: 'a Korean menu, sign, ad or receipt', message: 'a text message / chat screenshot' }[kind]
  return generate([
    { inlineData: { mimeType: img.mimeType, data: img.base64 } },
    { text: `This photo shows ${what}. Transcribe ALL the Korean text exactly as written, including small print, prices and asterisks. Output only the text, no comments.` },
  ])
}

export async function geminiTranslate(text: string, from: Lang, to: Lang): Promise<string> {
  const style = to === 'ko' ? 'a short, polite Korean sentence (해요체) a traveler can show to staff' : `natural ${langName(to)}`
  return generate([{ text: `Translate from ${langName(from)} into ${style}. Output only the translation.\n\n${text}` }])
}

const EXPLAIN_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['safe', 'warn', 'danger'] },
    summary: { type: 'string' },
    points: { type: 'array', items: { type: 'string' } },
    replies: {
      type: 'array',
      items: { type: 'object', properties: { ko: { type: 'string' }, meaning: { type: 'string' } }, required: ['ko', 'meaning'] },
    },
  },
  required: ['verdict', 'summary', 'points', 'replies'],
}

const TASK: Record<ExplainKind, (diet?: string) => string> = {
  label: (diet) =>
    `This is a Korean ingredient list. The traveler's food rule and allergies: "${diet ?? 'none'}". ` +
    `verdict: safe = fine for that rule, warn = unclear / ask staff, danger = contains something forbidden. ` +
    `points: each risky ingredient as "Korean word → meaning → why". replies: [].`,
  ad: () =>
    `This is a Korean menu, ad, sign or receipt. Find hidden costs and tricky fine print a foreigner may miss ` +
    `(VAT not included, service charge, minimum servings, market price, cash only, no refund, conditions...). ` +
    `verdict: safe = nothing tricky, warn = small catches, danger = real extra cost or risk. points: each catch, quoting the Korean words. replies: [].`,
  situation: () =>
    `The traveler describes a situation they are in, in their own words. summary: one calm sentence on what to do. ` +
    `points: 2-4 short next steps, including what staff will likely ask. verdict: safe, or danger if it is an emergency (then mention 112/119/1330). ` +
    `replies: 1-3 polite Korean sentences (해요체) the traveler can show or play to staff, each with its meaning. The first one is the most important.`,
  scam: () =>
    `This is a message (SMS, chat, email) a foreign traveler in Korea received. Decide if it is smishing/phishing/scam ` +
    `(fake delivery, fake bank, fake police, urgent payment, unknown links, requests for codes or card numbers). ` +
    `verdict: safe / warn (suspicious) / danger (scam). summary: one sentence verdict and what to do. points: the red flags you found, quoting them. replies: [].`,
  staff: () =>
    `A Korean shop/cafe/restaurant staff member said this to a foreign traveler. summary: what they mean, simply. ` +
    `points: [] or one short tip. verdict: safe. replies: 2-3 short polite Korean answers the traveler could say back, each with its meaning.`,
}

export async function geminiExplain(kind: ExplainKind, text: string, lang: Lang, dietName?: string): Promise<Explanation> {
  const out = await generate(
    [
      {
        text:
          `You help foreign travelers in Korea. ${TASK[kind](dietName)}\n` +
          `Write summary, points and every "meaning" in ${langName(lang)}. Keep it short and plain, for an elderly reader. ` +
          `Use at most 4 points.\n\nText:\n${text}`,
      },
    ],
    EXPLAIN_SCHEMA,
  )
  const parsed = JSON.parse(out) as Partial<Explanation>
  return {
    verdict: parsed.verdict === 'safe' || parsed.verdict === 'danger' ? parsed.verdict : 'warn',
    summary: parsed.summary ?? '',
    points: (parsed.points ?? []).slice(0, 4),
    replies: (parsed.replies ?? []).slice(0, 3),
  }
}
