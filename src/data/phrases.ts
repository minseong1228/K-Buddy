import type { Tx } from '@/lib/i18n'

/** A Korean sentence + its meaning in the user's language (`m`). */
export type Phrase = { ko: string; roman: string; m: Tx }

export type Scenario = { id: string; emoji: string; name: Tx; phrases: Phrase[] }

const p = (ko: string, roman: string, m: Tx): Phrase => ({ ko, roman, m })

export const SCENARIOS: Scenario[] = [
  {
    id: 'cafe',
    emoji: '☕',
    name: { en: 'Cafe', ko: '카페', zh: '咖啡店', ja: 'カフェ', vi: 'Quán cà phê', th: 'คาเฟ่', id: 'Kafe' },
    phrases: [
      p('주문할게요.', 'ju-mun-hal-ge-yo', { en: "I'd like to order.", zh: '我要点单。', ja: '注文します。', vi: 'Tôi muốn gọi món.', th: 'ขอสั่งค่ะ/ครับ', id: 'Saya mau pesan.' }),
      p('키오스크 사용이 어려워요. 직접 주문해도 될까요?', 'ki-o-seu-keu sa-yong-i eo-ryeo-wo-yo', { en: 'The kiosk is hard for me. Can I order with you?', zh: '自助点单机我不会用，可以直接跟您点吗？', ja: 'キオスクが難しいです。直接注文してもいいですか？', vi: 'Máy kiosk khó dùng. Tôi gọi trực tiếp được không?', th: 'ใช้ตู้สั่งไม่เป็น สั่งกับคุณได้ไหม?', id: 'Kiosnya sulit. Boleh pesan langsung?' }),
      p('덜 달게 해 주세요.', 'deol dal-ge hae ju-se-yo', { en: 'Less sweet, please.', zh: '请少放糖。', ja: '甘さ控えめで。', vi: 'Ít ngọt thôi.', th: 'หวานน้อยค่ะ', id: 'Kurangi manis.' }),
      p('얼음 적게 주세요.', 'eo-reum jeok-ge ju-se-yo', { en: 'Less ice, please.', zh: '请少放冰。', ja: '氷少なめで。', vi: 'Ít đá thôi.', th: 'น้ำแข็งน้อย', id: 'Es sedikit saja.' }),
      p('와이파이 비밀번호가 뭐예요?', 'wa-i-pa-i bi-mil-beon-ho-ga mwo-ye-yo', { en: "What's the Wi-Fi password?", zh: 'Wi-Fi密码是多少？', ja: 'Wi-Fiのパスワードは？', vi: 'Mật khẩu Wi-Fi là gì?', th: 'รหัส Wi-Fi คืออะไร?', id: 'Apa kata sandi Wi-Fi?' }),
      p('화장실 어디예요?', 'hwa-jang-sil eo-di-ye-yo', { en: 'Where is the toilet?', zh: '洗手间在哪里？', ja: 'トイレはどこですか？', vi: 'Nhà vệ sinh ở đâu?', th: 'ห้องน้ำอยู่ที่ไหน?', id: 'Di mana toilet?' }),
    ],
  },
  {
    id: 'food',
    emoji: '🍜',
    name: { en: 'Restaurant', ko: '식당', zh: '餐厅', ja: 'レストラン', vi: 'Nhà hàng', th: 'ร้านอาหาร', id: 'Restoran' },
    phrases: [
      p('메뉴판 주세요.', 'me-nyu-pan ju-se-yo', { en: 'Menu, please.', zh: '请给我菜单。', ja: 'メニューをください。', vi: 'Cho tôi thực đơn.', th: 'ขอเมนูหน่อย', id: 'Minta menu.' }),
      p('1인분도 주문 가능해요?', 'il-in-bun-do ju-mun ga-neung-hae-yo', { en: 'Can I order one portion?', zh: '可以点一人份吗？', ja: '1人前でも注文できますか？', vi: 'Gọi một phần được không?', th: 'สั่งหนึ่งที่ได้ไหม?', id: 'Bisa pesan satu porsi?' }),
      p('안 맵게 해 주세요.', 'an maep-ge hae ju-se-yo', { en: 'Not spicy, please.', zh: '请不要辣。', ja: '辛くしないでください。', vi: 'Đừng cay nhé.', th: 'ไม่เผ็ดนะ', id: 'Jangan pedas.' }),
      p('돼지고기 들어가요?', 'dwae-ji-go-gi deu-reo-ga-yo', { en: 'Is there pork in it?', zh: '这里面有猪肉吗？', ja: '豚肉は入っていますか？', vi: 'Có thịt heo không?', th: 'มีหมูไหม?', id: 'Ada babi?' }),
      p('계산해 주세요.', 'gye-san-hae ju-se-yo', { en: 'The bill, please.', zh: '请结账。', ja: 'お会計お願いします。', vi: 'Tính tiền giúp tôi.', th: 'เช็คบิลด้วย', id: 'Minta bon.' }),
      p('포장해 주세요.', 'po-jang-hae ju-se-yo', { en: 'To go, please.', zh: '请打包。', ja: '持ち帰りでお願いします。', vi: 'Gói mang về.', th: 'ห่อกลับบ้าน', id: 'Bungkus ya.' }),
    ],
  },
  {
    id: 'pay',
    emoji: '💳',
    name: { en: 'Payment', ko: '결제', zh: '付款', ja: '支払い', vi: 'Thanh toán', th: 'จ่ายเงิน', id: 'Bayar' },
    phrases: [
      p('위챗페이 돼요?', 'wi-chaet-pe-i dwae-yo', { en: 'Do you take WeChat Pay?', zh: '可以用微信支付吗？', ja: 'WeChat Payは使えますか？', vi: 'Có nhận WeChat Pay không?', th: 'รับ WeChat Pay ไหม?', id: 'Bisa WeChat Pay?' }),
      p('알리페이 돼요?', 'al-li-pe-i dwae-yo', { en: 'Do you take Alipay?', zh: '可以用支付宝吗？', ja: 'Alipayは使えますか？', vi: 'Có nhận Alipay không?', th: 'รับ Alipay ไหม?', id: 'Bisa Alipay?' }),
      p('해외 카드 결제 돼요?', 'hae-oe ka-deu gyeol-je dwae-yo', { en: 'Can I pay with a foreign card?', zh: '可以刷外国银行卡吗？', ja: '海外カードは使えますか？', vi: 'Thẻ nước ngoài được không?', th: 'ใช้บัตรต่างประเทศได้ไหม?', id: 'Bisa kartu luar negeri?' }),
      p('근처에 글로벌 ATM 있어요?', 'geun-cheo-e geul-lo-beol ATM i-sseo-yo', { en: 'Is there a global ATM nearby?', zh: '附近有国际ATM吗？', ja: '近くにグローバルATMはありますか？', vi: 'Gần đây có ATM quốc tế không?', th: 'แถวนี้มี ATM ต่างประเทศไหม?', id: 'Ada ATM global di dekat sini?' }),
      p('영수증 주세요.', 'yeong-su-jeung ju-se-yo', { en: 'Receipt, please.', zh: '请给我收据。', ja: 'レシートください。', vi: 'Cho tôi hóa đơn.', th: 'ขอใบเสร็จ', id: 'Minta struk.' }),
    ],
  },
  {
    id: 'taxi',
    emoji: '🚕',
    name: { en: 'Taxi', ko: '택시', zh: '出租车', ja: 'タクシー', vi: 'Taxi', th: 'แท็กซี่', id: 'Taksi' },
    phrases: [
      p('이 주소로 가 주세요.', 'i ju-so-ro ga ju-se-yo', { en: 'Please go to this address.', zh: '请去这个地址。', ja: 'この住所までお願いします。', vi: 'Cho tôi đến địa chỉ này.', th: 'ไปที่อยู่นี้', id: 'Ke alamat ini.' }),
      p('미터기 켜 주세요.', 'mi-teo-gi kyeo ju-se-yo', { en: 'Please turn on the meter.', zh: '请打表。', ja: 'メーターをつけてください。', vi: 'Bật đồng hồ tính tiền.', th: 'เปิดมิเตอร์ด้วย', id: 'Nyalakan argo.' }),
      p('여기서 내려 주세요.', 'yeo-gi-seo nae-ryeo ju-se-yo', { en: 'Stop here, please.', zh: '请在这里停车。', ja: 'ここで降ります。', vi: 'Cho tôi xuống đây.', th: 'จอดตรงนี้', id: 'Berhenti di sini.' }),
      p('트렁크 열어 주세요.', 'teu-reong-keu yeo-reo ju-se-yo', { en: 'Please open the trunk.', zh: '请打开后备箱。', ja: 'トランクを開けてください。', vi: 'Mở cốp xe giúp tôi.', th: 'เปิดท้ายรถด้วย', id: 'Buka bagasi.' }),
    ],
  },
  {
    id: 'med',
    emoji: '💊',
    name: { en: 'Pharmacy', ko: '약국·병원', zh: '药店/医院', ja: '薬局・病院', vi: 'Nhà thuốc', th: 'ร้านยา', id: 'Apotek' },
    phrases: [
      p('머리가 아파요.', 'meo-ri-ga a-pa-yo', { en: 'I have a headache.', zh: '我头疼。', ja: '頭が痛いです。', vi: 'Tôi đau đầu.', th: 'ปวดหัว', id: 'Saya sakit kepala.' }),
      p('배가 아파요.', 'bae-ga a-pa-yo', { en: 'I have a stomachache.', zh: '我肚子疼。', ja: 'お腹が痛いです。', vi: 'Tôi đau bụng.', th: 'ปวดท้อง', id: 'Saya sakit perut.' }),
      p('열이 나요.', 'yeo-ri na-yo', { en: 'I have a fever.', zh: '我发烧了。', ja: '熱があります。', vi: 'Tôi bị sốt.', th: 'มีไข้', id: 'Saya demam.' }),
      p('감기약 주세요.', 'gam-gi-yak ju-se-yo', { en: 'Cold medicine, please.', zh: '请给我感冒药。', ja: '風邪薬をください。', vi: 'Cho tôi thuốc cảm.', th: 'ขอยาแก้หวัด', id: 'Minta obat flu.' }),
      p('외국인 진료 가능한 병원이 어디예요?', 'oe-gu-gin jil-lyo ga-neung-han byeong-won', { en: 'Where is a hospital for foreigners?', zh: '哪里有可以给外国人看病的医院？', ja: '外国人が診てもらえる病院は？', vi: 'Bệnh viện khám cho người nước ngoài ở đâu?', th: 'โรงพยาบาลสำหรับชาวต่างชาติอยู่ไหน?', id: 'Di mana RS untuk orang asing?' }),
      p('알레르기가 있어요.', 'al-le-reu-gi-ga i-sseo-yo', { en: 'I have an allergy.', zh: '我有过敏。', ja: 'アレルギーがあります。', vi: 'Tôi bị dị ứng.', th: 'ฉันแพ้', id: 'Saya punya alergi.' }),
    ],
  },
  {
    id: 'sos',
    emoji: '🆘',
    name: { en: 'Help', ko: '도움', zh: '求助', ja: '助けて', vi: 'Giúp đỡ', th: 'ขอความช่วยเหลือ', id: 'Tolong' },
    phrases: [
      p('도와주세요!', 'do-wa-ju-se-yo', { en: 'Help me!', zh: '请帮帮我！', ja: '助けてください！', vi: 'Giúp tôi với!', th: 'ช่วยด้วย!', id: 'Tolong!' }),
      p('경찰 불러 주세요.', 'gyeong-chal bul-leo ju-se-yo', { en: 'Please call the police.', zh: '请帮我报警。', ja: '警察を呼んでください。', vi: 'Gọi cảnh sát giúp tôi.', th: 'เรียกตำรวจให้หน่อย', id: 'Panggil polisi.' }),
      p('길을 잃었어요.', 'gi-reul i-reo-sseo-yo', { en: "I'm lost.", zh: '我迷路了。', ja: '道に迷いました。', vi: 'Tôi bị lạc.', th: 'ฉันหลงทาง', id: 'Saya tersesat.' }),
      p('지갑을 잃어버렸어요.', 'ji-ga-beul i-reo-beo-ryeo-sseo-yo', { en: 'I lost my wallet.', zh: '我的钱包丢了。', ja: '財布をなくしました。', vi: 'Tôi mất ví.', th: 'กระเป๋าตังค์หาย', id: 'Dompet saya hilang.' }),
      p('줄 서 있는 거예요. 뒤로 서 주세요.', 'jul seo in-neun geo-ye-yo', { en: "I'm in line. Please go to the back.", zh: '我在排队，请排到后面。', ja: '並んでいます。後ろに並んでください。', vi: 'Tôi đang xếp hàng. Xin ra sau.', th: 'ฉันต่อคิวอยู่ กรุณาต่อท้าย', id: 'Saya antre. Silakan ke belakang.' }),
    ],
  },
]

/** Things Korean staff commonly say, matched from Korean speech by keyword. */
export type StaffLine = { keys: string[]; ko: string; m: Tx; replies: Phrase[] }

export const STAFF_LINES: StaffLine[] = [
  {
    keys: ['드시고', '먹고', '가져가', '테이크아웃', '포장'],
    ko: '드시고 가세요? 가져가세요?',
    m: { en: 'For here or to go?', zh: '堂食还是带走？', ja: '店内ですか、お持ち帰りですか？', vi: 'Uống tại chỗ hay mang đi?', th: 'ทานที่นี่หรือกลับบ้าน?', id: 'Makan di sini atau bawa pulang?' },
    replies: [
      p('먹고 갈게요.', 'meok-go gal-ge-yo', { en: 'For here.', zh: '堂食。', ja: '店内で。', vi: 'Tại chỗ.', th: 'ทานที่นี่', id: 'Di sini.' }),
      p('포장이요.', 'po-jang-i-yo', { en: 'To go.', zh: '带走。', ja: '持ち帰りで。', vi: 'Mang đi.', th: 'กลับบ้าน', id: 'Bawa pulang.' }),
    ],
  },
  {
    keys: ['따뜻', '뜨거', '아이스', '차가'],
    ko: '따뜻한 거요, 아이스요?',
    m: { en: 'Hot or iced?', zh: '要热的还是冰的？', ja: 'ホットですか、アイスですか？', vi: 'Nóng hay đá?', th: 'ร้อนหรือเย็น?', id: 'Panas atau dingin?' },
    replies: [
      p('따뜻한 거요.', 'tta-tteu-tan geo-yo', { en: 'Hot.', zh: '热的。', ja: 'ホット。', vi: 'Nóng.', th: 'ร้อน', id: 'Panas.' }),
      p('아이스요.', 'a-i-seu-yo', { en: 'Iced.', zh: '冰的。', ja: 'アイス。', vi: 'Đá.', th: 'เย็น', id: 'Dingin.' }),
    ],
  },
  {
    keys: ['사이즈', '크기', '라지', '톨'],
    ko: '사이즈는요?',
    m: { en: 'What size?', zh: '要什么杯型？', ja: 'サイズは？', vi: 'Cỡ nào?', th: 'ขนาดไหน?', id: 'Ukuran apa?' },
    replies: [
      p('작은 걸로요.', 'ja-geun geol-lo-yo', { en: 'Small.', zh: '小杯。', ja: '小さいので。', vi: 'Nhỏ.', th: 'เล็ก', id: 'Kecil.' }),
      p('큰 걸로요.', 'keun geol-lo-yo', { en: 'Large.', zh: '大杯。', ja: '大きいので。', vi: 'Lớn.', th: 'ใหญ่', id: 'Besar.' }),
    ],
  },
  {
    keys: ['포인트', '적립', '멤버십', '회원'],
    ko: '포인트 적립하세요?',
    m: { en: 'Collect points? (membership)', zh: '要积分吗？（会员）', ja: 'ポイント貯めますか？', vi: 'Tích điểm không?', th: 'สะสมแต้มไหม?', id: 'Kumpulkan poin?' },
    replies: [p('괜찮아요.', 'gwaen-chan-a-yo', { en: 'No, thanks.', zh: '不用了。', ja: '大丈夫です。', vi: 'Không cần.', th: 'ไม่เป็นไร', id: 'Tidak, terima kasih.' })],
  },
  {
    keys: ['영수증'],
    ko: '영수증 드릴까요?',
    m: { en: 'Need a receipt?', zh: '需要收据吗？', ja: 'レシートいりますか？', vi: 'Lấy hóa đơn không?', th: 'รับใบเสร็จไหม?', id: 'Perlu struk?' },
    replies: [
      p('네, 주세요.', 'ne, ju-se-yo', { en: 'Yes, please.', zh: '要。', ja: 'はい、ください。', vi: 'Có.', th: 'ค่ะ/ครับ', id: 'Ya.' }),
      p('버려 주세요.', 'beo-ryeo ju-se-yo', { en: 'No, throw it away.', zh: '不用，扔掉吧。', ja: '捨ててください。', vi: 'Không, bỏ đi.', th: 'ทิ้งได้เลย', id: 'Buang saja.' }),
    ],
  },
  {
    keys: ['결제', '카드', '현금', '계산'],
    ko: '결제는 어떻게 하시겠어요?',
    m: { en: 'How will you pay?', zh: '您怎么付款？', ja: 'お支払いは？', vi: 'Thanh toán thế nào?', th: 'จ่ายยังไง?', id: 'Bayar pakai apa?' },
    replies: [
      p('카드요.', 'ka-deu-yo', { en: 'Card.', zh: '刷卡。', ja: 'カードで。', vi: 'Thẻ.', th: 'บัตร', id: 'Kartu.' }),
      p('현금이요.', 'hyeon-geu-mi-yo', { en: 'Cash.', zh: '现金。', ja: '現金で。', vi: 'Tiền mặt.', th: 'เงินสด', id: 'Tunai.' }),
      p('알리페이 돼요?', 'al-li-pe-i dwae-yo', { en: 'Alipay OK?', zh: '支付宝可以吗？', ja: 'Alipay使えますか？', vi: 'Alipay được không?', th: 'Alipay ได้ไหม?', id: 'Alipay bisa?' }),
    ],
  },
  {
    keys: ['진동벨', '벨', '번호', '불러'],
    ko: '진동벨 울리면 오세요.',
    m: { en: 'Come back when the buzzer rings.', zh: '震动铃响了来取餐。', ja: 'ベルが鳴ったら取りに来てください。', vi: 'Chuông rung thì đến lấy.', th: 'กริ่งสั่นแล้วมารับ', id: 'Ambil saat bel bergetar.' },
    replies: [p('네, 알겠습니다.', 'ne, al-get-seum-ni-da', { en: 'OK, got it.', zh: '好的。', ja: 'はい、わかりました。', vi: 'Vâng, hiểu rồi.', th: 'เข้าใจแล้ว', id: 'Baik, mengerti.' })],
  },
  {
    keys: ['시럽', '샷', '휘핑', '추가'],
    ko: '시럽이나 샷 추가하세요?',
    m: { en: 'Add syrup or an extra shot?', zh: '要加糖浆或浓缩吗？', ja: 'シロップやショット追加は？', vi: 'Thêm siro hay shot không?', th: 'เพิ่มไซรัปหรือช็อตไหม?', id: 'Tambah sirup atau shot?' },
    replies: [
      p('아니요, 괜찮아요.', 'a-ni-yo, gwaen-chan-a-yo', { en: 'No, thanks.', zh: '不用了。', ja: '大丈夫です。', vi: 'Không cần.', th: 'ไม่เป็นไร', id: 'Tidak usah.' }),
      p('샷 추가해 주세요.', 'syat chu-ga-hae ju-se-yo', { en: 'Extra shot, please.', zh: '加一份浓缩。', ja: 'ショット追加で。', vi: 'Thêm shot.', th: 'เพิ่มช็อต', id: 'Tambah shot.' }),
    ],
  },
  {
    keys: ['품절', '없어요', '안 돼요', '안돼요'],
    ko: '그건 품절이에요.',
    m: { en: "Sorry, it's sold out.", zh: '这个卖完了。', ja: 'それは売り切れです。', vi: 'Món đó hết rồi.', th: 'หมดแล้ว', id: 'Maaf, sudah habis.' },
    replies: [p('다른 걸로 할게요.', 'da-reun geol-lo hal-ge-yo', { en: "I'll pick another.", zh: '我换一个。', ja: '別のにします。', vi: 'Tôi chọn món khác.', th: 'เอาอย่างอื่น', id: 'Saya pilih lain.' })],
  },
]

export const ALL_PHRASES: Phrase[] = SCENARIOS.flatMap((s) => s.phrases)

export const DRINKS: { ko: string; m: Tx }[] = [
  { ko: '아메리카노', m: { en: 'Americano', ko: '아메리카노', zh: '美式', ja: 'アメリカーノ', vi: 'Americano', th: 'อเมริกาโน่', id: 'Americano' } },
  { ko: '카페라떼', m: { en: 'Latte', ko: '카페라떼', zh: '拿铁', ja: 'カフェラテ', vi: 'Latte', th: 'ลาเต้', id: 'Latte' } },
  { ko: '바닐라라떼', m: { en: 'Vanilla latte', ko: '바닐라라떼', zh: '香草拿铁', ja: 'バニララテ', vi: 'Latte vani', th: 'วานิลลาลาเต้', id: 'Latte vanila' } },
  { ko: '녹차라떼', m: { en: 'Green tea latte', ko: '녹차라떼', zh: '抹茶拿铁', ja: '抹茶ラテ', vi: 'Latte trà xanh', th: 'ชาเขียวลาเต้', id: 'Latte teh hijau' } },
  { ko: '아이스티', m: { en: 'Iced tea', ko: '아이스티', zh: '冰茶', ja: 'アイスティー', vi: 'Trà đá', th: 'ชาเย็น', id: 'Es teh' } },
  { ko: '딸기스무디', m: { en: 'Strawberry smoothie', ko: '딸기스무디', zh: '草莓冰沙', ja: 'いちごスムージー', vi: 'Sinh tố dâu', th: 'สมูทตี้สตรอว์เบอร์รี', id: 'Smoothie stroberi' } },
]

export const DRINK_OPTIONS: { ko: string; m: Tx }[] = [
  { ko: '덜 달게 해 주세요', m: { en: 'Less sweet', ko: '덜 달게', zh: '少糖', ja: '甘さ控えめ', vi: 'Ít ngọt', th: 'หวานน้อย', id: 'Kurang manis' } },
  { ko: '샷 추가해 주세요', m: { en: 'Extra shot', ko: '샷 추가', zh: '加浓缩', ja: 'ショット追加', vi: 'Thêm shot', th: 'เพิ่มช็อต', id: 'Tambah shot' } },
  { ko: '얼음 적게 주세요', m: { en: 'Less ice', ko: '얼음 적게', zh: '少冰', ja: '氷少なめ', vi: 'Ít đá', th: 'น้ำแข็งน้อย', id: 'Es sedikit' } },
  { ko: '두유로 바꿔 주세요', m: { en: 'Soy milk', ko: '두유로', zh: '换豆奶', ja: '豆乳に', vi: 'Sữa đậu nành', th: 'นมถั่วเหลือง', id: 'Susu kedelai' } },
]
