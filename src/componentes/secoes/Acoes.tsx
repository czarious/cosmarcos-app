/* arquivo: Acoes.tsx */
import { useState } from 'react'
import type { Personagem, Pericia, Fluxo, Fabrial } from '../../tipos/personagem'
import { CATALOGO_TALENTOS, type EscolhaVaga } from '../../regras/talentos'
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
          // Layout: cabeçalho de 3 colunas (Alcance/Acerto/Dano), cada arma em duas
          // linhas — nome+categoria, depois os 3 valores alinhados na grade.
          <div className="tabela-ataques">
            <div className="tabela-ataques-cabecalho">
              <span>{t(tx.acoes.alcance)}</span>
              <span>{t(tx.acoes.acerto)}</span>
              <span>{t(tx.acoes.dano)}</span>
            </div>
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
                <div className="linha-ataque" key={a.nome}>
                  <div className="linha-ataque-nome">
                    <span className="ataque-nome">{nome(a.nome)}</span>
                    <span className="ataque-categoria">{categoria}</span>
                  </div>
                  <div className="linha-ataque-grid">
                    <span className="dado-futuro">{nome(a.alcance)}</span>
                    <span className="numero-linha">
                      <span className="dado-futuro">d20</span>
                      <button className={`numero-detalhavel${marca('teste')}`} onClick={() => setDetalheAberto({ pericia, uso: 'teste' })}>
                        {acerto >= 0 ? '+' : ''}
                        {acerto}
                      </button>
                    </span>
                    <span className="numero-linha">
                      <span className="dado-futuro">{a.dano}</span>
                      <button className={`numero-detalhavel${marca('dano')}`} onClick={() => setDetalheAberto({ pericia, uso: 'dano' })}>
                        {dano >= 0 ? '+' : ''}
                        {dano}
                      </button>
                      <span className="tipo-dano">{nome(a.tipoDano)}</span>
                    </span>
                  </div>
                  {(a.tracos.length > 0 || a.tracosPerito.length > 0) && (
                    <ul className="lista-chips ataque-tracos">
                      {a.tracos.map((tr) => (
                        <li className="chip" key={tr}>
                          {nome(tr)}
                        </li>
                      ))}
                      {a.tracosPerito.map((tr) => (
                        <li className="chip chip-chave" key={tr}>
                          {nome(tr)}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="fab-botoes ataque-usar">
                    {/* uma vez pela mão principal e uma pela inábil (−2 foco, −1 com o traço Mão Inábil) */}
                    {ataquesDaArma(a, fab).map(({ acao, rotulo, mao }) => (
                      <BotaoUsar
                        ctx={ctx}
                        key={`${rotulo}-${mao}`}
                        acao={acao}
                        rotulo={mao === 'inabil' ? `${nome(rotulo)} · ${tx.acoes.maoInabil}` : nome(rotulo)}
                      />
                    ))}
                  </div>
                  {fab && (
                    <div className="fab-botoes ataque-fabrial">
                      <button className="fab-cargas-botao" onClick={() => setCargasDe(fab.id)} aria-label={t(tx.fabriais.cargasDe, { nome: nome(fab.nome) })}>
                        {SIMBOLO_RECURSO.cargas} {fab.cargas.atual}
                        <small>/{fab.cargas.max}</small>
                      </button>
                      {/* carga "ao acertar" (Dorial): só depois de um ataque com esta arma, uma por ataque */}
                      {usosDoFabrial(fab)
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
                    </div>
                  )}
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
                    <BotaoUsar ctx={ctx} acao={usavel} />
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
 * Botão de ação: o custo SEMPRE à esquerda, no mesmo bloco e na mesma ordem
 * (tipo da ação · Foco · Vida · Investidura, zero apagado) — botões empilhados
 * alinham. Já com o Focado aplicado. Carga de fabrial vem depois do nome, só se houver.
 * O motivo aparece embaixo quando não dá.
 */
function BotaoUsar({ ctx, acao, rotulo }: { ctx: Ctx; acao: AcaoUsavel; rotulo?: string }) {
  const { ficha, turno, tocarUsar } = ctx
  const { t, tx, msg } = useIdioma()
  const av = avaliar(acao, turno.simulacao?.estado ?? null, turno.simulacao?.ficha ?? ficha)
  const c = custoEfetivo(acao, ficha)
  const custo = { foco: c.foco ?? 0, vida: 0, investidura: c.investidura ?? 0 }
  return (
    <span className="usar">
      <button className="usar-botao" disabled={!av.pode} onClick={() => tocarUsar(acao)}>
        <span className="usar-custo" aria-hidden>
          <span className="custo-ativacao">{SIMBOLO_ATIVACAO[acao.ativacao]}</span>
          {RECURSOS_DO_CUSTO.map((r) => (
            <span key={r} className={`custo-recurso custo-${r}${custo[r] ? '' : ' custo-zero'}`}>
              {SIMBOLO_RECURSO[r]}
              {custo[r]}
            </span>
          ))}
        </span>
        <span className="usar-nome">{rotulo ?? tx.acoes.usar}</span>
        {acao.cargas && <small>−{acao.cargas.qtd} {SIMBOLO_RECURSO.cargas}</small>}
      </button>
      {!av.pode && av.motivo && <small className="usar-motivo">{msg(av.motivo)}</small>}
      {av.daPreparada && <small className="usar-motivo">{t(tx.acoes.daPreparada)}</small>}
    </span>
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
        <span className="acao-padrao-nome">{nome(acao.nome)}</span>
        {extra && <span className="talento-fonte"> · {nome(extra)}</span>}
        <p className="acao-padrao-resumo">{acao.resumo}</p>
        {acao.efeito === 'inspirar' && ficha.marcos < 3 * ficha.recursos.investidura.max && (
          <p className="acao-padrao-resumo acao-aviso">
            {t(tx.acoes.peloLivroMenosN, { n: 3 * ficha.recursos.investidura.max })}
          </p>
        )}
        <BotaoUsar ctx={ctx} acao={usavel} />
      </div>
    </li>
  )
}

function CartaoFluxo({ ctx, fluxo: f }: { ctx: Ctx; fluxo: Fluxo }) {
  const { ficha, escolhasTalento, abrirDetalhe } = ctx
  const { t, tx, nome, msg } = useIdioma()
  const [aberto, setAberto] = useState(false)
  const guia = GUIAS_FLUXO[f.id]
  const d = detalhePericia(fluxoComoPericia(f), ficha, escolhasTalento)
  const esc = ESCALONAMENTO_FLUXO[Math.max(1, Math.min(5, f.graduacao))]
  const usavel: AcaoUsavel = { chave: `fluxo:${f.id}`, nome: f.nome, ativacao: f.ativacao, custo: guia?.custoAoUsar }
  return (
    <li className="ataque">
      <div className="ataque-cabeca">
        <span className="ataque-nome">
          {nome(f.nome)}
        </span>
        <button className="numero-detalhavel" onClick={() => abrirDetalhe(fluxoComoPericia(f))}>
          {d.total >= 0 ? '+' : ''}
          {d.total}
        </button>
      </div>
      <p className="talento-desc">
        {t(tx.acoes.graduacaoGDadoDado, { g: f.graduacao, dado: esc.dado, tamanho: nome(esc.tamanho) })}
      </p>
      <div className="fab-botoes">
        <BotaoUsar ctx={ctx} acao={usavel} />
        {guia?.pagamentos(f.graduacao).map((p) => (
          <BotaoUsar
            ctx={ctx}
            key={p.investidura}
            acao={{ chave: `pagar:${f.id}:${p.investidura}`, nome: f.nome, ativacao: 'especial', custo: { investidura: p.investidura }, repetivel: true }}
            rotulo={msg(p.rotulo)}
          />
        ))}
      </div>
      <button className="fluxo-guia-botao" onClick={() => setAberto(!aberto)} aria-expanded={aberto}>
        {aberto ? '▾' : '▸'} {t(tx.acoes.comoUsar)}
      </button>
      {aberto && (
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
      )}
    </li>
  )
}
