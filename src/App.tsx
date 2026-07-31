/* arquivo: App.tsx */
import { useState } from 'react'
import { usePersonagem } from './estado/usePersonagem'
import CabecalhoFixo from './componentes/CabecalhoFixo'
import SeletorSecao, { type Secao } from './componentes/SeletorSecao'
import Principal from './componentes/secoes/Principal'
import Talentos from './componentes/secoes/Talentos'
import Acoes from './componentes/secoes/Acoes'
import Inventario from './componentes/secoes/Inventario'
import Anotacoes from './componentes/secoes/Anotacoes'

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
  } = usePersonagem('./personagens/eccho.json')
  const [secao, setSecao] = useState<Secao>('Principal')

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
        ) : secao === 'Talentos' ? (
          <Talentos ficha={ficha} escolhasTalento={escolhasTalento} definirEscolhaVaga={definirEscolhaVaga} />
        ) : secao === 'Ações' ? (
          <Acoes ficha={ficha} escolhasTalento={escolhasTalento} />
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
    </div>
  )
}
