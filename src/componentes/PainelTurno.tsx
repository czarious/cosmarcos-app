/* arquivo: PainelTurno.tsx */
import type { Personagem } from '../tipos/personagem'
import type { Turno } from '../estado/useTurno'
import { acoesNoTurno, lembretes } from '../regras/condicoes'
import { aprimorarVenceAgora } from '../regras/turno'
import { SIMBOLO_ATIVACAO, SIMBOLO_RECURSO } from '../variaveis'
import { useIdioma } from '../idioma/IdiomaContexto'

// Faixa do rastreador de turno, no topo fixo. Em combate aparece em qualquer
// aba (as ▶ que restam importam em todas); fora de combate, só a aba Ações
// oferece "Iniciar combate". A conta é de regras/turno.ts; o gasto na ficha,
// de estado/useTurno.ts — aqui só se desenha e se toca.

type Props = {
  ficha: Personagem
  turno: Turno
  /** Fora de combate a faixa só aparece onde se começa um (aba Ações). */
  naAbaAcoes: boolean
}

export default function PainelTurno({ ficha, turno, naAbaAcoes }: Props) {
  const { t, tx, tn, msg } = useIdioma()
  const e = turno.estado
  if (!e) {
    if (!naAbaAcoes) return null
    return (
      <div className="painel-turno">
        <span className="turno-info">{t(tx.turno.foraCombateUsarAcao)}</span>
        <button className="turno-botao turno-primario" onClick={turno.iniciar}>
          {t(tx.turno.iniciarCombate)}
        </button>
      </div>
    )
  }

  const pode = acoesNoTurno(ficha)
  const avisos = e.tipo !== null ? lembretes(ficha) : []

  return (
    <div className="painel-turno">
      <div className="turno-linha">
        <span className="turno-rodada">{e.rodada === 0 ? t(tx.turno.inicio) : t(tx.turno.rodadaN, { n: e.rodada })}</span>
        {e.tipo !== null && (
          <span className="turno-acoes" aria-label={t(tx.turno.nTotalAcoes, { n: e.acoes, total: e.totalAcoes })}>
            {Array.from({ length: e.totalAcoes }, (_, k) => (
              <i key={k} className={k < e.acoes ? 'turno-pip' : 'turno-pip turno-pip-gasto'}>
                {SIMBOLO_ATIVACAO['1acao']}
              </i>
            ))}
            <small>{e.tipo === 'rapido' ? tx.turno.rapido : tx.turno.lento}</small>
          </span>
        )}
        <span className={e.reacoes > 0 ? 'turno-reacao' : 'turno-reacao turno-pip-gasto'} aria-label={tn(tx.turno.reacoes, e.reacoes)}>
          {SIMBOLO_ATIVACAO.reacao}
        </span>
        {e.preparada !== null && (
          <span className="turno-preparada">
            {t(tx.turno.preparada)} {e.preparada > 0 ? SIMBOLO_ATIVACAO['1acao'].repeat(e.preparada) : SIMBOLO_ATIVACAO.livre}
          </span>
        )}
        <span className="turno-botoes">
          {e.tipo === null ? (
            <>
              <button className="turno-botao turno-primario" disabled={pode.rapido === null} onClick={() => turno.comecar('rapido')}>
                {t(tx.turno.turnoRapido)} {pode.rapido === null ? '—' : SIMBOLO_ATIVACAO['1acao'].repeat(pode.rapido)}
              </button>
              <button className="turno-botao turno-primario" onClick={() => turno.comecar('lento')}>
                {t(tx.turno.turnoLento)} {SIMBOLO_ATIVACAO['1acao'].repeat(pode.lento) || '—'}
              </button>
              <button className="turno-botao" onClick={turno.encerrarCombate}>
                {t(tx.turno.fimCombate)}
              </button>
            </>
          ) : aprimorarVenceAgora(e) ? (
            <>
              <button className="turno-botao turno-primario" disabled={ficha.recursos.investidura.atual < 1} onClick={() => turno.encerrar(true)}>
                {t(tx.turno.encerrarManterAprimorado)} ({SIMBOLO_ATIVACAO.livre} −1 {SIMBOLO_RECURSO.investidura})
              </button>
              <button className="turno-botao" onClick={() => turno.encerrar(false)}>
                {t(tx.turno.encerrarAprimoradoAcaba)}
              </button>
            </>
          ) : (
            <button className="turno-botao turno-primario" onClick={() => turno.encerrar()}>
              {t(tx.turno.encerrarTurno)}
            </button>
          )}
        </span>
      </div>

      {pode.motivos.length > 0 && e.tipo === null && <p className="turno-nota">{pode.motivos.map((m) => msg(m)).join(' · ')}</p>}
      {avisos.map((a) => (
        <p className="turno-nota" key={msg(a)}>
          {msg(a)}
        </p>
      ))}
    </div>
  )
}
