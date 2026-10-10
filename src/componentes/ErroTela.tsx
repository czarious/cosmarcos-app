/* arquivo: ErroTela.tsx */
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useIdioma } from '../idioma/IdiomaContexto'
import { baixarArquivo } from '../estado/baixarArquivo'
import { armazem } from '../estado/banco'

// A rede de baixo de todo o app. Sem ela, um erro ao desenhar qualquer tela
// desmonta tudo e o jogador vê tela BRANCA — e, como o save não muda, branca
// toda vez que abrir. Aqui ele vê o que houve e leva o save embora.
// Tem que ser classe: o React só pega erro de desenho com componentDidCatch.
export default class ErroTela extends Component<{ children: ReactNode }, { erro: Error | null }> {
  state = { erro: null as Error | null }

  static getDerivedStateFromError(erro: Error) {
    return { erro }
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    console.error('[cosmarcos] a tela quebrou:', erro, info.componentStack)
  }

  render() {
    return this.state.erro ? <Aviso erro={this.state.erro} /> : this.props.children
  }
}

/** Todo save de ficha deste aparelho, um arquivo cada — é o mesmo formato do backup, volta pelo Importar. */
function baixarSaves() {
  try {
    const a = armazem() // o banco (IndexedDB) ou o localStorage
    for (const k of Object.keys(a).filter((k) => k.startsWith('cosmarcos:ficha:'))) {
      const texto = a.getItem(k)
      if (texto) baixarArquivo(`cosmarcos-save-${k.slice('cosmarcos:ficha:'.length)}.json`, texto)
    }
  } catch {
    // storage bloqueado: não há o que baixar
  }
}

function Aviso({ erro }: { erro: Error }) {
  const { t, tx } = useIdioma()
  return (
    <main className="casca">
      <h1>{t(tx.app.algoQuebrou)}</h1>
      <p>{tx.erroTela.explicacao}</p>
      {/* a mensagem vem do navegador, sempre em inglês: fica guardada, não no meio do aviso */}
      <details className="erro-detalhe">
        <summary>{tx.erroTela.detalheTecnico}</summary>
        <p className="erro">{erro.message}</p>
      </details>
      <p className="rodape-botoes">
        <button type="button" className="rodape-botao" onClick={baixarSaves}>
          {tx.erroTela.baixarSave}
        </button>
        <button type="button" className="rodape-botao" onClick={() => location.reload()}>
          {tx.erroTela.recarregar}
        </button>
      </p>
    </main>
  )
}
