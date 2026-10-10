/* arquivo: armas.test.ts */
import { describe, it, expect } from 'vitest'
import { ARMAS, armaPorNome } from './armas'
import { ARMADURAS, armaduraPorNome } from './armaduras'
import { tracoPorNome } from './tracos'
import { ARMA_NOME, ARMADURA_NOME } from '../estado/deparaShards'

describe('catálogo de armas', () => {
  it('toda arma do de-para existe, com nomeEn correto', () => {
    for (const [en, pt] of Object.entries(ARMA_NOME)) {
      expect(armaPorNome(pt), pt).toBeDefined()
      expect(ARMAS[pt].nomeEn).toBe(en)
    }
    expect(Object.keys(ARMAS).length).toBe(Object.keys(ARMA_NOME).length)
  })

  it('todo traço citado existe em TRACOS', () => {
    for (const a of Object.values(ARMAS)) {
      for (const t of [...a.tracos, ...a.tracosPerito]) expect(tracoPorNome(t), `${a.nome}: ${t}`).toBeDefined()
    }
  })

  it('confere algumas linhas da tabela', () => {
    expect(armaPorNome('Besta')).toMatchObject({ dano: '1d8', distancia: { curta: 30, longa: 120 }, pesoKg: 3.5, precoMc: 200 })
    expect(armaPorNome('Lança Longa')?.alcanceExtra).toBe(1.5)
  })
})

describe('catálogo de armaduras', () => {
  it('toda armadura do de-para existe, com nomeEn correto', () => {
    for (const [en, pt] of Object.entries(ARMADURA_NOME)) {
      expect(armaduraPorNome(pt), pt).toBeDefined()
      expect(ARMADURAS[pt].nomeEn).toBe(en)
    }
    expect(Object.keys(ARMADURAS).length).toBe(Object.keys(ARMADURA_NOME).length)
  })

  it('todo traço citado existe em TRACOS', () => {
    for (const a of Object.values(ARMADURAS)) {
      for (const t of [...a.tracos, ...a.tracosPerito]) expect(tracoPorNome(t), `${a.nome}: ${t}`).toBeDefined()
    }
  })

  it('deflexões da tabela', () => {
    expect(armaduraPorNome('Meia Armadura')?.deflexao).toBe(3)
    expect(armaduraPorNome('Armadura Fractal')?.deflexao).toBe(5)
  })
})
