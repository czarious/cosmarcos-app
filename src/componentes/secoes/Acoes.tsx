/* arquivo: Acoes.tsx */
import { useState } from 'react'
import type { Personagem, Pericia } from '../../tipos/personagem'
import { CATALOGO_TALENTOS, SIMBOLO_ATIVACAO, type EscolhaVaga } from '../../regras/talentos'
import {
  ACOES_PADRAO,
  ACOES_CONCEDIDAS,
  ACOES_ESPRENO,
  ordenarPorAtivacao,
  compararAtivacao,
  type EntradaAcao,
} from '../../regras/acoes'
import { totalPericia, periciaPorNome, detalhePericia } from '../../regras/calculos'
import PopoverDetalhe from '../PopoverDetalhe'

// Aba Ações — categorizada como o cartão de referência oficial (Actions /
// Reactions / Stormlight Actions / Radiant Spren):
//  1. Ataques: só as armas EQUIPADAS (ver aba Inventário), com acerto/dano
//     calculados por regras/calculos.ts (Cap. 10, "fórmula de dano de arma").
//  2. Ações / Reações: as 17 padrão de combate (Cap. 10), divididas pelo
//     próprio tipo de ativação — iguais pra qualquer personagem.
//  3. Ações de Luz das Tempestades: só aparece se algum talento do
//     personagem concede (ex.: Primeiro Ideal) — condicional, some se não tem.
//  4. Habilidades de Espreno: só aparece se `ficha.radiante` existir (é
//     Radiante vinculado) — não depende de talento específico.

type Props = {
  ficha: Personagem
  escolhasTalento: Record<string, EscolhaVaga>
}

function LinhaAcaoPadrao({ acao }: { acao: EntradaAcao }) {
  return (
    <li className="acao-padrao">
      <span className="acao-padrao-simbolo">{SIMBOLO_ATIVACAO[acao.ativacao]}</span>
      <div>
        <span className="acao-padrao-nome">{acao.nome}</span>
        <p className="acao-padrao-resumo">{acao.resumo}</p>
      </div>
    </li>
  )
}

export default function Acoes({ ficha, escolhasTalento }: Props) {
  const armasEquipadas = ficha.armas.filter((a) => a.equipada)
  const [detalheAberto, setDetalheAberto] = useState<Pericia | null>(null)

  const acoesConcedidas = ficha.talentos
    .filter((t) => CATALOGO_TALENTOS[t.id] && ACOES_CONCEDIDAS[t.id])
    .flatMap((t) => ACOES_CONCEDIDAS[t.id].map((acao) => ({ acao, deTalento: CATALOGO_TALENTOS[t.id].nome })))
    .sort((a, b) => compararAtivacao(a.acao.ativacao, b.acao.ativacao))

  const acoesPadraoAcao = ordenarPorAtivacao(ACOES_PADRAO.filter((a) => a.ativacao !== 'reacao'))
  const acoesPadraoReacao = ordenarPorAtivacao(ACOES_PADRAO.filter((a) => a.ativacao === 'reacao'))
  const espreno = ordenarPorAtivacao(ACOES_ESPRENO)

  return (
    <div className="secao acoes">
      <section className="grupo-acoes">
        <h2 className="titulo-secao">
          Ataques <span className="contador">({armasEquipadas.length})</span>
        </h2>
        {armasEquipadas.length === 0 ? (
          <p className="proximo">Nenhuma arma equipada — vá em Inventário pra equipar.</p>
        ) : (
          // Layout inspirado no DDB (referencia/ddb/ddb-05-acoes-armas.jpg):
          // cabeçalho de 3 colunas (Alcance/Acerto/Dano), cada arma em duas
          // linhas — nome+categoria, depois os 3 valores alinhados na grade.
          <div className="tabela-ataques">
            <div className="tabela-ataques-cabecalho">
              <span>Alcance</span>
              <span>Acerto</span>
              <span>Dano</span>
            </div>
            {armasEquipadas.map((a) => {
              const pericia = periciaPorNome(a.pericia, ficha)
              if (!pericia) {
                return (
                  <p className="ataque-erro" key={a.nome}>
                    {a.nome}: perícia "{a.pericia}" não encontrada na ficha.
                  </p>
                )
              }
              const total = totalPericia(pericia, ficha, escolhasTalento)
              const categoria = a.alcance.startsWith('Corpo a corpo') ? 'Arma corpo a corpo' : 'Arma à distância'
              return (
                <div className="linha-ataque" key={a.nome}>
                  <div className="linha-ataque-nome">
                    <span className="ataque-nome">{a.nome}</span>
                    <span className="ataque-categoria">{categoria}</span>
                  </div>
                  <div className="linha-ataque-grid">
                    <span className="dado-futuro">{a.alcance}</span>
                    <span className="numero-linha">
                      <span className="dado-futuro">d20</span>
                      <button className="numero-detalhavel" onClick={() => setDetalheAberto(pericia)}>
                        {total >= 0 ? '+' : ''}
                        {total}
                      </button>
                    </span>
                    <span className="numero-linha">
                      <span className="dado-futuro">{a.dano}</span>
                      <button className="numero-detalhavel" onClick={() => setDetalheAberto(pericia)}>
                        {total >= 0 ? '+' : ''}
                        {total}
                      </button>
                      <span className="tipo-dano">{a.tipoDano}</span>
                    </span>
                  </div>
                  {(a.tracos.length > 0 || a.tracosPerito.length > 0) && (
                    <ul className="lista-chips ataque-tracos">
                      {a.tracos.map((tr) => (
                        <li className="chip" key={tr}>
                          {tr}
                        </li>
                      ))}
                      {a.tracosPerito.map((tr) => (
                        <li className="chip chip-chave" key={tr}>
                          {tr}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* condicional: só aparece se algum talento do personagem concede */}
      {acoesConcedidas.length > 0 && (
        <section className="grupo-acoes">
          <h2 className="titulo-secao">Ações de Luz das Tempestades</h2>
          <ul className="lista-ataques">
            {acoesConcedidas.map(({ acao, deTalento }) => (
              <li className="ataque" key={acao.nome}>
                <div className="ataque-cabeca">
                  <span className="ataque-nome">
                    <span className="acao-padrao-simbolo">{SIMBOLO_ATIVACAO[acao.ativacao]}</span> {acao.nome}
                  </span>
                  <span className="talento-fonte">{deTalento}</span>
                </div>
                <p className="talento-desc">{acao.resumo}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grupo-acoes">
        <h2 className="titulo-secao">Ações</h2>
        <ul className="lista-acoes-padrao">
          {acoesPadraoAcao.map((acao) => (
            <LinhaAcaoPadrao key={acao.nome} acao={acao} />
          ))}
        </ul>
      </section>

      <section className="grupo-acoes">
        <h2 className="titulo-secao">Reações</h2>
        <ul className="lista-acoes-padrao">
          {acoesPadraoReacao.map((acao) => (
            <LinhaAcaoPadrao key={acao.nome} acao={acao} />
          ))}
        </ul>
      </section>

      {/* condicional: só aparece se o personagem for Radiante vinculado */}
      {ficha.radiante && (
        <section className="grupo-acoes">
          <h2 className="titulo-secao">Habilidades de Espreno</h2>
          <ul className="lista-acoes-padrao">
            {espreno.map((acao) => (
              <LinhaAcaoPadrao key={acao.nome} acao={acao} />
            ))}
          </ul>
        </section>
      )}

      {detalheAberto && (
        <PopoverDetalhe
          detalhe={detalhePericia(detalheAberto, ficha, escolhasTalento)}
          aoFechar={() => setDetalheAberto(null)}
        />
      )}
    </div>
  )
}
