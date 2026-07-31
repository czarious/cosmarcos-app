/* arquivo: especialidades.ts */

/**
 * VÍNCULO talento → concessão específica DESTE personagem (o Eccho).
 *
 * O Shards NÃO exporta qual perícia/especialidade veio de qual talento —
 * confirmado inspecionando o JSON bruto (19/Jul/2026). O que existe:
 *  - `skills[].rankBonus` — bônus separado do rank normal, mas sem dizer
 *    QUAL talento concedeu. No Eccho, só "crafting" e "deduction" têm
 *    rankBonus=1 (ambas cognitivas) — bate com a regra da Erudição, então
 *    atribuímos aqui manualmente (confirmado com o César).
 *  - `expertises[].name` — às vezes o PRÓPRIO César rotulou a origem no nome
 *    (ex.: "...via Aquisição Valiosa"); nesses casos não há ambiguidade.
 *
 * ⚠️ Isto é uma EXCEÇÃO CONSCIENTE ao princípio "nenhum personagem escrito
 * no código" (CLAUDE.md) — não tem outro jeito de linkar um dado que o
 * Shards não exporta. Se o app um dia servir outro personagem, este arquivo
 * precisa de uma chave por personagem (não existe ainda porque só o Eccho
 * existe hoje — YAGNI).
 *
 * O componente NÃO copia o nome/graduação aqui: só guarda a REFERÊNCIA
 * (id da perícia, nome da especialidade) e busca o valor ATUAL em
 * `ficha.pericias` / `ficha.especializacoes` — se o Eccho redistribuir a
 * Erudição depois de um descanso longo e o JSON for reimportado, a tela
 * atualiza sozinha, sem editar este arquivo.
 */

export type ConcessaoTalento = {
  /** ids de Pericia (a chave estável do Shards, ex. "crafting"). */
  periciasIds?: string[]
  /** nomes de Especializacao, exatamente como vêm de `ficha.especializacoes`. */
  especialidades?: string[]
}

export const VINCULO_TALENTO_ECCHO: Record<string, ConcessaoTalento> = {
  'scholar::key::erudition': {
    // confirmado com o César, 19/Jul/2026 — as 2 únicas perícias com
    // rankBonus=1 no export, ambas cognitivas (bate com a regra do talento)
    periciasIds: ['crafting', 'deduction'],
    especialidades: ['Mineralogia/Gemas'],
  },
  'scholar::artifabrian::prized-acquisition': {
    // rotulada pelo próprio César no Shards — sem ambiguidade
    especialidades: ['Manufatura de Fabriais perito — via Aquisição Valiosa'],
  },
}
