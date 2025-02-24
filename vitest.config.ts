import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    benchmark: {
      include: ['__tests__/**/*.bench.*'],
      exclude: ['node_modules'],
    },
    coverage: {
      provider: 'v8',
      extension: ['.ts', '.tsx'],
      exclude: [
        'node_modules',
        '.storybook/**/*',
        '__tests__/**/*',
        'src/@types/**/*',
        'src/stories/**/*',
        'src/**/*.stories.tsx'
      ],
    },
    exclude: [ 'node_modules'],
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    onConsoleLog: (_, type) => (type === 'stderr' ? false : undefined),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#': fileURLToPath(new URL('./__tests__', import.meta.url)),
    },
  },
})