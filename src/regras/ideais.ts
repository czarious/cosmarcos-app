/* arquivo: ideais.ts */
import type { Personagem } from '../tipos/personagem'
import { ORDEM } from '../estado/deparaShards'
import { CATALOGO_TALENTOS, type EntradaTalento } from './talentos'

/**
 * Jurar Ideais — livro, cap. 5, "Jogando como um Radiante":
 * - o objetivo de cada Ideal vem do TALENTO daquele Ideal na árvore da ordem
 *   (o do 1º no nível 2+, o 2º no 4+…). Sem o talento, não há objetivo a marcar;
 *   o talento se escolhe ao subir de nível, no Shards (que o guarda em `radiant.talents`);
 * - completar o objetivo deixa o Radiante Potencializado até o fim da cena e
 *   destrava o resto do talento (o texto de cada um está no catálogo, regras/talentos/<ordem>.ts);
 * - o Quinto Ideal se perdeu: nenhum personagem alcança ainda.
 */

const ORDINAL = ['first', 'second', 'third', 'fourth'] as const

/** O id do talento do Ideal `n` da ordem, como o Shards escreve ("second-ideal-elsecaller"). */
export function idTalentoDoIdeal(ordem: string, n: number): string | null {
  const en = Object.keys(ORDEM).find((k) => ORDEM[k] === ordem)
  if (!en || n < 1 || n > 4) return null
  const o = en.toLowerCase()
  return `${ORDINAL[n - 1]}-ideal-${o}${n === 1 ? '-key' : ''}`
}

/** O texto do talento do Ideal no catálogo (nome, pré-requisitos, o que destrava). */
export function talentoDoIdeal(ordem: string, n: number): EntradaTalento | undefined {
  const id = idTalentoDoIdeal(ordem, n)
  const en = Object.keys(ORDEM).find((k) => ORDEM[k] === ordem)?.toLowerCase()
  return id && en ? CATALOGO_TALENTOS[`${en}::${id}`] : undefined
}

/** O personagem tem o talento do Ideal `n`? Sem ele, o objetivo daquele Ideal ainda não existe. */
export function temTalentoDoIdeal(ficha: Personagem, n: number): boolean {
  const ordem = ficha.radiante?.ordem
  const id = ordem ? idTalentoDoIdeal(ordem, n) : null
  // na ficha o id vem com a árvore na frente ("elsecaller::first-ideal-elsecaller-key")
  return id !== null && ficha.talentos.some((t) => t.id === id || t.id.endsWith(`::${id}`))
}
