export type EncodedImage = { mimeType: string; base64: string }

async function readAsBase64(file: Blob): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(r.error)
    r.readAsDataURL(file)
  })
  return dataUrl.slice(dataUrl.indexOf(',') + 1)
}

/** Decodes a photo with whatever the browser supports (ImageBitmap, then <img>). */
async function decode(file: File): Promise<{ src: CanvasImageSource; w: number; h: number; done: () => void }> {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
    return { src: bmp, w: bmp.width, h: bmp.height, done: () => bmp.close() }
  } catch {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url
    await img.decode()
    return { src: img, w: img.naturalWidth, h: img.naturalHeight, done: () => URL.revokeObjectURL(url) }
  }
}

/**
 * Downscales a photo (long side ≤ maxSide) to JPEG base64 — keeps AI calls fast on mobile data.
 * If the browser can't decode it (e.g. HEIC on some browsers), sends the original file; Gemini reads HEIC/PNG/WebP too.
 */
export async function encodeImage(file: File, maxSide = 1600): Promise<EncodedImage> {
  try {
    const { src, w, h, done } = await decode(file)
    const scale = Math.min(1, maxSide / Math.max(w, h))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(w * scale)
    canvas.height = Math.round(h * scale)
    canvas.getContext('2d')!.drawImage(src, 0, 0, canvas.width, canvas.height)
    done()
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.85))
    if (blob) return { mimeType: 'image/jpeg', base64: await readAsBase64(blob) }
  } catch {
    /* fall through to the original file */
  }
  return { mimeType: file.type || 'image/jpeg', base64: await readAsBase64(file) }
}
