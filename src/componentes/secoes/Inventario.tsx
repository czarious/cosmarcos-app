/* arquivo: Inventario.tsx */
import { useState } from 'react'
import type { Personagem, Item } from '../../tipos/personagem'
import { pesoCarregado, pesoEmKg } from '../../regras/calculos'
import { ICONE } from '../../variaveis'
import { useIdioma } from '../../idioma/IdiomaContexto'

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
  const { tx, t, nome: nomeJogo } = useIdioma()
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('')
  const [peso, setPeso] = useState('')
  const [qtd, setQtd] = useState('1')

  function adicionar() {
    if (!nome.trim()) return
    adicionarItem({
      nome: nome.trim(),
      tipo: tipo.trim() || 'Outros',
      peso: Number(peso) || 0,
      qtd: Number(qtd) || 1,
      equipado: false,
    })
    setNome('')
    setTipo('')
    setPeso('')
    setQtd('1')
  }

  return (
    <div className="cr-overlay" onClick={aoFechar}>
      <div className="cr-painel" onClick={(e) => e.stopPropagation()}>
        <div className="cr-cabeca">
          <span className="cr-titulo">{tx.inventario.gerenciar}</span>
          <button className="cr-fechar" onClick={aoFechar} aria-label={tx.geral.fechar}>
            {ICONE.fechar}
          </button>
        </div>

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
                <button
                  className="gerenciar-remover"
                  onClick={() => removerItem(indice)}
                  aria-label={t(tx.geral.removerNome, { nome: nomeJogo(item.nome) })}
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function Inventario({ ficha, alternarEquipada, alternarItemEquipado, definirMarcos, definirEquipamentoTexto, adicionarItem, removerItem }: Props) {
  const { t, tx, nome, num: kg } = useIdioma()
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
        <div className="inv-resumo">
          <div className="inv-resumo-bloco">
            <span className="inv-resumo-rotulo">{tx.inventario.pesoCarregado}</span>
            <span className="inv-resumo-valor">
              {kg(carregado, 2)} <i>kg</i>
              {maximo > 0 && <span className="inv-peso-max"> / {maximo} kg</span>}
            </span>
            {maximo > 0 && (
              <span className={sobrecarregado ? 'inv-status inv-status-alerta' : 'inv-status'}>
                {sobrecarregado ? tx.inventario.sobrecarregado : tx.inventario.livre}
              </span>
            )}
          </div>
          <div className="inv-resumo-bloco inv-resumo-marcos">
            <span className="inv-resumo-rotulo">{tx.inventario.marcos}</span>
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
          </div>
        </div>

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
                <span>{nome(a.nome)}</span>
                <span>{kg(a.peso)} kg</span>
                <span>1</span>
                <span>{kg(a.peso)} kg</span>
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
                      {nome(item.nome)}
                      {item.deflexao !== undefined && <small className="inv-deflexao"> · {t(tx.inventario.deflexaoN, { n: item.deflexao })}</small>}
                      {(item.tracos ?? []).length > 0 && <small className="inv-deflexao"> · {(item.tracos ?? []).map((x) => nome(x)).join(', ')}</small>}
                    </span>
                    <span>{kg(item.peso)} kg</span>
                    <span>{item.qtd}</span>
                    <span>{kg(item.peso * item.qtd, 2)} kg</span>
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
