/* arquivo: fluxo-adesao.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Fluxo Adesão (árvore do Corredor dos Ventos) — transcricao/05-trilhas-radiantes/05-corredor-dos-ventos.md + transcricao/06-fluxos/03-adesao.md ──
export const TALENTOS_FLUXO_ADESAO: Record<string, EntradaTalento> = {
  'adhesion::binding_strike': {
    nome: 'Golpe Aderente',
    nomeEn: 'Binding Strike',
    fonte: 'Fluxo · Adesão',
    fonteEn: 'Surge · Adhesion',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Após acertar um ataque corpo a corpo, gasta uma Oportunidade ou 2 de foco para infundir Adesão sem gastar ações. Um dos alvos deve ser um objeto que o alvo do ataque segura ou veste; o teste para infundir é sucesso automático e não exige mão livre nem tocar o segundo alvo (a até 1,5 m do primeiro).',
  },
  'adhesion::binding_shot': {
    nome: 'Tiro Aderente',
    nomeEn: 'Binding Shot',
    fonte: 'Fluxo · Adesão',
    fonteEn: 'Surge · Adhesion',
    preRequisitos: 'Golpe Aderente',
    ativacao: 'especial',
    descricao:
      'Pode usar Golpe Aderente também ao acertar um ataque à distância, transferindo a infusão da munição para uma posse do alvo, sem tocar os alvos nem precisar de mão livre.',
  },
  'adhesion::adhesive_trap': {
    nome: 'Armadilha Adesiva',
    nomeEn: 'Adhesive Trap',
    fonte: 'Fluxo · Adesão',
    fonteEn: 'Surge · Adhesion',
    preRequisitos: 'Tiro Aderente',
    ativacao: 'especial',
    descricao:
      'Pode infundir Adesão numa superfície inteira, até o tamanho que suas graduações permitem. Quem toca a área (ao se mover nela, ser forçado a entrar ou tocar enquanto você infunde) sofre uma Projeção Plena com a superfície, com sucesso automático, pela duração da infusão.',
  },
  'adhesion::extended_adhesion': {
    nome: 'Adesão Estendida',
    nomeEn: 'Extended Adhesion',
    fonte: 'Fluxo · Adesão',
    fonteEn: 'Surge · Adhesion',
    preRequisitos: 'Manipulação de Fluxos Distante',
    ativacao: 'sempre',
    descricao:
      'Suas Projeções Plenas gastam 1 de Investidura a cada quantidade de rodadas igual às suas graduações em Adesão, em vez de 1 por rodada.',
  },
  'adhesion::living_adhesion': {
    nome: 'Adesão Viva',
    nomeEn: 'Living Adhesion',
    fonte: 'Fluxo · Adesão',
    fonteEn: 'Surge · Adhesion',
    preRequisitos: 'Adesão Estendida',
    ativacao: 'sempre',
    descricao:
      'Pode aplicar Adesão a seres vivos, como se mirasse um objeto na posse deles. Um personagem Projetado a algo maior que ele fica Restringido, sofre desvantagem em testes físicos, e ataques contra ele têm vantagem.',
  },
  'adhesion::superior_bond': {
    nome: 'Vínculo Superior',
    nomeEn: 'Superior Bond',
    fonte: 'Fluxo · Adesão',
    fonteEn: 'Surge · Adhesion',
    preRequisitos: 'Armadilha Adesiva ou Adesão Estendida',
    ativacao: 'sempre',
    descricao:
      'Se a Força de quem tenta quebrar uma de suas Projeções Plenas for igual ou inferior às suas graduações em Adesão, você vence o teste oposto automaticamente, sem rolagem.',
  },
  'adhesion::stormlight_reclamation': {
    nome: 'Recuperação de Luz das Tempestades',
    nomeEn: 'Stormlight Reclamation',
    fonte: 'Fluxo · Adesão',
    fonteEn: 'Surge · Adhesion',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'livre',
    descricao:
      'Depois que suas infusões gastarem Investidura no início do seu turno, pode encerrar qualquer quantidade delas ao seu alcance e recuperar a Investidura que ainda continham.',
  },
  'adhesion::distant_surgebinding': {
    nome: 'Manipulação de Fluxos Distante',
    nomeEn: 'Distant Surgebinding',
    fonte: 'Fluxo · Adesão',
    fonteEn: 'Surge · Adhesion',
    preRequisitos: 'Recuperação de Luz das Tempestades',
    ativacao: 'sempre',
    descricao:
      'Usa Adesão e seus talentos com alcance de 6 metros, sem tocar o alvo. Ao aderir dois objetos entre si, eles ainda precisam estar a até 1,5 m um do outro.',
  },
}
