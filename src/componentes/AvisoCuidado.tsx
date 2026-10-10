/* arquivo: AvisoCuidado.tsx */
import type { ReactNode } from 'react'
import { useIdioma } from '../idioma/IdiomaContexto'

// O aviso de "isto apaga dado" — antes de um botão que troca ou perde a ficha.
// Tem que saltar aos olhos: o César achou o texto simples fácil de não ver (10/Out/2026).
// A placa de cuidado (assets/aviso-placa.webp) é desenhada pelo CSS, atrás do texto.
export default function AvisoCuidado({ children }: { children: ReactNode }) {
  const { tx } = useIdioma()
  return (
    <div className="aviso-cuidado" role="alert">
      <strong className="aviso-cuidado-titulo">{tx.geral.cuidado}</strong>
      <span className="aviso-cuidado-texto">{children}</span>
    </div>
  )
}
