/* arquivo: equipamentos.test.ts */
import { describe, it, expect } from 'vitest'
import { EQUIPAMENTOS, equipamentoPorNome, MONTARIAS, VEICULOS, ALOJAMENTOS } from './equipamentos'
import { ITEM_NOME } from '../estado/deparaShards'
import { KITS } from './kits'

// Fabriais (os últimos do ITEM_NOME) ficam em fabriais.ts, não aqui.
const FABRIAIS_EN = [
  'Alerter', 'Attractor', 'Clock fabrial', 'Drainer', 'Emotion bracelet', 'Freechair', 'Heatrial',
  'Painrial (amplifying)', 'Painrial (numbing)', 'Repeller', 'Soulcaster', 'Spanreed (1 pair)', 'Suppressor',
]
// Mundanos do de-para sem linha na tabela do livro: nenhum no momento (acrescentar aqui, com o motivo).
const EXCECOES_EN: string[] = []

describe('equipamentos', () => {
  it('todo item mundano do de-para tem entrada, com o nome em inglês certo', () => {
    for (const [en, pt] of Object.entries(ITEM_NOME)) {
      if (FABRIAIS_EN.includes(en) || EXCECOES_EN.includes(en)) continue
      const e = equipamentoPorNome(pt)
      expect(e, pt).toBeDefined()
      expect(e!.nomeEn, pt).toBe(en)
    }
  })

  it('a lista de fabriais é mesmo só de fabriais (nenhum aparece aqui)', () => {
    for (const en of FABRIAIS_EN) {
      expect(ITEM_NOME[en], en).toBeDefined()
      expect(equipamentoPorNome(ITEM_NOME[en]), en).toBeUndefined()
    }
  })

  it('item com regra tem resumo; só narrativo não tem', () => {
    for (const e of Object.values(EQUIPAMENTOS)) {
      if (e.soNarrativo) expect(e.resumo, e.nome).toBeUndefined()
      else expect(e.resumo?.length ?? 0, e.nome).toBeGreaterThan(10)
      expect(e.pesoKg, e.nome).toBeGreaterThan(0)
      expect(e.precoMc, e.nome).toBeGreaterThan(0)
    }
  })

  it('só narrativos conferem com o asterisco do nome', () => {
    for (const [chave, e] of Object.entries(EQUIPAMENTOS)) {
      expect(chave).toBe(e.nome)
      if (chave.endsWith('*')) expect(e.soNarrativo, chave).toBe(true)
    }
  })

  it('aceita o nome com ou sem asterisco', () => {
    expect(equipamentoPorNome('Mochila')?.pesoKg).toBe(2.5)
    expect(equipamentoPorNome('Mochila*')?.soNarrativo).toBe(true)
    expect(equipamentoPorNome('Veneno (potente, 1 dose)')?.resumo).toMatch(/3d10/)
    expect(equipamentoPorNome('Inexistente')).toBeUndefined()
  })

  it('item dos kits que cita a tabela existe nela', () => {
    for (const k of Object.values(KITS)) {
      for (const txt of k.equipamentos) {
        const nome = txt.replace(/^\d+ x /, '')
        const base = nome.split(' de vinho')[0].split(' de cachaça')[0].split(' sobre ')[0].split(' à escolha')[0]
        expect(equipamentoPorNome(base), `${k.nome}: ${base}`).toBeDefined()
      }
    }
  })

  it('viagem', () => {
    expect(MONTARIAS).toHaveLength(3)
    expect(VEICULOS).toHaveLength(4)
    expect(ALOJAMENTOS).toHaveLength(5)
    expect(MONTARIAS.find(m => m.nome === 'Richádio')?.precoMc).toBeUndefined()
  })
})
