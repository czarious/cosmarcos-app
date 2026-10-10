/* arquivo: kits.test.ts */
import { describe, it, expect } from 'vitest'
import { KITS, kitPorNome } from './kits'
import { CONJUNTO_INICIAL } from '../estado/deparaShards'
import { armaduraPorNome } from './armaduras'

describe('kits iniciais', () => {
  it('todo conjunto do de-para tem kit, com o nome em inglês certo', () => {
    for (const [en, pt] of Object.entries(CONJUNTO_INICIAL)) {
      expect(KITS[pt], pt).toBeDefined()
      expect(KITS[pt].nome).toBe(pt)
      expect(KITS[pt].nomeEn).toBe(en)
    }
    expect(Object.keys(KITS)).toHaveLength(Object.keys(CONJUNTO_INICIAL).length)
  })

  it('armadura citada existe no catálogo de armaduras', () => {
    for (const k of Object.values(KITS)) {
      for (const parte of (k.armadura ?? '').split(' e ').filter(Boolean)) {
        expect(armaduraPorNome(parte), `${k.nome}: ${parte}`).toBeDefined()
      }
    }
  })

  it('esferas, quando há, são dados válidos', () => {
    for (const k of Object.values(KITS)) if (k.esferas) expect(k.esferas).toMatch(/^\d+d\d+$/)
  })

  it('kitPorNome', () => {
    expect(kitPorNome('Militar')?.esferas).toBe('2d6')
    expect(kitPorNome('Nenhum')).toBeUndefined()
  })
})
