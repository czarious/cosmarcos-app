/* arquivo: fluxo-progressao.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Fluxo Progressão (árvore do Dançarino de Precipícios) — transcricao/05-trilhas-radiantes/06-dancarino-de-precipicios.md ──
export const TALENTOS_FLUXO_PROGRESSAO: Record<string, EntradaTalento> = {
  'progression::explosive_growth': {
    nome: 'Crescimento Explosivo',
    nomeEn: 'Explosive Growth',
    fonte: 'Fluxo · Progressão',
    fonteEn: 'Surge · Progression',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: '2acoes',
    descricao:
      'Gasta 1 de Investidura para fazer plantas crescerem explosivamente numa área. Faz um ataque de Progressão contra a defesa Física de cada personagem à sua escolha, causando 2d4 de dano impactante ou afiado.',
  },
  'progression::extended_regrowth': {
    nome: 'Regeneração Estendida',
    nomeEn: 'Extended Regrowth',
    fonte: 'Fluxo · Progressão',
    fonteEn: 'Surge · Progression',
    preRequisitos: 'Restauração Rápida',
    ativacao: 'sempre',
    descricao:
      'As infusões de Regeneração gastam apenas 1 de Investidura a cada quantidade de rodadas igual às suas graduações em Progressão.',
  },
  'progression::font_of_life': {
    nome: 'Fonte de Vida',
    nomeEn: 'Font of Life',
    fonte: 'Fluxo · Progressão',
    fonteEn: 'Surge · Progression',
    preRequisitos: 'Regeneração Estendida ou Progressão Confiável',
    ativacao: 'sempre',
    descricao: 'Usa Progressão e os talentos dela gastando 1 ação a menos.',
  },
  'progression::from_the_brink': {
    nome: 'De Volta do Abismo',
    nomeEn: 'From the Brink',
    fonte: 'Fluxo · Progressão',
    fonteEn: 'Surge · Progression',
    preRequisitos: 'Progressão 3+; Regeneração Estendida',
    ativacao: '3acoes',
    descricao:
      'Gasta 3 de Investidura para restaurar a vida de um personagem voluntário que morreu no último minuto.',
  },
  'progression::injury_regrowth': {
    nome: 'Regeneração de Lesão',
    nomeEn: 'Injury Regrowth',
    fonte: 'Fluxo · Progressão',
    fonteEn: 'Surge · Progression',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: '2acoes',
    descricao:
      'Gasta 2 pontos de Investidura para se recuperar de uma lesão temporária, ou 3 pontos para uma lesão permanente.',
  },
  'progression::overgrowth': {
    nome: 'Crescimento Excessivo',
    nomeEn: 'Overgrowth',
    fonte: 'Fluxo · Progressão',
    fonteEn: 'Surge · Progression',
    preRequisitos: 'Crescimento Explosivo',
    ativacao: '1acao',
    descricao:
      'Ao infundir Crescimento em uma planta, testa Progressão (CD 15) para fazê-la crescer muito mais e ficar mais forte do que os limites normais da espécie.',
  },
  'progression::reliable_progression': {
    nome: 'Progressão Confiável',
    nomeEn: 'Reliable Progression',
    fonte: 'Fluxo · Progressão',
    fonteEn: 'Surge · Progression',
    preRequisitos: 'Progressão 2+; Crescimento Excessivo',
    ativacao: 'especial',
    descricao:
      'Ao rolar um dado que aumenta com Progressão, se o resultado for menor que suas graduações em Progressão, ele passa a ser igual a essas graduações.',
  },
  'progression::swift_regeneration': {
    nome: 'Restauração Rápida',
    nomeEn: 'Swift Regeneration',
    fonte: 'Fluxo · Progressão',
    fonteEn: 'Surge · Progression',
    preRequisitos: 'Progressão 2+; Regeneração de Lesão',
    ativacao: 'especial',
    descricao:
      'Ao usar Restaurar, recupera vida igual a 1d6 + modificador de Progressão. Enquanto tiver 1 ponto ou mais de Investidura, você e qualquer aliado infundido com sua Regeneração somam o modificador de Progressão às rolagens de lesão.',
  },
}
