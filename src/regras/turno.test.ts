/* arquivo: turno.test.ts */
import { describe, it, expect } from 'vitest'
import type { Personagem, Condicao } from '../tipos/personagem'
import { importarShards } from '../estado/importarShards'
import { ACOES_PADRAO, ACOES_CONCEDIDAS, ACOES_ESPRENO } from './acoes'
import { avaliar, comecarTurno, custoEfetivo, encerrarTurno, gastar, iniciarCombate, aprimorarVenceAgora, usavelDe, type AcaoUsavel } from './turno'
import eccho from '../../public/personagens/eccho.json'
import { mensagem } from '../idioma/idioma'

// Cada caso sai do Cap. 10 (transcricao/10-combate/01-ordem-de-combate.md e
// 02-acoes-e-reacoes.md) ou do Cap. 5 (Aprimorar, Inspirar, Restaurar).
// Eccho: Foco 4, Investidura 5.

let n = 0
const cond = (c: Omit<Condicao, 'uid'>): Condicao => ({ ...c, uid: `c${n++}` })
function eccho_(mudar: Partial<Personagem> = {}): Personagem {
  return { ...importarShards(structuredClone(eccho))[0], ...mudar }
}
const padrao = (nome: string) => usavelDe('padrao', ACOES_PADRAO.find((a) => a.nome === nome)!)
/** O motivo como a tela escreve em português — pra comparar com o texto do livro. */
const motivo = (a: AcaoUsavel, e: Parameters<typeof avaliar>[1], f: Personagem) => {
  const av = avaliar(a, e, f)
  return { pode: av.pode, motivo: av.motivo && mensagem(av.motivo, 'pt') }
}
const luz = (nome: string) => usavelDe('luz', ACOES_CONCEDIDAS['elsecaller::first-ideal-elsecaller-key'].find((a) => a.nome === nome)!)

describe('turno rápido e lento', () => {
  it('rápido 2 ▶, lento 3 ▶, e 1 ↻ desde o início do combate', () => {
    const f = eccho_()
    const inicio = iniciarCombate(f)
    expect(inicio.reacoes).toBe(1)
    expect(comecarTurno(inicio, f, 'rapido').acoes).toBe(2)
    expect(comecarTurno(inicio, f, 'lento').acoes).toBe(3)
  })

  it('Surpreendido: sem reação no início do combate e 1 ▶ a menos', () => {
    const f = eccho_({ condicoes: [cond({ id: 'surpreendido' })] })
    const inicio = iniciarCombate(f)
    expect(inicio.reacoes).toBe(0)
    expect(comecarTurno(inicio, f, 'lento').acoes).toBe(2)
  })

  it('▶ que sobra se perde no fim do turno; a reação continua até o próximo', () => {
    const f = eccho_()
    const fim = encerrarTurno(comecarTurno(iniciarCombate(f), f, 'lento'))
    expect(fim.acoes).toBe(0)
    expect(fim.reacoes).toBe(1)
  })
})

describe('gastar ações', () => {
  it('Agarrar (▶▶) no turno rápido deixa 0; aí Golpear não cabe', () => {
    const f = eccho_()
    let e = comecarTurno(iniciarCombate(f), f, 'rapido')
    e = gastar(padrao('Agarrar'), e, f)
    expect(e.acoes).toBe(0)
    expect(motivo(padrao('Golpear'), e, f)).toMatchObject({ pode: false, motivo: 'faltam ▶ (1)' })
  })

  it('ação nomeada: uma vez por turno — Golpear, Mover e Interagir podem repetir', () => {
    const f = eccho_()
    let e = comecarTurno(iniciarCombate(f), f, 'lento')
    e = gastar(padrao('Desengajar'), e, f)
    expect(motivo(padrao('Desengajar'), e, f)).toMatchObject({ pode: false, motivo: 'já usou neste turno' })
    e = gastar(padrao('Golpear'), e, f)
    expect(avaliar(padrao('Golpear'), e, f).pode).toBe(true)
  })

  it('reação: gasta a ↻ e o foco; sem ↻, não dá', () => {
    const f = eccho_()
    const esquivar = padrao('Esquivar')
    expect(custoEfetivo(esquivar, f).foco).toBe(1)
    let e = iniciarCombate(f)
    expect(motivo(esquivar, e, f).pode).toBe(true) // fora do turno, vale
    e = gastar(esquivar, e, f)
    expect(motivo(padrao('Golpe Reativo'), e, f)).toMatchObject({ pode: false, motivo: 'sem reação' })
  })

  it('ação livre só no seu turno (Largar: "no turno de outro, só com Preparar")', () => {
    const f = eccho_()
    const e = iniciarCombate(f)
    expect(motivo(luz('Restaurar'), e, f)).toMatchObject({ pode: false, motivo: 'fora do seu turno' })
  })

  it('Recuperar: uma vez por cena', () => {
    const f = eccho_()
    let e = comecarTurno(iniciarCombate(f), f, 'lento')
    e = gastar(padrao('Recuperar'), e, f)
    e = comecarTurno(encerrarTurno(e), f, 'lento')
    expect(motivo(padrao('Recuperar'), e, f)).toMatchObject({ pode: false, motivo: 'uma vez por cena' })
  })

  it('Preparar reserva ▶ pra uma ação fora do turno; o próximo turno apaga a reserva', () => {
    const f = eccho_()
    let e = comecarTurno(iniciarCombate(f), f, 'lento')
    e = gastar(padrao('Preparar'), e, f, 1) // 1 do Preparar + 1 reservada
    expect(e.acoes).toBe(1)
    e = encerrarTurno(e)
    expect(avaliar(padrao('Golpear'), e, f)).toMatchObject({ pode: true, daPreparada: true })
    expect(avaliar(padrao('Agarrar'), e, f).pode).toBe(false) // ▶▶ não cabe em 1
    const usada = gastar(padrao('Golpear'), e, f)
    expect(usada.preparada).toBeNull()
    expect(comecarTurno(e, f, 'lento').preparada).toBeNull()
  })
})

describe('custo em recurso', () => {
  it('sem foco suficiente o botão apaga', () => {
    const f = eccho_()
    f.recursos.foco.atual = 1
    const reconhecer: AcaoUsavel = usavelDe('espreno', ACOES_ESPRENO.find((a) => a.nome === 'Reconhecer Escondido')!)
    expect(motivo(reconhecer, null, f)).toMatchObject({ pode: false, motivo: 'falta foco (2)' })
  })

  it('Focado: o que custa foco sai 1 mais barato', () => {
    const f = eccho_({ condicoes: [cond({ id: 'focado' })] })
    expect(custoEfetivo(padrao('Esquivar'), f).foco).toBe(0)
  })

  it('fora de combate só o custo conta — nada de ▶', () => {
    const f = eccho_()
    expect(motivo(luz('Aprimorar'), null, f).pode).toBe(true)
  })

  it('Inconsciente: só Inspirar e Restaurar, sem pedir ▶', () => {
    const f = eccho_({ condicoes: [cond({ id: 'inconsciente' })] })
    const e = comecarTurno(iniciarCombate(f), f, 'lento')
    expect(e.acoes).toBe(0)
    expect(avaliar(luz('Inspirar Luz das Tempestades'), e, f).pode).toBe(true)
    expect(motivo(padrao('Golpear'), e, f)).toMatchObject({ pode: false, motivo: 'Inconsciente' })
  })
})

describe('Aprimorar', () => {
  it('usado na rodada 1, vence no fim da rodada 2', () => {
    const f = eccho_()
    let e = comecarTurno(iniciarCombate(f), f, 'lento')
    e = { ...gastar(luz('Aprimorar'), e, f), aprimorarAte: e.rodada + 1 }
    expect(aprimorarVenceAgora(e)).toBe(false)
    e = comecarTurno(encerrarTurno(e), f, 'lento')
    expect(aprimorarVenceAgora(e)).toBe(true)
  })
})
