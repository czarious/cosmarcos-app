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
  if (pt in NOMES_EN) return medidas(NOMES_EN[pt], idioma)
  const m = /^(.+?) (\[[^\]]*\])$/.exec(pt)
  return medidas(m && m[1] in NOMES_EN ? `${NOMES_EN[m[1]]} ${m[2]}` : pt, idioma)
}

// ── medidas ─────────────────────────────────────────────────────────
// O app guarda metro e quilo, na conta do livro PT-BR (5 ft = 1,5 m · 2 lb = 1 kg):
// o tradutor converte na entrada (estado/importarShards.ts). Em inglês a tela
// desfaz a mesma conta — 9 m volta a 30 ft, 50 kg a 100 lb, como no livro em inglês.
const PES_POR_METRO = 5 / 1.5
const LIBRAS_POR_KG = 2

/** Metros → pés, na meia unidade (0,75 m = 2,5 ft). */
function emPes(m: number): number {
  return Math.round(m * PES_POR_METRO * 2) / 2
}

/** Distância com unidade, formatada pelo próprio navegador (Intl, estilo unidade): "9 m" · "30 ft". */
export function distancia(m: number, idioma: Idioma): string {
  const [valor, unit] = idioma === 'pt' ? [m, 'meter'] : [emPes(m), 'foot']
  return valor.toLocaleString(LOCALE[idioma], { style: 'unit', unit, maximumFractionDigits: 2 })
}

/** Peso no idioma, só o número (kg → lb em inglês) — a unidade é `unidadePeso`. */
export function pesoNumero(kg: number, idioma: Idioma, casas?: number): string {
  return numero(idioma === 'pt' ? kg : kg * LIBRAS_POR_KG, idioma, casas)
}

export function unidadePeso(idioma: Idioma): string {
  return idioma === 'pt' ? 'kg' : 'lb'
}

/** Peso digitado na tela (lb em inglês) → kg, que é o que a ficha guarda. */
export function pesoDigitadoEmKg(valor: number, idioma: Idioma): number {
  return idioma === 'pt' ? valor : valor / LIBRAS_POR_KG
}

/** Toda medida dentro de um texto ("9/36 m", "Pequeno (0,75 m)", "50 kg"): em inglês, vira pés/libras. */
export function medidas(texto: string, idioma: Idioma): string {
  if (idioma === 'pt') return texto
  return texto.replace(/(\d+(?:[.,]\d+)?(?:\/\d+(?:[.,]\d+)?)*) ?(m|kg)\b/g, (_, nums: string, u: string) =>
    nums
      .split('/')
      .map((x) => numero(u === 'm' ? emPes(Number(x.replace(',', '.'))) : Number(x.replace(',', '.')) * LIBRAS_POR_KG, idioma))
      .join('/') + (u === 'm' ? ' ft' : ' lb'),
  )
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
