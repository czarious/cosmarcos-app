/* arquivo: useArrastarAbas.ts */
import { useRef, useState } from 'react'

// Arrastar o dedo no conteúdo troca de aba: pra esquerda vem a próxima, pra
// direita a anterior, na ordem do menu, parando nas pontas (não dá a volta).
// As abas ficam "coladas" lado a lado: a aba segue o dedo e a vizinha aparece
// encostada, com uma linha separando (o ::before/::after do .conteudo, em base.css).
// Contra troca sem querer: só vale arrasto bem mais de lado que de pé, longe da
// borda (no iPhone a borda é o "voltar" do Safari), e fora de campo e diálogo.

/**
 * minimo: quanto o dedo anda de lado (px) pra trocar · proporcao: quantas vezes mais de lado que de pé ·
 * borda: faixa da tela ignorada (px) · decide: quanto anda antes de saber se é arrasto ou rolagem (px) ·
 * ponta: quanto a aba cede quando não há vizinha · volta: duração do "voltar pro lugar" (ms, igual ao base.css)
 */
export const ARRASTO = { minimo: 60, proporcao: 2, borda: 30, decide: 10, ponta: 0.25, volta: 180 } as const

export type Sentido = 'proxima' | 'anterior'

/** O movimento do dedo foi troca de aba ou rolagem? */
export function sentidoDoArrasto(dx: number, dy: number): Sentido | null {
  if (Math.abs(dx) < ARRASTO.minimo || Math.abs(dx) < ARRASTO.proporcao * Math.abs(dy)) return null
  return dx < 0 ? 'proxima' : 'anterior'
}

/** A aba ao lado, ou null na ponta. */
export function abaVizinha<T>(lista: readonly T[], atual: T, sentido: Sentido): T | null {
  const i = lista.indexOf(atual)
  if (i < 0) return null
  return lista[i + (sentido === 'proxima' ? 1 : -1)] ?? null
}

/** Toque que começa aqui é do elemento, não da troca de aba. */
const NAO_ARRASTA = 'input, textarea, select, [contenteditable="true"], [role="dialog"], .cr-overlay'

type Gesto = { x0: number; y0: number; dx: number; dy: number; lateral: boolean | null }

/** Altura (px, dentro do conteúdo) onde o nome da aba vizinha aparece: a 1/3 da tela, mesmo rolada. */
function alturaRotulo(el: HTMLElement) {
  return Math.max(0, window.innerHeight / 3 - el.getBoundingClientRect().top)
}

export function useArrastarAbas<T>(lista: readonly T[], atual: T, aoTrocar: (aba: T) => void, rotulo: (aba: T) => string) {
  const area = useRef<HTMLElement>(null)
  const gesto = useRef<Gesto | null>(null)
  // A entrada animada vale só pra aba que o arrasto abriu — trocar pelo menu não anima
  const [entrada, setEntrada] = useState<{ aba: T; inicio: number; rotuloY: number } | null>(null)
  const entrando = entrada?.aba === atual ? entrada : null

  function arrastar(px: number) {
    const el = area.current
    if (!el) return
    el.classList.add('arrastando')
    el.style.transform = `translateX(${px}px)`
  }

  function voltarProLugar() {
    const el = area.current
    if (!el) return
    el.classList.add('voltando')
    el.style.transform = ''
    setTimeout(() => el.classList.remove('arrastando', 'voltando'), ARRASTO.volta)
  }

  const anterior = abaVizinha(lista, atual, 'anterior')
  const proxima = abaVizinha(lista, atual, 'proxima')

  return {
    classe: entrando ? ' entrando' : '',
    props: {
      ref: area,
      'data-anterior': anterior === null ? undefined : rotulo(anterior),
      'data-proxima': proxima === null ? undefined : rotulo(proxima),
      style: entrando
        ? ({ '--inicio': `${entrando.inicio}px`, '--rotulo-y': `${entrando.rotuloY}px` } as React.CSSProperties)
        : undefined,
      // Senão voltar a esta aba pelo menu repetiria a entrada
      onAnimationEnd: () => setEntrada(null),

      onTouchStart(e: React.TouchEvent) {
        const { clientX: x, clientY: y } = e.touches[0]
        const livre =
          e.touches.length === 1 &&
          x > ARRASTO.borda &&
          x < window.innerWidth - ARRASTO.borda &&
          !(e.target as Element).closest(NAO_ARRASTA)
        gesto.current = livre ? { x0: x, y0: y, dx: 0, dy: 0, lateral: null } : null
      },

      onTouchMove(e: React.TouchEvent) {
        const g = gesto.current
        if (!g) return
        if (e.touches.length > 1) {
          // pinça de zoom
          gesto.current = null
          if (g.lateral) voltarProLugar()
          return
        }
        g.dx = e.touches[0].clientX - g.x0
        g.dy = e.touches[0].clientY - g.y0
        if (g.lateral === null) {
          if (Math.abs(g.dx) < ARRASTO.decide && Math.abs(g.dy) < ARRASTO.decide) return
          g.lateral = Math.abs(g.dx) > Math.abs(g.dy) && !window.getSelection()?.toString()
          if (!g.lateral) {
            gesto.current = null // é rolagem (ou seleção de texto): o navegador cuida
            return
          }
          area.current?.style.setProperty('--rotulo-y', `${alturaRotulo(area.current)}px`)
        }
        const temVizinha = (g.dx < 0 ? proxima : anterior) !== null
        arrastar(temVizinha ? g.dx : g.dx * ARRASTO.ponta)
      },

      onTouchCancel() {
        if (gesto.current?.lateral) voltarProLugar()
        gesto.current = null
      },

      onTouchEnd() {
        const g = gesto.current
        gesto.current = null
        if (!g?.lateral) return
        const sentido = sentidoDoArrasto(g.dx, g.dy)
        const nova = sentido && abaVizinha(lista, atual, sentido)
        const el = area.current
        if (!sentido || nova === null || !el) {
          voltarProLugar()
          return
        }
        // A aba nova começa onde a vizinha colada estava e desliza até o lugar
        const largura = el.offsetWidth
        setEntrada({ aba: nova, inicio: g.dx + (sentido === 'proxima' ? largura : -largura), rotuloY: alturaRotulo(el) })
        aoTrocar(nova)
      },
    },
  }
}
