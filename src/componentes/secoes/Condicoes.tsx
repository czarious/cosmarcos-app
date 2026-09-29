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
import { ATRIBUTO, ORDEM_ATRIBUTOS } from '../../variaveis'

// Aba Condições (itens 1.5 e 3.3) — condições, lesões e descanso juntos,
// porque se amarram: efeito de lesão É condição, e o descanso longo reduz
// Exausto e cura lesão superficial. Toda regra mora em regras/condicoes.ts e
// regras/descanso.ts; aqui só se desenha e se pergunta.
//
// Lista das 14 com CHECKBOX (pedido do César na transcrição): pode haver mais
// de uma ao mesmo tempo. Condição com colchetes pede o valor antes de aplicar.

/** "Exausto [−2]", "Aprimorado [+1 VEL]", "Afligido [1d4 vital]" — o nome como a mesa fala. */
export function rotuloCondicao(c: Omit<Condicao, 'uid'>): string {
  const nome = CONDICOES.find((d) => d.id === c.id)?.nome ?? c.id
  if (c.id === 'exausto') return `${nome} [−${c.valor ?? '?'}]`
  if (c.id === 'aprimorado') return `${nome} [+${c.valor ?? '?'} ${c.atributo ? ATRIBUTO[c.atributo].abrev : ''}]`
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
  fazerDescansoCurto: (vida: number, foco: number) => void
  fazerDescansoLongo: () => void
}

export default function Condicoes(props: Props) {
  const { ficha } = props
  const efetivas = condicoesEfetivas(ficha)
  return (
    <div className="secao condicoes">
      {efetivas.length > 0 && <Agora ficha={ficha} />}
      <ListaCondicoes {...props} efetivas={efetivas} />
      <Lesoes {...props} />
      <Descanso {...props} />
    </div>
  )
}

/** O que as condições mudam NESTE turno — o motivo da aba existir. */
function Agora({ ficha }: { ficha: Personagem }) {
  const turno = acoesNoTurno(ficha)
  const mov = movimentoComCondicoes(ficha)
  const avisos = lembretes(ficha)
  return (
    <div className="cond-agora">
      <h2 className="titulo-secao">Agora</h2>
      <p>
        <b>Turno rápido:</b> {turno.rapido === null ? 'não pode' : `${turno.rapido} ▶`} · <b>lento:</b> {turno.lento} ▶ ·{' '}
        <b>reação:</b> {turno.reacao ? '1 ↻' : 'nenhuma'}
        {turno.motivos.length > 0 && <span className="proximo"> ({turno.motivos.join('; ')})</span>}
      </p>
      <p>
        <b>Movimento:</b> {formatarMetros(mov.metros)}
        {mov.motivo && <span className="proximo"> ({mov.motivo})</span>}
      </p>
      {avisos.length > 0 && (
        <ul className="cond-lembretes">
          {avisos.map((a) => <li key={a}>{a}</li>)}
        </ul>
      )}
      <p className="proximo">Perícias já mostram Aprimorado e Exausto no total; vantagem e desvantagem aparecem marcadas lá.</p>
    </div>
  )
}

function ListaCondicoes({ efetivas, adicionarCondicao, removerCondicao }: Props & { efetivas: CondicaoEfetiva[] }) {
  // Condição com colchetes em edição: o formulário abre embaixo dela.
  const [pedindo, setPedindo] = useState<IdCondicao | null>(null)
  return (
    <div className="cond-lista">
      <h2 className="titulo-secao">Condições</h2>
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
                <span className="cond-nome">{def.nome}</span>
                {def.cumulativa && marcada && podeMarcarMais && (
                  <button type="button" className="rodape-botao" onClick={() => setPedindo(def.id)}>
                    + outra
                  </button>
                )}
              </label>
              {ativas.length > 0 && def.parametro && (
                <ul className="cond-instancias">
                  {ativas.map((c) => (
                    <li key={c.uid}>
                      {rotuloCondicao(c)}
                      {c.origem === 'lesao' ? (
                        <span className="proximo"> — de lesão</span>
                      ) : (
                        <button type="button" className="cond-x" aria-label={`Remover ${rotuloCondicao(c)}`} onClick={() => removerCondicao(c.uid)}>
                          ✕
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {!def.parametro && ativas.some((c) => c.origem === 'lesao') && <span className="proximo cond-origem">de lesão</span>}
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
  const [valor, setValor] = useState(1)
  const [atributo, setAtributo] = useState<NomeAtributo>('forca')
  const [dano, setDano] = useState('1d4 vital')
  return (
    <div className="cond-parametro">
      {id === 'afligido' && (
        <input className="cr-input" value={dano} onChange={(e) => setDano(e.target.value)} placeholder="1d4 vital" aria-label="Dano por turno" />
      )}
      {id === 'aprimorado' && (
        <select className="cr-input" value={atributo} onChange={(e) => setAtributo(e.target.value as NomeAtributo)} aria-label="Atributo">
          {ORDEM_ATRIBUTOS.map((a) => <option key={a} value={a}>{ATRIBUTO[a].nome}</option>)}
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
        Aplicar
      </button>
      <button type="button" className="rodape-botao" onClick={cancelar}>Cancelar</button>
    </div>
  )
}

function Lesoes({ ficha, salvarLesao, removerLesao }: Props) {
  const [nova, setNova] = useState(false)
  return (
    <div className="cond-lesoes">
      <h2 className="titulo-secao">Lesões</h2>
      {ficha.lesoes.length === 0 && !nova && <p className="proximo">Nenhuma lesão.</p>}
      <ul>
        {ficha.lesoes.map((l) => {
          const efeito = EFEITOS_LESAO.find((e) => e.id === l.efeito)
          const conta = l.gravidade === 'leve' || l.gravidade === 'grave'
          return (
            <li key={l.uid} className="lesao-item">
              <div>
                <b>{GRAVIDADE[l.gravidade].nome}</b> · {efeito?.nome}
                {l.descricao && <span className="proximo"> — {l.descricao}</span>}
              </div>
              <div className="lesao-acoes">
                {conta ? (
                  <>
                    <button type="button" className="rodape-botao" aria-label="Menos um dia" onClick={() => salvarLesao({ ...l, diasRestantes: Math.max(0, (l.diasRestantes ?? 0) - 1) })}>−1 dia</button>
                    <span>{l.diasRestantes ?? '?'} dia(s)</span>
                  </>
                ) : (
                  <span className="proximo">{GRAVIDADE[l.gravidade].duracao}</span>
                )}
                <button type="button" className="rodape-botao" onClick={() => removerLesao(l.uid)}>Curou</button>
              </div>
            </li>
          )
        })}
      </ul>
      {nova ? (
        <NovaLesao ficha={ficha} salvar={(l) => { salvarLesao(l); setNova(false) }} cancelar={() => setNova(false)} />
      ) : (
        <button type="button" className="rodape-botao" onClick={() => setNova(true)}>+ Registrar lesão</button>
      )}
      <p className="proximo">Recesso cura duas vezes mais rápido: tire 2 dias por dia de recesso.</p>
    </div>
  )
}

/**
 * A rolagem de lesão, passo a passo: o app diz o que somar ao d20, o jogador
 * rola na mão e digita; o app diz a gravidade e o dado da duração.
 */
function NovaLesao({ ficha, salvar, cancelar }: { ficha: Personagem; salvar: (l: Lesao) => void; cancelar: () => void }) {
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
        Role <b>1d20 {mod.total >= 0 ? '+' : '−'} {Math.abs(mod.total)}</b>{' '}
        <span className="proximo">({mod.linhas.map((l) => `${l.origem} ${l.valor >= 0 ? '+' : ''}${l.valor}`).join(' · ')}; some talento à mão)</span>
      </p>
      <label>
        d20 rolado <input className="cr-input cond-numero" type="number" min={1} max={20} value={d20} onChange={(e) => aoRolar(e.target.value)} />
      </label>
      {rolado !== null && (
        <p className={pelaTabela === 'morte' ? 'erro' : undefined}>
          Total <b>{rolado}</b> →{' '}
          {pelaTabela === 'morte' ? <b>MORTE — combine com o Mestre</b> : <b>{GRAVIDADE[pelaTabela!].nome}</b>}
        </p>
      )}
      <label>
        Gravidade{' '}
        <select className="cr-input" value={gravidade} onChange={(e) => setGravidade(e.target.value as GravidadeLesao)}>
          {(Object.keys(GRAVIDADE) as GravidadeLesao[]).map((g) => (
            <option key={g} value={g}>{GRAVIDADE[g].nome} ({GRAVIDADE[g].faixa}) — {GRAVIDADE[g].duracao}</option>
          ))}
        </select>
      </label>
      {(gravidade === 'leve' || gravidade === 'grave') && (
        <label>
          Role {GRAVIDADE[gravidade].duracao}: <input className="cr-input cond-numero" type="number" min={1} value={dias} onChange={(e) => setDias(e.target.value)} />
        </label>
      )}
      <label>
        Efeito (você escolhe, ou rola 1d8){' '}
        <select className="cr-input" value={efeito} onChange={(e) => setEfeito(e.target.value as EfeitoLesao)}>
          {EFEITOS_LESAO.map((e) => <option key={e.id} value={e.id}>{e.d8} · {e.nome}</option>)}
        </select>
      </label>
      <input className="cr-input" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="O que foi (opcional)" />
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
          Registrar
        </button>
        <button type="button" className="rodape-botao" onClick={cancelar}>Cancelar</button>
      </div>
    </div>
  )
}

function Descanso({ ficha, fazerDescansoCurto, fazerDescansoLongo }: Props) {
  const [vida, setVida] = useState('')
  const [foco, setFoco] = useState('')
  const [confirmandoLongo, setConfirmandoLongo] = useState(false)
  const { recursos, derivados } = ficha
  return (
    <div className="cond-descanso">
      <h2 className="titulo-secao">Descanso</h2>
      <p>
        <b>Curto</b> (1 h): role <b>{derivados.dadoRecuperacao}</b> e divida entre Vida e Foco.
      </p>
      <div className="lesao-acoes">
        <label>Vida + <input className="cr-input cond-numero" type="number" min={0} value={vida} onChange={(e) => setVida(e.target.value)} /></label>
        <label>Foco + <input className="cr-input cond-numero" type="number" min={0} value={foco} onChange={(e) => setFoco(e.target.value)} /></label>
        <button
          type="button"
          className="rodape-botao"
          disabled={!vida && !foco}
          onClick={() => {
            fazerDescansoCurto(Number(vida) || 0, Number(foco) || 0)
            setVida('')
            setFoco('')
          }}
        >
          Aplicar
        </button>
      </div>
      <p>
        <b>Longo</b> (8 h): Vida {recursos.vida.max} e Foco {recursos.foco.max}, Exausto −1, lesão superficial cura.
      </p>
      {confirmandoLongo ? (
        <div className="lesao-acoes">
          <button type="button" className="rodape-botao rodape-perigo" onClick={() => { fazerDescansoLongo(); setConfirmandoLongo(false) }}>
            Confirmar descanso longo
          </button>
          <button type="button" className="rodape-botao" onClick={() => setConfirmandoLongo(false)}>Cancelar</button>
        </div>
      ) : (
        <button type="button" className="rodape-botao" onClick={() => setConfirmandoLongo(true)}>Descanso longo</button>
      )}
      <p className="proximo">Lesão leve/grave conta dias, não descansos — use o −1 dia de cada uma.</p>
    </div>
  )
}
