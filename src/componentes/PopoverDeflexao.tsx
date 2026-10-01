/* arquivo: PopoverDeflexao.tsx */
import type { Personagem } from '../tipos/personagem'
import PopoverDetalhe from './PopoverDetalhe'
import { deflexaoTotal } from '../regras/armadura'
import { useIdioma } from '../idioma/IdiomaContexto'

// A deflexão aberta: de onde vem (a da ficha + a armadura vestida) e como se
// usa no dano. Abre pelo escudinho da Vida no cabeçalho e pelo número na aba
// Principal. Regra: transcricao/03-estatisticas-de-personagem/02-defesas-e-deflect.md.

export default function PopoverDeflexao({ ficha, aoFechar }: { ficha: Personagem; aoFechar: () => void }) {
  const { t, tx } = useIdioma()
  const defl = deflexaoTotal(ficha)
  const nota = [t(tx.geral.deflexaoComoUsa), defl.variasVestidas ? tx.principal.duasArmaduras : ''].filter(Boolean).join(' ')
  return <PopoverDetalhe detalhe={{ titulo: tx.geral.deflexao, linhas: defl.linhas, total: defl.total }} nota={nota} aoFechar={aoFechar} />
}
