import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { cn } from '@/lib/utils'

/** QR image for a URL (generated on-device, no network). */
export function QrCode({ value, className }: { value: string; className?: string }) {
  const [src, setSrc] = useState('')
  useEffect(() => {
    let alive = true
    QRCode.toDataURL(value, { margin: 1, width: 640, errorCorrectionLevel: 'M', color: { dark: '#1f2a5c', light: '#ffffff' } }).then((url) => alive && setSrc(url))
    return () => {
      alive = false
    }
  }, [value])
  return src ? <img src={src} alt={value} className={cn('aspect-square rounded-xl bg-white', className)} /> : <div className={cn('aspect-square rounded-xl bg-muted', className)} />
}
