/* arquivo: importarShards.ts */

/**
 * O TRADUTOR — JSON do Shards → nosso schema (Personagem).
 *
 * A ÚNICA porta de entrada de dado no app (premissas.md → "Schema próprio em português + tradutor na entrada"). O Shards está na 3.5.0
 * e VAI mudar de formato. Quando mudar, este arquivo é o único que quebra — e o
 * risco é quebrar CALADO (campo some, tela zera, ninguém vê). Por isso aqui a
 * regra é: validar o que dá, e GRITAR (throw) no que não reconhecer.
 *
 * Conferido campo a campo contra o export real do Eccho — ver escopo/dados.md.
 */

import type {
  Personagem,
  Atributos,
  Pericia,
  Talento,
  Arma,
  Item,
  Fabrial,
  Objetivo,
  Ideal,
  Fluxo,
  Radiante,
  Especializacao,
  Anotacao,
} from '../tipos/personagem'
import {
  ATRIBUTO,
  PERICIA_NOME,
  PERICIA_NOME_POR_INGLES,
  TIPO_DANO,
  ARMA_NOME,
  ITEM_NOME,
  ANCESTRALIDADE,
  CULTURA,
  CONJUNTO_INICIAL,
  TRILHA_HEROICA,
  ORDEM,
  ESPRENO,
  FLUXO,
  TALENTO_FLUXO,
  CATEGORIA_ITEM,
  traduz,
  TRACO_ARMA,
  TRACO_COM_DISTANCIA,
  TIPO_ESPECIALIDADE,
  FABRIAL_PADRAO_ID,
  APRIMORAMENTO_ID,
  REVES_ID,
  QUALIDADE_FABRIAL,
  ESPECIALIDADE_CULTURAL,
} from './deparaShards'
import { efeitoPorNome, ID_PROPRIO, CARACTERISTICAS_AVANCADAS } from '../regras/fabriais'

/** Erro com contexto — diz QUAL personagem e QUAL campo, pra caçar rápido. */
export class ErroImportacao extends Error {
  constructor(mensagem: string) {
    super(`[importarShards] ${mensagem}`)
    this.name = 'ErroImportacao'
  }
}

/** "1d6 impact" → { dado: "1d6", tipoDano: "impactante" }. Palavra não mapeada passa crua. */
function separaDano(bruto: string): { dado: string; tipoDano: string } {
  const m = bruto.match(/^(.*\d)\s+(\S+)$/)
  if (!m) return { dado: bruto, tipoDano: '' }
  const [, dado, tipoIngles] = m
  return { dado, tipoDano: TIPO_DANO[tipoIngles.toLowerCase()] ?? tipoIngles }
}

/**
 * "Thrown [30/120]" · "Thrown (20/60)" · "Loaded [1]" → PT-BR. O Shards usa
 * colchete ou parêntese conforme a arma; a saída é sempre colchete, como o
 * livro. Distância de traço vem em pés mesmo com o Shards em métrico.
 */
function traduzTraco(bruto: string): string {
  const m = bruto.trim().match(/^([^[(]+?)\s*(?:[[(]([^\])]*)[\])])?$/)
  if (!m) return bruto
  const [, nome, valor] = m
  const traduzido = TRACO_ARMA[nome] ?? nome
  if (valor === undefined) return traduzido
  const valorFinal = TRACO_COM_DISTANCIA.has(nome)
    ? valor.split('/').map((v) => fmt(ftParaM(Number(v)))).join('/')
    : valor
  return `${traduzido} [${valorFinal}]`
}

// ── ajudantes de leitura segura ────────────────────────────────────
type Obj = Record<string, unknown>

function ehObjeto(v: unknown): v is Obj {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function num(v: unknown, ondeErro: string): number {
  const n = typeof v === 'string' ? Number(v) : v
  if (typeof n !== 'number' || Number.isNaN(n)) {
    throw new ErroImportacao(`esperava número em "${ondeErro}", veio: ${JSON.stringify(v)}`)
  }
  return n
}

function texto(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

function lista(v: unknown): unknown[] {
  return Array.isArray(v) ? v : []
}

// ── unidades: a mesa joga em METROS e KG, com os números do livro ─────
// O Guia PT-BR usa 5 ft = 1,5 m (×0,3) e 2 lb = 1 kg (×0,5) — ex.: Maça
// 3 lb = 1,5 kg (07-itens/04-armas.md); movimento e sentidos batem também.
// Então a conta parte SEMPRE do número imperial.
//
// ⚠️ O Shards tem modo métrico (Settings → Units) e ele é inconsistente:
//  - converte só o INVENTÁRIO (peso e alcance de arma), com fator exato
//    (Maça = 1,4 kg — o livro diz 1,5 kg);
//  - movimento, sentidos, capacidades e alcance do espreno continuam em pés/
//    libras, só com o RÓTULO trocado ("20 m" = 20 ft).
// Por isso: número do inventário em métrico volta pra imperial (desfazendo o
// fator exato) e o resto ignora o rótulo. Conferido em 27/Set/2026.
type SistemaUnidades = 'imperial' | 'metrico'

const LB_POR_KG_EXATO = 1 / 0.45359237
const FT_POR_M_EXATO = 1 / 0.3048

function arredonda(n: number, passo: number): number {
  return Math.round(n / passo) * passo
}

/**
 * 1.5 → "1,5" — número de tela em PT-BR, sem zeros de ponto flutuante. Sem
 * separador de milhar: `pesoEmKg` (regras/calculos.ts) lê "1250 kg" de volta.
 */
function fmt(n: number): string {
  return Number(n.toFixed(2)).toLocaleString('pt-BR', { useGrouping: false })
}

function ftParaM(ft: number): number {
  return Number((ft * 0.3).toFixed(2))
}

function lbParaKg(lb: number): number {
  return Number((lb * 0.5).toFixed(2))
}

/** Peso de item do Shards → kg do livro. */
function pesoItem(v: number, sistema: SistemaUnidades): number {
  return lbParaKg(sistema === 'metrico' ? arredonda(v * LB_POR_KG_EXATO, 0.5) : v)
}

/** Distância de arma do Shards → m do livro. */
function distanciaItem(v: number, sistema: SistemaUnidades): number {
  return ftParaM(sistema === 'metrico' ? arredonda(v * FT_POR_M_EXATO, 5) : v)
}

/** O Shards não diz o sistema no export: o `weightRaw` dos itens entrega ("1.4 kg" × "3 lb."). */
function detectaSistema(itens: unknown[]): SistemaUnidades {
  return itens.some((it) => ehObjeto(it) && /\bkg\b/i.test(texto(it.weightRaw))) ? 'metrico' : 'imperial'
}

/** "20 ft" ou "20 m" (rótulo falso do Shards) → "6 m". O número é sempre pés. */
function distanciaDerivada(txt: string): string {
  const m = txt.match(/([\d.]+)/)
  return m ? `${fmt(ftParaM(Number(m[1])))} m` : txt
}

/** "100 lb" ou "100 kg" (rótulo falso do Shards) → "50 kg". O número é sempre libras. */
function pesoDerivado(txt: string): string {
  const m = txt.match(/([\d.]+)/)
  return m ? `${fmt(lbParaKg(Number(m[1])))} kg` : txt
}

/** Traduz os 6 atributos. Campo que faltar = grita (é a espinha da ficha). */
function traduzAtributos(bruto: unknown, onde: string): Atributos {
  if (!ehObjeto(bruto)) throw new ErroImportacao(`"${onde}" não é um objeto`)
  const saida = {} as Atributos
  for (const [en, pt] of Object.entries(ATRIBUTO)) {
    saida[pt] = num(bruto[en], `${onde}.${en}`)
  }
  return saida
}

function traduzPericias(bruto: unknown): Pericia[] {
  return lista(bruto).map((p, i) => {
    if (!ehObjeto(p)) throw new ErroImportacao(`skills[${i}] não é objeto`)
    const trait = texto(p.trait)
    const atributo = ATRIBUTO[trait]
    if (!atributo) throw new ErroImportacao(`skills[${i}].trait desconhecido: "${trait}"`)
    const chave = texto(p.key)
    return {
      id: chave,
      // sem entrada no de-para → cai no nome cru do Shards (inglês) como
      // último recurso, pra nunca sumir uma perícia da tela
      nome: PERICIA_NOME[chave] ?? texto(p.name),
      atributo,
      graduacao: num(p.rank ?? 0, `skills[${i}].rank`),
      graduacaoBonus: num(p.rankBonus ?? 0, `skills[${i}].rankBonus`),
      misc: num(p.misc ?? 0, `skills[${i}].misc`),
    }
  })
}

function traduzEspecializacoes(bruto: unknown): Especializacao[] {
  return lista(bruto).map((e) => {
    const o = ehObjeto(e) ? e : {}
    const bruto = texto(o.type)
    const tipo = TIPO_ESPECIALIDADE[bruto]
    if (!tipo) throw new ErroImportacao(`expertises: tipo desconhecido "${bruto}" (${texto(o.name)})`)
    return { tipo, nome: texto(o.name) }
  })
}

/** Talentos moram em TRÊS lugares no Shards — juntamos num array só, com origem. */
function traduzTalentos(raiz: Obj): Talento[] {
  const heroic = ehObjeto(raiz.heroic) ? raiz.heroic : {}
  const radiant = ehObjeto(raiz.radiant) ? raiz.radiant : {}

  const de = (arr: unknown, origem: Talento['origem']): Talento[] =>
    lista(arr).map((t) => {
      const o = ehObjeto(t) ? t : {}
      return {
        id: texto(o.id),
        nome: texto(o.name),
        origem,
        chave: o.isKey === true,
      }
    })

  return [
    ...de(heroic.talents, 'heroica'),
    ...de(radiant.talents, 'radiante'),
    ...de(raiz.ancestryTalents, 'ancestral'),
  ]
}

/** Armas NÃO existem como campo: são inventory.items com type === "weapon". */
function separaInventario(bruto: unknown): { armas: Arma[]; itens: Item[] } {
  const armas: Arma[] = []
  const itens: Item[] = []
  const sistema = detectaSistema(lista(bruto))
  for (const it of lista(bruto)) {
    if (!ehObjeto(it)) continue
    if (texto(it.type) === 'weapon') {
      const r = ehObjeto(it.range) ? it.range : {}
      const alcance =
        texto(r.type) === 'melee'
          ? `Corpo a corpo (${fmt(distanciaItem(num(r.reach ?? (sistema === 'metrico' ? 1.5 : 5), 'range.reach'), sistema))} m)`
          : `À distância [${fmt(distanciaItem(num(r.short ?? 0, 'range.short'), sistema))}/${fmt(distanciaItem(num(r.long ?? 0, 'range.long'), sistema))} m]`
      const { dado, tipoDano } = separaDano(texto(it.damage))
      const nomePericia = texto(it.skill)
      const nomeArma = texto(it.name)
      armas.push({
        idShards: texto(it.id) || undefined,
        nome: ARMA_NOME[nomeArma] ?? nomeArma,
        pericia: PERICIA_NOME_POR_INGLES[nomePericia] ?? nomePericia,
        dano: dado,
        tipoDano,
        alcance,
        tracos: lista(it.traits).map(texto).map(traduzTraco),
        tracosPerito: lista(it.expertTraits).map(texto).map(traduzTraco),
        peso: pesoItem(num(it.weight ?? 0, 'weapon.weight'), sistema),
        equipada: it.equipped === true,
      })
    } else {
      const categoria = texto(it.category) || texto(it.type)
      itens.push({
        idShards: texto(it.id) || undefined,
        nome: traduz(ITEM_NOME, texto(it.name)),
        tipo: traduz(CATEGORIA_ITEM, categoria),
        qtd: num(it.quantity ?? 1, 'item.quantity'),
        peso: pesoItem(num(it.weight ?? 0, 'item.weight'), sistema),
        equipado: it.equipped === true,
      })
    }
  }
  return { armas, itens }
}


/** Upgrades/drawbacks do Shards → ids de regras/fabriais.ts. */
function traduzOpcoes(bruto: unknown, mapa: Record<string, string>, efeitoConhecido: boolean): string[] {
  return lista(bruto).map((u) => {
    const nome = texto(ehObjeto(u) ? u.name : u)
    // Fora da lista geral, num efeito único conhecido, só pode ser o
    // aprimoramento/revés PRÓPRIO do efeito — o Shards só oferece os gerais e
    // um campo livre (ex.: "Double Attack" do Projétil do Eccho).
    // característica avançada não tem select no Shards — vai pelo nome em PT (estado/exportarShards.ts)
    const avancada = CARACTERISTICAS_AVANCADAS.find((c) => c.nome === nome)
    return mapa[nome] ?? avancada?.id ?? (efeitoConhecido ? ID_PROPRIO : nome)
  })
}

/** Fabriais vêm em dois blocos com formatos diferentes — unificamos. */
function traduzFabriais(bruto: unknown): Fabrial[] {
  if (!ehObjeto(bruto)) return []
  const padrao = (f: unknown): Fabrial => {
    const o = ehObjeto(f) ? f : {}
    return {
      id: texto(o.id) || crypto.randomUUID(),
      nome: traduz(ITEM_NOME, texto(o.name)),
      tipo: 'padrao',
      modelo: FABRIAL_PADRAO_ID[texto(o.name)],
      cargas: {
        atual: num(o.chargesCur ?? 0, 'fabrial.chargesCur'),
        max: num(o.chargesMax ?? 0, 'fabrial.chargesMax'),
      },
      aprimoramentos: traduzOpcoes(o.upgrades, APRIMORAMENTO_ID, false),
      revezes: traduzOpcoes(o.drawbacks, REVES_ID, false),
    }
  }
  const unico = (f: unknown): Fabrial => {
    const o = ehObjeto(f) ? f : {}
    const nome = texto(o.name)
    // O Shards não guarda QUAL efeito o fabrial único usa — casa pelo nome.
    const efeito = efeitoPorNome(nome)
    return {
      id: texto(o.id) || crypto.randomUUID(),
      nome,
      tipo: 'unico',
      modelo: efeito?.id,
      cargas: {
        atual: num(o.chargesCur ?? 0, 'fabrial.chargesCur'),
        max: num(o.chargesMax ?? 0, 'fabrial.chargesMax'),
      },
      qualidade: QUALIDADE_FABRIAL[texto(o.quality)],
      aprimoramentos: traduzOpcoes(o.upgrades, APRIMORAMENTO_ID, efeito !== undefined),
      revezes: traduzOpcoes(o.drawbacks, REVES_ID, efeito !== undefined),
      gema: texto(o.gem) || undefined,
      material: texto(o.material) || undefined,
      notas: texto(o.effects) || undefined,
    }
  }
  return [...lista(bruto.standard).map(padrao), ...lista(bruto.custom).map(unico)]
}

function traduzObjetivos(bruto: unknown): Objetivo[] {
  return lista(bruto)
    .map((g) => {
      const o = ehObjeto(g) ? g : {}
      return {
        nome: texto(o.name),
        concluido: o.achieved === true,
        grau: num(o.rank ?? 0, 'goal.rank'),
      }
    })
    .filter((g) => g.nome !== '') // o Shards deixa linhas em branco no fim
}

/** Ideais: o Shards guarda em DOIS objetos paralelos (idealsText + ideals). Fundimos. */
function traduzIdeais(radiant: Obj): Ideal[] {
  const textos = ehObjeto(radiant.idealsText) ? radiant.idealsText : {}
  const jurados = ehObjeto(radiant.ideals) ? radiant.ideals : {}
  const ideais: Ideal[] = []
  for (let n = 1 as 1 | 2 | 3 | 4 | 5; n <= 5; n = (n + 1) as 1 | 2 | 3 | 4 | 5) {
    const chave = `i${n}`
    const jurado = jurados[chave] === true
    // Ideal não jurado vem com o texto-modelo do Shards, em inglês ("Declare to your…") — não é do jogador.
    const texto_ = jurado || !texto(textos[chave]).startsWith('Declare to your') ? texto(textos[chave]) : ''
    if (texto_ !== '' || jurado) ideais.push({ n, jurado, texto: texto_ })
  }
  return ideais
}

function traduzFluxos(bruto: unknown): Fluxo[] {
  return lista(bruto).map((s, i) => {
    if (!ehObjeto(s)) throw new ErroImportacao(`surgeSkills[${i}] não é objeto`)
    const attr = texto(s.attributeKey)
    const atributo = ATRIBUTO[attr]
    if (!atributo) throw new ErroImportacao(`surgeSkills[${i}].attributeKey desconhecido: "${attr}"`)
    return {
      id: texto(s.id),
      nome: traduz(FLUXO, texto(s.name)),
      atributo,
      graduacao: num(s.rank ?? 0, `surgeSkills[${i}].rank`),
      ativacao: traduzAtivacao(texto(s.activation)),
      talentos: lista(s.talents).map((t) => {
        const o = ehObjeto(t) ? t : {}
        return { id: texto(o.id), nome: traduz(TALENTO_FLUXO, texto(o.name)), aprendido: o.learned === true }
      }),
    }
  })
}

/** Shards: "action" | "action2x" | ... → nossa Ativacao. */
function traduzAtivacao(a: string): Fluxo['ativacao'] {
  switch (a) {
    case 'action': return '1acao'
    case 'action2x': return '2acoes'
    case 'action3x': return '3acoes'
    case 'free': return 'livre'
    case 'reaction': return 'reacao'
    case 'special': return 'especial'
    default: return 'especial' // desconhecido: marca como especial em vez de sumir
  }
}

function traduzRadiante(bruto: unknown): Radiante | undefined {
  if (!ehObjeto(bruto)) return undefined
  const ordem = texto(bruto.order)
  if (ordem === '') return undefined // sem Ordem = não é Radiante ainda (ex.: Calvon)

  const vinculo = ehObjeto(lista(bruto.sprenBonds)[0]) ? (lista(bruto.sprenBonds)[0] as Obj) : {}
  return {
    ordem: traduz(ORDEM, ordem),
    spren: {
      nome: texto(vinculo.name),
      tipo: traduz(ESPRENO, texto(vinculo.type)),
      iluminado: vinculo.enlightened === true,
    },
    alcanceSpren: ftParaM(num(bruto.sprenBondRange ?? 0, 'radiant.sprenBondRange')), // em metros
    ideais: traduzIdeais(bruto),
    fluxos: traduzFluxos(bruto.surgeSkills),
  }
}

/**
 * O campo NOTES do Shards vira o primeiro bloco da aba Anotações. O resto da
 * aba é do app — e some ao reimportar, como toda a ficha.
 */
export const ID_NOTAS_SHARDS = 'shards-notes'
export const TITULO_NOTAS_SHARDS = 'Notas (do Shards)'

/**
 * O campo NOTES do Shards vira a aba Anotações. O Shards tem UM campo; o app,
 * vários blocos — na exportação cada bloco vira "### Título" + texto
 * (estado/exportarShards.ts), e aqui o caminho inverso. Texto antes do
 * primeiro "### " é o bloco "Notas (do Shards)".
 */
function anotacoesDoShards(c: Obj): Anotacao[] {
  const partes = texto(c.notes).split(/^### /m)
  const blocos: Anotacao[] = []
  const solto = partes[0].trim()
  if (solto !== '') blocos.push({ id: ID_NOTAS_SHARDS, titulo: TITULO_NOTAS_SHARDS, conteudo: solto })
  partes.slice(1).forEach((p, i) => {
    const quebra = p.indexOf('\n')
    const titulo = (quebra < 0 ? p : p.slice(0, quebra)).trim()
    const conteudo = quebra < 0 ? '' : p.slice(quebra + 1).trim()
    blocos.push({ id: `nota-${i + 1}`, titulo, conteudo })
  })
  return blocos
}

/** Traduz UM personagem. */
function traduzPersonagem(c: unknown, indice: number): Personagem {
  if (!ehObjeto(c)) throw new ErroImportacao(`personagem [${indice}] não é objeto`)
  // O Shards 3.x também faz ficha de Mistborn — outro sistema, outro schema.
  const sistema = texto(ehObjeto(c.system) ? c.system.type : '') || texto(c.characterType)
  if (sistema !== '' && sistema !== 'stormlight') {
    throw new ErroImportacao(`personagem [${indice}] é de "${sistema}" — o app só lê ficha de Stormlight`)
  }

  const meta = ehObjeto(c.meta) ? c.meta : {}
  const rec = ehObjeto(c.resources) ? c.resources : {}
  const def = ehObjeto(c.defenses) ? c.defenses : {}
  const defB = ehObjeto(c.defenseBonuses) ? c.defenseBonuses : {}

  // grita cedo se faltar a espinha
  if (!ehObjeto(c.attributes)) throw new ErroImportacao(`personagem [${indice}] sem "attributes"`)
  if (!ehObjeto(c.resources)) throw new ErroImportacao(`personagem [${indice}] sem "resources"`)

  const culturas = [texto(meta.culture1), texto(meta.culture2)].filter((x) => x !== '').map((x) => traduz(CULTURA, x))
  const { armas, itens } = separaInventario(ehObjeto(c.inventory) ? c.inventory.items : [])

  return {
    meta: {
      nome: texto(meta.name),
      jogador: texto(meta.player),
      nivel: num(meta.level ?? 0, 'meta.level'),
      ancestralidade: traduz(ANCESTRALIDADE, texto(meta.ancestry)),
      culturas,
      kitInicial: traduz(CONJUNTO_INICIAL, texto(meta.startingKit)),
      trilhaHeroica: traduz(TRILHA_HEROICA, texto(ehObjeto(c.heroic) ? c.heroic.startingPath : '')),
      trilhaRadiante: traduz(ORDEM, texto(ehObjeto(c.radiant) ? c.radiant.order : '')) || undefined,
    },
    atributos: traduzAtributos(c.attributes, 'attributes'),
    atributosMod: ehObjeto(c.attributeMods)
      ? traduzAtributos(c.attributeMods, 'attributeMods')
      : traduzAtributos(
          { strength: 0, speed: 0, intellect: 0, willpower: 0, awareness: 0, presence: 0 },
          'attributeMods',
        ),
    defesas: {
      fisica: num(def.physical ?? 0, 'defenses.physical'),
      cognitiva: num(def.cognitive ?? 0, 'defenses.cognitive'),
      espiritual: num(def.spiritual ?? 0, 'defenses.spiritual'),
    },
    defesasBonus: {
      fisica: num(defB.physical ?? 0, 'defenseBonuses.physical'),
      cognitiva: num(defB.cognitive ?? 0, 'defenseBonuses.cognitive'),
      espiritual: num(defB.spiritual ?? 0, 'defenseBonuses.spiritual'),
    },
    deflect: num(rec.deflect ?? 0, 'resources.deflect'),
    recursos: {
      vida: { atual: num(rec.healthCur ?? 0, 'healthCur'), max: num(rec.healthMax ?? 0, 'healthMax') },
      foco: { atual: num(rec.focusCur ?? 0, 'focusCur'), max: num(rec.focusMax ?? 0, 'focusMax') },
      investidura: {
        atual: num(rec.investitureCur ?? 0, 'investitureCur'),
        max: num(rec.investitureMax ?? 0, 'investitureMax'),
      },
    },
    derivados: {
      dadoRecuperacao: texto(rec.recoveryDie),
      // número em pés/libras mesmo com rótulo "m"/"kg" — ver "unidades", no topo
      movimento: `${fmt(ftParaM(num(rec.movement ?? 0, 'resources.movement')))} m`,
      alcanceSentidos: distanciaDerivada(texto(rec.sensesRange)),
      capacidadeCarga: pesoDerivado(texto(rec.carryingCapacity)),
      capacidadeLevantamento: pesoDerivado(texto(rec.liftingCapacity)),
    },
    pericias: traduzPericias(c.skills),
    // As 2 culturais vêm das culturas escolhidas — o Shards não as põe em `expertises`.
    especializacoes: [
      ...[texto(meta.culture1), texto(meta.culture2)].filter((x) => x !== '').map((x) => ({ tipo: 'cultural' as const, nome: traduz(ESPECIALIDADE_CULTURAL, x) })),
      ...traduzEspecializacoes(c.expertises),
    ],
    talentos: traduzTalentos(c),
    armas,
    itens,
    fabriais: traduzFabriais(c.fabrials),
    marcos: num(rec.marks ?? 0, 'resources.marks'),
    proposito: texto(meta.purpose),
    obstaculo: texto(meta.obstacle),
    personalidade: texto(meta.personality),
    aparencia: texto(meta.appearance),
    conexoes: texto(meta.connections),
    objetivos: traduzObjetivos(c.goals),
    radiante: traduzRadiante(c.radiant),
    // estado vivo: começa do que o Shards mandou (pode ser sobrescrito ao reimportar — pergunta 7)
    condicoes: lista(c.conditions).map((x) => {
      const o = ehObjeto(x) ? x : {}
      return { nome: texto(o.name), duracao: texto(o.duration) || undefined }
    }),
    lesoes: lista(c.injuries).map((x) => {
      const o = ehObjeto(x) ? x : {}
      const tipo = texto(o.type).toLowerCase().startsWith('perman') ? 'permanente' : 'temporaria'
      return { tipo, descricao: texto(o.description) }
    }),
    anotacoes: anotacoesDoShards(c),
  }
}

/**
 * Ponto de entrada. Recebe o export INTEIRO do Shards e devolve os personagens.
 * O envelope é { exportedAt, version, characters: [...] } — já é multi-personagem.
 */
export function importarShards(json: unknown): Personagem[] {
  if (!ehObjeto(json)) throw new ErroImportacao('o arquivo não é um objeto JSON')
  const chars = json.characters
  if (!Array.isArray(chars)) throw new ErroImportacao('faltou "characters" (array) — formato do Shards mudou?')
  if (chars.length === 0) throw new ErroImportacao('"characters" está vazio')
  return chars.map((c, i) => traduzPersonagem(c, i))
}
