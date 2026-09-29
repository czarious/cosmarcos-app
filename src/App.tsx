/* arquivo: App.tsx */
import { useRef, useState } from 'react'
import { usePersonagem } from './estado/usePersonagem'
import CabecalhoFixo from './componentes/CabecalhoFixo'
import SeletorSecao, { type Secao } from './componentes/SeletorSecao'
import Principal from './componentes/secoes/Principal'
import Pericias from './componentes/secoes/Pericias'
import Talentos from './componentes/secoes/Talentos'
import Acoes from './componentes/secoes/Acoes'
import Inventario from './componentes/secoes/Inventario'
import Anotacoes from './componentes/secoes/Anotacoes'
import Fabriais from './componentes/secoes/Fabriais'
import { ROTULO } from './variaveis'

// Compõe a ficha: cabeçalho fixo (recursos MUTÁVEIS — item 1.2/1.3) + abas + conteúdo.
// O estado vivo mora no hook usePersonagem; o cabeçalho recebe o alterarRecurso.

export default function App() {
  const {
    ficha,
    erro,
    alterarRecurso,
    escolhasTalento,
    definirEscolhaVaga,
    alternarEquipada,
    definirMarcos,
    adicionarItem,
    removerItem,
    adicionarAnotacao,
    editarAnotacao,
    removerAnotacao,
    alterarCargas,
    recarregarTodos,
    recarregarComInvestidura,
    salvarFabrial,
    removerFabrial,
    importarTexto,
    exportarJson,
  } = usePersonagem('./personagens/eccho.json')
  const [secao, setSecao] = useState<Secao>('Principal')
  /** Importar apaga dado — pede confirmação no próprio rodapé, sem `confirm()`. */
  const [confirmandoImportar, setConfirmandoImportar] = useState(false)
  /** Resultado da última importação/exportação, mostrado no rodapé. */
  const [avisoRodape, setAvisoRodape] = useState<string | null>(null)
  const seletorArquivo = useRef<HTMLInputElement>(null)

  async function aoEscolherArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    e.target.value = '' // deixa escolher o mesmo arquivo de novo
    if (!arquivo) return
    const falha = importarTexto(await arquivo.text())
    setAvisoRodape(falha ?? `Importado: ${arquivo.name}`)
  }

  function exportar() {
    const texto = exportarJson()
    if (!texto || !ficha) {
      setAvisoRodape(ROTULO.exportarSemSemente)
      return
    }
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([texto], { type: 'application/json' }))
    link.download = `${ficha.meta.nome.toLowerCase()}.json`
    document.body.appendChild(link)
    link.click()
    // revogar na hora cancela o download no Chrome — espera ele começar
    setTimeout(() => {
      URL.revokeObjectURL(link.href)
      link.remove()
    }, 1000)
    setAvisoRodape(ROTULO.exportado)
  }

  if (erro) {
    return (
      <main className="casca">
        <h1>algo quebrou</h1>
        <p className="erro">{erro}</p>
      </main>
    )
  }

  if (!ficha) {
    return (
      <main className="casca">
        <p className="proximo">carregando a ficha…</p>
      </main>
    )
  }

  return (
    <div className="ficha">
      <div className="topo-fixo">
        <CabecalhoFixo ficha={ficha} alterarRecurso={alterarRecurso} />
        <SeletorSecao ativa={secao} aoTrocar={setSecao} />
      </div>
      <main className="conteudo">
        {secao === 'Principal' ? (
          <Principal ficha={ficha} />
        ) : secao === 'Perícias' ? (
          <Pericias ficha={ficha} escolhasTalento={escolhasTalento} />
        ) : secao === 'Talentos' ? (
          <Talentos ficha={ficha} escolhasTalento={escolhasTalento} definirEscolhaVaga={definirEscolhaVaga} />
        ) : secao === 'Ações' ? (
          <Acoes ficha={ficha} escolhasTalento={escolhasTalento} alterarCargas={alterarCargas} />
        ) : secao === 'Fabriais' ? (
          <Fabriais
            ficha={ficha}
            alterarCargas={alterarCargas}
            recarregarTodos={recarregarTodos}
            recarregarComInvestidura={recarregarComInvestidura}
            salvarFabrial={salvarFabrial}
            removerFabrial={removerFabrial}
          />
        ) : secao === 'Inventário' ? (
          <Inventario
            ficha={ficha}
            alternarEquipada={alternarEquipada}
            definirMarcos={definirMarcos}
            adicionarItem={adicionarItem}
            removerItem={removerItem}
          />
        ) : secao === 'Anotações' ? (
          <Anotacoes
            ficha={ficha}
            adicionarAnotacao={adicionarAnotacao}
            editarAnotacao={editarAnotacao}
            removerAnotacao={removerAnotacao}
          />
        ) : (
          <div className="em-breve">
            <p>A aba <strong>{secao}</strong> vem a seguir.</p>
            <p className="proximo">A estrutura já está de pé — construímos uma por vez.</p>
          </div>
        )}
      </main>

      {/* Rodapé: estado do save + a ponte com o Shards nos dois sentidos —
          importar (escolhe o arquivo exportado lá) e exportar (baixa o JSON
          que o Shards importa). */}
      <input ref={seletorArquivo} type="file" accept=".json,application/json" hidden onChange={aoEscolherArquivo} />
      <footer className="rodape">
        {confirmandoImportar ? (
          <>
            <span className="rodape-aviso">
              Isso <strong>{ROTULO.importarApaga}</strong> que você mudou no app. Não tem desfazer.
            </span>
            <span className="rodape-botoes">
              <button
                className="rodape-botao rodape-perigo"
                onClick={() => {
                  setConfirmandoImportar(false)
                  seletorArquivo.current?.click()
                }}
              >
                {ROTULO.importarJson}
              </button>
              <button className="rodape-botao" onClick={() => setConfirmandoImportar(false)}>
                {ROTULO.cancelar}
              </button>
            </span>
          </>
        ) : (
          <>
            <span className="rodape-estado">{avisoRodape ?? ROTULO.fichaSalva}</span>
            <span className="rodape-botoes">
              <button className="rodape-botao" onClick={() => setConfirmandoImportar(true)}>
                {ROTULO.importarJson}
              </button>
              <button className="rodape-botao" onClick={exportar}>
                {ROTULO.exportarJson}
              </button>
            </span>
          </>
        )}
      </footer>
    </div>
  )
}
