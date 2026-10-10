/* arquivo: useOrdemAbas.ts */
import { useCallback, useState } from 'react'
import { LISTA, type Secao } from '../componentes/SeletorSecao'

// A ordem das abas que a pessoa arrumou no menu (▲▼). Mora no aparelho, como
// o idioma: é preferência de quem segura o celular — não vai na ficha nem pro
// Shards. Vale pro menu e pro arrastar entre abas.

const CHAVE = 'cosmarcos:ordem-abas'

/** Só abas que existem, cada uma uma vez; aba nova (de versão futura) entra no fim. */
export function ordemValida(salva: unknown): Secao[] {
  const lidas = Array.isArray(salva) ? salva.filter((s): s is Secao => LISTA.includes(s as Secao)) : []
  const unicas = [...new Set(lidas)]
  return [...unicas, ...LISTA.filter((s) => !unicas.includes(s))]
}

function ler(): Secao[] {
  try {
    return ordemValida(JSON.parse(localStorage.getItem(CHAVE) ?? 'null'))
  } catch {
    return [...LISTA]
  }
}

/** Troca a aba de posição com a vizinha (−1 sobe, +1 desce). */
export function mover(ordem: Secao[], aba: Secao, passo: -1 | 1): Secao[] {
  const i = ordem.indexOf(aba)
  const j = i + passo
  if (i < 0 || j < 0 || j >= ordem.length) return ordem
  const nova = [...ordem]
  ;[nova[i], nova[j]] = [nova[j], nova[i]]
  return nova
}

export function useOrdemAbas(): [Secao[], (nova: Secao[]) => void] {
  const [ordem, setOrdem] = useState<Secao[]>(ler)
  const definir = useCallback((nova: Secao[]) => {
    setOrdem(nova)
    try {
      localStorage.setItem(CHAVE, JSON.stringify(nova))
    } catch {
      // sem armazenamento (aba anônima): a ordem vale até fechar
    }
  }, [])
  return [ordem, definir]
}
