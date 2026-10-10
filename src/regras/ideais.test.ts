/* arquivo: ideais.test.ts */
import { describe, it, expect } from 'vitest'
import { importarShards } from '../estado/importarShards'
import { idTalentoDoIdeal, talentoDoIdeal, temTalentoDoIdeal } from './ideais'
import { ORDEM } from '../estado/deparaShards'
import { ACOES_CONCEDIDAS } from './acoes'
import eccho from '../../public/personagens/eccho.json'

const ficha = () => importarShards(structuredClone(eccho))[0]

describe('Ideais (livro, cap. 5)', () => {
  it('o id do talento segue o Shards', () => {
    expect(idTalentoDoIdeal('Alternauta', 1)).toBe('first-ideal-elsecaller-key')
    expect(idTalentoDoIdeal('Alternauta', 2)).toBe('second-ideal-elsecaller')
    expect(idTalentoDoIdeal('Alternauta', 5)).toBeNull() // o Quinto Ideal se perdeu
  })

  it('o Eccho (nível 3) tem o talento do 1º Ideal e não o do 2º (nível 4+)', () => {
    expect(temTalentoDoIdeal(ficha(), 1)).toBe(true)
    expect(temTalentoDoIdeal(ficha(), 2)).toBe(false)
  })

  it('toda ordem com árvore no catálogo tem o texto dos 4 Ideais', () => {
    const comArvore = Object.values(ORDEM).filter((o) => talentoDoIdeal(o, 1))
    expect(comArvore.length).toBeGreaterThanOrEqual(9)
    for (const o of comArvore) for (const n of [1, 2, 3, 4]) expect(talentoDoIdeal(o, n)?.descricao, `${o} ${n}`).toBeTruthy()
  })
})

describe('ações de Luz (livro, cap. 5: o 1º Ideal de QUALQUER ordem dá as três)', () => {
  it('toda ordem com árvore tem Inspirar, Aprimorar e Restaurar no talento do 1º Ideal', () => {
    for (const [en, pt] of Object.entries(ORDEM)) {
      if (!talentoDoIdeal(pt, 1)) continue // ordem sem árvore no livro (Vinculador)
      const chave = `${en.toLowerCase()}::${idTalentoDoIdeal(pt, 1)}`
      expect(ACOES_CONCEDIDAS[chave]?.map((a) => a.nome), pt).toEqual(['Inspirar Luz das Tempestades', 'Aprimorar', 'Restaurar'])
    }
  })
})
