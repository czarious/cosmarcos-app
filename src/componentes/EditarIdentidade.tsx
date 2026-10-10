/* arquivo: EditarIdentidade.tsx */
import { useState } from 'react'
import type { Personagem } from '../tipos/personagem'
import type { IdentidadeEditavel } from '../estado/usePersonagem'
import { ANCESTRALIDADE, CULTURA, CONJUNTO_INICIAL, TRILHA_HEROICA, ORDEM } from '../estado/deparaShards'
import { useIdioma } from '../idioma/IdiomaContexto'
import Janela from './Janela'
import ListaLinhas from './ListaLinhas'

// A identidade da aba Personagem, editável no app (pedido 19). O que vem de
// catálogo (ancestralidade, cultura, kit, trilha, ordem) é escolha da lista do
// Shards — assim o Exportar devolve um texto que o Shards reconhece.
// Regras do livro: duas culturas na criação, cada uma dá a sua especialidade
// cultural (cap. 2); subir de nível dá Vida, atributos, perícias e talentos
// (cap. 1, "Evolução de Personagem") — escolhas que ficam no Shards.

type Props = {
  ficha: Personagem
  aoSalvar: (muda: IdentidadeEditavel) => void
  aoFechar: () => void
}

/** As opções de um catálogo, em português (o valor que a ficha guarda). */
const opcoes = (mapa: Record<string, string>) => Object.values(mapa)

export default function EditarIdentidade({ ficha, aoSalvar, aoFechar }: Props) {
  const { t, tx, nome } = useIdioma()
  const m = ficha.meta
  const [jogador, setJogador] = useState(m.jogador)
  const [nivel, setNivel] = useState(String(m.nivel))
  const [ancestralidade, setAncestralidade] = useState(m.ancestralidade)
  const [cultura1, setCultura1] = useState(m.culturas[0] ?? '')
  const [cultura2, setCultura2] = useState(m.culturas[1] ?? '')
  const [kit, setKit] = useState(m.kitInicial)
  const [trilha, setTrilha] = useState(m.trilhaHeroica)
  const [ordem, setOrdem] = useState(m.trilhaRadiante ?? '')
  const nivelValido = Number.isInteger(Number(nivel)) && Number(nivel) >= 1

  function salvar() {
    aoSalvar({
      jogador: jogador.trim(),
      nivel: Number(nivel),
      ancestralidade,
      culturas: [...new Set([cultura1, cultura2].filter(Boolean))],
      kitInicial: kit,
      trilhaHeroica: trilha,
      trilhaRadiante: ordem || undefined,
    })
    aoFechar()
  }

  /** Uma escolha de catálogo; `vazio` = dá pra deixar sem nada. */
  const escolha = (rotulo: string, valor: string, mudar: (v: string) => void, lista: string[], vazio = false) => (
    <label className="ident-campo">
      <span>{rotulo}</span>
      <select className="cr-input" value={valor} onChange={(e) => mudar(e.target.value)}>
        {vazio && <option value="">{tx.personagem.nenhuma}</option>}
        {/* valor que não está no catálogo (ficha antiga) continua aparecendo */}
        {valor && !lista.includes(valor) && <option value={valor}>{valor}</option>}
        {lista.map((o) => (
          <option key={o} value={o}>
            {nome(o)}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <Janela titulo={tx.personagem.editarIdentidade} aoFechar={aoFechar} fechar="ate-salvar">
      <div className="gerenciar-form">
        <label className="ident-campo">
          <span>{tx.personagem.jogador}</span>
          <input className="cr-input" value={jogador} onChange={(e) => setJogador(e.target.value)} />
        </label>
        <label className="ident-campo">
          <span>{tx.personagem.nivel}</span>
          <input className="cr-input" type="number" inputMode="numeric" min={1} value={nivel} onChange={(e) => setNivel(e.target.value)} />
        </label>
        <ListaLinhas classe="proximo" itens={[t(tx.personagem.nivelMudaNumero), t(tx.personagem.nivelNoShards)]} />
        {escolha(tx.personagem.ancestralidade, ancestralidade, setAncestralidade, opcoes(ANCESTRALIDADE))}
        {escolha(tx.personagem.cultura1, cultura1, setCultura1, opcoes(CULTURA))}
        {escolha(tx.personagem.cultura2, cultura2, setCultura2, opcoes(CULTURA), true)}
        <ListaLinhas classe="proximo" itens={[t(tx.personagem.culturaDaEspecialidade)]} />
        {escolha(tx.personagem.kitInicial, kit, setKit, opcoes(CONJUNTO_INICIAL))}
        {escolha(tx.personagem.trilhaHeroica, trilha, setTrilha, opcoes(TRILHA_HEROICA))}
        {escolha(tx.personagem.ordemRadiante, ordem, setOrdem, opcoes(ORDEM), true)}
        <p className="proximo">{t(tx.personagem.voltaProShards)}</p>
        <button className="cr-btn cr-mais" onClick={salvar} disabled={!nivelValido}>
          {tx.geral.salvar}
        </button>
      </div>
    </Janela>
  )
}
