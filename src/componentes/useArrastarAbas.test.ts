/* arquivo: useArrastarAbas.test.ts */
import { describe, it, expect } from 'vitest'
import { abaVizinha, sentidoDoArrasto } from './useArrastarAbas'
import { LISTA } from './SeletorSecao'

describe('arrastar troca de aba', () => {
  it('esquerda = próxima, direita = anterior', () => {
    expect(sentidoDoArrasto(-80, 5)).toBe('proxima')
    expect(sentidoDoArrasto(80, -5)).toBe('anterior')
  })

  it('rolagem e toque curto não trocam', () => {
    expect(sentidoDoArrasto(-30, 0)).toBeNull() // curto demais
    expect(sentidoDoArrasto(-80, 60)).toBeNull() // diagonal: é rolagem
    expect(sentidoDoArrasto(5, 300)).toBeNull() // rolagem pura
  })

  it('segue a ordem do menu e para nas pontas', () => {
    expect(abaVizinha(LISTA, 'Fabriais', 'proxima')).toBe('Condições')
    expect(abaVizinha(LISTA, 'Condições', 'anterior')).toBe('Fabriais')
    expect(abaVizinha(LISTA, 'Principal', 'anterior')).toBeNull()
    expect(abaVizinha(LISTA, 'Anotações', 'proxima')).toBeNull()
  })
})
