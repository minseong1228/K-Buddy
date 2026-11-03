import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Tests use mocked services and must never load local API keys.
  envDir: false,
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  test: { environment: 'jsdom', include: ['tests/**/*.test.tsx'], clearMocks: true },
})
