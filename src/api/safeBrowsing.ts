import type { LinkCheck } from './types'

const KEY = import.meta.env.VITE_SAFE_BROWSING_KEY as string | undefined

/** Google Safe Browsing v4 Lookup. Returns null when unavailable (no key / network). */
export async function safeBrowsingCheck(urls: string[]): Promise<LinkCheck[] | null> {
  if (!KEY || !urls.length) return urls.length ? null : []
  try {
    const res = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${KEY}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        client: { clientId: 'k-buddy', clientVersion: '1.0' },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: urls.map((url) => ({ url })),
        },
      }),
    })
    if (!res.ok) return null
    const json = (await res.json()) as { matches?: { threatType: string; threat: { url: string } }[] }
    return urls.map((url) => ({ url, threat: json.matches?.find((m) => m.threat.url === url)?.threatType ?? null }))
  } catch {
    return null
  }
}
