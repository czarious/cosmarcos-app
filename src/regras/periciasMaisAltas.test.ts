/* arquivo: periciasMaisAltas.test.ts */
import { describe, it, expect } from 'vitest'
import { importarShards } from '../estado/importarShards'
import { periciasMaisAltas, totalPericia } from './calculos'
import { semearEscolhas } from '../estado/usePersonagem'
import eccho from '../../public/personagens/eccho.json'

describe('periciasMaisAltas', () => {
  const ficha = () => importarShards(structuredClone(eccho))[0]

  it('devolve 5 itens', () => {
    const f = ficha()
    const maiores = periciasMaisAltas(f, {})
    expect(maiores).toHaveLength(5)
  })

  it('totais em ordem não crescente (decrescente)', () => {
    const f = ficha()
    const maiores = periciasMaisAltas(f, {})
    const totais = maiores.map((p) => totalPericia(p, f, {}))
    for (let i = 1; i < totais.length; i++) {
      expect(totais[i]).toBeLessThanOrEqual(totais[i - 1])
    }
  })

  it('o primeiro tem o maior total entre todas as perícias', () => {
    const f = ficha()
    const maiores = periciasMaisAltas(f, {})
    const todosOsTotais = f.pericias.map((p) => totalPericia(p, f, {}))
    const maiorGeral = Math.max(...todosOsTotais)
    const totalDoPrimeiro = totalPericia(maiores[0], f, {})
    expect(totalDoPrimeiro).toBe(maiorGeral)
  })

  it('preserva ordem original no empate', () => {
    const f = ficha()
    const escolhas = semearEscolhas(f)
    const maiores = periciasMaisAltas(f, escolhas)
    // Verificar que quando dois itens têm o mesmo total, o que vem primeiro
    // em ficha.pericias aparece primeiro em maiores
    for (let i = 0; i < maiores.length - 1; i++) {
      const totalA = totalPericia(maiores[i], f, escolhas)
      const totalB = totalPericia(maiores[i + 1], f, escolhas)
      if (totalA === totalB) {
        const indiceA = f.pericias.indexOf(maiores[i])
        const indiceB = f.pericias.indexOf(maiores[i + 1])
        expect(indiceA).toBeLessThan(indiceB)
      }
    }
  })
})
