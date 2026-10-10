/* arquivo: Sobreposicao.tsx */
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

// O fundo escurecido de TODA janela (.cr-overlay), desenhado direto no <body>.
// Dentro de uma aba ele ficava preso ao carrossel: o Embla desloca o trilho com
// transform, e `position: fixed` dentro de transform acompanha o trilho — a
// janela abria fora da tela em toda aba que não fosse a 1ª (v0.10.2 a v0.13.0).
// Só este arquivo escreve "cr-overlay": o .claude/verificar.mjs confere.
export default function Sobreposicao({ aoFechar, classe, children }: { aoFechar: () => void; classe?: string; children: ReactNode }) {
  return createPortal(
    <div className={classe ? `cr-overlay ${classe}` : 'cr-overlay'} onClick={aoFechar}>
      {children}
    </div>,
    document.body,
  )
}
