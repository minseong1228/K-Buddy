import type { Tx } from '@/lib/i18n'

export type Severity = 'danger' | 'warn'

export type FinePrintRule = { pattern: RegExp; label: Tx; explain: Tx; severity: Severity }

export const FINE_PRINT_RULES: FinePrintRule[] = [
  { pattern: /부가세\s*(별도|미포함)|VAT\s*별도/g, severity: 'danger', label: { en: 'VAT not included', ko: '부가세 별도', zh: '不含增值税' }, explain: { en: 'Add 10% to the shown price.', ko: '표시 가격에 10% 추가.', zh: '实际价格需再加10%。' } },
  { pattern: /봉사료|서비스\s*차지|service charge/gi, severity: 'danger', label: { en: 'Service charge', ko: '봉사료', zh: '服务费' }, explain: { en: 'Extra fee on top of the menu price. Tipping is not normal in Korea.', ko: '메뉴 가격 외 추가 요금. 한국은 팁 문화 없음.', zh: '菜单价外另收费用。韩国一般不需要小费。' } },
  { pattern: /자릿세|테이블\s*차지|기본\s*안주/g, severity: 'danger', label: { en: 'Table / cover charge', ko: '자릿세', zh: '座位费' }, explain: { en: 'You pay just for sitting (common in bars).', ko: '앉기만 해도 요금(술집에 흔함).', zh: '仅入座就要收费（酒吧常见）。' } },
  { pattern: /시가/g, severity: 'danger', label: { en: 'Market price', ko: '시가', zh: '时价' }, explain: { en: 'No fixed price — ask the exact price BEFORE ordering.', ko: '정가 없음 — 주문 전 가격 꼭 확인.', zh: '无固定价格——点单前务必问清价格。' } },
  { pattern: /1인\s*1\s*(메뉴|음료|잔)/g, severity: 'warn', label: { en: 'One item per person', ko: '1인 1메뉴', zh: '每人须点一份' }, explain: { en: 'Every person in your group must order something.', ko: '일행 모두 하나씩 주문해야 함.', zh: '同行每人都必须点单。' } },
  { pattern: /\d\s*인분\s*이상|1인분\s*(주문\s*)?불가/g, severity: 'warn', label: { en: 'Minimum servings', ko: '최소 인분', zh: '最少份数' }, explain: { en: "You can't order just one portion (common for BBQ).", ko: '1인분 주문 불가(고깃집에 흔함).', zh: '不能只点一人份（烤肉店常见）。' } },
  { pattern: /최소\s*주문|최소\s*금액/g, severity: 'warn', label: { en: 'Minimum order', ko: '최소 주문', zh: '最低消费' }, explain: { en: 'You must spend at least the stated amount.', ko: '정해진 금액 이상 주문해야 함.', zh: '须达到规定金额。' } },
  { pattern: /[0-9,]+\s*원\s*(?:~|부터)|~\s*[0-9,]+\s*원/g, severity: 'warn', label: { en: '"Starting from" price', ko: '"~부터" 가격', zh: '起价' }, explain: { en: 'The big number is the cheapest option only.', ko: '크게 쓴 가격은 가장 싼 옵션일 뿐.', zh: '显示的价格只是最低档。' } },
  { pattern: /현금\s*(가|결제\s*시|할인)/g, severity: 'warn', label: { en: 'Cash price', ko: '현금가', zh: '现金价' }, explain: { en: 'Advertised price is for cash; card costs more.', ko: '광고 가격은 현금 기준, 카드는 더 비쌈.', zh: '宣传价为现金价，刷卡更贵。' } },
  { pattern: /카드\s*(결제\s*)?(불가|안\s*됨)|현금\s*(만|only)/gi, severity: 'danger', label: { en: 'Cash only', ko: '현금만', zh: '仅收现金' }, explain: { en: 'No cards / mobile pay. Get cash from a Global ATM first.', ko: '카드·간편결제 불가. 글로벌 ATM에서 먼저 출금.', zh: '不能刷卡/移动支付。先去国际ATM取现。' } },
  { pattern: /환불\s*(불가|안\s*됨)|교환\s*(불가|안\s*됨)/g, severity: 'danger', label: { en: 'No refund / exchange', ko: '환불·교환 불가', zh: '不退不换' }, explain: { en: 'Once paid, you cannot get money back.', ko: '결제 후 환불 안 됨.', zh: '付款后不能退款。' } },
  { pattern: /추가\s*(요금|금액|비용)|별도\s*(요금|구매|판매)/g, severity: 'warn', label: { en: 'Extra charge', ko: '추가 요금', zh: '额外收费' }, explain: { en: 'Some items cost extra (e.g. refills, sides, delivery).', ko: '리필·사이드·배달 등 추가 비용.', zh: '部分项目另收费（续杯、配菜、配送等）。' } },
  { pattern: /선착순|한정\s*(수량|판매)|조기\s*(품절|마감)/g, severity: 'warn', label: { en: 'Limited quantity', ko: '한정 수량', zh: '限量' }, explain: { en: 'Deal may end before the date shown.', ko: '표시 기간 전에 끝날 수 있음.', zh: '可能在截止日前售罄。' } },
  { pattern: /조건|단[,.:]|\*/g, severity: 'warn', label: { en: 'Conditions apply', ko: '조건 있음', zh: '有附加条件' }, explain: { en: 'Look for small text marked * or 단 (“however”).', ko: '* 표시나 "단," 뒤의 작은 글씨 확인.', zh: '注意带*或“단(但是)”的小字。' } },
  { pattern: /외국인\s*(요금|가격)/g, severity: 'danger', label: { en: 'Foreigner price', ko: '외국인 요금', zh: '外国人价格' }, explain: { en: 'Different price for foreigners — compare with the Korean price.', ko: '외국인 별도 가격 — 내국인 가격과 비교.', zh: '外国人单独定价——请与本地价格比较。' } },
  { pattern: /자동\s*(결제|연장|갱신)/g, severity: 'danger', label: { en: 'Auto-renewal', ko: '자동 결제', zh: '自动续费' }, explain: { en: 'Your card will be charged again automatically.', ko: '카드가 자동으로 다시 결제됨.', zh: '会自动再次扣款。' } },
]

export const SAMPLE_ADS = [
  '삼겹살 9,900원~ (2인분 이상 주문 가능) *부가세 별도',
  '오늘만! 아메리카노 1,500원 · 1인 1음료 · 카드 결제 불가',
  '활 랍스터 시가 / 자릿세 5,000원 / 봉사료 10%',
  '면세 화장품 70% 할인 선착순 100명, 단 환불 불가',
]
