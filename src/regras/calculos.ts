/* arquivo: calculos.ts */

/**
 * Cálculos derivados que cruzam a ficha (FIXO, vem do Shards) com as
 * escolhas do jogador feitas no app (VIVO — ex.: qual perícia recebe o
 * bônus da Erudição). Ver premissas.md → "Ler primeiro, calcular depois".
 */

import { CATALOGO_TALENTOS, type EscolhaVaga } from './talentos'
import type { Personagem, Pericia } from '../tipos/personagem'
import { ATRIBUTO, ROTULO } from '../variaveis'
import { efeitoCondicoesPericia, type UsoPericia } from './condicoes'

// ⚠️ Ressalva conhecida: `regras/` não deveria conhecer a tela, e aqui ele
// importa um RÓTULO (o nome do atributo) pra montar o detalhamento da perícia.
// O conserto de verdade é `detalhePericia` devolver a CHAVE do atributo e o
// componente resolver o nome — refatoração maior, anotada e não feita.
// O que está aqui já era assim antes; a mudança só tirou a duplicação (o nome
// completo vivia aqui e a abreviação no CabecalhoFixo).

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

/** Alguma vaga de talento que o jogador ainda não decidiu? */
export function temVagaIndecisa(escolhas: Record<string, EscolhaVaga>): boolean {
  return Object.values(escolhas).some((e) => !e.valor)
}

/**
 * Graduação bônus que o Shards exportou (`graduacaoBonus`) e que o app NÃO
 * consegue atribuir a nenhum talento.
 *
 * ⚠️ Existe pra o app servir a QUALQUER personagem, não só aos que têm vínculo
 * cadastrado. Sem isto, um PC novo apareceria com a perícia **1 abaixo** da
 * ficha dele no Shards, calado — o número inventado com cara de número certo
 * que o projeto proíbe.
 *
 * **Só conta enquanto houver vaga indecisa.** Se o jogador já decidiu todas as
 * vagas, a atribuição do app é completa e manda: foi ele quem redistribuiu, e
 * o `graduacaoBonus` do Shards é que ficou velho. É o que preserva o caso
 * "redistribuiu a Erudição depois do descanso longo".
 *
 * **Sem vaga nenhuma** (nenhum talento do personagem está no catálogo) não há
 * decisão do jogador — o Shards manda. Antes deste caso, um PC sem talento
 * catalogado ficava 1 abaixo, calado; o teste `importarShards.test.ts` pegou
 * (29/Set/2026). ⚠️ Resta um caso misto não coberto: vagas todas decididas
 * MAIS um talento fora do catálogo que também dá bônus.
 */
export function bonusNaoAtribuido(
  pericia: Pericia,
  escolhas: Record<string, EscolhaVaga>,
): number {
  const semVaga = Object.keys(escolhas).length === 0
  if (!semVaga && !temVagaIndecisa(escolhas)) return 0
  return Math.max(0, pericia.graduacaoBonus - bonusDeEscolhas(pericia.id, escolhas))
}

/**
 * O TOTAL de uma perícia — a fórmula confirmada (escopo/conferencia-formulas.md):
 * atributo efetivo + graduação + bônus + misc.
 *
 * O bônus entra por dois caminhos, e a ordem importa:
 *  1. `bonusDeEscolhas` — o que o JOGADOR atribuiu no app. Manda sempre.
 *  2. `bonusNaoAtribuido` — o que o Shards exportou e ninguém atribuiu ainda.
 *     Só entra enquanto sobrar vaga indecisa, e aparece marcado no detalhamento.
 *
 * Assim a escolha do jogador sobrevive a uma redistribuição (Erudição depois
 * do descanso longo) SEM que um personagem novo, ainda sem vínculo cadastrado,
 * apareça com a perícia 1 abaixo da ficha dele no Shards.
 *
 * ⚠️ Talento que dê bônus de perícia sem vaga cadastrada em regras/talentos.ts
 * ainda não entra no caminho 1 — mas agora cai no 2, marcado, em vez de sumir.
 */
export function totalPericia(
  pericia: Pericia,
  ficha: Personagem,
  escolhas: Record<string, EscolhaVaga>,
  uso: UsoPericia = 'teste',
): number {
  // Uma conta só: o total É a soma do detalhamento. Antes eram duas cópias da
  // mesma fórmula — o tipo de coisa que diverge sem ninguém ver.
  return detalhePericia(pericia, ficha, escolhas, uso).total
}

/** Algo ativo (condição) mudou este número? A tela marca — o jogador não pode achar que é o normal. */
export function alteradoPorCondicao(pericia: Pericia, ficha: Personagem, uso: UsoPericia = 'teste'): boolean {
  return efeitoCondicoesPericia(pericia, ficha, uso).linhas.length > 0
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
  uso: UsoPericia = 'teste',
): DetalhePericia {
  const atributoEfetivo = ficha.atributos[pericia.atributo] + ficha.atributosMod[pericia.atributo]
  const linhas: ParcelaBonus[] = [
    { origem: ATRIBUTO[pericia.atributo].nome, valor: atributoEfetivo },
    { origem: 'Graduação', valor: pericia.graduacao },
    ...origensBonusPericia(pericia.id, escolhas),
  ]
  // Honestidade: o app mostra o número certo E diz que não sabe de onde veio.
  const naoAtribuido = bonusNaoAtribuido(pericia, escolhas)
  if (naoAtribuido > 0) linhas.push({ origem: ROTULO.bonusSemOrigem, valor: naoAtribuido })
  if (pericia.misc !== 0) linhas.push({ origem: 'Outros (misc)', valor: pericia.misc })
  // Condição ativa (Aprimorado, Exausto) entra como parcela nomeada — o jogador
  // vê que o número caiu E por quê (regras/condicoes.ts).
  linhas.push(...efeitoCondicoesPericia(pericia, ficha, uso).linhas)
  return {
    titulo: pericia.nome,
    linhas,
    total: linhas.reduce((soma, l) => soma + l.valor, 0),
  }
}

/** "50 kg" → 50. Usado pra comparar com o peso carregado (ambos em kg — o tradutor converte na entrada). */
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
