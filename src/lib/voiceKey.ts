/**
 * Stable file name for a pre-generated voice clip (FNV-1a hash of the exact text).
 * Shared by the app and scripts/gen-voices.ts so both agree on the file path.
 */
export function voiceKey(text: string): string {
  let h = 0x811c9dc5
  for (const ch of text.normalize('NFC')) {
    h ^= ch.codePointAt(0)!
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(36)
}

/** ElevenLabs voice per buddy (premade voices; Eleven v4 speaks Korean and all 7 UI languages). */
export const BUDDY_VOICES: Record<string, string> = {
  bori: 'TX3LPaxmHKxFdv7VOQHJ', // Liam — young, energetic
  dubu: 'cgSgspJ2msm6clMCkdW9', // Jessica — playful, warm
  gomi: 'nPczCjzI2devNBz1zQrb', // Brian — deep, comforting
  kkachi: 'Xb7hH8MSUJpSbSDYk0k2', // Alice — clear educator
  songi: 'FGY2WhTYpPnrIDTdsKH5', // Laura — bright, quirky (free-tier premade)
}
