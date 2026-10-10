/* arquivo: copias.ts */

/**
 * A "pasta" das cópias de segurança do save, no mesmo lugar da ficha (banco.ts).
 *
 * Toda cópia mora em `cosmarcos:copia:<personagem>:<motivo>:<data ISO>` —
 * uma pasta por personagem, uma subpasta por motivo, ordenada pela data.
 * Cada motivo guarda só as últimas N (LIMITE): cópia sem limite acabaria
 * enchendo a cota do aparelho e travando o próprio save.
 *
 * Quem grava: armazenamento.ts (save que não abriu; save de antes da
 * atualização de esquema) e usePersonagem.ts (ficha de antes de importar).
 */

import { armazem } from './banco'

export type MotivoCopia =
  /** O save existia mas não abriu (corrompido, ou de versão mais nova que o app). */
  | 'nao-abriu'
  /** O save abriu, mas era de esquema antigo: o original, antes de o app convertê-lo. */
  | 'antes-de-atualizar'
  /** A ficha que estava no app antes de uma importação — "Voltar à ficha de antes" restaura. */
  | 'antes-de-importar'

const LIMITE: Record<MotivoCopia, number> = {
  'nao-abriu': 3,
  'antes-de-atualizar': 2,
  'antes-de-importar': 3,
}

const pasta = (id: string, motivo: MotivoCopia) => `cosmarcos:copia:${id}:${motivo}:`

/** As chaves desta subpasta, da mais antiga pra mais nova. */
function chaves(id: string, motivo: MotivoCopia): string[] {
  moverAntigas(id)
  const prefixo = pasta(id, motivo)
  return Object.keys(armazem()).filter((k) => k.startsWith(prefixo)).sort()
}

/**
 * Até a v0.14.0 as cópias tinham chaves soltas (`cosmarcos:descartado:…` e
 * `cosmarcos:antes-importar:…`). Leva pra pasta nova, uma vez, sem perder nada.
 */
function moverAntigas(id: string): void {
  try {
    const descartados = Object.keys(armazem()).filter((k) => k.startsWith(`cosmarcos:descartado:${id}:`))
    for (const k of descartados) {
      const data = k.slice(`cosmarcos:descartado:${id}:`.length)
      armazem().setItem(pasta(id, 'nao-abriu') + data, armazem().getItem(k) ?? '')
      armazem().removeItem(k)
    }
    const antes = armazem().getItem(`cosmarcos:antes-importar:${id}`)
    if (antes !== null) {
      armazem().setItem(pasta(id, 'antes-de-importar') + '0000-antiga', antes)
      armazem().removeItem(`cosmarcos:antes-importar:${id}`)
    }
  } catch {
    // storage cheio ou bloqueado: as chaves antigas ficam onde estão, sem perda
  }
}

/** Guarda uma cópia e apaga as que passaram do limite. `false` = NÃO guardou — quem chama decide se pode seguir. */
export function guardarCopia(id: string, motivo: MotivoCopia, texto: string): boolean {
  try {
    // duas cópias no mesmo milissegundo não se sobrescrevem: "+" ordena depois da data pura
    let k = pasta(id, motivo) + new Date().toISOString()
    while (armazem().getItem(k) !== null) k += '+'
    armazem().setItem(k, texto)
  } catch (e) {
    console.warn(`[cosmarcos] não consegui guardar a cópia (${motivo}):`, e)
    return false
  }
  try {
    for (const velha of chaves(id, motivo).slice(0, -LIMITE[motivo])) armazem().removeItem(velha)
  } catch {
    // poda falhou: sobra uma cópia a mais, nada se perde
  }
  return true
}

/** A cópia mais recente desta subpasta (texto cru), ou `null`. */
export function ultimaCopia(id: string, motivo: MotivoCopia): string | null {
  try {
    const ultima = chaves(id, motivo).at(-1)
    return ultima ? armazem().getItem(ultima) : null
  } catch {
    return null
  }
}

/** Tira a cópia mais recente da pasta e devolve o texto dela — a anterior vira a "mais recente". */
export function retirarUltimaCopia(id: string, motivo: MotivoCopia): string | null {
  try {
    const ultima = chaves(id, motivo).at(-1)
    if (!ultima) return null
    const texto = armazem().getItem(ultima)
    armazem().removeItem(ultima)
    return texto
  } catch {
    return null
  }
}

export function temCopia(id: string, motivo: MotivoCopia): boolean {
  try {
    return chaves(id, motivo).length > 0
  } catch {
    return false
  }
}
