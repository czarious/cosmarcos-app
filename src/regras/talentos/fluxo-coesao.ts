/* arquivo: fluxo-coesao.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Trilha Radiante: Guardião das Pedras — Fluxo Coesão — transcricao/05-trilhas-radiantes/07-guardiao-das-pedras.md ──
export const TALENTOS_FLUXO_COESAO: Record<string, EntradaTalento> = {
  'cohesion::stone_spear': {
    nome: 'Lança de Pedra',
    nomeEn: 'Stone Spear',
    fonte: 'Fluxo · Coesão',
    fonteEn: 'Surge · Cohesion',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: '2acoes',
    descricao:
      'Gasta 1 de Investidura para fazer um ataque à distância de Coesão contra a defesa Física de um alvo a até 18 metros, causando 2d4 de dano impactante.',
  },
  'cohesion::sinkhole': {
    nome: 'Sumidouro',
    nomeEn: 'Sinkhole',
    fonte: 'Fluxo · Coesão',
    fonteEn: 'Surge · Cohesion',
    preRequisitos: 'Lança de Pedra',
    ativacao: '1acao',
    descricao:
      'Gasta 1 de Investidura e testa Coesão contra a defesa Cognitiva de alvos escolhidos sobre chão de pedra. Em sucesso, o alvo afunda no chão e fica Imobilizado.',
  },
  'cohesion::tunneling': {
    nome: 'Escavar Túnel',
    nomeEn: 'Tunneling',
    fonte: 'Fluxo · Coesão',
    fonteEn: 'Surge · Cohesion',
    preRequisitos: 'Sumidouro',
    ativacao: '1acao',
    descricao:
      'Gasta 1 de Investidura para se mover através de pedra como se fosse terreno difícil, deixando atrás de si um túnel de 1,5 metro.',
  },
  'cohesion::true_stoneshaping': {
    nome: 'Litoplasmação Verdadeira',
    nomeEn: 'True Stoneshaping',
    fonte: 'Fluxo · Coesão',
    fonteEn: 'Surge · Cohesion',
    preRequisitos: 'Coesão 2+; Escavar Túnel',
    ativacao: 'sempre',
    descricao:
      'Molda pedra de forma intrincada e extensa, sem gastar ações nem tempo adicional.',
  },
  'cohesion::flowing_earth': {
    nome: 'Terra Fluente',
    nomeEn: 'Flowing Earth',
    fonte: 'Fluxo · Coesão',
    fonteEn: 'Surge · Cohesion',
    preRequisitos: 'Litoplasmação Verdadeira',
    ativacao: 'especial',
    descricao:
      'Depois de usar Coesão, molda a pedra sob seus pés e se impulsiona em qualquer direção por até 1,5 metro × suas graduações em Coesão.',
  },
  'cohesion::memories_of_stone': {
    nome: 'Memórias da Pedra',
    nomeEn: 'Memories of Stone',
    fonte: 'Fluxo · Coesão',
    fonteEn: 'Surge · Cohesion',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: '2acoes',
    descricao:
      'Gasta 1 de Investidura para se comunicar com uma pedra que esteja tocando. Se a resposta exigir interpretação, testa Coesão (CD definida pelo Mestre).',
  },
  'cohesion::through_the_stone': {
    nome: 'Pela Pedra',
    nomeEn: 'Through the Stone',
    fonte: 'Fluxo · Coesão',
    fonteEn: 'Surge · Cohesion',
    preRequisitos: 'Sumidouro',
    ativacao: 'sempre',
    descricao:
      'Seus fluxos e os talentos deles passam a funcionar como se o alcance fosse de 6 metros.',
  },
  'cohesion::unbound_cohesion': {
    nome: 'Coesão Desvinculada',
    nomeEn: 'Unbound Cohesion',
    fonte: 'Fluxo · Coesão',
    fonteEn: 'Surge · Cohesion',
    preRequisitos: 'Coesão 4+; Pela Pedra',
    ativacao: 'sempre',
    descricao:
      'Permite usar Coesão em qualquer material sólido que não esteja vivo, Investido nem infundido com Luz das Tempestades.',
  },
}
