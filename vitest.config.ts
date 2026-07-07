import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    css: false,
    environment: 'jsdom',
    globals: true,
    include: ['src/tests/unit/**/*.test.ts'],
    setupFiles: ['src/tests/unit/setup.ts'],
  },
})
