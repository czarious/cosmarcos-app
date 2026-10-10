/* arquivo: BotaoInfo.tsx */
import { useState, type ReactNode } from 'react'
import { useIdioma } from '../idioma/IdiomaContexto'
import Janela, { type Largura } from './Janela'
import ListaLinhas from './ListaLinhas'

// O botão de informação: quando há onde tocar (um traço, um item, um título),
// a explicação mora nele e abre numa janela — no lugar de texto aberto na tela
// (César, 10/Out/2026: "não sei o que é isso, eu clico"). Economiza espaço.
// O próprio nome é o botão, com a borda de pílula vinho — o mesmo padrão do
// número que abre janela; sem `children`, o botão mostra o `titulo`.

type Props = {
  /** Título da janela (o nome da coisa). */
  titulo: string
  /** A explicação em tópicos, uma por linha. */
  linhas?: string[]
  /** Explicação mais rica (lista numerada, tabela…), embaixo das linhas. */
  conteudo?: ReactNode
  /** Uma linha a mais embaixo (ex.: "só com a especialidade"). */
  nota?: string
  /** O que aparece no botão; sem isso, o `titulo`. */
  children?: ReactNode
  classe?: string
  largura?: Largura
}

export default function BotaoInfo({ titulo, linhas, conteudo, nota, children, classe, largura }: Props) {
  const { tx } = useIdioma()
  const [aberto, setAberto] = useState(false)
  return (
    <>
      <button
        type="button"
        className={classe ? `botao-info ${classe}` : 'botao-info'}
        onClick={(e) => {
          e.preventDefault() // dentro de um <label> (linha do Inventário), não marca a caixinha
          e.stopPropagation() // dentro de um cartão que abre/fecha, não mexe nele
          setAberto(true)
        }}
        aria-haspopup="dialog"
        aria-label={`${titulo}. ${tx.geral.regraDoLivro}`}
      >
        {children ?? titulo}
      </button>
      {aberto && (
        <Janela titulo={titulo} aoFechar={() => setAberto(false)} largura={largura}>
          {linhas && linhas.length > 0 && <ListaLinhas itens={linhas} />}
          {conteudo}
          {nota && <p className="proximo botao-info-nota">{nota}</p>}
        </Janela>
      )}
    </>
  )
}
