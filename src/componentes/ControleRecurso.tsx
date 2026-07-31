/* arquivo: ControleRecurso.tsx */
import { useState } from 'react'
import type { Recurso } from '../tipos/personagem'
import type { NomeRecurso } from '../estado/usePersonagem'

// Popover que abre ao tocar num recurso do cabeçalho. Duas formas de mexer:
//   ▲▼ grandes  → ±1 (o caso comum: 1 de foco, 1 de investidura)
//   número + aplicar → dano/cura de valor qualquer (o caso do combate)
// Trava em 0 e no máximo (a trava mora no hook; aqui é só a UI).

type Config = { simbolo: string; nome: string; menos: string; mais: string }

const CONFIG: Record<NomeRecurso, Config> = {
  vida: { simbolo: '♥', nome: 'Vida', menos: 'Dano', mais: 'Curar' },
  foco: { simbolo: '◆', nome: 'Foco', menos: 'Gastar', mais: 'Recuperar' },
  investidura: { simbolo: '✦', nome: 'Investidura', menos: 'Gastar', mais: 'Recuperar' },
}

type Props = {
  qual: NomeRecurso
  recurso: Recurso
  alterar: (qual: NomeRecurso, delta: number) => void
  aoFechar: () => void
}

export default function ControleRecurso({ qual, recurso, alterar, aoFechar }: Props) {
  const cfg = CONFIG[qual]
  const [valor, setValor] = useState('')

  const n = Math.abs(parseInt(valor, 10)) || 0

  function aplicar(sinal: -1 | 1) {
    if (n > 0) alterar(qual, sinal * n)
    setValor('')
  }

  return (
    // fundo escurecido: toca fora → fecha
    <div className="cr-overlay" onClick={aoFechar}>
      <div className="cr-painel" onClick={(e) => e.stopPropagation()}>
        <div className="cr-cabeca">
          <span className="cr-titulo">
            <span className="cr-simbolo">{cfg.simbolo}</span> {cfg.nome}
          </span>
          <button className="cr-fechar" onClick={aoFechar} aria-label="Fechar">
            ✕
          </button>
        </div>

        {/* valor grande + ▲▼ de ±1 */}
        <div className="cr-linha-valor">
          <button
            className="cr-passo"
            onClick={() => alterar(qual, -1)}
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
            onClick={() => alterar(qual, +1)}
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
            − {cfg.menos}
          </button>
          <button className="cr-btn cr-mais" onClick={() => aplicar(+1)} disabled={n === 0}>
            + {cfg.mais}
          </button>
        </div>
      </div>
    </div>
  )
}
