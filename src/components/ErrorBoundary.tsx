import { Component, type ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Mascot } from '@/components/Mascot'
import { M } from '@/i18n/messages'
import { useT } from '@/lib/i18n'
import { isStaleFileError, reloadOnce } from '@/lib/reload'

function Fallback({ onRetry, onHome }: { onRetry: () => void; onHome?: () => void }) {
  const { t } = useT()
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <Mascot mood="think" className="size-28" />
      <p className="speech-bubble text-lg">{t(M.oops)}</p>
      <div className="flex gap-2">
        <Button className="big-btn" onClick={onRetry}>
          <RotateCcw /> {t(M.reload)}
        </Button>
        {onHome && (
          <Button variant="outline" className="big-btn" onClick={onHome}>
            🏠 {t(M.home)}
          </Button>
        )}
      </div>
    </div>
  )
}

/** Keeps one broken screen from blanking the whole app. Stale-file errors reload the page automatically. */
export class ErrorBoundary extends Component<{ children: ReactNode; onHome?: () => void }, { error: unknown }> {
  state = { error: null as unknown }

  static getDerivedStateFromError(error: unknown) {
    return { error }
  }

  componentDidCatch(error: unknown) {
    if (isStaleFileError(error)) reloadOnce()
  }

  render() {
    if (this.state.error === null) return this.props.children
    return (
      <Fallback
        onRetry={() => (isStaleFileError(this.state.error) ? window.location.reload() : this.setState({ error: null }))}
        onHome={this.props.onHome && (() => (this.setState({ error: null }), this.props.onHome!()))}
      />
    )
  }
}
