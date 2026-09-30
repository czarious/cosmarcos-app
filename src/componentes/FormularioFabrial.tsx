/* arquivo: FormularioFabrial.tsx */
import { useState } from 'react'
import type { Fabrial, Personagem, QualidadeFabrial } from '../tipos/personagem'
import {
  FABRIAIS_PADRAO,
  EFEITOS_UNICOS,
  APRIMORAMENTOS_GERAIS,
  REVEZES_GERAIS,
  CARACTERISTICAS_AVANCADAS,
  QUALIDADE,
  PATAMAR,
  ID_PROPRIO,
  fabrialPadrao,
  efeitoUnico,
  opcaoCabe,
  cargasPelaRegra,
  aprimoramentosGastos,
  avisosFabrial,
  type OpcaoGeral,
} from '../regras/fabriais'
import { ICONE } from '../variaveis'
import { useIdioma } from '../idioma/IdiomaContexto'

// Montador de fabrial — novo ou edição. As opções saem todas de
// regras/fabriais.ts (o livro). Combinação fora da regra só AVISA, não
// bloqueia: o Mestre pode ter liberado diferente (decisão do César, 27/Set/2026).

type Props = {
  ficha: Personagem
  inicial?: Fabrial
  aoSalvar: (f: Fabrial) => void
  aoFechar: () => void
}

function novoFabrial(): Fabrial {
  return { id: crypto.randomUUID(), nome: '', tipo: 'unico', cargas: { atual: 0, max: 0 }, aprimoramentos: [], revezes: [] }
}

/** Liga/desliga um id numa lista. */
function alterna(lista: string[], id: string): string[] {
  return lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]
}

export default function FormularioFabrial({ ficha, inicial, aoSalvar, aoFechar }: Props) {
  const { t, tx, nome, msg } = useIdioma()
  const ff = tx.formularioFabrial
  const [f, setF] = useState<Fabrial>(inicial ?? novoFabrial())
  const [livreAprimoramento, setLivreAprimoramento] = useState('')
  const [livreReves, setLivreReves] = useState('')

  const efeito = f.tipo === 'unico' ? efeitoUnico(f.modelo) : undefined
  const q = f.qualidade ? QUALIDADE[f.qualidade] : undefined

  /** Muda o fabrial e, se a regra define o máximo de cargas, acompanha. */
  function muda(parcial: Partial<Fabrial>) {
    setF((atual) => {
      const novo = { ...atual, ...parcial }
      const regra = cargasPelaRegra(novo)
      if (regra !== null && regra !== cargasPelaRegra(atual)) {
        // fabrial novo nasce cheio; na edição, só não deixa o atual passar do máximo
        novo.cargas = { max: regra, atual: inicial ? Math.min(novo.cargas.atual, regra) : regra }
      }
      return novo
    })
  }

  function escolherModelo(id: string) {
    if (f.tipo === 'padrao') {
      const p = fabrialPadrao(id)
      muda({ modelo: id || undefined, nome: p?.nome ?? f.nome })
    } else {
      const e = efeitoUnico(id)
      // nome só é sugerido se o jogador ainda não deu um próprio
      const nomeSugerido = !f.nome || f.nome === efeitoUnico(f.modelo)?.nome ? (e?.nome ?? '') : f.nome
      muda({ modelo: id || undefined, nome: nomeSugerido })
    }
  }

  // ids que não são do livro (texto livre do Mestre) — ficam visíveis pra não sumirem
  const idsLivro = new Set([ID_PROPRIO, ...APRIMORAMENTOS_GERAIS.map((o) => o.id), ...CARACTERISTICAS_AVANCADAS.map((c) => c.id), ...REVEZES_GERAIS.map((o) => o.id)])
  const aprimoramentosLivres = f.aprimoramentos.filter((id) => !idsLivro.has(id))
  const revezesLivres = f.revezes.filter((id) => !idsLivro.has(id))

  const gastos = aprimoramentosGastos(f, ficha)
  const avisos = avisosFabrial(f, ficha)

  function linhaOpcao(op: OpcaoGeral, lado: 'aprimoramentos' | 'revezes') {
    const cabe = opcaoCabe(op, efeito)
    const marcado = f[lado].includes(op.id)
    return (
      <label className={`fab-opcao${cabe ? '' : ' fab-opcao-nao-cabe'}`} key={op.id}>
        <input type="checkbox" checked={marcado} onChange={() => muda({ [lado]: alterna(f[lado], op.id) })} />
        <span>
          <b>{nome(op.nome)}</b> — {op.resumo}
          {!cabe && <i className="fab-nao-cabe"> {ff.naoCabe}</i>}
        </span>
      </label>
    )
  }

  return (
    <div className="cr-overlay" onClick={aoFechar}>
      <div className="cr-painel fab-painel" onClick={(e) => e.stopPropagation()}>
        <div className="cr-cabeca">
          <span className="cr-titulo">{inicial ? ff.editarFabrial : ff.novoFabrial}</span>
          <button className="cr-fechar" onClick={aoFechar} aria-label={tx.geral.fechar}>
            {ICONE.fechar}
          </button>
        </div>

        <div className="gerenciar-form">
          <div className="fab-tipo">
            {(['unico', 'padrao'] as const).map((tipo) => (
              <button
                key={tipo}
                className={`fab-tipo-botao${f.tipo === tipo ? ' fab-tipo-ativo' : ''}`}
                onClick={() => setF({ ...novoFabrial(), id: f.id, tipo })}
              >
                {tipo === 'unico' ? ff.unico : ff.padrao}
              </button>
            ))}
          </div>

          <label className="fab-campo">
            <span>{f.tipo === 'padrao' ? ff.fabrial : ff.efeito}</span>
            <select className="cr-input" value={f.modelo ?? ''} onChange={(e) => escolherModelo(e.target.value)}>
              <option value="">{ff.livre}</option>
              {f.tipo === 'padrao'
                ? FABRIAIS_PADRAO.map((p) => (
                    <option key={p.id} value={p.id}>
                      {t(ff.cargasPreco, { nome: nome(p.nome), cargas: p.cargas ?? '∞', preco: p.preco })}
                    </option>
                  ))
                : ([1, 2, 3, 4] as const).map((pat) => (
                    <optgroup key={pat} label={t(ff.patamar, { n: pat, marcos: PATAMAR[pat].marcos, cd: PATAMAR[pat].cd })}>
                      {EFEITOS_UNICOS.filter((e) => e.patamar === pat).map((e) => (
                        <option key={e.id} value={e.id}>
                          {t(ff.cargasN, { nome: nome(e.nome), cargas: e.cargas })}
                        </option>
                      ))}
                    </optgroup>
                  ))}
            </select>
          </label>
          {f.tipo === 'padrao' && fabrialPadrao(f.modelo) && <p className="fab-regra">{fabrialPadrao(f.modelo)?.resumo}</p>}
          {efeito && <p className="fab-regra">{efeito.resumo}</p>}

          <label className="fab-campo">
            <span>{ff.nome}</span>
            <input className="cr-input" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} placeholder={ff.nomeFabrial} />
          </label>

          {f.tipo === 'unico' && (
            <>
              <label className="fab-campo">
                <span>{ff.qualidade}</span>
                <select
                  className="cr-input"
                  value={f.qualidade ?? ''}
                  onChange={(e) => muda({ qualidade: (e.target.value || undefined) as QualidadeFabrial | undefined })}
                >
                  <option value="">—</option>
                  {(Object.keys(QUALIDADE) as QualidadeFabrial[]).map((k) => (
                    <option key={k} value={k}>
                      {QUALIDADE[k].aprimoramentos !== null
                        ? t(ff.qualidadeOpcao, {
                            nome: nome(QUALIDADE[k].nome),
                            resultado: QUALIDADE[k].resultado,
                            aprimoramentos: QUALIDADE[k].aprimoramentos,
                            revezes: QUALIDADE[k].revezes ?? 0,
                          })
                        : `${nome(QUALIDADE[k].nome)} (${QUALIDADE[k].resultado})`}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset className="fab-grupo">
                <legend>
                  {ff.aprimoramentos}{' '}
                  <span className="contador">
                    ({gastos}
                    {q?.aprimoramentos != null && `/${q.aprimoramentos}`})
                  </span>
                </legend>
                {efeito && (
                  <label className="fab-opcao">
                    <input type="checkbox" checked={f.aprimoramentos.includes(ID_PROPRIO)} onChange={() => muda({ aprimoramentos: alterna(f.aprimoramentos, ID_PROPRIO) })} />
                    <span>
                      <b>{t(ff.doEfeito, { efeito: nome(efeito.nome) })}</b> — {efeito.aprimoramento}
                    </span>
                  </label>
                )}
                {APRIMORAMENTOS_GERAIS.map((op) => linhaOpcao(op, 'aprimoramentos'))}
                <p className="fab-sub">{ff.caracteristicasAvancadas}</p>
                {CARACTERISTICAS_AVANCADAS.map((c) => (
                  <label className="fab-opcao" key={c.id}>
                    <input type="checkbox" checked={f.aprimoramentos.includes(c.id)} onChange={() => muda({ aprimoramentos: alterna(f.aprimoramentos, c.id) })} />
                    <span>
                      <b>{nome(c.nome)}</b> — {c.resumo}
                    </span>
                  </label>
                ))}
                {aprimoramentosLivres.map((id) => (
                  <label className="fab-opcao" key={id}>
                    <input type="checkbox" checked onChange={() => muda({ aprimoramentos: alterna(f.aprimoramentos, id) })} />
                    <span>
                      <b>{id}</b> <i>{ff.combinadoMestre}</i>
                    </span>
                  </label>
                ))}
                <div className="fab-livre">
                  <input className="cr-input" placeholder={ff.outroCombinado} value={livreAprimoramento} onChange={(e) => setLivreAprimoramento(e.target.value)} />
                  <button
                    className="cr-btn"
                    disabled={!livreAprimoramento.trim()}
                    onClick={() => {
                      muda({ aprimoramentos: [...f.aprimoramentos, livreAprimoramento.trim()] })
                      setLivreAprimoramento('')
                    }}
                  >
                    +
                  </button>
                </div>
              </fieldset>

              <fieldset className="fab-grupo">
                <legend>
                  {ff.revezes}{' '}
                  <span className="contador">
                    ({f.revezes.length}
                    {q?.revezes != null && `/${q.revezes}`})
                  </span>
                </legend>
                {efeito && (
                  <label className="fab-opcao">
                    <input type="checkbox" checked={f.revezes.includes(ID_PROPRIO)} onChange={() => muda({ revezes: alterna(f.revezes, ID_PROPRIO) })} />
                    <span>
                      <b>{t(ff.doEfeito, { efeito: nome(efeito.nome) })}</b> — {efeito.reves}
                    </span>
                  </label>
                )}
                {REVEZES_GERAIS.map((op) => linhaOpcao(op, 'revezes'))}
                {revezesLivres.map((id) => (
                  <label className="fab-opcao" key={id}>
                    <input type="checkbox" checked onChange={() => muda({ revezes: alterna(f.revezes, id) })} />
                    <span>
                      <b>{id}</b> <i>{ff.combinadoMestre}</i>
                    </span>
                  </label>
                ))}
                <div className="fab-livre">
                  <input className="cr-input" placeholder={ff.outroCombinado} value={livreReves} onChange={(e) => setLivreReves(e.target.value)} />
                  <button
                    className="cr-btn"
                    disabled={!livreReves.trim()}
                    onClick={() => {
                      muda({ revezes: [...f.revezes, livreReves.trim()] })
                      setLivreReves('')
                    }}
                  >
                    +
                  </button>
                </div>
              </fieldset>
            </>
          )}

          <div className="fab-cargas">
            <label className="fab-campo">
              <span>{ff.cargasAtuais}</span>
              <input className="cr-input" type="number" inputMode="numeric" min={0} value={f.cargas.atual} onChange={(e) => setF({ ...f, cargas: { ...f.cargas, atual: Math.max(0, Number(e.target.value) || 0) } })} />
            </label>
            <label className="fab-campo">
              <span>{ff.maximo}</span>
              <input className="cr-input" type="number" inputMode="numeric" min={0} value={f.cargas.max} onChange={(e) => setF({ ...f, cargas: { ...f.cargas, max: Math.max(0, Number(e.target.value) || 0) } })} />
            </label>
          </div>

          {f.tipo === 'unico' && (
            <div className="fab-cargas">
              <label className="fab-campo">
                <span>{ff.gema}</span>
                <input className="cr-input" value={f.gema ?? ''} onChange={(e) => setF({ ...f, gema: e.target.value || undefined })} />
              </label>
              <label className="fab-campo">
                <span>{ff.material}</span>
                <input className="cr-input" value={f.material ?? ''} onChange={(e) => setF({ ...f, material: e.target.value || undefined })} />
              </label>
            </div>
          )}

          <label className="fab-campo">
            <span>{ff.notas}</span>
            <textarea className="cr-input anotacao-textarea" rows={3} value={f.notas ?? ''} onChange={(e) => setF({ ...f, notas: e.target.value || undefined })} />
          </label>

          {avisos.length > 0 && (
            <ul className="fab-avisos">
              {avisos.map((a) => (
                <li key={msg(a)}>⚠️ {msg(a)}</li>
              ))}
            </ul>
          )}

          <button
            className="cr-btn cr-mais"
            disabled={!f.nome.trim()}
            onClick={() => {
              aoSalvar({ ...f, nome: f.nome.trim() })
              aoFechar()
            }}
          >
            {tx.geral.salvar}
          </button>
        </div>
      </div>
    </div>
  )
}
