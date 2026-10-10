/* arquivo: BotaoApagar.tsx */
import { useState, type ReactNode } from 'react'
import { useIdioma } from '../idioma/IdiomaContexto'

// A lixeira de toda lista do app: o 1º toque só pergunta, o 2º apaga.
// Anotação e fabrial não têm cópia em lugar nenhum — um toque errado na mesa
// não pode levar embora o que o jogador escreveu.
export default function BotaoApagar({
  aoApagar,
  rotulo,
  classe,
  children,
}: {
  aoApagar: () => void
  /** O que o leitor de tela diz — "Excluir Fulano". */
  rotulo: string
  classe: string
  children: ReactNode
}) {
  const { t, tx } = useIdioma()
  const [confirmando, setConfirmando] = useState(false)

  if (confirmando) {
    return (
      <span className="rodape-botoes">
        <button
          type="button"
          className="rodape-botao rodape-perigo"
          onClick={() => {
            setConfirmando(false)
            aoApagar()
          }}
        >
          {t(tx.geral.apagar)}
        </button>
        <button type="button" className="rodape-botao" onClick={() => setConfirmando(false)}>
          {t(tx.geral.manter)}
        </button>
      </span>
    )
  }
  return (
    <button type="button" className={classe} aria-label={rotulo} onClick={() => setConfirmando(true)}>
      {children}
    </button>
  )
}
