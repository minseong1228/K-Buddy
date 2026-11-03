import type { Tx } from '@/lib/i18n'

export type Diet = 'none' | 'halal' | 'nobeef' | 'kosher' | 'vegetarian' | 'vegan' | 'nopork'
export type Flag = 'pork' | 'beef' | 'alcohol' | 'meat' | 'seafood' | 'shellfish' | 'dairyEgg' | 'gelatin'

export const DIETS: { id: Diet; emoji: string; name: Tx; blocks: Flag[]; askKo: string }[] = [
  {
    id: 'halal',
    emoji: '🕌',
    name: { en: 'Halal', ko: '할랄', zh: '清真' },
    blocks: ['pork', 'alcohol', 'gelatin', 'meat', 'beef'],
    askKo: '저는 할랄 음식만 먹어요. 돼지고기, 술(맛술·미림), 일반 고기가 들어가나요?',
  },
  {
    id: 'nobeef',
    emoji: '🐄',
    name: { en: 'No beef', ko: '소고기 X', zh: '不吃牛肉', ja: '牛肉なし', vi: 'Không thịt bò', th: 'ไม่กินเนื้อวัว', id: 'Tanpa sapi' },
    blocks: ['beef'],
    askKo: '저는 소고기를 못 먹어요. 소고기나 사골 육수가 들어가나요?',
  },
  {
    id: 'kosher',
    emoji: '✡️',
    name: { en: 'Kosher-style', ko: '코셔식', zh: '洁食', ja: 'コーシャ風', vi: 'Kosher', th: 'โคเชอร์', id: 'Kosher' },
    blocks: ['pork', 'gelatin', 'shellfish'],
    askKo: '저는 돼지고기와 새우·조개·오징어 같은 해산물을 못 먹어요. 들어가나요?',
  },
  {
    id: 'nopork',
    emoji: '🐷',
    name: { en: 'No pork', ko: '돼지고기 X', zh: '不吃猪肉' },
    blocks: ['pork', 'gelatin'],
    askKo: '저는 돼지고기를 못 먹어요. 돼지고기나 돼지 육수가 들어가나요?',
  },
  {
    id: 'vegetarian',
    emoji: '🥚',
    name: { en: 'Vegetarian', ko: '채식(락토오보)', zh: '素食(蛋奶)' },
    blocks: ['pork', 'beef', 'meat', 'seafood', 'shellfish', 'gelatin'],
    askKo: '저는 채식주의자예요. 고기, 해산물, 고기 육수, 멸치 육수, 젓갈이 들어가나요?',
  },
  {
    id: 'none',
    emoji: '🍽️',
    name: { en: 'No food rule', ko: '제한 없음', zh: '无忌口', ja: '制限なし', vi: 'Không kiêng', th: 'ไม่มีข้อจำกัด', id: 'Tanpa pantangan' },
    blocks: [],
    askKo: '',
  },
  {
    id: 'vegan',
    emoji: '🌱',
    name: { en: 'Vegan', ko: '비건', zh: '纯素' },
    blocks: ['pork', 'beef', 'meat', 'seafood', 'shellfish', 'gelatin', 'dairyEgg'],
    askKo: '저는 비건이에요. 고기, 해산물, 젓갈, 계란, 우유가 들어가나요?',
  },
]

export const FLAG_INFO: Record<Flag, Tx> = {
  pork: { en: 'Pork', ko: '돼지고기', zh: '猪肉' },
  beef: { en: 'Beef', ko: '소고기', zh: '牛肉' },
  shellfish: { en: 'Shellfish / squid', ko: '갑각류·조개·오징어', zh: '甲壳类/贝类/鱿鱼' },
  alcohol: { en: 'Alcohol', ko: '알코올', zh: '酒精' },
  meat: { en: 'Meat (not halal-certified)', ko: '고기(할랄 미인증)', zh: '肉类(非清真认证)' },
  seafood: { en: 'Seafood / fish sauce', ko: '해산물·액젓', zh: '海鲜/鱼露' },
  dairyEgg: { en: 'Dairy / egg', ko: '유제품·계란', zh: '奶/蛋' },
  gelatin: { en: 'Gelatin (often pork)', ko: '젤라틴(주로 돼지)', zh: '明胶(常为猪源)' },
}

/** Korean label keywords. Order matters: longer words first so they win highlights. */
export const INGREDIENT_KEYWORDS: { word: string; flag: Flag; en: string; except?: string[] }[] = [
  { word: '돼지고기', flag: 'pork', en: 'pork' },
  { word: '돼지', flag: 'pork', en: 'pig' },
  { word: '돈육', flag: 'pork', en: 'pork' },
  { word: '돈지', flag: 'pork', en: 'pork fat' },
  { word: '라드', flag: 'pork', en: 'lard' },
  { word: '베이컨', flag: 'pork', en: 'bacon' },
  { word: '삼겹', flag: 'pork', en: 'pork belly' },
  { word: '햄', flag: 'pork', en: 'ham', except: ['햄버거'] },
  { word: '소시지', flag: 'pork', en: 'sausage' },
  { word: '젤라틴', flag: 'gelatin', en: 'gelatin' },
  { word: '주정', flag: 'alcohol', en: 'ethanol' },
  { word: '알코올', flag: 'alcohol', en: 'alcohol' },
  { word: '맛술', flag: 'alcohol', en: 'cooking wine' },
  { word: '미림', flag: 'alcohol', en: 'mirin' },
  { word: '청주', flag: 'alcohol', en: 'rice wine' },
  { word: '소주', flag: 'alcohol', en: 'soju' },
  { word: '맥주', flag: 'alcohol', en: 'beer' },
  { word: '와인', flag: 'alcohol', en: 'wine' },
  { word: '양주', flag: 'alcohol', en: 'liquor' },
  { word: '쇠고기', flag: 'beef', en: 'beef' },
  { word: '소고기', flag: 'beef', en: 'beef' },
  { word: '우육', flag: 'beef', en: 'beef' },
  { word: '닭고기', flag: 'meat', en: 'chicken' },
  { word: '계육', flag: 'meat', en: 'chicken' },
  { word: '사골', flag: 'beef', en: 'bone broth' },
  { word: '육수', flag: 'meat', en: 'meat stock' },
  { word: '쇼트닝', flag: 'meat', en: 'shortening (check source)' },
  { word: '멸치', flag: 'seafood', en: 'anchovy' },
  { word: '액젓', flag: 'seafood', en: 'fish sauce' },
  { word: '젓갈', flag: 'seafood', en: 'salted seafood' },
  { word: '새우', flag: 'shellfish', en: 'shrimp' },
  { word: '오징어', flag: 'shellfish', en: 'squid' },
  { word: '어묵', flag: 'seafood', en: 'fish cake' },
  { word: '굴', flag: 'shellfish', en: 'oyster' },
  { word: '꽃게', flag: 'shellfish', en: 'crab' },
  { word: '우유', flag: 'dairyEgg', en: 'milk' },
  { word: '유청', flag: 'dairyEgg', en: 'whey' },
  { word: '버터', flag: 'dairyEgg', en: 'butter' },
  { word: '치즈', flag: 'dairyEgg', en: 'cheese' },
  { word: '계란', flag: 'dairyEgg', en: 'egg' },
  { word: '달걀', flag: 'dairyEgg', en: 'egg' },
  { word: '난백', flag: 'dairyEgg', en: 'egg white' },
  { word: '꿀', flag: 'dairyEgg', en: 'honey' },
]

export type Dish = { ko: string; name: Tx; flags: Flag[]; note: Tx }

export const DISHES: Dish[] = [
  { ko: '비빔밥', name: { en: 'Bibimbap', zh: '拌饭' }, flags: ['beef', 'dairyEgg'], note: { en: 'Ask for no beef & no egg — easy to make veggie.', ko: '소고기·계란 빼달라고 하면 채식 가능.', zh: '可要求不放牛肉和鸡蛋，容易做成素食。' } },
  { ko: '김치찌개', name: { en: 'Kimchi stew', zh: '泡菜汤' }, flags: ['pork', 'seafood'], note: { en: 'Usually pork + fermented seafood in kimchi.', ko: '보통 돼지고기 + 김치 속 젓갈.', zh: '通常有猪肉，泡菜中含鱼露。' } },
  { ko: '된장찌개', name: { en: 'Soybean paste stew', zh: '大酱汤' }, flags: ['seafood', 'shellfish', 'beef'], note: { en: 'Anchovy broth; sometimes beef.', ko: '멸치 육수, 가끔 소고기.', zh: '常用鳀鱼汤底，有时放牛肉。' } },
  { ko: '삼겹살', name: { en: 'Pork belly BBQ', zh: '五花肉烤肉' }, flags: ['pork'], note: { en: 'Pork. Often 2-serving minimum.', ko: '돼지고기. 2인분 이상 주문인 곳 많음.', zh: '猪肉。常要求至少点两人份。' } },
  { ko: '불고기', name: { en: 'Bulgogi', zh: '烤牛肉' }, flags: ['beef', 'alcohol'], note: { en: 'Beef marinated, often with cooking wine.', ko: '양념 소고기, 맛술 들어가는 경우 많음.', zh: '腌牛肉，常加料酒。' } },
  { ko: '떡볶이', name: { en: 'Tteokbokki', zh: '炒年糕' }, flags: ['seafood', 'dairyEgg'], note: { en: 'Fish cake & anchovy broth; boiled egg on top.', ko: '어묵·멸치 육수, 삶은 계란.', zh: '有鱼饼、鳀鱼汤底，常加鸡蛋。' } },
  { ko: '김밥', name: { en: 'Gimbap', zh: '紫菜包饭' }, flags: ['pork', 'dairyEgg', 'seafood'], note: { en: 'Usually ham + egg + fish cake. Ask for 야채김밥 (veggie).', ko: '보통 햄·계란·어묵. 야채김밥 요청.', zh: '一般有火腿、鸡蛋、鱼饼。可点“蔬菜紫菜包饭”。' } },
  { ko: '라면', name: { en: 'Ramyeon', zh: '拉面' }, flags: ['beef', 'seafood'], note: { en: 'Soup powder has beef/seafood extract.', ko: '스프에 소고기·해물 추출물.', zh: '调料包含牛肉/海鲜提取物。' } },
  { ko: '순대', name: { en: 'Sundae (blood sausage)', zh: '血肠' }, flags: ['pork'], note: { en: 'Pork intestine & blood.', ko: '돼지 창자와 선지.', zh: '猪肠与猪血。' } },
  { ko: '치킨', name: { en: 'Korean fried chicken', zh: '韩式炸鸡' }, flags: ['meat'], note: { en: 'Not halal unless certified. Look for halal shops in Itaewon.', ko: '인증 없으면 할랄 아님. 이태원 할랄 가게 추천.', zh: '非认证不清真。梨泰院有清真店。' } },
  { ko: '해물파전', name: { en: 'Seafood pancake', zh: '海鲜煎饼' }, flags: ['seafood', 'shellfish', 'dairyEgg'], note: { en: 'Seafood & egg in batter.', ko: '반죽에 해산물·계란.', zh: '含海鲜和鸡蛋。' } },
  { ko: '두부김치', name: { en: 'Tofu & kimchi', zh: '豆腐泡菜' }, flags: ['pork', 'seafood'], note: { en: 'Kimchi often stir-fried with pork.', ko: '김치를 돼지고기와 볶는 경우 많음.', zh: '泡菜常与猪肉同炒。' } },
  { ko: '호떡', name: { en: 'Hotteok (sweet pancake)', zh: '糖饼' }, flags: [], note: { en: 'Usually OK — sugar & nut filling. Check oil.', ko: '대체로 OK — 설탕·견과 소. 기름 확인.', zh: '一般可以——糖和坚果馅。可确认用油。' } },
  { ko: '젤리', name: { en: 'Gummies / jelly', zh: '软糖' }, flags: ['gelatin'], note: { en: 'Gelatin is usually pork-based.', ko: '젤라틴은 대부분 돼지 유래.', zh: '明胶多为猪源。' } },
]

export const SAMPLE_LABELS = [
  '원재료명: 밀가루, 설탕, 쇼트닝, 돈지, 정제소금, 젤라틴, 주정, 버터',
  '면: 소맥분, 감자전분 / 스프: 정제염, 쇠고기추출물, 멸치액젓, 간장',
  '찹쌀, 설탕, 팥앙금, 물엿, 식물성유지, 정제소금',
]
