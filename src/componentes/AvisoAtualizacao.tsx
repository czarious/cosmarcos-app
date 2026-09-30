/* arquivo: AvisoAtualizacao.tsx */
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useIdioma } from '../idioma/IdiomaContexto'

// Registra o service worker e avisa quando há versão nova. A versão nova baixa
// sozinha, mas só entra quando o jogador toca em "Atualizar" — nunca no meio
// do combate. A ficha fica no localStorage, então recarregar não perde nada.
//
// Por que procurar de novo ao voltar pra tela: no celular o app quase nunca
// fecha de verdade (fica parado na memória), e o navegador só procura versão
// nova ao abrir do zero — foi assim que a v0.8.0 só apareceu reinstalando.

const MEIA_HORA = 30 * 60 * 1000

export default function AvisoAtualizacao() {
  const { tx } = useIdioma()
  const {
    needRefresh: [temVersaoNova],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registro) {
      if (!registro) return
      const procurar = () => registro.update().catch(() => {}) // sem internet: tenta na próxima
      document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && procurar())
      setInterval(procurar, MEIA_HORA)
    },
  })

  if (!temVersaoNova) return null
  return (
    <div className="aviso-atualizacao" role="status">
      <span>{tx.atualizacao.disponivel}</span>
      <button className="turno-botao turno-primario" onClick={() => updateServiceWorker(true)}>
        {tx.atualizacao.atualizar}
      </button>
    </div>
  )
}
