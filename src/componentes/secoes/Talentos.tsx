/* arquivo: Talentos.tsx */
import { useState } from 'react'
import type { Personagem, Talento } from '../../tipos/personagem'
import {
  CATALOGO_TALENTOS,
  SIMBOLO_ATIVACAO,
  chaveVaga,
  type EscolhaVaga,
  type TipoVaga,
  type VagaTalento,
} from '../../regras/talentos'
import { bonusDeEscolhas } from '../../regras/calculos'
import { VINCULO_TALENTO_ECCHO } from '../../regras/especialidades'
import { ESPECIALIDADES_CULTURAIS } from '../../regras/especialidadesCulturais'
import {
  ESPECIALIDADES_UTILIDADE_EXEMPLO,
  ESPECIALIDADES_PERITO_EXEMPLO,
} from '../../regras/especialidadesUtilidadePerito'

// Aba Talentos — cruza 4 fontes pra cada talento do Eccho:
//  1. ficha.talentos          → o que o Shards diz que ele TEM (dado)
//  2. CATALOGO_TALENTOS       → o que o talento FAZ (regra, universal)
//  3. escolhasTalento         → o que o JOGADOR escolheu pras vagas em
//     aberto (ex.: qual perícia recebe o bônus da Erudição) — estado vivo,
//     editável por dropdown, não fica preso a um arquivo de código.
//  4. ficha.pericias/especializacoes → as opções e os valores atuais, ao vivo,
//     complementadas pelos catálogos do livro (culturais fechado; utilidade/
//     perito só exemplos — o livro não fecha essas duas) + "Outra" (texto livre).
// Layout inspirado no DDB "Features & Traits" (referencia/ddb/ddb-13 a 18).

type Props = {
  ficha: Personagem
  escolhasTalento: Record<string, EscolhaVaga>
  definirEscolhaVaga: (talentoId: string, tipo: TipoVaga, indice: number, valor: string | undefined) => void
}

const GRUPOS: Array<{ origem: Talento['origem']; titulo: string }> = [
  { origem: 'heroica', titulo: 'Heroicos' },
  { origem: 'radiante', titulo: 'Radiantes' },
  { origem: 'ancestral', titulo: 'Ancestrais' },
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
  const chave = chaveVaga(talentoId, vaga.tipo, vaga.indice)
  const valorAtual = escolhasTalento[chave]?.valor ?? ''

  if (vaga.tipo === 'pericia') {
    const bonus = valorAtual ? bonusDeEscolhas(valorAtual, escolhasTalento) : 0
    const opcoes = ficha.pericias.filter((p) => (vaga.filtroPericia ? vaga.filtroPericia(p) : true))
    return (
      <label className="talento-vaga">
        <span className="talento-vaga-rotulo">{vaga.rotulo}</span>
        <select
          className="talento-vaga-select"
          value={valorAtual}
          onChange={(e) => definirEscolhaVaga(talentoId, vaga.tipo, vaga.indice, e.target.value || undefined)}
        >
          <option value="">— Nenhuma —</option>
          {opcoes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
        {bonus > 0 && <span className="talento-vaga-bonus">+{bonus} graduação</span>}
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
    ...ficha.especializacoes.filter((e) => e.tipo === 'especialista').map((e) => e.nome),
    ...[...ESPECIALIDADES_UTILIDADE_EXEMPLO, ...ESPECIALIDADES_PERITO_EXEMPLO].filter(
      (n) => !nomesExistentes.has(n),
    ),
  ]
  const todasOpcoes = [...culturais, ...utilidadePerito]
  const [modoTexto, setModoTexto] = useState(() => valorAtual !== '' && !todasOpcoes.includes(valorAtual))

  return (
    <label className="talento-vaga">
      <span className="talento-vaga-rotulo">{vaga.rotulo}</span>
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
        <option value="">— Nenhuma —</option>
        <optgroup label="Culturais">
          {culturais.map((nome) => (
            <option key={nome} value={nome}>
              {nome}
            </option>
          ))}
        </optgroup>
        <optgroup label="Utilidade / Perito (exemplos do livro)">
          {utilidadePerito.map((nome) => (
            <option key={nome} value={nome}>
              {nome}
            </option>
          ))}
        </optgroup>
        <option value={OUTRA}>Outra (digitar)…</option>
      </select>
      {modoTexto && (
        <input
          className="talento-vaga-texto"
          type="text"
          placeholder="Nome da especialidade"
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
  const vinculo = VINCULO_TALENTO_ECCHO[id]
  if (!vinculo) return null

  const pericias = (vinculo.periciasIds ?? []).map((periciaId) => {
    const p = ficha.pericias.find((x) => x.id === periciaId)
    return p ? `${p.nome} (+${p.graduacaoBonus} graduação bônus)` : `${periciaId} (não encontrada na ficha atual)`
  })
  const especialidades = (vinculo.especialidades ?? []).map((nome) => {
    const existe = ficha.especializacoes.some((e) => e.nome === nome)
    return existe ? nome : `${nome} (não encontrada na ficha atual)`
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
  const { talentos } = ficha

  if (talentos.length === 0) {
    return (
      <div className="secao talentos">
        <p className="proximo">Nenhum talento veio no JSON deste personagem.</p>
      </div>
    )
  }

  return (
    <div className="secao talentos">
      {GRUPOS.map(({ origem, titulo }) => {
        const doGrupo = talentos.filter((t) => t.origem === origem)
        if (doGrupo.length === 0) return null
        return (
          <section key={origem} className="grupo-talentos">
            <h2 className="titulo-secao">
              {titulo} <span className="contador">({doGrupo.length})</span>
            </h2>
            <ul className="lista-talentos">
              {doGrupo.map((t) => {
                const info = CATALOGO_TALENTOS[t.id]
                const nomeExibido = info?.nome ?? t.nome
                return (
                  <li className="talento" key={t.id || t.nome}>
                    <div className="talento-cabeca">
                      <span className="talento-nome">
                        {t.chave && <i className="talento-chave-marca">★</i>} {nomeExibido}
                        {!info && <i className="talento-sem-traducao"> (sem tradução)</i>}
                      </span>
                      {info?.fonte && <span className="talento-fonte">{info.fonte}</span>}
                    </div>

                    {info && (
                      <p className="talento-meta">
                        <span className="talento-ativacao">{SIMBOLO_ATIVACAO[info.ativacao]}</span>
                        {' · Pré-requisitos: '}
                        {info.preRequisitos}
                      </p>
                    )}

                    {info?.descricao ? (
                      <p className="talento-desc">{info.descricao}</p>
                    ) : (
                      <p className="talento-desc talento-desc-vazia">(ainda sem entrada no catálogo)</p>
                    )}

                    {info?.vagas ? (
                      <VagasTalento
                        talentoId={t.id}
                        vagas={info.vagas}
                        ficha={ficha}
                        escolhasTalento={escolhasTalento}
                        definirEscolhaVaga={definirEscolhaVaga}
                      />
                    ) : (
                      <ConcessaoFixa id={t.id} ficha={ficha} />
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
