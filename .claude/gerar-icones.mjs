/* arquivo: gerar-icones.mjs */

/**
 * Gera os PNG do PWA a partir de public/icone.svg. Rodar só quando o SVG mudar:
 *
 *     node .claude/gerar-icones.mjs
 *
 * Os PNG são versionados (não gerados no build) pro deploy não depender do sharp.
 */

import sharp from 'sharp'

const tamanhos = {
  'icone-192.png': 192,
  'icone-512.png': 512,
  'icone-maskable-512.png': 512,
  'apple-touch-icon.png': 180,
}

for (const [nome, lado] of Object.entries(tamanhos)) {
  await sharp('public/icone.svg', { density: 384 }).resize(lado, lado).png().toFile(`public/icones/${nome}`)
  console.log('gerado', nome)
}
