/* arquivo: talentos.ts */
import type { Ativacao, Pericia, Personagem, Talento, TipoEspecializacao } from '../tipos/personagem'
import type { Custo, EntradaAcao } from './acoes'
import { TALENTOS_ERUDITO } from './talentos/erudito'
import { TALENTOS_AGENTE } from './talentos/agente'
import { TALENTOS_CACADOR } from './talentos/cacador'
import { TALENTOS_EMISSARIO } from './talentos/emissario'
import { TALENTOS_GUERREIRO } from './talentos/guerreiro'
import { TALENTOS_LIDER } from './talentos/lider'
import { TALENTOS_CANTOR } from './talentos/cantor'
import { TALENTOS_ALTERNAUTA } from './talentos/alternauta'
import { TALENTOS_CORREDOR_DOS_VENTOS } from './talentos/corredor-dos-ventos'
import { TALENTOS_DANCARINO_DE_PRECIPICIOS } from './talentos/dancarino-de-precipicios'
import { TALENTOS_GUARDIAO_DAS_PEDRAS } from './talentos/guardiao-das-pedras'
import { TALENTOS_PLASMADOR } from './talentos/plasmador'
import { TALENTOS_PULVERIZADOR } from './talentos/pulverizador'
import { TALENTOS_ROMPE_CEU } from './talentos/rompe-ceu'
import { TALENTOS_SENTINELA_DA_VERDADE } from './talentos/sentinela-da-verdade'
import { TALENTOS_TECELUZ } from './talentos/teceluz'
import { TALENTOS_FLUXO_ABRASAO } from './talentos/fluxo-abrasao'
import { TALENTOS_FLUXO_ADESAO } from './talentos/fluxo-adesao'
import { TALENTOS_FLUXO_COESAO } from './talentos/fluxo-coesao'
import { TALENTOS_FLUXO_DIVISAO } from './talentos/fluxo-divisao'
import { TALENTOS_FLUXO_GRAVITACAO } from './talentos/fluxo-gravitacao'
import { TALENTOS_FLUXO_ILUMINACAO } from './talentos/fluxo-iluminacao'
import { TALENTOS_FLUXO_PROGRESSAO } from './talentos/fluxo-progressao'
import { TALENTOS_FLUXO_TENSAO } from './talentos/fluxo-tensao'
import { TALENTOS_FLUXO_TRANSFORMACAO } from './talentos/fluxo-transformacao'
import { TALENTOS_FLUXO_TRANSPORTE } from './talentos/fluxo-transporte'

/**
 * CATÁLOGO DE TALENTOS — a regra em si, universal (vale pra qualquer
 * personagem com o talento, não só o Eccho). O Shards só manda
 * `{id, nome, origem, chave}` (ver tipos/personagem.ts); ativação e efeito
 * são REGRA, não dado — premissas.md → "A ficha inteligente é o objetivo".
 *
 * Fonte: transcrição do Guia de Regras PT-BR (referencia/livro/transcricao/,
 * não versionada). Texto aqui é PARÁFRASE própria, nunca cópia do livro —
 * este arquivo é público no repo (premissas.md → "GitHub Pages, repositório público"), diferente da transcrição.
 *
 * Um arquivo por TRILHA em regras/talentos/ — mesma divisão da transcrição
 * (04-trilhas-heroicas/, 05-trilhas-radiantes/). Aqui ficam o tipo e o índice.
 */

/**
 * VAGA — uma escolha em aberto que o talento concede (ex.: Erudição pede
 * 1 especialidade + 2 perícias). Diferente da descrição (fixa, universal),
 * a vaga é o que o JOGADOR escolhe — a resposta mora no estado vivo do app
 * (usePersonagem), não aqui. Ver regras/especialidades.ts pro valor inicial.
 */
export type TipoVaga = 'pericia' | 'especialidade'

export type VagaTalento = {
  tipo: TipoVaga
  indice: number // 0, 1... quando o talento pede mais de uma vaga do mesmo tipo
  rotulo: string
  rotuloEn: string
  /** Só pra vaga tipo 'pericia' — filtra as opções do dropdown pela regra do talento. */
  filtroPericia?: (p: Pericia) => boolean
  /** Só pra vaga tipo 'especialidade' — os tipos que o talento aceita (ex.: Erudição: cultural ou utilidade). Ausente: qualquer um. */
  tiposEspecialidade?: TipoEspecializacao[]
}

/** A escolha atual de UMA vaga — é isto que vive no estado (usePersonagem). */
export type EscolhaVaga = {
  talentoId: string
  tipo: TipoVaga
  indice: number
  /** id de Pericia (tipo 'pericia') ou nome de Especializacao (tipo 'especialidade'). */
  valor: string | undefined
}

export function chaveVaga(talentoId: string, tipo: TipoVaga, indice: number): string {
  return `${talentoId}#${tipo}#${indice}`
}

/**
 * O que as OUTRAS vagas do mesmo tipo neste talento já escolheram — não pode
 * repetir: duas vagas de perícia são "duas perícias", cada uma com a sua
 * graduação (livro, ex.: Erudição, 04-trilhas-heroicas/05-erudito.md).
 */
export function escolhidasNasOutras(talentoId: string, vaga: Pick<VagaTalento, 'tipo' | 'indice'>, escolhas: Record<string, EscolhaVaga>): Set<string> {
  return new Set(
    Object.values(escolhas)
      .filter((e) => e.talentoId === talentoId && e.tipo === vaga.tipo && e.indice !== vaga.indice && e.valor)
      .map((e) => e.valor as string),
  )
}

export type EntradaTalento = {
  nome: string // canônico PT-BR do livro
  nomeEn: string // como o Shards escreve (dicionário → "Trilhas Heroicas", "Ordens Radiantes")
  fonte: string // trilha/especialização, pra exibir
  fonteEn: string
  preRequisitos: string
  ativacao: Ativacao
  /** Só em talento de ação (▶ ▷ ↻): o que ativar desconta SEMPRE. Custo variável ou opcional fica fora — ajusta no topo. */
  custo?: Custo
  descricao: string
  /** Presente só nos talentos com escolha em aberto (ex.: Erudição). */
  vagas?: VagaTalento[]
}

// O símbolo de exibição de cada ativação mudou de casa: é rótulo de tela, não
// catálogo de talento. Mora em `variaveis.ts` → SIMBOLO_ATIVACAO.

/** Catálogo consultado pela tela — junta todos os blocos acima. */
export const CATALOGO_TALENTOS: Record<string, EntradaTalento> = {
  ...TALENTOS_ERUDITO,
  ...TALENTOS_AGENTE,
  ...TALENTOS_CACADOR,
  ...TALENTOS_EMISSARIO,
  ...TALENTOS_GUERREIRO,
  ...TALENTOS_LIDER,
  ...TALENTOS_CANTOR,
  ...TALENTOS_ALTERNAUTA,
  ...TALENTOS_CORREDOR_DOS_VENTOS,
  ...TALENTOS_DANCARINO_DE_PRECIPICIOS,
  ...TALENTOS_GUARDIAO_DAS_PEDRAS,
  ...TALENTOS_PLASMADOR,
  ...TALENTOS_PULVERIZADOR,
  ...TALENTOS_ROMPE_CEU,
  ...TALENTOS_SENTINELA_DA_VERDADE,
  ...TALENTOS_TECELUZ,
  ...TALENTOS_FLUXO_ABRASAO,
  ...TALENTOS_FLUXO_ADESAO,
  ...TALENTOS_FLUXO_COESAO,
  ...TALENTOS_FLUXO_DIVISAO,
  ...TALENTOS_FLUXO_GRAVITACAO,
  ...TALENTOS_FLUXO_ILUMINACAO,
  ...TALENTOS_FLUXO_PROGRESSAO,
  ...TALENTOS_FLUXO_TENSAO,
  ...TALENTOS_FLUXO_TRANSFORMACAO,
  ...TALENTOS_FLUXO_TRANSPORTE,
}

/**
 * A entrada do catálogo de um talento da ficha: pelo id do Shards. Talento de
 * Cantor (ancestral) cai pro nome em inglês — o Shards não documenta o id deles,
 * e as chaves `singer::` daqui são nossas.
 */
export function entradaTalento(tal: Talento): EntradaTalento | undefined {
  return (
    CATALOGO_TALENTOS[tal.id] ??
    (tal.origem === 'ancestral' ? Object.values(TALENTOS_CANTOR).find((e) => e.nomeEn === tal.nome) : undefined)
  )
}

/** Chave de catálogo de um talento de fluxo: o Shards o guarda dentro do fluxo, sem prefixo (`surge-talents.json`). */
export function chaveTalentoFluxo(fluxoId: string, talentoId: string): string {
  return `${fluxoId}::${talentoId}`
}

/**
 * Talentos de fluxo APRENDIDOS, no formato da lista de talentos. Moram em
 * `radiante.fluxos[].talentos`, fora de `ficha.talentos`, mas gastam vaga de
 * talento igual: a árvore de fluxo é árvore da trilha Radiante (transcrição
 * 05-trilhas-radiantes/01-usando-trilhas-radiantes.md).
 */
export function talentosDeFluxo(ficha: Personagem): Talento[] {
  return (ficha.radiante?.fluxos ?? []).flatMap((f) =>
    f.talentos
      .filter((t) => t.aprendido)
      .map((t): Talento => ({ id: chaveTalentoFluxo(f.id, t.id), nome: t.nome, origem: 'radiante', chave: false })),
  )
}

/** As ativações que se USAM no turno. Passivo (∞) e especial (★) ficam só na aba Talentos. */
const ATIVACAO_DE_ACAO: Ativacao[] = ['1acao', '2acoes', '3acoes', 'livre', 'reacao']

/** Talentos do personagem (inclusive os de fluxo aprendidos) que viram ação usável na aba Ações. */
export function acoesDeTalentos(ficha: Personagem): Array<{ acao: EntradaAcao; deTalento: string }> {
  return [...ficha.talentos, ...talentosDeFluxo(ficha)].flatMap((tal) => {
    const e = entradaTalento(tal)
    if (!e || !ATIVACAO_DE_ACAO.includes(e.ativacao)) return []
    return [{ acao: { nome: e.nome, nomeEn: e.nomeEn, ativacao: e.ativacao, resumo: e.descricao, custo: e.custo }, deTalento: e.fonte }]
  })
}
