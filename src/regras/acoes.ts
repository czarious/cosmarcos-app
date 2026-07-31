/* arquivo: acoes.ts */
import type { Ativacao } from '../tipos/personagem'

/**
 * CATÁLOGO DE AÇÕES — Cap. 10 (Ações e Reações). Paráfrase própria, nunca
 * cópia do livro (arquivo público, decisão 0004).
 */

export type EntradaAcao = {
  nome: string
  ativacao: Ativacao
  resumo: string
}

/** Ordem de exibição dentro de cada grupo: ★ primeiro, depois ▶▶▶/▶▶/▶, depois ▷, ↻, ∞. */
const PRIORIDADE_ATIVACAO: Record<Ativacao, number> = {
  especial: 0,
  '3acoes': 1,
  '2acoes': 2,
  '1acao': 3,
  livre: 4,
  reacao: 5,
  sempre: 6,
}

/** Comparador puro — pra usar com `.sort()` em qualquer formato de lista (inclusive aninhado). */
export function compararAtivacao(a: Ativacao, b: Ativacao): number {
  return PRIORIDADE_ATIVACAO[a] - PRIORIDADE_ATIVACAO[b]
}

/** Ordena uma lista de EntradaAcao (formato simples) pela prioridade de ativação. */
export function ordenarPorAtivacao<T extends { ativacao: Ativacao }>(acoes: T[]): T[] {
  return [...acoes].sort((a, b) => compararAtivacao(a.ativacao, b.ativacao))
}

/** As 17 ações/reações/ações-livres padrão de combate — valem pra qualquer personagem. */
export const ACOES_PADRAO: EntradaAcao[] = [
  { nome: 'Agarrar', ativacao: '2acoes', resumo: 'Teste de Atletismo vs. defesa Física — sucesso deixa o alvo Restringido até você soltar, ficar Inconsciente ou ele sair do alcance.' },
  { nome: 'Auxiliar', ativacao: 'reacao', resumo: 'Gasta 1 foco pra dar vantagem no teste de um aliado, antes dele rolar.' },
  { nome: 'Desengajar', ativacao: '1acao', resumo: 'Move 1,5 m sem sofrer Golpe Reativo.' },
  { nome: 'Empurrar', ativacao: '2acoes', resumo: 'Teste de Atletismo vs. defesa Física — sucesso empurra ou puxa o alvo 1,5 m.' },
  { nome: 'Esquivar', ativacao: 'reacao', resumo: 'Gasta 1 foco pra impor desvantagem num ataque mirado em você (não vale contra área/vários alvos).' },
  { nome: 'Evitar Perigo', ativacao: 'reacao', resumo: 'Teste de Agilidade contra um perigo do ambiente — CD = resultado do teste acionador, ou 15 se não houver.' },
  { nome: 'Falar', ativacao: 'livre', resumo: 'Fala livremente; algo mais elaborado exige Usar uma Perícia.' },
  { nome: 'Ganhar Vantagem', ativacao: '1acao', resumo: 'Teste de perícia vs. defesa — sucesso dá vantagem no PRÓXIMO teste, com perícia diferente.' },
  { nome: 'Golpe Reativo', ativacao: 'reacao', resumo: 'Gasta 1 foco pra atacar corpo a corpo quem sai voluntariamente do seu alcance.' },
  { nome: 'Golpear', ativacao: '1acao', resumo: 'Ataca com arma ou desarmado contra a defesa Física; atacar com a mão inábil custa 2 de foco.' },
  { nome: 'Interagir', ativacao: '1acao', resumo: 'Interage rápido com um objeto, sem teste — pode repetir no turno.' },
  { nome: 'Largar', ativacao: 'livre', resumo: 'Larga qualquer quantidade de itens das mãos.' },
  { nome: 'Mover', ativacao: '1acao', resumo: 'Move até sua taxa de movimento; rastejar, escalar, nadar ou ser furtivo deixa Lento durante o movimento.' },
  { nome: 'Preparar', ativacao: '1acao', resumo: 'Reserva 1▶ + o custo da ação escolhida, pra usar em resposta a um gatilho antes do seu próximo turno.' },
  { nome: 'Proteger', ativacao: '1acao', resumo: 'Atrás de cobertura a até 1,5 m, ataques contra você sofrem desvantagem até você atacar ou se mover.' },
  { nome: 'Recuperar', ativacao: '2acoes', resumo: 'Rola o dado de recuperação como um descanso curto; só uma vez por cena.' },
  { nome: 'Usar uma Perícia', ativacao: '1acao', resumo: 'Usa qualquer perícia pra uma tarefa desafiadora em combate.' },
]

/**
 * Ações que um talento específico desbloqueia — chave é o `id` do talento
 * (mesma convenção de regras/talentos.ts). Só entra aqui o que já foi
 * conferido contra a transcrição do livro.
 */
export const ACOES_CONCEDIDAS: Record<string, EntradaAcao[]> = {
  'elsecaller::first-ideal-elsecaller-key': [
    {
      nome: 'Inspirar Luz das Tempestades',
      ativacao: '2acoes',
      resumo: 'Drena esferas infundidas a até 1,5 m e recupera Investidura até o máximo. Funciona mesmo Inconsciente.',
    },
    {
      nome: 'Aprimorar',
      ativacao: '1acao',
      resumo: 'Gasta 1 Investidura pra ficar Aprimorado [+1 Força] e [+1 Velocidade] até o fim do próximo turno; manter depois custa 1 Investidura como ação livre por turno.',
    },
    {
      nome: 'Restaurar',
      ativacao: 'livre',
      resumo: 'Gasta 1 Investidura pra recuperar 1d6 + patamar de vida. Funciona mesmo Inconsciente.',
    },
  ],
}

/**
 * Habilidades de Espreno — Cap. 5 (Jogando como um Radiante). Valem pra
 * QUALQUER Radiante vinculado a um espreno, não dependem de talento
 * específico — condicional em `ficha.radiante` existir (não numa vaga).
 */
export const ACOES_ESPRENO: EntradaAcao[] = [
  {
    nome: 'Reconhecer Escondido',
    ativacao: 'especial',
    resumo:
      'Custa 2 de foco. Ao longo de minutos, o espreno faz reconhecimento furtivo de uma área na distância do vínculo e reporta o que viu.',
  },
  {
    nome: 'Encorajar Juramento',
    ativacao: 'livre',
    resumo:
      'Custa 2 de foco (▷ ou ↻). Diante de dificuldade, o espreno encoraja o Radiante — vantagem no próximo teste contra hesitação, medo ou o obstáculo.',
  },
  {
    nome: 'Alertar Subitamente',
    ativacao: 'especial',
    resumo:
      'Custa 3 de foco. Em perigo, o espreno alerta o Radiante — pode ignorar Surpreendido ou reagir a uma ameaça não detectada.',
  },
  {
    nome: 'Traduzir',
    ativacao: '2acoes',
    resumo:
      'Custa 2 de foco. Por 1 minuto, o espreno traduz línguas rosharanas faladas/escritas — o Radiante entende e é entendido.',
  },
]
