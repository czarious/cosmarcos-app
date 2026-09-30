/* arquivo: acoes.ts */
import type { Ativacao } from '../tipos/personagem'

/**
 * CATÁLOGO DE AÇÕES — Cap. 10 (Ações e Reações). Paráfrase própria, nunca
 * cópia do livro (arquivo público, premissas.md → "GitHub Pages, repositório público").
 */

/** O que usar a ação desconta da ficha, além das ▶/↻ (quem conta essas é regras/turno.ts). */
export type Custo = { foco?: number; investidura?: number }

/**
 * O que a ação FAZ na ficha quando usada — quem aplica é estado/useTurno.ts.
 * Só entra aqui efeito que o app consegue aplicar sem inventar regra:
 *  - inspirar: Investidura cheia
 *  - aprimorar: Aprimorado [+1 FOR] e [+1 VEL] até o fim do próximo turno
 *  - restaurar: cura 1d6 (rolado na mão) + patamar
 *  - recuperar: o dado de recuperação, dividido entre Vida e Foco (como o descanso curto)
 *  - preparar: reserva ▶ pra usar fora do turno
 */
export type EfeitoAcao = 'inspirar' | 'aprimorar' | 'restaurar' | 'recuperar' | 'preparar'

export type EntradaAcao = {
  nome: string
  /**
   * Nome em inglês — referencia/livro/dicionario-en-ptbr.md → "Ações de Combate". Inferidos (o
   * dicionário não achou literal no Shards): Auxiliar, Empurrar, Falar, Largar, Preparar,
   * Recuperar, as de Luz das Tempestades e as de espreno.
   */
  nomeEn: string
  ativacao: Ativacao
  resumo: string
  custo?: Custo
  /** O livro deixa repetir no mesmo turno (Golpear, Interagir, Mover). O resto: uma vez por turno. */
  repetivel?: boolean
  efeito?: EfeitoAcao
  umaVezPorCena?: boolean
  /** Vale mesmo Inconsciente ou impedido de agir (Inspirar, Restaurar). */
  mesmoInconsciente?: boolean
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
  { nome: 'Agarrar', nomeEn: 'Grapple', ativacao: '2acoes', resumo: 'Teste de Atletismo vs. defesa Física — sucesso deixa o alvo Restringido até você soltar, ficar Inconsciente ou ele sair do alcance.' },
  { nome: 'Auxiliar', nomeEn: 'Assist', ativacao: 'reacao', custo: { foco: 1 }, resumo: 'Gasta 1 foco pra dar vantagem no teste de um aliado, antes dele rolar.' },
  { nome: 'Desengajar', nomeEn: 'Disengage', ativacao: '1acao', resumo: 'Move 1,5 m sem sofrer Golpe Reativo.' },
  { nome: 'Empurrar', nomeEn: 'Push', ativacao: '2acoes', resumo: 'Teste de Atletismo vs. defesa Física — sucesso empurra ou puxa o alvo 1,5 m.' },
  { nome: 'Esquivar', nomeEn: 'Dodge', ativacao: 'reacao', custo: { foco: 1 }, resumo: 'Gasta 1 foco pra impor desvantagem num ataque mirado em você (não vale contra área/vários alvos).' },
  { nome: 'Evitar Perigo', nomeEn: 'Avoid Danger', ativacao: 'reacao', resumo: 'Teste de Agilidade contra um perigo do ambiente — CD = resultado do teste acionador, ou 15 se não houver.' },
  { nome: 'Falar', nomeEn: 'Speak', ativacao: 'livre', resumo: 'Fala livremente; algo mais elaborado exige Usar uma Perícia.' },
  { nome: 'Ganhar Vantagem', nomeEn: 'Gain Advantage', ativacao: '1acao', resumo: 'Teste de perícia vs. defesa — sucesso dá vantagem no PRÓXIMO teste, com perícia diferente.' },
  { nome: 'Golpe Reativo', nomeEn: 'Reactive Strike', ativacao: 'reacao', custo: { foco: 1 }, resumo: 'Gasta 1 foco pra atacar corpo a corpo quem sai voluntariamente do seu alcance. Não vale contra quem se move com Transporte ou instantaneamente.' },
  { nome: 'Golpear', nomeEn: 'Strike', ativacao: '1acao', resumo: 'Ataca com arma ou desarmado contra a defesa Física. Pode repetir no turno, cada ataque com uma mão diferente; com a mão inábil custa 2 de foco.' },
  { nome: 'Interagir', nomeEn: 'Interact', ativacao: '1acao', repetivel: true, resumo: 'Interage rápido com um objeto, sem teste — pode repetir no turno.' },
  { nome: 'Largar', nomeEn: 'Drop', ativacao: 'livre', resumo: 'Larga qualquer quantidade de itens das mãos. No turno de outro personagem, só com Preparar.' },
  { nome: 'Mover', nomeEn: 'Move', ativacao: '1acao', repetivel: true, resumo: 'Move até sua taxa de movimento; pode repetir no turno. Rastejar, escalar, nadar ou ser furtivo deixa Lento; saltar ou escalar pode pedir teste de Agilidade ou Atletismo.' },
  { nome: 'Preparar', nomeEn: 'Prepare', ativacao: '1acao', efeito: 'preparar', resumo: 'Reserva 1▶ + o custo da ação escolhida, pra usar em resposta a um gatilho antes do seu próximo turno.' },
  { nome: 'Proteger', nomeEn: 'Brace', ativacao: '1acao', resumo: 'Atrás de cobertura a até 1,5 m, ataques contra você sofrem desvantagem até você atacar ou se mover.' },
  { nome: 'Recuperar', nomeEn: 'Recover', ativacao: '2acoes', efeito: 'recuperar', umaVezPorCena: true, resumo: 'Rola o dado de recuperação como um descanso curto; só uma vez por cena.' },
  { nome: 'Usar uma Perícia', nomeEn: 'Use a Skill', ativacao: '1acao', resumo: 'Usa qualquer perícia pra uma tarefa desafiadora em combate.' },
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
      nomeEn: 'Breathe Stormlight',
      ativacao: '2acoes',
      efeito: 'inspirar',
      mesmoInconsciente: true,
      resumo: 'Drena esferas infundidas a até 1,5 m e recupera Investidura até o máximo. Funciona mesmo Inconsciente.',
    },
    {
      nome: 'Aprimorar',
      nomeEn: 'Enhance',
      ativacao: '1acao',
      custo: { investidura: 1 },
      efeito: 'aprimorar',
      resumo: 'Gasta 1 Investidura pra ficar Aprimorado [+1 Força] e [+1 Velocidade] até o fim do próximo turno; manter depois custa 1 Investidura como ação livre por turno.',
    },
    {
      nome: 'Restaurar',
      nomeEn: 'Regenerate',
      ativacao: 'livre',
      custo: { investidura: 1 },
      efeito: 'restaurar',
      mesmoInconsciente: true,
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
    nomeEn: 'Covert Reconnaissance',
    custo: { foco: 2 },
    ativacao: 'especial',
    resumo:
      'Custa 2 de foco. Ao longo de minutos, o espreno faz reconhecimento furtivo de uma área na distância do vínculo e reporta o que viu. Pra certas informações, o Mestre pode pedir teste de Consciência.',
  },
  {
    nome: 'Encorajar Juramento',
    nomeEn: 'Encourage Oath',
    custo: { foco: 2 },
    ativacao: 'livre',
    resumo:
      'Custa 2 de foco (▷ ou ↻). Diante de dificuldade, o espreno encoraja o Radiante — vantagem no próximo teste contra hesitação, medo ou o obstáculo.',
  },
  {
    nome: 'Alertar Subitamente',
    nomeEn: 'Sudden Alert',
    custo: { foco: 3 },
    ativacao: 'especial',
    resumo:
      'Custa 3 de foco. Em perigo, o espreno alerta o Radiante — pode ignorar Surpreendido ou reagir a uma ameaça não detectada.',
  },
  {
    nome: 'Traduzir',
    nomeEn: 'Translate',
    custo: { foco: 2 },
    ativacao: '2acoes',
    resumo:
      'Custa 2 de foco. Por 1 minuto, o espreno traduz línguas rosharanas faladas/escritas (inclusive de Shadesmar) — o Radiante entende e é entendido; ou o espreno lê em voz alta uma página que ele não sabe ler.',
  },
]
