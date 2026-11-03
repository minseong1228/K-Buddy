import type { Tx } from '@/lib/i18n'

export type TripInput = { km: number; people: number; luggage: boolean; night: boolean; mobility: boolean }

export type ModeResult = {
  id: string
  emoji: string
  name: Tx
  minutes: number
  cost: number
  available: boolean
  notes: Tx[]
  score: number
}

/** Seoul taxi estimate (base ₩4,800 for 1.6km, ~₩763/km after, +20% late night). */
export function taxiFare(km: number, night = false) {
  return Math.round(((4800 + Math.max(0, km - 1.6) * 763) * (night ? 1.2 : 1)) / 100) * 100
}

/** Straight-line km between two points × 1.3 for real roads. */
export function roadKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h)) * 1.3
}

export function planTrip({ km, people, luggage, night, mobility }: TripInput): ModeResult[] {
  const subwayFare = 1550 + Math.max(0, Math.ceil((km - 10) / 5)) * 100

  const modes: Omit<ModeResult, 'score'>[] = [
    {
      id: 'walk',
      emoji: '🚶',
      name: { en: 'Walk', ko: '도보', zh: '步行' },
      minutes: Math.round(km * 14),
      cost: 0,
      available: km <= 2 && !mobility,
      notes: [{ en: 'Use Naver Map / Kakao Map for walking routes.', ko: '도보 길찾기는 네이버·카카오맵 사용.', zh: '步行路线请用Naver地图/Kakao地图。' }],
    },
    {
      id: 'subway',
      emoji: '🚇',
      name: { en: 'Subway', ko: '지하철', zh: '地铁' },
      minutes: Math.round(10 + km * 2.2),
      cost: subwayFare * people,
      available: !night,
      notes: [
        { en: 'Tap T-money / WOWPASS. Transfers are free within 30 min.', ko: '티머니·와우패스 태그. 30분 내 환승 무료.', zh: '刷T-money/WOWPASS，30分钟内换乘免费。' },
        ...(mobility ? [{ en: 'Use exits with the ♿ elevator icon.', ko: '♿ 엘리베이터 표시 출구 이용.', zh: '请走带♿电梯标志的出口。' }] : []),
        ...(luggage ? [{ en: 'Stairs at transfers can be hard with luggage.', ko: '환승 계단이 많아 짐 있으면 힘듦.', zh: '换乘楼梯多，带行李不便。' }] : []),
        ...(night ? [{ en: 'Subway stops around midnight.', ko: '지하철은 자정 무렵 운행 종료.', zh: '地铁约午夜停运。' }] : []),
      ],
    },
    {
      id: 'bus',
      emoji: '🚌',
      name: { en: 'Bus', ko: '버스', zh: '公交' },
      minutes: Math.round(10 + km * 3.5),
      cost: 1500 * people,
      available: !mobility || km < 15,
      notes: [
        { en: 'Tap card when getting ON and OFF for free transfers.', ko: '승하차 모두 태그해야 환승 무료.', zh: '上下车都要刷卡，才能免费换乘。' },
        ...(night ? [{ en: 'Only night "N" buses run late.', ko: '심야엔 N버스만 운행.', zh: '深夜只有“N”字头夜班车。' }] : []),
        ...(mobility ? [{ en: 'Look for low-floor buses (저상버스).', ko: '저상버스 이용.', zh: '请找低底盘公交（저상버스）。' }] : []),
      ],
    },
    {
      id: 'taxi',
      emoji: '🚕',
      name: { en: 'Taxi', ko: '택시', zh: '出租车' },
      minutes: Math.round(5 + km * 2.5),
      cost: taxiFare(km, night) * Math.ceil(people / 4),
      available: true,
      notes: [
        { en: 'Use a taxi app so the route & fare are recorded.', ko: '택시 앱으로 호출하면 경로·요금 기록이 남아요.', zh: '用叫车App，路线和费用有记录。' },
        ...(night ? [{ en: 'Late-night surcharge (~20–40%).', ko: '심야 할증(약 20~40%).', zh: '深夜加价约20–40%。' }] : []),
        { en: 'Say “미터기 켜 주세요” if the meter is off.', ko: '미터기가 꺼져 있으면 “미터기 켜 주세요”.', zh: '如未打表，请说“미터기 켜 주세요”。' },
      ],
    },
  ]

  return modes
    .map((m) => {
      let score = m.minutes * 150 + m.cost
      if (luggage && (m.id === 'subway' || m.id === 'bus' || m.id === 'walk')) score += 4000
      if (mobility && m.id !== 'taxi') score += 6000
      return { ...m, score: m.available ? score : Infinity }
    })
    .sort((a, b) => a.score - b.score)
}

export const STEEP_SPOTS: { place: Tx; issue: Tx; tip: Tx }[] = [
  {
    place: { en: 'N Seoul Tower (Namsan)', ko: 'N서울타워(남산)', zh: '南山首尔塔' },
    issue: { en: 'Long steep stairs from Myeongdong', ko: '명동에서 긴 급경사 계단', zh: '从明洞上山有很长的陡台阶' },
    tip: { en: 'Take the Namsan circulation bus or cable car instead.', ko: '남산 순환버스나 케이블카 이용.', zh: '改乘南山循环巴士或缆车。' },
  },
  {
    place: { en: 'Bukchon Hanok Village', ko: '북촌 한옥마을', zh: '北村韩屋村' },
    issue: { en: 'Steep, narrow alleys & slopes', ko: '좁고 가파른 골목', zh: '小巷又陡又窄' },
    tip: { en: 'Ride a green village bus up from Anguk, then walk downhill.', ko: '안국역에서 마을버스로 올라가 내리막으로 걷기.', zh: '从安国站坐绿色小巴上去，再往下走。' },
  },
  {
    place: { en: 'Ihwa Mural Village', ko: '이화 벽화마을', zh: '梨花洞壁画村' },
    issue: { en: 'Many stairs, no handrails in spots', ko: '계단 많고 난간 없는 곳 있음', zh: '台阶多，部分无扶手' },
    tip: { en: 'Taxi to Naksan Park at the top, walk down.', ko: '택시로 낙산공원(정상)까지 가서 내려오기.', zh: '打车到山顶骆山公园，再往下走。' },
  },
  {
    place: { en: 'Gamcheon Culture Village (Busan)', ko: '감천문화마을(부산)', zh: '甘川洞文化村（釜山）' },
    issue: { en: 'Built on a hillside', ko: '산비탈 마을', zh: '建在山坡上' },
    tip: { en: 'Take the local village bus to the top entrance.', ko: '마을버스로 위쪽 입구까지.', zh: '坐社区小巴到上方入口。' },
  },
]

export const ETIQUETTE: { emoji: string; title: Tx; body: Tx }[] = [
  { emoji: '🧍', title: { en: 'Never cut the line', ko: '새치기 금지', zh: '不要插队' }, body: { en: 'Koreans queue strictly — at bus stops, cafes, and subway doors. Cutting in (새치기) causes real anger.', ko: '버스정류장·카페·지하철 문 앞에서 줄을 엄격히 서요. 새치기하면 크게 불쾌해해요.', zh: '韩国人严格排队——公交站、咖啡店、地铁门口都一样。插队（새치기）会引起不满。' } },
  { emoji: '🩷', title: { en: 'Pink & priority seats', ko: '임산부석·노약자석', zh: '粉色座位和爱心座' }, body: { en: 'Pink subway seats are for pregnant women; end seats are for elderly/disabled. Leave them empty.', ko: '분홍 좌석은 임산부석, 끝자리는 노약자석. 비워 두세요.', zh: '地铁粉色座位留给孕妇，两端座位给老人/残障人士，请空着。' } },
  { emoji: '🤫', title: { en: 'Quiet on transport', ko: '대중교통에선 조용히', zh: '公共交通保持安静' }, body: { en: 'No loud calls or speakerphone videos on subway/bus.', ko: '지하철·버스에서 큰 통화, 스피커 영상 금지.', zh: '地铁/公交上不要大声打电话或外放视频。' } },
  { emoji: '💸', title: { en: 'No tipping', ko: '팁 문화 없음', zh: '不需要小费' }, body: { en: 'Prices include service. Watch for “service charge” in fine print.', ko: '가격에 서비스 포함. 작은 글씨의 봉사료는 확인.', zh: '价格已含服务。注意小字里的“服务费”。' } },
  { emoji: '🗑️', title: { en: 'Few public trash cans', ko: '공공 쓰레기통이 적음', zh: '公共垃圾桶少' }, body: { en: 'Carry your trash; convenience stores often have bins.', ko: '쓰레기는 들고 다니기. 편의점에 쓰레기통 있는 경우 많음.', zh: '垃圾随身带；便利店通常有垃圾桶。' } },
]

export const SAFETY_TIPS: Tx[] = [
  { en: 'Korea is generally safe at night, but use main lit streets and avoid empty alleys late.', ko: '한국은 밤에도 대체로 안전하지만 늦은 시간엔 밝은 큰길로 다니세요.', zh: '韩国夜间总体安全，但深夜请走有灯的大路，避开僻静小巷。' },
  { en: 'Leaving a phone on a cafe table is common — but watch bags in crowded Myeongdong/Hongdae.', ko: '카페에 폰 두고 가는 게 흔하지만, 붐비는 명동·홍대에선 가방 조심.', zh: '在咖啡店桌上放手机很常见，但在明洞/弘大人多处要看好包。' },
  { en: 'Drinks: never leave your glass unattended in clubs.', ko: '클럽에선 잔을 눈에서 떼지 마세요.', zh: '在夜店不要让饮料离开视线。' },
  { en: 'Lost items: check LOST112 or ask the station office.', ko: '분실물: LOST112 또는 역무실 문의.', zh: '失物：可查LOST112或询问车站办公室。' },
]
