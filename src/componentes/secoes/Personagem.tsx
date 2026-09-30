/* arquivo: Personagem.tsx */
import { useState } from 'react'
import type { Personagem as Ficha, Objetivo } from '../../tipos/personagem'
import ControleMarcos from '../ControleMarcos'
import { ICONE } from '../../variaveis'

// Aba Personagem — quem ele é: identidade, OBJETIVOS (os únicos que mudam na
// mesa) e o texto de interpretação que vem do Shards (propósito, obstáculo,
// personalidade, aparência, conexões). Texto do Shards é só leitura aqui —
// quem edita é o Shards (premissas.md → "O Shards é SEMENTE; o app é dono da ficha").

type Props = {
  ficha: Ficha
  alterarObjetivo: (indice: number, muda: Partial<Objetivo>) => void
  adicionarObjetivo: (nome: string) => void
  removerObjetivo: (indice: number) => void
}

export default function Personagem({ ficha, alterarObjetivo, adicionarObjetivo, removerObjetivo }: Props) {
  const { meta } = ficha
  const [novo, setNovo] = useState('')
  const [apagando, setApagando] = useState<number | null>(null)

  // em andamento primeiro, concluídos no fim — o índice original vai junto (é o que o estado usa)
  const objetivos = ficha.objetivos.map((o, i) => ({ o, i })).sort((a, b) => Number(a.o.concluido) - Number(b.o.concluido))

  const identidade: [string, string][] = [
    ['Jogador', meta.jogador],
    ['Nível', String(meta.nivel)],
    ['Ancestralidade', meta.ancestralidade],
    ['Culturas', meta.culturas.join(' · ')],
    ['Trilha heroica', meta.trilhaHeroica],
    ['Ordem radiante', meta.trilhaRadiante ?? ''],
    ['Kit inicial', meta.kitInicial],
  ]
  const textos: [string, string][] = [
    ['Propósito', ficha.proposito],
    ['Obstáculo', ficha.obstaculo],
    ['Personalidade', ficha.personalidade],
    ['Aparência', ficha.aparencia],
  ]
  const conexoes = ficha.conexoes.split('\n').map((l) => l.trim()).filter(Boolean)

  function adicionar() {
    const nome = novo.trim()
    if (!nome) return
    adicionarObjetivo(nome)
    setNovo('')
  }

  return (
    <div className="secao personagem">
      <h2 className="titulo-secao">Objetivos</h2>
      <ul className="lista-objetivos">
        {objetivos.map(({ o, i }) => (
          <li key={`${i}-${o.nome}`} className={`objetivo${o.concluido ? ' objetivo-concluido' : ''}`}>
            <div className="objetivo-cabeca">
              <span className="objetivo-nome">{o.nome}</span>
              {apagando === i ? (
                <span className="rodape-botoes">
                  <button type="button" className="rodape-botao rodape-perigo" onClick={() => { removerObjetivo(i); setApagando(null) }}>
                    Apagar
                  </button>
                  <button type="button" className="rodape-botao" onClick={() => setApagando(null)}>
                    Manter
                  </button>
                </span>
              ) : (
                <button type="button" className="cr-fechar" aria-label={`Apagar o objetivo ${o.nome}`} onClick={() => setApagando(i)}>
                  {ICONE.fechar}
                </button>
              )}
            </div>
            <ControleMarcos
              marcos={o.grau}
              concluido={o.concluido}
              rotuloConcluir="Concluir"
              rotuloConcluido="Concluído"
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
          placeholder="Objetivo novo (o Mestre deu, ou você escolheu)"
          aria-label="Nome do objetivo novo"
        />
        <button type="button" className="rodape-botao" onClick={adicionar} disabled={!novo.trim()}>
          + Adicionar
        </button>
      </div>
      <p className="proximo">
        Cada objetivo avança cerca de um marco por sessão, quando o Mestre disser. Com os 3, conclua quando a cena
        pedir — não precisa ser na hora. Vale anotar em Anotações o que aconteceu em cada marco.
      </p>

      <h2 className="titulo-secao">Identidade</h2>
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
          <h2 className="titulo-secao">Conexões</h2>
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
