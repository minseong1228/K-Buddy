import type { Tx } from '@/lib/i18n'

export type WalletId = 'wechat' | 'alipay' | 'card' | 'cash'

export type Step = { title: Tx; body: Tx; ko?: string }

export const WALLETS: { id: WalletId; emoji: string; name: Tx; steps: Step[] }[] = [
  {
    id: 'wechat',
    emoji: '💚',
    name: { en: 'WeChat Pay', ko: '위챗페이', zh: '微信支付' },
    steps: [
      {
        title: { en: 'Where it usually works', ko: '주로 되는 곳', zh: '常见可用场所' },
        body: { en: 'Duty-free shops, big department stores, Olive Young, many tourist-area stores. Look for the WeChat Pay sticker at the counter.', ko: '면세점, 대형 백화점, 올리브영, 관광지 상점. 계산대의 위챗페이 스티커를 확인하세요.', zh: '免税店、大型百货、Olive Young、旅游区商店。收银台有微信支付标志即可使用。' },
        ko: '위챗페이 돼요?',
      },
      {
        title: { en: 'Small shops & street food: often NO', ko: '작은 가게·길거리 음식: 대부분 안 됨', zh: '小店、路边摊：多数不行' },
        body: { en: 'Local restaurants, markets and taxis often take only Korean cards or cash. Carry ₩30,000–50,000 cash.', ko: '동네 식당·시장·택시는 국내카드나 현금만 받는 곳이 많아요. 현금 3~5만원 준비.', zh: '本地餐馆、市场、出租车多只收韩国卡或现金。建议带3–5万韩元现金。' },
      },
      {
        title: { en: 'Need cash? WeChat cannot withdraw in Korea', ko: '현금 필요? 위챗으로는 한국에서 출금 불가', zh: '需要现金？微信无法在韩国取现' },
        body: { en: 'Use a UnionPay card at a "Global ATM" (in convenience stores, Woori / Shinhan / KB banks), or exchange CNY cash at Myeongdong exchange booths (better rate than airport).', ko: '은련카드로 "글로벌 ATM"(편의점, 우리·신한·KB)에서 출금하거나, 명동 환전소에서 위안화 환전(공항보다 유리).', zh: '用银联卡在“Global ATM”（便利店、友利/新韩/国民银行）取现，或在明洞换钱所兑换人民币现金（汇率比机场好）。' },
        ko: '근처에 글로벌 ATM 있어요?',
      },
      {
        title: { en: 'Easiest: WOWPASS card', ko: '가장 쉬움: 와우패스 카드', zh: '最省事：WOWPASS卡' },
        body: { en: 'Kiosks in Myeongdong, hotels and subway stations turn foreign cash into a prepaid card that works almost everywhere + T-money for transit.', ko: '명동·호텔·지하철역 키오스크에서 외화를 선불카드로 충전. 거의 모든 곳 결제 + 교통카드 기능.', zh: '明洞、酒店、地铁站的自助机可把外币现金充值成预付卡，几乎所有地方可用，还带交通卡功能。' },
      },
    ],
  },
  {
    id: 'alipay',
    emoji: '💙',
    name: { en: 'Alipay', ko: '알리페이', zh: '支付宝' },
    steps: [
      {
        title: { en: 'Look for Alipay+ signs', ko: 'Alipay+ 표시 찾기', zh: '认准Alipay+标志' },
        body: { en: 'Alipay works through Alipay+ at many shops, convenience stores and cafes. Show your payment QR, staff scans it.', ko: 'Alipay+ 가맹 상점·편의점·카페에서 사용 가능. 결제 QR을 보여주면 직원이 스캔.', zh: '支付宝通过Alipay+在许多商店、便利店、咖啡店可用。出示付款码，店员扫码。' },
        ko: '알리페이 돼요?',
      },
      {
        title: { en: 'Taxi', ko: '택시', zh: '出租车' },
        body: { en: 'Book through a taxi app that accepts Alipay, or prepare cash / card. Street taxis may not take it.', ko: '알리페이 되는 택시 앱으로 호출하거나 현금·카드 준비. 길에서 잡은 택시는 안 될 수 있음.', zh: '使用支持支付宝的叫车App，或准备现金/银行卡。路边打车可能不支持。' },
      },
      {
        title: { en: 'Cash backup', ko: '현금 비상용', zh: '现金备用' },
        body: { en: 'Same as WeChat: Global ATM with UnionPay, or exchange booths.', ko: '위챗과 동일: 은련카드로 글로벌 ATM, 또는 환전소.', zh: '与微信相同：银联卡在Global ATM取现，或去换钱所。' },
        ko: '근처에 글로벌 ATM 있어요?',
      },
    ],
  },
  {
    id: 'card',
    emoji: '💳',
    name: { en: 'Visa / Master card', ko: '비자·마스터카드', zh: 'Visa/万事达卡' },
    steps: [
      {
        title: { en: 'Works almost everywhere', ko: '거의 어디서나 사용', zh: '几乎处处可用' },
        body: { en: 'Korea is very card-friendly. Some small shops may reject foreign cards — keep a little cash.', ko: '한국은 카드 결제가 보편적. 일부 작은 가게는 해외카드 불가 — 소액 현금 준비.', zh: '韩国刷卡非常普及。个别小店可能不收外国卡——带少量现金。' },
        ko: '해외 카드 결제 돼요?',
      },
      {
        title: { en: 'T-money top-up is cash only', ko: '티머니 충전은 현금만', zh: '交通卡充值只收现金' },
        body: { en: 'Subway/convenience store top-up machines usually need cash.', ko: '지하철·편의점 충전은 보통 현금 필요.', zh: '地铁站/便利店充值通常只收现金。' },
      },
    ],
  },
  {
    id: 'cash',
    emoji: '💵',
    name: { en: 'Foreign cash', ko: '외화 현금', zh: '外币现金' },
    steps: [
      {
        title: { en: 'Exchange in the city', ko: '시내에서 환전', zh: '在市区兑换' },
        body: { en: 'Myeongdong / Hongdae private exchange booths usually beat airport rates. Bring your passport.', ko: '명동·홍대 사설 환전소가 공항보다 유리. 여권 지참.', zh: '明洞/弘大的私人换钱所汇率通常比机场好。请带护照。' },
      },
      {
        title: { en: 'Or load a WOWPASS', ko: '또는 와우패스 충전', zh: '或充值WOWPASS' },
        body: { en: 'Turn cash into a card so you can pay where cash is awkward.', ko: '현금을 카드로 바꿔 편하게 결제.', zh: '把现金变成卡，方便在不便用现金的地方付款。' },
      },
    ],
  },
]

export const CURRENCIES = [
  { code: 'CNY', name: { en: 'Chinese yuan', ko: '위안', zh: '人民币' } },
  { code: 'USD', name: { en: 'US dollar', ko: '달러', zh: '美元' } },
  { code: 'JPY', name: { en: 'Japanese yen', ko: '엔', zh: '日元' } },
  { code: 'EUR', name: { en: 'Euro', ko: '유로', zh: '欧元' } },
  { code: 'VND', name: { en: 'Vietnamese dong', ko: '동', zh: '越南盾', vi: 'Việt Nam đồng' } },
  { code: 'THB', name: { en: 'Thai baht', ko: '바트', zh: '泰铢', th: 'บาท' } },
  { code: 'IDR', name: { en: 'Indonesian rupiah', ko: '루피아', zh: '印尼盾', id: 'Rupiah' } },
]
