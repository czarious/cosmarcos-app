/* arquivo: PainelTurno.tsx */
import { useState } from 'react'
import type { Personagem } from '../tipos/personagem'
import type { Turno } from '../estado/useTurno'
import { acoesNoTurno, lembretes } from '../regras/condicoes'
import { aprimorarVenceAgora } from '../regras/turno'
import { ICONE, SIMBOLO_ATIVACAO, SIMBOLO_RECURSO } from '../variaveis'
import { useIdioma } from '../idioma/IdiomaContexto'

// Faixa do rastreador de turno, no topo fixo. Em combate aparece em qualquer
// aba (as ▶ que restam importam em todas). Fora de combate, "Iniciar combate"
// mora DENTRO da aba Ações (IniciarCombate): no topo, mudaria a altura dele a
// cada arrasto de aba. A conta é de regras/turno.ts; o gasto na ficha,
// de estado/useTurno.ts — aqui só se desenha e se toca.
// Minimizável: o ▴ ou um toque no fundo encolhe pra uma linha (rodada, ▶, ↻); tocar nela abre de novo.
// O app lembra a escolha neste aparelho.

const CHAVE_MINIMIZADO = 'cosmarcos:turno-minimizado'

/** Minimizado ou não, lembrado no aparelho — aba privada ou storage bloqueado só esquece. */
function useMinimizado(): [boolean, (v: boolean) => void] {
  const [valor, setValor] = useState(() => {
    try {
      return localStorage.getItem(CHAVE_MINIMIZADO) === '1'
    } catch {
      return false
    }
  })
  const mudar = (v: boolean) => {
    setValor(v)
    try {
      localStorage.setItem(CHAVE_MINIMIZADO, v ? '1' : '0')
    } catch {
      // só não lembra
    }
  }
  return [valor, mudar]
}

type Props = {
  ficha: Personagem
  turno: Turno
}

/** Fora de combate, no alto da aba Ações. */
export function IniciarCombate({ turno }: Pick<Props, 'turno'>) {
  const { t, tx } = useIdioma()
  if (turno.estado) return null
  return (
    <div className="painel-turno iniciar-combate">
      <div className="turno-linha">
        <span className="turno-info">{t(tx.turno.foraCombateUsarAcao)}</span>
        <span className="turno-botoes">
          <button className="turno-botao turno-primario" onClick={turno.iniciar}>
            {t(tx.turno.iniciarCombate)}
          </button>
        </span>
      </div>
    </div>
  )
}

export default function PainelTurno({ ficha, turno }: Props) {
  const { t, tx, tn, msg } = useIdioma()
  const [minimizado, setMinimizado] = useMinimizado()
  const e = turno.estado
  const temPlano = turno.plano.length > 0 || turno.podeDesfazer
  if (!e) {
    if (!temPlano) return null
    return (
      <div className="painel-turno">
        <PlanoDoTurno ficha={ficha} turno={turno} />
      </div>
    )
  }
  /** ▶ que sobram se o plano for confirmado — as do meio são as planejadas. */
  const sobram = turno.simulacao?.estado?.acoes ?? e.acoes

  const pode = acoesNoTurno(ficha)
  const avisos = e.tipo !== null ? lembretes(ficha) : []

  // rodada · ▶ · ↻ · preparada — a mesma situação aberta ou minimizada
  const situacao = (
    <>
      <span className="turno-rodada">{e.rodada === 0 ? t(tx.turno.inicio) : t(tx.turno.rodadaN, { n: e.rodada })}</span>
      {e.tipo !== null && (
        <span className="turno-acoes" aria-label={t(tx.turno.nTotalAcoes, { n: e.acoes, total: e.totalAcoes })}>
          {Array.from({ length: e.totalAcoes }, (_, k) => (
            <i key={k} className={k < sobram ? 'turno-pip' : k < e.acoes ? 'turno-pip turno-pip-plano' : 'turno-pip turno-pip-gasto'}>
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
    </>
  )

  if (minimizado) {
    return (
      <button className="painel-turno turno-mini" onClick={() => setMinimizado(false)} aria-expanded={false} aria-label={t(tx.turno.abrirTurno)}>
        {situacao}
        <span className="turno-alternar" aria-hidden>
          {ICONE.abrir}
        </span>
      </button>
    )
  }

  return (
    // tocar no fundo da faixa (fora de botão e campo) também minimiza
    <div className="painel-turno turno-aberto" onClick={(ev) => !(ev.target as Element).closest('button, input, label, a') && setMinimizado(true)}>
      <div className="turno-linha">
        {situacao}
        <span className="turno-botoes">
          {e.tipo === null ? (
            // sair do combate é raro: discreto, no canto — a escolha do turno vem na linha de baixo
            <button className="turno-discreto" onClick={turno.encerrarCombate}>
              {t(tx.turno.fimCombate)}
            </button>
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
            <button className="turno-botao turno-primario" disabled={turno.plano.length > 0} onClick={() => turno.encerrar()}>
              {t(tx.turno.encerrarTurno)}
            </button>
          )}
          <button className="turno-alternar" onClick={() => setMinimizado(true)} aria-expanded aria-label={t(tx.turno.minimizarTurno)}>
            {ICONE.recolher}
          </button>
        </span>
      </div>

      {/* início do turno: rápido ou lento, lado a lado e do mesmo tamanho */}
      {e.tipo === null && (
        <div className="turno-escolha">
          <button className="turno-botao turno-primario" disabled={pode.rapido === null} onClick={() => turno.comecar('rapido')}>
            {t(tx.turno.turnoRapido)} <span className="botao-simbolo">{pode.rapido === null ? '—' : SIMBOLO_ATIVACAO['1acao'].repeat(pode.rapido)}</span>
          </button>
          <button className="turno-botao turno-primario" onClick={() => turno.comecar('lento')}>
            {t(tx.turno.turnoLento)} <span className="botao-simbolo">{SIMBOLO_ATIVACAO['1acao'].repeat(pode.lento) || '—'}</span>
          </button>
        </div>
      )}

      <PlanoDoTurno ficha={ficha} turno={turno} />
      {turno.plano.length > 0 && e.tipo !== null && <p className="turno-nota">{tx.turno.planoPendente}</p>}
      {pode.motivos.length > 0 && e.tipo === null && <p className="turno-nota">{pode.motivos.map((m) => msg(m)).join(' · ')}</p>}
      {avisos.map((a) => (
        <p className="turno-nota" key={msg(a)}>
          {msg(a)}
        </p>
      ))}
    </div>
  )
}

/**
 * O plano do turno: o que foi escolhido e ainda não gastou nada, com ✕ pra
 * tirar, o custo somado, Confirmar e Limpar — e, depois de confirmar,
 * Desfazer. A conta é de regras/turno.ts → simularPlano.
 */
function PlanoDoTurno({ ficha, turno }: Pick<Props, 'ficha' | 'turno'>) {
  const { t, tx, nome } = useIdioma()
  if (turno.plano.length === 0) {
    return turno.podeDesfazer ? (
      <div className="turno-linha">
        <span className="turno-botoes">
          <button className="turno-botao" onClick={turno.desfazer}>
            ↶ {tx.turno.desfazer}
          </button>
        </span>
      </div>
    ) : null
  }
  const depois = turno.simulacao?.ficha ?? ficha
  const cargas = ficha.fabriais.reduce((s, f, i) => s + f.cargas.atual - (depois.fabriais[i]?.cargas.atual ?? f.cargas.atual), 0)
  const custo = [
    [ficha.recursos.foco.atual - depois.recursos.foco.atual, SIMBOLO_RECURSO.foco],
    [ficha.recursos.investidura.atual - depois.recursos.investidura.atual, SIMBOLO_RECURSO.investidura],
    [cargas, SIMBOLO_RECURSO.cargas],
  ]
    .filter(([n]) => (n as number) > 0)
    .map(([n, s]) => `−${n} ${s}`)
    .join(' ')
  return (
    <div className="turno-plano">
      <span className="turno-rodada">{tx.turno.plano}</span>
      <ul className="turno-plano-lista">
        {turno.plano.map((it, i) => {
          const rotulo = it.acao.alvo ? `${nome(it.acao.nome)} · ${nome(it.acao.alvo)}` : nome(it.acao.nome)
          return (
            <li key={i} className="chip turno-plano-item">
              {rotulo}
              <button className="turno-plano-x" onClick={() => turno.remover(i)} aria-label={t(tx.turno.removerDoPlano, { nome: rotulo })}>
                {ICONE.fechar}
              </button>
            </li>
          )
        })}
      </ul>
      <div className="turno-linha">
        {custo && <span className="turno-info">{custo}</span>}
        <span className="turno-botoes">
          <button className="turno-botao" onClick={turno.limpar}>
            {tx.turno.limpar}
          </button>
          <button className="turno-botao turno-primario" onClick={turno.confirmar}>
            ✓ {tx.turno.confirmar}
          </button>
        </span>
      </div>
    </div>
  )
}
