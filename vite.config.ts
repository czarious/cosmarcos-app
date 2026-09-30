/* arquivo: vite.config.ts */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import type { Plugin } from 'vite'

/**
 * Política de segurança da página publicada: só roda o que vem do próprio
 * site — sem script de terceiro, sem conexão pra fora, sem virar iframe.
 * O app não precisa de nada externo (offline primeiro), então fechar tudo
 * não custa nada. Só no BUILD: o `npm run dev` injeta script inline e quebraria.
 * frame-ancestors não vale em <meta>; o GitHub Pages não deixa mandar cabeçalho.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ')

function segurancaNoBuild(): Plugin {
  return {
    name: 'cosmarcos-seguranca',
    apply: 'build',
    transformIndexHtml: (html) =>
      html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="${CSP}" />
    <meta name="referrer" content="no-referrer" />`,
      ),
  }
}

// base './' = caminhos relativos — funciona no dev e no GitHub Pages (subpasta /cosmarcos-app/)
export default defineConfig({
  plugins: [
    react(),
    segurancaNoBuild(),
    VitePWA({
      // prompt: a versão nova baixa sozinha, mas só entra quando o jogador toca em
      // "Atualizar" (AvisoAtualizacao.tsx) — nunca troca no meio do combate. Com
      // autoUpdate ela ficava esperando o app fechar de verdade, o que o Android
      // quase nunca faz (30/Set/2026: só apareceu reinstalando).
      // Cores: --cor-destaque (tema) e --cor-fundo-pagina, de base.css
      registerType: 'prompt',
      injectRegister: false, // quem registra é o AvisoAtualizacao
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,webmanifest,json}'], // webp = arte de fundo das abas
      },
    }),
  ],
  base: './',
})
