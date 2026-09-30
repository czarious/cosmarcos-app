/* arquivo: condicoes.ts */

/**
 * CONDIÇÕES E LESÕES — Cap. 9 do Guia PT-BR (conferido contra a transcrição em 29/Set/2026).
 *  - As 14 condições: transcricao/09-aventurando-se/06-condicoes.md
 *  - Lesões (rolagem, duração, efeito d8): 09-dano-lesoes-e-morte.md
 *  - Ações por turno (rápido 2 ▶, lento 3 ▶, +1 ↻): 10-combate/01-ordem-de-combate.md
 *  - Taxa de movimento por Velocidade: 03-estatisticas-de-personagem/01-atributos.md
 *
 * Texto aqui é RESUMO com palavras próprias — o livro não vai pro repo
 * público. Número (penalidade, ações, faixas da rolagem) é exato.
 *
 * O que a ficha guarda é só o id + parâmetro; o que cada condição FAZ mora
 * aqui. Lesão com efeito de condição NÃO grava a condição de novo: ela entra
 * pela `condicoesEfetivas`, e some sozinha quando a lesão cura.
 */

import type { Personagem, Pericia, NomeAtributo, Condicao, Lesao, IdCondicao, EfeitoLesao, GravidadeLesao } from '../tipos/personagem'
import type { ParcelaBonus } from './calculos'
import type { Mensagem } from '../idioma/pt'
import { armaduraPesada, deflexaoTotal } from './armadura'

type DefCondicao = {
  id: IdCondicao
  nome: string
  resumo: string
  /** Valor entre colchetes que a condição carrega. */
  parametro?: 'dano' | 'atributo' | 'penalidade'
  /** Pode estar ativa mais de uma vez (cada uma resolve à parte, ou soma). */
  cumulativa: boolean
}

export const CONDICOES: DefCondicao[] = [
  { id: 'afligido', nome: 'Afligido', parametro: 'dano', cumulativa: true,
    resumo: 'Sofre o dano entre colchetes ao fim de cada turno seu (fora de combate, a cada 10 s e a cada tentativa de remover).' },
  { id: 'aprimorado', nome: 'Aprimorado', parametro: 'atributo', cumulativa: true,
    resumo: 'Um atributo sobe pelo valor entre colchetes: testes, talentos e movimento. NÃO mexe em defesas nem em Vida/Foco/Investidura máximos.' },
  { id: 'atordoado', nome: 'Atordoado', cumulativa: false,
    resumo: 'Perde reações; no seu turno ganha 2 ▶ a menos e nenhuma reação.' },
  { id: 'desorientado', nome: 'Desorientado', cumulativa: false,
    resumo: 'Sem reações; sentidos obscurecidos; desvantagem em Percepção e testes de sentidos.' },
  { id: 'determinado', nome: 'Determinado', cumulativa: false,
    resumo: 'Ao falhar um teste, pode somar uma Oportunidade ao resultado — e a condição acaba.' },
  { id: 'exausto', nome: 'Exausto', parametro: 'penalidade', cumulativa: true,
    resumo: 'Tira o valor entre colchetes de todo teste (nunca abaixo de 0). Cada descanso longo reduz 1; some no 0. Duas aplicações somam.' },
  { id: 'focado', nome: 'Focado', cumulativa: false,
    resumo: 'Habilidade que custa foco custa 1 a menos.' },
  { id: 'imobilizado', nome: 'Imobilizado', cumulativa: false,
    resumo: 'Movimento 0; não se move nem é movido por efeitos.' },
  { id: 'inconsciente', nome: 'Inconsciente', cumulativa: false,
    resumo: 'Movimento 0, cai Prostrado e larga o que segura; sem ações nem reações (exceto Inspirar Luz das Tempestades e Restaurar, se Radiante). Pode acordar no fim de um turno seu — com 0 de Vida, volta com 1.' },
  { id: 'lento', nome: 'Lento', cumulativa: false,
    resumo: 'Movimento pela metade (se ficar Lento no meio do movimento, o que resta cai à metade, arredondado pra cima).' },
  { id: 'potencializado', nome: 'Potencializado', cumulativa: false,
    resumo: 'Ao jurar um Ideal: vantagem em todos os testes e Investidura cheia no início de cada turno seu. Acaba no fim da cena.' },
  { id: 'prostrado', nome: 'Prostrado', cumulativa: false,
    resumo: 'No chão: fica Lento e corpo a corpo contra você tem vantagem. Levantar custa ▷ e tira 1,5 m do movimento até o próximo turno.' },
  { id: 'restringido', nome: 'Restringido', cumulativa: false,
    resumo: 'Movimento 0; desvantagem em todos os testes, menos os de escapar.' },
  { id: 'surpreendido', nome: 'Surpreendido', cumulativa: false,
    resumo: 'Sem reações, sem turno rápido e 1 ▶ a menos. Acaba depois do seu próximo turno.' },
]

export function defCondicao(id: IdCondicao): DefCondicao {
  return CONDICOES.find((c) => c.id === id)!
}

// ── lesões ────────────────────────────────────────────────────────────

/** Efeitos de lesão da tabela d8 — cada um vira condição, menos "uma mão" e o livre. */
export const EFEITOS_LESAO: { id: EfeitoLesao; nome: string; nomeEn: string; d8: string; condicao?: Omit<Condicao, 'uid'> }[] = [
  { id: 'exausto-1', nome: 'Exausto [−1]', nomeEn: 'Exhausted [−1]', d8: '1–2', condicao: { id: 'exausto', valor: 1 } },
  { id: 'exausto-2', nome: 'Exausto [−2]', nomeEn: 'Exhausted [−2]', d8: '3', condicao: { id: 'exausto', valor: 2 } },
  { id: 'lento', nome: 'Lento', nomeEn: 'Slowed', d8: '4–5', condicao: { id: 'lento' } },
  { id: 'desorientado', nome: 'Desorientado', nomeEn: 'Disoriented', d8: '6', condicao: { id: 'desorientado' } },
  { id: 'surpreendido', nome: 'Surpreendido', nomeEn: 'Surprised', d8: '7', condicao: { id: 'surpreendido' } },
  { id: 'uma-mao', nome: 'Só pode usar uma mão', nomeEn: 'Can only use one hand', d8: '8' },
  { id: 'outro', nome: 'Outro (combinado com o Mestre)', nomeEn: 'Other (agreed with the GM)', d8: '—' },
]

export const GRAVIDADE: Record<GravidadeLesao, { nome: string; nomeEn: string; duracao: string; duracaoEn: string; faixa: string }> = {
  superficial: { nome: 'Superficial', nomeEn: 'Shallow', duracao: 'até o próximo descanso longo', duracaoEn: 'until your next long rest', faixa: '16+' },
  leve: { nome: 'Leve', nomeEn: 'Minor', duracao: '1d6 dias', duracaoEn: '1d6 days', faixa: '6 a 15' },
  grave: { nome: 'Grave', nomeEn: 'Serious', duracao: '6d6 dias', duracaoEn: '6d6 days', faixa: '1 a 5' },
  permanente: { nome: 'Permanente', nomeEn: 'Permanent', duracao: 'só cura por meio sobrenatural', duracaoEn: 'only heals by supernatural means', faixa: '−5 a 0' },
}

/**
 * O que somar ao d20 da rolagem de lesão: deflexão da armadura e −5 por lesão
 * que já existe. Talento que mexe nisso não está aqui — o jogador soma à mão.
 */
export function modificadorRolagemLesao(ficha: Personagem): { total: number; linhas: ParcelaBonus[] } {
  // a deflexão da rolagem é a total: a da ficha + a da armadura vestida
  const linhas: ParcelaBonus[] = [...deflexaoTotal(ficha).linhas]
  const n = ficha.lesoes.length
  if (n > 0) linhas.push({ origem: { texto: (d) => d.detalhe.lesoesVezes5, vars: { n } }, valor: -5 * n })
  return { total: linhas.reduce((s, l) => s + l.valor, 0), linhas }
}

/** Total da rolagem de lesão (d20 + modificador) → gravidade. Pode ser negativo — não é teste. */
export function resultadoLesao(total: number): GravidadeLesao | 'morte' {
  if (total <= -6) return 'morte'
  if (total <= 0) return 'permanente'
  if (total <= 5) return 'grave'
  if (total <= 15) return 'leve'
  return 'superficial'
}

// ── o que está valendo agora ──────────────────────────────────────────

export type CondicaoEfetiva = Omit<Condicao, 'uid'> & { uid: string; origem: 'manual' | 'lesao' | 'armadura' }

/** Condições aplicadas à mão + as que vêm do efeito de cada lesão + Lento da armadura Desajeitada. */
export function condicoesEfetivas(ficha: Personagem): CondicaoEfetiva[] {
  const manuais: CondicaoEfetiva[] = ficha.condicoes.map((c) => ({ ...c, origem: 'manual' }))
  const deLesao: CondicaoEfetiva[] = ficha.lesoes.flatMap((l: Lesao) => {
    const c = EFEITOS_LESAO.find((e) => e.id === l.efeito)?.condicao
    return c ? [{ ...c, uid: `lesao-${l.uid}`, origem: 'lesao' as const }] : []
  })
  const pesada = armaduraPesada(ficha)
  const daArmadura: CondicaoEfetiva[] = pesada ? [{ id: 'lento', uid: `armadura-${pesada.nome}`, origem: 'armadura', nota: pesada.nome }] : []
  return [...manuais, ...deLesao, ...daArmadura]
}

function tem(efetivas: CondicaoEfetiva[], id: IdCondicao): boolean {
  return efetivas.some((c) => c.id === id)
}

/** Penalidade total de Exausto — as aplicações SOMAM. */
export function penalidadeExausto(efetivas: CondicaoEfetiva[]): number {
  return efetivas.filter((c) => c.id === 'exausto').reduce((s, c) => s + (c.valor ?? 0), 0)
}

/** Bônus de Aprimorado num atributo (vários somam). */
export function bonusAprimorado(efetivas: CondicaoEfetiva[], atributo: NomeAtributo): number {
  return efetivas.filter((c) => c.id === 'aprimorado' && c.atributo === atributo).reduce((s, c) => s + (c.valor ?? 0), 0)
}

/**
 * Onde o modificador da perícia vai ser usado. Exausto é penalidade no
 * RESULTADO DE TESTE — a rolagem de dano não é teste, então ele fica fora.
 * Aprimorado vale nos dois: o livro manda valer em tudo que deriva do atributo.
 */
export type UsoPericia = 'teste' | 'dano'

/**
 * O que as condições fazem com uma perícia: parcelas somadas ao total
 * (Aprimorado, Exausto) e vantagem/desvantagem. Pra quem soma à mão, a
 * penalidade no resultado dá no mesmo que no modificador.
 */
export function efeitoCondicoesPericia(pericia: Pericia, ficha: Personagem, uso: UsoPericia = 'teste') {
  const efetivas = condicoesEfetivas(ficha)
  const linhas: ParcelaBonus[] = []
  const aprimorado = bonusAprimorado(efetivas, pericia.atributo)
  if (aprimorado) linhas.push({ origem: 'Aprimorado', valor: aprimorado })
  const exausto = penalidadeExausto(efetivas)
  if (exausto && uso === 'teste') linhas.push({ origem: 'Exausto', valor: -exausto })

  const vantagem: string[] = []
  const desvantagem: string[] = []
  if (tem(efetivas, 'potencializado')) vantagem.push('Potencializado')
  if (tem(efetivas, 'restringido')) desvantagem.push('Restringido')
  // Desajeitada: desvantagem nos testes de Velocidade enquanto veste (07-itens/05-armaduras.md)
  if (pericia.atributo === 'velocidade' && armaduraPesada(ficha)) desvantagem.push('Desajeitada')
  if (tem(efetivas, 'desorientado') && pericia.id === 'perception') desvantagem.push('Desorientado')
  return { linhas, vantagem, desvantagem }
}

/** Taxa de movimento por Velocidade, em metros por ação (tabela do Cap. 3). */
export function movimentoPelaVelocidade(velocidade: number): number {
  if (velocidade <= 0) return 6
  if (velocidade <= 2) return 7.5
  if (velocidade <= 4) return 9
  if (velocidade <= 6) return 12
  if (velocidade <= 8) return 18
  return 24
}

/**
 * Movimento com as condições. Parte do número do Shards (que já traz bônus de
 * talento) e soma só a DIFERENÇA que o Aprimorado de Velocidade causa na
 * tabela — assim nenhum bônus de talento se perde.
 */
/** `motivos`: nomes das condições que mexeram (vazio = movimento normal). */
export function movimentoComCondicoes(ficha: Personagem): { metros: number; motivos: string[] } {
  const efetivas = condicoesEfetivas(ficha)
  const base = parseFloat(ficha.derivados.movimento.replace(',', '.')) || 0
  const vel = ficha.atributos.velocidade + ficha.atributosMod.velocidade
  const extra = bonusAprimorado(efetivas, 'velocidade')
  let metros = base + (extra ? movimentoPelaVelocidade(vel + extra) - movimentoPelaVelocidade(vel) : 0)
  const motivos: string[] = extra ? ['Aprimorado'] : []
  const zera = (['imobilizado', 'inconsciente', 'restringido'] as IdCondicao[]).find((id) => tem(efetivas, id))
  if (zera) return { metros: 0, motivos: [defCondicao(zera).nome] }
  const metade = (['lento', 'prostrado'] as IdCondicao[]).find((id) => tem(efetivas, id))
  if (metade) {
    metros = metros / 2
    motivos.push(defCondicao(metade).nome)
  }
  return { metros, motivos }
}

/** Ações e reação no próximo turno, rápido e lento (2/3 ▶ + 1 ↻, menos o que as condições tiram). */
export function acoesNoTurno(ficha: Personagem): { rapido: number | null; lento: number; reacao: boolean; motivos: Mensagem[] } {
  const efetivas = condicoesEfetivas(ficha)
  const motivos: Mensagem[] = []
  if (tem(efetivas, 'inconsciente')) return { rapido: null, lento: 0, reacao: false, motivos: [{ texto: (d) => d.regras.inconsciente }] }
  let menos = 0
  if (tem(efetivas, 'atordoado')) { menos += 2; motivos.push({ texto: (d) => d.regras.atordoadoMenos2 }) }
  if (tem(efetivas, 'surpreendido')) { menos += 1; motivos.push({ texto: (d) => d.regras.surpreendidoMenos1 }) }
  const semReacao = (['atordoado', 'desorientado', 'surpreendido'] as IdCondicao[]).filter((id) => tem(efetivas, id))
  return {
    rapido: tem(efetivas, 'surpreendido') ? null : Math.max(0, 2 - menos),
    lento: Math.max(0, 3 - menos),
    reacao: semReacao.length === 0,
    motivos,
  }
}

/** Lembretes do que a mesa costuma esquecer, pra cada condição ativa que precisa de lembrete. */
export function lembretes(ficha: Personagem): Mensagem[] {
  const efetivas = condicoesEfetivas(ficha)
  const r: Mensagem[] = []
  for (const c of efetivas.filter((x) => x.id === 'afligido')) {
    r.push(c.dano ? { texto: (d) => d.regras.fimTurnoSofra, vars: { dano: c.dano } } : { texto: (d) => d.regras.fimTurnoSofraAflicao })
  }
  if (tem(efetivas, 'focado')) r.push({ texto: (d) => d.regras.lembreteFocado })
  if (tem(efetivas, 'potencializado')) r.push({ texto: (d) => d.regras.lembretePotencializado })
  if (tem(efetivas, 'determinado')) r.push({ texto: (d) => d.regras.lembreteDeterminado })
  if (tem(efetivas, 'prostrado')) r.push({ texto: (d) => d.regras.lembreteProstrado })
  if (ficha.lesoes.some((l) => l.efeito === 'uma-mao')) r.push({ texto: (d) => d.regras.lembreteUmaMao })
  return r
}
