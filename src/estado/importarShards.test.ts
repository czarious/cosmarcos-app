/* arquivo: importarShards.test.ts */
import { describe, it, expect } from 'vitest'
import { importarShards, ErroImportacao } from './importarShards'
import { exportarShards } from './exportarShards'
import { totalPericia } from '../regras/calculos'
import { semearEscolhas } from './usePersonagem'
import eccho from '../../public/personagens/eccho.json'

// O tradutor é o ponto por onde o Shards entra — e ele falha calado se
// ninguém conferir (ver escopo/premissas.md → "Schema próprio em português").

const cru = eccho.characters[0]
const ficha = () => importarShards(structuredClone(eccho))[0]

describe('importar o Eccho', () => {
  it('lê o que o Shards manda pronto', () => {
    const f = ficha()
    expect(f.meta.nome).toBe('Eccho')
    expect(f.defesas).toMatchObject({ fisica: 14, cognitiva: 16, espiritual: 13 })
    expect(f.recursos.vida).toEqual({ atual: 21, max: 21 })
    expect(f.recursos.foco).toEqual({ atual: 4, max: 4 })
    expect(f.recursos.investidura).toEqual({ atual: 5, max: 5 })
  })

  it('grita com arquivo que não é do Shards', () => {
    expect(() => importarShards({ qualquer: 1 })).toThrow(ErroImportacao)
  })
})

describe('total de perícia', () => {
  // Conta refeita direto do JSON cru: atributo + mod + graduação + bônus + misc.
  // É a conta do livro (atributo efetivo + graduações) — se o app divergir, o bug é do app.
  const esperado = (s: (typeof cru.skills)[number]) =>
    cru.attributes[s.trait as keyof typeof cru.attributes] +
    cru.attributeMods[s.trait as keyof typeof cru.attributeMods] +
    s.rank + s.rankBonus + s.misc

  it.each(cru.skills.map((s) => [s.key, s] as const))('%s bate com o Shards (sem vínculo e com o do Eccho)', (key, s) => {
    const f = ficha()
    const p = f.pericias.find((x) => x.id === key)!
    expect(totalPericia(p, f, {})).toBe(esperado(s))
    expect(totalPericia(p, f, semearEscolhas(f))).toBe(esperado(s))
  })
})

describe('ideais (livro, "Jurando Ideais")', () => {
  it('jurado vem com 3 marcos; o próximo a jurar entra com os marcos do vínculo', () => {
    const ideais = ficha().radiante!.ideais
    expect(ideais.map((i) => [i.n, i.jurado, i.marcos])).toEqual([
      [1, true, 3],
      [2, false, 0],
    ])
    expect(ideais[1].texto).toBe('') // o texto-modelo em inglês do Shards não é do jogador
  })
})

describe('exportar pro Shards', () => {
  it('objetivo e ideal mudados no app voltam pro Shards', () => {
    const f = ficha()
    f.objetivos[1] = { ...f.objetivos[1], grau: 2 }
    f.objetivos.push({ nome: 'Novo objetivo', concluido: false, grau: 0 })
    f.radiante!.ideais[1] = { ...f.radiante!.ideais[1], marcos: 3, jurado: true, texto: 'Minhas palavras' }
    const volta = JSON.parse(exportarShards(f, structuredClone(cru) as Record<string, unknown>)).characters[0]
    expect(volta.goals[1]).toMatchObject({ name: 'Achar Assassino de Kavel', rank: 2, achieved: false })
    expect(volta.goals.some((g: { name: string }) => g.name === 'Novo objetivo')).toBe(true)
    expect(volta.radiant.ideals.i2).toBe(true)
    expect(volta.radiant.idealsText.i2).toBe('Minhas palavras')
    expect(volta.radiant.sprenBonds[0].idealMilestones.i2).toBe(3)
    expect(volta.radiant.sprenBonds[0].ideals.i2).toBe(true)
  })

  it('sem mudança no app, a volta é idêntica à ida (fora a data)', () => {
    const volta = JSON.parse(exportarShards(ficha(), structuredClone(cru) as Record<string, unknown>)).characters[0]
    const { updatedAt: _a, ...resto } = volta
    const { updatedAt: _b, ...original } = structuredClone(cru)
    expect(resto).toEqual(original)
  })
})
