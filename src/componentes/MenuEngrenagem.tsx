/* arquivo: MenuEngrenagem.tsx */
import { useState } from 'react'
import { ICONE } from '../variaveis'
import { useIdioma } from '../idioma/IdiomaContexto'
import { IDIOMAS, type Idioma } from '../idioma/idioma'
import Janela from './Janela'
import AvisoCuidado from './AvisoCuidado'

// A engrenagem no canto do topo: o que é do APP, não da ficha na mesa —
// a ponte com o Shards (importar/exportar), o backup e o idioma da tela.
// Importar apaga dado: pede confirmação aqui mesmo, sem `confirm()`.

type Props = {
  aoImportar: () => void
  aoExportar: () => void
  aoBaixarBackup: () => void
  /** Presente só quando há cópia de antes da última importação. */
  aoDesfazerImportacao: (() => void) | null
  /** A última gravação falhou → o backup vira a ação urgente. */
  salvou: boolean
}

export default function MenuEngrenagem({ aoImportar, aoExportar, aoBaixarBackup, aoDesfazerImportacao, salvou }: Props) {
  const { t, tx, idioma, definirIdioma } = useIdioma()
  const [aberto, setAberto] = useState(false)
  const [confirmandoImportar, setConfirmandoImportar] = useState(false)

  function fechar() {
    setAberto(false)
    setConfirmandoImportar(false)
  }

  /** Fecha o menu e só então age — o aviso do resultado aparece no rodapé. */
  const e = (acao: () => void) => () => {
    fechar()
    acao()
  }

  return (
    <>
      <button className={salvou ? 'engrenagem' : 'engrenagem engrenagem-alerta'} onClick={() => setAberto(true)} aria-label={tx.geral.menu}>
        {ICONE.menu}
      </button>
      {aberto && (
        <Janela titulo={tx.geral.menu} aoFechar={fechar} classe="menu-engrenagem">
          <h3 className="menu-grupo">{t(tx.menu.shards)}</h3>
          {confirmandoImportar ? (
            <div className="menu-confirma">
              <AvisoCuidado>{tx.menu.confirmaImportar}</AvisoCuidado>
              <button className="menu-item menu-perigo" onClick={e(aoImportar)}>
                {tx.geral.importarJson}
              </button>
              <button className="menu-item" onClick={() => setConfirmandoImportar(false)}>
                {tx.geral.cancelar}
              </button>
            </div>
          ) : (
            <button className="menu-item" onClick={() => setConfirmandoImportar(true)}>
              {tx.geral.importarJson}
            </button>
          )}
          {aoDesfazerImportacao && (
            <button className="menu-item" onClick={e(aoDesfazerImportacao)}>
              ↶ {tx.menu.desfazerImportacao}
            </button>
          )}
          <button className="menu-item" onClick={e(aoExportar)}>
            {tx.geral.exportarJson}
          </button>

          <h3 className="menu-grupo">{t(tx.menu.esteAparelho)}</h3>
          <button className={salvou ? 'menu-item' : 'menu-item menu-perigo'} onClick={e(aoBaixarBackup)}>
            {tx.geral.baixarBackup}
          </button>

          <h3 className="menu-grupo">{t(tx.menu.idioma)}</h3>
          <div className="menu-idioma" role="group" aria-label={t(tx.menu.idioma)}>
            {(Object.keys(IDIOMAS) as Idioma[]).map((i) => (
              <button key={i} className={i === idioma ? 'menu-item menu-ativo' : 'menu-item'} aria-pressed={i === idioma} onClick={() => definirIdioma(i)}>
                {IDIOMAS[i]}
              </button>
            ))}
          </div>

          <p className="menu-versao">{t(tx.menu.versao, { v: __VERSAO__ })}</p>
        </Janela>
      )}
    </>
  )
}
