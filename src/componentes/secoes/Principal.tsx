/* arquivo: Principal.tsx */
import type { Personagem, NomeAtributo } from '../../tipos/personagem'
import { ATRIBUTO, GRUPOS_FICHA } from '../../variaveis'
import { condicoesEfetivas, bonusAprimorado, movimentoComCondicoes } from '../../regras/condicoes'
import { formatarMetros } from './Condicoes'

// Aba Principal — o "Abilities, Saves, Senses" do DDB com as regras do Cosmere
// (cosmere-e-a-interface.md): o atributo JÁ é o modificador (sem o número de
// baixo do D&D) e as 3 Defesas ocupam o lugar dos testes de resistência.
// Cada grupo é uma linha da ficha oficial: [atributo] [DEFESA] [atributo].

type Props = { ficha: Personagem }

export default function Principal({ ficha }: Props) {
  const { atributos, atributosMod, defesas, deflect, derivados } = ficha
  const efetivas = condicoesEfetivas(ficha)
  const mov = movimentoComCondicoes(ficha)

  const atributo = (a: NomeAtributo) => {
    const aprimorado = bonusAprimorado(efetivas, a)
    return (
      <div className="pr-atrib" key={a}>
        <span className="pr-rotulo">{ATRIBUTO[a].nome}</span>
        <b className={aprimorado ? 'numero-alterado' : undefined} title={aprimorado ? 'Aprimorado' : undefined}>
          {atributos[a] + atributosMod[a] + aprimorado}
        </b>
      </div>
    )
  }

  const derivadosLinhas: { rotulo: string; valor: string; motivo?: string }[] = [
    { rotulo: 'Movimento', valor: mov.motivo ? formatarMetros(mov.metros) : derivados.movimento, motivo: mov.motivo },
    { rotulo: 'Alcance dos sentidos', valor: derivados.alcanceSentidos },
    { rotulo: 'Dado de recuperação', valor: derivados.dadoRecuperacao },
    { rotulo: 'Capacidade de carga', valor: derivados.capacidadeCarga },
    { rotulo: 'Capacidade de levantamento', valor: derivados.capacidadeLevantamento },
  ]

  return (
    <div className="secao principal">
      <h2 className="titulo-secao">Atributos e Defesas</h2>
      {GRUPOS_FICHA.map((g) => (
        <section className="pr-grupo" key={g.defesa} aria-label={`Grupo ${g.nome}`}>
          <h3 className="pr-grupo-nome">{g.nome}</h3>
          <div className="pr-grupo-linha">
            {atributo(g.atribs[0])}
            <div className="pr-defesa">
              <span className="pr-rotulo">Defesa</span>
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
          <span>Deflexão</span>
        </li>
      </ul>

      <h2 className="titulo-secao">Deslocamento e Sentidos</h2>
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
