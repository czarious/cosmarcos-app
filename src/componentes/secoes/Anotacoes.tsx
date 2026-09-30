/* arquivo: Anotacoes.tsx */
import { useState } from 'react'
import type { Personagem } from '../../tipos/personagem'
import { ICONE } from '../../variaveis'
import { useIdioma } from '../../idioma/IdiomaContexto'

// Aba Anotações — blocos livres de título + conteúdo, 100% do app (o Shards
// não tem esse conceito; nasce vazio na importação — tipos/personagem.ts).
// Um botão "+ Nova Anotação" abre o mesmo formulário usado pra editar.

type Props = {
  ficha: Personagem
  adicionarAnotacao: (titulo: string, conteudo: string) => void
  editarAnotacao: (id: string, titulo: string, conteudo: string) => void
  removerAnotacao: (id: string) => void
}

function FormularioAnotacao({
  tituloInicial,
  conteudoInicial,
  aoSalvar,
  aoFechar,
}: {
  tituloInicial: string
  conteudoInicial: string
  aoSalvar: (titulo: string, conteudo: string) => void
  aoFechar: () => void
}) {
  const { t, tx } = useIdioma()
  const [titulo, setTitulo] = useState(tituloInicial)
  const [conteudo, setConteudo] = useState(conteudoInicial)

  function salvar() {
    if (!titulo.trim()) return
    aoSalvar(titulo.trim(), conteudo.trim())
    aoFechar()
  }

  return (
    <div className="cr-overlay" onClick={aoFechar}>
      <div className="cr-painel" onClick={(e) => e.stopPropagation()}>
        <div className="cr-cabeca">
          <span className="cr-titulo">{tituloInicial ? tx.anotacoes.editarAnotacao : tx.anotacoes.novaAnotacaoTitulo}</span>
          <button className="cr-fechar" onClick={aoFechar} aria-label={tx.geral.fechar}>
            {ICONE.fechar}
          </button>
        </div>

        <div className="gerenciar-form">
          <input
            className="cr-input"
            placeholder={t(tx.anotacoes.titulo)}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            autoFocus
          />
          <textarea
            className="cr-input anotacao-textarea"
            placeholder={t(tx.anotacoes.conteudo)}
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            rows={6}
          />
          <button className="cr-btn cr-mais" onClick={salvar} disabled={!titulo.trim()}>
            {tx.geral.salvar}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Anotacoes({ ficha, adicionarAnotacao, editarAnotacao, removerAnotacao }: Props) {
  const { t, tx } = useIdioma()
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [criando, setCriando] = useState(false)
  // ids recolhidos — por padrão toda anotação nasce expandida (não está aqui)
  const [recolhidas, setRecolhidas] = useState<Set<string>>(new Set())

  const emEdicao = ficha.anotacoes.find((a) => a.id === editandoId)

  function alternarRecolhida(id: string) {
    setRecolhidas((atual) => {
      const novo = new Set(atual)
      if (novo.has(id)) novo.delete(id)
      else novo.add(id)
      return novo
    })
  }

  return (
    <div className="secao anotacoes">
      <button className="botao-gerenciar" onClick={() => setCriando(true)}>
        {t(tx.anotacoes.novaAnotacao)}
      </button>

      {ficha.anotacoes.length === 0 ? (
        <p className="proximo">{t(tx.anotacoes.nenhumaAnotacaoAindaToque)}</p>
      ) : (
        <ul className="lista-anotacoes">
          {ficha.anotacoes.map((a) => {
            const recolhida = recolhidas.has(a.id)
            return (
              <li className={`anotacao${recolhida ? ' anotacao-recolhida' : ''}`} key={a.id}>
                <button className="anotacao-cabeca" onClick={() => alternarRecolhida(a.id)}>
                  <span className="anotacao-seta">{recolhida ? '▸' : '▾'}</span>
                  <span className="anotacao-titulo">{a.titulo}</span>
                  <span
                    className="anotacao-acoes"
                    onClick={(e) => e.stopPropagation()}
                    role="presentation"
                  >
                    <button
                      className="anotacao-botao"
                      onClick={() => setEditandoId(a.id)}
                      aria-label={t(tx.geral.editarNome, { nome: a.titulo })}
                    >
                      ✏️
                    </button>
                    <button
                      className="anotacao-botao"
                      onClick={() => removerAnotacao(a.id)}
                      aria-label={t(tx.geral.excluirNome, { nome: a.titulo })}
                    >
                      🗑
                    </button>
                  </span>
                </button>
                {!recolhida && a.conteudo && <p className="anotacao-conteudo">{a.conteudo}</p>}
              </li>
            )
          })}
        </ul>
      )}

      {criando && (
        <FormularioAnotacao
          tituloInicial=""
          conteudoInicial=""
          aoSalvar={adicionarAnotacao}
          aoFechar={() => setCriando(false)}
        />
      )}

      {emEdicao && (
        <FormularioAnotacao
          tituloInicial={emEdicao.titulo}
          conteudoInicial={emEdicao.conteudo}
          aoSalvar={(titulo, conteudo) => editarAnotacao(emEdicao.id, titulo, conteudo)}
          aoFechar={() => setEditandoId(null)}
        />
      )}
    </div>
  )
}
