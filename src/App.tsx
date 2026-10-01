/* arquivo: App.tsx */
import { useMemo, useRef, useState } from 'react'
import { usePersonagem } from './estado/usePersonagem'
import { useTurno } from './estado/useTurno'
import PainelTurno from './componentes/PainelTurno'
import MenuEngrenagem from './componentes/MenuEngrenagem'
import AvisoAtualizacao from './componentes/AvisoAtualizacao'
import CabecalhoFixo from './componentes/CabecalhoFixo'
import SeletorSecao, { LISTA, type Secao } from './componentes/SeletorSecao'
import CarrosselAbas from './componentes/CarrosselAbas'
import Principal from './componentes/secoes/Principal'
import Pericias from './componentes/secoes/Pericias'
import Talentos from './componentes/secoes/Talentos'
import Acoes from './componentes/secoes/Acoes'
import Inventario from './componentes/secoes/Inventario'
import Anotacoes from './componentes/secoes/Anotacoes'
import Fabriais from './componentes/secoes/Fabriais'
import Condicoes from './componentes/secoes/Condicoes'
import Personagem from './componentes/secoes/Personagem'
import Radiante from './componentes/secoes/Radiante'
import { fundoDaAba } from './fundos'
import { useIdioma } from './idioma/IdiomaContexto'
import type { Rotulo } from './idioma/pt'

// Compõe a ficha: cabeçalho fixo (recursos MUTÁVEIS — item 1.2/1.3) + abas + conteúdo.
// O estado vivo mora no hook usePersonagem; o cabeçalho recebe o alterarRecurso.

export default function App() {
  const { t, tx, rot } = useIdioma()
  const {
    ficha,
    erro,
    alterarRecurso,
    definirRecurso,
    escolhasTalento,
    definirEscolhaVaga,
    alternarEquipada,
    alternarItemEquipado,
    definirMarcos,
    definirEquipamentoTexto,
    definirFoto,
    adicionarItem,
    removerItem,
    adicionarAnotacao,
    editarAnotacao,
    removerAnotacao,
    alterarObjetivo,
    adicionarObjetivo,
    removerObjetivo,
    alterarIdeal,
    alterarCargas,
    recarregarTodos,
    recarregarComInvestidura,
    salvarFabrial,
    removerFabrial,
    adicionarCondicao,
    removerCondicao,
    aplicarFicha,
    salvarLesao,
    removerLesao,
    fazerDescansoCurto,
    fazerDescansoLongo,
    importarTexto,
    desfazerImportacao,
    exportarJson,
    backupJson,
    salvou,
    alertaSave,
    dispensarAlertaSave,
    saveDescartado,
    sementeNova,
    atualizarDaSemente,
    dispensarSementeNova,
  } = usePersonagem('./personagens/eccho.json')
  // O turno mexe na ficha pelas mesmas portas da tela (recurso, condição, carga, descanso).
  const apiTurno = useMemo(
    () => ({ alterarRecurso, definirRecurso, removerCondicao, aplicarFicha }),
    [alterarRecurso, definirRecurso, removerCondicao, aplicarFicha],
  )
  const turno = useTurno(ficha, apiTurno)
  const [secao, setSecao] = useState<Secao>('Principal')
  /**
   * Resultado da última importação/exportação, mostrado no rodapé. Mensagem
   * (escrita no idioma da hora) ou o erro do tradutor, que vem só em português.
   */
  const [avisoRodape, setAvisoRodape] = useState<Rotulo | null>(null)
  const seletorArquivo = useRef<HTMLInputElement>(null)

  async function aoEscolherArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    e.target.value = '' // deixa escolher o mesmo arquivo de novo
    if (!arquivo) return
    const falha = importarTexto(await arquivo.text())
    setAvisoRodape(falha ?? { texto: (d) => d.geral.importado, vars: { arquivo: arquivo.name } })
  }

  function exportar() {
    const texto = exportarJson()
    if (!texto || !ficha) {
      setAvisoRodape({ texto: (d) => d.geral.exportarSemSemente })
      return
    }
    baixarArquivo(`${ficha.meta.nome.toLowerCase()}.json`, texto)
    setAvisoRodape({ texto: (d) => d.geral.exportado })
  }

  function baixarBackup() {
    const texto = backupJson()
    if (!texto || !ficha) return
    const hoje = new Date().toISOString().slice(0, 10)
    baixarArquivo(`cosmarcos-backup-${ficha.meta.nome.toLowerCase()}-${hoje}.json`, texto)
    setAvisoRodape({ texto: (d) => d.geral.backupBaixado })
  }

  function baixarDescartado() {
    const texto = saveDescartado()
    if (texto) baixarArquivo('cosmarcos-save-que-nao-abriu.json', texto)
  }

  if (erro) {
    return (
      <main className="casca">
        <h1>{t(tx.app.algoQuebrou)}</h1>
        <p className="erro">{erro}</p>
      </main>
    )
  }

  if (!ficha) {
    return (
      <main className="casca">
        <p className="proximo">{t(tx.app.carregandoFicha)}</p>
      </main>
    )
  }

  /** O conteúdo de uma aba — o carrossel desenha a aberta e as vizinhas. */
  function desenharSecao(s: Secao) {
    if (!ficha) return null
    return s === 'Principal' ? (
      <Principal ficha={ficha} />
    ) : s === 'Perícias' ? (
      <Pericias ficha={ficha} escolhasTalento={escolhasTalento} />
    ) : s === 'Talentos' ? (
      <Talentos ficha={ficha} escolhasTalento={escolhasTalento} definirEscolhaVaga={definirEscolhaVaga} />
    ) : s === 'Ações' ? (
      <Acoes ficha={ficha} escolhasTalento={escolhasTalento} alterarCargas={alterarCargas} turno={turno} />
    ) : s === 'Fabriais' ? (
      <Fabriais
        ficha={ficha}
        alterarCargas={alterarCargas}
        recarregarTodos={recarregarTodos}
        recarregarComInvestidura={recarregarComInvestidura}
        salvarFabrial={salvarFabrial}
        removerFabrial={removerFabrial}
      />
    ) : s === 'Condições' ? (
      <Condicoes
        ficha={ficha}
        adicionarCondicao={adicionarCondicao}
        removerCondicao={removerCondicao}
        salvarLesao={salvarLesao}
        removerLesao={removerLesao}
      />
    ) : s === 'Inventário' ? (
      <Inventario
        ficha={ficha}
        alternarEquipada={alternarEquipada}
        alternarItemEquipado={alternarItemEquipado}
        definirMarcos={definirMarcos}
        definirEquipamentoTexto={definirEquipamentoTexto}
        adicionarItem={adicionarItem}
        removerItem={removerItem}
      />
    ) : s === 'Personagem' ? (
      <Personagem
        ficha={ficha}
        alterarObjetivo={alterarObjetivo}
        adicionarObjetivo={adicionarObjetivo}
        removerObjetivo={removerObjetivo}
      />
    ) : s === 'Radiante' ? (
      <Radiante ficha={ficha} escolhasTalento={escolhasTalento} alterarIdeal={alterarIdeal} />
    ) : s === 'Anotações' ? (
      <Anotacoes
        ficha={ficha}
        adicionarAnotacao={adicionarAnotacao}
        editarAnotacao={editarAnotacao}
        removerAnotacao={removerAnotacao}
      />
    ) : (
      <div className="em-breve">
        <p>{t(tx.app.aAbaSecaoVem, { secao: tx.nomesAbas[s] })}</p>
        <p className="proximo">{t(tx.app.aEstruturaJaEsta)}</p>
      </div>
    )
  }

  const fundo = fundoDaAba(secao, ficha)

  return (
    <div className="ficha">
      {/* arte do personagem atrás do conteúdo — decoração, nunca informação */}
      {fundo && <div className="fundo-aba" style={{ backgroundImage: `url(${fundo})` }} aria-hidden />}
      <div className="topo-fixo">
        <CabecalhoFixo
          ficha={ficha}
          alterarRecurso={alterarRecurso}
          definirFoto={definirFoto}
          fazerDescansoCurto={fazerDescansoCurto}
          fazerDescansoLongo={fazerDescansoLongo}
          aoVerCondicoes={() => setSecao('Condições')}
          menu={
            <MenuEngrenagem
              aoImportar={() => seletorArquivo.current?.click()}
              aoExportar={exportar}
              aoBaixarBackup={baixarBackup}
              aoDesfazerImportacao={
                desfazerImportacao &&
                (() => {
                  desfazerImportacao()
                  setAvisoRodape({ texto: (d) => d.menu.importacaoDesfeita })
                })
              }
              salvou={salvou}
            />
          }
        />
        <SeletorSecao ativa={secao} aoTrocar={setSecao} />
        <PainelTurno ficha={ficha} turno={turno} />
        <AvisoAtualizacao />
        {/* a ficha-semente do repositório ficou mais nova que o save — mesma faixa do aviso de versão */}
        {sementeNova && (
          <div className="aviso-atualizacao" role="status">
            <span>{t(tx.app.fichaMaisNova, { nome: ficha.meta.nome })}</span>
            <span className="turno-botoes">
              <button className="turno-discreto" onClick={dispensarSementeNova}>
                {tx.app.agoraNao}
              </button>
              <button
                className="turno-botao turno-primario"
                onClick={() => setAvisoRodape(atualizarDaSemente() ?? { texto: (d) => d.app.fichaNovaImportada })}
              >
                {tx.app.importar}
              </button>
            </span>
          </div>
        )}
      </div>
      <main className="conteudo">
        {alertaSave && (
          <div className="alerta-save" role="alert">
            <p>
              <strong>{tx.geral.saveNaoAbriu}:</strong> {alertaSave}{' '}
              {t(tx.app.umaCopiaFicouGuardada)}
            </p>
            <span className="rodape-botoes">
              <button className="rodape-botao rodape-perigo" onClick={baixarDescartado}>
                {tx.geral.baixarDescartado}
              </button>
              <button className="rodape-botao" onClick={dispensarAlertaSave}>
                {tx.geral.entendi}
              </button>
            </span>
          </div>
        )}
        <CarrosselAbas lista={LISTA} ativa={secao} aoTrocar={setSecao} desenhar={desenharSecao} />
      </main>

      {/* Rodapé: só o estado do save e o resultado da última importação/exportação.
          Os botões moram na engrenagem do topo (MenuEngrenagem). */}
      <input ref={seletorArquivo} type="file" accept=".json,application/json" hidden onChange={aoEscolherArquivo} />
      <footer className="rodape">
        {salvou ? (
          <span className="rodape-estado">{avisoRodape ? rot(avisoRodape) : tx.geral.fichaSalva}</span>
        ) : (
          <span className="rodape-aviso">{tx.geral.naoSalvou}</span>
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
