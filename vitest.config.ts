import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const primitivesStub = fileURLToPath(new URL('./tests/stubs/primitives.tsx', import.meta.url))

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      // Avoid the published primitives barrel (eagerly imports katex CSS).
      '@deepseek-ai/dsh-client-ui-primitives': primitivesStub,
    },
  },
  test: {
    css: false,
    environment: 'jsdom',
  },
})
