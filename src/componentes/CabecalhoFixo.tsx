/* arquivo: CabecalhoFixo.tsx */
import { useState } from 'react'
import type { Personagem, NomeAtributo } from '../tipos/personagem'
import type { NomeRecurso } from '../estado/usePersonagem'
import ControleRecurso from './ControleRecurso'
import { ATRIBUTO, RECURSO, GRUPOS_FICHA } from '../variaveis'
import { condicoesEfetivas, movimentoComCondicoes } from '../regras/condicoes'
import { rotuloCondicao, formatarMetros } from './secoes/Condicoes'

// O cabeçalho fixo TOTAL: identidade reduzida + os 3 grupos da ficha oficial
// lado a lado. Cada grupo: [atributo] [DEFESA no meio] [atributo] + recurso.
// Item 1.2/1.3: o recurso é um BOTÃO — toca e abre o ControleRecurso (dano/cura).
//
// Rótulos e símbolos vêm do variaveis.ts: o ControleRecurso mostra os mesmos,
// e antes disso cada um tinha a própria cópia.

type Props = {
  ficha: Personagem
  alterarRecurso: (qual: NomeRecurso, delta: number) => void
  /** Toque na faixa de condições → vai pra aba Condições. */
  aoVerCondicoes: () => void
}

export default function CabecalhoFixo({ ficha, alterarRecurso, aoVerCondicoes }: Props) {
  const { meta, atributos, atributosMod, defesas, recursos, deflect, derivados } = ficha
  const efetivo = (a: NomeAtributo) => atributos[a] + atributosMod[a]
  const [aberto, setAberto] = useState<NomeRecurso | null>(null)
  const efetivas = condicoesEfetivas(ficha)
  const mov = movimentoComCondicoes(ficha)

  return (
    <header className="cabecalho-fixo">
      <div className="cf-identidade">
        <span className="cf-nome">{meta.nome}</span>
        <span className="cf-linha">
          {meta.ancestralidade} · {meta.trilhaHeroica}
          {meta.trilhaRadiante ? ` / ${meta.trilhaRadiante}` : ''} · nv {meta.nivel}
        </span>
      </div>

      <div className="cf-grupos">
        {GRUPOS_FICHA.map((g) => {
          const r = recursos[g.recurso]
          const vazio = r.max === 0
          const rec = RECURSO[g.recurso]
          return (
            <div className="cf-grupo" key={g.defesa}>
              <span className="cfg-titulo">{g.nome}</span>
              <div className="cfg-linha-atrib">
                <span className="cfg-atrib">
                  <i>{ATRIBUTO[g.atribs[0]].abrev}</i>
                  <b>{efetivo(g.atribs[0])}</b>
                </span>
                <span className="cfg-defesa" title={`Defesa ${g.nome}`}>
                  <i>DEF</i>
                  <b>{defesas[g.defesa]}</b>
                </span>
                <span className="cfg-atrib">
                  <i>{ATRIBUTO[g.atribs[1]].abrev}</i>
                  <b>{efetivo(g.atribs[1])}</b>
                </span>
              </div>
              {/* o recurso agora é BOTÃO — toca e abre o controle (item 1.2/1.3) */}
              <button
                className={`cfg-recurso${vazio ? ' cf-vazio' : ''}`}
                onClick={() => setAberto(g.recurso)}
                title={`Alterar ${rec.nome}`}
              >
                <span className="cf-simbolo">{rec.simbolo}</span>
                <span className="cfg-recurso-corpo">
                  <i>{rec.abrev}</i>
                  <span className="cf-valor">
                    {r.atual}
                    <span className="cf-max">/{r.max}</span>
                  </span>
                </span>
                {g.recurso === 'vida' && (
                  <span className="cfg-deflect" title="Deflect">
                    <i>DEFL</i>
                    <b>{deflect}</b>
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>

      <div className="cf-derivados">
        {/* Movimento já com as condições (Lento, Imobilizado…): é o número que se usa AGORA */}
        <span className={mov.motivo ? 'cf-alterado' : undefined} title={mov.motivo}>
          <i>Movimento</i> <b>{mov.motivo ? `${formatarMetros(mov.metros)}*` : derivados.movimento}</b>
        </span>
        <span><i>Recuperação</i> <b>{derivados.dadoRecuperacao}</b></span>
        <span><i>Sentidos</i> <b>{derivados.alcanceSentidos}</b></span>
      </div>

      {/* Condição ativa aparece em QUALQUER aba — muda a jogada no meio do combate */}
      {efetivas.length > 0 && (
        <button className="cf-condicoes" onClick={aoVerCondicoes} aria-label="Ver condições ativas">
          {efetivas.map((c) => (
            <span key={c.uid} className="cf-condicao">
              {rotuloCondicao(c)}
            </span>
          ))}
        </button>
      )}

      {aberto && (
        <ControleRecurso
          rotulo={RECURSO[aberto]}
          recurso={recursos[aberto]}
          alterar={(delta) => alterarRecurso(aberto, delta)}
          aoFechar={() => setAberto(null)}
        />
      )}
    </header>
  )
}
