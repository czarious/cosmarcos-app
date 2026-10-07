/* arquivo: contagemTalentos.ts */
import type { Personagem, Talento } from '../tipos/personagem'
import { talentosDeFluxo } from './talentos'

/**
 * CONTAGEM DE TALENTOS — quantos o personagem tem × quantos a tabela do livro
 * dá, separado por categoria de vaga. O Shards mostra só o saldo ("-1");
 * aqui cada talento ocupa uma vaga da categoria que ele cumpre.
 *
 * Fonte (transcrição): 01-criacao-de-personagem/03-evolucao-de-personagem.md
 * → "Tabela de Evolução de Personagem"; 02-origens/02-ancestralidade.md →
 * "Talentos Bônus de Ancestralidade".
 *
 * Duas categorias de vaga:
 *  - POR NÍVEL: 1 por nível até o 20 (a do nível 1 é da trilha inicial),
 *    qualquer árvore — inclusive as de fluxo (`talentosDeFluxo`). Mais `meta.talentosExtras` (bônus do Shards e as
 *    escolhas do 21+ que viraram talento).
 *  - ANCESTRALIDADE: 1 no início de cada patamar (níveis 1, 6, 11, 16, 21).
 *    Humano: de trilha heroica. Cantor: da árvore de Cantor ou heroica, e no
 *    nível 1 são 2 (Mudar Forma + o talento ligado a ele).
 *
 * Quem cumpre só uma categoria entra primeiro nela; quem cumpre as duas
 * preenche a de ancestralidade e transborda pra de nível.
 */

export const NIVEIS_BONUS_ANCESTRALIDADE = [1, 6, 11, 16, 21]

export type ContagemCategoria = { usados: number; previstos: number }

export type ContagemTalentos = {
  porNivel: ContagemCategoria
  ancestralidade: ContagemCategoria
  /** previstos − usados, somando as duas: positivo = a escolher; negativo = a mais que a tabela. */
  saldo: number
}

function cabeNaAncestralidade(origem: Talento['origem'], ancestralidade: string): boolean {
  if (ancestralidade === 'Cantor') return origem === 'ancestral' || origem === 'heroica'
  return origem === 'heroica'
}

export function contarTalentos(ficha: Personagem): ContagemTalentos {
  const { nivel, ancestralidade, talentosExtras = 0 } = ficha.meta
  const ehCantor = ancestralidade === 'Cantor'

  const previstosNivel = Math.min(nivel, 20) + talentosExtras
  const previstosAncestralidade =
    NIVEIS_BONUS_ANCESTRALIDADE.filter((n) => n <= nivel).length + (ehCantor && nivel >= 1 ? 1 : 0)

  const todos = [...ficha.talentos, ...talentosDeFluxo(ficha)]
  const cabem = todos.filter((t) => cabeNaAncestralidade(t.origem, ancestralidade)).length
  const usadosAncestralidade = Math.min(cabem, previstosAncestralidade)
  const usadosNivel = todos.length - usadosAncestralidade

  return {
    porNivel: { usados: usadosNivel, previstos: previstosNivel },
    ancestralidade: { usados: usadosAncestralidade, previstos: previstosAncestralidade },
    saldo: previstosNivel + previstosAncestralidade - todos.length,
  }
}
