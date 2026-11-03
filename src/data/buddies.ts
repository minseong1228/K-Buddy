import type { Tx } from '@/lib/i18n'

export type Ears = 'round' | 'long' | 'none' | 'tuft' | 'leaf'

export type Buddy = {
  id: string
  name: string
  nameKo: string
  body: string
  belly: string
  ears: Ears
  stripes?: boolean
  beak?: boolean
  trait: Tx
}

/** Original K-Buddy characters. Colors are character art, not theme tokens. */
export const BUDDIES: Buddy[] = [
  {
    id: 'bori',
    name: 'Bori',
    nameKo: '보리',
    body: '#f4a03a',
    belly: '#fff4e4',
    ears: 'round',
    stripes: true,
    trait: { en: '🔥 Energetic tiger', ko: '🔥 씩씩한 호랑이', zh: '🔥 活力小老虎', ja: '🔥 元気なトラ', vi: '🔥 Hổ năng động', th: '🔥 เสือร่าเริง', id: '🔥 Harimau ceria' },
  },
  {
    id: 'dubu',
    name: 'Dubu',
    nameKo: '두부',
    body: '#f6f1ea',
    belly: '#ffe3e8',
    ears: 'long',
    trait: { en: '🌸 Gentle bunny', ko: '🌸 다정한 토끼', zh: '🌸 温柔小兔', ja: '🌸 やさしいウサギ', vi: '🌸 Thỏ hiền lành', th: '🌸 กระต่ายใจดี', id: '🌸 Kelinci lembut' },
  },
  {
    id: 'gomi',
    name: 'Gomi',
    nameKo: '곰이',
    body: '#a8704a',
    belly: '#f3dcbc',
    ears: 'round',
    trait: { en: '🍯 Cozy bear', ko: '🍯 포근한 곰', zh: '🍯 暖暖小熊', ja: '🍯 ほっこりクマ', vi: '🍯 Gấu ấm áp', th: '🍯 หมีอบอุ่น', id: '🍯 Beruang hangat' },
  },
  {
    id: 'kkachi',
    name: 'Kkachi',
    nameKo: '까치',
    body: '#34406b',
    belly: '#ffffff',
    ears: 'tuft',
    beak: true,
    trait: { en: '✨ Smart magpie', ko: '✨ 똑똑한 까치', zh: '✨ 聪明喜鹊', ja: '✨ かしこいカササギ', vi: '✨ Chim ác là thông minh', th: '✨ นกสาลิกาฉลาด', id: '✨ Murai pintar' },
  },
  {
    id: 'songi',
    name: 'Songi',
    nameKo: '송이',
    body: '#ffc4d3',
    belly: '#fff0f4',
    ears: 'leaf',
    trait: { en: '🍡 Sweet rice cake', ko: '🍡 말랑한 떡', zh: '🍡 软糯年糕', ja: '🍡 もちもちお餅', vi: '🍡 Bánh gạo ngọt ngào', th: '🍡 ต็อกนุ่มนิ่ม', id: '🍡 Kue beras manis' },
  },
]

export const buddyById = (id: string) => BUDDIES.find((b) => b.id === id) ?? BUDDIES[0]
