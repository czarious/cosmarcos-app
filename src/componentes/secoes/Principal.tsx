/* arquivo: Principal.tsx */
import type { Personagem, NomeAtributo } from '../../tipos/personagem'
import { GRUPOS_FICHA } from '../../variaveis'
import { useIdioma } from '../../idioma/IdiomaContexto'
import { condicoesEfetivas, bonusAprimorado, movimentoComCondicoes } from '../../regras/condicoes'
import { formatarMetros } from './Condicoes'
import { useState } from 'react'
import { deflexaoTotal } from '../../regras/armadura'
import PopoverDetalhe from '../PopoverDetalhe'

// Aba Principal — o "Abilities, Saves, Senses" do DDB com as regras do Cosmere
// (cosmere-e-a-interface.md): o atributo JÁ é o modificador (sem o número de
// baixo do D&D) e as 3 Defesas ocupam o lugar dos testes de resistência.
// Cada grupo é uma linha da ficha oficial: [atributo] [DEFESA] [atributo].

type Props = { ficha: Personagem }

export default function Principal({ ficha }: Props) {
  const { t, tx, nome } = useIdioma()
  const { atributos, atributosMod, defesas, deflect, derivados } = ficha
  const efetivas = condicoesEfetivas(ficha)
  const mov = movimentoComCondicoes(ficha)
  const defl = deflexaoTotal(ficha)
  const [vendoDeflexao, setVendoDeflexao] = useState(false)

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

  return (
    <div className="secao principal">
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
      {vendoDeflexao && (
        <PopoverDetalhe detalhe={{ titulo: tx.geral.deflexao, linhas: defl.linhas, total: defl.total }} aoFechar={() => setVendoDeflexao(false)} />
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
