/* arquivo: JanelaTexto.tsx */
import { useState } from 'react'
import { useIdioma } from '../idioma/IdiomaContexto'
import Janela from './Janela'

// Editar um texto livre do jogador (propósito, obstáculo, aparência…): só fecha
// salvando ou cancelando — tocar fora não perde o que foi escrito.

type Props = {
  titulo: string
  valor: string
  /** Embaixo do campo: o que acontece com o texto (ex.: volta pro Shards). */
  nota?: string
  aoSalvar: (valor: string) => void
  aoFechar: () => void
}

export default function JanelaTexto({ titulo, valor, nota, aoSalvar, aoFechar }: Props) {
  const { tx } = useIdioma()
  const [texto, setTexto] = useState(valor)
  return (
    <Janela titulo={titulo} aoFechar={aoFechar} fechar="ate-salvar">
      <div className="gerenciar-form">
        <textarea className="cr-input anotacao-textarea" value={texto} onChange={(e) => setTexto(e.target.value)} rows={6} autoFocus aria-label={titulo} />
        {nota && <p className="proximo">{nota}</p>}
        <button
          className="cr-btn cr-mais"
          onClick={() => {
            aoSalvar(texto.trim())
            aoFechar()
          }}
        >
          {tx.geral.salvar}
        </button>
      </div>
    </Janela>
  )
}
