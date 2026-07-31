/* arquivo: CabecalhoFixo.tsx */
import { useState } from 'react'
import type { Personagem, NomeAtributo } from '../tipos/personagem'
import type { NomeRecurso } from '../estado/usePersonagem'
import ControleRecurso from './ControleRecurso'

// O cabeçalho fixo TOTAL: identidade reduzida + os 3 grupos da ficha oficial
// lado a lado. Cada grupo: [atributo] [DEFESA no meio] [atributo] + recurso.
// Item 1.2/1.3: o recurso é um BOTÃO — toca e abre o ControleRecurso (dano/cura).

type Props = {
  ficha: Personagem
  alterarRecurso: (qual: NomeRecurso, delta: number) => void
}

const ABREV: Record<NomeAtributo, string> = {
  forca: 'FOR',
  velocidade: 'VEL',
  intelecto: 'INT',
  vontade: 'VON',
  consciencia: 'CON',
  presenca: 'PRE',
}

const ROTULO_RECURSO: Record<string, string> = {
  vida: 'VIDA',
  foco: 'FOCO',
  investidura: 'INVEST',
}

const GRUPOS = [
  { nome: 'Física', defesa: 'fisica', atribs: ['forca', 'velocidade'], recurso: 'vida', simbolo: '♥' },
  { nome: 'Cognitiva', defesa: 'cognitiva', atribs: ['intelecto', 'vontade'], recurso: 'foco', simbolo: '◆' },
  { nome: 'Espiritual', defesa: 'espiritual', atribs: ['consciencia', 'presenca'], recurso: 'investidura', simbolo: '✦' },
] as const

export default function CabecalhoFixo({ ficha, alterarRecurso }: Props) {
  const { meta, atributos, atributosMod, defesas, recursos, deflect, derivados } = ficha
  const efetivo = (a: NomeAtributo) => atributos[a] + atributosMod[a]
  const [aberto, setAberto] = useState<NomeRecurso | null>(null)

  return (
    <header className="cabecalho-fixo">
      <div className="cf-identidade">
        <span className="cf-nome">{meta.nome}</span>
        <span className="cf-linha">
          {meta.ancestralidade} · {meta.trilhaHeroica}
          {meta.trilhaRadiante ? ` / ${meta.trilhaRadiante}` : ''} · nv {meta.nivel}
        </span>
      </div>

      <div className="cf-grupos">
        {GRUPOS.map((g) => {
          const r = recursos[g.recurso]
          const vazio = r.max === 0
          return (
            <div className="cf-grupo" key={g.defesa}>
              <span className="cfg-titulo">{g.nome}</span>
              <div className="cfg-linha-atrib">
                <span className="cfg-atrib">
                  <i>{ABREV[g.atribs[0]]}</i>
                  <b>{efetivo(g.atribs[0])}</b>
                </span>
                <span className="cfg-defesa" title={`Defesa ${g.nome}`}>
                  <i>DEF</i>
                  <b>{defesas[g.defesa]}</b>
                </span>
                <span className="cfg-atrib">
                  <i>{ABREV[g.atribs[1]]}</i>
                  <b>{efetivo(g.atribs[1])}</b>
                </span>
              </div>
              {/* o recurso agora é BOTÃO — toca e abre o controle (item 1.2/1.3) */}
              <button
                className={`cfg-recurso${vazio ? ' cf-vazio' : ''}`}
                onClick={() => setAberto(g.recurso)}
                title={`Alterar ${g.nome === 'Física' ? 'Vida' : g.recurso}`}
              >
                <span className="cf-simbolo">{g.simbolo}</span>
                <span className="cfg-recurso-corpo">
                  <i>{ROTULO_RECURSO[g.recurso]}</i>
                  <span className="cf-valor">
                    {r.atual}
                    <span className="cf-max">/{r.max}</span>
                  </span>
                </span>
                {g.recurso === 'vida' && (
                  <span className="cfg-deflect" title="Deflect">
                    <i>DEFL</i>
                    <b>{deflect}</b>
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>

      <div className="cf-derivados">
        <span><i>Movimento</i> <b>{derivados.movimento}</b></span>
        <span><i>Recuperação</i> <b>{derivados.dadoRecuperacao}</b></span>
        <span><i>Sentidos</i> <b>{derivados.alcanceSentidos}</b></span>
      </div>

      {aberto && (
        <ControleRecurso
          qual={aberto}
          recurso={recursos[aberto]}
          alterar={alterarRecurso}
          aoFechar={() => setAberto(null)}
        />
      )}
    </header>
  )
}
