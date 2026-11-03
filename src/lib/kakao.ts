// Minimal Kakao Maps JS SDK typing — only what K-Buddy uses.
export type KakaoLatLng = object
export type KakaoShape = { setMap(map: KakaoMapView | null): void }
export type KakaoMapView = { setCenter(c: KakaoLatLng): void; setBounds(b: object, top?: number, right?: number, bottom?: number, left?: number): void; relayout(): void }
type KakaoPlace = { id: string; place_name: string; distance: string; road_address_name: string; address_name: string; place_url: string; x: string; y: string }
export type KakaoMaps = {
  load(cb: () => void): void
  LatLng: new (lat: number, lng: number) => KakaoLatLng
  Map: new (el: HTMLElement, opts: { center: KakaoLatLng; level: number }) => KakaoMapView
  LatLngBounds: new () => { extend(p: KakaoLatLng): void }
  Polyline: new (opts: { map: KakaoMapView; path: KakaoLatLng[]; strokeWeight: number; strokeColor: string; strokeOpacity: number; strokeStyle?: string }) => KakaoShape
  CustomOverlay: new (opts: { map: KakaoMapView; position: KakaoLatLng; content: string; yAnchor?: number; zIndex?: number }) => KakaoShape
  Marker: new (opts: { map: unknown; position: KakaoLatLng; title?: string }) => unknown
  services: {
    Status: { OK: string }
    SortBy: { DISTANCE: string }
    Places: new () => {
      keywordSearch(q: string, cb: (data: KakaoPlace[], status: string) => void, opts: { location?: KakaoLatLng; radius?: number; sort?: string; size?: number }): void
    }
  }
}

const KEY = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined

/** Myeongdong — used when location permission is denied. */
export const DEFAULT_POS = { lat: 37.5636, lng: 126.9827 }

let loading: Promise<KakaoMaps | null> | null = null

/** Loads the SDK once. Resolves null if no key or the domain isn't registered. */
export function loadKakao(): Promise<KakaoMaps | null> {
  if (!KEY) return Promise.resolve(null)
  loading ??= new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&libraries=services&autoload=false`
    script.onload = () => {
      const maps = (window as unknown as { kakao?: { maps: KakaoMaps } }).kakao?.maps
      if (!maps) return resolve(null)
      maps.load(() => resolve(maps))
    }
    script.onerror = () => resolve(null)
    document.head.appendChild(script)
  })
  return loading
}

let lastFix: { pos: { lat: number; lng: number }; at: number } | null = null

/** Current position (reused for 2 min), or Myeongdong after 6s / on denial. */
export function getPosition(): Promise<{ lat: number; lng: number }> {
  if (lastFix && Date.now() - lastFix.at < 120000) return Promise.resolve(lastFix.pos)
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(DEFAULT_POS)
    navigator.geolocation.getCurrentPosition(
      (p) => {
        lastFix = { pos: { lat: p.coords.latitude, lng: p.coords.longitude }, at: Date.now() }
        resolve(lastFix.pos)
      },
      () => resolve(DEFAULT_POS),
      { timeout: 6000, maximumAge: 300000 },
    )
  })
}

export async function searchKeyword(maps: KakaoMaps, query: string, near?: { lat: number; lng: number }) {
  const places = new maps.services.Places()
  return new Promise<KakaoPlace[]>((resolve) => {
    places.keywordSearch(query, (data, status) => resolve(status === maps.services.Status.OK ? data : []), {
      ...(near ? { location: new maps.LatLng(near.lat, near.lng) } : {}),
      size: 6,
    })
  })
}

export async function searchNearby(maps: KakaoMaps, query: string, pos: { lat: number; lng: number }) {
  const places = new maps.services.Places()
  return new Promise<KakaoPlace[]>((resolve) => {
    places.keywordSearch(query, (data, status) => resolve(status === maps.services.Status.OK ? data : []), {
      location: new maps.LatLng(pos.lat, pos.lng),
      radius: 3000,
      sort: maps.services.SortBy.DISTANCE,
      size: 5,
    })
  })
}
