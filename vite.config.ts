/* arquivo: vite.config.ts */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// base './' = caminhos relativos — funciona no dev e no GitHub Pages (subpasta /cosmarcos-app/)
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // autoUpdate: o service worker novo assume sozinho; o registro é injetado no build
      // (sem mexer no App.tsx). Cores: --cor-destaque (tema) e --cor-fundo-pagina, de base.css
      registerType: 'autoUpdate',
      includeAssets: ['icone.svg', 'icones/apple-touch-icon.png'],
      manifest: {
        name: 'cosmarcos — Ficha Cosmere',
        short_name: 'cosmarcos',
        lang: 'pt-BR',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        theme_color: '#a03b2e',
        background_color: '#d9cdb8',
        icons: [
          { src: 'icones/icone-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icones/icone-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icones/icone-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // O padrão só pré-cacheia js/css/html/ico/png/svg. Sem o json, a ficha semente
        // (personagens/*.json) não estaria no cache e o app não abriria offline no 1º uso
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,json}'],
      },
    }),
  ],
  base: './',
})
