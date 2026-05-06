import { defineConfig } from 'vite'

export default defineConfig({
  root: 'frontend',
  base: '/serene-river-stream/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
