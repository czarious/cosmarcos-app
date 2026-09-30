/* arquivo: nomes.ts */
import * as DEPARA from '../estado/deparaShards'
import { ACOES_PADRAO, ACOES_CONCEDIDAS, ACOES_ESPRENO } from '../regras/acoes'
import { CATALOGO_TALENTOS } from '../regras/talentos'
import { CONDICOES, EFEITOS_LESAO, GRAVIDADE } from '../regras/condicoes'
import { FABRIAIS_PADRAO, EFEITOS_UNICOS, APRIMORAMENTOS_GERAIS, REVEZES_GERAIS, CARACTERISTICAS_AVANCADAS, QUALIDADE, CARACTERISTICA_EN } from '../regras/fabriais'
import { ESPECIALIDADES_EN } from '../regras/especialidadesUtilidadePerito'
import { ESCALONAMENTO_FLUXO, TAMANHO_EN } from '../regras/fluxos'

/**
 * NOMES DO JOGO em inglês, pelo nome em português. Não é lista digitada aqui:
 * junta o que já mora ao lado de cada nome.
 *  - O que vem do Shards (perícia, arma, item, trilha, cultura, fluxo…): o
 *    caminho de volta dos de-para do tradutor — o inglês é o que o Shards manda.
 *  - Os catálogos de regra (ações, talentos, lesões, fabriais): o `nomeEn`
 *    escrito ao lado do `nome` em cada catálogo.
 *  - Condição, fabrial padrão, aprimoramento e revés: o de-para dá inglês → id,
 *    e o catálogo dá id → nome.
 * Nome que não está em lugar nenhum (item criado pelo jogador) fica em português.
 */

function inverte(mapa: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(mapa).map(([en, id]) => [id, en]))
}

/** O primeiro inglês que chegou vence (sinônimos do Shards, ex. Halberd/Poleaxe). */
function juntar(pares: Array<[string, string]>): Record<string, string> {
  const r: Record<string, string> = {}
  for (const [pt, en] of pares) if (!(pt in r)) r[pt] = en
  return r
}

const DO_SHARDS: Record<string, string>[] = [
  DEPARA.PERICIA_NOME_POR_INGLES,
  DEPARA.TIPO_DANO,
  DEPARA.ARMA_NOME,
  DEPARA.ITEM_NOME,
  DEPARA.ARMADURA_NOME,
  DEPARA.ANCESTRALIDADE,
  DEPARA.CULTURA,
  DEPARA.CONJUNTO_INICIAL,
  DEPARA.TRILHA_HEROICA,
  DEPARA.ORDEM,
  DEPARA.ESPRENO,
  DEPARA.FLUXO,
  DEPARA.TALENTO_FLUXO,
  DEPARA.CATEGORIA_ITEM,
  DEPARA.TRACO_ARMA,
  DEPARA.ESPECIALIDADE_CULTURAL,
]

const condicaoEn = inverte(DEPARA.CONDICAO_ID)
const padraoEn = inverte(DEPARA.FABRIAL_PADRAO_ID)
const aprimoramentoEn = inverte(DEPARA.APRIMORAMENTO_ID)
const revesEn = inverte(DEPARA.REVES_ID)

export const NOMES_EN: Record<string, string> = juntar([
  ...DO_SHARDS.flatMap((m) => Object.entries(m).map(([en, pt]): [string, string] => [pt, en])),
  ...[...ACOES_PADRAO, ...Object.values(ACOES_CONCEDIDAS).flat(), ...ACOES_ESPRENO].map((a): [string, string] => [a.nome, a.nomeEn]),
  ...Object.values(CATALOGO_TALENTOS).flatMap((t): Array<[string, string]> => [
    [t.nome, t.nomeEn],
    [t.fonte, t.fonteEn],
    ...(t.vagas ?? []).map((v): [string, string] => [v.rotulo, v.rotuloEn]),
  ]),
  ...CONDICOES.map((c): [string, string] => [c.nome, condicaoEn[c.id]]),
  ...EFEITOS_LESAO.map((e): [string, string] => [e.nome, e.nomeEn]),
  ...Object.values(GRAVIDADE).map((g): [string, string] => [g.nome, g.nomeEn]),
  ...FABRIAIS_PADRAO.map((f): [string, string] => [f.nome, padraoEn[f.id] ?? f.nome]),
  ...EFEITOS_UNICOS.map((e): [string, string] => [e.nome, e.nomeEn]),
  ...EFEITOS_UNICOS.flatMap((e) => (e.usos ?? []).map((u): [string, string] => [u.rotulo, u.rotuloEn])),
  ...APRIMORAMENTOS_GERAIS.map((a): [string, string] => [a.nome, aprimoramentoEn[a.id] ?? a.nome]),
  ...REVEZES_GERAIS.map((r): [string, string] => [r.nome, revesEn[r.id] ?? r.nome]),
  ...CARACTERISTICAS_AVANCADAS.map((c): [string, string] => [c.nome, c.nomeEn]),
  ...Object.values(QUALIDADE).map((q): [string, string] => [q.nome, q.nomeEn]),
  ...Object.entries(CARACTERISTICA_EN),
  ...Object.values(GRAVIDADE).map((g): [string, string] => [g.duracao, g.duracaoEn]),
  ...Object.entries(ESPECIALIDADES_EN),
  ...Object.entries(TAMANHO_EN),
  ...Object.values(ESCALONAMENTO_FLUXO).map((e): [string, string] => [e.tamanho, e.tamanhoEn]),
])
