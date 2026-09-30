/* arquivo: Talentos.tsx */
import { useState } from 'react'
import type { Personagem, Talento } from '../../tipos/personagem'
import {
  CATALOGO_TALENTOS,
  chaveVaga,
  type EscolhaVaga,
  type TipoVaga,
  type VagaTalento,
} from '../../regras/talentos'
import { bonusDeEscolhas } from '../../regras/calculos'
import { ICONE, SIMBOLO_ATIVACAO } from '../../variaveis'
import { vinculosDe } from '../../regras/especialidades'
import { ESPECIALIDADES_CULTURAIS } from '../../regras/especialidadesCulturais'
import {
  ESPECIALIDADES_UTILIDADE_EXEMPLO,
  ESPECIALIDADES_PERITO_EXEMPLO,
} from '../../regras/especialidadesUtilidadePerito'
import { useIdioma } from '../../idioma/IdiomaContexto'

// Aba Talentos — cruza 4 fontes pra cada talento do personagem carregado:
//  1. ficha.talentos          → o que o Shards diz que ele TEM (dado)
//  2. CATALOGO_TALENTOS       → o que o talento FAZ (regra, universal)
//  3. escolhasTalento         → o que o JOGADOR escolheu pras vagas em
//     aberto (ex.: qual perícia recebe o bônus da Erudição) — estado vivo,
//     editável por dropdown, não fica preso a um arquivo de código.
//  4. ficha.pericias/especializacoes → as opções e os valores atuais, ao vivo,
//     complementadas pelos catálogos do livro (culturais fechado; utilidade/
//     perito só exemplos — o livro não fecha essas duas) + "Outra" (texto livre).
// Layout no padrão de lista de talentos/traços, um card por talento.

type Props = {
  ficha: Personagem
  escolhasTalento: Record<string, EscolhaVaga>
  definirEscolhaVaga: (talentoId: string, tipo: TipoVaga, indice: number, valor: string | undefined) => void
}

const GRUPOS: Array<{ origem: Talento['origem']; titulo: 'heroicos' | 'radiantes' | 'ancestrais' }> = [
  { origem: 'heroica', titulo: 'heroicos' },
  { origem: 'radiante', titulo: 'radiantes' },
  { origem: 'ancestral', titulo: 'ancestrais' },
]

const OUTRA = '__outra__'

/** Um campo de vaga (perícia OU especialidade), com estado próprio quando precisa de texto livre. */
function CampoVaga({
  talentoId,
  vaga,
  ficha,
  escolhasTalento,
  definirEscolhaVaga,
}: {
  talentoId: string
  vaga: VagaTalento
  ficha: Personagem
  escolhasTalento: Record<string, EscolhaVaga>
  definirEscolhaVaga: Props['definirEscolhaVaga']
}) {
  const { t, tx, nome } = useIdioma()
  const chave = chaveVaga(talentoId, vaga.tipo, vaga.indice)
  const valorAtual = escolhasTalento[chave]?.valor ?? ''

  if (vaga.tipo === 'pericia') {
    const bonus = valorAtual ? bonusDeEscolhas(valorAtual, escolhasTalento) : 0
    const opcoes = ficha.pericias.filter((p) => (vaga.filtroPericia ? vaga.filtroPericia(p) : true))
    return (
      <label className="talento-vaga">
        <span className="talento-vaga-rotulo">{nome(vaga.rotulo)}</span>
        <select
          className="talento-vaga-select"
          value={valorAtual}
          onChange={(e) => definirEscolhaVaga(talentoId, vaga.tipo, vaga.indice, e.target.value || undefined)}
        >
          <option value="">{tx.geral.nenhuma}</option>
          {opcoes.map((p) => (
            <option key={p.id} value={p.id}>
              {nome(p.nome)}
            </option>
          ))}
        </select>
        {bonus > 0 && <span className="talento-vaga-bonus">{t(tx.talentos.graduacaoBonus, { n: bonus })}</span>}
      </label>
    )
  }

  // tipo === 'especialidade' — mescla o que já está na ficha + catálogo do livro
  const nomesExistentes = new Set(ficha.especializacoes.map((e) => e.nome))
  const culturais = [
    ...ficha.especializacoes.filter((e) => e.tipo === 'cultural').map((e) => e.nome),
    ...ESPECIALIDADES_CULTURAIS.filter((c) => !nomesExistentes.has(c.nome)).map((c) => c.nome),
  ]
  const utilidadePerito = [
    ...ficha.especializacoes.filter((e) => e.tipo === 'utilidade' || e.tipo === 'perito').map((e) => e.nome),
    ...[...ESPECIALIDADES_UTILIDADE_EXEMPLO, ...ESPECIALIDADES_PERITO_EXEMPLO].filter(
      (n) => !nomesExistentes.has(n),
    ),
  ]
  const todasOpcoes = [...culturais, ...utilidadePerito]
  const [modoTexto, setModoTexto] = useState(() => valorAtual !== '' && !todasOpcoes.includes(valorAtual))

  return (
    <label className="talento-vaga">
      <span className="talento-vaga-rotulo">{nome(vaga.rotulo)}</span>
      <select
        className="talento-vaga-select"
        value={modoTexto ? OUTRA : valorAtual}
        onChange={(e) => {
          const v = e.target.value
          if (v === OUTRA) {
            setModoTexto(true)
            definirEscolhaVaga(talentoId, vaga.tipo, vaga.indice, undefined)
          } else {
            setModoTexto(false)
            definirEscolhaVaga(talentoId, vaga.tipo, vaga.indice, v || undefined)
          }
        }}
      >
        <option value="">{tx.geral.nenhuma}</option>
        <optgroup label={tx.talentos.grupoCulturais}>
          {culturais.map((esp) => (
            <option key={esp} value={esp}>
              {nome(esp)}
            </option>
          ))}
        </optgroup>
        <optgroup label={tx.talentos.grupoUtilidadePerito}>
          {utilidadePerito.map((esp) => (
            <option key={esp} value={esp}>
              {nome(esp)}
            </option>
          ))}
        </optgroup>
        <option value={OUTRA}>{tx.talentos.outraDigitar}</option>
      </select>
      {modoTexto && (
        <input
          className="talento-vaga-texto"
          type="text"
          placeholder={tx.talentos.nomeEspecialidade}
          value={valorAtual}
          onChange={(e) => definirEscolhaVaga(talentoId, vaga.tipo, vaga.indice, e.target.value || undefined)}
        />
      )}
    </label>
  )
}

function VagasTalento({
  talentoId,
  vagas,
  ficha,
  escolhasTalento,
  definirEscolhaVaga,
}: {
  talentoId: string
  vagas: VagaTalento[]
  ficha: Personagem
  escolhasTalento: Record<string, EscolhaVaga>
  definirEscolhaVaga: Props['definirEscolhaVaga']
}) {
  return (
    <div className="talento-vagas">
      {vagas.map((vaga) => (
        <CampoVaga
          key={chaveVaga(talentoId, vaga.tipo, vaga.indice)}
          talentoId={talentoId}
          vaga={vaga}
          ficha={ficha}
          escolhasTalento={escolhasTalento}
          definirEscolhaVaga={definirEscolhaVaga}
        />
      ))}
    </div>
  )
}

/** Fallback pra talento SEM vaga editável (ex.: Aquisição Valiosa — sem ambiguidade,
 * o próprio Shards já rotula a origem). Lê o vínculo estático, só leitura. */
function ConcessaoFixa({ id, ficha }: { id: string; ficha: Personagem }) {
  const { t, tx, nome } = useIdioma()
  const vinculo = vinculosDe(ficha.meta.nome)[id]
  if (!vinculo) return null

  const pericias = (vinculo.periciasIds ?? []).map((periciaId) => {
    const p = ficha.pericias.find((x) => x.id === periciaId)
    return p ? t(tx.talentos.comGraduacaoBonus, { nome: nome(p.nome), n: p.graduacaoBonus }) : t(tx.talentos.naoEncontrada, { nome: periciaId })
  })
  const especialidades = (vinculo.especialidades ?? []).map((esp) => {
    const existe = ficha.especializacoes.some((e) => e.nome === esp)
    return existe ? nome(esp) : t(tx.talentos.naoEncontrada, { nome: nome(esp) })
  })

  const itens = [...especialidades, ...pericias]
  if (itens.length === 0) return null

  return (
    <ul className="talento-subitens">
      {itens.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export default function Talentos({ ficha, escolhasTalento, definirEscolhaVaga }: Props) {
  const { t, tx, nome } = useIdioma()
  const { talentos } = ficha

  if (talentos.length === 0) {
    return (
      <div className="secao talentos">
        <p className="proximo">{tx.talentos.nenhumTalento}</p>
      </div>
    )
  }

  return (
    <div className="secao talentos">
      {GRUPOS.map(({ origem, titulo }) => {
        const doGrupo = talentos.filter((tal) => tal.origem === origem)
        if (doGrupo.length === 0) return null
        return (
          <section key={origem} className="grupo-talentos">
            <h2 className="titulo-secao">
              {tx.talentos[titulo]} <span className="contador">({doGrupo.length})</span>
            </h2>
            <ul className="lista-talentos">
              {doGrupo.map((tal) => {
                const info = CATALOGO_TALENTOS[tal.id]
                const nomeExibido = nome(info?.nome ?? tal.nome)
                return (
                  <li className="talento" key={tal.id || tal.nome}>
                    <div className="talento-cabeca">
                      <span className="talento-nome">
                        {tal.chave && <i className="talento-chave-marca">{ICONE.talentoChave}</i>} {nomeExibido}
                        {!info && <i className="talento-sem-traducao"> {tx.talentos.semTraducao}</i>}
                      </span>
                      {info?.fonte && <span className="talento-fonte">{nome(info.fonte)}</span>}
                    </div>

                    {info && (
                      <p className="talento-meta">
                        <span className="talento-ativacao">{SIMBOLO_ATIVACAO[info.ativacao]}</span>
                        {' · '}
                        {t(tx.talentos.preRequisitos, { texto: info.preRequisitos })}
                      </p>
                    )}

                    {info?.descricao ? (
                      <p className="talento-desc">{info.descricao}</p>
                    ) : (
                      <p className="talento-desc talento-desc-vazia">{tx.talentos.semEntradaCatalogo}</p>
                    )}

                    {info?.vagas ? (
                      <VagasTalento
                        talentoId={tal.id}
                        vagas={info.vagas}
                        ficha={ficha}
                        escolhasTalento={escolhasTalento}
                        definirEscolhaVaga={definirEscolhaVaga}
                      />
                    ) : (
                      <ConcessaoFixa id={tal.id} ficha={ficha} />
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
