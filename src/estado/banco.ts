/* arquivo: banco.ts */
import { createStore, entries, setMany, set, del } from 'idb-keyval'

/**
 * Onde a FICHA mora: IndexedDB (pedido do César, 10/Out/2026). O localStorage
 * tem teto de ~5 MB por site — a foto e as cópias de segurança pesam, e no
 * GitHub Pages o teto é dividido com os outros projetos. O IndexedDB cabe
 * centenas de MB. Por quê e o que custa: premissas.md → "IndexedDB, sem servidor".
 *
 * Como funciona, pra o resto do código não precisar mudar:
 * - ao abrir o app (main.tsx, antes do primeiro desenho), tudo do banco vem pra
 *   uma cópia na MEMÓRIA; ler é síncrono, como era com o localStorage;
 * - gravar muda a memória na hora e manda pro IndexedDB em seguida; se o
 *   IndexedDB recusar, quem assinou `aoFalharGravacao` fica sabendo (a tela
 *   mostra "não salvou", como antes);
 * - só a ficha e as cópias moram aqui (PREFIXOS); preferência pequena (idioma,
 *   letra, ordem das abas…) continua no localStorage.
 * Sem IndexedDB (navegador velho, bloqueado) ou antes de abrir (testes), o
 * `armazem()` devolve o próprio localStorage: tudo funciona como antes.
 */

/** As chaves que moram no banco: a ficha e a pasta das cópias (+ os nomes antigos das cópias). */
export const PREFIXOS = ['cosmarcos:ficha:', 'cosmarcos:copia:', 'cosmarcos:descartado:', 'cosmarcos:antes-importar:']
const eDoBanco = (k: string) => PREFIXOS.some((p) => k.startsWith(p))

/** O mínimo que o banco precisa do IndexedDB — nos testes, um de mentira. */
export type Fundo = {
  todas: () => Promise<[string, string][]>
  gravar: (k: string, v: string) => Promise<void>
  gravarVarias: (pares: [string, string][]) => Promise<void>
  apagar: (k: string) => Promise<void>
}

export function fundoIndexedDB(): Fundo {
  const loja = createStore('cosmarcos', 'dados')
  return {
    todas: async () => (await entries<string, string>(loja)).filter(([k, v]) => typeof k === 'string' && typeof v === 'string'),
    gravar: (k, v) => set(k, v, loja),
    gravarVarias: (pares) => setMany(pares, loja),
    apagar: (k) => del(k, loja),
  }
}

let memoria: Map<string, string> | null = null
const ouvintes = new Set<(e: unknown) => void>()

/** Avisa quando uma gravação no IndexedDB falhou. Devolve o "parar de ouvir". */
export function aoFalharGravacao(f: (e: unknown) => void): () => void {
  ouvintes.add(f)
  return () => ouvintes.delete(f)
}

function falhou(e: unknown) {
  console.warn('[cosmarcos] o IndexedDB não gravou:', e)
  for (const f of ouvintes) f(e)
}

/**
 * A cópia na memória, com a cara do localStorage (getItem/setItem/removeItem e
 * Object.keys) — é o que armazenamento.ts e copias.ts usam.
 */
function armazemDoBanco(m: Map<string, string>, f: Fundo): Storage {
  const s = {} as Record<string, string>
  for (const [k, v] of m) s[k] = v
  Object.defineProperties(s, {
    getItem: { value: (k: string) => m.get(k) ?? null },
    setItem: {
      value: (k: string, v: string) => {
        const texto = String(v)
        m.set(k, texto)
        s[k] = texto
        f.gravar(k, texto).catch(falhou)
      },
    },
    removeItem: {
      value: (k: string) => {
        m.delete(k)
        delete s[k]
        f.apagar(k).catch(falhou)
      },
    },
    length: { get: () => m.size },
    clear: { value: () => [...m.keys()].forEach((k) => (s as unknown as Storage).removeItem(k)) },
    key: { value: (i: number) => [...m.keys()][i] ?? null },
  })
  return s as unknown as Storage
}

let armazemAberto: Storage | null = null
let cota: number | null = null

/** Onde ler e gravar a ficha e as cópias: o banco aberto, ou o localStorage. */
export function armazem(): Storage {
  return armazemAberto ?? localStorage
}

/**
 * Abre o banco e traz tudo pra memória. Na primeira vez, MUDA a ficha e as
 * cópias do localStorage pra cá: grava no IndexedDB, confere relendo, e só
 * então apaga do localStorage. Qualquer falha: fica no localStorage, como antes.
 */
export async function abrirBanco(f: Fundo | null = podeUsarIndexedDB() ? fundoIndexedDB() : null): Promise<void> {
  if (!f) return
  try {
    const m = new Map(await f.todas())
    const doLocal = chavesDoLocal()
    if (doLocal.length > 0) {
      const pares = doLocal.map((k) => [k, localStorage.getItem(k) ?? ''] as [string, string])
      // o que já está no banco ganha (o local é mais velho: o banco já recebeu a mudança antes)
      const novos = pares.filter(([k]) => !m.has(k))
      await f.gravarVarias(novos)
      const conferido = new Map(await f.todas())
      if (novos.every(([k, v]) => conferido.get(k) === v)) {
        for (const [k, v] of novos) m.set(k, v)
        for (const k of doLocal) localStorage.removeItem(k)
      } else {
        throw new Error('a cópia pro IndexedDB não conferiu')
      }
    }
    memoria = m
    armazemAberto = armazemDoBanco(memoria, f)
    // quanto o navegador deixa este site guardar (o IndexedDB vai até perto disso)
    // (com limite de 1 s: a cota é só pro medidor, nunca segura a abertura da ficha)
    const estimativa = navigator.storage?.estimate?.().catch(() => undefined)
    const limite = new Promise<undefined>((ok) => setTimeout(() => ok(undefined), 1000))
    cota = (await Promise.race([estimativa, limite]))?.quota ?? null
  } catch (e) {
    console.warn('[cosmarcos] IndexedDB indisponível — a ficha continua no localStorage:', e)
    memoria = null
    armazemAberto = null
  }
}

function chavesDoLocal(): string[] {
  try {
    return Object.keys(localStorage).filter(eDoBanco)
  } catch {
    return []
  }
}

function podeUsarIndexedDB(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null
  } catch {
    return false
  }
}

/** Quanto o banco ocupa, em letras (pro medidor de espaço). 0 se estiver fechado. */
export function letrasNoBanco(): number {
  let n = 0
  if (memoria) for (const [k, v] of memoria) n += k.length + v.length
  return n
}

/** O teto do site em bytes, se o banco abriu e o navegador disse; senão `null`. */
export function cotaDoBanco(): number | null {
  return armazemAberto ? cota : null
}

/** Só pros testes: volta ao estado de antes de abrir. */
export function fecharBancoParaTeste(): void {
  memoria = null
  armazemAberto = null
}
