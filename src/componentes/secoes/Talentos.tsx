/* arquivo: Talentos.tsx */
import { useState } from 'react'
import type { Especializacao, Personagem, Talento, TipoEspecializacao } from '../../tipos/personagem'
import {
  entradaTalento,
  talentosDeFluxo,
  chaveVaga,
  escolhidasNasOutras,
  type EscolhaVaga,
  type TipoVaga,
  type VagaTalento,
} from '../../regras/talentos'
import { bonusDeEscolhas } from '../../regras/calculos'
import { contarTalentos } from '../../regras/contagemTalentos'
import { ICONE, SIMBOLO_ATIVACAO, ORDEM_ESPECIALIDADES } from '../../variaveis'
import { vinculosDe } from '../../regras/especialidades'
import { ESPECIALIDADES_CULTURAIS, indicesDaCultura } from '../../regras/especialidadesCulturais'
import { ARMA_NOME, ARMADURA_NOME } from '../../estado/deparaShards'
import {
  ESPECIALIDADES_UTILIDADE_EXEMPLO,
  ESPECIALIDADES_PERITO_EXEMPLO,
} from '../../regras/especialidadesUtilidadePerito'
import { useIdioma } from '../../idioma/IdiomaContexto'
import PopoverDetalhe from '../PopoverDetalhe'
import BotaoInfo from '../BotaoInfo'
import { emTopicos } from '../../idioma/idioma'

// Aba Talentos — cruza 4 fontes pra cada talento do personagem carregado:
//  1. ficha.talentos          → o que o Shards diz que ele TEM (dado), mais
//     os de fluxo aprendidos (talentosDeFluxo), num grupo próprio
//  2. entradaTalento()        → o que o talento FAZ (regra, universal)
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
  adicionarEspecializacao: (e: Especializacao) => void
  removerEspecializacao: (indice: number) => void
}

const GRUPOS: Array<{ origem: Talento['origem']; titulo: 'heroicos' | 'radiantes' | 'ancestrais' }> = [
  { origem: 'heroica', titulo: 'heroicos' },
  { origem: 'radiante', titulo: 'radiantes' },
  { origem: 'ancestral', titulo: 'ancestrais' },
]

const OUTRA = '__outra__'

/** Sugestões do campo de nome, por categoria — o livro não fecha a lista (só a cultural), então digitar outra vale. */
function sugestoesDe(tipo: TipoEspecializacao): string[] {
  if (tipo === 'cultural') return ESPECIALIDADES_CULTURAIS.map((c) => c.nome)
  if (tipo === 'utilidade') return ESPECIALIDADES_UTILIDADE_EXEMPLO
  if (tipo === 'perito') return ESPECIALIDADES_PERITO_EXEMPLO
  return [...new Set(Object.values(tipo === 'arma' ? ARMA_NOME : ARMADURA_NOME))]
}

/**
 * Especialidades: as que a ficha tem, por categoria, e adicionar/remover avulsa
 * (recompensa, treino, MJ). As culturais da cultura escolhida são fixas. Tocar
 * no número abre a janela com a conta-base do livro — transcrição 03-estatisticas-de-personagem/05-especialidades.md.
 */
function Especialidades({ ficha, adicionar, remover }: { ficha: Personagem; adicionar: Props['adicionarEspecializacao']; remover: Props['removerEspecializacao'] }) {
  const { t, tx, nome } = useIdioma()
  const [verConta, setVerConta] = useState(false)
  const [tipo, setTipo] = useState<TipoEspecializacao>('utilidade')
  const [novo, setNovo] = useState('')
  const fixos = indicesDaCultura(ficha)
  const intelecto = Math.max(0, ficha.atributos.intelecto)
  const lista = ficha.especializacoes

  function enviar(ev: React.FormEvent) {
    ev.preventDefault()
    const n = novo.trim()
    if (n === '' || lista.some((e) => e.tipo === tipo && e.nome === n)) return
    adicionar({ tipo, nome: n })
    setNovo('')
  }

  return (
    <section className="grupo-talentos especialidades">
      <h2 className="titulo-secao">
        {tx.talentos.especialidades}{' '}
        <button className="numero-detalhavel numero-titulo" aria-label={tx.talentos.contaTitulo} aria-expanded={verConta} onClick={() => setVerConta(!verConta)}>
          {lista.length}
        </button>
      </h2>
      {verConta && (
        <PopoverDetalhe
          detalhe={{
            titulo: tx.talentos.contaTitulo,
            linhas: [
              { origem: tx.talentos.contaCulturais, valor: 2 },
              { origem: tx.talentos.contaIntelecto, valor: intelecto },
            ],
            total: 2 + intelecto,
          }}
          nota={
            lista.length > 2 + intelecto
              ? t(tx.talentos.contaAMais, { n: lista.length, dif: lista.length - 2 - intelecto })
              : lista.length < 2 + intelecto
                ? t(tx.talentos.contaAEscolher, { n: lista.length, dif: 2 + intelecto - lista.length })
                : t(tx.talentos.contaEmDia, { n: lista.length })
          }
          aoFechar={() => setVerConta(false)}
        />
      )}
      {/* um grupo por tipo; o índice original vai junto (é o que o remover usa) */}
      {ORDEM_ESPECIALIDADES.filter((c) => lista.some((e) => e.tipo === c)).map((c) => (
        <div key={c}>
          <h3 className="esp-grupo-titulo">{tx.categoriaEspecialidade[c]}</h3>
          <ul className="lista-especialidades">
            {lista
              .map((e, i) => ({ e, i }))
              .filter(({ e }) => e.tipo === c)
              .map(({ e, i }) => (
                <li key={`${e.tipo}:${e.nome}:${i}`}>
                  <span className="esp-nome">{nome(e.nome)}</span>
                  {fixos.has(i) ? (
                    <span className="esp-fixa">{tx.talentos.daCultura}</span>
                  ) : (
                    <button className="esp-remover" aria-label={t(tx.talentos.removerEspecialidade, { nome: nome(e.nome) })} onClick={() => remover(i)}>
                      {ICONE.fechar}
                    </button>
                  )}
                </li>
              ))}
          </ul>
        </div>
      ))}
      <form className="esp-nova" onSubmit={enviar}>
        <select value={tipo} onChange={(ev) => setTipo(ev.target.value as TipoEspecializacao)} aria-label={tx.talentos.especialidades}>
          {ORDEM_ESPECIALIDADES.map((c) => (
            <option key={c} value={c}>
              {tx.categoriaEspecialidade[c]}
            </option>
          ))}
        </select>
        <input list="esp-sugestoes" value={novo} onChange={(ev) => setNovo(ev.target.value)} placeholder={tx.talentos.nomeEspecialidade} />
        <datalist id="esp-sugestoes">
          {sugestoesDe(tipo).map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        <button type="submit" className="esp-adicionar" disabled={novo.trim() === ''}>
          {tx.geral.adicionar}
        </button>
      </form>
      {tipo === 'perito' && <p className="contagem-saldo">{tx.talentos.peritoSoPor}</p>}
    </section>
  )
}

/** Contagem no alto da aba: talentos usados × previstos pela tabela do livro, por categoria (regras/contagemTalentos.ts). */
function ContagemTalentos({ ficha }: { ficha: Personagem }) {
  const { t, tx } = useIdioma()
  const c = contarTalentos(ficha)
  const saldo =
    c.saldo > 0
      ? t(tx.talentos.saldoAEscolher, { n: c.saldo })
      : c.saldo < 0
        ? t(tx.talentos.saldoAMais, { n: -c.saldo })
        : tx.talentos.saldoEmDia
  const linhas = [
    { rotulo: tx.talentos.porNivel, ...c.porNivel },
    {
      rotulo: ficha.meta.ancestralidade === 'Cantor' ? tx.talentos.ancestralidadeCantor : tx.talentos.ancestralidadeHeroica,
      ...c.ancestralidade,
    },
  ]
  return (
    <section className="quadro-resumo contagem-talentos" aria-label={tx.talentos.contagem}>
      <h2 className="titulo-secao">{tx.talentos.contagem}</h2>
      <dl>
        {linhas.map(({ rotulo, usados, previstos }) => (
          <div key={rotulo}>
            <dt>{rotulo}</dt>
            <dd>{t(tx.talentos.deTotal, { usados, previstos })}</dd>
          </div>
        ))}
      </dl>
      <p className="contagem-saldo">{saldo}</p>
    </section>
  )
}

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
    // livro: duas vagas de perícia são duas perícias diferentes — a outra vaga já escolheu, sai da lista
    const usadas = escolhidasNasOutras(talentoId, vaga, escolhasTalento)
    const opcoes = ficha.pericias.filter((p) => (vaga.filtroPericia ? vaga.filtroPericia(p) : true) && !usadas.has(p.id))
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

  // tipo === 'especialidade' — o livro: "uma especialidade (dos tipos que o talento aceita) que
  // ainda não possui". Sai o que a ficha já tem e o que outra vaga escolheu; a escolha atual fica
  // (o Shards costuma listar a especialidade concedida junto das outras)
  const aceita = (tipo: TipoEspecializacao) => !vaga.tiposEspecialidade || vaga.tiposEspecialidade.includes(tipo)
  const usadasEsp = escolhidasNasOutras(talentoId, vaga, escolhasTalento)
  const nomesExistentes = new Set(ficha.especializacoes.map((e) => e.nome))
  const doTipo = (tipo: TipoEspecializacao, exemplos: string[]) => {
    if (!aceita(tipo)) return []
    const atual = valorAtual && (exemplos.includes(valorAtual) || ficha.especializacoes.some((e) => e.tipo === tipo && e.nome === valorAtual)) ? [valorAtual] : []
    return [...atual, ...exemplos.filter((n) => n !== valorAtual && !nomesExistentes.has(n) && !usadasEsp.has(n))]
  }
  const culturais = doTipo('cultural', ESPECIALIDADES_CULTURAIS.map((c) => c.nome))
  const utilidade = doTipo('utilidade', ESPECIALIDADES_UTILIDADE_EXEMPLO)
  const perito = doTipo('perito', ESPECIALIDADES_PERITO_EXEMPLO)
  const todasOpcoes = [...culturais, ...utilidade, ...perito]
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
        {[
          [tx.talentos.grupoCulturais, culturais],
          [tx.talentos.grupoUtilidade, utilidade],
          [tx.talentos.grupoPerito, perito],
        ]
          .filter(([, lista]) => lista.length > 0)
          .map(([rotulo, lista]) => (
            <optgroup key={rotulo as string} label={rotulo as string}>
              {(lista as string[]).map((esp) => (
                <option key={esp} value={esp}>
                  {nome(esp)}
                </option>
              ))}
            </optgroup>
          ))}
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

export default function Talentos({ ficha, escolhasTalento, definirEscolhaVaga, adicionarEspecializacao, removerEspecializacao }: Props) {
  const { t, tx, nome } = useIdioma()
  const { talentos } = ficha
  const grupos = [
    ...GRUPOS.map(({ origem, titulo }) => ({ chave: origem, titulo, lista: talentos.filter((tal) => tal.origem === origem) })),
    { chave: 'fluxo', titulo: 'deFluxo' as const, lista: talentosDeFluxo(ficha) },
  ]

  if (grupos.every((g) => g.lista.length === 0)) {
    return (
      <div className="secao talentos">
        <p className="proximo">{tx.talentos.nenhumTalento}</p>
      </div>
    )
  }

  return (
    <div className="secao talentos">
      <ContagemTalentos ficha={ficha} />
      <Especialidades ficha={ficha} adicionar={adicionarEspecializacao} remover={removerEspecializacao} />
      {grupos.map(({ chave, titulo, lista: doGrupo }) => {
        if (doGrupo.length === 0) return null
        return (
          <section key={chave} className="grupo-talentos">
            <h2 className="titulo-secao">
              {tx.talentos[titulo]} <span className="contador">({doGrupo.length})</span>
            </h2>
            <ul className="lista-talentos">
              {doGrupo.map((tal) => {
                const info = entradaTalento(tal)
                const nomeExibido = nome(info?.nome ?? tal.nome)
                return (
                  <li className="talento" key={tal.id || tal.nome}>
                    <div className="talento-cabeca">
                      <span className="talento-nome">
                        {tal.chave && <i className="talento-chave-marca">{ICONE.talentoChave}</i>}{' '}
                        {/* o texto do livro mora no nome (botão de informação) */}
                        {info?.descricao ? <BotaoInfo titulo={nomeExibido} linhas={emTopicos(info.descricao)} /> : nomeExibido}
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

                    {!info?.descricao && <p className="talento-desc talento-desc-vazia">{tx.talentos.semEntradaCatalogo}</p>}

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
