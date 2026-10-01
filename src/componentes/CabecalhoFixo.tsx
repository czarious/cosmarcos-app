/* arquivo: CabecalhoFixo.tsx */
import { useState, type ReactNode } from 'react'
import type { Personagem } from '../tipos/personagem'
import type { NomeRecurso } from '../estado/usePersonagem'
import ControleRecurso from './ControleRecurso'
import FotoPersonagem from './FotoPersonagem'
import Fogueira from './Fogueira'
import PopoverDeflexao from './PopoverDeflexao'
import { ICONE, SIMBOLO_RECURSO, GRUPOS_FICHA } from '../variaveis'
import { condicoesEfetivas } from '../regras/condicoes'
import { deflexaoTotal } from '../regras/armadura'
import { rotuloCondicao } from './secoes/Condicoes'
import { useIdioma } from '../idioma/IdiomaContexto'

// O cabeçalho fixo — SÓ o que muda o tempo todo na mesa (premissas.md →
// "Os vitais grudam no topo"). No alto, a linha de identidade (nome, texto, ⚙);
// embaixo, duas colunas: foto e fogueira (descanso) à esquerda,
// Vida/Foco/Investidura empilhados à direita (a Vida com o escudinho da
// deflexão). Por último, as condições ativas.
// Altura perto da do cabeçalho antigo (3 quadros lado a lado) — o César pediu.
// Atributos, defesas e derivados moram na aba Principal.
// Cada recurso: ▲▼ mudam 1; tocar no número abre o ControleRecurso (dano/cura de valor qualquer, item 1.2/1.3).

type Props = {
  ficha: Personagem
  alterarRecurso: (qual: NomeRecurso, delta: number) => void
  definirFoto: (foto: string | undefined) => void
  fazerDescansoCurto: (vida: number, foco: number) => void
  fazerDescansoLongo: () => void
  /** Toque na faixa de condições → vai pra aba Condições. */
  aoVerCondicoes: () => void
  /** A engrenagem (MenuEngrenagem), no canto direito da identidade. */
  menu: ReactNode
}

export default function CabecalhoFixo({ ficha, alterarRecurso, definirFoto, fazerDescansoCurto, fazerDescansoLongo, aoVerCondicoes, menu }: Props) {
  const idioma = useIdioma()
  const { t, tx, nome } = idioma
  const { meta, recursos } = ficha
  const [aberto, setAberto] = useState<NomeRecurso | null>(null)
  const [vendoDeflexao, setVendoDeflexao] = useState(false)
  const efetivas = condicoesEfetivas(ficha)
  const deflexao = deflexaoTotal(ficha).total

  return (
    <header className="cabecalho-fixo">
      <div className="cf-grade">
        <div className="cf-identidade">
          <span className="cf-nome">{meta.nome}</span>
          <span className="cf-linha">
            {nome(meta.ancestralidade)} · {nome(meta.trilhaHeroica)}
            {meta.trilhaRadiante ? ` / ${nome(meta.trilhaRadiante)}` : ''} · {t(tx.cabecalho.nvN, { n: meta.nivel })}
          </span>
          {menu}
        </div>

        <FotoPersonagem foto={ficha.foto} definirFoto={definirFoto} />

        {/* a ordem dos recursos segue os grupos da ficha oficial: Vida · Foco · Investidura */}
        <div className="cf-recursos">
          {GRUPOS_FICHA.map(({ recurso: qual }) => {
            const r = recursos[qual]
            const cheios = quadradosCheios(r.atual, r.max)
            return (
              <div key={qual} className={`cf-recurso cf-recurso-${qual}${r.max === 0 ? ' cf-vazio' : ''}`}>
                <span className="cf-recurso-rotulo">
                  <span className="cf-simbolo">{SIMBOLO_RECURSO[qual]}</span> {tx.recursos[`${qual}Abrev`]}
                </span>
                {/* [■■■■■■■□□□] — 10 quadradinhos de 10%, na cor do recurso */}
                <span className="cf-quadros" aria-hidden>
                  <span className="cf-colchete">[</span>
                  {Array.from({ length: 10 }, (_, i) => (
                    <span key={i} className={i < cheios ? 'cf-quadro cf-cheio' : 'cf-quadro'} />
                  ))}
                  <span className="cf-colchete">]</span>
                </span>
                {/* só a Vida: o escudinho com a deflexão; as outras linhas guardam a vaga pra alinhar */}
                {qual === 'vida' ? (
                  <button className="cf-escudo" onClick={() => setVendoDeflexao(true)} aria-label={t(tx.principal.verDeflexao, { n: deflexao })}>
                    <Escudo n={deflexao} />
                  </button>
                ) : (
                  <span aria-hidden />
                )}
                <button className="cf-seta" onClick={() => alterarRecurso(qual, +1)} disabled={r.atual >= r.max} aria-label={`${tx.recursos[qual]}: ${t(tx.recurso.mais)}`}>
                  {ICONE.subir}
                </button>
                <button className="cf-seta" onClick={() => alterarRecurso(qual, -1)} disabled={r.atual <= 0} aria-label={`${tx.recursos[qual]}: ${t(tx.recurso.menos)}`}>
                  {ICONE.descer}
                </button>
                {/* o número abre o editor: dano/cura de valor qualquer (as setas são de 1 em 1) */}
                <button
                  className="cf-valor"
                  onClick={() => setAberto(qual)}
                  aria-label={t(tx.cabecalho.nomeAtualMaxAlterar, { nome: tx.recursos[qual], atual: r.atual, max: r.max })}
                >
                  {r.atual}
                  <span className="cf-max">/{r.max}</span>
                </button>
              </div>
            )
          })}
        </div>

        <Fogueira ficha={ficha} fazerDescansoCurto={fazerDescansoCurto} fazerDescansoLongo={fazerDescansoLongo} />
      </div>

      {/* Condição ativa aparece em QUALQUER aba — muda a jogada no meio do combate */}
      {efetivas.length > 0 && (
        <button className="cf-condicoes" onClick={aoVerCondicoes} aria-label={t(tx.cabecalho.verCondicoesAtivas)}>
          {efetivas.map((c) => (
            <span key={c.uid} className="cf-condicao">
              {rotuloCondicao(c, idioma)}
            </span>
          ))}
        </button>
      )}

      {vendoDeflexao && <PopoverDeflexao ficha={ficha} aoFechar={() => setVendoDeflexao(false)} />}

      {aberto && (
        <ControleRecurso
          qual={aberto}
          recurso={recursos[aberto]}
          deflexao={aberto === 'vida' ? deflexao : undefined}
          alterar={(delta) => alterarRecurso(aberto, delta)}
          aoFechar={() => setAberto(null)}
        />
      )}
    </header>
  )
}

/**
 * Quantos dos 10 quadradinhos acendem (10% cada). Cheio só no máximo e vazio
 * só no zero: 20/21 arredondaria pra 10 e pareceria Vida cheia.
 */
function quadradosCheios(atual: number, max: number): number {
  if (max <= 0 || atual <= 0) return 0
  if (atual >= max) return 10
  return Math.min(9, Math.max(1, Math.round((atual / max) * 10)))
}

/** O escudinho da deflexão, com o número dentro. */
function Escudo({ n }: { n: number }) {
  return (
    <svg viewBox="0 0 20 22" aria-hidden>
      <path className="escudo-forma" d="M10 1.5 C13 3 15.5 3.3 18 3 V10 C18 15.5 14.5 19 10 21 C5.5 19 2 15.5 2 10 V3 C4.5 3.3 7 3 10 1.5 Z" />
      {/* o filete por dentro repete a borda dupla dos painéis */}
      <path className="escudo-filete" d="M10 3.6 C12.5 4.8 14.5 5.1 16.3 4.9 V10 C16.3 14.5 13.5 17.4 10 19 C6.5 17.4 3.7 14.5 3.7 10 V4.9 C5.5 5.1 7.5 4.8 10 3.6 Z" />
      <text className="escudo-numero" x="10" y="14" textAnchor="middle">
        {n}
      </text>
    </svg>
  )
}
