// Gemini API access uses a key entered by the user (BYOK). Never ship a private API key in a Vite bundle.
const STORAGE_KEY = 'gemini_api_key'

function savedKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function getApiKey(): string | null {
  return savedKey()
}

/** True when the user entered their own key. */
export function hasOwnKey() {
  return !!savedKey()
}

export function saveApiKey(key: string) {
  try {
    localStorage.setItem(STORAGE_KEY, key.trim())
  } catch {
    /* ignore */
  }
}

export function clearApiKey() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
