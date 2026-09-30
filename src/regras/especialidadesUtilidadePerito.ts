/* arquivo: especialidadesUtilidadePerito.ts */

/**
 * Exemplos do livro pra especialidade de Utilidade e de Perito — Cap. 3
 * (Especialidades). ⚠️ O livro é explícito: "Não existe uma lista fechada
 * de especialidades" pra essas duas categorias (diferente da cultural, que
 * é fechada — ver especialidadesCulturais.ts). Isto aqui é só os exemplos
 * que o próprio livro cita, NÃO uma lista completa — a regra é aberta de
 * propósito (jogador + MJ decidem).
 *
 * Por isso o dropdown de vaga sempre oferece "Outra (digite)" ao lado
 * destes exemplos — ver Talentos.tsx.
 */

export const ESPECIALIDADES_UTILIDADE_EXEMPLO: string[] = [
  'Andar a Cavalo',
  'Cuidado de Animais',
  'Engenharia',
  'Estratégia Militar',
  'História',
  'Manufatura de Arma',
  'Manufatura de Armadura',
  'Manufatura de Equipamento',
  'Religião',
]

/** Restrição do livro: só vem de talento, recompensa ou permissão do MJ — nunca por Intelecto. */
export const ESPECIALIDADES_PERITO_EXEMPLO: string[] = [
  'Armaduras Fractais',
  'Cavaleiros Radiantes',
  'Espadas Fractais',
  'Hiperarcos',
  'História dos Cantores',
  'Manufatura de Fabrial',
  'Martelos de Guerra',
  'Semifractais',
]

/**
 * Os mesmos exemplos em inglês (idioma/nomes.ts). Com nome de arma/item do
 * dicionário quando existe (Grandbow, Half-Shard, Warhammer); o resto é 🤔 —
 * o livro em inglês não está na mão, e a lista é aberta de qualquer jeito.
 */
export const ESPECIALIDADES_EN: Record<string, string> = {
  'Andar a Cavalo': 'Riding',
  'Cuidado de Animais': 'Animal Care',
  Engenharia: 'Engineering',
  'Estratégia Militar': 'Military Strategy',
  História: 'History',
  'Manufatura de Arma': 'Weapon Crafting',
  'Manufatura de Armadura': 'Armor Crafting',
  'Manufatura de Equipamento': 'Equipment Crafting',
  Religião: 'Religion',
  'Armaduras Fractais': 'Shardplate',
  'Cavaleiros Radiantes': 'Knights Radiant',
  'Espadas Fractais': 'Shardblades',
  Hiperarcos: 'Grandbows',
  'História dos Cantores': 'Singer History',
  'Manufatura de Fabrial': 'Fabrial Crafting',
  'Martelos de Guerra': 'Warhammers',
  Semifractais: 'Half-Shards',
}
