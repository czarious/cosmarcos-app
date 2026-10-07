/* arquivo: fluxo-transporte.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Trilha Radiante: Alternauta — Árvore Transporte — transcricao/05-trilhas-radiantes/04-alternauta.md ──
export const TALENTOS_FLUXO_TRANSPORTE: Record<string, EntradaTalento> = {
  'transportation::cognitive_farsight': {
    nome: 'Visão Cognitiva Distante',
    nomeEn: 'Cognitive Farsight',
    fonte: 'Fluxo · Transporte',
    fonteEn: 'Surge · Transportation',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'sempre',
    descricao:
      'Observa coisas no Reino Cognitivo até 3 vezes a distância do seu vínculo com o espreno. Com Investidura, também identifica o norte e a direção do assentamento mais próximo.',
  },
  'transportation::cognitive_vision': {
    nome: 'Visão Cognitiva',
    nomeEn: 'Cognitive Vision',
    fonte: 'Fluxo · Transporte',
    fonteEn: 'Surge · Transportation',
    preRequisitos: 'Visão Cognitiva Distante',
    ativacao: 'sempre',
    descricao:
      'Ao usar Transporte para olhar o Reino Cognitivo, também pode descobrir a intenção de um inimigo (Transporte contra a defesa Cognitiva) ou ficar ciente do ambiente imediato.',
  },
  'transportation::elsecalling': {
    nome: 'Alternavegar',
    nomeEn: 'Elsecalling',
    fonte: 'Fluxo · Transporte',
    fonteEn: 'Surge · Transportation',
    preRequisitos: 'Dizer o Terceiro Ideal; Passo Entre Reinos',
    ativacao: '2acoes',
    descricao:
      'Gasta 1 de Investidura para se transportar do Reino Físico para o Cognitivo; ou testa Transporte (CD 20) e gasta 2 de Investidura para ir do Cognitivo para o Físico.',
  },
  'transportation::elsegate': {
    nome: 'Alterportal',
    nomeEn: 'Elsegate',
    fonte: 'Fluxo · Transporte',
    fonteEn: 'Surge · Transportation',
    preRequisitos: 'Dizer o Quarto Ideal; Transporte Compartilhado',
    ativacao: 'especial',
    descricao:
      'Transporta a si e até dez companheiros para um Sacroportal ou perpendicularidade permanente já visitados antes.',
  },
  'transportation::realmic_evasion': {
    nome: 'Evasão Entre Reinos',
    nomeEn: 'Realmic Evasion',
    fonte: 'Fluxo · Transporte',
    fonteEn: 'Surge · Transportation',
    preRequisitos: 'Dizer o Segundo Ideal',
    ativacao: 'reacao',
    descricao:
      'Antes de ser acertado por um ataque, gasta 1 de Investidura e testa Transporte (CD igual ao ataque). Na falha, o ataque atinge de raspão; no sucesso, erra.',
  },
  'transportation::realmic_step': {
    nome: 'Passo Entre Reinos',
    nomeEn: 'Realmic Step',
    fonte: 'Fluxo · Transporte',
    fonteEn: 'Surge · Transportation',
    preRequisitos: 'Evasão Entre Reinos',
    ativacao: '1acao',
    descricao:
      'Testa Transporte (CD 15) e gasta 2 de Investidura para se transportar a um espaço dentro da distância do seu vínculo com o espreno.',
  },
  'transportation::realmwalker': {
    nome: 'Caminhante dos Reinos',
    nomeEn: 'Realmwalker',
    fonte: 'Fluxo · Transporte',
    fonteEn: 'Surge · Transportation',
    preRequisitos: 'Alternavegar',
    ativacao: 'sempre',
    descricao: 'Você é bem-sucedido automaticamente ao testar Transporte para um talento.',
  },
  'transportation::shared_transportation': {
    nome: 'Transporte Compartilhado',
    nomeEn: 'Shared Transportation',
    fonte: 'Fluxo · Transporte',
    fonteEn: 'Surge · Transportation',
    preRequisitos: 'Transporte 4+; Alternavegar',
    ativacao: 'especial',
    descricao:
      'Ao se transportar, gasta 1 ou mais de Investidura para levar junto a mesma quantidade de personagens.',
  },
}
