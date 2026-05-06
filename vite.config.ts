import { defineConfig } from 'vite'
import { copyFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: 'frontend',
  base: '/serene-river-stream/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [{
    name: 'copy-large-assets',
    closeBundle() {
      const assets: [string, string][] = [
        ['src/images/ogp.png',     'dist/ogp.png'],
        ['src/images/favicon.png', 'dist/favicon.png'],
      ]
      for (const [src, dst] of assets) {
        const s = resolve(__dirname, src)
        const d = resolve(__dirname, dst)
        if (existsSync(s)) copyFileSync(s, d)
      }
    },
  }],
})
