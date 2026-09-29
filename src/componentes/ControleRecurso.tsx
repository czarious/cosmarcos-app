/* arquivo: ControleRecurso.tsx */
import { useState } from 'react'
import type { Recurso } from '../tipos/personagem'
import { ICONE, ROTULO } from '../variaveis'

// Popover que abre ao tocar num recurso do cabeçalho. Duas formas de mexer:
//   − e + grandes  → ±1 (o caso comum: 1 de foco, 1 de investidura)
//   número + aplicar → dano/cura de valor qualquer (o caso do combate)
// Trava em 0 e no máximo (a trava mora no hook; aqui é só a UI).
//
// Serve a qualquer contador atual/máximo: os 3 recursos do cabeçalho e as
// cargas de fabrial. Nome, símbolo e os verbos ("Dano/Curar" ×
// "Gastar/Recarregar") vêm de quem chama — RECURSO e CARGAS no variaveis.ts.

export type RotuloContador = { nome: string; simbolo: string; diminuir: string; aumentar: string }

type Props = {
  rotulo: RotuloContador
  recurso: Recurso
  alterar: (delta: number) => void
  aoFechar: () => void
}

export default function ControleRecurso({ rotulo: rec, recurso, alterar, aoFechar }: Props) {
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
            <span className="cr-simbolo">{rec.simbolo}</span> {rec.nome}
          </span>
          <button className="cr-fechar" onClick={aoFechar} aria-label={ROTULO.fechar}>
            {ICONE.fechar}
          </button>
        </div>

        {/* valor grande + os botões − e + de ±1 */}
        <div className="cr-linha-valor">
          <button
            className="cr-passo"
            onClick={() => alterar(-1)}
            disabled={recurso.atual <= 0}
            aria-label="Menos um"
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
            aria-label="Mais um"
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
          placeholder="quantidade"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          autoFocus
        />
        <div className="cr-aplicar">
          <button className="cr-btn cr-menos" onClick={() => aplicar(-1)} disabled={n === 0}>
            − {rec.diminuir}
          </button>
          <button className="cr-btn cr-mais" onClick={() => aplicar(+1)} disabled={n === 0}>
            + {rec.aumentar}
          </button>
        </div>
      </div>
    </div>
  )
}
