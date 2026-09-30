/* arquivo: fundos.ts */
import type { Personagem } from './tipos/personagem'
import type { Secao } from './componentes/SeletorSecao'

// Arte de fundo das abas — personaliza a ficha pelo PERSONAGEM, não pelo app:
// a Principal usa a trilha heroica, a Radiante usa a ordem. As imagens moram em
// src/assets/fundos/ (quem cria é o agente de arte — .claude/agents/arte.md) e
// entram no build com hash e no pré-cache offline. Aba sem imagem = sem fundo.
// Quão apagada ela aparece é forma, não dado: --fundo-opacidade em base.css.

/** nome do arquivo (sem extensão) → URL final do build */
const IMAGENS: Record<string, string> = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>('./assets/fundos/*.webp', { eager: true, import: 'default', query: '?url' }),
  ).map(([caminho, url]) => [caminho.replace(/^.*\/|\.webp$/g, ''), url]),
)

/** "Erudito" → "erudito" · "Alternauta" → "alternauta" — sem acento, minúsculo, hífen. */
function chave(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** A imagem de fundo da aba pra este personagem, ou undefined se não houver arte pra ela. */
export function fundoDaAba(secao: Secao, ficha: Personagem): string | undefined {
  const { trilhaHeroica, trilhaRadiante } = ficha.meta
  if (secao === 'Principal') return IMAGENS[`trilha-${chave(trilhaHeroica)}`]
  if (secao === 'Radiante' && trilhaRadiante) return IMAGENS[`ordem-${chave(trilhaRadiante)}`]
  return undefined
}
