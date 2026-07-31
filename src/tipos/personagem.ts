/* arquivo: personagem.ts */

/**
 * O SCHEMA — fonte única dos tipos da ficha.
 *
 * Este arquivo É o contrato: tudo que a tela mostra e toda regra que roda
 * lê a ficha por estes tipos. Conferido campo a campo contra o export real
 * do Shards (Eccho, nível 3) — ver escopo/dados.md no Drive.
 *
 * Regras que mandam aqui:
 *  - decisão 0007: formato PRÓPRIO em português + tradutor (importarShards.ts)
 *  - decisão 0009: ler primeiro, calcular depois (FIXO × PROVISÓRIO)
 *  - decisão 0012: a ficha inteligente é o objetivo
 *  - princípio 1:  nenhum personagem escrito no código — valores vêm do JSON
 */

/** Como uma ação é ativada. Símbolos do livro (Introdução p.10): ▶ ação · ▷ livre · ↻ reação. */
export type Ativacao =
  | '1acao'    // ▶
  | '2acoes'   // ▶▶ (o livro imprime "2")
  | '3acoes'   // ▶▶▶ (o livro imprime "3")
  | 'livre'    // ▷
  | 'reacao'   // ↻
  | 'especial' // ★ (convenção da ficha/Shards)
  | 'sempre'   // ∞ (convenção da ficha/Shards)

/** Os 6 atributos. ⚠️ O valor JÁ é o modificador — não existe conversão tipo D&D (20 → +5). */
export type NomeAtributo =
  | 'forca'
  | 'velocidade'
  | 'intelecto'
  | 'vontade'
  | 'consciencia'
  | 'presenca'

export type Atributos = Record<NomeAtributo, number>

/** Vida, Foco e Investidura têm a MESMA forma — por isso PainelRecurso é 1 componente usado 3×. */
export type Recurso = {
  atual: number // muda o tempo todo na mesa — estado vivo
  max: number   // vem do Shards; o app NÃO toca
}

/**
 * Perícia — SEM campo `total`, de propósito.
 * O total é DERIVADO: (atributo + mod) + graduacao + graduacaoBonus [+ misc].
 * Fórmula confirmada contra o PDF oficial do Shards, 18/18 perícias (pergunta 5).
 * Guardar valor derivado = duas fontes divergindo. Quem calcula é regras/calculos.ts.
 */
export type Pericia = {
  id: string            // "deduction" — a chave do Shards, estável
  nome: string          // "Dedução" — o que aparece na tela
  atributo: NomeAtributo
  graduacao: number     // rank 0–5 (máx 2 até o nível 5) — a bolinha ○ ● ◎
  graduacaoBonus: number
  misc: number
}

export type Especializacao = {
  tipo: 'cultural' | 'especialista'
  nome: string // "Manufatura de Fabriais"
}

/**
 * Talento — o Shards só manda id/nome/origem/chave.
 * Ativação e resumo são REGRA (vêm de regras/ordens.ts, não do JSON) — decisão 0012.
 */
export type Talento = {
  id: string
  nome: string
  origem: 'heroica' | 'radiante' | 'ancestral'
  chave: boolean // talento-chave da trilha (★ no Shards)
}

/** Arma — no Shards é item de inventário com type: "weapon"; o tradutor separa. */
export type Arma = {
  nome: string
  pericia: string        // "Armamento Leve"
  dano: string           // "1d6"
  tipoDano: string       // "impacto"
  alcance: string        // "corpo a corpo (1,5 m)" | "9/36"
  tracos: string[]       // traços sempre ativos
  tracosPerito: string[] // traços que só valem com perícia expert (ex.: Momentum)
  peso: number           // em KG — conta pro peso carregado mesmo se não equipada
  equipada: boolean
}

export type Item = {
  nome: string
  tipo: string // "item" | "equipment" | ...
  qtd: number
  peso: number // em KG — o tradutor converte de lb (×0,5)
  equipado: boolean
}

/** Fabrial — cargas são estado vivo (Clock 3/3, Diapasão 0/5). */
export type Fabrial = {
  nome: string
  cargas: Recurso
  padrao: boolean  // true = "standard" do Shards; false = "custom"
  efeitos?: string // texto livre do custom ("Transfere e carrega energia da tormenta…")
}

export type Objetivo = {
  nome: string
  concluido: boolean // `achieved` do Shards — booleano, NÃO barra de progresso
  grau: number       // as bolinhas ○○○ da ficha oficial (0–3)
}

export type Ideal = {
  n: 1 | 2 | 3 | 4 | 5
  jurado: boolean
  texto: string
}

/** Fluxo (Surge) — único lugar onde o Shards manda ativação pronta. */
export type Fluxo = {
  id: string             // "transformation"
  nome: string           // "Transformação"
  atributo: NomeAtributo
  graduacao: number
  ativacao: Ativacao
  talentos: Array<{ id: string; nome: string; aprendido: boolean }>
}

export type Radiante = {
  ordem: string // "Elsecaller" → regras/ordens.ts sabe o que isso significa (decisão 0012)
  spren: {
    nome: string      // "Mancha"
    tipo: string      // "Inkspren"
    iluminado: boolean
  }
  alcanceSpren: number // em METROS — o tradutor converte (30 ft → 9 m)
  ideais: Ideal[]
  fluxos: Fluxo[]
}

/** Condição ativa — estado vivo. */
export type Condicao = {
  nome: string
  duracao?: string // texto livre por ora; vira regra quando o livro chegar lá
}

/** Lesão — temporária conta dias; permanente só sai por meio sobrenatural. */
export type Lesao = {
  tipo: 'temporaria' | 'permanente'
  descricao: string
  diasRestantes?: number // só faz sentido na temporária
}

/** Anotação livre do jogador — não vem do Shards, nasce vazia (aba Anotações). */
export type Anotacao = {
  id: string
  titulo: string
  conteudo: string
}

/** A FICHA INTEIRA. O que o app desenha; o que o tradutor produz. */
export type Personagem = {
  meta: {
    nome: string
    jogador: string
    nivel: number
    ancestralidade: string   // "Humano"
    culturas: string[]       // tradutor junta culture1 + culture2
    kitInicial: string       // "Acadêmico"
    trilhaHeroica: string    // "Erudito" (heroic.startingPath)
    trilhaRadiante?: string  // "Alternauta" (radiant.order) — nem todo PC é Radiante
  }

  /** Base + mod separados, como o Shards manda. A tela mostra o EFETIVO (base+mod) — pergunta 6. */
  atributos: Atributos
  atributosMod: Atributos

  /** As 3 defesas — vêm CALCULADAS do Shards; o app só lê (decisão 0009). */
  defesas: { fisica: number; cognitiva: number; espiritual: number }
  defesasBonus: { fisica: number; cognitiva: number; espiritual: number }
  deflect: number

  /** O coração da mesa — o que o cabeçalho fixo mostra sempre (decisão 0008). */
  recursos: {
    vida: Recurso
    foco: Recurso
    investidura: Recurso
  }

  /** Derivados que o Shards já entrega prontos. ⚠️ Já em MÉTRICO — o tradutor converte (ft×0,3 · lb×0,5). */
  derivados: {
    dadoRecuperacao: string       // "d8"
    movimento: string             // "9 m" (era 30 ft)
    alcanceSentidos: string       // "6 m" (era 20 ft)
    capacidadeCarga: string       // "50 kg" (carrying, era 100 lb)
    capacidadeLevantamento: string // "100 kg" (lifting, era 200 lb) — são DOIS campos, não um
  }

  pericias: Pericia[]
  especializacoes: Especializacao[]
  talentos: Talento[]

  armas: Arma[]
  itens: Item[]
  fabriais: Fabrial[]
  marcos: number // a moeda

  // interpretação — aba Personagem
  proposito: string
  obstaculo: string
  personalidade: string
  aparencia: string
  conexoes: string
  objetivos: Objetivo[]

  radiante?: Radiante

  // estado vivo — ⚠️ o Shards TAMBÉM manda (reimportar pode sobrescrever — pergunta 7)
  condicoes: Condicao[]
  lesoes: Lesao[]

  /** 100% do app — o Shards não tem isso, nasce sempre vazio na importação. */
  anotacoes: Anotacao[]
}
