/* arquivo: Condicoes.tsx */
import { useState } from 'react'
import type { Personagem, Condicao, Lesao, IdCondicao, NomeAtributo, GravidadeLesao, EfeitoLesao } from '../../tipos/personagem'
import {
  CONDICOES,
  EFEITOS_LESAO,
  GRAVIDADE,
  condicoesEfetivas,
  acoesNoTurno,
  movimentoComCondicoes,
  lembretes,
  modificadorRolagemLesao,
  resultadoLesao,
  type CondicaoEfetiva,
} from '../../regras/condicoes'
import { ORDEM_ATRIBUTOS } from '../../variaveis'
import { useIdioma } from '../../idioma/IdiomaContexto'

// Aba Condições (itens 1.5 e 3.3) — condições e lesões juntas, porque se
// amarram: efeito de lesão É condição. O descanso (que reduz Exausto e cura
// lesão superficial) mora na fogueira do cabeçalho (Fogueira.tsx). Toda regra
// mora em regras/condicoes.ts; aqui só se desenha e se pergunta.
//
// Lista das 14 com CHECKBOX (pedido do César na transcrição): pode haver mais
// de uma ao mesmo tempo. Condição com colchetes pede o valor antes de aplicar.

/** "Exausto [−2]", "Aprimorado [+1 VEL]", "Afligido [1d4 vital]" — o nome como a mesa fala. */
export function rotuloCondicao(c: Omit<Condicao, 'uid'>, { nome: nomeJogo, tx }: Pick<ReturnType<typeof useIdioma>, 'nome' | 'tx'>): string {
  const nome = nomeJogo(CONDICOES.find((d) => d.id === c.id)?.nome ?? c.id)
  if (c.id === 'exausto') return `${nome} [−${c.valor ?? '?'}]`
  if (c.id === 'aprimorado') return `${nome} [+${c.valor ?? '?'} ${c.atributo ? tx.atributosAbrev[c.atributo] : ''}]`
  if (c.id === 'afligido') return `${nome} [${c.dano || '?'}]`
  return nome
}

export function formatarMetros(m: number): string {
  return `${String(m).replace('.', ',')} m`
}

type Props = {
  ficha: Personagem
  adicionarCondicao: (c: Omit<Condicao, 'uid'>) => void
  removerCondicao: (uid: string) => void
  salvarLesao: (l: Lesao) => void
  removerLesao: (uid: string) => void
}

export default function Condicoes(props: Props) {
  const { ficha } = props
  const efetivas = condicoesEfetivas(ficha)
  return (
    <div className="secao condicoes">
      {efetivas.length > 0 && <Agora ficha={ficha} />}
      <ListaCondicoes {...props} efetivas={efetivas} />
      <Lesoes {...props} />
    </div>
  )
}

/** O que as condições mudam NESTE turno — o motivo da aba existir. */
function Agora({ ficha }: { ficha: Personagem }) {
  const idioma = useIdioma()
  const { t, tx, nome, msg } = idioma
  const turno = acoesNoTurno(ficha)
  const mov = movimentoComCondicoes(ficha)
  const avisos = lembretes(ficha)
  return (
    <div className="cond-agora">
      <h2 className="titulo-secao">{t(tx.condicoes.agora)}</h2>
      <p>
        <b>{t(tx.condicoes.turnoRapido)}:</b> {turno.rapido === null ? t(tx.condicoes.naoPode) : `${turno.rapido} ▶`} · <b>{t(tx.condicoes.lento)}:</b> {turno.lento} ▶ ·{' '}
        <b>{t(tx.condicoes.reacao)}:</b> {turno.reacao ? '1 ↻' : t(tx.condicoes.nenhuma)}
        {turno.motivos.length > 0 && <span className="proximo"> ({turno.motivos.map((m) => msg(m)).join('; ')})</span>}
      </p>
      <p>
        <b>{t(tx.condicoes.movimento)}:</b> {formatarMetros(mov.metros)}
        {mov.motivos.length > 0 && <span className="proximo"> ({mov.motivos.map((m) => nome(m)).join(' · ')})</span>}
      </p>
      {avisos.length > 0 && (
        <ul className="cond-lembretes">
          {avisos.map((a) => <li key={msg(a)}>{msg(a)}</li>)}
        </ul>
      )}
      <p className="proximo">{t(tx.condicoes.periciasJaMostramAprimorado)}</p>
    </div>
  )
}

function ListaCondicoes({ efetivas, adicionarCondicao, removerCondicao }: Props & { efetivas: CondicaoEfetiva[] }) {
  const idioma = useIdioma()
  const { t, tx, nome } = idioma
  // Condição com colchetes em edição: o formulário abre embaixo dela.
  const [pedindo, setPedindo] = useState<IdCondicao | null>(null)
  return (
    <div className="cond-lista">
      <h2 className="titulo-secao">{t(tx.condicoes.condicoes)}</h2>
      <ul>
        {CONDICOES.map((def) => {
          const ativas = efetivas.filter((c) => c.id === def.id)
          const manuais = ativas.filter((c) => c.origem === 'manual')
          const marcada = ativas.length > 0
          const podeMarcarMais = !marcada || def.cumulativa
          // Desmarcar tira TODAS as aplicadas à mão; somar mais uma é o "+ outra".
          function alternar() {
            if (marcada) {
              manuais.forEach((c) => removerCondicao(c.uid))
            } else if (def.parametro) {
              setPedindo(pedindo === def.id ? null : def.id)
            } else {
              adicionarCondicao({ id: def.id })
            }
          }
          return (
            <li key={def.id} className={`cond-item${marcada ? ' cond-marcada' : ''}`}>
              <label className="cond-linha">
                <input
                  type="checkbox"
                  checked={marcada}
                  // Só lesão deixando ela ativa: desmarcar é curar a lesão, não aqui.
                  disabled={marcada && manuais.length === 0}
                  onChange={alternar}
                />
                <span className="cond-nome">{nome(def.nome)}</span>
                {def.cumulativa && marcada && podeMarcarMais && (
                  <button type="button" className="rodape-botao" onClick={() => setPedindo(def.id)}>
                    {t(tx.condicoes.outra)}
                  </button>
                )}
              </label>
              {ativas.length > 0 && def.parametro && (
                <ul className="cond-instancias">
                  {ativas.map((c) => (
                    <li key={c.uid}>
                      {rotuloCondicao(c, idioma)}
                      {c.origem === 'lesao' ? (
                        <span className="proximo"> — {t(tx.condicoes.deLesao)}</span>
                      ) : (
                        <button type="button" className="cond-x" aria-label={t(tx.geral.removerNome, { nome: rotuloCondicao(c, idioma) })} onClick={() => removerCondicao(c.uid)}>
                          ✕
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {!def.parametro && ativas.some((c) => c.origem === 'lesao') && <span className="proximo cond-origem">{t(tx.condicoes.deLesao)}</span>}
              {ativas
                .filter((c) => c.origem === 'armadura')
                .map((c) => (
                  <span key={c.uid} className="proximo cond-origem">
                    {t(tx.condicoes.daArmadura, { nome: nome(c.nota ?? '') })}
                  </span>
                ))}
              {pedindo === def.id && (
                <ParametroCondicao
                  id={def.id}
                  aplicar={(c) => {
                    adicionarCondicao(c)
                    setPedindo(null)
                  }}
                  cancelar={() => setPedindo(null)}
                />
              )}
              <p className="cond-resumo">{def.resumo}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** O valor entre colchetes: dano do Afligido, atributo e bônus do Aprimorado, penalidade do Exausto. */
function ParametroCondicao({ id, aplicar, cancelar }: { id: IdCondicao; aplicar: (c: Omit<Condicao, 'uid'>) => void; cancelar: () => void }) {
  const idioma = useIdioma()
  const { t, tx } = idioma
  const [valor, setValor] = useState(1)
  const [atributo, setAtributo] = useState<NomeAtributo>('forca')
  const [dano, setDano] = useState('1d4 vital')
  return (
    <div className="cond-parametro">
      {id === 'afligido' && (
        <input className="cr-input" value={dano} onChange={(e) => setDano(e.target.value)} placeholder={t(tx.condicoes.n1d4Vital)} aria-label={t(tx.condicoes.danoTurno)} />
      )}
      {id === 'aprimorado' && (
        <select className="cr-input" value={atributo} onChange={(e) => setAtributo(e.target.value as NomeAtributo)} aria-label={t(tx.condicoes.atributo)}>
          {ORDEM_ATRIBUTOS.map((a) => <option key={a} value={a}>{tx.atributos[a]}</option>)}
        </select>
      )}
      {(id === 'aprimorado' || id === 'exausto') && (
        <label>
          {id === 'exausto' ? '−' : '+'}
          <input className="cr-input cond-numero" type="number" min={1} value={valor} onChange={(e) => setValor(Math.max(1, Number(e.target.value) || 1))} />
        </label>
      )}
      <button
        type="button"
        className="rodape-botao rodape-perigo"
        onClick={() =>
          aplicar(id === 'afligido' ? { id, dano: dano.trim() } : id === 'aprimorado' ? { id, atributo, valor } : { id, valor })
        }
      >
        {tx.geral.aplicar}
      </button>
      <button type="button" className="rodape-botao" onClick={cancelar}>{tx.geral.cancelar}</button>
    </div>
  )
}

function Lesoes({ ficha, salvarLesao, removerLesao }: Props) {
  const idioma = useIdioma()
  const { t, tx, tn, nome } = idioma
  const [nova, setNova] = useState(false)
  return (
    <div className="cond-lesoes">
      <h2 className="titulo-secao">{t(tx.condicoes.lesoes)}</h2>
      {ficha.lesoes.length === 0 && !nova && <p className="proximo">{t(tx.condicoes.nenhumaLesao)}</p>}
      <ul>
        {ficha.lesoes.map((l) => {
          const efeito = EFEITOS_LESAO.find((e) => e.id === l.efeito)
          const conta = l.gravidade === 'leve' || l.gravidade === 'grave'
          return (
            <li key={l.uid} className="lesao-item">
              <div>
                <b>{nome(GRAVIDADE[l.gravidade].nome)}</b> · {efeito && nome(efeito.nome)}
                {l.descricao && <span className="proximo"> — {l.descricao}</span>}
              </div>
              <div className="lesao-acoes">
                {conta ? (
                  <>
                    <button type="button" className="rodape-botao" aria-label={t(tx.condicoes.menosDia)} onClick={() => salvarLesao({ ...l, diasRestantes: Math.max(0, (l.diasRestantes ?? 0) - 1) })}>{t(tx.condicoes.n1Dia)}</button>
                    <span>{l.diasRestantes === undefined ? '—' : tn(tx.condicoes.dias, l.diasRestantes)}</span>
                  </>
                ) : (
                  <span className="proximo">{nome(GRAVIDADE[l.gravidade].duracao)}</span>
                )}
                <button type="button" className="rodape-botao" onClick={() => removerLesao(l.uid)}>{t(tx.condicoes.curou)}</button>
              </div>
            </li>
          )
        })}
      </ul>
      {nova ? (
        <NovaLesao ficha={ficha} salvar={(l) => { salvarLesao(l); setNova(false) }} cancelar={() => setNova(false)} />
      ) : (
        <button type="button" className="rodape-botao" onClick={() => setNova(true)}>{t(tx.condicoes.registrarLesao)}</button>
      )}
      <p className="proximo">{t(tx.condicoes.recessoCuraDuasVezes)}</p>
    </div>
  )
}

/**
 * A rolagem de lesão, passo a passo: o app diz o que somar ao d20, o jogador
 * rola na mão e digita; o app diz a gravidade e o dado da duração.
 */
function NovaLesao({ ficha, salvar, cancelar }: { ficha: Personagem; salvar: (l: Lesao) => void; cancelar: () => void }) {
  const idioma = useIdioma()
  const { t, tx, nome, rot } = idioma
  const mod = modificadorRolagemLesao(ficha)
  const [d20, setD20] = useState('')
  const [gravidade, setGravidade] = useState<GravidadeLesao>('leve')
  const [efeito, setEfeito] = useState<EfeitoLesao>('exausto-1')
  const [dias, setDias] = useState('')
  const [descricao, setDescricao] = useState('')
  const rolado = d20 === '' ? null : Number(d20) + mod.total
  const pelaTabela = rolado === null ? null : resultadoLesao(rolado)

  function aoRolar(v: string) {
    setD20(v)
    const r = v === '' ? null : resultadoLesao(Number(v) + mod.total)
    if (r && r !== 'morte') setGravidade(r)
  }

  return (
    <div className="lesao-nova">
      <p>
        {t(tx.condicoes.role1d20SinalN, { sinal: mod.total >= 0 ? '+' : '−', n: Math.abs(mod.total) })}{' '}
        <span className="proximo">
          {t(tx.condicoes.linhasSomeTalentoMao, { linhas: mod.linhas.map((l) => `${rot(l.origem)} ${l.valor >= 0 ? '+' : ''}${l.valor}`).join(' · ') })}
        </span>
      </p>
      <label>
        {t(tx.condicoes.d20Rolado)} <input className="cr-input cond-numero" type="number" min={1} max={20} value={d20} onChange={(e) => aoRolar(e.target.value)} />
      </label>
      {rolado !== null && (
        <p className={pelaTabela === 'morte' ? 'erro' : undefined}>
          {tx.geral.total} <b>{rolado}</b> →{' '}
          {pelaTabela === 'morte' ? <b>{t(tx.condicoes.morteCombineMestre)}</b> : <b>{nome(GRAVIDADE[pelaTabela!].nome)}</b>}
        </p>
      )}
      <label>
        {t(tx.condicoes.gravidade)}{' '}
        <select className="cr-input" value={gravidade} onChange={(e) => setGravidade(e.target.value as GravidadeLesao)}>
          {(Object.keys(GRAVIDADE) as GravidadeLesao[]).map((g) => (
            <option key={g} value={g}>{nome(GRAVIDADE[g].nome)} ({GRAVIDADE[g].faixa}) — {nome(GRAVIDADE[g].duracao)}</option>
          ))}
        </select>
      </label>
      {(gravidade === 'leve' || gravidade === 'grave') && (
        <label>
          {t(tx.condicoes.roleDuracao, { duracao: nome(GRAVIDADE[gravidade].duracao) })} <input className="cr-input cond-numero" type="number" min={1} value={dias} onChange={(e) => setDias(e.target.value)} />
        </label>
      )}
      <label>
        {t(tx.condicoes.efeitoVoceEscolheOu)}{' '}
        <select className="cr-input" value={efeito} onChange={(e) => setEfeito(e.target.value as EfeitoLesao)}>
          {EFEITOS_LESAO.map((e) => <option key={e.id} value={e.id}>{e.d8} · {nome(e.nome)}</option>)}
        </select>
      </label>
      <input className="cr-input" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder={t(tx.condicoes.oFoiOpcional)} />
      <div className="lesao-acoes">
        <button
          type="button"
          className="rodape-botao rodape-perigo"
          onClick={() =>
            salvar({
              uid: crypto.randomUUID(),
              gravidade,
              efeito,
              descricao: descricao.trim() || undefined,
              diasRestantes: gravidade === 'leve' || gravidade === 'grave' ? Number(dias) || undefined : undefined,
            })
          }
        >
          {t(tx.condicoes.registrar)}
        </button>
        <button type="button" className="rodape-botao" onClick={cancelar}>{tx.geral.cancelar}</button>
      </div>
    </div>
  )
}
