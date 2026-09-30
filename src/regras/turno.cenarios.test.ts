/* arquivo: turno.cenarios.test.ts */
import { describe, it, expect } from 'vitest'
import type { Personagem, Condicao } from '../tipos/personagem'
import { importarShards } from '../estado/importarShards'
import { ACOES_PADRAO, ACOES_CONCEDIDAS } from './acoes'
import { acoesNoTurno } from './condicoes'
import { usosDoFabrial } from './fabriais'
import { GUIAS_FLUXO } from './fluxos'
import {
  comecarTurno,
  encerrarTurno,
  golpesDaArma,
  iniciarCombate,
  simularPlano,
  usavelDe,
  avaliar,
  type AcaoUsavel,
  type EstadoTurno,
  type ItemPlano,
} from './turno'
import { mensagem } from '../idioma/idioma'
import eccho from '../../public/personagens/eccho.json'

// TURNOS DE JOGADOR: o que alguém na mesa pediria, e o que o livro diz que o
// app deve deixar (ou barrar). Cada cenário é a fala do jogador + o plano que
// ele montaria no app. Regras: 10-combate/01-ordem-de-combate.md,
// 02-acoes-e-reacoes.md, 07-itens/04-armas.md (mãos), 07-itens/09-manufaturando.md
// (Projétil), 05-trilhas-radiantes/02-jogando-como-um-radiante.md (Luz), 06-fluxos/.
// Eccho: Foco 4, Investidura 5, Vida 21, patamar 1; Maça, Faca, Azagaia, PROJÉTIL (5 cargas).

let n = 0
const cond = (c: Omit<Condicao, 'uid'>): Condicao => ({ ...c, uid: `c${n++}` })
function eccho_(mudar: (f: Personagem) => void = () => {}): Personagem {
  const f = importarShards(structuredClone(eccho))[0]
  mudar(f)
  return f
}
const padrao = (nome: string) => usavelDe('padrao', ACOES_PADRAO.find((a) => a.nome === nome)!)
const luz = (nome: string) => usavelDe('luz', ACOES_CONCEDIDAS['elsecaller::first-ideal-elsecaller-key'].find((a) => a.nome === nome)!)

/** O Golpear com uma arma do Eccho, pela mão pedida — do jeito que a aba Ações monta. */
function golpe(f: Personagem, arma: string, mao: 'principal' | 'inabil', variante = 0): AcaoUsavel {
  const a = f.armas.find((x) => x.nome === arma)!
  const fab = f.fabriais.find((x) => x.nome === arma)
  const disparos = fab ? usosDoFabrial(fab).filter((u) => u.tipo === 'ataque').map((u) => ({ rotulo: u.rotulo, idFabrial: fab.id, custo: u.custo })) : []
  return golpesDaArma(padrao('Golpear'), arma, a.tracos, disparos).filter((g) => g.mao === mao)[variante].acao
}
const fluxo = (f: Personagem, id: string): AcaoUsavel => {
  const x = f.radiante!.fluxos.find((y) => y.id === id)!
  return { chave: `fluxo:${id}`, nome: x.nome, ativacao: x.ativacao, custo: GUIAS_FLUXO[id]?.custoAoUsar }
}
const pagar = (id: string, inv: number): AcaoUsavel => ({ chave: `pagar:${id}:${inv}`, nome: id, ativacao: 'especial', custo: { investidura: inv }, repetivel: true })

/** Monta o turno e roda o plano; devolve o que passou e por quê não. */
function turno(f: Personagem, tipo: 'rapido' | 'lento', itens: ItemPlano[], e0?: EstadoTurno) {
  const e = e0 ?? comecarTurno(iniciarCombate(f), f, tipo)
  const sim = simularPlano(itens, e, f)
  return {
    e,
    sim,
    passou: sim.avaliacoes.map((a) => a.pode),
    motivos: sim.avaliacoes.map((a) => (a.motivo ? mensagem(a.motivo, 'pt') : '')),
  }
}
const item = (acao: AcaoUsavel, extra?: ItemPlano['extra']): ItemPlano => ({ acao, extra })

describe('10 turnos LENTOS (3 ▶)', () => {
  it('"Ando até ele e bato: maça na mão principal, faca na inábil."', () => {
    const f = eccho_()
    const r = turno(f, 'lento', [item(padrao('Mover')), item(golpe(f, 'Maça', 'principal')), item(golpe(f, 'Faca', 'inabil'))])
    expect(r.passou).toEqual([true, true, true])
    expect(r.sim.ficha.recursos.foco.atual).toBe(f.recursos.foco.atual - 2) // mão inábil: 2 de foco
    expect(r.sim.estado!.acoes).toBe(0)
  })

  it('"Três golpes de maça!" — cada Golpear usa uma mão diferente: a mão principal só bate uma vez', () => {
    const f = eccho_()
    const r = turno(f, 'lento', [1, 2, 3].map(() => item(golpe(f, 'Maça', 'principal'))))
    expect(r.passou).toEqual([true, false, false])
    expect(r.motivos[1]).toBe('já usou neste turno')
  })

  it('"Sem Luz: inspiro das esferas e me Aprimoro."', () => {
    const f = eccho_((x) => (x.recursos.investidura.atual = 0))
    const r = turno(f, 'lento', [item(luz('Inspirar Luz das Tempestades')), item(luz('Aprimorar'))])
    expect(r.passou).toEqual([true, true])
    expect(r.sim.ficha.recursos.investidura.atual).toBe(f.recursos.investidura.max - 1)
    expect(r.sim.ficha.condicoes.filter((c) => c.id === 'aprimorado').map((c) => c.atributo).sort()).toEqual(['forca', 'velocidade'])
  })

  it('"Agarro o capanga e bato nele com a maça."', () => {
    const f = eccho_()
    const r = turno(f, 'lento', [item(padrao('Agarrar')), item(golpe(f, 'Maça', 'principal'))])
    expect(r.passou).toEqual([true, true])
    expect(r.sim.estado!.acoes).toBe(0)
  })

  it('"Transmuto a pedra embaixo dele em lama (objeto pequeno) e me desengajo."', () => {
    const f = eccho_()
    const r = turno(f, 'lento', [item(fluxo(f, 'transformation')), item(pagar('transformation', 1)), item(padrao('Desengajar'))])
    expect(r.passou).toEqual([true, true, true])
    expect(r.sim.ficha.recursos.investidura.atual).toBe(f.recursos.investidura.atual - 1)
    expect(r.sim.estado!.acoes).toBe(0)
  })

  it('"Preparo um golpe pra quando ele passar pela porta, e me posiciono."', () => {
    const f = eccho_()
    const r = turno(f, 'lento', [item(padrao('Preparar'), { reservar: 1 }), item(padrao('Mover'))])
    expect(r.passou).toEqual([true, true])
    const fora = encerrarTurno(r.sim.estado!)
    expect(avaliar(golpe(f, 'Maça', 'principal'), fora, f)).toMatchObject({ pode: true, daPreparada: true })
    expect(avaliar(padrao('Agarrar'), fora, f).pode).toBe(false) // ▶▶ não cabe na 1 ▶ preparada
  })

  it('"Paro pra respirar (Recuperar) e ando" — e no turno seguinte tento de novo', () => {
    const f = eccho_((x) => ((x.recursos.vida.atual = 10), (x.recursos.foco.atual = 1)))
    const r = turno(f, 'lento', [item(padrao('Recuperar'), { vida: 3, foco: 2 }), item(padrao('Mover'))])
    expect(r.passou).toEqual([true, true])
    expect(r.sim.ficha.recursos.vida.atual).toBe(13)
    expect(r.sim.ficha.recursos.foco.atual).toBe(3)
    const depois = comecarTurno(encerrarTurno(r.sim.estado!), r.sim.ficha, 'lento')
    expect(turno(r.sim.ficha, 'lento', [item(padrao('Recuperar'), { vida: 1 })], depois).motivos[0]).toBe('uma vez por cena')
  })

  it('"Olho o Reino Cognitivo: sinto Investidura e leio as emoções dele (2 efeitos), e ando duas vezes."', () => {
    const f = eccho_()
    const r = turno(f, 'lento', [item(fluxo(f, 'transportation')), item(pagar('transportation', 1)), item(padrao('Mover')), item(padrao('Mover'))])
    expect(r.passou).toEqual([true, true, true, true])
    expect(r.sim.ficha.recursos.investidura.atual).toBe(f.recursos.investidura.atual - 2)
  })

  it('"Disparo o Projétil com a principal e de novo com a inábil, e ando."', () => {
    const f = eccho_()
    const proj = () => r.sim.ficha.fabriais.find((x) => x.nome === 'PROJÉTIL')!.cargas.atual
    const r = turno(f, 'lento', [item(golpe(f, 'PROJÉTIL', 'principal')), item(golpe(f, 'PROJÉTIL', 'inabil')), item(padrao('Mover'))])
    expect(r.passou).toEqual([true, true, true])
    expect(proj()).toBe(3) // 1 carga por disparo
    expect(r.sim.ficha.recursos.foco.atual).toBe(f.recursos.foco.atual - 1) // traço Mão Inábil: 1 de foco, não 2
  })

  it('"Ganho vantagem lendo o golpe dele, uso Medicina no aliado — e tento Usar uma Perícia de novo."', () => {
    const f = eccho_()
    const r = turno(f, 'lento', [item(padrao('Ganhar Vantagem')), item(padrao('Usar uma Perícia')), item(padrao('Usar uma Perícia'))])
    expect(r.passou).toEqual([true, true, false]) // ação nomeada: uma vez por turno
    expect(r.motivos[2]).toBe('já usou neste turno')
  })
})

describe('10 turnos RÁPIDOS (2 ▶)', () => {
  it('"Duas mãos: maça e faca."', () => {
    const f = eccho_()
    const r = turno(f, 'rapido', [item(golpe(f, 'Maça', 'principal')), item(golpe(f, 'Faca', 'inabil'))])
    expect(r.passou).toEqual([true, true])
    expect(r.sim.estado!.acoes).toBe(0)
  })

  it('"Corro: movo duas vezes."', () => {
    const f = eccho_()
    expect(turno(f, 'rapido', [item(padrao('Mover')), item(padrao('Mover'))]).passou).toEqual([true, true])
  })

  it('"Inspiro Luz e já me Aprimoro" — no turno rápido não cabe', () => {
    const f = eccho_((x) => (x.recursos.investidura.atual = 0))
    const r = turno(f, 'rapido', [item(luz('Inspirar Luz das Tempestades')), item(luz('Aprimorar'))])
    expect(r.passou).toEqual([true, false])
    expect(r.motivos[1]).toBe('faltam ▶ (1)')
  })

  it('"Me curo com Luz (▷), bato e ando" — e quero me curar de novo', () => {
    const f = eccho_((x) => (x.recursos.vida.atual = 10))
    const r = turno(f, 'rapido', [
      item(luz('Restaurar'), { d6: 4 }),
      item(golpe(f, 'Maça', 'principal')),
      item(padrao('Mover')),
      item(luz('Restaurar'), { d6: 6 }),
    ])
    expect(r.passou).toEqual([true, true, true, false]) // ação livre nomeada: uma vez por turno
    expect(r.sim.ficha.recursos.vida.atual).toBe(10 + 4 + 1) // 1d6 + patamar 1
  })

  it('"Fui pego de surpresa — quero agir rápido."', () => {
    const f = eccho_((x) => (x.condicoes = [cond({ id: 'surpreendido' })]))
    const t = acoesNoTurno(f)
    expect(t.rapido).toBeNull() // Surpreendido não faz turno rápido
    expect(t.lento).toBe(2)
    expect(iniciarCombate(f).reacoes).toBe(0)
  })

  it('"Estou Atordoado e quero bater no turno rápido."', () => {
    const f = eccho_((x) => (x.condicoes = [cond({ id: 'atordoado' })]))
    const r = turno(f, 'rapido', [item(golpe(f, 'Maça', 'principal'))])
    expect(r.e.acoes).toBe(0) // 2 − 2
    expect(r.e.reacoes).toBe(0)
    expect(r.passou).toEqual([false])
  })

  it('"Estou Focado: me esquivo sem gastar foco."', () => {
    const f = eccho_((x) => (x.condicoes = [cond({ id: 'focado' })]))
    const r = turno(f, 'rapido', [item(padrao('Esquivar'))])
    expect(r.passou).toEqual([true])
    expect(r.sim.ficha.recursos.foco.atual).toBe(f.recursos.foco.atual)
  })

  it('"No turno dele: me esquivo — e ainda quero o Golpe Reativo quando ele fugir."', () => {
    const f = eccho_()
    const e = encerrarTurno(comecarTurno(iniciarCombate(f), f, 'rapido'))
    const r = turno(f, 'rapido', [item(padrao('Esquivar')), item(padrao('Golpe Reativo'))], e)
    expect(r.passou).toEqual([true, false]) // 1 reação por rodada
    expect(r.motivos[1]).toBe('sem reação')
  })

  it('"Sem foco nenhum, quero me esquivar."', () => {
    const f = eccho_((x) => (x.recursos.foco.atual = 0))
    const r = turno(f, 'rapido', [item(padrao('Esquivar'))])
    expect(r.passou).toEqual([false])
    expect(r.motivos[0]).toBe('falta foco (1)')
  })

  it('"Caí inconsciente: inspiro Luz e me restauro" — e tento golpear', () => {
    const f = eccho_((x) => ((x.condicoes = [cond({ id: 'inconsciente' })]), (x.recursos.investidura.atual = 0), (x.recursos.vida.atual = 0)))
    const r = turno(f, 'lento', [item(luz('Inspirar Luz das Tempestades')), item(luz('Restaurar'), { d6: 3 }), item(golpe(f, 'Maça', 'principal'))])
    expect(r.passou).toEqual([true, true, false])
    expect(r.sim.ficha.recursos.vida.atual).toBe(4)
    expect(r.motivos[2]).toBe('Inconsciente')
  })
})
