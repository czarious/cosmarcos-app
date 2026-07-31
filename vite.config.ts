/* arquivo: vite.config.ts */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' = caminhos relativos — funciona no dev e no GitHub Pages (Fase 2.4)
// vite-plugin-pwa entra na Fase 2 (manifest + service worker)
export default defineConfig({
  plugins: [react()],
  base: './',
})
