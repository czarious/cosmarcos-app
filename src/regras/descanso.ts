/* arquivo: descanso.ts */

/**
 * DESCANSO — Cap. 9 do Guia PT-BR, transcricao/09-aventurando-se/10-descanso.md
 * (conferido em 29/Set/2026). Resumo com palavras próprias.
 *
 *  - Curto (1 h+): rola o dado de recuperação e distribui entre Vida e Foco.
 *    O dado é rolado na mão (premissas.md → "O dado é rolado na mão") — o app
 *    só recebe quanto foi pra cada lado e trava no máximo.
 *  - Longo (8 h+): Vida e Foco cheios; Exausto −1 (some no 0).
 *
 * Lesão superficial dura "até um descanso longo" (09-dano-lesoes-e-morte.md),
 * por isso também cai aqui. Exausto que vem de LESÃO não diminui: ele dura o
 * que a lesão durar.
 */

import type { Personagem } from '../tipos/personagem'

export function descansoCurto(ficha: Personagem, vida: number, foco: number): Personagem {
  const { recursos } = ficha
  return {
    ...ficha,
    recursos: {
      ...recursos,
      vida: { ...recursos.vida, atual: Math.min(recursos.vida.max, recursos.vida.atual + Math.max(0, vida)) },
      foco: { ...recursos.foco, atual: Math.min(recursos.foco.max, recursos.foco.atual + Math.max(0, foco)) },
    },
  }
}

export function descansoLongo(ficha: Personagem): Personagem {
  const { recursos } = ficha
  return {
    ...ficha,
    recursos: {
      ...recursos,
      vida: { ...recursos.vida, atual: recursos.vida.max },
      foco: { ...recursos.foco, atual: recursos.foco.max },
    },
    condicoes: ficha.condicoes
      .map((c) => (c.id === 'exausto' ? { ...c, valor: (c.valor ?? 0) - 1 } : c))
      .filter((c) => c.id !== 'exausto' || (c.valor ?? 0) > 0),
    lesoes: ficha.lesoes.filter((l) => l.gravidade !== 'superficial'),
  }
}
