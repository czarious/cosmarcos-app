/* arquivo: talentos.ts */
import type { Ativacao, Pericia } from '../tipos/personagem'

/**
 * CATÁLOGO DE TALENTOS — a regra em si, universal (vale pra qualquer
 * personagem com o talento, não só o Eccho). O Shards só manda
 * `{id, nome, origem, chave}` (ver tipos/personagem.ts); ativação e efeito
 * são REGRA, não dado — premissas.md → "A ficha inteligente é o objetivo".
 *
 * Fonte: transcrição do Guia de Regras PT-BR (referencia/livro/transcricao/,
 * não versionada). Texto aqui é PARÁFRASE própria, nunca cópia do livro —
 * este arquivo é público no repo (premissas.md → "GitHub Pages, repositório público"), diferente da transcrição.
 *
 * Organizado em blocos por TRILHA de origem — mesma divisão da transcrição
 * (04-trilhas-heroicas/, 05-trilhas-radiantes/). Cresce um bloco por vez.
 */

/**
 * VAGA — uma escolha em aberto que o talento concede (ex.: Erudição pede
 * 1 especialidade + 2 perícias). Diferente da descrição (fixa, universal),
 * a vaga é o que o JOGADOR escolhe — a resposta mora no estado vivo do app
 * (usePersonagem), não aqui. Ver regras/especialidades.ts pro valor inicial.
 */
export type TipoVaga = 'pericia' | 'especialidade'

export type VagaTalento = {
  tipo: TipoVaga
  indice: number // 0, 1... quando o talento pede mais de uma vaga do mesmo tipo
  rotulo: string
  rotuloEn: string
  /** Só pra vaga tipo 'pericia' — filtra as opções do dropdown pela regra do talento. */
  filtroPericia?: (p: Pericia) => boolean
}

/** A escolha atual de UMA vaga — é isto que vive no estado (usePersonagem). */
export type EscolhaVaga = {
  talentoId: string
  tipo: TipoVaga
  indice: number
  /** id de Pericia (tipo 'pericia') ou nome de Especializacao (tipo 'especialidade'). */
  valor: string | undefined
}

export function chaveVaga(talentoId: string, tipo: TipoVaga, indice: number): string {
  return `${talentoId}#${tipo}#${indice}`
}

export type EntradaTalento = {
  nome: string // canônico PT-BR do livro
  nomeEn: string // como o Shards escreve (dicionário → "Trilhas Heroicas", "Ordens Radiantes")
  fonte: string // trilha/especialização, pra exibir
  fonteEn: string
  preRequisitos: string
  ativacao: Ativacao
  descricao: string
  /** Presente só nos talentos com escolha em aberto (ex.: Erudição). */
  vagas?: VagaTalento[]
}

// O símbolo de exibição de cada ativação mudou de casa: é rótulo de tela, não
// catálogo de talento. Mora em `variaveis.ts` → SIMBOLO_ATIVACAO.

// ── Cap. 4 · Trilha heroica: Erudito ──────────────────────────────
const TALENTOS_ERUDITO: Record<string, EntradaTalento> = {
  'scholar::key::erudition': {
    nome: 'Erudição',
    nomeEn: 'Erudition',
    fonte: 'Talento-chave · Erudito',
    fonteEn: 'Key talent · Scholar',
    preRequisitos: 'nenhum',
    ativacao: 'especial',
    descricao:
      'Ao adquirir, escolhe uma especialidade cultural ou de utilidade que ainda não tenha, e duas perícias cognitivas que não sejam de fluxo. Passa a contar como se tivesse a especialidade escolhida, e ganha +1 graduação em cada uma das duas perícias — mesmo acima do teto normal de graduação do patamar (é uma exceção explícita da regra de teto). Especialidade e graduações são temporárias: depois de um descanso longo com acesso a uma biblioteca, podem ser redistribuídas.',
    vagas: [
      { tipo: 'especialidade', indice: 0, rotulo: 'Especialidade concedida (cultural ou utilidade)', rotuloEn: 'Granted expertise (cultural or utility)' },
      {
        tipo: 'pericia',
        indice: 0,
        rotulo: 'Perícia bônus 1 (cognitiva)',
        rotuloEn: 'Bonus skill 1 (cognitive)',
        filtroPericia: (p) => p.atributo === 'intelecto' || p.atributo === 'vontade',
      },
      {
        tipo: 'pericia',
        indice: 1,
        rotulo: 'Perícia bônus 2 (cognitiva)',
        rotuloEn: 'Bonus skill 2 (cognitive)',
        filtroPericia: (p) => p.atributo === 'intelecto' || p.atributo === 'vontade',
      },
    ],
  },
  'scholar::artifabrian::efficient-engineer': {
    nome: 'Engenheiro Eficiente',
    nomeEn: 'Efficient Engineer',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'Manufatura 1+; talento-chave Erudição',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, ganha uma especialidade de utilidade (Manufatura de Arma, Armadura ou Equipamento) e um item à escolha (dorial amplificador, dorial entorpecente, ou um par de telepenas com bracelete de emoção). Ao manufaturar um item ou inventar um fabrial, o intervalo de Oportunidade desses testes aumenta em 2 pontos, e o custo de matéria-prima cai pela metade.',
  },
  'scholar::artifabrian::prized-acquisition': {
    nome: 'Aquisição Valiosa',
    nomeEn: 'Prized Acquisition',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'talento-chave Erudição',
    ativacao: 'especial',
    descricao:
      'Ao adquirir, ganha uma especialidade de perito em Manufatura de Fabrial e uma gema especialmente lapidada, usada como matéria-prima para um fabrial — ela vale como a gema de um fabrial único do patamar atual do personagem. Na primeira tentativa com essa gema, o tempo normal para atrair um espreno e manufaturar é ignorado. A gema não pode ser vendida nem trocada; se perdida, pode ser substituída após um descanso longo (a critério do MJ). Durante o recesso, é possível desfazer o fabrial pra recuperar a gema e reaproveitá-la.',
  },
  'scholar::artifabrian::fine-handiwork': {
    nome: 'Trabalho Manual Refinado',
    nomeEn: 'Fine Handiwork',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'talento Engenheiro Eficiente',
    ativacao: 'especial',
    descricao:
      'Ao manufaturar um item ou inventar um fabrial, pode gastar apenas uma melhoria (em vez de duas) para aplicar uma característica avançada. Só se beneficia deste talento uma vez por item.',
  },
}

// ── Cap. 5 · Trilha Radiante: Alternauta ──────────────────────────
const TALENTOS_ALTERNAUTA: Record<string, EntradaTalento> = {
  'elsecaller::first-ideal-elsecaller-key': {
    nome: 'Primeiro Ideal',
    nomeEn: 'First Ideal',
    fonte: 'Talento-chave · Alternauta',
    fonteEn: 'Key talent · Elsecaller',
    preRequisitos: 'Nível 2+',
    ativacao: 'especial',
    descricao:
      'Ao adquirir, ganha acesso à Investidura (máximo inicial = 2 + o maior entre Consciência e Presença) e destrava as ações Inspirar Luz das Tempestades, Aprimorar e Restaurar. Ganha o objetivo "Dizer o Primeiro Ideal" — ao completá-lo, fica Potencializado até o fim da cena, ganha os fluxos de Transformação e Transporte (1 graduação inicial em cada) e desbloqueia a árvore de talentos de Vínculo com Espreno de Tinta.',
  },
}

/** Catálogo consultado pela tela — junta todos os blocos acima. */
export const CATALOGO_TALENTOS: Record<string, EntradaTalento> = {
  ...TALENTOS_ERUDITO,
  ...TALENTOS_ALTERNAUTA,
}
