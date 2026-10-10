/* arquivo: JanelaConexao.tsx */
import { useState } from 'react'
import { useIdioma } from '../idioma/IdiomaContexto'
import Janela from './Janela'

// Uma conexão da aba Personagem (nova ou editada): nome e quem ela é pro
// personagem. No Shards, as conexões são um texto só, uma por linha, no
// formato "Nome — descrição" — é assim que ela volta.

type Props = {
  titulo: string
  nome: string
  sobre: string
  aoSalvar: (nome: string, sobre: string) => void
  aoFechar: () => void
}

export default function JanelaConexao({ titulo, nome, sobre, aoSalvar, aoFechar }: Props) {
  const { t, tx } = useIdioma()
  const [n, setN] = useState(nome)
  const [s, setS] = useState(sobre)
  return (
    <Janela titulo={titulo} aoFechar={aoFechar} fechar="ate-salvar">
      <div className="gerenciar-form">
        <label className="ident-campo">
          <span>{t(tx.personagem.nomeConexao)}</span>
          <input className="cr-input" value={n} onChange={(e) => setN(e.target.value)} autoFocus />
        </label>
        <label className="ident-campo">
          <span>{t(tx.personagem.sobreConexao)}</span>
          <textarea className="cr-input anotacao-textarea" value={s} onChange={(e) => setS(e.target.value)} rows={3} />
        </label>
        <p className="proximo">{t(tx.personagem.voltaProShards)}</p>
        <button
          className="cr-btn cr-mais"
          disabled={!n.trim()}
          onClick={() => {
            // uma linha só: quebra de linha separaria em duas conexões
            aoSalvar(n.trim().replace(/\s*\n\s*/g, ' '), s.trim().replace(/\s*\n\s*/g, ' '))
            aoFechar()
          }}
        >
          {tx.geral.salvar}
        </button>
      </div>
    </Janela>
  )
}
