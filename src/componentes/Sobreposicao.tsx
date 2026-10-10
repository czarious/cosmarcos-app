/* arquivo: Sobreposicao.tsx */
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

// O fundo escurecido de TODA janela (.cr-overlay), desenhado direto no <body>.
// Dentro de uma aba ele ficava preso ao carrossel: o Embla desloca o trilho com
// transform, e `position: fixed` dentro de transform acompanha o trilho — a
// janela abria fora da tela em toda aba que não fosse a 1ª (v0.10.2 a v0.13.0).
// Só este arquivo escreve "cr-overlay": o .claude/verificar.mjs confere.
// `protegido`: o toque no fundo não fecha — formulário com texto digitado só
// fecha pelo ✕ ou pelo Salvar, senão um toque errado joga o texto fora.
export default function Sobreposicao({
  aoFechar,
  classe,
  protegido = false,
  children,
}: {
  aoFechar: () => void
  classe?: string
  protegido?: boolean
  children: ReactNode
}) {
  return createPortal(
    <div className={classe ? `cr-overlay ${classe}` : 'cr-overlay'} onClick={protegido ? undefined : aoFechar}>
      {children}
    </div>,
    document.body,
  )
}
