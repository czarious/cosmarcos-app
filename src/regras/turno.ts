/* arquivo: turno.ts */
import type { Ativacao, Personagem } from '../tipos/personagem'
import type { Custo, EfeitoAcao, EntradaAcao } from './acoes'
import { acoesNoTurno, condicoesEfetivas } from './condicoes'
import type { Mensagem } from '../idioma/pt'

/**
 * RASTREADOR DE TURNO — Cap. 10 (Ordem de Combate; Ações e Reações).
 * Só conta: quem aplica na ficha (recurso, condição, carga) é estado/useTurno.ts.
 *
 * Regras que moram aqui, todas do livro:
 *  - turno rápido 2 ▶, lento 3 ▶, menos o que as condições tiram (condicoes.ts → acoesNoTurno)
 *  - 1 ↻ no início do combate (não Surpreendido) e a cada turno seu; dura até o próximo turno
 *  - ▶ que sobra no fim do turno se perde
 *  - ação e ação livre NOMEADAS: uma vez por turno, salvo "pode repetir"
 *  - ação livre segue as regras de ação: só no seu turno (Largar: "no turno de outro, só com Preparar")
 *  - Preparar: 1 ▶ + as ▶ da ação escolhida, usada fora do turno até o início do próximo
 *  - Focado: habilidade que custa foco custa 1 a menos
 */

export type TipoTurno = 'rapido' | 'lento'

/** Estado do combate. `null` no lugar dele = fora de combate (ação não conta ▶). */
export type EstadoTurno = {
  /** 0 = o combate começou e você ainda não fez turno. Um turno seu por rodada. */
  rodada: number
  /** `null` = fora do seu turno (a reação e a ação preparada ainda valem). */
  tipo: TipoTurno | null
  acoes: number
  /** ▶ com que o turno começou — pra desenhar as usadas. */
  totalAcoes: number
  reacoes: number
  /** Chaves das ações usadas neste turno — a regra do "uma vez por turno". */
  usadas: string[]
  /** Chaves das ações de "uma vez por cena" (Recuperar). O combate é a cena. */
  usadasNaCena: string[]
  /** Preparar: ▶ reservadas pra UMA ação fora do turno; `null` = nada preparado. */
  preparada: number | null
  /** Aprimorar: rodada em cujo FIM o Aprimorado acaba, se não for mantido. */
  aprimorarAte: number | null
}

/** Uma ação que o jogador pode usar — padrão, de talento, de espreno, fluxo, ataque ou fabrial. */
export type AcaoUsavel = {
  /** Identidade pra regra do "uma vez por turno": a mesma chave = a mesma ação nomeada. */
  chave: string
  nome: string
  ativacao: Ativacao
  custo?: Custo
  /** Cargas de fabrial que o uso gasta. */
  cargas?: { idFabrial: string; qtd: number }
  repetivel?: boolean
  efeito?: EfeitoAcao
  umaVezPorCena?: boolean
  mesmoInconsciente?: boolean
}

export const ACOES_POR_ATIVACAO: Partial<Record<Ativacao, number>> = { '1acao': 1, '2acoes': 2, '3acoes': 3 }

export function iniciarCombate(ficha: Personagem): EstadoTurno {
  return {
    rodada: 0,
    tipo: null,
    acoes: 0,
    totalAcoes: 0,
    // "no início do combate, a menos que Surpreendido, ganha 1 reação"
    reacoes: acoesNoTurno(ficha).reacao ? 1 : 0,
    usadas: [],
    usadasNaCena: [],
    preparada: null,
    aprimorarAte: null,
  }
}

/** Começa um turno seu: ▶ do tipo escolhido, reação nova, e a ação preparada vence. */
export function comecarTurno(e: EstadoTurno, ficha: Personagem, tipo: TipoTurno): EstadoTurno {
  const t = acoesNoTurno(ficha)
  const acoes = tipo === 'rapido' ? t.rapido : t.lento
  return {
    ...e,
    rodada: e.rodada + 1,
    tipo,
    acoes: acoes ?? 0,
    totalAcoes: acoes ?? 0,
    reacoes: t.reacao ? 1 : 0,
    usadas: [],
    preparada: null,
  }
}

/** Fim do turno: ▶ que sobrou se perde; reação e ação preparada continuam. */
export function encerrarTurno(e: EstadoTurno): EstadoTurno {
  return { ...e, tipo: null, acoes: 0, totalAcoes: 0, usadas: [] }
}

/** O Aprimorar acaba no fim DESTE turno se não for mantido (livro: "ao final desse turno… pode gastar 1 Investidura ▷ pra manter"). */
export function aprimorarVenceAgora(e: EstadoTurno): boolean {
  return e.aprimorarAte !== null && e.tipo !== null && e.rodada >= e.aprimorarAte
}

/** Custo que a ficha paga de fato — Focado tira 1 do foco. */
export function custoEfetivo(acao: AcaoUsavel, ficha: Personagem): Custo {
  const foco = acao.custo?.foco ?? 0
  const focado = condicoesEfetivas(ficha).some((c) => c.id === 'focado')
  return {
    foco: focado && foco > 0 ? foco - 1 : foco,
    investidura: acao.custo?.investidura ?? 0,
  }
}

export type Avaliacao = {
  pode: boolean
  /** Por que não — curto, cabe embaixo do botão. */
  motivo?: Mensagem
  /** Vai sair da ação preparada, não das ▶ do turno. */
  daPreparada?: boolean
}

/**
 * Dá pra usar agora? Fora de combate (`e` nulo) só o custo em recurso conta —
 * no livro, diálogo e empreitada não contam ▶.
 */
export function avaliar(acao: AcaoUsavel, e: EstadoTurno | null, ficha: Personagem): Avaliacao {
  const custo = custoEfetivo(acao, ficha)
  const { foco, investidura } = ficha.recursos
  if ((custo.foco ?? 0) > foco.atual) return { pode: false, motivo: { texto: (d) => d.regras.faltaFoco, vars: { n: custo.foco ?? 0 } } }
  if ((custo.investidura ?? 0) > investidura.atual) return { pode: false, motivo: { texto: (d) => d.regras.faltaInvestidura, vars: { n: custo.investidura ?? 0 } } }
  if (acao.cargas) {
    const fab = ficha.fabriais.find((f) => f.id === acao.cargas!.idFabrial)
    if (!fab || fab.cargas.atual < acao.cargas.qtd) return { pode: false, motivo: { texto: (d) => d.regras.semCarga } }
  }
  if (!e) return { pode: true }

  if (acao.umaVezPorCena && e.usadasNaCena.includes(acao.chave)) return { pode: false, motivo: { texto: (d) => d.regras.umaVezPorCena } }
  const inconsciente = condicoesEfetivas(ficha).some((c) => c.id === 'inconsciente')
  if (inconsciente && !acao.mesmoInconsciente) return { pode: false, motivo: { texto: (d) => d.regras.inconsciente } }
  // Inspirar e Restaurar valem "mesmo Inconsciente ou impedido de agir": não pedem ▶.
  if (inconsciente) return { pode: true }

  const nomeada = !acao.repetivel && e.usadas.includes(acao.chave)
  const n = ACOES_POR_ATIVACAO[acao.ativacao]

  if (acao.ativacao === 'reacao') {
    return e.reacoes > 0 ? { pode: true } : { pode: false, motivo: { texto: (d) => d.regras.semReacao } }
  }
  if (acao.ativacao === 'especial' || acao.ativacao === 'sempre') return { pode: true }

  // ação ou ação livre
  if (e.tipo === null) {
    const custoAcoes = n ?? 0
    if (e.preparada !== null && custoAcoes <= e.preparada) return { pode: true, daPreparada: true }
    return { pode: false, motivo: { texto: (d) => d.regras.foraDoTurno } }
  }
  if (nomeada) return { pode: false, motivo: { texto: (d) => d.regras.jaUsouNoTurno } }
  if (n !== undefined && n > e.acoes) return { pode: false, motivo: { texto: (d) => d.regras.faltamAcoes, vars: { n } } }
  return { pode: true }
}

/** Desconta ▶/↻ e registra o uso. Chame só depois de `avaliar(...).pode`. `reservar` = ▶ extras do Preparar. */
export function gastar(acao: AcaoUsavel, e: EstadoTurno, ficha: Personagem, reservar = 0): EstadoTurno {
  const av = avaliar(acao, e, ficha)
  const usadasNaCena = acao.umaVezPorCena ? [...e.usadasNaCena, acao.chave] : e.usadasNaCena
  const inconsciente = condicoesEfetivas(ficha).some((c) => c.id === 'inconsciente')
  if (inconsciente) return { ...e, usadasNaCena }
  if (acao.ativacao === 'reacao') return { ...e, reacoes: e.reacoes - 1, usadasNaCena }
  if (av.daPreparada) return { ...e, preparada: null, usadasNaCena }
  const n = ACOES_POR_ATIVACAO[acao.ativacao] ?? 0
  const eh = acao.ativacao === '1acao' || acao.ativacao === '2acoes' || acao.ativacao === '3acoes' || acao.ativacao === 'livre'
  return {
    ...e,
    acoes: e.acoes - n - reservar,
    usadas: eh ? [...e.usadas, acao.chave] : e.usadas,
    usadasNaCena,
    preparada: acao.efeito === 'preparar' ? reservar : e.preparada,
  }
}

/** Uma ação do catálogo (regras/acoes.ts) vira usável. `grupo` separa nomes iguais de origens diferentes. */
export function usavelDe(grupo: string, a: EntradaAcao): AcaoUsavel {
  return {
    chave: `${grupo}:${a.nome}`,
    nome: a.nome,
    ativacao: a.ativacao,
    custo: a.custo,
    repetivel: a.repetivel,
    efeito: a.efeito,
    umaVezPorCena: a.umaVezPorCena,
    mesmoInconsciente: a.mesmoInconsciente,
  }
}
