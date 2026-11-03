import type { Tx } from '@/lib/i18n'

/** Common allergens with Korean label keywords (원재료명). */
export const ALLERGIES: { id: string; emoji: string; ko: string; name: Tx; words: string[] }[] = [
  { id: 'peanut', emoji: '🥜', ko: '땅콩', name: { en: 'Peanut', ko: '땅콩', zh: '花生', ja: 'ピーナッツ', vi: 'Đậu phộng', th: 'ถั่วลิสง', id: 'Kacang tanah' }, words: ['땅콩'] },
  { id: 'nuts', emoji: '🌰', ko: '견과류', name: { en: 'Tree nuts', ko: '견과류', zh: '坚果', ja: 'ナッツ', vi: 'Hạt', th: 'ถั่วเปลือกแข็ง', id: 'Kacang pohon' }, words: ['호두', '아몬드', '잣', '캐슈', '견과'] },
  { id: 'milk', emoji: '🥛', ko: '우유', name: { en: 'Milk', ko: '우유', zh: '牛奶', ja: '乳', vi: 'Sữa', th: 'นม', id: 'Susu' }, words: ['우유', '유청', '치즈', '버터', '유당', '탈지분유'] },
  { id: 'egg', emoji: '🥚', ko: '계란', name: { en: 'Egg', ko: '계란', zh: '鸡蛋', ja: '卵', vi: 'Trứng', th: 'ไข่', id: 'Telur' }, words: ['계란', '달걀', '난백', '난황', '전란'] },
  { id: 'wheat', emoji: '🌾', ko: '밀', name: { en: 'Wheat / gluten', ko: '밀·글루텐', zh: '小麦/麸质', ja: '小麦', vi: 'Lúa mì', th: 'ข้าวสาลี', id: 'Gandum' }, words: ['밀가루', '소맥', '글루텐', '밀'] },
  { id: 'soy', emoji: '🫘', ko: '대두', name: { en: 'Soy', ko: '대두(콩)', zh: '大豆', ja: '大豆', vi: 'Đậu nành', th: 'ถั่วเหลือง', id: 'Kedelai' }, words: ['대두', '두부', '간장', '된장'] },
  { id: 'shellfish', emoji: '🦐', ko: '갑각류', name: { en: 'Shellfish', ko: '갑각류·조개', zh: '甲壳类', ja: '甲殻類', vi: 'Hải sản có vỏ', th: 'สัตว์มีเปลือก', id: 'Kerang & udang' }, words: ['새우', '꽃게', '조개', '굴', '홍합', '랍스터'] },
  { id: 'fish', emoji: '🐟', ko: '생선', name: { en: 'Fish', ko: '생선', zh: '鱼', ja: '魚', vi: 'Cá', th: 'ปลา', id: 'Ikan' }, words: ['멸치', '고등어', '연어', '참치', '어묵', '액젓'] },
]

export const allergyById = (id: string) => ALLERGIES.find((a) => a.id === id)
