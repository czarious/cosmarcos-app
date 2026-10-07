/* arquivo: fluxo-abrasao.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Fluxo Abrasão (árvore do Dançarino de Precipícios) — transcricao/05-trilhas-radiantes/06-dancarino-de-precipicios.md ──
export const TALENTOS_FLUXO_ABRASAO: Record<string, EntradaTalento> = {
  'abrasion::frictionless_motion': {
    nome: 'Movimento Sem Fricção',
    nomeEn: 'Frictionless Motion',
    fonte: 'Fluxo · Abrasão',
    fonteEn: 'Surge · Abrasion',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'sempre',
    descricao:
      'Enquanto estiver infundido com Abrasão, seu movimento aumenta em 10 (a transcrição não especifica a unidade; pela convenção do livro, metros) e ignora Lento.',
  },
  'abrasion::reverse_abrasion': {
    nome: 'Abrasão Reversa',
    nomeEn: 'Reverse Abrasion',
    fonte: 'Fluxo · Abrasão',
    fonteEn: 'Surge · Abrasion',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Pode aumentar a fricção de um objeto ou área, cancelando terreno difícil e dando vantagem a quem interagir com ele.',
  },
  'abrasion::graceful_skating': {
    nome: 'Patinação Graciosa',
    nomeEn: 'Graceful Skating',
    fonte: 'Fluxo · Abrasão',
    fonteEn: 'Surge · Abrasion',
    preRequisitos: 'Movimento Sem Fricção',
    ativacao: 'sempre',
    descricao:
      'Ao usar o Movimento Patinar como ação livre, não precisa se mover em linha reta.',
  },
  'abrasion::slippery_target': {
    nome: 'Alvo Escorregadio',
    nomeEn: 'Slippery Target',
    fonte: 'Fluxo · Abrasão',
    fonteEn: 'Surge · Abrasion',
    preRequisitos: 'Patinação Graciosa',
    ativacao: 'especial',
    descricao:
      'Enquanto estiver infundido com Abrasão, ataques contra você não podem atingi-lo de raspão, e Golpes Reativos feitos contra você têm desvantagem.',
  },
  'abrasion::slick_combatant': {
    nome: 'Combatente Movediço',
    nomeEn: 'Slick Combatant',
    fonte: 'Fluxo · Abrasão',
    fonteEn: 'Surge · Abrasion',
    preRequisitos: 'Alvo Escorregadio',
    ativacao: 'especial',
    descricao:
      'Enquanto estiver infundido com Abrasão, pode interromper um Movimento com outras ações e causa dano extra em ataques feitos no meio do movimento.',
  },
  'abrasion::smooth_operator': {
    nome: 'Operador Polido',
    nomeEn: 'Smooth Operator',
    fonte: 'Fluxo · Abrasão',
    fonteEn: 'Surge · Abrasion',
    preRequisitos: 'Manipulação de Fluxos Distante; Alvo Escorregadio',
    ativacao: 'sempre',
    descricao:
      'Enquanto tiver Investidura, está infundido com Abrasão e gasta 1 ponto a menos para Patinar.',
  },
  'abrasion::stormlight_reclamation': {
    nome: 'Recuperação de Luz das Tempestades',
    nomeEn: 'Stormlight Reclamation',
    fonte: 'Fluxo · Abrasão',
    fonteEn: 'Surge · Abrasion',
    preRequisitos: 'Abrasão Reversa',
    ativacao: 'livre',
    descricao:
      'No início do turno, pode encerrar qualquer quantidade de infusões para recuperar a Investidura que restava nelas.',
  },
  'abrasion::distant_surgebinding': {
    nome: 'Manipulação de Fluxos Distante',
    nomeEn: 'Distant Surgebinding',
    fonte: 'Fluxo · Abrasão',
    fonteEn: 'Surge · Abrasion',
    preRequisitos: 'Abrasão Reversa',
    ativacao: 'sempre',
    descricao:
      'Usa seus fluxos e os talentos deles como se seu alcance fosse de 6 metros.',
  },
}
