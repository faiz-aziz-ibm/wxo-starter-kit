import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' + HashRouter makes the build portable to any GitHub Pages path
// (user.github.io/repo/) without extra configuration.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1200,
  },
})
