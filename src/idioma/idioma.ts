/* arquivo: idioma.ts */
import { PT, type Dicionario, type Mensagem, type Plural, type Rotulo } from './pt'
import { EN } from './en'
import { NOMES_EN } from './nomes'

/**
 * IDIOMA DA TELA — como uma variável de texto (pt.ts / en.ts) ou um nome de
 * jogo (nomes.ts) vira a palavra que aparece. Decisão: premissas.md →
 * "Textos em variáveis, um arquivo por idioma".
 *
 * Texto que o JOGADOR escreveu (anotação, objetivo, Ideal, pertences) nunca
 * passa por aqui — decisão do César, 30/Set/2026.
 */

export type Idioma = 'pt' | 'en'

export const IDIOMAS: Record<Idioma, string> = { pt: 'Português', en: 'English' }

export const DICIONARIO: Record<Idioma, Dicionario> = { pt: PT, en: EN }

/** Etiqueta BCP 47 — pro `<html lang>` (W3C) e pra formatar número (Intl). */
export const LOCALE: Record<Idioma, string> = { pt: 'pt-BR', en: 'en-US' }

type Vars = Record<string, string | number>

/** Preenche as lacunas {x} de uma variável de texto. */
export function preencher(modelo: string, vars?: Vars): string {
  return vars ? modelo.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`)) : modelo
}

/** Plural pela regra do idioma (Intl.PluralRules) — "0 dia" em PT, "0 days" em EN. `n` entra nas lacunas. */
export function plural(p: Plural, n: number, idioma: Idioma, vars?: Vars): string {
  const forma = new Intl.PluralRules(LOCALE[idioma]).select(n) === 'one' ? 'um' : 'varios'
  return preencher(p[forma], { n, ...vars })
}

/**
 * Nome de jogo (perícia, arma, ação, condição…) no idioma. Parâmetro entre
 * colchetes fica como está: "Arremesso [6/18]" → "Thrown [6/18]". Sem inglês
 * conhecido, fica como veio — item criado pelo jogador.
 */
export function nome(pt: string, idioma: Idioma): string {
  if (idioma === 'pt') return pt
  if (pt in NOMES_EN) return NOMES_EN[pt]
  const m = /^(.+?) (\[[^\]]*\])$/.exec(pt)
  return m && m[1] in NOMES_EN ? `${NOMES_EN[m[1]]} ${m[2]}` : pt
}

/** Mensagem de regra: lacuna de texto é nome de jogo e passa por `nome()`. */
export function mensagem(m: Mensagem, idioma: Idioma): string {
  const vars =
    m.vars &&
    Object.fromEntries(
      Object.entries(m.vars).map(([k, v]) => [k, Array.isArray(v) ? v.map((x) => nome(x, idioma)).join(', ') : typeof v === 'string' ? nome(v, idioma) : v]),
    )
  const t = m.texto(DICIONARIO[idioma])
  return typeof t === 'string' ? preencher(t, vars) : plural(t, Number(vars?.n ?? 0), idioma, vars)
}

/** Origem de um bônus: nome de jogo ou mensagem. */
export function rotulo(r: Rotulo, idioma: Idioma): string {
  return typeof r === 'string' ? nome(r, idioma) : mensagem(r, idioma)
}

/** Número no formato do idioma: 14,5 × 14.5. */
export function numero(n: number, idioma: Idioma, casas?: number): string {
  return n.toLocaleString(LOCALE[idioma], { minimumFractionDigits: casas ?? 0, maximumFractionDigits: casas ?? 2 })
}
