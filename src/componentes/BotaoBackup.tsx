/* arquivo: BotaoBackup.tsx */
import { useState } from 'react'
import { useIdioma } from '../idioma/IdiomaContexto'
import Janela from './Janela'
import ListaLinhas from './ListaLinhas'
import Icone from './Icone'

// O backup à mão, ao lado da barra das abas. A cor diz se a ficha mudou desde o
// último backup baixado — ideia do César, no lugar de uma frase de aviso. Tocar
// abre a explicação (o app se explica sozinho) com o "Baixar backup" dentro.
// Por que importa: estado/marcaBackup.ts.

type Props = {
  mudou: boolean
  aoBaixar: () => void
}

export default function BotaoBackup({ mudou, aoBaixar }: Props) {
  const { tx } = useIdioma()
  const [aberto, setAberto] = useState(false)
  const estado = mudou ? tx.geral.backupMudou : tx.geral.backupEmDia
  return (
    <>
      <button className={mudou ? 'botao-backup backup-mudou' : 'botao-backup'} onClick={() => setAberto(true)} aria-label={`${tx.geral.backupTitulo}. ${estado}`} title={estado}>
        <Icone nome="backup" />
        {mudou && <span className="backup-ponto" aria-hidden />}
      </button>
      {aberto && (
        <Janela titulo={tx.geral.backupTitulo} aoFechar={() => setAberto(false)}>
          <p className={mudou ? 'backup-estado backup-estado-mudou' : 'backup-estado'} role="status">
            {estado}
          </p>
          <ListaLinhas itens={[tx.geral.backupOndeMora, tx.geral.backupOQueE, tx.geral.backupComoVolta]} />
          <h3 className="menu-grupo">{tx.geral.backupCores}</h3>
          <ListaLinhas itens={[tx.geral.backupVerde, tx.geral.backupVinho]} />
          <button className="menu-item backup-baixar" onClick={aoBaixar}>
            {tx.geral.baixarBackup}
          </button>
        </Janela>
      )}
    </>
  )
}
