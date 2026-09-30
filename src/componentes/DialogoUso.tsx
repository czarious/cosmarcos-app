/* arquivo: DialogoUso.tsx */
import { useState } from 'react'
import type { Personagem } from '../tipos/personagem'
import type { AcaoUsavel, EstadoTurno } from '../regras/turno'
import type { ExtraUso } from '../estado/useTurno'
import { patamarPorNivel } from '../regras/pericias'
import { ICONE, SIMBOLO_ATIVACAO } from '../variaveis'
import { useIdioma } from '../idioma/IdiomaContexto'

// A pergunta antes de usar a ação que depende do dado rolado na mão
// (premissas.md → "O dado é rolado na mão"): Restaurar, Recuperar, e quantas
// ▶ o Preparar reserva. Cancelar não gasta nada — o custo só sai no "Usar".
// Reaproveita o visual do ControleRecurso (.cr-*).

type Props = {
  acao: AcaoUsavel
  ficha: Personagem
  estado: EstadoTurno | null
  aoUsar: (extra: ExtraUso) => void
  aoFechar: () => void
}

export default function DialogoUso({ acao, ficha, estado, aoUsar, aoFechar }: Props) {
  const { t, tx, nome } = useIdioma()
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const patamar = patamarPorNivel(ficha.meta.nivel)
  // Preparar: 1 ▶ dele + as da ação escolhida, dentro do que sobrou no turno
  const maxReservar = Math.max(0, (estado?.acoes ?? 0) - 1)

  return (
    <div className="cr-overlay" onClick={aoFechar}>
      <div className="cr-painel" onClick={(ev) => ev.stopPropagation()}>
        <div className="cr-cabeca">
          <span className="cr-titulo">{nome(acao.nome)}</span>
          <button className="cr-fechar" onClick={aoFechar} aria-label={tx.geral.fechar}>
            {ICONE.fechar}
          </button>
        </div>

        {acao.efeito === 'restaurar' && (
          <>
            <p className="dialogo-texto">{t(tx.dialogoUso.role1d6DigiteApp, { n: patamar })}</p>
            <input className="cr-input" type="number" min={1} max={6} inputMode="numeric" value={a} onChange={(e) => setA(e.target.value)} placeholder="1d6" aria-label={t(tx.dialogoUso.resultado1d6)} />
            <div className="cr-aplicar">
              <button className="cr-btn cr-mais" disabled={!a} onClick={() => aoUsar({ d6: Number(a) || 0 })}>
                {a ? t(tx.dialogoUso.curarN, { n: Number(a) + patamar }) : t(tx.recursos.curar)}
              </button>
            </div>
          </>
        )}

        {acao.efeito === 'recuperar' && (
          <>
            <p className="dialogo-texto">
              {t(tx.dialogoUso.roleDadoRecuperacaoDado, { dado: ficha.derivados.dadoRecuperacao })}
            </p>
            <div className="dialogo-dupla">
              <label>
                {tx.dialogoUso.vidaMais}<input className="cr-input" type="number" min={0} inputMode="numeric" value={a} onChange={(e) => setA(e.target.value)} />
              </label>
              <label>
                {tx.dialogoUso.focoMais}<input className="cr-input" type="number" min={0} inputMode="numeric" value={b} onChange={(e) => setB(e.target.value)} />
              </label>
            </div>
            <div className="cr-aplicar">
              <button className="cr-btn cr-mais" disabled={!a && !b} onClick={() => aoUsar({ vida: Number(a) || 0, foco: Number(b) || 0 })}>
                {t(tx.dialogoUso.recuperar)}
              </button>
            </div>
          </>
        )}

        {acao.efeito === 'preparar' && (
          <>
            <p className="dialogo-texto">
              {t(tx.dialogoUso.quantasSimboloCustaAcao, {
                simbolo: SIMBOLO_ATIVACAO['1acao'],
              })}
            </p>
            <div className="cr-aplicar dialogo-opcoes">
              {Array.from({ length: maxReservar + 1 }, (_, n) => (
                <button key={n} className="cr-btn" onClick={() => aoUsar({ reservar: n })}>
                  {n === 0 ? `${t(tx.dialogoUso.livre)} ${SIMBOLO_ATIVACAO.livre}` : SIMBOLO_ATIVACAO['1acao'].repeat(n)}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/** Essas ações perguntam antes de gastar. */
export function precisaDialogo(acao: AcaoUsavel): boolean {
  return acao.efeito === 'restaurar' || acao.efeito === 'recuperar' || acao.efeito === 'preparar'
}
