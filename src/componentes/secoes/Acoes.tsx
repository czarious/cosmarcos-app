/* arquivo: Acoes.tsx */
import { useState } from 'react'
import type { Personagem, Pericia, Fluxo, Fabrial } from '../../tipos/personagem'
import { CATALOGO_TALENTOS, acoesDeTalentos, type EscolhaVaga } from '../../regras/talentos'
import { SIMBOLO_ATIVACAO, SIMBOLO_RECURSO } from '../../variaveis'
import {
  ACOES_PADRAO,
  ACOES_CONCEDIDAS,
  ACOES_ESPRENO,
  ordenarPorAtivacao,
  compararAtivacao,
  type EntradaAcao,
} from '../../regras/acoes'
import {
  totalPericia,
  periciaPorNome,
  detalhePericia,
  alteradoPorCondicao,
  fluxoComoPericia,
} from '../../regras/calculos'
import type { UsoPericia } from '../../regras/condicoes'
import { avaliar, custoEfetivo, golpesDaArma, usavelDe, type AcaoUsavel } from '../../regras/turno'
import { ESCALONAMENTO_FLUXO, GUIAS_FLUXO, NOTAS_FLUXO } from '../../regras/fluxos'
import { ativacaoDoFabrial, fabrialDaArma, usosDoFabrial } from '../../regras/fabriais'
import type { Turno } from '../../estado/useTurno'
import PopoverDetalhe from '../PopoverDetalhe'
import BotaoInfo from '../BotaoInfo'
import { emTopicos } from '../../idioma/idioma'
import { tracoPorNome } from '../../regras/tracos'
import ChipRegra from '../ChipRegra'
import { notaPeritoDaArma } from '../regraDoLivro'
import DialogoUso, { precisaDialogo } from '../DialogoUso'
import ControleRecurso from '../ControleRecurso'
import { IniciarCombate } from '../PainelTurno'
import { useIdioma } from '../../idioma/IdiomaContexto'

// Aba Ações — tudo que o personagem pode FAZER, olhando a ficha inteira, e
// cada item com o botão "Usar" ligado ao rastreador de turno (PainelTurno):
// usar desconta ▶/↻ e paga Foco, Investidura ou carga na hora.
//  1. Ataques: armas EQUIPADAS (Inventário) — cada ataque é um Golpear
//  2. Fluxos: se Radiante — total do teste, custo e o guia de uso (regras/fluxos.ts)
//  3. Ações de Luz das Tempestades: as que algum talento concede
//  3b. Talentos: os de ação (▶ ▷ ↻) que o personagem tem — custo em regras/talentos.ts
//  4. Ações / Reações: as 17 padrão (Cap. 10)
//  5. Fabriais: os que se ativam em combate gastando carga
//  6. Habilidades de Espreno: se Radiante vinculado
// A linha que não dá pra usar agora fica apagada, com o motivo — o que sobra
// aceso é a lista do que dá pra fazer com as ▶ que restam.

type Props = {
  ficha: Personagem
  escolhasTalento: Record<string, EscolhaVaga>
  /** O ± das cargas de uma arma-fabrial, aqui mesmo — é o mesmo fabrial da aba Fabriais. */
  alterarCargas: (idFabrial: string, delta: number) => void
  turno: Turno
}

const GOLPEAR = usavelDe('padrao', ACOES_PADRAO.find((a) => a.nome === 'Golpear')!)

/** Os ataques de uma arma pela regra das mãos (regras/turno.ts → golpesDaArma); arma-fabrial dispara pela carga. */
function ataquesDaArma(arma: Personagem['armas'][number], fab: Fabrial | undefined) {
  const disparos = fab ? usosDoFabrial(fab).filter((u) => u.tipo === 'ataque').map((u) => ({ rotulo: u.rotulo, idFabrial: fab.id, custo: u.custo })) : []
  return golpesDaArma(GOLPEAR, arma.nome, arma.tracos, disparos)
}

/** Os 3 recursos do bloco de custo, nesta ordem em todo botão — Vida ainda não tem ação que gaste, mas a vaga fica. */
const RECURSOS_DO_CUSTO = ['foco', 'vida', 'investidura'] as const

export default function Acoes({ ficha, escolhasTalento, alterarCargas, turno }: Props) {
  const { t, tx, nome } = useIdioma()
  const armasEquipadas = ficha.armas.filter((a) => a.equipada)
  // Acerto é TESTE (Exausto conta); dano não é (regras/condicoes.ts → UsoPericia).
  const [detalheAberto, setDetalheAberto] = useState<{ pericia: Pericia; uso: UsoPericia } | null>(null)
  const [pedindo, setPedindo] = useState<AcaoUsavel | null>(null)
  const [cargasDe, setCargasDe] = useState<string | null>(null)

  function tocarUsar(acao: AcaoUsavel) {
    if (precisaDialogo(acao)) setPedindo(acao)
    else turno.adicionar(acao)
  }
  const ctx: Ctx = { ficha, turno, escolhasTalento, tocarUsar, abrirDetalhe: (p) => setDetalheAberto({ pericia: p, uso: 'teste' }) }

  const acoesConcedidas = ficha.talentos
    .filter((tal) => CATALOGO_TALENTOS[tal.id] && ACOES_CONCEDIDAS[tal.id])
    .flatMap((tal) => ACOES_CONCEDIDAS[tal.id].map((acao) => ({ acao, deTalento: CATALOGO_TALENTOS[tal.id].nome })))
    .sort((a, b) => compararAtivacao(a.acao.ativacao, b.acao.ativacao))
  const acoesTalentos = acoesDeTalentos(ficha).sort((a, b) => compararAtivacao(a.acao.ativacao, b.acao.ativacao))

  const acoesPadraoAcao = ordenarPorAtivacao(ACOES_PADRAO.filter((a) => a.ativacao !== 'reacao'))
  const acoesPadraoReacao = ordenarPorAtivacao(ACOES_PADRAO.filter((a) => a.ativacao === 'reacao'))
  const espreno = ordenarPorAtivacao(ACOES_ESPRENO)
  const fabriaisDeCombate = ficha.fabriais.filter((f) => ativacaoDoFabrial(f))

  return (
    <div className="secao acoes">
      <IniciarCombate turno={turno} />
      <section className="grupo-acoes">
        <h2 className="titulo-secao">
          {t(tx.acoes.ataques)} <span className="contador">({armasEquipadas.length})</span>
        </h2>
        {armasEquipadas.length === 0 ? (
          <p className="proximo">{t(tx.acoes.nenhumaArmaEquipadaVa)}</p>
        ) : (
          // Um cartão por arma, no molde do D&D Beyond (pedido 27): nome e munição
          // no alto, Alcance/Acerto/Dano em colunas, as ações em linhas de lista.
          <div className="tabela-ataques">
            {armasEquipadas.map((a) => {
              const pericia = periciaPorNome(a.pericia, ficha)
              if (!pericia) {
                return (
                  <p className="ataque-erro" key={a.nome}>
                    {t(tx.acoes.armaPericiaPericiaNao, { arma: nome(a.nome), pericia: nome(a.pericia) })}
                  </p>
                )
              }
              const acerto = totalPericia(pericia, ficha, escolhasTalento, 'teste')
              const dano = totalPericia(pericia, ficha, escolhasTalento, 'dano')
              const marca = (uso: UsoPericia) => (alteradoPorCondicao(pericia, ficha, uso) ? ' numero-alterado' : '')
              const categoria = a.alcance.startsWith('Corpo a corpo') ? tx.acoes.armaCorpoACorpo : tx.acoes.armaADistancia
              const fab = fabrialDaArma(a.nome, ficha)
              return (
                <div className="ataque-cartao" key={a.nome}>
                  <div className="ataque-topo">
                    <div className="linha-ataque-nome">
                      <span className="ataque-nome">
                        {/* o que a especialidade muda na arma e não é um traço: o nome abre (regraDoLivro.ts) */}
                        {notaPeritoDaArma(a.nome, { t, tx, nome }).length > 0 ? (
                          <BotaoInfo titulo={nome(a.nome)} linhas={notaPeritoDaArma(a.nome, { t, tx, nome })} />
                        ) : (
                          nome(a.nome)
                        )}
                      </span>
                      <span className="ataque-categoria">{categoria}</span>
                    </div>
                    {/* munição/cargas no alto, à mão (pedido 27) */}
                    {fab && (
                      <button className="fab-cargas-botao" onClick={() => setCargasDe(fab.id)} aria-label={t(tx.fabriais.cargasDe, { nome: nome(fab.nome) })}>
                        {SIMBOLO_RECURSO.cargas} {fab.cargas.atual}
                        <small>/{fab.cargas.max}</small>
                      </button>
                    )}
                  </div>
                  <div className="ataque-colunas">
                    <span className="ataque-coluna">
                      <span className="ataque-coluna-rotulo">{t(tx.acoes.alcance)}</span>
                      <span className="ataque-coluna-valor">{nome(a.alcance)}</span>
                    </span>
                    <span className="ataque-coluna">
                      <span className="ataque-coluna-rotulo">{t(tx.acoes.acerto)}</span>
                      <span className="numero-linha">
                        <span className="dado-futuro">d20</span>
                        <button className={`numero-detalhavel${marca('teste')}`} onClick={() => setDetalheAberto({ pericia, uso: 'teste' })}>
                          {acerto >= 0 ? '+' : ''}
                          {acerto}
                        </button>
                      </span>
                    </span>
                    <span className="ataque-coluna">
                      <span className="ataque-coluna-rotulo">{t(tx.acoes.dano)}</span>
                      <span className="numero-linha">
                        <span className="dado-futuro">{a.dano}</span>
                        <button className={`numero-detalhavel${marca('dano')}`} onClick={() => setDetalheAberto({ pericia, uso: 'dano' })}>
                          {dano >= 0 ? '+' : ''}
                          {dano}
                        </button>
                      </span>
                      <span className="tipo-dano">{nome(a.tipoDano)}</span>
                    </span>
                  </div>
                  {(a.tracos.length > 0 || a.tracosPerito.length > 0) && (
                    // cada traço é um chip que abre a regra dele (regras/tracos.ts)
                    <ul className="lista-chips ataque-tracos">
                      {a.tracos.map((tr) => (
                        <ChipRegra key={tr} nome={nome(tr)} regra={tracoPorNome(tr)?.resumo} />
                      ))}
                      {a.tracosPerito.map((tr) => (
                        <ChipRegra key={tr} nome={nome(tr)} regra={tracoPorNome(tr)?.resumo} nota={t(tx.acoes.tracoPeritoNota)} destaque />
                      ))}
                    </ul>
                  )}
                  <ul className="ataque-acoes">
                    {/* uma vez pela mão principal e uma pela inábil (−2 foco, −1 com o traço Mão Inábil) */}
                    {ataquesDaArma(a, fab).map(({ acao, rotulo, mao }) => (
                      <BotaoUsar
                        ctx={ctx}
                        key={`${rotulo}-${mao}`}
                        acao={acao}
                        rotulo={mao === 'inabil' ? `${nome(rotulo)} · ${tx.acoes.maoInabil}` : nome(rotulo)}
                      />
                    ))}
                    {/* carga "ao acertar" (Dorial): só depois de um ataque com esta arma, uma por ataque */}
                    {fab &&
                      usosDoFabrial(fab)
                        .filter((u) => u.tipo === 'aoAcertar')
                        .map((u) => (
                          <BotaoUsar
                            ctx={ctx}
                            key={u.rotulo}
                            acao={{
                              chave: `acerto:${a.nome}:${u.rotulo}`,
                              nome: u.rotulo,
                              alvo: a.nome,
                              ativacao: 'especial',
                              cargas: { idFabrial: fab.id, qtd: u.custo },
                              depoisDe: `arma:${a.nome}`,
                              repetivel: true,
                            }}
                            rotulo={nome(u.rotulo)}
                          />
                        ))}
                  </ul>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {ficha.radiante && ficha.radiante.fluxos.length > 0 && (
        <section className="grupo-acoes">
          <h2 className="titulo-secao">{t(tx.acoes.fluxos)}</h2>
          <ul className="lista-ataques">
            {ficha.radiante.fluxos.map((f) => (
              <CartaoFluxo ctx={ctx} key={f.id} fluxo={f} />
            ))}
          </ul>
        </section>
      )}

      {/* condicional: só aparece se algum talento do personagem concede */}
      {acoesConcedidas.length > 0 && (
        <section className="grupo-acoes">
          <h2 className="titulo-secao">{t(tx.acoes.acoesLuzTempestades)}</h2>
          <ul className="lista-acoes-padrao">
            {acoesConcedidas.map(({ acao, deTalento }) => (
              <LinhaAcao ctx={ctx} key={acao.nome} acao={acao} grupo="luz" extra={deTalento} />
            ))}
          </ul>
        </section>
      )}

      {acoesTalentos.length > 0 && (
        <section className="grupo-acoes">
          <h2 className="titulo-secao">
            {t(tx.acoes.talentos)} <span className="contador">({acoesTalentos.length})</span>
          </h2>
          <ul className="lista-acoes-padrao">
            {acoesTalentos.map(({ acao, deTalento }) => (
              <LinhaAcao ctx={ctx} key={acao.nome} acao={acao} grupo="talento" extra={deTalento} />
            ))}
          </ul>
        </section>
      )}

      <section className="grupo-acoes">
        <h2 className="titulo-secao">{t(tx.acoes.acoes)}</h2>
        <ul className="lista-acoes-padrao">
          {acoesPadraoAcao.map((acao) => (
            <LinhaAcao ctx={ctx} key={acao.nome} acao={acao} grupo="padrao" />
          ))}
        </ul>
      </section>

      <section className="grupo-acoes">
        <h2 className="titulo-secao">{t(tx.acoes.reacoes)}</h2>
        <ul className="lista-acoes-padrao">
          {acoesPadraoReacao.map((acao) => (
            <LinhaAcao ctx={ctx} key={acao.nome} acao={acao} grupo="padrao" />
          ))}
        </ul>
      </section>

      {fabriaisDeCombate.length > 0 && (
        <section className="grupo-acoes">
          <h2 className="titulo-secao">{t(tx.acoes.fabriais)}</h2>
          <ul className="lista-acoes-padrao">
            {fabriaisDeCombate.map((f) => {
              const usavel: AcaoUsavel = { chave: `fabrial:${f.id}`, nome: f.nome, ativacao: ativacaoDoFabrial(f)!, cargas: { idFabrial: f.id, qtd: 1 } }
              return (
                <li className={avaliar(usavel, turno.simulacao?.estado ?? null, turno.simulacao?.ficha ?? ficha).pode ? 'acao-padrao' : 'acao-padrao acao-apagada'} key={f.id}>
                  <div className="acao-corpo">
                    <span className="acao-padrao-nome">{nome(f.nome)}</span>
                    <p className="acao-padrao-resumo">
                      {SIMBOLO_RECURSO.cargas} {f.cargas.atual}/{f.cargas.max} — {t(tx.acoes.detalheAbaFabriais)}
                    </p>
                    <ul className="ataque-acoes">
                      <BotaoUsar ctx={ctx} acao={usavel} />
                    </ul>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* condicional: só aparece se o personagem for Radiante vinculado */}
      {ficha.radiante && (
        <section className="grupo-acoes">
          <h2 className="titulo-secao">{t(tx.acoes.habilidadesEspreno)}</h2>
          <ul className="lista-acoes-padrao">
            {espreno.map((acao) => (
              <LinhaAcao ctx={ctx} key={acao.nome} acao={acao} grupo="espreno" />
            ))}
          </ul>
        </section>
      )}

      {detalheAberto && (
        <PopoverDetalhe
          detalhe={detalhePericia(detalheAberto.pericia, ficha, escolhasTalento, detalheAberto.uso)}
          aoFechar={() => setDetalheAberto(null)}
        />
      )}
      {cargasDe &&
        (() => {
          const fab = ficha.fabriais.find((x) => x.id === cargasDe)
          return fab ? (
            <ControleRecurso qual="cargas" de={nome(fab.nome)} recurso={fab.cargas} alterar={(delta) => alterarCargas(fab.id, delta)} aoFechar={() => setCargasDe(null)} />
          ) : null
        })()}
      {pedindo && (
        <DialogoUso
          acao={pedindo}
          ficha={ficha}
          estado={turno.estado}
          aoFechar={() => setPedindo(null)}
          aoUsar={(extra) => {
            turno.adicionar(pedindo, extra)
            setPedindo(null)
          }}
        />
      )}
    </div>
  )
}

/** O que as peças da aba precisam do componente principal. */
type Ctx = {
  ficha: Personagem
  turno: Turno
  escolhasTalento: Record<string, EscolhaVaga>
  tocarUsar: (acao: AcaoUsavel) => void
  abrirDetalhe: (p: Pericia) => void
}

/**
 * O "Usar" de toda ação da aba — linha de lista, no molde do D&D Beyond
 * (pedido 27): o tipo da ação grande à esquerda, o nome, e à direita SÓ o custo
 * que existe (já com o Focado aplicado; carga de fabrial por último). O motivo
 * aparece embaixo quando não dá. Sempre dentro de um <ul className="ataque-acoes">.
 */
function BotaoUsar({ ctx, acao, rotulo }: { ctx: Ctx; acao: AcaoUsavel; rotulo?: string }) {
  const { ficha, turno, tocarUsar } = ctx
  const { t, tx, msg } = useIdioma()
  const av = avaliar(acao, turno.simulacao?.estado ?? null, turno.simulacao?.ficha ?? ficha)
  const c = custoEfetivo(acao, ficha)
  const custo = { foco: c.foco ?? 0, vida: 0, investidura: c.investidura ?? 0 }
  const custos = RECURSOS_DO_CUSTO.filter((r) => custo[r] > 0)
  return (
    <li className="usar-linha-item">
      <button className="usar-linha" disabled={!av.pode} onClick={() => tocarUsar(acao)}>
        <span className="usar-linha-ativacao" aria-hidden>
          {SIMBOLO_ATIVACAO[acao.ativacao]}
        </span>
        <span className="usar-linha-nome">{rotulo ?? tx.acoes.usar}</span>
        {custos.map((r) => (
          <span key={r} className={`usar-linha-custo custo-${r}`}>
            {SIMBOLO_RECURSO[r]}
            {custo[r]}
          </span>
        ))}
        {acao.cargas && (
          <span className="usar-linha-custo custo-cargas">
            −{acao.cargas.qtd} {SIMBOLO_RECURSO.cargas}
          </span>
        )}
      </button>
      {!av.pode && av.motivo && <small className="usar-motivo">{msg(av.motivo)}</small>}
      {av.daPreparada && <small className="usar-motivo">{t(tx.acoes.daPreparada)}</small>}
    </li>
  )
}

function LinhaAcao({ ctx, acao, grupo, extra }: { ctx: Ctx; acao: EntradaAcao; grupo: string; extra?: string }) {
  const { ficha, turno } = ctx
  const { t, tx, nome } = useIdioma()
  const usavel = usavelDe(grupo, acao)
  const apagada = !avaliar(usavel, turno.simulacao?.estado ?? null, turno.simulacao?.ficha ?? ficha).pode
  return (
    // o tipo da ação (▶ ↻ ▷) aparece no bloco de custo do botão — não repete na linha
    <li className={apagada ? 'acao-padrao acao-apagada' : 'acao-padrao'}>
      <div className="acao-corpo">
        {/* a descrição mora no nome (botão de informação): a tela mostra o nome e o Usar */}
        <span className="acao-padrao-nome">
          <BotaoInfo titulo={nome(acao.nome)} linhas={emTopicos(acao.resumo)} />
        </span>
        {extra && <span className="talento-fonte"> · {nome(extra)}</span>}
        {acao.efeito === 'inspirar' && ficha.marcos < 3 * ficha.recursos.investidura.max && (
          <p className="acao-padrao-resumo acao-aviso">
            {t(tx.acoes.peloLivroMenosN, { n: 3 * ficha.recursos.investidura.max })}
          </p>
        )}
        <ul className="ataque-acoes">
          <BotaoUsar ctx={ctx} acao={usavel} />
        </ul>
      </div>
    </li>
  )
}

function CartaoFluxo({ ctx, fluxo: f }: { ctx: Ctx; fluxo: Fluxo }) {
  const { ficha, escolhasTalento, abrirDetalhe } = ctx
  const { t, tx, nome, msg } = useIdioma()
  const guia = GUIAS_FLUXO[f.id]
  const d = detalhePericia(fluxoComoPericia(f), ficha, escolhasTalento)
  const esc = ESCALONAMENTO_FLUXO[Math.max(1, Math.min(5, f.graduacao))]
  const usavel: AcaoUsavel = { chave: `fluxo:${f.id}`, nome: f.nome, ativacao: f.ativacao, custo: guia?.custoAoUsar }
  const guiaDoFluxo = <GuiaFluxo guia={guia} />
  return (
    <li className="ataque-cartao">
      <div className="ataque-cabeca">
        <span className="ataque-nome">
          {/* o guia do livro (passos, tabela de CD, notas) mora no nome */}
          <BotaoInfo titulo={nome(f.nome)} conteudo={guiaDoFluxo} largura="larga" />
        </span>
        <button className="numero-detalhavel" onClick={() => abrirDetalhe(fluxoComoPericia(f))}>
          {d.total >= 0 ? '+' : ''}
          {d.total}
        </button>
      </div>
      <p className="talento-desc">
        {t(tx.acoes.graduacaoGDadoDado, { g: f.graduacao, dado: esc.dado, tamanho: nome(esc.tamanho) })}
      </p>
      {/* primeiro o "Usar" do fluxo (e o que se paga depois dele); as habilidades vêm embaixo */}
      {(!guia?.habilidadesNoLugarDoUsar || (guia?.pagamentos(f.graduacao).length ?? 0) > 0) && (
        <ul className="ataque-acoes acoes-lado">
          {!guia?.habilidadesNoLugarDoUsar && <BotaoUsar ctx={ctx} acao={usavel} />}
          {guia?.pagamentos(f.graduacao).map((p) => (
            <BotaoUsar
              ctx={ctx}
              key={p.investidura}
              acao={{ chave: `pagar:${f.id}:${p.investidura}`, nome: f.nome, ativacao: 'especial', custo: { investidura: p.investidura }, repetivel: true }}
              rotulo={msg(p.rotulo)}
            />
          ))}
        </ul>
      )}
      {guia?.habilidades && (
        <ul className="fluxo-habilidades">
          {guia.habilidades.map((h) => (
            <li className="fluxo-habilidade" key={h.id}>
              <span className="acao-padrao-nome">
                <BotaoInfo titulo={nome(h.nome)} linhas={emTopicos(h.resumo)} />
              </span>
              {h.ativacao !== 'sempre' && (
                <ul className="ataque-acoes">
                  <BotaoUsar
                    ctx={ctx}
                    acao={{ chave: `fluxo:${f.id}:${h.id}`, nome: h.nome, ativacao: h.ativacao, custo: h.custo, repetivel: h.repetivel }}
                  />
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/** O guia do livro de um fluxo: passos, tabela de CD (Transformação) e as notas gerais. */
function GuiaFluxo({ guia }: { guia: (typeof GUIAS_FLUXO)[string] | undefined }) {
  const { t, tx, msg } = useIdioma()
  return (
    <div className="fluxo-guia">
      {guia ? (
        <ol>
          {guia.passos.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      ) : (
        <p className="proximo">{t(tx.acoes.guiaDesteFluxoAinda)}</p>
      )}
      {guia?.tabelaCD && (
        <table className="fluxo-tabela">
          <caption>{msg(guia.tabelaCD.titulo)}</caption>
          <thead>
            <tr>
              <th />
              {guia.tabelaCD.colunas.map((c) => (
                <th key={msg(c)}>{msg(c)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guia.tabelaCD.linhas.map((l) => (
              <tr key={msg(l.rotulo)}>
                <th>{msg(l.rotulo)}</th>
                {l.cds.map((cd, k) => (
                  <td key={k}>{cd ?? '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {guia?.tabelaCD && <p className="proximo">{t(tx.acoes.chamasSoTalentoTransmutar)}</p>}
      {NOTAS_FLUXO.map((n) => (
        <p className="proximo" key={n}>
          {n}
        </p>
      ))}
    </div>
  )
}
