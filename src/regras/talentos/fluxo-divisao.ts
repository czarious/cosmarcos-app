/* arquivo: fluxo-divisao.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 6 · Fluxo Divisão (árvore do Pulverizador e do Rompe-céu) — transcricao/06-fluxos/05-divisao.md ──
export const TALENTOS_FLUXO_DIVISAO: Record<string, EntradaTalento> = {
  'division::bodily_decay': {
    nome: 'Decadência Corporal',
    nomeEn: 'Bodily Decay',
    fonte: 'Fluxo · Divisão',
    fonteEn: 'Surge · Division',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ao acertar um ataque de Divisão, pode gastar uma Oportunidade para fazer o alvo sofrer uma lesão.',
  },
  'division::eroding_escape': {
    nome: 'Escapar por Erodir',
    nomeEn: 'Eroding Escape',
    fonte: 'Fluxo · Divisão',
    fonteEn: 'Surge · Division',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: '1acao',
    descricao:
      'Gasta 1 ou mais de Investidura para encerrar essa mesma quantidade de efeitos ativos sobre si ou um aliado ao alcance. Os efeitos precisam causar Imobilizado ou Restringido, ou impor desvantagem em testes físicos. Se a fonte persistir até o fim do próximo turno do alvo, o efeito se recompõe.',
  },
  'division::igniting_division': {
    nome: 'Divisão Incendiadora',
    nomeEn: 'Igniting Division',
    fonte: 'Fluxo · Divisão',
    fonteEn: 'Surge · Division',
    preRequisitos: 'Talento Decadência Corporal',
    ativacao: 'especial',
    descricao:
      'Ao afetar um alvo com Divisão, pode gastar 1 ou mais de Investidura extra para incendiá-lo por essa quantidade de rodadas (exige teste de Divisão sob pressão, se ainda não feito). O alvo fica Afligido e a área a até 1,5 m vira terreno perigoso, ambos causando dano energético igual ao seu modificador de Divisão. O alvo pode fazer teste de Agilidade ou Atletismo oposto à sua Divisão para encerrar o Afligido mais cedo.',
  },
  'division::gout_of_flame': {
    nome: 'Labareda de Chamas',
    nomeEn: 'Gout of Flame',
    fonte: 'Fluxo · Divisão',
    fonteEn: 'Surge · Division',
    preRequisitos: 'Talento Divisão Incendiadora',
    ativacao: '2acoes',
    descricao:
      'Gasta 3 de Investidura e escolhe uma área um tamanho maior que o normal para suas graduações em Divisão. Ataque de Divisão contra a defesa Física de cada alvo na área, rolando 3d4 de dano energético (escalona com as graduações: 3d6, 3d8...).',
  },
  'division::spark_sending': {
    nome: 'Enviar Faísca',
    nomeEn: 'Spark Sending',
    fonte: 'Fluxo · Divisão',
    fonteEn: 'Surge · Division',
    preRequisitos: 'Talento Decadência Corporal ou talento Escapar por Erodir',
    ativacao: 'sempre',
    descricao:
      'Usa Divisão e seus talentos com alcance de 6 metros, desde que haja uma superfície sólida entre você e o alvo para conduzir a faísca.',
  },
  'division::inescapable_spark': {
    nome: 'Faísca Inescapável',
    nomeEn: 'Inescapable Spark',
    fonte: 'Fluxo · Divisão',
    fonteEn: 'Surge · Division',
    preRequisitos: 'Talento Enviar Faísca',
    ativacao: 'sempre',
    descricao:
      'O alcance de Divisão e seus talentos passa a ser a distância do vínculo com o espreno, ainda exigindo superfície sólida entre você e o alvo, mas sem linha de efeito enquanto o sentir. O alvo não pode usar a ação Proteger contra seus ataques de Divisão.',
  },
  'division::devastating_division': {
    nome: 'Divisão Devastadora',
    nomeEn: 'Devastating Division',
    fonte: 'Fluxo · Divisão',
    fonteEn: 'Surge · Division',
    preRequisitos: 'Talento Labareda de Chamas',
    ativacao: 'sempre',
    descricao:
      'Ao rolar dano de Divisão, rola um dado de dano adicional do mesmo tamanho.',
  },
  'division::unleashed_entropy': {
    nome: 'Entropia Desencadeada',
    nomeEn: 'Unleashed Entropy',
    fonte: 'Fluxo · Divisão',
    fonteEn: 'Surge · Division',
    preRequisitos: 'Talento Enviar Faísca ou talento Labareda de Chamas',
    ativacao: 'sempre',
    descricao:
      'Usar Divisão (não seus talentos) custa uma ▶ a menos. As CDs da tabela Divisão Sob Pressão caem 5.',
  },
}
