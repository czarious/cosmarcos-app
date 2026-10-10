/* arquivo: Janela.tsx */
import type { ReactNode } from 'react'
import Sobreposicao from './Sobreposicao'
import AvisoCuidado from './AvisoCuidado'
import { useIdioma } from '../idioma/IdiomaContexto'
import { ICONE } from '../variaveis'

// TODA janela do app nasce aqui. Cada janela escolhe as suas CARACTERÍSTICAS
// pelo nome; o que cada uma faz mora só neste arquivo (e no base.css, em
// "Janela — características"). Mudou uma característica? Muda em todas as
// janelas marcadas com ela — a lógica do César (10/Out/2026).
// Característica nova: entra aqui quando aparecer o primeiro uso, não antes.
// O que é só de UMA janela (conteúdo, arranjo) fica no arquivo dela — a prop `classe`.

/**
 * Como a janela fecha. CRITÉRIO pra escolher (César, 10/Out/2026 — trocar só se ele pedir):
 * - fechar sem querer custa UM toque pra refazer → 'livre';
 * - fechar sem querer joga TRABALHO fora (texto livre, vários campos, recorte) → 'ate-salvar';
 * - a janela INFORMA algo que aconteceu e, sem ler, o jogador pode estragar a ficha → 'obrigatoria'.
 * Pergunta de sim/não ("Apagar?") não é janela: é o 2º toque no próprio botão (BotaoApagar).
 */
export type ModoFechar =
  /** ✕ e tocar fora fecham — o padrão: consulta ou ajuste rápido. */
  | 'livre'
  /** Só o ✕ (ou o Salvar) fecha — a pessoa está montando algo. */
  | 'ate-salvar'
  /** Sem ✕ e sem tocar fora: só o botão da própria janela fecha — aviso que tem que ser lido. */
  | 'obrigatoria'

/** Até onde a janela cresce na tela larga (no celular todas ocupam a largura). */
export type Largura = 'normal' | 'media' | 'larga'

/** Cor, moldura e fonte da janela juntas, num nome só. */
export type Tema =
  | 'padrao'
  /** Aviso que o jogador tem que ler: moldura e título laranja. */
  | 'cuidado'

/**
 * O TIPO da janela: uma receita que muda só o que é dela e encaixa no resto
 * da configuração (largura, botões grandes, `classe` continuam valendo). O que
 * a janela pedir explicitamente vence o tipo.
 */
export type TipoJanela =
  /** Janela comum: o conteúdo vem como está. */
  | 'comum'
  /** O que o jogador TEM que ler: o conteúdo vira o texto da placa de cuidado + botão Entendi. */
  | 'aviso'

/** O que cada tipo põe por padrão — o resto fica com a janela. */
const RECEITA: Record<TipoJanela, { fechar?: ModoFechar; tema?: Tema }> = {
  comum: {},
  aviso: { fechar: 'obrigatoria', tema: 'cuidado' },
}

export default function Janela({
  titulo,
  aoFechar,
  tipo = 'comum',
  fechar,
  largura = 'normal',
  tema,
  botoesGrandes = false,
  classe,
  nota,
  rotuloBotao,
  children,
}: {
  titulo: ReactNode
  aoFechar: () => void
  tipo?: TipoJanela
  fechar?: ModoFechar
  largura?: Largura
  tema?: Tema
  /** Botões do rodapé no tamanho do dedo — janela usada no meio da mesa. */
  botoesGrandes?: boolean
  /** Estilo só DESTA janela (o arranjo do conteúdo dela), nunca uma característica. */
  classe?: string
  /** Tipo aviso: uma linha calma embaixo da placa (ex.: "Sua ficha não mudou."). */
  nota?: ReactNode
  /** Tipo aviso: o texto do botão. Padrão: "Entendi". */
  rotuloBotao?: ReactNode
  children: ReactNode
}) {
  const { tx } = useIdioma()
  const modo = fechar ?? RECEITA[tipo].fechar ?? 'livre'
  const visual = tema ?? RECEITA[tipo].tema ?? 'padrao'
  const classes = ['cr-painel', `janela-${largura}`, visual !== 'padrao' && `janela-tema-${visual}`, botoesGrandes && 'janela-botoes-grandes', classe]
    .filter(Boolean)
    .join(' ')
  return (
    <Sobreposicao aoFechar={aoFechar} protegido={modo !== 'livre'}>
      <div className={classes} role="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="cr-cabeca">
          <span className="cr-titulo">{titulo}</span>
          {modo !== 'obrigatoria' && (
            <button className="cr-fechar" onClick={aoFechar} aria-label={tx.geral.fechar}>
              {ICONE.fechar}
            </button>
          )}
        </div>
        {tipo === 'aviso' ? (
          <div className="gerenciar-form">
            <AvisoCuidado>{children}</AvisoCuidado>
            {nota && <p>{nota}</p>}
            <button className="cr-btn cr-mais" onClick={aoFechar}>
              {rotuloBotao ?? tx.geral.entendi}
            </button>
          </div>
        ) : (
          children
        )}
      </div>
    </Sobreposicao>
  )
}
