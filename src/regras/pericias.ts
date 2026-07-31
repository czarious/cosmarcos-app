/* arquivo: pericias.ts */

/**
 * Teto de graduação de perícia por patamar — Cap. 1 (Evolução de Personagem),
 * tabela "Evolução de Personagem", coluna "Graduação de Perícia Máxima".
 *
 * Duas naturezas de graduação, com regras diferentes:
 *  - NORMAL (sobe de nível) — sujeita a este teto. "Nenhuma perícia pode
 *    ultrapassar a graduação de perícia máxima do patamar atual."
 *  - BÔNUS DE TALENTO (ex.: Erudição) — EXCEÇÃO explícita do livro: "ganha
 *    uma graduação adicional... mesmo que isso exceda o máximo usual de
 *    graduações de perícia." É temporária/redistribuível, não permanente.
 *
 * No schema (tipos/personagem.ts), isso já é 2 campos separados:
 * Pericia.graduacao (normal, sujeita ao teto) × Pericia.graduacaoBonus
 * (bônus de talento, isento do teto).
 */

export type Patamar = 1 | 2 | 3 | 4 | 5

const TETO_POR_PATAMAR: Record<Patamar, number> = {
  1: 2, // níveis 1–5
  2: 3, // níveis 6–10
  3: 4, // níveis 11–15
  4: 5, // níveis 16–20
  5: 5, // nível 21+
}

/** Teto absoluto de qualquer perícia (Cap. 3, "0 a 5 graduações"). */
export const TETO_ABSOLUTO = 5

export function patamarPorNivel(nivel: number): Patamar {
  if (nivel <= 5) return 1
  if (nivel <= 10) return 2
  if (nivel <= 15) return 3
  if (nivel <= 20) return 4
  return 5
}

/** Teto da graduação NORMAL (não conta bônus de talento — esses são isentos). */
export function tetoPericiaNormal(nivel: number): number {
  return TETO_POR_PATAMAR[patamarPorNivel(nivel)]
}
