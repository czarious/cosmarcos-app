/* arquivo: ControleRecurso.tsx */
import { useState } from 'react'
import type { Recurso } from '../tipos/personagem'
import { ICONE, SIMBOLO_RECURSO, VERBOS_RECURSO } from '../variaveis'
import { useIdioma } from '../idioma/IdiomaContexto'

// Popover que abre ao tocar num recurso do cabeçalho. Duas formas de mexer:
//   − e + grandes  → ±1 (o caso comum: 1 de foco, 1 de investidura)
//   número + aplicar → dano/cura de valor qualquer (o caso do combate)
// Trava em 0 e no máximo (a trava mora no hook; aqui é só a UI).
//
// Serve a qualquer contador atual/máximo: os 3 recursos do cabeçalho e as
// cargas de fabrial. Quem chama diz QUAL é; o símbolo e os verbos ("Dano/Curar"
// × "Gastar/Recarregar") saem de variaveis.ts, a palavra, do idioma.

export type Contador = keyof typeof VERBOS_RECURSO

type Props = {
  qual: Contador
  /** Complemento do título — o nome do fabrial, nas cargas. */
  de?: string
  recurso: Recurso
  alterar: (delta: number) => void
  aoFechar: () => void
}

export default function ControleRecurso({ qual, de, recurso, alterar, aoFechar }: Props) {
  const { t, tx } = useIdioma()
  const [diminuir, aumentar] = VERBOS_RECURSO[qual]
  const [valor, setValor] = useState('')

  const n = Math.abs(parseInt(valor, 10)) || 0

  function aplicar(sinal: -1 | 1) {
    if (n > 0) alterar(sinal * n)
    setValor('')
  }

  return (
    // fundo escurecido: toca fora → fecha
    <div className="cr-overlay" onClick={aoFechar}>
      <div className="cr-painel" onClick={(e) => e.stopPropagation()}>
        <div className="cr-cabeca">
          <span className="cr-titulo">
            <span className="cr-simbolo">{SIMBOLO_RECURSO[qual]}</span> {tx.recursos[qual]}
            {de && ` — ${de}`}
          </span>
          <button className="cr-fechar" onClick={aoFechar} aria-label={tx.geral.fechar}>
            {ICONE.fechar}
          </button>
        </div>

        {/* valor grande + os botões − e + de ±1 */}
        <div className="cr-linha-valor">
          <button
            className="cr-passo"
            onClick={() => alterar(-1)}
            disabled={recurso.atual <= 0}
            aria-label={t(tx.recurso.menos)}
          >
            −
          </button>
          <div className="cr-valor">
            <span className="cr-atual">{recurso.atual}</span>
            <span className="cr-max">/ {recurso.max}</span>
          </div>
          <button
            className="cr-passo"
            onClick={() => alterar(+1)}
            disabled={recurso.atual >= recurso.max}
            aria-label={t(tx.recurso.mais)}
          >
            +
          </button>
        </div>

        {/* número + aplicar como dano/cura */}
        <input
          className="cr-input"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder={t(tx.recurso.quantidade)}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          autoFocus
        />
        <div className="cr-aplicar">
          <button className="cr-btn cr-menos" onClick={() => aplicar(-1)} disabled={n === 0}>
            − {tx.recursos[diminuir]}
          </button>
          <button className="cr-btn cr-mais" onClick={() => aplicar(+1)} disabled={n === 0}>
            + {tx.recursos[aumentar]}
          </button>
        </div>
      </div>
    </div>
  )
}
