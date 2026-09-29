/* arquivo: exportarShards.ts */

/**
 * O CAMINHO DE VOLTA — ficha do app → JSON que o Shards importa
 * (Files → Import JSON; o Shards substitui a ficha de mesmo `id`).
 *
 * O app não guarda tudo que o Shards tem (trilhas, árvore de talentos,
 * ideais, conexões…). Por isso a exportação NÃO monta o JSON do zero: parte
 * da SEMENTE — o personagem cru do Shards, guardado na importação — e só
 * aplica por cima o que o app edita. Campo que o app não toca volta
 * byte a byte como veio. Conferido ida e volta em 27/Set/2026.
 *
 * O que o app edita e volta: Vida/Foco/Investidura atuais · marcos · armas
 * equipadas · itens (adicionados/removidos) · fabriais (cargas, qualidade,
 * aprimoramentos, revezes, novos/removidos) · anotações (→ campo NOTES).
 */

import type { Personagem, Fabrial } from '../tipos/personagem'
import { APRIMORAMENTO_ID, REVES_ID, QUALIDADE_FABRIAL, FABRIAL_PADRAO_ID } from './deparaShards'
import { ID_NOTAS_SHARDS } from './importarShards'
import { ID_PROPRIO, CARACTERISTICAS_AVANCADAS, efeitoUnico, APRIMORAMENTOS_GERAIS, REVEZES_GERAIS } from '../regras/fabriais'

type Obj = Record<string, unknown>

/** Inverte um de-para: id nosso → texto do Shards. */
function inverte(mapa: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(mapa).map(([en, nosso]) => [nosso, en]))
}

const APRIMORAMENTO_EN = inverte(APRIMORAMENTO_ID)
const REVES_EN = inverte(REVES_ID)
const QUALIDADE_EN = inverte(QUALIDADE_FABRIAL)
const FABRIAL_PADRAO_EN = inverte(FABRIAL_PADRAO_ID)

function lista(v: unknown): Obj[] {
  return Array.isArray(v) ? (v as Obj[]) : []
}

/** Mesmo critério do tradutor: o Shards em métrico escreve "kg" no `weightRaw`. */
function ehMetrico(itens: Obj[]): boolean {
  return itens.some((it) => /\bkg\b/i.test(String(it.weightRaw ?? '')))
}

/** kg do livro (2 lb = 1 kg) → número e rótulo no sistema do Shards. */
function pesoShards(kg: number, metrico: boolean): { weight: number; weightRaw: string } {
  const lb = kg * 2
  if (!metrico) return { weight: lb, weightRaw: `${lb} lb.` }
  const exato = Math.round(lb * 0.45359237 * 10) / 10 // mesmo arredondamento do Shards
  return { weight: exato, weightRaw: `${exato} kg` }
}

/**
 * Aprimoramentos/revezes → objetos do Shards. Reaproveita o objeto cru
 * quando ele já existia (mantém id e a descrição que o jogador escreveu, ex.:
 * o "Double Attack" do PROJÉTIL).
 */
function opcoesShards(ids: string[], cru: Obj[], f: Fabrial, lado: 'aprimoramento' | 'reves'): Obj[] {
  const paraEn = lado === 'aprimoramento' ? APRIMORAMENTO_EN : REVES_EN
  const gerais = lado === 'aprimoramento' ? APRIMORAMENTO_ID : REVES_ID
  const livre = cru.filter((o) => !(String(o.name) in gerais)) // o que o tradutor leu como PROPRIO/texto livre
  const efeito = efeitoUnico(f.modelo)
  return ids.map((id) => {
    const nomeEn = paraEn[id]
    if (nomeEn) {
      const existente = cru.find((o) => o.name === nomeEn)
      if (existente) return existente
      const geral = [...APRIMORAMENTOS_GERAIS, ...REVEZES_GERAIS].find((o) => o.id === id)
      return { id: crypto.randomUUID(), name: nomeEn, description: geral?.resumo ?? '' }
    }
    if (id === ID_PROPRIO) {
      const existente = livre.shift()
      if (existente) return existente
      return {
        id: crypto.randomUUID(),
        name: `${lado === 'aprimoramento' ? 'Aprimoramento' : 'Revés'} do ${efeito?.nome ?? f.nome}`,
        description: lado === 'aprimoramento' ? (efeito?.aprimoramento ?? '') : (efeito?.reves ?? ''),
      }
    }
    const avancada = CARACTERISTICAS_AVANCADAS.find((c) => c.id === id)
    const existente = cru.find((o) => o.name === (avancada?.nome ?? id))
    return existente ?? { id: crypto.randomUUID(), name: avancada?.nome ?? id, description: avancada?.resumo ?? '' }
  })
}

function fabrialShards(f: Fabrial, cru: Obj | undefined): Obj {
  const base: Obj = cru ? { ...cru } : { id: f.id }
  base.chargesCur = f.cargas.atual
  base.chargesMax = f.cargas.max
  base.upgrades = opcoesShards(f.aprimoramentos, lista(cru?.upgrades), f, 'aprimoramento')
  base.drawbacks = opcoesShards(f.revezes, lista(cru?.drawbacks), f, 'reves')
  if (f.tipo === 'padrao') {
    if (!cru) Object.assign(base, { name: FABRIAL_PADRAO_EN[f.modelo ?? ''] ?? f.nome, transformationEnabled: false, transformationRanks: 0 })
    return base
  }
  // único: nome, qualidade e textos são editáveis no app
  base.name = f.nome
  base.quality = f.qualidade ? QUALIDADE_EN[f.qualidade] : ''
  base.gem = f.gema ?? ''
  base.material = f.material ?? ''
  base.effects = f.notas ?? ''
  if (!cru) Object.assign(base, { features: '', trackPath: '', pathRanks: 0 })
  return base
}

/** Anotações → um campo de texto: o bloco do Shards solto no topo, os outros como "### Título". */
function notasShards(ficha: Personagem): string {
  const solto = ficha.anotacoes.find((a) => a.id === ID_NOTAS_SHARDS)
  const outros = ficha.anotacoes.filter((a) => a.id !== ID_NOTAS_SHARDS)
  return [solto?.conteudo ?? '', ...outros.map((a) => `### ${a.titulo}\n${a.conteudo}`)].filter((x) => x !== '').join('\n\n')
}

/**
 * Devolve o JSON pronto pro Shards importar. `semente` é o personagem cru que
 * veio do Shards na última importação.
 */
export function exportarShards(ficha: Personagem, semente: Obj): string {
  const c: Obj = structuredClone(semente)

  const rec = { ...(c.resources as Obj) }
  rec.healthCur = ficha.recursos.vida.atual
  rec.focusCur = ficha.recursos.foco.atual
  rec.investitureCur = ficha.recursos.investidura.atual
  rec.marks = ficha.marcos
  c.resources = rec

  // inventário: o que o app ainda tem, na ordem do Shards; removidos saem; novos entram no fim
  const inv = { ...(c.inventory as Obj) }
  const itensCrus = lista(inv.items)
  const metrico = ehMetrico(itensCrus)
  const armasPorId = new Map(ficha.armas.filter((a) => a.idShards).map((a) => [a.idShards, a]))
  const itensPorId = new Map(ficha.itens.filter((i) => i.idShards).map((i) => [i.idShards, i]))
  const mantidos = itensCrus.flatMap((it) => {
    const arma = armasPorId.get(String(it.id))
    if (arma) return [{ ...it, equipped: arma.equipada }]
    const item = itensPorId.get(String(it.id))
    if (item) return [{ ...it, quantity: item.qtd, equipped: item.equipado }]
    return [] // removido no app
  })
  const novos = ficha.itens
    .filter((i) => !i.idShards)
    .map((i) => ({
      id: crypto.randomUUID(),
      sourceId: '',
      name: i.nome,
      type: 'item',
      quantity: i.qtd,
      ...pesoShards(i.peso, metrico),
      damage: '',
      range: null,
      rangeLabel: '',
      skill: '',
      deflect: '',
      traits: [],
      expertTraits: [],
      category: i.tipo,
      equipped: i.equipado,
      notes: '',
      effects: '',
      modifiers: [],
    }))
  inv.items = [...mantidos, ...novos]
  c.inventory = inv

  const fabCru = c.fabrials as Obj
  const crus = new Map([...lista(fabCru.standard), ...lista(fabCru.custom)].map((f) => [String(f.id), f]))
  c.fabrials = {
    ...fabCru,
    standard: ficha.fabriais.filter((f) => f.tipo === 'padrao').map((f) => fabrialShards(f, crus.get(f.id))),
    custom: ficha.fabriais.filter((f) => f.tipo === 'unico').map((f) => fabrialShards(f, crus.get(f.id))),
  }

  c.notes = notasShards(ficha)
  c.updatedAt = new Date().toISOString()

  return JSON.stringify({ format: 'cosmere-v3', version: 1, characters: [c] }, null, 2)
}
