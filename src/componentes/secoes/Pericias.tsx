/* arquivo: Pericias.tsx */
import { useState } from 'react'
import type { Personagem, Pericia } from '../../tipos/personagem'
import type { EscolhaVaga } from '../../regras/talentos'
import {
  totalPericia,
  detalhePericia,
  bonusDeEscolhas,
  bonusNaoAtribuido,
  alteradoPorCondicao,
} from '../../regras/calculos'
import { tetoPericiaNormal } from '../../regras/pericias'
import { efeitoCondicoesPericia } from '../../regras/condicoes'
import { ATRIBUTO, ICONE, ORDEM_ATRIBUTOS, ROTULO } from '../../variaveis'
import PopoverDetalhe from '../PopoverDetalhe'

// Aba Perícias (item 1.4) — as 18 com a bolinha de graduação e o total
// CALCULADO. Esse total é o número que o César soma ao d20 rolado na mão
// (premissas.md → "O dado é rolado na mão"), então ele vem grande e à direita:
// legibilidade de relance ganha de qualquer outra coisa nesta tela.
//
// Agrupadas por atributo, na ORDEM_ATRIBUTOS do variaveis.ts — que é derivada
// dos mesmos 3 grupos que o CabecalhoFixo desenha (Física · Cognitiva ·
// Espiritual), a estrutura da ficha oficial. Ordem só existe num lugar.
//
// Nenhuma conta mora aqui: quem calcula é regras/calculos.ts.

type Props = {
  ficha: Personagem
  escolhasTalento: Record<string, EscolhaVaga>
}

export default function Pericias({ ficha, escolhasTalento }: Props) {
  const [detalheAberto, setDetalheAberto] = useState<Pericia | null>(null)
  const teto = tetoPericiaNormal(ficha.meta.nivel)

  return (
    <div className="secao pericias">
      {ORDEM_ATRIBUTOS.map((atributo) => {
        const doGrupo = ficha.pericias.filter((p) => p.atributo === atributo)
        if (doGrupo.length === 0) return null

        return (
          <div className="grupo-pericias" key={atributo}>
            <h2 className="titulo-secao">{ATRIBUTO[atributo].nome}</h2>
            <ul className="lista-pericias">
              {doGrupo.map((p) => {
                const total = totalPericia(p, ficha, escolhasTalento)
                // Condição mexeu no número → vinho com *, igual ao movimento no cabeçalho
                const alterado = alteradoPorCondicao(p, ficha)
                // Graduação de talento é ISENTA do teto (regras/pericias.ts) —
                // por isso vem como bolinha própria, depois das do teto.
                const bonus = bonusDeEscolhas(p.id, escolhasTalento)
                // Bônus que o Shards mandou e o app não soube ligar a um
                // talento — conta no total, mas aparece MARCADO. Nunca fingir
                // que sabe de onde veio.
                const semOrigem = bonusNaoAtribuido(p, escolhasTalento)
                // Nunca esconder graduação real: se o Shards mandar acima do
                // teto, o teto é que cede, não o número.
                const casas = Math.max(teto, p.graduacao)

                return (
                  <li className="linha-pericia" key={p.id}>
                    <span
                      className="pericia-graduacao"
                      aria-label={`graduação ${p.graduacao} de ${casas}${bonus > 0 ? `, mais ${bonus} de talento` : ''}${semOrigem > 0 ? `, mais ${semOrigem} de origem não identificada` : ''}`}
                    >
                      {Array.from({ length: casas }, (_, i) => (
                        <i key={i} className={i < p.graduacao ? 'grad-cheia' : 'grad-vazia'}>
                          {i < p.graduacao ? ICONE.graduacaoCheia : ICONE.graduacaoVazia}
                        </i>
                      ))}
                      {Array.from({ length: bonus }, (_, i) => (
                        <i key={`bonus-${i}`} className="grad-bonus">
                          {ICONE.graduacaoTalento}
                        </i>
                      ))}
                      {Array.from({ length: semOrigem }, (_, i) => (
                        <i
                          key={`sem-origem-${i}`}
                          className="grad-sem-origem"
                          title={ROTULO.bonusSemOrigem}
                        >
                          {ICONE.graduacaoTalento}
                        </i>
                      ))}
                    </span>

                    <span className="pericia-nome">
                      {p.nome}
                      {/* Condição ativa: vantagem/desvantagem não mexem no número, mas mudam a rolagem */}
                      {(() => {
                        const { vantagem, desvantagem } = efeitoCondicoesPericia(p, ficha)
                        return (
                          <>
                            {vantagem.length > 0 && <small className="pericia-vant" title={vantagem.join(', ')}> vantagem</small>}
                            {desvantagem.length > 0 && <small className="pericia-desv" title={desvantagem.join(', ')}> desvantagem</small>}
                          </>
                        )
                      })()}
                    </span>

                    <button
                      className={`numero-detalhavel pericia-total${alterado ? ' numero-alterado' : ''}`}
                      onClick={() => setDetalheAberto(p)}
                      aria-label={`${p.nome}, total ${total}${alterado ? ', alterado por condição' : ''}. Ver de onde vem`}
                    >
                      {total >= 0 ? '+' : ''}
                      {total}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}

      <p className="proximo legenda-pericias">
        {ICONE.graduacaoCheia} graduação · {ICONE.graduacaoVazia} vaga até o teto de {teto} (nível{' '}
        {ficha.meta.nivel}) · {ICONE.graduacaoTalento} graduação de talento, isenta do teto ·{' '}
        <i className="grad-sem-origem">{ICONE.graduacaoTalento}</i> veio do Shards, talento ainda
        não identificado — defina na aba Talentos. Toque no número pra ver de onde ele vem.
      </p>

      {detalheAberto && (
        <PopoverDetalhe
          detalhe={detalhePericia(detalheAberto, ficha, escolhasTalento)}
          aoFechar={() => setDetalheAberto(null)}
        />
      )}
    </div>
  )
}
