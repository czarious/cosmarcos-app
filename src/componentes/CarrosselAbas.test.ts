/* arquivo: CarrosselAbas.test.ts */
import { describe, it, expect } from 'vitest'
import { perto, podeArrastar, proximaAMontar } from './CarrosselAbas'

const toque = (x: number, dentroDe: string | null = null, dedos = 1) =>
  ({
    touches: Array.from({ length: dedos }, () => ({ clientX: x })),
    target: { closest: (sel: string) => (dentroDe && sel.includes(dentroDe) ? {} : null) },
  }) as unknown as TouchEvent

describe('carrossel das abas', () => {
  it('perto = a aba aberta e as vizinhas', () => {
    expect([0, 1, 2, 3, 4].filter((i) => perto(i, 2))).toEqual([1, 2, 3])
    expect([0, 1, 2].filter((i) => perto(i, 0))).toEqual([0, 1])
  })

  it('monta as que faltam, uma por vez, até acabar', () => {
    expect(proximaAMontar(4, new Set([-1, 0, 1]))).toBe(2)
    expect(proximaAMontar(3, new Set([0, 1, 2]))).toBeNull()
  })

  it('arrasta com um dedo, no meio da tela', () => {
    expect(podeArrastar(toque(200), 400)).toBe(true)
  })

  it('não arrasta na borda, com dois dedos, em campo, em diálogo nem com mouse', () => {
    expect(podeArrastar(toque(10), 400)).toBe(false) // voltar do Safari
    expect(podeArrastar(toque(390), 400)).toBe(false)
    expect(podeArrastar(toque(200, null, 2), 400)).toBe(false) // pinça de zoom
    expect(podeArrastar(toque(200, 'textarea'), 400)).toBe(false)
    expect(podeArrastar(toque(200, '.cr-overlay'), 400)).toBe(false)
    expect(podeArrastar({ clientX: 200 } as unknown as MouseEvent, 400)).toBe(false)
  })
})
