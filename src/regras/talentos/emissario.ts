/* arquivo: emissario.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 4 · Trilha heroica: Emissário — transcricao/04-trilhas-heroicas/04-emissario.md ──
export const TALENTOS_EMISSARIO: Record<string, EntradaTalento> = {
  'envoy::key::rousing-presence': {
    nome: 'Presença Estimulante',
    nomeEn: 'Rousing Presence',
    fonte: 'Talento-chave · Emissário',
    fonteEn: 'Key talent · Envoy',
    preRequisitos: 'nenhum',
    ativacao: '1acao',
    descricao:
      'Escolhe um aliado que possa influenciar. Esse aliado fica Determinado até se beneficiar da condição ou até o fim da cena.',
  },
  'envoy::diplomat::calm-appeal': {
    nome: 'Apelo à Calma',
    nomeEn: 'Calm Appeal',
    fonte: 'Diplomata · Emissário',
    fonteEn: 'Diplomat · Envoy',
    preRequisitos: 'Disciplina 2+; talento Retorta Fulminante',
    ativacao: 'sempre',
    descricao:
      'Quando o Desafio Constante deixa um personagem Desorientado, pode gastar 1 de foco para também pacificá-lo até o fim da cena. Alvo pacificado não ataca nem age com hostilidade sem provocação; deixa de estar pacificado se o Emissário ou um aliado o atacar (ou agir com hostilidade equivalente) ou se um aliado do alvo sofrer lesão ou morrer. Além disso, depois que um alvo resistir ao Desafio Constante, ele perde foco extra igual às suas graduações em Disciplina.',
  },
  'envoy::diplomat::collected': {
    nome: 'Senhor de Si',
    nomeEn: 'Collected',
    fonte: 'Diplomata · Emissário',
    fonteEn: 'Diplomat · Envoy',
    preRequisitos: 'talento-chave Presença Estimulante',
    ativacao: 'sempre',
    descricao: 'Ao adquirir, as defesas Cognitiva e Espiritual aumentam em 2 pontos cada.',
  },
  'envoy::diplomat::high-society-contacts': {
    nome: 'Contatos na Alta Sociedade',
    nomeEn: 'High Society Contacts',
    fonte: 'Diplomata · Emissário',
    fonteEn: 'Diplomat · Envoy',
    preRequisitos: 'ter um patrono da alta sociedade; talento Bem Vestido',
    ativacao: 'especial',
    descricao:
      'Ao fazer um teste para interagir socialmente na alta sociedade, pode gastar 2 de foco para adicionar uma Oportunidade ao resultado. Ao adquirir, ganha a especialidade cultural Alta Sociedade.',
  },
  'envoy::diplomat::peaceful-solution': {
    nome: 'Solução Pacífica',
    nomeEn: 'Peaceful Solution',
    fonte: 'Diplomata · Emissário',
    fonteEn: 'Diplomat · Envoy',
    preRequisitos: 'Disciplina 3+; talento Apelo à Calma',
    ativacao: 'livre',
    descricao:
      'Em combate, se todos os inimigos que não sejam lacaios estiverem pacificados (por exemplo, por Apelo à Calma) e todos os demais não lacaios concordarem em cessar as hostilidades, o combate termina na hora e vira diálogo. A critério do MJ, também vale fora de combate.',
  },
  'envoy::diplomat::practiced-oratory': {
    nome: 'Oratória Praticada',
    nomeEn: 'Practiced Oratory',
    fonte: 'Diplomata · Emissário',
    fonteEn: 'Diplomat · Envoy',
    preRequisitos: 'Persuasão 3+; talento Contatos na Alta Sociedade',
    ativacao: 'especial',
    descricao:
      'Ao usar Presença Estimulante ou Desafio Constante, pode gastar foco até o valor de suas graduações em Persuasão para afetar a mesma quantidade de alvos adicionais (1 alvo por ponto gasto).',
  },
  'envoy::diplomat::steadfast-challenge': {
    nome: 'Desafio Constante',
    nomeEn: 'Steadfast Challenge',
    fonte: 'Diplomata · Emissário',
    fonteEn: 'Diplomat · Envoy',
    preRequisitos: 'Disciplina 1+; talento-chave Presença Estimulante',
    ativacao: '1acao',
    custo: { foco: 1 },
    descricao:
      'Gasta 1 de foco e faz um teste de Dedução contra a defesa Espiritual de um personagem que possa influenciar. Em sucesso, o alvo fica Desorientado e sofre desvantagem em todos os testes contra o Emissário até o fim do próximo turno do alvo.',
  },
  'envoy::diplomat::well-dressed': {
    nome: 'Bem Vestido',
    nomeEn: 'Well Dressed',
    fonte: 'Diplomata · Emissário',
    fonteEn: 'Diplomat · Envoy',
    preRequisitos: 'talento Desafio Constante',
    ativacao: 'especial',
    descricao:
      'Enquanto estiver visivelmente com roupas elegantes ou armadura Apresentável, ganha vantagem no primeiro teste de Dissimulação, Liderança ou Persuasão de cada cena. Ao adquirir, ganha a especialidade cultural Moda.',
  },
  'envoy::diplomat::withering-retort': {
    nome: 'Retorta Fulminante',
    nomeEn: 'Withering Retort',
    fonte: 'Diplomata · Emissário',
    fonteEn: 'Diplomat · Envoy',
    preRequisitos: 'Disciplina 2+; talento Desafio Constante',
    ativacao: 'reacao',
    descricao:
      'Antes de um personagem que ele possa sentir mirá-lo com um teste de ataque, pode usar Desafio Constante como reação. Ao fazer isso, também aumenta sua deflexão contra aquele ataque em um valor igual às suas graduações em Disciplina.',
  },
  'envoy::faithful::applied-motivation': {
    nome: 'Motivação Aplicada',
    nomeEn: 'Applied Motivation',
    fonte: 'Fiel · Emissário',
    fonteEn: 'Faithful · Envoy',
    preRequisitos: 'Disciplina 2+; talento Galvanizar',
    ativacao: 'sempre',
    descricao:
      'Quando faz um personagem recuperar foco, ele recupera foco adicional igual à metade das graduações do Emissário em Saber (arredondado para cima).',
  },
  'envoy::faithful::composed': {
    nome: 'Compostura',
    nomeEn: 'Composed',
    fonte: 'Fiel · Emissário',
    fonteEn: 'Faithful · Envoy',
    preRequisitos: 'talento Galvanizar',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, o foco máximo e atual aumentam em um valor igual ao patamar. Quando o patamar sobe em 1, o foco máximo sobe junto.',
  },
  'envoy::faithful::customary-garb': {
    nome: 'Traje Habitual',
    nomeEn: 'Customary Garb',
    fonte: 'Fiel · Emissário',
    fonteEn: 'Faithful · Envoy',
    preRequisitos: 'talento-chave Presença Estimulante',
    ativacao: 'sempre',
    descricao:
      'Enquanto estiver visivelmente com roupas ou armadura Apresentável adequadas à situação, as defesas Física e Espiritual aumentam em 2 pontos cada.',
  },
  'envoy::faithful::devoted-presence': {
    nome: 'Presença Devota',
    nomeEn: 'Devoted Presence',
    fonte: 'Fiel · Emissário',
    fonteEn: 'Faithful · Envoy',
    preRequisitos: 'Saber 1+; talento Traje Habitual',
    ativacao: 'especial',
    descricao:
      'Ao usar Presença Estimulante em um ou mais aliados, pode gastar 1 de foco por alvo para remover qualquer quantidade das condições Atordoado, Lento, Prostrado e Surpreendido que afetem cada um.',
  },
  'envoy::faithful::galvanize': {
    nome: 'Galvanizar',
    nomeEn: 'Galvanize',
    fonte: 'Fiel · Emissário',
    fonteEn: 'Faithful · Envoy',
    preRequisitos: 'talento-chave Presença Estimulante',
    ativacao: '2acoes',
    descricao:
      'Uma vez por cena, escolhe um aliado que possa influenciar. Esse aliado rola seu dado de recuperação (sem gastar ações) e recupera foco igual ao resultado.',
  },
  'envoy::faithful::inspired-zeal': {
    nome: 'Zelo Inspirado',
    nomeEn: 'Inspired Zeal',
    fonte: 'Fiel · Emissário',
    fonteEn: 'Faithful · Envoy',
    preRequisitos: 'Disciplina 3+; talento Motivação Aplicada ou Presença Resoluta',
    ativacao: 'especial',
    descricao:
      'Depois que um aliado que ele possa sentir usar a condição Determinado para acrescentar uma Oportunidade a um teste, escolhe até tantos outros aliados influenciáveis quanto suas graduações em Disciplina. Cada alvo recupera 1 de foco (sem gastar ações).',
  },
  'envoy::faithful::sage-counsel': {
    nome: 'Conselho Sábio',
    nomeEn: 'Sage Counsel',
    fonte: 'Fiel · Emissário',
    fonteEn: 'Faithful · Envoy',
    preRequisitos: 'Saber 3+; talento Presença Resoluta',
    ativacao: 'especial',
    descricao:
      'Depois de usar a reação Auxiliar em um aliado, gasta 1 de foco para conceder a ele os benefícios de Presença Estimulante, sem gastar ações.',
  },
  'envoy::faithful::stalwart-presence': {
    nome: 'Presença Resoluta',
    nomeEn: 'Stalwart Presence',
    fonte: 'Fiel · Emissário',
    fonteEn: 'Faithful · Envoy',
    preRequisitos: 'Disciplina 2+; talento Presença Devota',
    ativacao: 'especial',
    descricao:
      'Ao usar Presença Estimulante, pode gastar 1 de foco para aumentar em 2 uma defesa do alvo, à sua escolha, até o fim da próxima rodada.',
  },
  'envoy::mentor::foresight': {
    nome: 'Previsão',
    nomeEn: 'Foresight',
    fonte: 'Mentor · Emissário',
    fonteEn: 'Mentor · Envoy',
    preRequisitos: 'Disciplina 3+; talento Instilar Confiança',
    ativacao: 'sempre',
    descricao:
      'No início de cada combate e no início de cada um de seus turnos, ganha uma reação adicional.',
  },
  'envoy::mentor::guiding-oration': {
    nome: 'Oração Orientadora',
    nomeEn: 'Guiding Oration',
    fonte: 'Mentor · Emissário',
    fonteEn: 'Mentor · Envoy',
    preRequisitos: 'Liderança 2+; talento Poderoso',
    ativacao: 'sempre',
    descricao:
      'Depois de obter sucesso em um teste de Ganhar Vantagem, escolhe um aliado influenciável a até 3 metros do seu alvo. Até o fim do próximo turno desse aliado, ele tem vantagem no próximo teste contra o alvo do personagem.',
  },
  'envoy::mentor::instill-confidence': {
    nome: 'Instilar Confiança',
    nomeEn: 'Instill Confidence',
    fonte: 'Mentor · Emissário',
    fonteEn: 'Mentor · Envoy',
    preRequisitos: 'ter um companheiro; talento Lições de Paciência',
    ativacao: 'especial',
    descricao:
      'Ao usar Presença Estimulante, pode deixar o alvo Focado até o fim da cena em vez de Determinado.',
  },
  'envoy::mentor::lessons-in-patience': {
    nome: 'Lições de Paciência',
    nomeEn: 'Lessons in Patience',
    fonte: 'Mentor · Emissário',
    fonteEn: 'Mentor · Envoy',
    preRequisitos: 'Disciplina 2+; talento Conselho Sensato',
    ativacao: 'sempre',
    descricao:
      'Depois de usar Presença Estimulante, o alvo recupera 1 de foco. Ao adquirir, ganha a especialidade de utilidade Discurso Motivacional.',
  },
  'envoy::mentor::mighty': {
    nome: 'Poderoso',
    nomeEn: 'Mighty',
    fonte: 'Mentor · Emissário',
    fonteEn: 'Mentor · Envoy',
    preRequisitos: 'talento Demonstração Prática',
    ativacao: 'sempre',
    descricao:
      'Ao acertar um ataque com arma ou desarmado, cada ▶ gasta naquela ação de ataque aumenta o dano em 1 + patamar (dano extra = (1 + patamar) × número de ▶). Ex.: patamar 2, ataque de 2 ações: 3 por ▶, 6 no total.',
  },
  'envoy::mentor::practical-demonstration': {
    nome: 'Demonstração Prática',
    nomeEn: 'Practical Demonstration',
    fonte: 'Mentor · Emissário',
    fonteEn: 'Mentor · Envoy',
    preRequisitos: 'Liderança 1+; talento-chave Presença Estimulante',
    ativacao: 'livre',
    descricao:
      'Depois de obter sucesso em um teste de Ganhar Vantagem, usa Presença Estimulante como ação livre.',
  },
  'envoy::mentor::rallying-shout': {
    nome: 'Brado de Restabelecimento',
    nomeEn: 'Rallying Shout',
    fonte: 'Mentor · Emissário',
    fonteEn: 'Mentor · Envoy',
    preRequisitos: 'Liderança 3+; talento Oração Orientadora',
    ativacao: 'sempre',
    descricao:
      'Ao usar Presença Estimulante, pode mirar um aliado Inconsciente que possa sentir. O alvo deixa de estar Inconsciente e, se estiver com 0 de vida, rola seu dado de recuperação e recupera vida igual ao resultado somado às graduações do personagem em Liderança.',
  },
  'envoy::mentor::sound-advice': {
    nome: 'Conselho Sensato',
    nomeEn: 'Sound Advice',
    fonte: 'Mentor · Emissário',
    fonteEn: 'Mentor · Envoy',
    preRequisitos: 'talento-chave Presença Estimulante',
    ativacao: 'reacao',
    custo: { foco: 1 },
    descricao:
      'Depois que um aliado influenciável falhar em um teste de perícia, pode gastar 1 de foco para usar Presença Estimulante nele como reação.',
  },
}
