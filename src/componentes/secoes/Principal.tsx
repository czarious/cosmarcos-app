/* arquivo: Principal.tsx */
import type { Personagem, NomeAtributo } from '../../tipos/personagem'
import { GRUPOS_FICHA } from '../../variaveis'
import { useIdioma } from '../../idioma/IdiomaContexto'
import { condicoesEfetivas, bonusAprimorado, movimentoComCondicoes } from '../../regras/condicoes'
import { formatarMetros } from './Condicoes'

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
      <ul className="pr-derivados">
        <li>
          <b>{deflect}</b>
          <span>{tx.geral.deflexao}</span>
        </li>
      </ul>

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
