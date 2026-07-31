/* arquivo: Inventario.tsx */
import { useState } from 'react'
import type { Personagem, Item } from '../../tipos/personagem'
import { pesoCarregado, pesoEmKg } from '../../regras/calculos'

// Aba Inventário — layout inspirado no DDB (referencia/ddb/ddb-06-inventario.jpg):
// resumo de peso carregado/máximo + marcos (moeda) editável no topo, botão
// "Gerenciar Inventário" (adicionar/remover), Armas (com checkbox de
// equipar — ver Ações), e os itens gerais numa tabela por categoria.

type Props = {
  ficha: Personagem
  alternarEquipada: (nomeArma: string) => void
  definirMarcos: (valor: number) => void
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
          <span className="cr-titulo">Gerenciar Inventário</span>
          <button className="cr-fechar" onClick={aoFechar} aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className="gerenciar-form">
          <input
            className="cr-input"
            placeholder="Nome do item"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            className="cr-input"
            placeholder="Categoria (ex.: Ferramenta)"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
          <div className="gerenciar-form-linha">
            <input
              className="cr-input"
              type="number"
              inputMode="decimal"
              placeholder="Peso (kg)"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />
            <input
              className="cr-input"
              type="number"
              inputMode="numeric"
              placeholder="Qtd"
              value={qtd}
              onChange={(e) => setQtd(e.target.value)}
            />
          </div>
          <button className="cr-btn cr-mais" onClick={adicionar} disabled={!nome.trim()}>
            + Adicionar
          </button>
        </div>

        {ficha.itens.length > 0 && (
          <ul className="gerenciar-lista">
            {ficha.itens.map((item, indice) => (
              <li key={`${item.nome}-${indice}`} className="gerenciar-linha">
                <span>
                  {item.nome} <i>({item.tipo})</i>
                </span>
                <button
                  className="gerenciar-remover"
                  onClick={() => removerItem(indice)}
                  aria-label={`Remover ${item.nome}`}
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

export default function Inventario({ ficha, alternarEquipada, definirMarcos, adicionarItem, removerItem }: Props) {
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

  const porCategoria = ficha.itens.reduce<Record<string, Item[]>>((grupos, item) => {
    const chave = item.tipo || 'Outros'
    ;(grupos[chave] ??= []).push(item)
    return grupos
  }, {})

  return (
    <div className="secao inventario">
      {/* painel superior — separado visualmente do resto; hoje só cor de
          fundo, no futuro pode ganhar uma imagem (ver ddb-06) */}
      <div className="inv-topo">
        <div className="inv-resumo">
          <div className="inv-resumo-bloco">
            <span className="inv-resumo-rotulo">Peso carregado</span>
            <span className="inv-resumo-valor">
              {carregado.toFixed(2)} <i>kg</i>
              {maximo > 0 && <span className="inv-peso-max"> / {maximo} kg</span>}
            </span>
            {maximo > 0 && (
              <span className={sobrecarregado ? 'inv-status inv-status-alerta' : 'inv-status'}>
                {sobrecarregado ? 'Sobrecarregado' : 'Livre'}
              </span>
            )}
          </div>
          <div className="inv-resumo-bloco inv-resumo-marcos">
            <span className="inv-resumo-rotulo">Marcos</span>
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
          Gerenciar Inventário
        </button>
      </div>

      <section className="grupo-acoes">
        <h2 className="titulo-secao">
          Armas <span className="contador">({ficha.armas.length})</span>
        </h2>
        {ficha.armas.length === 0 ? (
          <p className="proximo">Nenhuma arma veio no JSON deste personagem.</p>
        ) : (
          <div className="tabela-itens">
            <div className="tabela-itens-cabecalho">
              <span />
              <span>Item</span>
              <span>Peso</span>
              <span>Qtd</span>
              <span>Total</span>
            </div>
            {ficha.armas.map((a) => (
              <label className="linha-item" key={a.nome}>
                <input type="checkbox" checked={a.equipada} onChange={() => alternarEquipada(a.nome)} />
                <span>{a.nome}</span>
                <span>{a.peso} kg</span>
                <span>1</span>
                <span>{a.peso} kg</span>
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="grupo-acoes">
        <h2 className="titulo-secao">
          Equipamentos <span className="contador">({ficha.itens.length})</span>
        </h2>
        {ficha.itens.length === 0 ? (
          <p className="proximo">Nenhum equipamento — use "Gerenciar Inventário" pra adicionar.</p>
        ) : (
          Object.entries(porCategoria).map(([categoria, linhas]) => (
            <div key={categoria} className="inv-categoria">
              <h3 className="inv-categoria-titulo">{categoria}</h3>
              <div className="tabela-itens">
                <div className="tabela-itens-cabecalho">
                  <span />
                  <span>Item</span>
                  <span>Peso</span>
                  <span>Qtd</span>
                  <span>Total</span>
                </div>
                {linhas.map((item, i) => (
                  <div className="linha-item" key={`${item.nome}-${i}`}>
                    <span />
                    <span>{item.nome}</span>
                    <span>{item.peso} kg</span>
                    <span>{item.qtd}</span>
                    <span>{(item.peso * item.qtd).toFixed(2)} kg</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
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
