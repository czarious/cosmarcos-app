/* arquivo: importarShards.ts */

/**
 * O TRADUTOR — JSON do Shards → nosso schema (Personagem).
 *
 * A ÚNICA porta de entrada de dado no app (decisão 0007). O Shards está na 0.1.0
 * e VAI mudar de formato. Quando mudar, este arquivo é o único que quebra — e o
 * risco é quebrar CALADO (campo some, tela zera, ninguém vê). Por isso aqui a
 * regra é: validar o que dá, e GRITAR (throw) no que não reconhecer.
 *
 * Conferido campo a campo contra o export real do Eccho — ver escopo/dados.md.
 */

import type {
  Personagem,
  NomeAtributo,
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
} from '../tipos/personagem'

/** Erro com contexto — diz QUAL personagem e QUAL campo, pra caçar rápido. */
export class ErroImportacao extends Error {
  constructor(mensagem: string) {
    super(`[importarShards] ${mensagem}`)
    this.name = 'ErroImportacao'
  }
}

// ── mapas de nome: inglês do Shards → português nosso ──────────────
const ATRIBUTO: Record<string, NomeAtributo> = {
  strength: 'forca',
  speed: 'velocidade',
  intellect: 'intelecto',
  willpower: 'vontade',
  awareness: 'consciencia',
  presence: 'presenca',
}

/** As 18 perícias (Cap. 3, "As 18 Perícias") — chave estável do Shards → nome canônico do livro. */
const PERICIA_NOME: Record<string, string> = {
  athletics: 'Atletismo',
  'heavy-weaponry': 'Armamento Pesado',
  agility: 'Agilidade',
  'light-weaponry': 'Armamento Leve',
  stealth: 'Furtividade',
  thievery: 'Ladinagem',
  crafting: 'Manufatura',
  deduction: 'Dedução',
  lore: 'Saber',
  medicine: 'Medicina',
  discipline: 'Disciplina',
  intimidation: 'Intimidação',
  insight: 'Intuição',
  perception: 'Percepção',
  survival: 'Sobrevivência',
  deception: 'Dissimulação',
  leadership: 'Liderança',
  persuasion: 'Persuasão',
}

/** Mesmas 18, mas pelo NOME em inglês (é o que `inventory.items[].skill` traz pra armas, não a chave). */
const PERICIA_NOME_POR_INGLES: Record<string, string> = Object.fromEntries(
  Object.entries(PERICIA_NOME).map(([chave, ptbr]) => [
    chave
      .split('-')
      .map((p) => p[0].toUpperCase() + p.slice(1))
      .join(' '),
    ptbr,
  ]),
)

/**
 * Tipo de dano em inglês → PT-BR (Cap. 9, "Tipos de Dano"). Só "impact" foi
 * confirmado contra dado real do Shards (arma do Eccho); os demais são
 * inferência de boa-fé (cognatos óbvios) — ⚠️ conferir quando aparecer arma
 * de outro tipo na ficha.
 */
const TIPO_DANO: Record<string, string> = {
  impact: 'impactante',
  sharp: 'afiado', // ⚠️ não confirmado com dado real
  energy: 'energético', // ⚠️ não confirmado com dado real
  spiritual: 'espiritual', // ⚠️ não confirmado com dado real
  vital: 'vital', // ⚠️ não confirmado com dado real
}

/** "1d6 impact" → { dado: "1d6", tipoDano: "impactante" }. Palavra não mapeada passa crua. */
function separaDano(bruto: string): { dado: string; tipoDano: string } {
  const m = bruto.match(/^(.*\d)\s+(\S+)$/)
  if (!m) return { dado: bruto, tipoDano: '' }
  const [, dado, tipoIngles] = m
  return { dado, tipoDano: TIPO_DANO[tipoIngles.toLowerCase()] ?? tipoIngles }
}

/**
 * Nomes de arma — Cap. 7 (Armamento Leve/Pesado + Armas Especiais).
 * Conferido campo a campo contra a lista de equipamento do Shards
 * (19-20/Jul/2026). Cada entrada diz se foi vista de verdade no Shards
 * (✅) ou é inferência (🤔) — corrigir se aparecer errado numa ficha.
 */
const ARMA_NOME: Record<string, string> = {
  // Armamento Leve
  Shortbow: 'Arco Curto', // ✅ confirmado (uma palavra, sem espaço)
  Javelin: 'Azagaia', // ✅ confirmado
  Staff: 'Cajado', // ✅ confirmado
  Sidesword: 'Espada Lateral', // ✅ confirmado
  Knife: 'Faca', // ✅ confirmado
  Sling: 'Funda', // ✅ confirmado
  Shortspear: 'Lança Curta', // ✅ confirmado (uma palavra, sem espaço)
  Mace: 'Maça', // ✅ confirmado
  Rapier: 'Rapieira', // ✅ confirmado
  // Armamento Pesado
  Halberd: 'Alabarda',
  Longbow: 'Arco Longo', // 🤔 inferência (literal, sem confirmação direta)
  Crossbow: 'Besta', // ✅ confirmado
  Shield: 'Escudo', // ✅ confirmado
  Longsword: 'Espada Longa', // ✅ confirmado
  Longspear: 'Lança Longa', // ✅ confirmado (uma palavra, sem espaço)
  Axe: 'Machado', // ✅ confirmado
  Hammer: 'Martelo', // ✅ confirmado
  Greatsword: 'Montante', // ✅ confirmado
  // Armas Especiais (Cap. 7) — perito, raras
  // Grandbow = arma canônica da história (arco gigante de aço, Navani Kholin) —
  // bate com os traços do Hiperarco já transcritos (Desajeitada [5], Perfurante,
  // Armamento Pesado). Duas fontes convergindo (lore + mecânica) — confiança alta.
  Grandbow: 'Hiperarco',
  Warhammer: 'Martelo de Guerra', // ✅ confirmado — DIFERENTE do "Hammer" comum
  Shardblade: 'Espada Fractal', // ✅ confirmado
  'Shardblade (Radiant)': 'Espada Fractal Radiante', // ✅ confirmado
  // ⚠️ "Poleaxe" apareceu no Shards mas não existe em nada que já
  // transcrevi do livro — deixado sem mapear de propósito.
  // Fora das 18 básicas
  'Improvised Weapon': 'Arma Improvisada', // ✅ confirmado
  'Unarmed Attack': 'Ataque Desarmado', // ✅ confirmado
}

/**
 * Traços de arma — Cap. 7. ⚠️ Só "Momentum" → "Ímpeto" foi CONFIRMADO
 * (traço de perito da Maça do Eccho). Os demais são inferência.
 */
const TRACO_ARMA: Record<string, string> = {
  Thrown: 'Arremesso',
  Loaded: 'Carregada',
  Defensive: 'Defensiva',
  Unwieldy: 'Desajeitada',
  Discreet: 'Discreta',
  'Two-Handed': 'Duas Mãos',
  Fragile: 'Frágil',
  Momentum: 'Ímpeto', // ✅ confirmado
  Indirect: 'Indireta',
  'Off-Hand': 'Mão Inábil',
  Deadly: 'Mortal',
  Piercing: 'Perfurante',
  Dangerous: 'Perigosa',
  'Quick Draw': 'Saque Rápido',
  Unique: 'Única',
}

/** Traduz um traço preservando valor entre colchetes não traduzido (ex.: "Thrown [9/36]" → "Arremesso [9/36]"). */
function traduzTraco(bruto: string): string {
  const m = bruto.match(/^([^[]+?)\s*(\[.*\])?$/)
  if (!m) return bruto
  const [, nome, valor] = m
  const traduzido = TRACO_ARMA[nome.trim()] ?? nome.trim()
  return valor ? `${traduzido} ${valor}` : traduzido
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

// ── unidades: o Shards manda imperial; a mesa joga em METROS e KG ──────
// Convenção das mesas BR: 5 ft = 1,5 m (×0,3) · 2 lb = 1 kg (×0,5).
// As contas saem redondas (30ft→9m · 20ft→6m · 100lb→50kg).
// ⚠️ Se o Guia de Regras PT-BR imprimir outros números, o livro desempata.
function ftParaM(ft: number): number {
  return ft * 0.3
}

function lbParaKg(lb: number): number {
  return lb * 0.5
}

/** "20 ft" → "6 m". Texto sem "ft" passa reto. */
function converteDistancia(txt: string): string {
  const m = txt.match(/([\d.]+)\s*ft/i)
  return m ? `${ftParaM(Number(m[1]))} m` : txt
}

/** "100 lb" → "50 kg". Texto sem "lb" passa reto. */
function convertePeso(txt: string): string {
  const m = txt.match(/([\d.]+)\s*lb/i)
  return m ? `${lbParaKg(Number(m[1]))} kg` : txt
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
    // Shards: "Specialist" | "Cultural"
    const tipo = texto(o.type).toLowerCase() === 'cultural' ? 'cultural' : 'especialista'
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
  for (const it of lista(bruto)) {
    if (!ehObjeto(it)) continue
    if (texto(it.type) === 'weapon') {
      const r = ehObjeto(it.range) ? it.range : {}
      const alcance =
        texto(r.type) === 'melee'
          ? `Corpo a corpo (${ftParaM(num(r.reach ?? 5, 'range.reach'))} m)`
          : converteDistancia(texto(it.rangeLabel) || texto(r.label))
      const { dado, tipoDano } = separaDano(texto(it.damage))
      const nomePericia = texto(it.skill)
      const nomeArma = texto(it.name)
      armas.push({
        nome: ARMA_NOME[nomeArma] ?? nomeArma,
        pericia: PERICIA_NOME_POR_INGLES[nomePericia] ?? nomePericia,
        dano: dado,
        tipoDano,
        alcance,
        tracos: lista(it.traits).map(texto).map(traduzTraco),
        tracosPerito: lista(it.expertTraits).map(texto).map(traduzTraco),
        peso: lbParaKg(num(it.weight ?? 0, 'weapon.weight')),
        equipada: it.equipped === true,
      })
    } else {
      itens.push({
        nome: texto(it.name),
        tipo: texto(it.category) || texto(it.type),
        qtd: num(it.quantity ?? 1, 'item.quantity'),
        peso: lbParaKg(num(it.weight ?? 0, 'item.weight')), // já em kg
        equipado: it.equipped === true,
      })
    }
  }
  return { armas, itens }
}

/** Fabriais vêm em dois blocos com formatos diferentes — unificamos. */
function traduzFabriais(bruto: unknown): Fabrial[] {
  if (!ehObjeto(bruto)) return []
  const um = (f: unknown, padrao: boolean): Fabrial => {
    const o = ehObjeto(f) ? f : {}
    return {
      nome: texto(o.name),
      cargas: {
        atual: num(o.chargesCur ?? 0, 'fabrial.chargesCur'),
        max: num(o.chargesMax ?? 0, 'fabrial.chargesMax'),
      },
      padrao,
      efeitos: texto(o.effects) || undefined,
    }
  }
  return [
    ...lista(bruto.standard).map((f) => um(f, true)),
    ...lista(bruto.custom).map((f) => um(f, false)),
  ]
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
    const texto_ = texto(textos[chave])
    const jurado = jurados[chave] === true
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
      nome: texto(s.name),
      atributo,
      graduacao: num(s.rank ?? 0, `surgeSkills[${i}].rank`),
      ativacao: traduzAtivacao(texto(s.activation)),
      talentos: lista(s.talents).map((t) => {
        const o = ehObjeto(t) ? t : {}
        return { id: texto(o.id), nome: texto(o.name), aprendido: o.learned === true }
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
    ordem,
    spren: {
      nome: texto(vinculo.name),
      tipo: texto(vinculo.type),
      iluminado: vinculo.enlightened === true,
    },
    alcanceSpren: ftParaM(num(bruto.sprenBondRange ?? 0, 'radiant.sprenBondRange')), // em metros
    ideais: traduzIdeais(bruto),
    fluxos: traduzFluxos(bruto.surgeSkills),
  }
}

/** Traduz UM personagem. */
function traduzPersonagem(c: unknown, indice: number): Personagem {
  if (!ehObjeto(c)) throw new ErroImportacao(`personagem [${indice}] não é objeto`)

  const meta = ehObjeto(c.meta) ? c.meta : {}
  const rec = ehObjeto(c.resources) ? c.resources : {}
  const def = ehObjeto(c.defenses) ? c.defenses : {}
  const defB = ehObjeto(c.defenseBonuses) ? c.defenseBonuses : {}

  // grita cedo se faltar a espinha
  if (!ehObjeto(c.attributes)) throw new ErroImportacao(`personagem [${indice}] sem "attributes"`)
  if (!ehObjeto(c.resources)) throw new ErroImportacao(`personagem [${indice}] sem "resources"`)

  const culturas = [texto(meta.culture1), texto(meta.culture2)].filter((x) => x !== '')
  const { armas, itens } = separaInventario(ehObjeto(c.inventory) ? c.inventory.items : [])

  return {
    meta: {
      nome: texto(meta.name),
      jogador: texto(meta.player),
      nivel: num(meta.level ?? 0, 'meta.level'),
      ancestralidade: texto(meta.ancestry),
      culturas,
      kitInicial: texto(meta.startingKit),
      trilhaHeroica: texto(ehObjeto(c.heroic) ? c.heroic.startingPath : ''),
      trilhaRadiante: texto(ehObjeto(c.radiant) ? c.radiant.order : '') || undefined,
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
      movimento: `${ftParaM(num(rec.movement ?? 0, 'resources.movement'))} m`,
      alcanceSentidos: converteDistancia(texto(rec.sensesRange)),
      capacidadeCarga: convertePeso(texto(rec.carryingCapacity)),
      capacidadeLevantamento: convertePeso(texto(rec.liftingCapacity)),
    },
    pericias: traduzPericias(c.skills),
    especializacoes: traduzEspecializacoes(c.expertises),
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
    anotacoes: [], // o Shards não tem isso — nasce vazio, o jogador preenche no app
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
