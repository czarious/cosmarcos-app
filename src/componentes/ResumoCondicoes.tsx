/* arquivo: ResumoCondicoes.tsx */
import { CONDICOES, CONDICOES_POSITIVAS, type CondicaoEfetiva } from '../regras/condicoes'
import { emTopicos } from '../idioma/idioma'
import { useIdioma } from '../idioma/IdiomaContexto'
import { rotuloCondicao } from './secoes/Condicoes'
import Janela from './Janela'
import ListaLinhas from './ListaLinhas'

// As condições ativas, abertas pelas caixinhas do topo (negativas e positivas):
// cada uma com o efeito do livro em tópicos, e o atalho pra aba Condições, que
// é onde se marca e desmarca.

type Props = {
  efetivas: CondicaoEfetiva[]
  aoAbrirAba: () => void
  aoFechar: () => void
}

export default function ResumoCondicoes({ efetivas, aoAbrirAba, aoFechar }: Props) {
  const idioma = useIdioma()
  const { tx } = idioma
  const grupos = [
    { titulo: tx.cabecalho.negativas, classe: 'resumo-negativa', itens: efetivas.filter((c) => !CONDICOES_POSITIVAS.has(c.id)) },
    { titulo: tx.cabecalho.positivas, classe: 'resumo-positiva', itens: efetivas.filter((c) => CONDICOES_POSITIVAS.has(c.id)) },
  ].filter((g) => g.itens.length > 0)
  return (
    <Janela titulo={tx.cabecalho.condicoesAtivas} aoFechar={aoFechar}>
      {grupos.map((g) => (
        <section key={g.titulo} className={`resumo-grupo ${g.classe}`}>
          <h3 className="resumo-grupo-titulo">{g.titulo}</h3>
          {g.itens.map((c) => (
            <div key={c.uid} className="resumo-condicao">
              <b>{rotuloCondicao(c, idioma)}</b>
              <ListaLinhas classe="proximo" itens={emTopicos(CONDICOES.find((d) => d.id === c.id)?.resumo ?? '')} />
            </div>
          ))}
        </section>
      ))}
      <button
        className="menu-item resumo-abrir-aba"
        onClick={() => {
          aoFechar()
          aoAbrirAba()
        }}
      >
        {tx.cabecalho.abrirAbaCondicoes}
      </button>
    </Janela>
  )
}
