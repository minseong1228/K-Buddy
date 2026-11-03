/** Pulls links out of a message: full URLs and bare domains like "bit.ly/abc" or "kr-post.top". */
export function extractLinks(text: string): string[] {
  const found = text.match(/\b(?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<>"')]*)?/gi) ?? []
  return [...new Set(found.filter((u) => !/^\d+(\.\d+)+$/.test(u)).map((u) => (/^https?:\/\//i.test(u) ? u : `http://${u}`)))].slice(0, 20)
}
