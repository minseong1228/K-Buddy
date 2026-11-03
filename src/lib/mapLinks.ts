import type { GeoPoint } from '@/api'

type Dest = GeoPoint & { name: string }

/** Deep links that open the route in a maps app (or its website when the app isn't installed). */
export function mapLinks(from: GeoPoint, to: Dest) {
  const name = encodeURIComponent(to.name)
  return {
    // Kakao: universal web link — opens KakaoMap app on phones that have it
    kakao: `https://map.kakao.com/link/by/traffic/${encodeURIComponent('내 위치')},${from.lat},${from.lng}/${name},${to.lat},${to.lng}`,
    // Naver: app scheme (public transit); web search as fallback
    naverApp: `nmap://route/public?slat=${from.lat}&slng=${from.lng}&sname=${encodeURIComponent('내 위치')}&dlat=${to.lat}&dlng=${to.lng}&dname=${name}&appname=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'localhost')}`,
    naverWeb: `https://map.naver.com/p/search/${name}`,
    // Google: universal link, opens the Google Maps app if installed
    google: `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=transit`,
  }
}

/** Try an app scheme; if the page is still visible shortly after, open the web fallback. */
export function openAppOr(appUrl: string, webUrl: string) {
  const timer = setTimeout(() => {
    if (document.visibilityState === 'visible') window.open(webUrl, '_blank', 'noopener')
  }, 1200)
  document.addEventListener('visibilitychange', () => clearTimeout(timer), { once: true })
  window.location.href = appUrl
}
