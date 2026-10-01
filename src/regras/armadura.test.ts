/* arquivo: armadura.test.ts */
import { describe, it, expect } from 'vitest'
import type { Item, Personagem } from '../tipos/personagem'
import { importarShards } from '../estado/importarShards'
import { exportarShards } from '../estado/exportarShards'
import { MIGRACOES } from '../estado/armazenamento'
import { armaduraPesada, danoAposDeflexao, deflexaoTotal } from './armadura'
import { condicoesEfetivas, efeitoCondicoesPericia, movimentoComCondicoes, modificadorRolagemLesao } from './condicoes'
import eccho from '../../public/personagens/eccho.json'

// Armadura — transcricao/07-itens/05-armaduras.md. Eccho: Força 1, deflexão base 0, movimento 9 m.

const cota = (mudar: Partial<Item> = {}): Item => ({
  nome: 'Cota de Malha',
  tipo: 'Armadura',
  qtd: 1,
  peso: 12.5,
  equipado: true,
  deflexao: 2,
  tracos: ['Desajeitada [3]'],
  tracosPerito: ['Única: perde o traço Desajeitada'],
  ...mudar,
})
const eccho_ = (itens: Item[], mudar: Partial<Personagem> = {}): Personagem => {
  const f = importarShards(structuredClone(eccho))[0]
  return { ...f, itens: [...f.itens, ...itens], ...mudar }
}

describe('armadura vestida', () => {
  it('soma a deflexão dela à da ficha — e a rolagem de lesão usa o total', () => {
    const f = eccho_([cota()])
    expect(deflexaoTotal(f).total).toBe(f.deflect + 2)
    expect(modificadorRolagemLesao(f).total).toBe(f.deflect + 2)
  })

  it('guardada na mochila não conta', () => {
    const f = eccho_([cota({ equipado: false })])
    expect(deflexaoTotal(f).total).toBe(f.deflect)
    expect(armaduraPesada(f)).toBeUndefined()
  })

  it('duas vestidas: só a de maior deflexão vale, e a tela avisa', () => {
    const f = eccho_([cota(), cota({ nome: 'Couro', deflexao: 1, tracos: [], tracosPerito: [] })])
    expect(deflexaoTotal(f)).toMatchObject({ total: f.deflect + 2, variasVestidas: true })
  })
})

describe('Desajeitada [X]', () => {
  it('Força 1 com Desajeitada [3]: fica Lento, movimento cai à metade, desvantagem em Velocidade', () => {
    const f = eccho_([cota()])
    expect(condicoesEfetivas(f).some((c) => c.id === 'lento' && c.origem === 'armadura')).toBe(true)
    expect(movimentoComCondicoes(f).metros).toBe(4.5)
    const agilidade = f.pericias.find((p) => p.id === 'agility')!
    expect(efeitoCondicoesPericia(agilidade, f).desvantagem).toContain('Desajeitada')
    const deducao = f.pericias.find((p) => p.id === 'deduction')!
    expect(efeitoCondicoesPericia(deducao, f).desvantagem).not.toContain('Desajeitada')
  })

  it('com especialidade naquela armadura, o traço de perito tira a Desajeitada', () => {
    const f = eccho_([cota()])
    const comPerito = { ...f, especializacoes: [...f.especializacoes, { tipo: 'armadura' as const, nome: 'Cota de Malha' }] }
    expect(armaduraPesada(comPerito)).toBeUndefined()
  })

  it('Meia Armadura com perito: Desajeitada [3] em vez de [4]', () => {
    const meia = cota({ nome: 'Meia Armadura', deflexao: 3, tracos: ['Desajeitada [4]'], tracosPerito: ['Única: Desajeitada [3] em vez de Desajeitada [4]'] })
    const f = eccho_([meia], {})
    const forte = (forca: number) => ({ ...f, atributos: { ...f.atributos, forca }, especializacoes: [...f.especializacoes, { tipo: 'armadura' as const, nome: 'Meia Armadura' }] })
    expect(armaduraPesada(forte(3))).toBeUndefined()
    expect(armaduraPesada(forte(2))).toBeDefined()
  })
})

describe('armadura no Shards', () => {
  const comArmadura = () => {
    const j = structuredClone(eccho) as { characters: Record<string, unknown>[] }
    const c = j.characters[0] as { inventory: { items: Record<string, unknown>[] } }
    c.inventory.items.push({ id: 'arm-1', name: 'Chain', type: 'armor', quantity: 1, weight: 25, deflect: 2, traits: ['Cumbersome [3]'], expertTraits: ['Unique: loses Cumbersome trait'], equipped: true })
    return j
  }

  it('o tradutor lê deflexão e traços (inclusive o de perito)', () => {
    const f = importarShards(comArmadura())[0]
    const a = f.itens.find((i) => i.idShards === 'arm-1')!
    expect(a).toMatchObject({ nome: 'Cota de Malha', tipo: 'Armadura', deflexao: 2, equipado: true, tracos: ['Desajeitada [3]'], tracosPerito: ['Única: perde o traço Desajeitada'] })
  })

  it('especialidade "Chain" do Shards casa com a Cota de Malha: o traço de perito tira a Desajeitada', () => {
    const j = comArmadura()
    ;(j.characters[0] as { expertises: unknown[] }).expertises.push({ id: 'e-arm', type: 'Armor', name: 'Chain', source: 'custom' })
    const f = importarShards(j)[0]
    expect(f.especializacoes).toContainEqual({ tipo: 'armadura', nome: 'Cota de Malha' })
    expect(armaduraPesada(f)).toBeUndefined()
  })

  it('tirar a armadura no app volta pro Shards como não vestida', () => {
    const j = comArmadura()
    const f = importarShards(structuredClone(j))[0]
    f.itens = f.itens.map((i) => (i.idShards === 'arm-1' ? { ...i, equipado: false } : i))
    const volta = JSON.parse(exportarShards(f, structuredClone(j.characters[0]))).characters[0]
    expect(volta.inventory.items.find((i: { id: string }) => i.id === 'arm-1')).toMatchObject({ equipped: false, deflect: 2 })
  })

  it('save antigo (v6): a migração busca a deflexão na semente, sem reimportar', () => {
    const j = comArmadura()
    const f = importarShards(structuredClone(j))[0]
    f.itens = f.itens.map((i) => (i.idShards === 'arm-1' ? { ...i, deflexao: undefined, tracos: undefined, tracosPerito: undefined } : i))
    MIGRACOES[6](f, j.characters[0])
    expect(f.itens.find((i) => i.idShards === 'arm-1')?.deflexao).toBe(2)
  })
})

describe('dano com deflexão', () => {
  it('o exemplo do livro: deflexão 2 e 5 de dano energético tiram 3 de Vida', () => {
    expect(danoAposDeflexao(5, 2)).toBe(3)
  })
  it('dano menor que a deflexão não cura: fica 0', () => {
    expect(danoAposDeflexao(1, 2)).toBe(0)
  })
  it('sem deflexão o dano passa inteiro', () => {
    expect(danoAposDeflexao(5, 0)).toBe(5)
  })
})
