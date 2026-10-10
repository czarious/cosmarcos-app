/* arquivo: especialidadesCulturais.test.ts */
import { describe, it, expect } from 'vitest'
import { importarShards } from '../estado/importarShards'
import { especialidadeDaCultura, especialidadesComCulturas, indicesDaCultura } from './especialidadesCulturais'
import eccho from '../../public/personagens/eccho.json'

const ficha = () => importarShards(structuredClone(eccho))[0]

describe('cultura → especialidade cultural (livro, cap. 2)', () => {
  it('cada cultura concede a sua', () => {
    expect(especialidadeDaCultura('Thayleno')).toBe('Thaylena')
    expect(especialidadeDaCultura('Viajante')).toBe('Viajante')
  })

  it('trocar a cultura troca a especialidade cultural e mantém as outras', () => {
    const f = ficha()
    expect(f.meta.culturas).toEqual(['Thayleno', 'Kharbranthiano'])
    const outras = f.especializacoes.filter((e) => e.tipo !== 'cultural')
    const novas = especialidadesComCulturas(f, ['Alethiano', 'Kharbranthiano'])
    expect(novas.filter((e) => e.tipo === 'cultural').map((e) => e.nome)).toEqual(['Alethiana', 'Kharbranthiana'])
    expect(novas.filter((e) => e.tipo !== 'cultural')).toEqual(outras)
    // e as novas viram as fixas da cultura
    expect(indicesDaCultura({ ...f, meta: { ...f.meta, culturas: ['Alethiano', 'Kharbranthiano'] }, especializacoes: novas }).size).toBe(2)
  })

  it('tirar a 2ª cultura tira só a especialidade dela', () => {
    const novas = especialidadesComCulturas(ficha(), ['Thayleno'])
    expect(novas.filter((e) => e.tipo === 'cultural').map((e) => e.nome)).toEqual(['Thaylena'])
  })
})
