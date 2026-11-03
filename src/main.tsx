import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { reloadOnce } from '@/lib/reload'

// A deploy replaced the screen files this open page wants → fetch the new version instead of showing a blank page.
window.addEventListener('vite:preloadError', (e) => {
  if (reloadOnce()) e.preventDefault()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
