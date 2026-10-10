/* arquivo: tracos.test.ts */
import { describe, it, expect } from 'vitest'
import { TRACOS, tracoPorNome } from './tracos'
import { TRACO_ARMA } from '../estado/deparaShards'

describe('traços', () => {
  it('todo traço do de-para tem entrada, com o nome em inglês certo', () => {
    for (const [en, pt] of Object.entries(TRACO_ARMA)) {
      expect(TRACOS[pt], pt).toBeDefined()
      expect(TRACOS[pt].nomeEn).toBe(en)
      expect(TRACOS[pt].nome).toBe(pt)
      expect(TRACOS[pt].resumo.length).toBeGreaterThan(10)
    }
  })

  it('aceita o valor entre colchetes', () => {
    expect(tracoPorNome('Arremesso [6/18]')?.nome).toBe('Arremesso')
    expect(tracoPorNome('Desajeitada [2]')?.nome).toBe('Desajeitada')
    expect(tracoPorNome('Mão Inábil')?.nome).toBe('Mão Inábil')
    expect(tracoPorNome('Inexistente [1]')).toBeUndefined()
  })
})
