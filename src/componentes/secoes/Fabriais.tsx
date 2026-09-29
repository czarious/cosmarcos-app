/* arquivo: Fabriais.tsx */
import { useState } from 'react'
import type { Fabrial, Personagem } from '../../tipos/personagem'
import {
  RECARGA,
  QUALIDADE,
  fabrialPadrao,
  efeitoUnico,
  descreverOpcao,
  avisosFabrial,
  usosDoFabrial,
} from '../../regras/fabriais'
import { CARGAS, RECURSO } from '../../variaveis'
import ControleRecurso from '../ControleRecurso'
import FormularioFabrial from '../FormularioFabrial'

// Aba Fabriais (item 3.2) — um cartão por fabrial: cargas com o mesmo
// popover de ± dos recursos, recarga pelas regras do livro (descanso curto
// com Investidura; grantormenta enche tudo), e o que o efeito, os
// aprimoramentos e os revezes fazem. "+ Novo" e ✏️ abrem o montador.

type Props = {
  ficha: Personagem
  alterarCargas: (id: string, delta: number) => void
  recarregarTodos: () => void
  recarregarComInvestidura: (id: string) => void
  salvarFabrial: (f: Fabrial) => void
  removerFabrial: (id: string) => void
}

function CartaoFabrial({ f, ficha, props, aoEditar }: { f: Fabrial; ficha: Personagem; props: Props; aoEditar: () => void }) {
  const [recolhido, setRecolhido] = useState(false)
  const [cargasAbertas, setCargasAbertas] = useState(false)
  const padrao = f.tipo === 'padrao' ? fabrialPadrao(f.modelo) : undefined
  const efeito = f.tipo === 'unico' ? efeitoUnico(f.modelo) : undefined
  const avisos = avisosFabrial(f, ficha)
  const investidura = ficha.recursos.investidura
  const cheio = f.cargas.atual >= f.cargas.max
  const ilimitado = padrao?.cargas === null

  const etiqueta =
    f.tipo === 'padrao'
      ? 'Padrão'
      : [efeito ? `Patamar ${efeito.patamar}` : 'Único', f.qualidade && QUALIDADE[f.qualidade].nome].filter(Boolean).join(' · ')

  return (
    <li className={`anotacao fab-cartao${recolhido ? ' anotacao-recolhida' : ''}`}>
      <div className="anotacao-cabeca fab-cabeca">
        <button className="fab-titulo-botao" onClick={() => setRecolhido(!recolhido)}>
          <span className="anotacao-seta">{recolhido ? '▸' : '▾'}</span>
          <span className="anotacao-titulo">
            {f.nome}
            <i className="fab-etiqueta">{etiqueta}</i>
          </span>
        </button>
        {!ilimitado && (
          <button className="fab-cargas-botao" onClick={() => setCargasAbertas(true)} aria-label={`Cargas de ${f.nome}`}>
            {CARGAS.simbolo} {f.cargas.atual}
            <small>/{f.cargas.max}</small>
          </button>
        )}
      </div>

      {!recolhido && (
        <div className="anotacao-conteudo fab-corpo">
          {padrao && (
            <>
              <p>{padrao.resumo}</p>
              <p className="fab-regra">Gasto: {padrao.gasto}</p>
            </>
          )}
          {efeito && (
            <p>
              {efeito.acao && <b>{efeito.acao} </b>}
              {efeito.resumo}
            </p>
          )}

          {f.aprimoramentos.length > 0 && (
            <div className="fab-lista">
              <h4>Aprimoramentos</h4>
              <ul>
                {f.aprimoramentos.map((id) => {
                  const d = descreverOpcao(id, efeito, 'aprimoramento')
                  return (
                    <li key={id}>
                      <b>{d.nome}</b>
                      {d.resumo && <> — {d.resumo}</>}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          {f.revezes.length > 0 && (
            <div className="fab-lista fab-lista-reves">
              <h4>Revezes</h4>
              <ul>
                {f.revezes.map((id) => {
                  const d = descreverOpcao(id, efeito, 'reves')
                  return (
                    <li key={id}>
                      <b>{d.nome}</b>
                      {d.resumo && <> — {d.resumo}</>}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {(f.gema || f.material) && (
            <p className="fab-regra">{[f.gema && `Gema: ${f.gema}`, f.material && `Material: ${f.material}`].filter(Boolean).join(' · ')}</p>
          )}
          {f.notas && <p className="fab-notas">{f.notas}</p>}

          {avisos.length > 0 && (
            <ul className="fab-avisos">
              {avisos.map((a) => (
                <li key={a}>⚠️ {a}</li>
              ))}
            </ul>
          )}

          <div className="fab-botoes">
            {usosDoFabrial(f).map((u) => (
              <button key={u.rotulo} className="cr-btn cr-menos" disabled={f.cargas.atual < u.custo} onClick={() => props.alterarCargas(f.id, -u.custo)}>
                {u.rotulo} (−{u.custo} {CARGAS.simbolo})
              </button>
            ))}
            {!ilimitado && (
              <button
                className="cr-btn cr-mais"
                disabled={cheio || investidura.atual <= 0}
                onClick={() => props.recarregarComInvestidura(f.id)}
                title={RECARGA.descansoCurto}
              >
                +1 {CARGAS.simbolo} com Investidura ({RECURSO.investidura.simbolo} {investidura.atual})
              </button>
            )}
          </div>
          <div className="fab-botoes fab-botoes-edicao">
            <button className="anotacao-botao" onClick={aoEditar} aria-label={`Editar ${f.nome}`}>
              ✏️ Editar
            </button>
            <button className="anotacao-botao" onClick={() => props.removerFabrial(f.id)} aria-label={`Excluir ${f.nome}`}>
              🗑️ Excluir
            </button>
          </div>
        </div>
      )}

      {cargasAbertas && (
        <ControleRecurso
          rotulo={{ ...CARGAS, nome: `${CARGAS.nome} — ${f.nome}` }}
          recurso={f.cargas}
          alterar={(delta) => props.alterarCargas(f.id, delta)}
          aoFechar={() => setCargasAbertas(false)}
        />
      )}
    </li>
  )
}

export default function Fabriais(props: Props) {
  const { ficha } = props
  const [editando, setEditando] = useState<Fabrial | null>(null)
  const [criando, setCriando] = useState(false)

  return (
    <div className="secao fabriais">
      <div className="fab-topo">
        <button className="botao-gerenciar" onClick={() => setCriando(true)}>
          + Novo Fabrial
        </button>
        <button className="botao-gerenciar" onClick={props.recarregarTodos} title={RECARGA.grantormenta}>
          🌩️ Grantormenta
        </button>
      </div>
      <p className="fab-regra">
        {RECARGA.descansoCurto} {RECARGA.grantormenta}
      </p>

      {ficha.fabriais.length === 0 ? (
        <p className="proximo">Nenhum fabrial — toque em "+ Novo Fabrial".</p>
      ) : (
        <ul className="lista-anotacoes">
          {ficha.fabriais.map((f) => (
            <CartaoFabrial key={f.id} f={f} ficha={ficha} props={props} aoEditar={() => setEditando(f)} />
          ))}
        </ul>
      )}

      {(criando || editando) && (
        <FormularioFabrial
          ficha={ficha}
          inicial={editando ?? undefined}
          aoSalvar={props.salvarFabrial}
          aoFechar={() => {
            setCriando(false)
            setEditando(null)
          }}
        />
      )}
    </div>
  )
}
