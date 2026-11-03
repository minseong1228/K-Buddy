import type { Tx } from '@/lib/i18n'

export type Guide = { id: string; emoji: string; title: Tx; steps: Tx[]; ko?: string; koMeaning?: Tx }

export const GUIDES: Guide[] = [
  {
    id: 'sim',
    emoji: '📶',
    title: { en: 'SIM, eSIM & Wi-Fi', ko: '유심·eSIM·와이파이', zh: 'SIM卡·eSIM·Wi-Fi', ja: 'SIM・eSIM・Wi-Fi', vi: 'SIM, eSIM & Wi-Fi', th: 'ซิม eSIM และ Wi-Fi', id: 'SIM, eSIM & Wi-Fi' },
    steps: [
      { en: 'Easiest: buy a data eSIM online before you fly, install it at home, switch it on when you land.', ko: '가장 쉬움: 출국 전 온라인으로 데이터 eSIM 구매 → 집에서 설치 → 도착하면 켜기.', zh: '最简单：出发前在网上买数据eSIM，在家安装，落地后开启。' },
      { en: 'At Incheon/Gimpo arrivals, KT · SKT · LG U+ counters sell prepaid SIMs. Bring your passport.', ko: '인천·김포 도착장의 KT·SKT·LG U+ 카운터에서 선불 유심 판매. 여권 필요.', zh: '仁川/金浦到达大厅有KT·SKT·LG U+柜台卖预付SIM卡，需带护照。' },
      { en: 'Want Kakao T or delivery apps? Pick a plan WITH a Korean phone number — they send SMS codes.', ko: '카카오T·배달앱을 쓰려면 한국 전화번호가 있는 요금제를 고르세요. 문자 인증이 필요해요.', zh: '想用Kakao T或外卖App？选带韩国手机号的套餐，需要短信验证。' },
      { en: 'Traveling as a group? Rent a pocket Wi-Fi ("egg") at the airport and share it.', ko: '여럿이면 공항에서 포켓 와이파이(에그)를 빌려 같이 쓰세요.', zh: '多人同行？在机场租随身Wi-Fi（蛋）一起用。' },
      { en: 'Free Wi-Fi is common in subways, buses and cafes.', ko: '지하철·버스·카페에 무료 와이파이가 많아요.', zh: '地铁、公交、咖啡店常有免费Wi-Fi。' },
    ],
    ko: '데이터 유심 사고 싶어요. 한국 전화번호 있는 걸로요.',
    koMeaning: { en: 'I want a data SIM with a Korean phone number.', zh: '我想买带韩国号码的流量卡。', ja: '韓国の電話番号付きデータSIMが欲しいです。', vi: 'Tôi muốn mua SIM data có số Hàn Quốc.', th: 'ขอซิมเน็ตที่มีเบอร์เกาหลี', id: 'Saya mau SIM data dengan nomor Korea.' },
  },
  {
    id: 'maps',
    emoji: '🗺️',
    title: { en: 'Maps: Naver & Kakao', ko: '지도: 네이버·카카오맵', zh: '地图：Naver和Kakao', ja: '地図：NAVER・カカオ', vi: 'Bản đồ: Naver & Kakao', th: 'แผนที่: Naver และ Kakao', id: 'Peta: Naver & Kakao' },
    steps: [
      { en: 'Google Maps has limited walking/driving directions in Korea. Install Naver Map (English · 中文 · 日本語 menus) or Kakao Map.', ko: '구글맵은 한국에서 도보·차량 길찾기가 제한적이에요. 네이버지도(영·중·일 지원)나 카카오맵을 설치하세요.', zh: '谷歌地图在韩国步行/驾车导航有限。请安装Naver地图（有中英日界面）或Kakao地图。' },
      { en: 'Copy the Korean address of your hotel — it is the most accurate way to search and to show taxi drivers.', ko: '숙소의 한글 주소를 복사해 두세요. 검색과 택시 기사님께 보여주기에 가장 정확해요.', zh: '复制酒店的韩文地址——搜索和给司机看最准确。' },
      { en: 'Subway exits matter: check the exit number before you go up.', ko: '지하철은 출구 번호가 중요해요. 올라가기 전에 출구 번호를 확인하세요.', zh: '地铁出口号很重要，上去前先确认出口号。' },
    ],
    ko: '몇 번 출구로 나가야 해요?',
    koMeaning: { en: 'Which exit should I take?', zh: '应该从几号出口出去？', ja: '何番出口ですか？', vi: 'Tôi nên ra cửa số mấy?', th: 'ต้องออกทางออกไหน?', id: 'Keluar pintu nomor berapa?' },
  },
  {
    id: 'kakaot',
    emoji: '🚕',
    title: { en: 'Kakao T (taxi app)', ko: '카카오T (택시 앱)', zh: 'Kakao T（打车App）', ja: 'カカオT（タクシー）', vi: 'Kakao T (gọi taxi)', th: 'Kakao T (เรียกแท็กซี่)', id: 'Kakao T (taksi)' },
    steps: [
      { en: 'Install Kakao T. It has an English menu; check in the app whether your foreign card can be registered.', ko: '카카오T 설치. 영어 메뉴가 있고, 해외카드 등록 가능 여부는 앱에서 확인하세요.', zh: '安装Kakao T，有英文界面；外国卡能否绑定请在App内确认。' },
      { en: 'Put the pickup pin exactly where you stand. Drivers may call — reply in the in-app chat if you can’t talk.', ko: '출발 핀을 정확히 찍으세요. 기사님이 전화하면 앱 채팅으로 답해도 돼요.', zh: '把上车点定准。司机可能来电，不方便说话可用App内聊天。' },
      { en: 'Uber also works in Seoul and is familiar for many visitors.', ko: '서울에선 우버 앱도 쓸 수 있어요.', zh: '在首尔也可以用Uber。' },
      { en: 'Lots of luggage? Choose a large/van taxi option.', ko: '짐이 많으면 대형·밴 택시를 고르세요.', zh: '行李多？选大型/面包车出租车。' },
    ],
    ko: '카카오T로 부른 사람이에요.',
    koMeaning: { en: 'I’m the one who called on Kakao T.', zh: '我是用Kakao T叫车的人。', ja: 'カカオTで呼んだ者です。', vi: 'Tôi là người gọi xe qua Kakao T.', th: 'ฉันเป็นคนเรียกผ่าน Kakao T', id: 'Saya yang pesan lewat Kakao T.' },
  },
  {
    id: 'delivery',
    emoji: '🛵',
    title: { en: 'Food delivery apps', ko: '배달앱', zh: '外卖App', ja: 'デリバリーアプリ', vi: 'Ứng dụng giao đồ ăn', th: 'แอปส่งอาหาร', id: 'Aplikasi pesan antar' },
    steps: [
      { en: 'Main apps: Baemin, Coupang Eats, Yogiyo. Most need a Korean phone number; foreign card support varies.', ko: '대표 앱: 배달의민족, 쿠팡이츠, 요기요. 대부분 한국 번호가 필요하고 해외카드 지원은 앱마다 달라요.', zh: '主要App：配达民族、Coupang Eats、Yogiyo。多数需要韩国号码，外国卡支持情况不一。' },
      { en: 'No Korean number? Ask your hotel front desk to order for you.', ko: '한국 번호가 없으면 숙소 프런트에 대신 주문을 부탁하세요.', zh: '没有韩国号码？请酒店前台帮你点。' },
      { en: 'Write the address in Korean + room number. Many hotels ask you to pick up in the lobby.', ko: '주소는 한글 + 호수로 쓰세요. 로비에서 받아야 하는 숙소가 많아요.', zh: '地址写韩文+房间号。很多酒店要求在大堂取餐。' },
      { en: 'Check the halal/veggie tab before ordering if you have food rules.', ko: '음식 제한이 있다면 주문 전에 음식 탭에서 확인하세요.', zh: '有饮食禁忌的话，下单前先在饮食页检查。' },
    ],
    ko: '로비로 내려갈게요. 도착하면 전화 주세요.',
    koMeaning: { en: 'I’ll come down to the lobby. Call me when you arrive.', zh: '我下楼到大堂取，到了请打电话。', ja: 'ロビーに降ります。着いたら電話ください。', vi: 'Tôi sẽ xuống sảnh. Đến nơi thì gọi tôi.', th: 'จะลงไปที่ล็อบบี้ ถึงแล้วโทรมานะ', id: 'Saya turun ke lobi. Telepon saat sampai.' },
  },
  {
    id: 'subway',
    emoji: '🚇',
    title: { en: 'Subway & T-money', ko: '지하철·티머니', zh: '地铁和T-money', ja: '地下鉄・T-money', vi: 'Tàu điện & T-money', th: 'รถไฟใต้ดินและ T-money', id: 'Kereta & T-money' },
    steps: [
      { en: 'Buy a T-money card at any convenience store and top it up with cash (or use WOWPASS).', ko: '편의점에서 티머니 카드를 사서 현금으로 충전하세요(와우패스도 가능).', zh: '在便利店买T-money卡并用现金充值（或用WOWPASS）。' },
      { en: 'Tap in and out. Bus ↔ subway transfers are free within about 30 minutes.', ko: '탈 때·내릴 때 모두 태그. 약 30분 안에 버스↔지하철 환승 무료.', zh: '进出站都要刷卡。约30分钟内公交↔地铁换乘免费。' },
      { en: 'Last trains are around midnight — plan a taxi for later.', ko: '막차는 자정 무렵이에요. 늦으면 택시를 준비하세요.', zh: '末班车约在午夜，更晚请安排出租车。' },
    ],
    ko: '티머니 카드 하나 주세요. 만 원 충전해 주세요.',
    koMeaning: { en: 'One T-money card, and top up 10,000 won please.', zh: '请给我一张T-money卡，充一万韩元。', ja: 'T-moneyカードを1枚、1万ウォンチャージしてください。', vi: 'Cho tôi một thẻ T-money, nạp 10.000 won.', th: 'ขอบัตร T-money หนึ่งใบ เติม 10,000 วอน', id: 'Satu kartu T-money, isi 10.000 won.' },
  },
  {
    id: 'translate',
    emoji: '🔤',
    title: { en: 'Translator apps', ko: '번역 앱', zh: '翻译App', ja: '翻訳アプリ', vi: 'Ứng dụng dịch', th: 'แอปแปลภาษา', id: 'Aplikasi terjemahan' },
    steps: [
      { en: 'Papago (by Naver) is strong for Korean. Use its camera mode on menus and signs.', ko: '파파고는 한국어 번역에 강해요. 메뉴판·간판은 카메라 모드로 찍으세요.', zh: 'Papago韩语翻译很强，菜单和招牌可用拍照翻译。' },
      { en: 'Or use K-Buddy: Talk tab for ordering, Check tab for fine print.', ko: '또는 K-Buddy의 대화 탭(주문), 꼼꼼체크 탭(작은 글씨)을 쓰세요.', zh: '或使用K-Buddy：沟通页点单，查小字页看细则。' },
    ],
  },
]

export const COMING_SOON: { emoji: string; title: Tx; desc: Tx }[] = [
  {
    emoji: '🎉',
    title: { en: 'Party invite', ko: '파티 초대', zh: '组队邀请', ja: 'パーティー招待', vi: 'Mời nhóm', th: 'ชวนเพื่อน', id: 'Undang grup' },
    desc: { en: 'Share a link, travel together, see where friends are.', ko: '링크로 친구를 초대해 같이 여행하고 위치를 공유해요.', zh: '分享链接，一起旅行，查看朋友位置。' },
  },
  {
    emoji: '🧭',
    title: { en: 'Live routes on the map', ko: '지도 실시간 길찾기', zh: '地图实时路线', ja: '地図でリアルタイム経路', vi: 'Chỉ đường trực tiếp', th: 'นำทางแบบเรียลไทม์', id: 'Rute langsung di peta' },
    desc: { en: 'Kakao/Naver Map with step-free and gentle-slope routes.', ko: '카카오·네이버 지도로 계단 없고 완만한 길 안내.', zh: '用Kakao/Naver地图规划无台阶、坡缓的路线。' },
  },
  {
    emoji: '📲',
    title: { en: 'One-tap Kakao T & delivery', ko: '카카오T·배달 바로 연결', zh: '一键Kakao T和外卖', ja: 'カカオT・デリバリー連携', vi: 'Gọi Kakao T & giao đồ ăn 1 chạm', th: 'เรียก Kakao T และส่งอาหารในคลิกเดียว', id: 'Kakao T & antar sekali ketuk' },
    desc: { en: 'Open the app with your destination already filled in.', ko: '목적지가 입력된 상태로 앱을 바로 열어요.', zh: '直接打开App并自动填好目的地。' },
  },
]
