/* arquivo: espaco.ts */

// Quanto do espaço do aparelho o app já usa. A ficha mora no IndexedDB
// (banco.ts), que vai até a cota do site — o navegador diz quanto. Sem banco,
// ela mora no localStorage, com teto de ~5 MB: o Safari guarda cada letra em
// 2 bytes (UTF-16), então lá cabem ~2,5 milhões de letras — a conta usa esse teto.
// Conta TODAS as chaves do site, não só as do app: no GitHub Pages o teto é
// dividido com os outros projetos publicados no mesmo endereço.
// Encheu → a gravação falha e o app já avisa (armazenamento.ts); isto avisa ANTES.

import { letrasNoBanco, cotaDoBanco } from './banco'

/** O teto do localStorage (sem banco). */
export const LIMITE_BYTES = 5 * 1024 * 1024
/** Daqui pra cima a engrenagem acende e as Configurações pedem o backup. */
export const QUASE_CHEIO = 0.8

export type Espaco = { usadoBytes: number; limiteBytes: number; fracao: number; quaseCheio: boolean }

export function medirEspaco(armazem?: Storage): Espaco {
  let letras = 0
  try {
    const a = armazem ?? localStorage // ler o localStorage já pode falhar (bloqueado)
    for (const chave of Object.keys(a)) letras += chave.length + (a.getItem(chave)?.length ?? 0)
  } catch {
    // armazenamento bloqueado: não há o que medir
  }
  // `armazem` passado = teste: mede só ele. No app, soma o banco e usa a cota dele
  const usadoBytes = (letras + (armazem ? 0 : letrasNoBanco())) * 2
  const limiteBytes = (!armazem && cotaDoBanco()) || LIMITE_BYTES
  const fracao = Math.min(1, usadoBytes / limiteBytes)
  return { usadoBytes, limiteBytes, fracao, quaseCheio: fracao >= QUASE_CHEIO }
}

/** Bytes → MB, pro texto da tela. */
export const emMB = (bytes: number) => bytes / (1024 * 1024)
