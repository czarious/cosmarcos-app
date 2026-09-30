/* arquivo: Radiante.tsx */
import { useState } from 'react'
import type { Personagem, Ideal, Fluxo, Pericia } from '../../tipos/personagem'
import type { EscolhaVaga } from '../../regras/talentos'
import { detalhePericia, type DetalhePericia } from '../../regras/calculos'
import ControleMarcos from '../ControleMarcos'
import PopoverDetalhe from '../PopoverDetalhe'
import { ATRIBUTO, ICONE, SIMBOLO_ATIVACAO } from '../../variaveis'

// Aba Radiante — o vínculo: ordem, espreno, os Ideais (cada um é um objetivo
// de 3 marcos — livro, "Jurando Ideais") e os fluxos. Fluxo é PERÍCIA pro
// livro ("Usando Fluxos": atributo + graduações, mesmo teste de qualquer
// perícia) — por isso o total sai do mesmo detalhePericia da aba Perícias.

type Props = {
  ficha: Personagem
  escolhasTalento: Record<string, EscolhaVaga>
  alterarIdeal: (n: Ideal['n'], muda: Partial<Ideal>) => void
}

const ORDINAL = ['', '1º', '2º', '3º', '4º', '5º']

/** Fluxo no formato de perícia — o livro manda contar igual. */
function comoPericia(f: Fluxo): Pericia {
  return { id: f.id, nome: f.nome, atributo: f.atributo, graduacao: f.graduacao, graduacaoBonus: 0, misc: 0 }
}

export default function Radiante({ ficha, escolhasTalento, alterarIdeal }: Props) {
  const [detalhe, setDetalhe] = useState<DetalhePericia | null>(null)
  const rad = ficha.radiante

  if (!rad) {
    return (
      <div className="em-breve">
        <p>{ficha.meta.nome} ainda não é Radiante.</p>
        <p className="proximo">A aba se preenche quando o Shards trouxer a ordem e o vínculo com o espreno.</p>
      </div>
    )
  }

  return (
    <div className="secao radiante">
      <h2 className="titulo-secao">Vínculo</h2>
      <dl className="pg-dados">
        <div>
          <dt>Ordem</dt>
          <dd>{rad.ordem}</dd>
        </div>
        <div>
          <dt>Espreno</dt>
          <dd>
            {rad.spren.nome} — {rad.spren.tipo}
            {rad.spren.iluminado ? ' · iluminado' : ''}
          </dd>
        </div>
        <div>
          <dt>Alcance do vínculo</dt>
          <dd>{String(rad.alcanceSpren).replace('.', ',')} m</dd>
        </div>
      </dl>

      <h2 className="titulo-secao">Ideais</h2>
      <ul className="lista-objetivos">
        {rad.ideais.map((i) => (
          <li key={i.n} className={`objetivo${i.jurado ? ' ideal-jurado' : ''}`}>
            <div className="objetivo-cabeca">
              <span className="objetivo-nome">{ORDINAL[i.n]} Ideal</span>
            </div>
            {i.jurado ? (
              i.texto && <blockquote className="ideal-palavras">{i.texto}</blockquote>
            ) : (
              <textarea
                className="cr-input ideal-texto"
                defaultValue={i.texto}
                placeholder="As Palavras (ou a aspiração) deste Ideal"
                aria-label={`Palavras do ${ORDINAL[i.n]} Ideal`}
                rows={2}
                onBlur={(e) => e.target.value !== i.texto && alterarIdeal(i.n, { texto: e.target.value.trim() })}
              />
            )}
            <ControleMarcos
              marcos={i.marcos}
              concluido={i.jurado}
              rotuloConcluir="Dizer as Palavras"
              rotuloConcluido="Jurado"
              aoMarcar={(marcos) => alterarIdeal(i.n, { marcos })}
              aoConcluir={(jurado) => alterarIdeal(i.n, { jurado })}
            />
          </li>
        ))}
      </ul>
      <p className="proximo">
        Cada Ideal é um objetivo de 3 marcos de história. Com os 3, as Palavras podem ser ditas quando a cena pedir — e
        o Mestre as aceita. Os efeitos do talento do Ideal continuam no Shards.
      </p>

      {rad.fluxos.length > 0 && (
        <>
          <h2 className="titulo-secao">Fluxos</h2>
          <ul className="lista-pericias">
            {rad.fluxos.map((f) => {
              const d = detalhePericia(comoPericia(f), ficha, escolhasTalento)
              const aprendidos = f.talentos.filter((t) => t.aprendido)
              return (
                <li className="linha-pericia" key={f.id}>
                  <span className="pericia-graduacao" aria-label={`graduação ${f.graduacao}`}>
                    {Array.from({ length: Math.max(2, f.graduacao) }, (_, k) => (
                      <i key={k} className={k < f.graduacao ? 'grad-cheia' : 'grad-vazia'}>
                        {k < f.graduacao ? ICONE.graduacaoCheia : ICONE.graduacaoVazia}
                      </i>
                    ))}
                  </span>
                  <span className="pericia-nome">
                    {f.nome} <small className="fluxo-meta">({ATRIBUTO[f.atributo].abrev}) {SIMBOLO_ATIVACAO[f.ativacao]}</small>
                    {aprendidos.length > 0 && (
                      <small className="fluxo-talentos">{aprendidos.map((t) => t.nome).join(' · ')}</small>
                    )}
                  </span>
                  <button
                    className="numero-detalhavel pericia-total"
                    onClick={() => setDetalhe(d)}
                    aria-label={`${f.nome}, total ${d.total}. Ver de onde vem`}
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
