/* arquivo: Radiante.tsx */
import { useState } from 'react'
import type { Personagem, Ideal } from '../../tipos/personagem'
import type { EscolhaVaga } from '../../regras/talentos'
import { detalhePericia, fluxoComoPericia, type DetalhePericia } from '../../regras/calculos'
import ControleMarcos from '../ControleMarcos'
import PopoverDetalhe from '../PopoverDetalhe'
import { ICONE, SIMBOLO_ATIVACAO } from '../../variaveis'
import { useIdioma } from '../../idioma/IdiomaContexto'

// Aba Radiante — o vínculo: ordem, espreno, os Ideais (cada um é um objetivo
// de 3 marcos — livro, "Jurando Ideais") e os fluxos. Fluxo é PERÍCIA pro
// livro ("Usando Fluxos": atributo + graduações, mesmo teste de qualquer
// perícia) — por isso o total sai do mesmo detalhePericia da aba Perícias.

type Props = {
  ficha: Personagem
  escolhasTalento: Record<string, EscolhaVaga>
  alterarIdeal: (n: Ideal['n'], muda: Partial<Ideal>) => void
}

export default function Radiante({ ficha, escolhasTalento, alterarIdeal }: Props) {
  const { t, tx, nome, num } = useIdioma()
  const [detalhe, setDetalhe] = useState<DetalhePericia | null>(null)
  const rad = ficha.radiante

  if (!rad) {
    return (
      <div className="em-breve">
        <p>{t(tx.radiante.nomeAindaNaoRadiante, { nome: ficha.meta.nome })}</p>
        <p className="proximo">{t(tx.radiante.aAbaPreencheQuando)}</p>
      </div>
    )
  }

  return (
    <div className="secao radiante">
      <h2 className="titulo-secao">{t(tx.radiante.vinculo)}</h2>
      <dl className="pg-dados">
        <div>
          <dt>{t(tx.radiante.ordem)}</dt>
          <dd>{nome(rad.ordem)}</dd>
        </div>
        <div>
          <dt>{t(tx.radiante.espreno)}</dt>
          <dd>
            {rad.spren.nome} — {nome(rad.spren.tipo)}
            {rad.spren.iluminado ? ` · ${t(tx.radiante.iluminado)}` : ''}
          </dd>
        </div>
        <div>
          <dt>{t(tx.radiante.alcanceVinculo)}</dt>
          <dd>{num(rad.alcanceSpren)} m</dd>
        </div>
      </dl>

      <h2 className="titulo-secao">{t(tx.radiante.ideais)}</h2>
      <ul className="lista-objetivos">
        {rad.ideais.map((i) => (
          <li key={i.n} className={`objetivo${i.jurado ? ' ideal-jurado' : ''}`}>
            <div className="objetivo-cabeca">
              <span className="objetivo-nome">{t(tx.radiante.nIdeal, { n: i.n })}</span>
            </div>
            {i.jurado ? (
              i.texto && <blockquote className="ideal-palavras">{i.texto}</blockquote>
            ) : (
              <textarea
                className="cr-input ideal-texto"
                defaultValue={i.texto}
                placeholder={t(tx.radiante.asPalavrasOuAspiracao)}
                aria-label={t(tx.radiante.palavrasNIdeal, { n: i.n })}
                rows={2}
                onBlur={(e) => e.target.value !== i.texto && alterarIdeal(i.n, { texto: e.target.value.trim() })}
              />
            )}
            <ControleMarcos
              marcos={i.marcos}
              concluido={i.jurado}
              rotuloConcluir={tx.marcos.dizerPalavras}
              rotuloConcluido={tx.marcos.jurado}
              aoMarcar={(marcos) => alterarIdeal(i.n, { marcos })}
              aoConcluir={(jurado) => alterarIdeal(i.n, { jurado })}
            />
          </li>
        ))}
      </ul>
      <p className="proximo">
        {t(tx.radiante.cadaIdealObjetivo3)}
      </p>

      {rad.fluxos.length > 0 && (
        <>
          <h2 className="titulo-secao">{t(tx.radiante.fluxos)}</h2>
          <ul className="lista-pericias">
            {rad.fluxos.map((f) => {
              const d = detalhePericia(fluxoComoPericia(f), ficha, escolhasTalento)
              const aprendidos = f.talentos.filter((tal) => tal.aprendido)
              return (
                <li className="linha-pericia" key={f.id}>
                  <span className="pericia-graduacao" aria-label={t(tx.radiante.graduacaoN, { n: f.graduacao })}>
                    {Array.from({ length: Math.max(2, f.graduacao) }, (_, k) => (
                      <i key={k} className={k < f.graduacao ? 'grad-cheia' : 'grad-vazia'}>
                        {k < f.graduacao ? ICONE.graduacaoCheia : ICONE.graduacaoVazia}
                      </i>
                    ))}
                  </span>
                  <span className="pericia-nome">
                    {nome(f.nome)} <small className="fluxo-meta">({tx.atributosAbrev[f.atributo]}) {SIMBOLO_ATIVACAO[f.ativacao]}</small>
                    {aprendidos.length > 0 && (
                      <small className="fluxo-talentos">{aprendidos.map((tal) => nome(tal.nome)).join(' · ')}</small>
                    )}
                  </span>
                  <button
                    className="numero-detalhavel pericia-total"
                    onClick={() => setDetalhe(d)}
                    aria-label={t(tx.geral.nomeTotalVer, { nome: nome(f.nome), total: d.total })}
                  >
                    {d.total >= 0 ? '+' : ''}
                    {d.total}
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}

      {detalhe && <PopoverDetalhe detalhe={detalhe} aoFechar={() => setDetalhe(null)} />}
    </div>
  )
}
