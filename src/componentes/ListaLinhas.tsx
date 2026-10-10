/* arquivo: ListaLinhas.tsx */
import type { ReactNode } from 'react'

// Coisas diferentes, uma por linha — nunca juntas na mesma linha com "·"
// (pedido do César, 10/Out/2026: "visualmente é muito ruim ver itens
// diferentes na mesma linha"). Rótulo de uma coisa só ("Golpear · Mão
// inábil") continua numa linha.

type Props = {
  itens: ReactNode[]
  /** Classe a mais, pra herdar a letra do lugar (ex.: turno-nota, proximo). */
  classe?: string
}

export default function ListaLinhas({ itens, classe }: Props) {
  if (itens.length === 0) return null
  return (
    <ul className={classe ? `lista-linhas ${classe}` : 'lista-linhas'}>
      {itens.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}
