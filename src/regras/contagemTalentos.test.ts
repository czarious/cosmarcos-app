/* arquivo: contagemTalentos.test.ts */
import { describe, it, expect } from 'vitest'
import type { Personagem, Talento } from '../tipos/personagem'
import { importarShards } from '../estado/importarShards'
import { contarTalentos } from './contagemTalentos'
import eccho from '../../public/personagens/eccho.json'

const ficha = importarShards(structuredClone(eccho))[0]
const tal = (origem: Talento['origem'], n: number): Talento[] =>
  Array.from({ length: n }, (_, i) => ({ id: `${origem}${i}`, nome: '', origem, chave: false }))
const com = (meta: Partial<Personagem['meta']>, talentos: Talento[]): Personagem => ({
  ...ficha,
  meta: { ...ficha.meta, ...meta },
  talentos,
})

describe('contagem de talentos', () => {
  it('Eccho (Humano, nível 3, 5 talentos): 1 a mais que a tabela, como o "-1" do Shards', () => {
    expect(contarTalentos(ficha)).toEqual({
      porNivel: { usados: 4, previstos: 3 },
      ancestralidade: { usados: 1, previstos: 1 },
      saldo: -1,
    })
  })

  it('Radiante não ocupa a vaga de ancestralidade do Humano — ela fica aberta', () => {
    const c = contarTalentos(com({ ancestralidade: 'Humano', nivel: 2 }, tal('radiante', 2)))
    expect(c.ancestralidade).toEqual({ usados: 0, previstos: 1 })
    expect(c.porNivel).toEqual({ usados: 2, previstos: 2 })
    expect(c.saldo).toBe(1)
  })

  it('patamar novo dá outra vaga de ancestralidade (nível 6 = 2)', () => {
    const c = contarTalentos(com({ ancestralidade: 'Humano', nivel: 6 }, tal('heroica', 8)))
    expect(c.ancestralidade).toEqual({ usados: 2, previstos: 2 })
    expect(c.porNivel).toEqual({ usados: 6, previstos: 6 })
    expect(c.saldo).toBe(0)
  })

  it('Cantor ganha 2 de ancestralidade no nível 1, e talento da árvore de Cantor cabe nelas', () => {
    const c = contarTalentos(com({ ancestralidade: 'Cantor', nivel: 1 }, [...tal('ancestral', 2), ...tal('heroica', 1)]))
    expect(c.ancestralidade).toEqual({ usados: 2, previstos: 2 })
    expect(c.porNivel).toEqual({ usados: 1, previstos: 1 })
  })

  it('talentos extras do Shards e o teto do nível 20 entram nas vagas por nível', () => {
    expect(contarTalentos(com({ nivel: 25, talentosExtras: 3 }, [])).porNivel.previstos).toBe(23)
  })

  it('talento de fluxo aprendido gasta vaga por nível (só o aprendido)', () => {
    const r = ficha.radiante!
    const [f, ...resto] = r.fluxos
    const comFluxo: Personagem = {
      ...ficha,
      radiante: { ...r, fluxos: [{ ...f, talentos: f.talentos.map((t, i) => ({ ...t, aprendido: i === 0 })) }, ...resto] },
    }
    const c = contarTalentos(comFluxo)
    expect(c.porNivel.usados).toBe(contarTalentos(ficha).porNivel.usados + 1)
    expect(c.saldo).toBe(contarTalentos(ficha).saldo - 1)
  })
})
