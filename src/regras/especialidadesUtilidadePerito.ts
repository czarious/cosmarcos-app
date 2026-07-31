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
