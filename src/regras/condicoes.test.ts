/* arquivo: condicoes.test.ts */
import { describe, it, expect } from 'vitest'
import type { Personagem, Condicao, Lesao } from '../tipos/personagem'
import { importarShards } from '../estado/importarShards'
import { totalPericia, detalhePericia } from './calculos'
import { movimentoComCondicoes, acoesNoTurno, resultadoLesao, modificadorRolagemLesao, efeitoCondicoesPericia } from './condicoes'
import { descansoCurto, descansoLongo } from './descanso'
import eccho from '../../public/personagens/eccho.json'

// Cada caso sai de um exemplo ou de uma faixa EXATA do Cap. 9/10 do livro
// (transcricao/09-aventurando-se/06-condicoes.md, 09-dano-lesoes-e-morte.md,
// 10-descanso.md). Eccho: VEL 3 → 9 m; Agilidade +0; Dedução +7; Vida 21, Foco 4.

let n = 0
const cond = (c: Omit<Condicao, 'uid'>): Condicao => ({ ...c, uid: `c${n++}` })
const lesao = (l: Omit<Lesao, 'uid'>): Lesao => ({ ...l, uid: `l${n++}` })

function eccho_(mudar: Partial<Personagem> = {}): Personagem {
  return { ...importarShards(structuredClone(eccho))[0], ...mudar }
}
const pericia = (f: Personagem, id: string) => f.pericias.find((p) => p.id === id)!

describe('condições na perícia', () => {
  it('Exausto soma entre aplicações — inclusive a que vem de lesão', () => {
    const f = eccho_({ condicoes: [cond({ id: 'exausto', valor: 2 })], lesoes: [lesao({ gravidade: 'leve', efeito: 'exausto-1' })] })
    expect(totalPericia(pericia(f, 'deduction'), f, {})).toBe(7 - 3)
    expect(detalhePericia(pericia(f, 'deduction'), f, {}).linhas).toContainEqual({ origem: 'Exausto', valor: -3 })
  })

  it('dano não é teste: Exausto fica fora do bônus de dano; Aprimorado entra', () => {
    const f = eccho_({ condicoes: [cond({ id: 'exausto', valor: 2 }), cond({ id: 'aprimorado', atributo: 'intelecto', valor: 1 })] })
    expect(totalPericia(pericia(f, 'deduction'), f, {}, 'teste')).toBe(7 - 2 + 1)
    expect(totalPericia(pericia(f, 'deduction'), f, {}, 'dano')).toBe(7 + 1)
  })

  it('Aprimorado só vale nas perícias do atributo aprimorado', () => {
    const f = eccho_({ condicoes: [cond({ id: 'aprimorado', atributo: 'velocidade', valor: 2 })] })
    const semNada = eccho_()
    expect(totalPericia(pericia(f, 'agility'), f, {})).toBe(totalPericia(pericia(semNada, 'agility'), semNada, {}) + 2)
    expect(totalPericia(pericia(f, 'deduction'), f, {})).toBe(7)
  })

  it('Desorientado dá desvantagem só em Percepção; Potencializado, vantagem em tudo', () => {
    const f = eccho_({ condicoes: [cond({ id: 'desorientado' }), cond({ id: 'potencializado' })] })
    expect(efeitoCondicoesPericia(pericia(f, 'perception'), f).desvantagem).toEqual(['Desorientado'])
    expect(efeitoCondicoesPericia(pericia(f, 'deduction'), f).desvantagem).toEqual([])
    expect(efeitoCondicoesPericia(pericia(f, 'deduction'), f).vantagem).toEqual(['Potencializado'])
  })
})

describe('movimento', () => {
  it('exemplo do livro: VEL 3 Aprimorado [+2] → 9 m vira 12 m', () => {
    expect(movimentoComCondicoes(eccho_({ condicoes: [cond({ id: 'aprimorado', atributo: 'velocidade', valor: 2 })] })).metros).toBe(12)
  })
  it('Lento e Prostrado: metade · Imobilizado: 0', () => {
    expect(movimentoComCondicoes(eccho_({ condicoes: [cond({ id: 'lento' })] })).metros).toBe(4.5)
    expect(movimentoComCondicoes(eccho_({ condicoes: [cond({ id: 'prostrado' })] })).metros).toBe(4.5)
    expect(movimentoComCondicoes(eccho_({ condicoes: [cond({ id: 'imobilizado' })] })).metros).toBe(0)
  })
})

describe('ações no turno (rápido 2 ▶, lento 3 ▶, 1 ↻)', () => {
  it('sem condição', () => {
    expect(acoesNoTurno(eccho_())).toMatchObject({ rapido: 2, lento: 3, reacao: true })
  })
  it('Atordoado: 2 ▶ a menos e sem reação', () => {
    expect(acoesNoTurno(eccho_({ condicoes: [cond({ id: 'atordoado' })] }))).toMatchObject({ rapido: 0, lento: 1, reacao: false })
  })
  it('Surpreendido: sem turno rápido, 1 ▶ a menos, sem reação', () => {
    expect(acoesNoTurno(eccho_({ condicoes: [cond({ id: 'surpreendido' })] }))).toMatchObject({ rapido: null, lento: 2, reacao: false })
  })
})

describe('rolagem de lesão', () => {
  it.each([
    [-7, 'morte'], [-6, 'morte'], [-5, 'permanente'], [0, 'permanente'], [1, 'grave'],
    [5, 'grave'], [6, 'leve'], [15, 'leve'], [16, 'superficial'],
  ] as const)('total %i → %s (tabela Duração de Lesão)', (total, esperado) => {
    expect(resultadoLesao(total)).toBe(esperado)
  })
  it('−5 por lesão que já existe, mais a deflexão', () => {
    const f = eccho_({ lesoes: [lesao({ gravidade: 'leve', efeito: 'lento' }), lesao({ gravidade: 'grave', efeito: 'outro' })] })
    expect(modificadorRolagemLesao(f).total).toBe(f.deflect - 10)
  })
})

describe('descanso', () => {
  it('curto soma o que o jogador distribuiu e trava no máximo', () => {
    const f = eccho_()
    f.recursos.vida.atual = 10
    f.recursos.foco.atual = 1
    const d = descansoCurto(f, 3, 99)
    expect(d.recursos.vida.atual).toBe(13)
    expect(d.recursos.foco.atual).toBe(d.recursos.foco.max)
  })
  it('longo: Vida e Foco cheios, Exausto −1 (some no 0), superficial cura, leve fica', () => {
    const f = eccho_({
      condicoes: [cond({ id: 'exausto', valor: 2 }), cond({ id: 'exausto', valor: 1 }), cond({ id: 'lento' })],
      lesoes: [lesao({ gravidade: 'superficial', efeito: 'lento' }), lesao({ gravidade: 'leve', efeito: 'outro', diasRestantes: 3 })],
    })
    f.recursos.vida.atual = 2
    const d = descansoLongo(f)
    expect(d.recursos.vida.atual).toBe(d.recursos.vida.max)
    expect(d.condicoes.map((c) => [c.id, c.valor])).toEqual([['exausto', 1], ['lento', undefined]])
    expect(d.lesoes.map((l) => l.gravidade)).toEqual(['leve'])
  })
})
