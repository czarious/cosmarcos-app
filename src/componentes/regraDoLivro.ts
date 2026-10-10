/* arquivo: regraDoLivro.ts */
import type { Personagem, Item } from '../tipos/personagem'
import type { Dicionario } from '../idioma/pt'
import { emTopicos } from '../idioma/idioma'
import { tracoPorNome } from '../regras/tracos'
import { armaPorNome } from '../regras/armas'
import { armaduraPorNome } from '../regras/armaduras'
import { equipamentoPorNome } from '../regras/equipamentos'
import { kitPorNome } from '../regras/kits'
import { ancestralidadePorNome, culturaPorNome, trilhaHeroicaPorNome, ordemPorNome } from '../regras/origens'

/**
 * A "regra do livro" de cada coisa, em tópicos, pro botão de informação
 * (BotaoInfo). Num lugar só: mudar como um traço, uma arma, um item ou uma
 * origem se explica muda em toda tela que mostra aquilo (César, 10/Out/2026 —
 * "deixe grandes mudanças afetarem as áreas que devem ser afetadas").
 * Lista vazia = o catálogo não tem texto: a tela não mostra o ⓘ.
 * O texto vem dos catálogos de regras/ (resumo do livro com palavras próprias).
 */

/** O que a tela passa: as palavras (tx), preencher lacuna (t) e o nome de jogo no idioma (nome). */
export type Palavras = {
  t: (modelo: string, vars?: Record<string, string | number>) => string
  tx: Dicionario
  nome: (pt: string) => string
}

/** Um traço de arma ou armadura, em tópicos (a janela do chip). */
export function regraDoTraco(traco: string): string[] {
  const r = tracoPorNome(traco)
  return r ? emTopicos(r.resumo) : []
}

/** Vários traços, uma linha cada ("Ímpeto: …") — dentro da regra de uma arma ou item. */
function linhasDosTracos(tracos: string[], { t, tx, nome }: Palavras): string[] {
  return tracos.flatMap((tr) => {
    const r = tracoPorNome(tr)
    return r ? [t(tx.geral.nomeTexto, { nome: nome(tr), texto: r.resumo })] : []
  })
}

export function regraDaArma(a: Personagem['armas'][number], p: Palavras): string[] {
  const e = armaPorNome(a.nome)
  const dano = e ? [p.t(p.tx.inventario.regraArma, { dano: e.dano ?? e.danoNota ?? '—', tipo: e.tipoDano ? p.nome(e.tipoDano) : '' })] : []
  const perito = e?.notaPerito ? [p.t(p.tx.acoes.notaPerito, { texto: e.notaPerito })] : []
  return [...dano, ...linhasDosTracos([...a.tracos, ...a.tracosPerito], p), ...perito]
}

/** Só o que a especialidade muda na arma e não é traço (o ⓘ do nome no cartão de ataque). */
export function notaPeritoDaArma(nomeArma: string, p: Palavras): string[] {
  const nota = armaPorNome(nomeArma)?.notaPerito
  return nota ? [p.t(p.tx.acoes.notaPerito, { texto: nota })] : []
}

export function regraDoItem(item: Item, p: Palavras): string[] {
  const arm = item.deflexao !== undefined ? armaduraPorNome(item.nome) : undefined
  const eq = equipamentoPorNome(item.nome)
  return [
    ...(arm ? [p.t(p.tx.inventario.regraArmadura, { n: arm.deflexao })] : []),
    ...linhasDosTracos([...(item.tracos ?? []), ...(item.tracosPerito ?? [])], p),
    ...(eq?.resumo ? emTopicos(eq.resumo) : []),
  ]
}

export function regraDaAncestralidade(n: string): string[] {
  const a = ancestralidadePorNome(n)
  return a ? [...emTopicos(a.resumo), ...a.oQueDa] : []
}

export function regraDaCultura(n: string, p: Palavras): string[] {
  const c = culturaPorNome(n)
  return c ? [p.t(p.tx.personagem.regraEspecialidadeCultural, { x: p.nome(c.especialidade) }), ...emTopicos(c.resumo), ...c.oQueSabe] : []
}

export function regraDaTrilha(n: string, p: Palavras): string[] {
  const tr = trilhaHeroicaPorNome(n)
  if (!tr) return []
  return [
    ...emTopicos(tr.resumo),
    ...(tr.periciaInicial ? [p.t(p.tx.personagem.regraPericiaInicial, { x: p.nome(tr.periciaInicial) })] : []),
    ...(tr.especializacoes ?? []).map((e) => p.t(p.tx.personagem.regraEspecializacao, { x: e })),
  ]
}

export function regraDoKit(n: string, p: Palavras): string[] {
  const k = kitPorNome(n)
  if (!k) return []
  return [
    ...k.armas.map((x) => p.t(p.tx.personagem.regraKitArma, { x })),
    ...(k.armadura ? [p.t(p.tx.personagem.regraKitArmadura, { x: k.armadura })] : []),
    ...k.equipamentos,
    ...(k.esferas ? [p.t(p.tx.personagem.regraKitEsferas, { x: k.esferas })] : []),
    ...k.extras,
  ]
}

export function regraDaOrdem(n: string, p: Palavras): string[] {
  const o = ordemPorNome(n)
  if (!o) return []
  return [
    ...emTopicos(o.resumo),
    p.t(p.tx.personagem.regraEspreno, { x: o.espreno }),
    p.t(p.tx.personagem.regraFluxos, { a: p.nome(o.fluxos[0]), b: p.nome(o.fluxos[1]) }),
    ...(o.ideais ?? []),
  ]
}
