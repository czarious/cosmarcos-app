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
import Condicoes from './componentes/secoes/Condicoes'
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
    adicionarCondicao,
    removerCondicao,
    salvarLesao,
    removerLesao,
    fazerDescansoCurto,
    fazerDescansoLongo,
    importarTexto,
    exportarJson,
    backupJson,
    salvou,
    alertaSave,
    dispensarAlertaSave,
    saveDescartado,
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
    baixarArquivo(`${ficha.meta.nome.toLowerCase()}.json`, texto)
    setAvisoRodape(ROTULO.exportado)
  }

  function baixarBackup() {
    const texto = backupJson()
    if (!texto || !ficha) return
    const hoje = new Date().toISOString().slice(0, 10)
    baixarArquivo(`cosmarcos-backup-${ficha.meta.nome.toLowerCase()}-${hoje}.json`, texto)
    setAvisoRodape(ROTULO.backupBaixado)
  }

  function baixarDescartado() {
    const texto = saveDescartado()
    if (texto) baixarArquivo('cosmarcos-save-que-nao-abriu.json', texto)
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
        <CabecalhoFixo ficha={ficha} alterarRecurso={alterarRecurso} aoVerCondicoes={() => setSecao('Condições')} />
        <SeletorSecao ativa={secao} aoTrocar={setSecao} />
      </div>
      <main className="conteudo">
        {alertaSave && (
          <div className="alerta-save" role="alert">
            <p>
              <strong>{ROTULO.saveNaoAbriu}:</strong> {alertaSave} Uma cópia ficou guardada no aparelho — baixe e
              mande pro Claude recuperar. A ficha abaixo veio do JSON de semente.
            </p>
            <span className="rodape-botoes">
              <button className="rodape-botao rodape-perigo" onClick={baixarDescartado}>
                {ROTULO.baixarDescartado}
              </button>
              <button className="rodape-botao" onClick={dispensarAlertaSave}>
                {ROTULO.entendi}
              </button>
            </span>
          </div>
        )}
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
        ) : secao === 'Condições' ? (
          <Condicoes
            ficha={ficha}
            adicionarCondicao={adicionarCondicao}
            removerCondicao={removerCondicao}
            salvarLesao={salvarLesao}
            removerLesao={removerLesao}
            fazerDescansoCurto={fazerDescansoCurto}
            fazerDescansoLongo={fazerDescansoLongo}
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
            {salvou ? (
              <span className="rodape-estado">{avisoRodape ?? ROTULO.fichaSalva}</span>
            ) : (
              <span className="rodape-aviso">{ROTULO.naoSalvou}</span>
            )}
            <span className="rodape-botoes">
              <button className="rodape-botao" onClick={() => setConfirmandoImportar(true)}>
                {ROTULO.importarJson}
              </button>
              <button className="rodape-botao" onClick={exportar}>
                {ROTULO.exportarJson}
              </button>
              <button className={salvou ? 'rodape-botao' : 'rodape-botao rodape-perigo'} onClick={baixarBackup}>
                {ROTULO.baixarBackup}
              </button>
            </span>
          </>
        )}
      </footer>
    </div>
  )
}

/** Baixa um texto como arquivo .json — exportar, backup e save descartado usam o mesmo caminho. */
function baixarArquivo(nome: string, texto: string) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([texto], { type: 'application/json' }))
  link.download = nome
  document.body.appendChild(link)
  link.click()
  // revogar na hora cancela o download no Chrome — espera ele começar
  setTimeout(() => {
    URL.revokeObjectURL(link.href)
    link.remove()
  }, 1000)
}
