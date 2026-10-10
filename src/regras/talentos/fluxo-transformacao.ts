/* arquivo: fluxo-transformacao.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Trilha Radiante: Alternauta — Árvore Transformação — transcricao/05-trilhas-radiantes/04-alternauta.md ──
export const TALENTOS_FLUXO_TRANSFORMACAO: Record<string, EntradaTalento> = {
  'transformation::bloodcasting': {
    nome: 'Transmutar Sangue',
    nomeEn: 'Bloodcasting',
    fonte: 'Fluxo · Transformação',
    fonteEn: 'Surge · Transformation',
    preRequisitos: 'Transmutação Viva',
    ativacao: '2acoes',
    custo: { investidura: 1 },
    descricao:
      'Gasta 1 de Investidura e testa Transformação (CD 15) para remover todo veneno do alvo e reduzir em 5 dias o tempo de recuperação de uma lesão.',
  },
  'transformation::distant_surgebinding': {
    nome: 'Manipulação de Fluxos Distante',
    nomeEn: 'Distant Surgebinding',
    fonte: 'Fluxo · Transformação',
    fonteEn: 'Surge · Transformation',
    preRequisitos: 'Aparagem Transmutada',
    ativacao: 'sempre',
    descricao:
      'Você usa seus fluxos e os talentos deles como se seu alcance fosse de 6 metros.',
  },
  'transformation::expansive_transmuter': {
    nome: 'Transmutador Expansivo',
    nomeEn: 'Expansive Transmuter',
    fonte: 'Fluxo · Transformação',
    fonteEn: 'Surge · Transformation',
    preRequisitos: 'Transmutar Chamas',
    ativacao: 'sempre',
    descricao: 'Transmutar material não vivo custa 2 de Investidura a menos.',
  },
  'transformation::flamecasting': {
    nome: 'Transmutar Chamas',
    nomeEn: 'Flamecasting',
    fonte: 'Fluxo · Transformação',
    fonteEn: 'Surge · Transformation',
    preRequisitos: 'Aparagem Transmutada',
    ativacao: 'sempre',
    descricao:
      'Ganha "Chamas" como sexta categoria de material transmutável, depois de "Ar Puro" (CD 30 para transformar pedra em chamas). Ao Transmutar chamas, ataca cada personagem a até 1,5 metro com Transformação contra a defesa Física, causando 2d4 de dano energético.',
  },
  'transformation::living_soulcasting': {
    nome: 'Transmutação Viva',
    nomeEn: 'Living Soulcasting',
    fonte: 'Fluxo · Transformação',
    fonteEn: 'Surge · Transformation',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: '2acoes',
    custo: { investidura: 1 },
    descricao:
      'Gasta 1 de Investidura e faz um ataque corpo a corpo de Transformação contra a defesa Espiritual de um organismo vivo, causando 3d4 de dano espiritual. O alvo morre se chegar a 0 de vida.',
  },
  'transformation::persistent_transformation': {
    nome: 'Transformação Persistente',
    nomeEn: 'Persistent Transformation',
    fonte: 'Fluxo · Transformação',
    fonteEn: 'Surge · Transformation',
    preRequisitos: 'Transformação 2+; Manipulação de Fluxos Distante',
    ativacao: 'sempre',
    descricao:
      'Ao transformar objetos não vivos, a CD máxima cai para 15. Também pode tentar Transmutar de novo após uma falha; se tiver sucesso, gasta 1 de Investidura adicional por falha recente.',
  },
  'transformation::soulcast_defense': {
    nome: 'Defesa Transmutada',
    nomeEn: 'Soulcast Defense',
    fonte: 'Fluxo · Transformação',
    fonteEn: 'Surge · Transformation',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'reacao',
    custo: { investidura: 1 },
    descricao:
      'Antes de você ou um aliado ser atingido por um projétil, gasta 1 de Investidura e testa Transformação (CD igual ao ataque). Na falha, o projétil atinge de raspão; no sucesso, erra e vira uma Essência.',
  },
  'transformation::soulcast_parry': {
    nome: 'Aparagem Transmutada',
    nomeEn: 'Soulcast Parry',
    fonte: 'Fluxo · Transformação',
    fonteEn: 'Surge · Transformation',
    preRequisitos: 'Defesa Transmutada',
    ativacao: 'sempre',
    descricao:
      'Você pode usar Defesa Transmutada também contra ataques corpo a corpo feitos com armas.',
  },
}
