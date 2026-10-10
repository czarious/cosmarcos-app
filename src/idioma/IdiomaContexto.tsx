/* arquivo: IdiomaContexto.tsx */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DICIONARIO, LOCALE, preencher, plural, nome, mensagem, rotulo, numero, distancia, pesoNumero, unidadePeso, pesoDigitadoEmKg, medidas, type Idioma } from './idioma'
import type { Dicionario, Mensagem, Plural, Rotulo } from './pt'

// O idioma escolhido na engrenagem, para o app inteiro. Mora no aparelho
// (localStorage), não na ficha: é preferência de quem segura o celular, e não
// vai pro Shards. O que cada função faz: idioma.ts.

const CHAVE = 'cosmarcos:idioma'

type Vars = Record<string, string | number>

type Valor = {
  idioma: Idioma
  definirIdioma: (i: Idioma) => void
  /** As palavras da tela no idioma escolhido: tx.turno.encerrarTurno. */
  tx: Dicionario
  /** Preenche as lacunas: t(tx.turno.rodadaN, { n: 3 }). */
  t: (modelo: string, vars?: Vars) => string
  /** Plural: tn(tx.condicoes.dias, 3). */
  tn: (p: Plural, n: number, vars?: Vars) => string
  /** Nome de jogo no idioma (perícia, arma, ação, condição…). */
  nome: (pt: string) => string
  /** Mensagem que uma regra devolveu. */
  msg: (m: Mensagem) => string
  /** Origem de um bônus (nome ou mensagem). */
  rot: (r: Rotulo) => string
  /** Número no formato do idioma. */
  num: (n: number, casas?: number) => string
  /** Distância em metros, com unidade — pés em inglês. */
  distancia: (m: number) => string
  /** Peso em kg, só o número — libras em inglês; a unidade é `unidadePeso`. */
  pesoNum: (kg: number, casas?: number) => string
  unidadePeso: string
  /** Peso que a pessoa digitou (lb em inglês) → kg. */
  pesoEmKg: (valor: number) => number
  /** Converte as medidas dentro de um texto ("50 kg" → "100 lb" em inglês). */
  medidas: (texto: string) => string
}

function montar(idioma: Idioma, definirIdioma: (i: Idioma) => void): Valor {
  return {
    idioma,
    definirIdioma,
    tx: DICIONARIO[idioma],
    t: preencher,
    tn: (p, n, vars) => plural(p, n, idioma, vars),
    nome: (pt) => nome(pt, idioma),
    msg: (m) => mensagem(m, idioma),
    rot: (r) => rotulo(r, idioma),
    num: (n, casas) => numero(n, idioma, casas),
    distancia: (m) => distancia(m, idioma),
    pesoNum: (kg, casas) => pesoNumero(kg, idioma, casas),
    unidadePeso: unidadePeso(idioma),
    pesoEmKg: (v) => pesoDigitadoEmKg(v, idioma),
    medidas: (texto) => medidas(texto, idioma),
  }
}

const Contexto = createContext<Valor>(montar('pt', () => {}))

function lerIdioma(): Idioma {
  try {
    return localStorage.getItem(CHAVE) === 'en' ? 'en' : 'pt'
  } catch {
    return 'pt'
  }
}

export function ProvedorIdioma({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>(lerIdioma)

  useEffect(() => {
    document.documentElement.lang = LOCALE[idioma]
  }, [idioma])

  const definirIdioma = useCallback((i: Idioma) => {
    setIdioma(i)
    try {
      localStorage.setItem(CHAVE, i)
    } catch {
      // sem storage o idioma vale até fechar o app
    }
  }, [])

  const valor = useMemo(() => montar(idioma, definirIdioma), [idioma, definirIdioma])
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useIdioma(): Valor {
  return useContext(Contexto)
}
