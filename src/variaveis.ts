/* arquivo: variaveis.ts */

/**
 * VARIÁVEIS DO PROJETO — o que a tela mostra em **palavra** e em **símbolo**.
 *
 * Irmão do `estilos/base.css`: lá mora a **cor e a forma**, aqui o **glifo e a
 * palavra**. Mudou o visual de alguma coisa? Provavelmente é num dos dois.
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
 * Os 6 atributos em texto. Duas formas porque a tela precisa das duas:
 * `abrev` no cabeçalho fixo (onde não cabe mais que 3 letras) e `nome` nos
 * títulos da aba Perícias e no detalhamento de um total.
 *
 * ⚠️ O **valor** do atributo não mora aqui — vem da ficha. Aqui é só o rótulo.
 */
export const ATRIBUTO: Record<NomeAtributo, { nome: string; abrev: string }> = {
  forca: { nome: 'Força', abrev: 'FOR' },
  velocidade: { nome: 'Velocidade', abrev: 'VEL' },
  intelecto: { nome: 'Intelecto', abrev: 'INT' },
  vontade: { nome: 'Vontade', abrev: 'VON' },
  consciencia: { nome: 'Consciência', abrev: 'CON' },
  presenca: { nome: 'Presença', abrev: 'PRE' },
}

/**
 * Os 3 recursos, com tudo que a tela precisa dizer sobre eles num lugar só:
 * símbolo e abreviação no cabeçalho fixo, nome e verbos no popover de
 * dano/cura (ControleRecurso).
 *
 * Os **verbos mudam por recurso** de propósito: em Vida se toma *dano* e se
 * *cura*; em Foco e Investidura se *gasta* e se *recupera*. É vocabulário de
 * mesa — o jogador não "cura foco".
 */
export const RECURSO: Record<
  keyof Personagem['recursos'],
  { nome: string; abrev: string; simbolo: string; diminuir: string; aumentar: string }
> = {
  vida: { nome: 'Vida', abrev: 'VIDA', simbolo: '♥', diminuir: 'Dano', aumentar: 'Curar' },
  foco: { nome: 'Foco', abrev: 'FOCO', simbolo: '◆', diminuir: 'Gastar', aumentar: 'Recuperar' },
  investidura: {
    nome: 'Investidura',
    abrev: 'INVEST', // cabeçalho não comporta "Investidura" inteiro
    simbolo: '✦',
    diminuir: 'Gastar',
    aumentar: 'Recuperar',
  },
}

/**
 * Cargas de fabrial — mesmo papel do RECURSO, pro popover de ± (ControleRecurso)
 * aberto pela aba Fabriais e pelo ataque de fabrial em Ações.
 */
export const CARGAS = { nome: 'Cargas', abrev: 'CARGAS', simbolo: '⚡', diminuir: 'Gastar', aumentar: 'Recarregar' }

/**
 * Os 3 grupos da ficha oficial — cada um junta uma defesa, dois atributos e
 * um recurso. É a estrutura que o cabeçalho fixo desenha lado a lado e a
 * ordem em que a aba Perícias agrupa as 18.
 *
 * ⚠️ Isto é **estrutura do sistema**, não gosto: quem decide que Física reúne
 * Força e Velocidade é o livro. Está aqui porque é como a tela organiza — se
 * um dia virar conta, vira regra e muda de casa.
 */
export const GRUPOS_FICHA = [
  { nome: 'Física', defesa: 'fisica', atribs: ['forca', 'velocidade'], recurso: 'vida' },
  { nome: 'Cognitiva', defesa: 'cognitiva', atribs: ['intelecto', 'vontade'], recurso: 'foco' },
  {
    nome: 'Espiritual',
    defesa: 'espiritual',
    atribs: ['consciencia', 'presenca'],
    recurso: 'investidura',
  },
] as const

/**
 * A ordem dos 6 atributos na tela — **derivada** dos grupos acima, nunca
 * escrita à mão. Antes disso existir, a ordem estava copiada no `Pericias.tsx`
 * e podia divergir do cabeçalho sem ninguém notar.
 */
export const ORDEM_ATRIBUTOS: readonly NomeAtributo[] = GRUPOS_FICHA.flatMap((g) => [...g.atribs])

/**
 * Rótulos de chrome — texto de botão e de aviso que não pertence a nenhuma
 * seção específica. Entram aqui os que aparecem em mais de um ponto da tela
 * ou que o César quis poder trocar numa linha só.
 *
 * Texto de uma aparição só ("carregando a ficha…", "algo quebrou") **não vem
 * pra cá** — fica onde é usado.
 */
export const ROTULO = {
  /** Mesmo botão pro export do Shards e pro backup do app — aparece 2× no rodapé. */
  importarJson: 'Importar JSON',
  fichaSalva: 'Ficha salva neste aparelho.',
  /** A gravação falhou (cota cheia, storage bloqueado) — a tela nunca diz "salva" nesse caso. */
  naoSalvou: 'NÃO salvou neste aparelho — baixe um backup agora.',
  /** Backup completo do app: ficha + escolhas + JSON do Shards. Volta pelo Importar. */
  baixarBackup: 'Baixar backup',
  backupBaixado: 'Backup baixado — guarde o arquivo. Ele volta pelo Importar.',
  /** Aviso fixo quando o save deste aparelho não abriu (foi pra quarentena). */
  saveNaoAbriu: 'O save deste aparelho não abriu',
  baixarDescartado: 'Baixar o save que não abriu',
  entendi: 'Entendi',
  /** Baixa o JSON que o Shards importa (Files → Import JSON). */
  exportarJson: 'Exportar pro Shards',
  exportado: 'Baixado — no Shards: Files → Import JSON.',
  /** Save antigo, sem o JSON original guardado: exportar precisa de uma importação antes. */
  exportarSemSemente: 'Importe o JSON do Shards uma vez antes de exportar.',
  /** Aviso antes de importar: importar sobrescreve tudo, sem fusão. */
  importarApaga: 'apaga tudo',
  cancelar: 'Cancelar',
  /** Bônus que o Shards exportou mas o app não soube ligar a um talento. */
  bonusSemOrigem: 'Talento não identificado (do Shards)',
  /** `aria-label` dos ✕ — leitor de tela precisa de palavra, não de glifo. */
  fechar: 'Fechar',
} as const
