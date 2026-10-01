/* arquivo: Principal.tsx */
import type { Personagem, NomeAtributo, Pericia } from '../../tipos/personagem'
import type { EscolhaVaga } from '../../regras/talentos'
import { GRUPOS_FICHA } from '../../variaveis'
import { useIdioma } from '../../idioma/IdiomaContexto'
import { condicoesEfetivas, bonusAprimorado, movimentoComCondicoes, efeitoCondicoesPericia } from '../../regras/condicoes'
import { periciasMaisAltas, totalPericia, detalhePericia, alteradoPorCondicao } from '../../regras/calculos'
import { formatarMetros } from './Condicoes'
import { useState } from 'react'
import { deflexaoTotal } from '../../regras/armadura'
import PopoverDeflexao from '../PopoverDeflexao'
import PopoverDetalhe from '../PopoverDetalhe'

// Aba Principal — o "Abilities, Saves, Senses" do DDB com as regras do Cosmere
// (cosmere-e-a-interface.md): o atributo JÁ é o modificador (sem o número de
// baixo do D&D) e as 3 Defesas ocupam o lugar dos testes de resistência.
// Cada grupo é uma linha da ficha oficial: [atributo] [DEFESA] [atributo].

type Props = { ficha: Personagem; escolhasTalento: Record<string, EscolhaVaga> }

export default function Principal({ ficha, escolhasTalento }: Props) {
  const { t, tx, nome } = useIdioma()
  const { atributos, atributosMod, defesas, deflect, derivados } = ficha
  const efetivas = condicoesEfetivas(ficha)
  const mov = movimentoComCondicoes(ficha)
  const defl = deflexaoTotal(ficha)
  const [vendoDeflexao, setVendoDeflexao] = useState(false)
  const [detalheAberto, setDetalheAberto] = useState<Pericia | null>(null)

  const atributo = (a: NomeAtributo) => {
    const aprimorado = bonusAprimorado(efetivas, a)
    return (
      <div className="pr-atrib" key={a}>
        <span className="pr-rotulo">{tx.atributos[a]}</span>
        <b className={aprimorado ? 'numero-alterado' : undefined} title={aprimorado ? nome('Aprimorado') : undefined}>
          {atributos[a] + atributosMod[a] + aprimorado}
        </b>
      </div>
    )
  }

  const motivoMov = mov.motivos.map((m) => nome(m)).join(' · ')
  const derivadosLinhas: { rotulo: string; valor: string; motivo?: string }[] = [
    { rotulo: tx.principal.movimento, valor: motivoMov ? formatarMetros(mov.metros) : derivados.movimento, motivo: motivoMov || undefined },
    { rotulo: tx.principal.alcanceSentidos, valor: derivados.alcanceSentidos },
    { rotulo: tx.principal.dadoRecuperacao, valor: derivados.dadoRecuperacao },
    { rotulo: tx.principal.capacidadeCarga, valor: derivados.capacidadeCarga },
    { rotulo: tx.principal.capacidadeLevantamento, valor: derivados.capacidadeLevantamento },
  ]

  const testesRapidos = periciasMaisAltas(ficha, escolhasTalento)

  return (
    <div className="secao principal">
      <h2 className="titulo-secao">{t(tx.principal.testesRapidos)}</h2>
      <ul className="lista-pericias">
        {testesRapidos.map((p) => {
          const total = totalPericia(p, ficha, escolhasTalento)
          const alterado = alteradoPorCondicao(p, ficha)

          return (
            <li className="linha-pericia" key={p.id}>
              <span className="pericia-nome">
                {nome(p.nome)}
                {(() => {
                  const { vantagem, desvantagem } = efeitoCondicoesPericia(p, ficha)
                  return (
                    <>
                      {vantagem.length > 0 && <small className="pericia-vant" title={vantagem.map((v) => nome(v)).join(', ')}> {tx.pericias.vantagem}</small>}
                      {desvantagem.length > 0 && <small className="pericia-desv" title={desvantagem.map((v) => nome(v)).join(', ')}> {tx.pericias.desvantagem}</small>}
                    </>
                  )
                })()}
              </span>

              <button
                className={`numero-detalhavel pericia-total${alterado ? ' numero-alterado' : ''}`}
                onClick={() => setDetalheAberto(p)}
                aria-label={t(alterado ? tx.geral.nomeTotalAlteradoVer : tx.geral.nomeTotalVer, { nome: nome(p.nome), total })}
              >
                {total >= 0 ? '+' : ''}
                {total}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="proximo">{t(tx.principal.testesRapidosLegenda)}</p>

      <h2 className="titulo-secao">{t(tx.principal.atributosDefesas)}</h2>
      {GRUPOS_FICHA.map((g) => (
        <section className="pr-grupo" key={g.defesa} aria-label={t(tx.principal.grupoNome, { nome: tx.grupos[g.defesa] })}>
          <h3 className="pr-grupo-nome">{tx.grupos[g.defesa]}</h3>
          <div className="pr-grupo-linha">
            {atributo(g.atribs[0])}
            <div className="pr-defesa">
              <span className="pr-rotulo">{t(tx.principal.defesa)}</span>
              <b>{defesas[g.defesa]}</b>
            </div>
            {atributo(g.atribs[1])}
          </div>
        </section>
      ))}
      {/* Deflexão: reduz dano afiado, energético e impactante (livro, "Defesas e Deflexão") — não pertence a um grupo */}
      {/* a da ficha + a da armadura vestida (regras/armadura.ts); toque pra ver de onde vem */}
      <ul className="pr-derivados">
        <li>
          <button
            className={`numero-detalhavel${defl.total !== deflect ? ' numero-alterado' : ''}`}
            onClick={() => setVendoDeflexao(true)}
            aria-label={t(tx.principal.verDeflexao, { n: defl.total })}
          >
            {defl.total}
          </button>
          <span>{tx.geral.deflexao}</span>
        </li>
      </ul>
      {defl.variasVestidas && <p className="proximo">{tx.principal.duasArmaduras}</p>}
      {vendoDeflexao && <PopoverDeflexao ficha={ficha} aoFechar={() => setVendoDeflexao(false)} />}

      {detalheAberto && (
        <PopoverDetalhe
          detalhe={detalhePericia(detalheAberto, ficha, escolhasTalento)}
          aoFechar={() => setDetalheAberto(null)}
        />
      )}

      <h2 className="titulo-secao">{t(tx.principal.deslocamentoSentidos)}</h2>
      <ul className="pr-derivados">
        {derivadosLinhas.map((d) => (
          <li key={d.rotulo} title={d.motivo}>
            <b className={d.motivo ? 'numero-alterado' : undefined}>{d.valor}</b>
            <span>
              {d.rotulo}
              {d.motivo && <i className="pr-motivo">{d.motivo}</i>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
