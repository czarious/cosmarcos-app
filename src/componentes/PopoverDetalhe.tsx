/* arquivo: PopoverDetalhe.tsx */
import type { DetalhePericia } from '../regras/calculos'

// Popover SÓ-LEITURA que abre ao tocar num número calculado (ex.: o +4 de
// acerto de um ataque) e mostra de onde vem cada parcela — mesmo visual do
// ControleRecurso (.cr-overlay/.cr-painel), reaproveitado pra detalhamento.

type Props = {
  detalhe: DetalhePericia
  aoFechar: () => void
}

export default function PopoverDetalhe({ detalhe, aoFechar }: Props) {
  return (
    <div className="cr-overlay" onClick={aoFechar}>
      <div className="cr-painel" onClick={(e) => e.stopPropagation()}>
        <div className="cr-cabeca">
          <span className="cr-titulo">{detalhe.titulo}</span>
          <button className="cr-fechar" onClick={aoFechar} aria-label="Fechar">
            ✕
          </button>
        </div>

        <ul className="detalhe-linhas">
          {detalhe.linhas.map((l, i) => (
            <li key={`${l.origem}-${i}`}>
              <span>{l.origem}</span>
              <span>
                {l.valor >= 0 ? '+' : ''}
                {l.valor}
              </span>
            </li>
          ))}
        </ul>

        <div className="detalhe-total">
          <span>Total</span>
          <span>
            {detalhe.total >= 0 ? '+' : ''}
            {detalhe.total}
          </span>
        </div>
      </div>
    </div>
  )
}
