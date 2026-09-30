/* arquivo: variaveis.ts */

/**
 * VARIÁVEIS GLOBAIS — os **símbolos** e a **estrutura** da tela, sem palavra nenhuma.
 *
 * Três irmãos: aqui o **glifo**; em `estilos/base.css` a **cor e a forma**; em
 * `idioma/pt.ts` e `idioma/en.ts` a **palavra**, em cada idioma. Mudou o visual
 * de alguma coisa? Provavelmente é num dos três.
 *
 * ⚠️ ANTES DE ACRESCENTAR ALGO AQUI — as duas regras, e o porquê delas está
 * em escopo/premissas.md → "O que vira variável":
 *   1. Só entra o que aparece em **mais de um arquivo**, ou que muda muito.
 *   2. **Conteúdo do sistema nunca entra** (talento, cultura, perícia, traço,
 *      tipo de dano) — isso é regra do Cosmere e mora em `regras/*.ts`.
 *
 * Toda variável leva nota dizendo o que é e onde aparece. Nota difícil de
 * escrever = a variável não pertence aqui.
 */

import type { Personagem, NomeAtributo, Ativacao } from './tipos/personagem'

/**
 * Ícones de interação — os glifos dos botões, sem significado de regra.
 * `fechar` aparece em 4 telas (ControleRecurso · PopoverDetalhe · Anotações ·
 * Inventário); os outros, no ControleRecurso e na aba Perícias.
 * Trocar aqui muda a cara do app inteiro de uma vez.
 */
export const ICONE = {
  fechar: '✕',
  /** Graduação de perícia conquistada por nível — conta pro teto do patamar. */
  graduacaoCheia: '●',
  /** Vaga de graduação ainda aberta, até o teto do patamar. */
  graduacaoVazia: '○',
  /** Graduação vinda de talento — **isenta** do teto (ver regras/pericias.ts). */
  graduacaoTalento: '◎',
  /** Marca de talento-chave da trilha (o ★ do Shards). */
  talentoChave: '★',
  /** A engrenagem do topo (MenuEngrenagem) — importar, exportar, backup. */
  menu: '⚙',
} as const

/**
 * Símbolos de ativação — **são do livro** (Introdução p.10), não são escolha
 * nossa: ▶ ação · ▶▶ duas · ▶▶▶ três · ▷ livre · ↻ reação · ★ especial · ∞ sempre.
 * Usados nas abas Ações e Talentos.
 *
 * ⚠️ Só muda se o livro desmentir — não é ajuste de gosto. Já estiveram
 * trocados uma vez no schema, e o livro corrigiu.
 */
export const SIMBOLO_ATIVACAO: Record<Ativacao, string> = {
  '1acao': '▶',
  '2acoes': '▶▶',
  '3acoes': '▶▶▶',
  livre: '▷',
  reacao: '↻',
  especial: '★',
  sempre: '∞',
}

/**
 * Símbolo de cada contador da ficha — cabeçalho fixo, popover de ±, custo no
 * "Usar" da aba Ações. O NOME e os verbos são palavras: moram em idioma/pt.ts →
 * `recursos` (e o en.ts), e `VERBOS_RECURSO` diz quais.
 */
export const SIMBOLO_RECURSO: Record<keyof Personagem['recursos'] | 'cargas', string> = {
  vida: '♥',
  foco: '◆',
  investidura: '✦',
  cargas: '⚡',
}

/**
 * Os **verbos mudam por contador** de propósito: em Vida se toma *dano* e se
 * *cura*; em Foco e Investidura se *gasta* e se *recupera*; carga se *recarrega*.
 * É vocabulário de mesa — o jogador não "cura foco". Valores = chaves de `recursos` no idioma.
 */
export const VERBOS_RECURSO = {
  vida: ['dano', 'curar'],
  foco: ['gastar', 'recuperar'],
  investidura: ['gastar', 'recuperar'],
  cargas: ['gastar', 'recarregar'],
} as const

/**
 * Os 3 grupos da ficha oficial — cada um junta uma defesa, dois atributos e
 * um recurso. É a estrutura dos cartões da aba Principal, a ordem dos
 * recursos no cabeçalho fixo e a ordem em que a aba Perícias agrupa as 18.
 *
 * ⚠️ Isto é **estrutura do sistema**, não gosto: quem decide que Física reúne
 * Força e Velocidade é o livro. Está aqui porque é como a tela organiza — se
 * um dia virar conta, vira regra e muda de casa.
 */
export const GRUPOS_FICHA = [
  { defesa: 'fisica', atribs: ['forca', 'velocidade'], recurso: 'vida' },
  { defesa: 'cognitiva', atribs: ['intelecto', 'vontade'], recurso: 'foco' },
  { defesa: 'espiritual', atribs: ['consciencia', 'presenca'], recurso: 'investidura' },
] as const // o nome de cada grupo é palavra: idioma/pt.ts → grupos

/**
 * A ordem dos 6 atributos na tela — **derivada** dos grupos acima, nunca
 * escrita à mão. Antes disso existir, a ordem estava copiada no `Pericias.tsx`
 * e podia divergir da ficha oficial sem ninguém notar.
 */
export const ORDEM_ATRIBUTOS: readonly NomeAtributo[] = GRUPOS_FICHA.flatMap((g) => [...g.atribs])
