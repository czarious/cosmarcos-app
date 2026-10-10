/* arquivo: Personagem.tsx */
import { Fragment, useState, type ReactNode } from 'react'
import type { Personagem as Ficha, Objetivo } from '../../tipos/personagem'
import ControleMarcos from '../ControleMarcos'
import BotaoApagar from '../BotaoApagar'
import ListaLinhas from '../ListaLinhas'
import { ICONE, ORDEM_ESPECIALIDADES } from '../../variaveis'
import { useIdioma } from '../../idioma/IdiomaContexto'
import type { IdentidadeEditavel, TextoPersonagem } from '../../estado/usePersonagem'
import EditarIdentidade from '../EditarIdentidade'
import JanelaTexto from '../JanelaTexto'
import JanelaConexao from '../JanelaConexao'
import BotaoInfo from '../BotaoInfo'
import { emTopicos } from '../../idioma/idioma'
import { regraDaAncestralidade, regraDaCultura, regraDaTrilha, regraDaOrdem, regraDoKit, type Palavras } from '../regraDoLivro'

// Aba Personagem — quem ele é: identidade, OBJETIVOS e o texto de interpretação
// (propósito, obstáculo, personalidade, aparência, conexões). Identidade e textos
// se editam aqui (pedido 19) e voltam pro Shards no Exportar.
// No alto, "Na mesa": o que mora em outras abas e se consulta na sessão —
// especialidades (Talentos) e o que está equipado (Inventário). Só leitura.

type Props = {
  ficha: Ficha
  alterarObjetivo: (indice: number, muda: Partial<Objetivo>) => void
  adicionarObjetivo: (nome: string) => void
  removerObjetivo: (indice: number) => void
  editarIdentidade: (muda: Partial<IdentidadeEditavel>) => void
  editarTextoPersonagem: (campo: TextoPersonagem, valor: string) => void
}

export default function Personagem({ ficha, alterarObjetivo, adicionarObjetivo, removerObjetivo, editarIdentidade, editarTextoPersonagem }: Props) {
  const { t, tx, nome } = useIdioma()
  const { meta } = ficha
  const [novo, setNovo] = useState('')
  const [editandoIdentidade, setEditandoIdentidade] = useState(false)
  const [editandoTexto, setEditandoTexto] = useState<TextoPersonagem | null>(null)
  /** Índice da conexão em edição, ou "nova". */
  const [editandoConexao, setEditandoConexao] = useState<number | 'nova' | null>(null)

  // em andamento primeiro, concluídos no fim — o índice original vai junto (é o que o estado usa)
  const objetivos = ficha.objetivos.map((o, i) => ({ o, i })).sort((a, b) => Number(a.o.concluido) - Number(b.o.concluido))

  // cada origem com o ⓘ da regra do livro (regraDoLivro.ts); culturas, uma por linha
  const p: Palavras = { t, tx, nome }
  const comInfo = (texto: string, linhas: string[]) => (linhas.length > 0 ? <BotaoInfo titulo={texto} linhas={linhas} /> : texto)
  const identidade: [string, ReactNode][] = [
    [tx.personagem.jogador, meta.jogador],
    [tx.personagem.nivel, String(meta.nivel)],
    [tx.personagem.ancestralidade, comInfo(nome(meta.ancestralidade), regraDaAncestralidade(meta.ancestralidade))],
    [tx.personagem.culturas, meta.culturas.length > 0 && <ListaLinhas itens={meta.culturas.map((c) => comInfo(nome(c), regraDaCultura(c, p)))} />],
    [tx.personagem.trilhaHeroica, comInfo(nome(meta.trilhaHeroica), regraDaTrilha(meta.trilhaHeroica, p))],
    [tx.personagem.ordemRadiante, meta.trilhaRadiante && comInfo(nome(meta.trilhaRadiante), regraDaOrdem(meta.trilhaRadiante, p))],
    [tx.personagem.kitInicial, meta.kitInicial && comInfo(nome(meta.kitInicial), regraDoKit(meta.kitInicial, p))],
  ]
  const textos: [TextoPersonagem, string][] = [
    ['proposito', tx.personagem.proposito],
    ['obstaculo', tx.personagem.obstaculo],
    ['personalidade', tx.personagem.personalidade],
    ['aparencia', tx.personagem.aparencia],
  ]
  const tituloTexto = (campo: TextoPersonagem) => (campo === 'conexoes' ? tx.personagem.conexoes : textos.find(([c]) => c === campo)?.[1] ?? '')
  /** Título de seção com o ✎ Editar ao lado. */
  const tituloEditavel = (titulo: string, editar: () => void) => (
    <div className="titulo-com-acao">
      <h2 className="titulo-secao">{titulo}</h2>
      <button type="button" className="botao-editar" onClick={editar} aria-label={t(tx.personagem.editarTexto, { campo: titulo })}>
        {tx.personagem.editar}
      </button>
    </div>
  )
  const conexoes = ficha.conexoes.split('\n').map((l) => l.trim()).filter(Boolean)
  const salvarConexoes = (linhas: string[]) => editarTextoPersonagem('conexoes', linhas.join('\n'))
  // especialidades por tipo, como na aba Talentos
  const grupos = ORDEM_ESPECIALIDADES.map((c) => ({ c, nomes: ficha.especializacoes.filter((e) => e.tipo === c).map((e) => nome(e.nome)) })).filter((g) => g.nomes.length > 0)
  const equipados = [...ficha.armas.filter((a) => a.equipada), ...ficha.itens.filter((it) => it.equipado)].map((x) => nome(x.nome))
  const naMesa: [string, ReactNode][] = [
    [
      tx.talentos.especialidades,
      grupos.length > 0 &&
        grupos.map((g) => (
          <Fragment key={g.c}>
            <h3 className="esp-grupo-titulo">{tx.categoriaEspecialidade[g.c]}</h3>
            <ListaLinhas itens={g.nomes} />
          </Fragment>
        )),
    ],
    [tx.personagem.equipado, equipados.length > 0 && <ListaLinhas itens={equipados} />],
  ]

  function adicionar() {
    const nome = novo.trim()
    if (!nome) return
    adicionarObjetivo(nome)
    setNovo('')
  }

  return (
    <div className="secao personagem">
      <section className="quadro-resumo na-mesa">
        <h2 className="titulo-secao">{tx.personagem.naMesa}</h2>
        <dl>
          {naMesa.map(([rotulo, valor]) => (
            <div key={rotulo}>
              <dt>{rotulo}</dt>
              <dd>{valor || tx.personagem.nadaAinda}</dd>
            </div>
          ))}
        </dl>
      </section>
      <h2 className="titulo-secao">
        <BotaoInfo titulo={t(tx.personagem.objetivos)} linhas={emTopicos(t(tx.personagem.cadaObjetivoAvancaCerca))} />
      </h2>
      <ul className="lista-objetivos">
        {objetivos.map(({ o, i }) => (
          <li key={`${i}-${o.nome}`} className={`objetivo${o.concluido ? ' objetivo-concluido' : ''}`}>
            <div className="objetivo-cabeca">
              <span className="objetivo-nome">{o.nome}</span>
              <BotaoApagar classe="cr-fechar" rotulo={t(tx.personagem.apagarObjetivoNome, { nome: o.nome })} aoApagar={() => removerObjetivo(i)}>
                {ICONE.fechar}
              </BotaoApagar>
            </div>
            <ControleMarcos
              marcos={o.grau}
              concluido={o.concluido}
              rotuloConcluir={tx.marcos.concluir}
              rotuloConcluido={tx.marcos.concluido}
              aoMarcar={(grau) => alterarObjetivo(i, { grau })}
              aoConcluir={(concluido) => alterarObjetivo(i, { concluido })}
            />
          </li>
        ))}
      </ul>
      <div className="objetivo-novo">
        <input
          className="cr-input"
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && adicionar()}
          placeholder={t(tx.personagem.objetivoNovoMestreDeu)}
          aria-label={t(tx.personagem.nomeObjetivoNovo)}
        />
        <button type="button" className="rodape-botao" onClick={adicionar} disabled={!novo.trim()}>
          {tx.geral.adicionar}
        </button>
      </div>

      {tituloEditavel(t(tx.personagem.identidade), () => setEditandoIdentidade(true))}
      <dl className="pg-dados">
        {identidade
          .filter(([, v]) => v !== '' && v !== false && v != null)
          .map(([rotulo, valor]) => (
            <div key={rotulo}>
              <dt>{rotulo}</dt>
              <dd>{valor}</dd>
            </div>
          ))}
      </dl>

      {/* texto vazio também aparece: é onde se escreve */}
      {textos.map(([campo, titulo]) => (
        <section key={campo} className="pg-texto">
          {tituloEditavel(titulo, () => setEditandoTexto(campo))}
          <p className={ficha[campo] ? undefined : 'proximo'}>{ficha[campo] || tx.personagem.naoEscrito}</p>
        </section>
      ))}

      {/* uma conexão por linha ("Nome — descrição", como o Shards guarda): cada uma com editar e apagar */}
      <h2 className="titulo-secao pg-titulo-conexoes">{t(tx.personagem.conexoes)}</h2>
      {conexoes.length === 0 && <p className="proximo">{tx.personagem.naoEscrito}</p>}
      <ul className="pg-conexoes">
        {conexoes.map((c, i) => {
          const [nomeC, ...resto] = c.split(' — ')
          return (
            <li key={`${i}-${c}`}>
              <span className="pg-conexao-texto">
                <b>{nomeC}</b>
                {resto.length > 0 && ` — ${resto.join(' — ')}`}
              </span>
              <button type="button" className="anotacao-botao" onClick={() => setEditandoConexao(i)} aria-label={t(tx.geral.editarNome, { nome: nomeC })}>
                ✏️
              </button>
              <BotaoApagar classe="anotacao-botao" rotulo={t(tx.geral.excluirNome, { nome: nomeC })} aoApagar={() => salvarConexoes(conexoes.filter((_, k) => k !== i))}>
                🗑
              </BotaoApagar>
            </li>
          )
        })}
      </ul>
      <button type="button" className="rodape-botao pg-conexao-nova" onClick={() => setEditandoConexao('nova')}>
        {tx.personagem.adicionarConexao}
      </button>

      {editandoIdentidade && <EditarIdentidade ficha={ficha} aoSalvar={editarIdentidade} aoFechar={() => setEditandoIdentidade(false)} />}
      {editandoConexao !== null && (
        <JanelaConexao
          titulo={editandoConexao === 'nova' ? tx.personagem.novaConexao : tx.personagem.editarConexao}
          nome={editandoConexao === 'nova' ? '' : (conexoes[editandoConexao].split(' — ')[0] ?? '')}
          sobre={editandoConexao === 'nova' ? '' : conexoes[editandoConexao].split(' — ').slice(1).join(' — ')}
          aoSalvar={(n, s) => {
            const linha = s ? `${n} — ${s}` : n
            salvarConexoes(editandoConexao === 'nova' ? [...conexoes, linha] : conexoes.map((c, k) => (k === editandoConexao ? linha : c)))
          }}
          aoFechar={() => setEditandoConexao(null)}
        />
      )}
      {editandoTexto && (
        <JanelaTexto
          titulo={t(tx.personagem.editarTexto, { campo: tituloTexto(editandoTexto) })}
          valor={ficha[editandoTexto]}
          nota={t(tx.personagem.voltaProShards)}
          aoSalvar={(v) => editarTextoPersonagem(editandoTexto, v)}
          aoFechar={() => setEditandoTexto(null)}
        />
      )}
    </div>
  )
}
