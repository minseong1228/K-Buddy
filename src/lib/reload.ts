const RELOAD_KEY = 'kbuddy.reloadedAt'

/** After a new deploy, an open page can ask for screen files that no longer exist. Reload once to get the new ones. */
export function isStaleFileError(error: unknown) {
  return /dynamically imported module|Importing a module script failed|error loading dynamically imported|Failed to fetch/i.test(String(error))
}

export function reloadOnce() {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0)
    if (Date.now() - last < 15000) return false // already tried — avoid a reload loop
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
  } catch {
    /* storage blocked: still reload once */
  }
  window.location.reload()
  return true
}
