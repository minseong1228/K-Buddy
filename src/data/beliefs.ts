import type { Diet } from '@/data/food'
import type { Lang, Tx } from '@/lib/i18n'

/** Optional belief / lifestyle question in onboarding. Only used to preset the food check. */
export const BELIEFS: { id: string; emoji: string; name: Tx; diet: Diet | null }[] = [
  { id: 'muslim', emoji: '🕌', diet: 'halal', name: { en: 'Muslim · Halal', ko: '이슬람 · 할랄', zh: '穆斯林 · 清真', ja: 'イスラム · ハラール', vi: 'Hồi giáo · Halal', th: 'มุสลิม · ฮาลาล', id: 'Muslim · Halal' } },
  { id: 'hindu', emoji: '🕉️', diet: 'nobeef', name: { en: 'Hindu · No beef', ko: '힌두 · 소고기 X', zh: '印度教 · 不吃牛肉', ja: 'ヒンドゥー · 牛肉なし', vi: 'Hindu · Không thịt bò', th: 'ฮินดู · ไม่กินเนื้อวัว', id: 'Hindu · Tanpa sapi' } },
  { id: 'buddhist', emoji: '☸️', diet: 'vegetarian', name: { en: 'Buddhist · Vegetarian', ko: '불교 · 채식', zh: '佛教 · 素食', ja: '仏教 · 菜食', vi: 'Phật giáo · Ăn chay', th: 'พุทธ · มังสวิรัติ', id: 'Buddha · Vegetarian' } },
  { id: 'jewish', emoji: '✡️', diet: 'kosher', name: { en: 'Jewish · Kosher', ko: '유대교 · 코셔', zh: '犹太教 · 洁食', ja: 'ユダヤ教 · コーシャ', vi: 'Do Thái · Kosher', th: 'ยิว · โคเชอร์', id: 'Yahudi · Kosher' } },
  { id: 'vegan', emoji: '🌱', diet: 'vegan', name: { en: 'Vegan', ko: '비건', zh: '纯素', ja: 'ヴィーガン', vi: 'Thuần chay', th: 'วีแกน', id: 'Vegan' } },
  { id: 'vegetarian', emoji: '🥚', diet: 'vegetarian', name: { en: 'Vegetarian', ko: '채식', zh: '素食', ja: 'ベジタリアン', vi: 'Ăn chay', th: 'มังสวิรัติ', id: 'Vegetarian' } },
  { id: 'none', emoji: '🍽️', diet: 'none', name: { en: 'I eat everything', ko: '다 먹어요', zh: '什么都吃', ja: '何でも食べる', vi: 'Ăn được hết', th: 'กินได้ทุกอย่าง', id: 'Makan apa saja' } },
  { id: 'private', emoji: '🤐', diet: null, name: { en: 'Prefer not to say', ko: '말하고 싶지 않아요', zh: '不想说', ja: '答えたくない', vi: 'Không muốn nói', th: 'ไม่ขอระบุ', id: 'Tidak ingin menjawab' } },
]

/**
 * Most likely answers first, per UI language (rough share of visitors from those regions).
 * The first item is shown as the big one-tap choice.
 */
const ORDER: Record<Lang, string[]> = {
  en: ['none', 'private', 'vegetarian', 'muslim', 'hindu', 'vegan', 'jewish', 'buddhist'],
  ko: ['none', 'private', 'buddhist', 'vegetarian', 'vegan', 'muslim', 'hindu', 'jewish'],
  zh: ['none', 'private', 'buddhist', 'muslim', 'vegetarian', 'vegan', 'hindu', 'jewish'],
  ja: ['none', 'private', 'buddhist', 'vegetarian', 'vegan', 'muslim', 'hindu', 'jewish'],
  vi: ['none', 'private', 'buddhist', 'vegetarian', 'muslim', 'vegan', 'hindu', 'jewish'],
  th: ['none', 'buddhist', 'muslim', 'private', 'vegetarian', 'vegan', 'hindu', 'jewish'],
  id: ['muslim', 'none', 'private', 'hindu', 'buddhist', 'vegetarian', 'vegan', 'jewish'],
}

export function beliefsFor(lang: Lang) {
  return ORDER[lang].map((id) => BELIEFS.find((b) => b.id === id)!)
}

export const beliefById = (id: string) => BELIEFS.find((b) => b.id === id)
