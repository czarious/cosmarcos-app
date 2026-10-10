/* arquivo: Personagem.tsx */
import { useState } from 'react'
import type { Personagem as Ficha, Objetivo } from '../../tipos/personagem'
import ControleMarcos from '../ControleMarcos'
import BotaoApagar from '../BotaoApagar'
import { ICONE } from '../../variaveis'
import { useIdioma } from '../../idioma/IdiomaContexto'

// Aba Personagem — quem ele é: identidade, OBJETIVOS (os únicos que mudam na
// mesa) e o texto de interpretação que vem do Shards (propósito, obstáculo,
// personalidade, aparência, conexões). Texto do Shards é só leitura aqui —
// quem edita é o Shards (premissas.md → "O Shards é SEMENTE; o app é dono da ficha").
// No alto, "Na mesa": o que mora em outras abas e se consulta na sessão —
// especialidades (Talentos) e o que está equipado (Inventário). Só leitura.

type Props = {
  ficha: Ficha
  alterarObjetivo: (indice: number, muda: Partial<Objetivo>) => void
  adicionarObjetivo: (nome: string) => void
  removerObjetivo: (indice: number) => void
}

export default function Personagem({ ficha, alterarObjetivo, adicionarObjetivo, removerObjetivo }: Props) {
  const { t, tx, nome } = useIdioma()
  const { meta } = ficha
  const [novo, setNovo] = useState('')

  // em andamento primeiro, concluídos no fim — o índice original vai junto (é o que o estado usa)
  const objetivos = ficha.objetivos.map((o, i) => ({ o, i })).sort((a, b) => Number(a.o.concluido) - Number(b.o.concluido))

  const identidade: [string, string][] = [
    [tx.personagem.jogador, meta.jogador],
    [tx.personagem.nivel, String(meta.nivel)],
    [tx.personagem.ancestralidade, nome(meta.ancestralidade)],
    [tx.personagem.culturas, meta.culturas.map((c) => nome(c)).join(' · ')],
    [tx.personagem.trilhaHeroica, nome(meta.trilhaHeroica)],
    [tx.personagem.ordemRadiante, meta.trilhaRadiante ? nome(meta.trilhaRadiante) : ''],
    [tx.personagem.kitInicial, nome(meta.kitInicial)],
  ]
  const textos: [string, string][] = [
    [tx.personagem.proposito, ficha.proposito],
    [tx.personagem.obstaculo, ficha.obstaculo],
    [tx.personagem.personalidade, ficha.personalidade],
    [tx.personagem.aparencia, ficha.aparencia],
  ]
  const conexoes = ficha.conexoes.split('\n').map((l) => l.trim()).filter(Boolean)
  const naMesa: [string, string][] = [
    [tx.talentos.especialidades, ficha.especializacoes.map((e) => nome(e.nome)).join(' · ')],
    [
      tx.personagem.equipado,
      [...ficha.armas.filter((a) => a.equipada), ...ficha.itens.filter((it) => it.equipado)].map((x) => nome(x.nome)).join(' · '),
    ],
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
      <h2 className="titulo-secao">{t(tx.personagem.objetivos)}</h2>
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
      <p className="proximo">
        {t(tx.personagem.cadaObjetivoAvancaCerca)}
      </p>

      <h2 className="titulo-secao">{t(tx.personagem.identidade)}</h2>
      <dl className="pg-dados">
        {identidade
          .filter(([, v]) => v)
          .map(([rotulo, valor]) => (
            <div key={rotulo}>
              <dt>{rotulo}</dt>
              <dd>{valor}</dd>
            </div>
          ))}
      </dl>

      {textos
        .filter(([, v]) => v)
        .map(([titulo, texto]) => (
          <section key={titulo} className="pg-texto">
            <h2 className="titulo-secao">{titulo}</h2>
            <p>{texto}</p>
          </section>
        ))}

      {conexoes.length > 0 && (
        <>
          <h2 className="titulo-secao">{t(tx.personagem.conexoes)}</h2>
          <ul className="pg-conexoes">
            {conexoes.map((c) => {
              // "Nome — descrição": o nome em destaque
              const [nome, ...resto] = c.split(' — ')
              return (
                <li key={c}>
                  <b>{nome}</b>
                  {resto.length > 0 && ` — ${resto.join(' — ')}`}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
