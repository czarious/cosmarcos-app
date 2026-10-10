/* arquivo: origens.test.ts */
import { describe, expect, it } from 'vitest'
import { ANCESTRALIDADE, CULTURA, ORDEM, TRILHA_HEROICA } from '../estado/deparaShards'
import {
  ANCESTRALIDADES, CULTURAS, ORDENS, TRILHAS_HEROICAS,
  ancestralidadePorNome, culturaPorNome, ordemPorNome, trilhaHeroicaPorNome,
} from './origens'

describe('origens', () => {
  it('toda ancestralidade, cultura e trilha heroica do de-para tem texto', () => {
    for (const n of Object.values(ANCESTRALIDADE)) expect(ancestralidadePorNome(n)?.oQueDa.length).toBeGreaterThan(0)
    for (const n of Object.values(CULTURA)) expect(culturaPorNome(n)?.oQueSabe.length).toBeGreaterThan(0)
    for (const n of Object.values(TRILHA_HEROICA)) expect(trilhaHeroicaPorNome(n)?.especializacoes).toHaveLength(3)
  })

  it('toda ordem jogável tem entrada com 2 fluxos e espreno', () => {
    for (const n of Object.values(ORDEM).filter((o) => o !== 'Vinculador')) {
      const o = ordemPorNome(n)
      expect(o, n).toBeDefined()
      expect(o!.fluxos).toHaveLength(2)
      expect(o!.espreno).not.toBe('')
    }
    expect(Object.keys(ORDENS)).toHaveLength(9)
    expect(ordemPorNome('Vinculador')).toBeDefined()
    expect(ORDENS.Vinculador).toBeUndefined()
  })

  it('a chave de cada registro bate com o nome', () => {
    for (const r of [ANCESTRALIDADES, CULTURAS, TRILHAS_HEROICAS, ORDENS]) {
      for (const [k, v] of Object.entries(r)) expect(v.nome).toBe(k)
    }
  })
})
