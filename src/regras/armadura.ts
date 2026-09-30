/* arquivo: armadura.ts */
import type { Item, Personagem } from '../tipos/personagem'
import type { ParcelaBonus } from './calculos'

/**
 * ARMADURA — Cap. 7 (transcricao/07-itens/05-armaduras.md).
 *  - A deflexão que vale é a da armadura VESTIDA (uma). Com duas marcadas, vale
 *    a maior e a tela avisa — o Shards soma, o livro não.
 *  - Desajeitada [X]: Força abaixo de X → Lento enquanto veste e desvantagem
 *    nos testes de Velocidade. Traço de perito (especialidade naquela armadura)
 *    pode tirar ("perde o traço Desajeitada") ou baixar ("Desajeitada [3] em vez de [4]").
 * Armadura é item do inventário com `deflexao` (o tradutor lê do Shards).
 */

const normaliza = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

export function ehArmadura(item: Item): boolean {
  return item.deflexao !== undefined
}

export function armadurasVestidas(ficha: Personagem): Item[] {
  return ficha.itens.filter((i) => ehArmadura(i) && i.equipado)
}

/** Tem especialidade de armadura com o nome desta? Aí os traços de perito valem. */
function temPerito(ficha: Personagem, item: Item): boolean {
  return ficha.especializacoes.some((e) => e.tipo === 'armadura' && normaliza(e.nome) === normaliza(item.nome))
}

/** O X da Desajeitada que vale pra este personagem, ou `undefined` se não pesa. */
export function desajeitadaDe(ficha: Personagem, item: Item): number | undefined {
  const base = (item.tracos ?? []).map((t) => t.match(/^Desajeitada \[(\d+)\]/)).find(Boolean)
  if (!base) return undefined
  if (temPerito(ficha, item)) {
    const perito = item.tracosPerito ?? []
    if (perito.some((t) => /perde o traço Desajeitada/.test(t))) return undefined
    const menor = perito.map((t) => t.match(/Desajeitada \[(\d+)\] em vez/)).find(Boolean)
    if (menor) return Number(menor[1])
  }
  return Number(base[1])
}

/** A armadura vestida que pesa demais pra Força do personagem (Desajeitada), se houver. */
export function armaduraPesada(ficha: Personagem): Item | undefined {
  const forca = ficha.atributos.forca + ficha.atributosMod.forca
  return armadurasVestidas(ficha).find((a) => {
    const x = desajeitadaDe(ficha, a)
    return x !== undefined && forca < x
  })
}

/** Deflexão = a da ficha (base do Shards) + a da armadura vestida (a maior, se houver mais de uma). */
export function deflexaoTotal(ficha: Personagem): { total: number; linhas: ParcelaBonus[]; variasVestidas: boolean } {
  const vestidas = armadurasVestidas(ficha)
  const melhor = vestidas.reduce<Item | undefined>((m, a) => (!m || (a.deflexao ?? 0) > (m.deflexao ?? 0) ? a : m), undefined)
  const linhas: ParcelaBonus[] = [{ origem: { texto: (d) => d.geral.deflexao }, valor: ficha.deflect }]
  if (melhor) linhas.push({ origem: melhor.nome, valor: melhor.deflexao ?? 0 })
  return { total: linhas.reduce((s, l) => s + l.valor, 0), linhas, variasVestidas: vestidas.length > 1 }
}
