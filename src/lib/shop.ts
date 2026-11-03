/** Shop QR deep link: https://…/?shop=<name>&type=<cafe|food|store>. Read once at load. */
export type ShopType = 'cafe' | 'food' | 'store'
export type Shop = { name: string; type: ShopType }

const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
const name = params?.get('shop')?.trim().slice(0, 40)
const type = params?.get('type')

export const SHOP: Shop | null = name ? { name, type: type === 'food' || type === 'store' ? type : 'cafe' } : null

// Use the current host rather than linking to the original team's deployment.
export const APP_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'

export function shopUrl(shop: Shop) {
  return `${APP_URL}/?shop=${encodeURIComponent(shop.name)}&type=${shop.type}`
}
