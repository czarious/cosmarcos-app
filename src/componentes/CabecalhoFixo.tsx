/* arquivo: CabecalhoFixo.tsx */
import { useState, type ReactNode } from 'react'
import type { Personagem } from '../tipos/personagem'
import type { NomeRecurso } from '../estado/usePersonagem'
import ControleRecurso from './ControleRecurso'
import { SIMBOLO_RECURSO, GRUPOS_FICHA } from '../variaveis'
import { condicoesEfetivas } from '../regras/condicoes'
import { rotuloCondicao } from './secoes/Condicoes'
import { useIdioma } from '../idioma/IdiomaContexto'

// O cabeçalho fixo — SÓ o que muda o tempo todo na mesa (premissas.md →
// "Os vitais grudam no topo"): identidade + Vida/Foco/Investidura + condições
// ativas. Atributos, defesas e derivados moram na aba Principal.
// O recurso é um BOTÃO — toca e abre o ControleRecurso (dano/cura, item 1.2/1.3).

type Props = {
  ficha: Personagem
  alterarRecurso: (qual: NomeRecurso, delta: number) => void
  /** Toque na faixa de condições → vai pra aba Condições. */
  aoVerCondicoes: () => void
  /** A engrenagem (MenuEngrenagem), no canto direito da identidade. */
  menu: ReactNode
}

export default function CabecalhoFixo({ ficha, alterarRecurso, aoVerCondicoes, menu }: Props) {
  const idioma = useIdioma()
  const { t, tx, nome } = idioma
  const { meta, recursos } = ficha
  const [aberto, setAberto] = useState<NomeRecurso | null>(null)
  const efetivas = condicoesEfetivas(ficha)

  return (
    <header className="cabecalho-fixo">
      <div className="cf-identidade">
        <span className="cf-nome">{meta.nome}</span>
        <span className="cf-linha">
          {nome(meta.ancestralidade)} · {nome(meta.trilhaHeroica)}
          {meta.trilhaRadiante ? ` / ${nome(meta.trilhaRadiante)}` : ''} · {t(tx.cabecalho.nvN, { n: meta.nivel })}
        </span>
        {menu}
      </div>

      {/* a ordem dos recursos segue os grupos da ficha oficial: Vida · Foco · Investidura */}
      <div className="cf-recursos">
        {GRUPOS_FICHA.map(({ recurso: qual }) => {
          const r = recursos[qual]
          const cheio = r.max > 0 ? Math.min(100, (r.atual / r.max) * 100) : 0
          return (
            <button
              key={qual}
              className={`cf-recurso${r.max === 0 ? ' cf-vazio' : ''}`}
              onClick={() => setAberto(qual)}
              aria-label={t(tx.cabecalho.nomeAtualMaxAlterar, { nome: tx.recursos[qual], atual: r.atual, max: r.max })}
            >
              <span className="cf-recurso-rotulo">
                <span className="cf-simbolo">{SIMBOLO_RECURSO[qual]}</span> {tx.recursos[`${qual}Abrev`]}
              </span>
              <span className="cf-valor">
                {r.atual}
                <span className="cf-max">/{r.max}</span>
              </span>
              <span className="cf-barra" aria-hidden>
                <span style={{ width: `${cheio}%` }} />
              </span>
            </button>
          )
        })}
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

      {aberto && (
        <ControleRecurso
          qual={aberto}
          recurso={recursos[aberto]}
          alterar={(delta) => alterarRecurso(aberto, delta)}
          aoFechar={() => setAberto(null)}
        />
      )}
    </header>
  )
}
