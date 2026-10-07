/* arquivo: fluxo-gravitacao.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Fluxo Gravitação (árvore do Corredor dos Ventos e do Rompe-céu) — transcricao/05-trilhas-radiantes/05-corredor-dos-ventos.md + transcricao/06-fluxos/06-gravitacao.md + transcricao/05-trilhas-radiantes/10-rompe-ceu.md ──
export const TALENTOS_FLUXO_GRAVITACAO: Record<string, EntradaTalento> = {
  'gravitation::flying_ace': {
    nome: 'Ás Voador',
    nomeEn: 'Flying Ace',
    fonte: 'Fluxo · Gravitação',
    fonteEn: 'Surge · Gravitation',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: '1acao',
    descricao:
      'Enquanto mantém uma Projeção Básica em si, voa até sua taxa de gravitação; pode gastar 1 de foco para atacar corpo a corpo durante o voo e continuar o movimento. Ao adquirir, a taxa de gravitação sobe permanentemente para 12 metros.',
  },
  'gravitation::gravitational_slam': {
    nome: 'Pancada Gravitacional',
    nomeEn: 'Gravitational Slam',
    fonte: 'Fluxo · Gravitação',
    fonteEn: 'Surge · Gravitation',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'sempre',
    descricao:
      'Ao mover um alvo involuntário ou objeto com Projeção Básica contra uma superfície sólida, a colisão encerra o movimento e o alvo sofre 1d4 de dano impactante a cada 3 m movidos no turno (o dado escalona com graduações). O alvo pode usar a reação Evitar Perigo (Agilidade contra sua Gravitação) para sofrer metade.',
  },
  'gravitation::stable_flight': {
    nome: 'Voo Estável',
    nomeEn: 'Stable Flight',
    fonte: 'Fluxo · Gravitação',
    fonteEn: 'Surge · Gravitation',
    preRequisitos: 'Ás Voador',
    ativacao: 'sempre',
    descricao:
      'Enquanto mantém uma Projeção Básica em si, seus ataques à distância não sofrem desvantagem por voo ou piso instável.',
  },
  'gravitation::group_flight': {
    nome: 'Voo em Grupo',
    nomeEn: 'Group Flight',
    fonte: 'Fluxo · Gravitação',
    fonteEn: 'Surge · Gravitation',
    preRequisitos: 'Voo Estável',
    ativacao: 'sempre',
    descricao:
      'Fora de combate, ao infundir a si ou um voluntário com Projeção Básica, pode infundir também voluntários adicionais ao alcance, até suas graduações em Gravitação, sem Investidura extra para criar ou manter essas infusões.',
  },
  'gravitation::aerial_squadron': {
    nome: 'Esquadrão Aéreo',
    nomeEn: 'Aerial Squadron',
    fonte: 'Fluxo · Gravitação',
    fonteEn: 'Surge · Gravitation',
    preRequisitos: 'Gravitação 3+; Voo em Grupo',
    ativacao: 'sempre',
    descricao: 'Pode usar Voo em Grupo também em combate.',
  },
  'gravitation::lashing_shot': {
    nome: 'Projeção de Tiro',
    nomeEn: 'Lashing Shot',
    fonte: 'Fluxo · Gravitação',
    fonteEn: 'Surge · Gravitation',
    preRequisitos: 'Pancada Gravitacional',
    ativacao: '2acoes',
    descricao:
      'Toca um objeto solto de tamanho compatível e o propele contra um alvo em linha de efeito, gastando Investidura igual à distância dividida pela taxa de gravitação (arredondada para cima). Faz um ataque à distância de Gravitação contra a defesa Física, causando 2d4 de dano impactante (escalona com graduações).',
  },
  'gravitation::multiple_lashings': {
    nome: 'Projeções Múltiplas',
    nomeEn: 'Multiple Lashings',
    fonte: 'Fluxo · Gravitação',
    fonteEn: 'Surge · Gravitation',
    preRequisitos: 'Pancada Gravitacional',
    ativacao: 'especial',
    descricao:
      'Após vencer o teste de Gravitação para mover um personagem involuntário, pode infundi-lo com Investidura até suas graduações em Gravitação; o efeito dura até a infusão acabar, em vez de só até o início do seu próximo turno.',
  },
  'gravitation::master_of_the_skies': {
    nome: 'Mestre dos Céus',
    nomeEn: 'Master of the Skies',
    fonte: 'Fluxo · Gravitação',
    fonteEn: 'Surge · Gravitation',
    preRequisitos: 'Voo em Grupo ou Projeção de Tiro',
    ativacao: 'sempre',
    descricao:
      'Enquanto tiver 1 ponto ou mais de Investidura, recebe os benefícios de estar infundido com Gravitação sem gastar Investidura.',
  },
}
