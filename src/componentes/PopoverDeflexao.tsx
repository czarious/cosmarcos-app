/* arquivo: PopoverDeflexao.tsx */
import type { Personagem } from '../tipos/personagem'
import PopoverDetalhe from './PopoverDetalhe'
import { deflexaoTotal } from '../regras/armadura'
import { useIdioma } from '../idioma/IdiomaContexto'
import ListaLinhas from './ListaLinhas'

// A deflexão aberta: de onde vem (a da ficha + a armadura vestida) e como se
// usa no dano. Abre pelo escudinho da Vida no cabeçalho e pelo número na aba
// Principal. Regra: transcricao/03-estatisticas-de-personagem/02-defesas-e-deflect.md.

export default function PopoverDeflexao({ ficha, aoFechar }: { ficha: Personagem; aoFechar: () => void }) {
  const { t, tx } = useIdioma()
  const defl = deflexaoTotal(ficha)
  // o exemplo do livro como conta, no mesmo formato das parcelas de cima
  const nota = (
    <>
      <ListaLinhas itens={[t(tx.geral.deflexaoDesconta), t(tx.geral.deflexaoPassaInteiro), t(tx.geral.deflexaoNoEditor), defl.variasVestidas && tx.principal.duasArmaduras].filter(Boolean)} />
      <p className="detalhe-exemplo">{tx.geral.exemplo}</p>
      <ul className="detalhe-linhas detalhe-conta">
        <li>
          <span>{tx.geral.exemploDano}</span>
          <span>5</span>
        </li>
        <li>
          <span>{tx.geral.deflexao}</span>
          <span>−2</span>
        </li>
        <li className="detalhe-conta-total">
          <span>{tx.geral.exemploVidaPerdida}</span>
          <span>3</span>
        </li>
      </ul>
    </>
  )
  return <PopoverDetalhe detalhe={{ titulo: tx.geral.deflexao, linhas: defl.linhas, total: defl.total }} nota={nota} aoFechar={aoFechar} />
}
