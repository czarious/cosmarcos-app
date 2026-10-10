/* arquivo: Radiante.tsx */
import { useState } from 'react'
import type { Personagem, Ideal } from '../../tipos/personagem'
import type { EscolhaVaga } from '../../regras/talentos'
import { detalhePericia, fluxoComoPericia, type DetalhePericia } from '../../regras/calculos'
import ControleMarcos from '../ControleMarcos'
import ListaLinhas from '../ListaLinhas'
import PopoverDetalhe from '../PopoverDetalhe'
import { ICONE, SIMBOLO_ATIVACAO } from '../../variaveis'
import { useIdioma } from '../../idioma/IdiomaContexto'
import { emTopicos } from '../../idioma/idioma'
import { talentoDoIdeal, temTalentoDoIdeal } from '../../regras/ideais'
import Janela from '../Janela'
import BotaoInfo from '../BotaoInfo'

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
  const { t, tx, nome, distancia } = useIdioma()
  const [detalhe, setDetalhe] = useState<DetalhePericia | null>(null)
  /** O Ideal que acabou de ser jurado: abre a janela do que ele destravou. */
  const [jurouAgora, setJurouAgora] = useState<Ideal['n'] | null>(null)
  const rad = ficha.radiante
  /** O que o talento do Ideal destrava, em tópicos (texto do catálogo — livro, cap. 5). */
  const destrava = (n: number) => emTopicos(rad ? (talentoDoIdeal(rad.ordem, n)?.descricao ?? '') : '')

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
          <dt>{t(tx.radiante.nomeEspreno)}</dt>
          <dd>{rad.spren.nome}</dd>
        </div>
        <div>
          <dt>{t(tx.radiante.tipoEspreno)}</dt>
          <dd>{nome(rad.spren.tipo)}</dd>
        </div>
        {/* livro e catálogo do Shards: Iluminado é só o espreno de névoa do Sentinela da Verdade —
            em outra ordem a marca não vale regra e não aparece (roadmap → pergunta 14) */}
        {rad.spren.iluminado && rad.ordem === 'Sentinela da Verdade' && (
          <div>
            <dt>{t(tx.radiante.espIluminado)}</dt>
            <dd>{tx.radiante.sim}</dd>
          </div>
        )}
        <div>
          <dt>{t(tx.radiante.alcanceVinculo)}</dt>
          <dd>{distancia(rad.alcanceSpren)}</dd>
        </div>
      </dl>

      {/* como os Ideais funcionam: o título abre (botão de informação) */}
      <h2 className="titulo-secao">
        <BotaoInfo titulo={t(tx.radiante.ideais)} linhas={emTopicos(t(tx.radiante.cadaIdealObjetivo3))} />
      </h2>
      <ul className="lista-objetivos">
        {rad.ideais.map((i) => {
          const talento = talentoDoIdeal(rad.ordem, i.n)
          // livro: sem o talento do Ideal, o objetivo dele ainda não existe; o Quinto se perdeu
          const travado = !i.jurado && (i.n === 5 || (talento !== undefined && !temTalentoDoIdeal(ficha, i.n)))
          return (
          <li key={i.n} className={`objetivo${i.jurado ? ' ideal-jurado' : ''}`}>
            <div className="objetivo-cabeca">
              {/* Ideal jurado: o título abre o que ele destravou (texto do talento da ordem) */}
              <span className="objetivo-nome">
                {i.jurado && destrava(i.n).length > 0 ? (
                  <BotaoInfo titulo={t(tx.radiante.nIdeal, { n: i.n })} linhas={destrava(i.n)} nota={t(tx.radiante.oQueDestravou)} />
                ) : (
                  t(tx.radiante.nIdeal, { n: i.n })
                )}
              </span>
            </div>
            {travado ? (
              <p className="proximo">
                {i.n === 5 ? t(tx.radiante.quintoIdealPerdido) : t(tx.radiante.idealPrecisaTalento, { nome: nome(talento?.nome ?? ''), pre: talento?.preRequisitos ?? '' })}
              </p>
            ) : i.jurado ? (
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
            {!travado && (
              <ControleMarcos
                marcos={i.marcos}
                concluido={i.jurado}
                rotuloConcluir={tx.marcos.dizerPalavras}
                rotuloConcluido={tx.marcos.jurado}
                aoMarcar={(marcos) => alterarIdeal(i.n, { marcos })}
                aoConcluir={(jurado) => {
                  alterarIdeal(i.n, { jurado })
                  if (jurado) setJurouAgora(i.n)
                }}
              />
            )}
          </li>
          )
        })}
      </ul>
      {jurouAgora && (
        <Janela titulo={t(tx.radiante.palavrasAceitas)} aoFechar={() => setJurouAgora(null)}>
          <ListaLinhas itens={[t(tx.radiante.potencializadoAteFim), ...destrava(jurouAgora)]} />
        </Janela>
      )}

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
                    <ListaLinhas classe="fluxo-talentos" itens={aprendidos.map((tal) => nome(tal.nome))} />
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
