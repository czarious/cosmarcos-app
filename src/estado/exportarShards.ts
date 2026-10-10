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
 * aprimoramentos, revezes, novos/removidos) · anotações (→ campo NOTES) ·
 * objetivos (marcos, concluído, novos/removidos) · ideais (marcos, jurado, texto) ·
 * equipamento em texto livre (→ campo EQUIPMENT) · condições (valor no `detail`) ·
 * lesões (tipo, dias; o efeito d8 no começo da descrição) · identidade e textos
 * da aba Personagem (jogador, nível, ancestralidade, culturas, kit, trilha, ordem,
 * propósito, obstáculo, personalidade, aparência, conexões).
 */

import type { Personagem, Fabrial, Ideal } from '../tipos/personagem'
import { APRIMORAMENTO_ID, REVES_ID, QUALIDADE_FABRIAL, FABRIAL_PADRAO_ID, CONDICAO_ID, GRAVIDADE_LESAO, ATRIBUTO, TIPO_ESPECIALIDADE, ARMA_NOME, ARMADURA_NOME, ANCESTRALIDADE, CULTURA, CONJUNTO_INICIAL, TRILHA_HEROICA, ORDEM } from './deparaShards'
import { indicesDaCultura } from '../regras/especialidadesCulturais'
import { EFEITOS_LESAO } from '../regras/condicoes'
import { ID_NOTAS_SHARDS, NOTAS_DE_TRILHA } from './importarShards'
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

const CONDICAO_EN = inverte(CONDICAO_ID)
const GRAVIDADE_EN = inverte(GRAVIDADE_LESAO)
const ATRIBUTO_EN = inverte(ATRIBUTO)
const TIPO_ESPECIALIDADE_EN = inverte(TIPO_ESPECIALIDADE)
const ARMA_EN = inverte(ARMA_NOME)
const ARMADURA_EN = inverte(ARMADURA_NOME)

/**
 * Campo que o app traduz do Shards (cultura, trilha…): se o valor em português
 * não mudou, volta o original byte a byte; mudou, volta o texto do Shards dele.
 */
function campoTraduzido(original: unknown, atual: string, mapa: Record<string, string>): unknown {
  const cru = typeof original === 'string' ? original.trim() : ''
  if ((mapa[cru] ?? cru) === atual) return original
  return inverte(mapa)[atual] ?? atual
}

/** Texto livre: igual ao original (sem contar espaço nas pontas) volta o original. */
function campoTexto(original: unknown, atual: string): unknown {
  return (typeof original === 'string' ? original.trim() : '') === atual.trim() ? original : atual
}

/**
 * Especialidades → `expertises`, menos as culturais fixas (o Shards as tira da
 * cultura). A que já existia no Shards volta com o mesmo id; a nova ganha um.
 */
function especialidadesShards(ficha: Personagem, crus: Obj[]): Obj[] {
  const fixos = indicesDaCultura(ficha)
  const usados = new Set<Obj>()
  return ficha.especializacoes
    .filter((_, i) => !fixos.has(i))
    .map((e) => {
      const name = e.tipo === 'arma' ? (ARMA_EN[e.nome] ?? e.nome) : e.tipo === 'armadura' ? (ARMADURA_EN[e.nome] ?? e.nome) : e.nome
      const type = TIPO_ESPECIALIDADE_EN[e.tipo]
      const cru = crus.find((x) => !usados.has(x) && x.type === type && x.name === name)
      if (cru) {
        usados.add(cru)
        return cru
      }
      return { id: crypto.randomUUID(), type, name, source: 'manual' }
    })
}

/** Condição no formato do Shards — o valor vai no `detail`, que ele lê ("+1 Strength", "-2"). */
function condicaoShards(c: Personagem['condicoes'][number]): Obj {
  const detail =
    c.id === 'exausto' && c.valor ? `-${c.valor}` : c.id === 'aprimorado' && c.valor && c.atributo ? `+${c.valor} ${ATRIBUTO_EN[c.atributo][0].toUpperCase()}${ATRIBUTO_EN[c.atributo].slice(1)}` : c.id === 'afligido' ? (c.dano ?? '') : ''
  return { id: c.uid, name: CONDICAO_EN[c.id], detail }
}

/** Lesão no formato do Shards — o efeito d8 (que ele não tem) no começo da descrição. */
function lesaoShards(l: Personagem['lesoes'][number]): Obj {
  const efeito = EFEITOS_LESAO.find((e) => e.id === l.efeito && e.id !== 'outro')
  const description = [efeito?.nome, l.descricao].filter(Boolean).join(' — ')
  const duration = l.diasRestantes !== undefined ? `${l.diasRestantes} days` : l.gravidade === 'superficial' ? 'Long rest' : ''
  return { id: l.uid, type: GRAVIDADE_EN[l.gravidade], duration, description }
}

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
  const fixos = new Set<string>([ID_NOTAS_SHARDS, ...NOTAS_DE_TRILHA.map((n) => n.id)])
  const outros = ficha.anotacoes.filter((a) => !fixos.has(a.id))
  return [solto?.conteudo ?? '', ...outros.map((a) => `### ${a.titulo}\n${a.conteudo}`)].filter((x) => x !== '').join('\n\n')
}

/**
 * Ideais → o Shards guarda jurado e texto no topo do `radiant` E no vínculo
 * (onde moram também os marcos). O tradutor lê o 1º vínculo; a volta escreve
 * nos dois. Ideal que o app não lista (os futuros) volta intocado.
 */
function radianteShards(ideais: Ideal[], cru: Obj): Obj {
  const jurados: Obj = {}
  const textos: Obj = {}
  const marcos: Obj = {}
  for (const i of ideais) {
    jurados[`i${i.n}`] = i.jurado
    marcos[`i${i.n}`] = i.marcos
    if (i.texto) textos[`i${i.n}`] = i.texto
  }
  const funde = (o: unknown, novo: Obj) => ({ ...(o as Obj), ...novo })
  return {
    ...cru,
    ideals: funde(cru.ideals, jurados),
    idealsText: funde(cru.idealsText, textos),
    sprenBonds: lista(cru.sprenBonds).map((v, k) =>
      k === 0
        ? { ...v, ideals: funde(v.ideals, jurados), idealsText: funde(v.idealsText, textos), idealMilestones: funde(v.idealMilestones, marcos) }
        : v,
    ),
  }
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

  // objetivos: o objeto cru pelo nome (guarda o `type`), na ordem do app; as
  // linhas em branco que o Shards deixa no fim voltam como estavam
  const goalsCrus = lista(c.goals)
  c.goals = [
    ...ficha.objetivos.map((o) => ({
      ...(goalsCrus.find((g) => g.name === o.nome) ?? { name: o.nome, type: '' }),
      achieved: o.concluido,
      rank: o.grau,
    })),
    ...goalsCrus.filter((g) => String(g.name ?? '') === ''),
  ]

  if (ficha.radiante) c.radiant = radianteShards(ficha.radiante.ideais, c.radiant as Obj)

  c.notes = notasShards(ficha)
  // cartão "Path Notes": cada bloco volta pro seu campo; bloco apagado no app volta vazio
  const [trilha, talentos] = NOTAS_DE_TRILHA.map((n) => ficha.anotacoes.find((a) => a.id === n.id)?.conteudo ?? '')
  const meta = c.meta as Obj
  const [cultura1, cultura2] = ficha.meta.culturas
  c.meta = {
    ...meta,
    paths: trilha,
    player: campoTexto(meta.player, ficha.meta.jogador),
    level: meta.level === ficha.meta.nivel ? meta.level : ficha.meta.nivel,
    ancestry: campoTraduzido(meta.ancestry, ficha.meta.ancestralidade, ANCESTRALIDADE),
    culture1: campoTraduzido(meta.culture1, cultura1 ?? '', CULTURA),
    culture2: campoTraduzido(meta.culture2, cultura2 ?? '', CULTURA),
    startingKit: campoTraduzido(meta.startingKit, ficha.meta.kitInicial, CONJUNTO_INICIAL),
    purpose: campoTexto(meta.purpose, ficha.proposito),
    obstacle: campoTexto(meta.obstacle, ficha.obstaculo),
    personality: campoTexto(meta.personality, ficha.personalidade),
    appearance: campoTexto(meta.appearance, ficha.aparencia),
    connections: campoTexto(meta.connections, ficha.conexoes),
  }
  if (c.heroic && typeof c.heroic === 'object') {
    const h = c.heroic as Obj
    c.heroic = { ...h, startingPath: campoTraduzido(h.startingPath, ficha.meta.trilhaHeroica, TRILHA_HEROICA) }
  }
  if (c.radiant && typeof c.radiant === 'object') {
    const r = c.radiant as Obj
    c.radiant = { ...r, order: campoTraduzido(r.order, ficha.meta.trilhaRadiante ?? '', ORDEM) }
  }
  c.talents = talentos
  c.equipment = ficha.equipamentoTexto
  c.expertises = especialidadesShards(ficha, lista(c.expertises))
  c.conditions = ficha.condicoes.map(condicaoShards)
  c.injuries = ficha.lesoes.map(lesaoShards)
  c.injuriesCount = ficha.lesoes.length
  c.updatedAt = new Date().toISOString()

  return JSON.stringify({ format: 'cosmere-v3', version: 1, characters: [c] }, null, 2)
}
