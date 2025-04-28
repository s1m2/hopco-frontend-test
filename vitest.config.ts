import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        provider: 'istanbul', // or 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['./src/config/**', './src/constants/**', './src/router/**'],
      },
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**', './src/config/**', './src/constants/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
