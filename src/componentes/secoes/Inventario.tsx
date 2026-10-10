/* arquivo: Inventario.tsx */
import { useState } from 'react'
import type { Personagem, Item } from '../../tipos/personagem'
import { pesoCarregado, pesoEmKg } from '../../regras/calculos'
import { useIdioma } from '../../idioma/IdiomaContexto'
import Janela from '../Janela'
import BotaoApagar from '../BotaoApagar'
import ListaLinhas from '../ListaLinhas'
import BotaoInfo from '../BotaoInfo'
import { regraDaArma, regraDoItem, type Palavras } from '../regraDoLivro'

// Aba Inventário — resumo de peso carregado/máximo + marcos (moeda) editável no topo, botão
// "Gerenciar Inventário" (adicionar/remover), Armas (com checkbox de
// equipar — ver Ações), e os itens gerais numa tabela por categoria.

type Props = {
  ficha: Personagem
  alternarEquipada: (nomeArma: string) => void
  /** Veste/tira armadura (item com deflexão) pelo índice. */
  alternarItemEquipado: (indice: number) => void
  definirMarcos: (valor: number) => void
  definirEquipamentoTexto: (texto: string) => void
  adicionarItem: (item: Item) => void
  removerItem: (indice: number) => void
}

function GerenciarInventario({
  ficha,
  adicionarItem,
  removerItem,
  aoFechar,
}: {
  ficha: Personagem
  adicionarItem: (item: Item) => void
  removerItem: (indice: number) => void
  aoFechar: () => void
}) {
  const { tx, t, nome: nomeJogo, pesoEmKg } = useIdioma()
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('')
  const [peso, setPeso] = useState('')
  const [qtd, setQtd] = useState('1')

  function adicionar() {
    if (!nome.trim()) return
    adicionarItem({
      nome: nome.trim(),
      tipo: tipo.trim() || 'Outros',
      peso: pesoEmKg(Number(peso) || 0),
      qtd: Number(qtd) || 1,
      equipado: false,
    })
    setNome('')
    setTipo('')
    setPeso('')
    setQtd('1')
  }

  return (
    <Janela titulo={tx.inventario.gerenciar} aoFechar={aoFechar}>
      <div className="gerenciar-form">
        <input
          className="cr-input"
          placeholder={tx.inventario.nomeItem}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          className="cr-input"
          placeholder={tx.inventario.categoriaExemplo}
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />
        <div className="gerenciar-form-linha">
          <input
            className="cr-input"
            type="number"
            inputMode="decimal"
            placeholder={tx.inventario.pesoKg}
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
          />
          <input
            className="cr-input"
            type="number"
            inputMode="numeric"
            placeholder={tx.inventario.qtd}
            value={qtd}
            onChange={(e) => setQtd(e.target.value)}
          />
        </div>
        <button className="cr-btn cr-mais" onClick={adicionar} disabled={!nome.trim()}>
          {tx.geral.adicionar}
        </button>
      </div>

      {ficha.itens.length > 0 && (
        <ul className="gerenciar-lista">
          {ficha.itens.map((item, indice) => (
            <li key={`${item.nome}-${indice}`} className="gerenciar-linha">
              <span>
                {nomeJogo(item.nome)} <i>({nomeJogo(item.tipo)})</i>
              </span>
              <BotaoApagar classe="gerenciar-remover" aoApagar={() => removerItem(indice)} rotulo={t(tx.geral.removerNome, { nome: nomeJogo(item.nome) })}>
                🗑
              </BotaoApagar>
            </li>
          ))}
        </ul>
      )}
    </Janela>
  )
}

export default function Inventario({ ficha, alternarEquipada, alternarItemEquipado, definirMarcos, definirEquipamentoTexto, adicionarItem, removerItem }: Props) {
  const { t, tx, nome, pesoNum, unidadePeso } = useIdioma()
  // a regra do livro de cada arma, armadura e item: o nome abre (regraDoLivro.ts)
  const palavras: Palavras = { t, tx, nome }
  const [editandoMarcos, setEditandoMarcos] = useState(false)
  const [valorMarcos, setValorMarcos] = useState('')
  const [gerenciando, setGerenciando] = useState(false)

  const carregado = pesoCarregado(ficha)
  const maximo = pesoEmKg(ficha.derivados.capacidadeCarga)
  const sobrecarregado = maximo > 0 && carregado > maximo

  function abrirEdicaoMarcos() {
    setValorMarcos(String(ficha.marcos))
    setEditandoMarcos(true)
  }

  function confirmarMarcos() {
    const n = parseInt(valorMarcos, 10)
    if (!Number.isNaN(n)) definirMarcos(n)
    setEditandoMarcos(false)
  }

  // o índice original vai junto: é por ele que se veste/tira a armadura
  const porCategoria = ficha.itens.reduce<Record<string, { item: Item; indice: number }[]>>((grupos, item, indice) => {
    const chave = item.tipo || 'Outros'
    ;(grupos[chave] ??= []).push({ item, indice })
    return grupos
  }, {})

  return (
    <div className="secao inventario">
      {/* painel superior — separado visualmente do resto; hoje só cor de
          fundo, no futuro pode ganhar uma imagem */}
      <div className="inv-topo">
        {/* pedido 20: o número em caixinha à esquerda e o nome à direita, como o Movimento da aba Principal */}
        <ul className="pr-derivados inv-resumo">
          <li>
            <b className={sobrecarregado ? 'numero-alterado' : undefined}>
              {pesoNum(carregado, 2)} <i>{unidadePeso}</i>
            </b>
            <span>
              {tx.inventario.pesoCarregado}
              {maximo > 0 && (
                <ListaLinhas
                  classe={sobrecarregado ? 'inv-status inv-status-alerta' : 'inv-status'}
                  itens={[t(tx.inventario.limiteN, { n: pesoNum(maximo), u: unidadePeso }), sobrecarregado ? tx.inventario.sobrecarregado : tx.inventario.livre]}
                />
              )}
            </span>
          </li>
          <li>
            {editandoMarcos ? (
              <input
                className="inv-marcos-input"
                type="number"
                inputMode="numeric"
                autoFocus
                value={valorMarcos}
                onChange={(e) => setValorMarcos(e.target.value)}
                onBlur={confirmarMarcos}
                onKeyDown={(e) => e.key === 'Enter' && confirmarMarcos()}
              />
            ) : (
              <button className="inv-marcos-valor" onClick={abrirEdicaoMarcos}>
                🪙 {ficha.marcos}
              </button>
            )}
            <span>{tx.inventario.marcos}</span>
          </li>
        </ul>

        <button className="botao-gerenciar" onClick={() => setGerenciando(true)}>
          {tx.inventario.gerenciar}
        </button>
      </div>

      <section className="grupo-acoes">
        <h2 className="titulo-secao">
          {tx.inventario.armas} <span className="contador">({ficha.armas.length})</span>
        </h2>
        {ficha.armas.length === 0 ? (
          <p className="proximo">{tx.inventario.nenhumaArma}</p>
        ) : (
          <div className="tabela-itens">
            <div className="tabela-itens-cabecalho">
              <span />
              <span>{tx.inventario.item}</span>
              <span>{tx.inventario.peso}</span>
              <span>{tx.inventario.qtd}</span>
              <span>{tx.geral.total}</span>
            </div>
            {ficha.armas.map((a) => (
              <label className="linha-item" key={a.nome}>
                <input type="checkbox" checked={a.equipada} onChange={() => alternarEquipada(a.nome)} />
                <span>
                  {regraDaArma(a, palavras).length > 0 ? <BotaoInfo titulo={nome(a.nome)} linhas={regraDaArma(a, palavras)} /> : nome(a.nome)}
                </span>
                <span>{pesoNum(a.peso)} {unidadePeso}</span>
                <span>1</span>
                <span>{pesoNum(a.peso)} {unidadePeso}</span>
              </label>
            ))}
          </div>
        )}

      </section>

      <section className="grupo-acoes">
        <h2 className="titulo-secao">
          {tx.inventario.equipamentos} <span className="contador">({ficha.itens.length})</span>
        </h2>
        {ficha.itens.length === 0 ? (
          <p className="proximo">{tx.inventario.nenhumEquipamento}</p>
        ) : (
          Object.entries(porCategoria).map(([categoria, linhas]) => (
            <div key={categoria} className="inv-categoria">
              <h3 className="inv-categoria-titulo">{categoria === 'Outros' ? tx.inventario.outros : nome(categoria)}</h3>
              <div className="tabela-itens">
                <div className="tabela-itens-cabecalho">
                  <span />
                  <span>{tx.inventario.item}</span>
                  <span>{tx.inventario.peso}</span>
                  <span>{tx.inventario.qtd}</span>
                  <span>{tx.geral.total}</span>
                </div>
                {linhas.map(({ item, indice }) => (
                  <label className="linha-item" key={`${item.nome}-${indice}`}>
                    {/* armadura (tem deflexão) se veste aqui; item comum não tem o que vestir */}
                    {item.deflexao !== undefined ? (
                      <input type="checkbox" checked={item.equipado} onChange={() => alternarItemEquipado(indice)} aria-label={t(tx.inventario.vestir, { nome: nome(item.nome) })} />
                    ) : (
                      <span />
                    )}
                    <span>
                      {regraDoItem(item, palavras).length > 0 ? <BotaoInfo titulo={nome(item.nome)} linhas={regraDoItem(item, palavras)} /> : nome(item.nome)}
                      {item.deflexao !== undefined && <small className="inv-deflexao"> · {t(tx.inventario.deflexaoN, { n: item.deflexao })}</small>}
                      {(item.tracos ?? []).length > 0 && <small className="inv-deflexao"> · {(item.tracos ?? []).map((x) => nome(x)).join(', ')}</small>}
                    </span>
                    <span>{pesoNum(item.peso)} {unidadePeso}</span>
                    <span>{item.qtd}</span>
                    <span>{pesoNum(item.peso * item.qtd, 2)} {unidadePeso}</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <section className="grupo-acoes">
        <h2 className="titulo-secao">{tx.inventario.pertences}</h2>
        <p className="proximo">{tx.inventario.pertencesAjuda}</p>
        <textarea
          className="cr-input anotacao-textarea"
          rows={Math.max(3, ficha.equipamentoTexto.split('\n').length + 1)}
          value={ficha.equipamentoTexto}
          onChange={(e) => definirEquipamentoTexto(e.target.value)}
          aria-label={tx.inventario.pertences}
        />
      </section>

      {gerenciando && (
        <GerenciarInventario
          ficha={ficha}
          adicionarItem={adicionarItem}
          removerItem={removerItem}
          aoFechar={() => setGerenciando(false)}
        />
      )}
    </div>
  )
}
