/* arquivo: CarrosselAbas.tsx */
import { memo, startTransition, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'

// As abas coladas lado a lado: arrastar o dedo passa pra vizinha, na ordem do
// menu, sem dar a volta. Quem move é o Embla (premissas.md → "Arrastar entre
// abas: Embla"). Cada aba é montada UMA vez (as restantes, aos poucos, com o
// celular parado) e fica pronta; só a aberta e as vizinhas se atualizam — as
// longe ficam congeladas e sem desenho (content-visibility).
// No meio do arrasto a vizinha aparece a partir do topo dela, mesmo com a aba
// aberta rolada; ao chegar, a página fica nesse topo.

/** Faixa da borda da tela ignorada (px): no iPhone a borda é o "voltar" do Safari. */
const BORDA = 30
/** Toque que começa aqui é do elemento, não da troca de aba. */
const NAO_ARRASTA = 'input, textarea, select, [contenteditable="true"], [role="dialog"], .cr-overlay'

/** A aba i está perto (aberta ou vizinha)? Só essas se atualizam e aparecem no arrasto. */
export function perto(i: number, aberta: number) {
  return Math.abs(i - aberta) <= 1
}

/** A próxima aba a montar com o celular parado, ou null se já estão todas. */
export function proximaAMontar(total: number, montadas: ReadonlySet<number>) {
  for (let i = 0; i < total; i++) if (!montadas.has(i)) return i
  return null
}

/** Quando o celular estiver parado (o Safari não tem requestIdleCallback). */
const quandoParado = (fn: () => void) =>
  'requestIdleCallback' in window ? window.requestIdleCallback(fn, { timeout: 1000 }) : globalThis.setTimeout(fn, 200)

/** Aba longe não se redesenha: o conteúdo antigo fica, e se atualiza ao chegar perto. */
const Conteudo = memo(
  ({ conteudo }: { conteudo: ReactNode; perto: boolean }) => conteudo,
  (_, depois) => !depois.perto,
)

/** Arrasto só com o dedo (no PC o mouse seleciona texto), longe da borda, fora de campo e diálogo. */
export function podeArrastar(evt: TouchEvent | MouseEvent, larguraTela: number) {
  if (!('touches' in evt) || evt.touches.length !== 1) return false
  const x = evt.touches[0].clientX
  return x > BORDA && x < larguraTela - BORDA && !(evt.target as Element).closest(NAO_ARRASTA)
}

// Fora do componente: objeto novo a cada render faria o Embla reiniciar
const OPCOES: EmblaOptionsType = { watchDrag: (_, evt) => podeArrastar(evt, window.innerWidth) }

/** Quanto da aba aberta já passou por baixo do topo fixo (px). */
function rolado(raiz: HTMLElement) {
  const topo = document.querySelector('.topo-fixo')?.getBoundingClientRect().bottom ?? 0
  return { topo, px: Math.max(0, topo - raiz.getBoundingClientRect().top) }
}

type Props<T> = {
  lista: readonly T[]
  ativa: T
  aoTrocar: (aba: T) => void
  desenhar: (aba: T) => ReactNode
}

export default function CarrosselAbas<T>({ lista, ativa, aoTrocar, desenhar }: Props<T>) {
  const aberta = lista.indexOf(ativa)
  const [viewport, api] = useEmblaCarousel(OPCOES)
  const alinhado = useRef(false)
  const [montadas, setMontadas] = useState<ReadonlySet<number>>(() => new Set([aberta - 1, aberta, aberta + 1]))
  // Pra onde o carrossel vai: muda ao soltar o dedo, antes de parar — no arrasto
  // rápido a aba seguinte já se prepara enquanto a anterior ainda desliza
  const [alvo, setAlvo] = useState(aberta)
  const pertoDe = (i: number) => perto(i, aberta) || perto(i, alvo)
  const montada = (i: number) => montadas.has(i) || pertoDe(i)

  // Monta as que faltam, uma por vez, com o celular parado
  useEffect(() => {
    const i = proximaAMontar(lista.length, montadas)
    if (i === null) return
    const id = quandoParado(() => startTransition(() => setMontadas((m) => new Set(m).add(i))))
    return () => ('cancelIdleCallback' in window ? window.cancelIdleCallback(id) : globalThis.clearTimeout(id))
  }, [lista.length, montadas])
  // Os eventos do Embla são ligados uma vez; leem a aba e o aoTrocar da hora por aqui
  const atual = useRef({ ativa, aoTrocar })
  atual.current = { ativa, aoTrocar }

  /** Desfaz o alinhamento das vizinhas. */
  const soltar = useCallback((a: EmblaCarouselType) => {
    a.slideNodes().forEach((s) => (s.style.transform = ''))
    a.rootNode().style.minHeight = ''
    alinhado.current = false
  }, [])

  useEffect(() => {
    if (!api) return
    // 1º movimento: vizinhas descem até o topo visível e a área vai até o pé da tela
    const aoMover = (a: EmblaCarouselType) => {
      if (alinhado.current) return
      alinhado.current = true
      const { topo, px } = rolado(a.rootNode())
      a.slideNodes().forEach((s, i) => (s.style.transform = i === aberta ? '' : `translateY(${px}px)`))
      a.rootNode().style.minHeight = `${px + window.innerHeight - topo}px`
    }
    // Parou: se trocou, a página sobe pro topo da aba nova — onde ela já estava na tela
    const aoParar = (a: EmblaCarouselType) => {
      const nova = lista[a.selectedScrollSnap()]
      if (nova !== atual.current.ativa) {
        window.scrollBy(0, -rolado(a.rootNode()).px)
        // Cede a vez pro dedo: se outro arrasto já começou, ele vem primeiro
        startTransition(() => atual.current.aoTrocar(nova))
      }
      soltar(a)
    }
    const aoEscolher = (a: EmblaCarouselType) => startTransition(() => setAlvo(a.selectedScrollSnap()))
    api.on('scroll', aoMover).on('settle', aoParar).on('select', aoEscolher)
    return () => {
      api.off('scroll', aoMover).off('settle', aoParar).off('select', aoEscolher)
    }
  }, [api, lista, aberta, soltar])

  // Troca pelo menu (ou 1ª abertura): pula direto, sem deslizar
  useEffect(() => {
    if (!api || api.selectedScrollSnap() === aberta) return
    api.scrollTo(aberta, true)
    setAlvo(aberta)
    soltar(api)
  }, [api, aberta, soltar])

  return (
    <div className="carrossel" ref={viewport}>
      <div className="carrossel-trilho">
        {lista.map((aba, i) => (
          <div
            key={i}
            className={`carrossel-aba${i === aberta ? ' carrossel-aba-aberta' : pertoDe(i) ? '' : ' carrossel-aba-longe'}`}
            aria-hidden={i !== aberta || undefined}
            inert={i !== aberta}
          >
            {montada(i) && <Conteudo conteudo={desenhar(aba)} perto={pertoDe(i)} />}
          </div>
        ))}
      </div>
    </div>
  )
}
