/* arquivo: SeletorSecao.tsx */
import { useEffect, useState } from 'react'
import { ICONE } from '../variaveis'
import { useIdioma } from '../idioma/IdiomaContexto'

// As abas — padrão DDB (interface.md → "Uma seção por vez"): UMA linha com o
// ícone e o nome da aba aberta + o botão dos 9 quadradinhos. Tocar abre o menu
// com todas as abas; escolher uma fecha o menu.

/** Nome da aba → glifo do menu. O `︎` pede a versão TEXTO do símbolo —
 *  sem ele o Android desenha ⚔ ⚙ como emoji colorido. */
export const SECOES = {
  Principal: '◈',
  Perícias: '✧',
  Ações: '⚔︎',
  Fabriais: '⚙︎',
  Condições: '✚',
  Radiante: '☼',
  Inventário: '▣',
  Talentos: '❖',
  Personagem: '♙',
  Anotações: '✎',
} as const

export type Secao = keyof typeof SECOES

/** A ordem das abas — a do menu e a do arrastar. */
export const LISTA = Object.keys(SECOES) as Secao[]

type Props = {
  ativa: Secao
  aoTrocar: (s: Secao) => void
}

export default function SeletorSecao({ ativa, aoTrocar }: Props) {
  const { t, tx } = useIdioma()
  const [aberto, setAberto] = useState(false)

  // Esc fecha o menu (teclado do PC; no celular é o ✕ ou tocar fora)
  useEffect(() => {
    if (!aberto) return
    const aoTecla = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    window.addEventListener('keydown', aoTecla)
    return () => window.removeEventListener('keydown', aoTecla)
  }, [aberto])

  return (
    <nav className="seletor-secao" aria-label={t(tx.abas.secoesFicha)}>
      <button
        className="ss-barra"
        onClick={() => setAberto(true)}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        aria-label={t(tx.abas.abaAbaAbrirMenu, { aba: tx.nomesAbas[ativa] })}
      >
        <span className="ss-icone" aria-hidden>
          {SECOES[ativa]}
        </span>
        <span className="ss-nome">{tx.nomesAbas[ativa]}</span>
        <span className="ss-grade" aria-hidden>
          {Array.from({ length: 9 }, (_, i) => (
            <i key={i} />
          ))}
        </span>
      </button>

      {aberto && (
        <div className="cr-overlay ss-overlay" onClick={() => setAberto(false)}>
          <div className="ss-menu" role="dialog" aria-label={t(tx.abas.abasFicha)} onClick={(e) => e.stopPropagation()}>
            <button className="cr-fechar ss-fechar" onClick={() => setAberto(false)} aria-label={tx.geral.fechar}>
              {ICONE.fechar}
            </button>
            {LISTA.map((s) => (
              <button
                key={s}
                className={`ss-item${s === ativa ? ' ss-item-ativo' : ''}`}
                aria-current={s === ativa ? 'page' : undefined}
                onClick={() => {
                  aoTrocar(s)
                  setAberto(false)
                }}
              >
                <span className="ss-icone" aria-hidden>
                  {SECOES[s]}
                </span>
                {tx.nomesAbas[s]}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
