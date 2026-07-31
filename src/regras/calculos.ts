/* arquivo: calculos.ts */

/**
 * Cálculos derivados que cruzam a ficha (FIXO, vem do Shards) com as
 * escolhas do jogador feitas no app (VIVO — ex.: qual perícia recebe o
 * bônus da Erudição). Decisão 0009: ler primeiro, calcular depois.
 */

import { CATALOGO_TALENTOS, type EscolhaVaga } from './talentos'
import type { Personagem, Pericia, NomeAtributo } from '../tipos/personagem'

/** Nome completo do atributo, pra exibir num detalhamento (CabecalhoFixo já tem a versão abreviada, local). */
export const NOME_ATRIBUTO: Record<NomeAtributo, string> = {
  forca: 'Força',
  velocidade: 'Velocidade',
  intelecto: 'Intelecto',
  vontade: 'Vontade',
  consciencia: 'Consciência',
  presenca: 'Presença',
}

export type ParcelaBonus = { origem: string; valor: number }

/**
 * De ONDE vem o bônus de escolha de uma perícia — uma linha por vaga que
 * aponta pra ela, com o nome do talento de origem (pra exibir num
 * detalhamento tipo "+1 vindo de Erudição").
 */
export function origensBonusPericia(periciaId: string, escolhas: Record<string, EscolhaVaga>): ParcelaBonus[] {
  const partes: ParcelaBonus[] = []
  for (const e of Object.values(escolhas)) {
    if (e.tipo === 'pericia' && e.valor === periciaId) {
      partes.push({ origem: CATALOGO_TALENTOS[e.talentoId]?.nome ?? e.talentoId, valor: 1 })
    }
  }
  return partes
}

/**
 * Quantas graduações bônus uma perícia recebe das escolhas de talento
 * atuais. Soma todas as vagas que apontam pra ela — não usa o rankBonus
 * cru do Shards: a escolha feita no app é quem manda, pra sobreviver a
 * redistribuições (ex.: Erudição após descanso longo) sem reimportar nada.
 */
export function bonusDeEscolhas(periciaId: string, escolhas: Record<string, EscolhaVaga>): number {
  return origensBonusPericia(periciaId, escolhas).reduce((soma, p) => soma + p.valor, 0)
}

/**
 * O TOTAL de uma perícia — a fórmula confirmada (escopo/conferencia-formulas.md):
 * atributo efetivo + graduação + bônus + misc.
 *
 * ⚠️ Usa `bonusDeEscolhas` (o que o JOGADOR escolheu no app), NÃO o
 * `graduacaoBonus` cru que o Shards exporta — são a mesma coisa no
 * primeiro carregamento (a escolha nasce semeada do Shards), mas divergem
 * assim que o jogador redistribuir um talento tipo Erudição. Um talento
 * futuro que dê bônus de perícia SEM vaga cadastrada em regras/talentos.ts
 * não entra nessa conta ainda — precisa ganhar uma vaga primeiro.
 */
export function totalPericia(
  pericia: Pericia,
  ficha: Personagem,
  escolhas: Record<string, EscolhaVaga>,
): number {
  const atributoEfetivo = ficha.atributos[pericia.atributo] + ficha.atributosMod[pericia.atributo]
  return atributoEfetivo + pericia.graduacao + bonusDeEscolhas(pericia.id, escolhas) + pericia.misc
}

/** Acha a perícia da ficha pelo NOME (é como uma Arma referencia sua perícia). */
export function periciaPorNome(nome: string, ficha: Personagem): Pericia | undefined {
  return ficha.pericias.find((p) => p.nome === nome)
}

export type DetalhePericia = {
  titulo: string
  linhas: ParcelaBonus[]
  total: number
}

/** O total de uma perícia, ABERTO em parcelas — pra um popover tipo "de onde vem esse +4?". */
export function detalhePericia(
  pericia: Pericia,
  ficha: Personagem,
  escolhas: Record<string, EscolhaVaga>,
): DetalhePericia {
  const atributoEfetivo = ficha.atributos[pericia.atributo] + ficha.atributosMod[pericia.atributo]
  const linhas: ParcelaBonus[] = [
    { origem: NOME_ATRIBUTO[pericia.atributo], valor: atributoEfetivo },
    { origem: 'Graduação', valor: pericia.graduacao },
    ...origensBonusPericia(pericia.id, escolhas),
  ]
  if (pericia.misc !== 0) linhas.push({ origem: 'Outros (misc)', valor: pericia.misc })
  return {
    titulo: pericia.nome,
    linhas,
    total: linhas.reduce((soma, l) => soma + l.valor, 0),
  }
}

/** "50 kg" → 50. Usado pra comparar com o peso carregado (ambos em kg, decisão 0007). */
export function pesoEmKg(texto: string): number {
  const m = texto.match(/[\d.,]+/)
  return m ? Number(m[0].replace(',', '.')) : 0
}

/** Soma o peso de tudo que o personagem carrega — itens gerais + armas (equipadas ou não). */
export function pesoCarregado(ficha: Personagem): number {
  const dosItens = ficha.itens.reduce((soma, i) => soma + i.peso * i.qtd, 0)
  const dasArmas = ficha.armas.reduce((soma, a) => soma + a.peso, 0)
  return dosItens + dasArmas
}
