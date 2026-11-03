import { SAMPLE_LABELS } from '@/data/food'
import { SAMPLE_ADS } from '@/data/finePrint'
import type { KBuddyApi, Place } from './types'

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms))
const pick = <T>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]

const PLACES: Place[] = [
  { id: 'a1', kind: 'atm', name: '7-Eleven Global ATM', nameKo: '세븐일레븐 명동점', distanceM: 120, note: { en: 'UnionPay · Visa · Master', ko: '은련·비자·마스터', zh: '银联·Visa·万事达' }, lat: 37.5637, lng: 126.984 },
  { id: 'a2', kind: 'atm', name: 'Woori Bank Global ATM', nameKo: '우리은행 명동지점', distanceM: 340, note: { en: 'Open 24h · Chinese menu', ko: '24시간 · 중국어 메뉴', zh: '24小时 · 有中文界面' }, lat: 37.5642, lng: 126.9855 },
  { id: 'a3', kind: 'atm', name: 'WOWPASS Kiosk', nameKo: '와우패스 명동역 4번출구', distanceM: 410, note: { en: 'Cash → prepaid card', ko: '현금 → 선불카드', zh: '现金 → 预付卡' }, lat: 37.5609, lng: 126.9862 },
  { id: 'h1', kind: 'halal', name: 'Eid Halal Korean Food', nameKo: '이드 할랄 코리안 푸드', distanceM: 650, note: { en: 'Halal certified · Korean dishes', ko: '할랄 인증 · 한식', zh: '清真认证 · 韩餐' }, lat: 37.5345, lng: 126.9946 },
  { id: 'h2', kind: 'halal', name: 'Itaewon Kebab House', nameKo: '이태원 케밥 하우스', distanceM: 900, note: { en: 'Muslim-friendly · no alcohol', ko: '무슬림 친화 · 주류 없음', zh: '穆斯林友好 · 无酒' }, lat: 37.534, lng: 126.9937 },
  { id: 'h3', kind: 'halal', name: 'Veggie Bibimbap Seoul', nameKo: '채식 비빔밥 서울', distanceM: 1200, note: { en: 'Pork-free · vegetarian menu', ko: '돼지고기 없음 · 채식 메뉴', zh: '无猪肉 · 有素食' }, lat: 37.57, lng: 126.983 },
  { id: 'w1', kind: 'wechat', name: 'Olive Young Myeongdong', nameKo: '올리브영 명동본점', distanceM: 200, note: { en: 'WeChat Pay · Alipay', ko: '위챗페이 · 알리페이', zh: '微信支付 · 支付宝' }, lat: 37.5636, lng: 126.9845 },
  { id: 'w2', kind: 'wechat', name: 'Lotte Duty Free', nameKo: '롯데면세점 본점', distanceM: 550, note: { en: 'WeChat Pay · UnionPay', ko: '위챗페이 · 은련', zh: '微信支付 · 银联' }, lat: 37.565, lng: 126.981 },
  { id: 'l1', kind: 'alipay', name: 'CU Convenience Store', nameKo: 'CU 명동중앙점', distanceM: 90, note: { en: 'Alipay+ QR', ko: 'Alipay+ QR 결제', zh: 'Alipay+扫码' }, lat: 37.5631, lng: 126.9851 },
  { id: 'l2', kind: 'alipay', name: 'Mega Coffee', nameKo: '메가커피 명동점', distanceM: 260, note: { en: 'Alipay+ · Kakao Pay QR', ko: 'Alipay+ · 카카오페이 QR', zh: 'Alipay+ · KakaoPay码' }, lat: 37.5627, lng: 126.983 },
]

export const mockApi: KBuddyApi = {
  async getExchangeRates() {
    await delay(300)
    return { updatedAt: new Date().toISOString(), krwPer: { CNY: 190, USD: 1380, JPY: 9.2, EUR: 1500, VND: 0.054, THB: 40, IDR: 0.085 } }
  },
  async findNearby(kind) {
    await delay()
    return PLACES.filter((p) => p.kind === kind).sort((a, b) => a.distanceM - b.distanceM)
  },
  async readText(_image, kind) {
    await delay(1200)
    return pick(kind === 'label' ? SAMPLE_LABELS : SAMPLE_ADS)
  },
  async searchPlace(query) {
    await delay()
    const all = [
      { id: 'm1', name: '강남역', address: '서울 강남구 강남대로 396', lat: 37.4979, lng: 127.0276 },
      { id: 'm2', name: '경복궁', address: '서울 종로구 사직로 161', lat: 37.5796, lng: 126.977 },
      { id: 'm3', name: '홍대입구역', address: '서울 마포구 양화로 160', lat: 37.5571, lng: 126.9245 },
      { id: 'm4', name: 'N서울타워', address: '서울 용산구 남산공원길 105', lat: 37.5512, lng: 126.9882 },
    ]
    return all.filter((p) => p.name.includes(query)).concat(all).slice(0, 4)
  },
  async transitRoutes() {
    await delay()
    return [
      {
        minutes: 38,
        fare: 1650,
        transfers: 2,
        walkM: 281,
        legs: [
          { mode: 'walk', minutes: 4 },
          { mode: 'subway', minutes: 2, line: '2호선', from: '을지로입구', to: '을지로3가', stops: 1 },
          { mode: 'subway', minutes: 19, line: '3호선', from: '을지로3가', to: '교대', stops: 10 },
          { mode: 'subway', minutes: 2, line: '2호선', from: '교대', to: '강남', stops: 1 },
          { mode: 'walk', minutes: 1 },
        ],
      },
    ]
  },
  async checkLinks(urls) {
    await delay(200)
    return urls.map((url) => ({ url, threat: null }))
  },
  async translate(text) {
    await delay()
    return `[MOCK] ${text}`
  },
  async explain() {
    await delay()
    return { verdict: 'warn', summary: '[MOCK] AI explanation', points: [], replies: [] }
  },
}
