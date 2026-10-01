/* arquivo: PopoverDetalhe.tsx */
import type { DetalhePericia } from '../regras/calculos'
import { ICONE } from '../variaveis'
import { useIdioma } from '../idioma/IdiomaContexto'

// Popover SÓ-LEITURA que abre ao tocar num número calculado (ex.: o +4 de
// acerto de um ataque) e mostra de onde vem cada parcela — mesmo visual do
// ControleRecurso (.cr-overlay/.cr-painel), reaproveitado pra detalhamento.

type Props = {
  detalhe: DetalhePericia
  aoFechar: () => void
  /** Como usar o número — um parágrafo embaixo do total (a deflexão usa). */
  nota?: string
}

export default function PopoverDetalhe({ detalhe, aoFechar, nota }: Props) {
  const { tx, nome, rot } = useIdioma()
  return (
    <div className="cr-overlay" onClick={aoFechar}>
      <div className="cr-painel" onClick={(e) => e.stopPropagation()}>
        <div className="cr-cabeca">
          <span className="cr-titulo">{nome(detalhe.titulo)}</span>
          <button className="cr-fechar" onClick={aoFechar} aria-label={tx.geral.fechar}>
            {ICONE.fechar}
          </button>
        </div>

        <ul className="detalhe-linhas">
          {detalhe.linhas.map((l, i) => (
            <li key={`${l.origem}-${i}`}>
              <span>{rot(l.origem)}</span>
              <span>
                {l.valor >= 0 ? '+' : ''}
                {l.valor}
              </span>
            </li>
          ))}
        </ul>

        <div className="detalhe-total">
          <span>{tx.geral.total}</span>
          <span>
            {detalhe.total >= 0 ? '+' : ''}
            {detalhe.total}
          </span>
        </div>
        {nota && <p className="detalhe-nota">{nota}</p>}
      </div>
    </div>
  )
}
