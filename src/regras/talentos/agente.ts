/* arquivo: agente.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 4 · Trilha heroica: Agente — transcricao/04-trilhas-heroicas/02-agente.md ──
export const TALENTOS_AGENTE: Record<string, EntradaTalento> = {
  'agent::key::opportunist': {
    nome: 'Oportunista',
    nomeEn: 'Opportunist',
    fonte: 'Talento-chave · Agente',
    fonteEn: 'Key talent · Agent',
    preRequisitos: 'nenhum',
    ativacao: 'especial',
    descricao:
      'Uma vez por rodada, ao rolar um dado de trama, pode rerrolá-lo. O resultado original é descartado e o novo vale.',
  },
  'agent::investigator::baleful': {
    nome: 'Pernicioso',
    nomeEn: 'Baleful',
    fonte: 'Investigador · Agente',
    fonteEn: 'Investigator · Agent',
    preRequisitos: 'talento Faça-os Falar',
    ativacao: 'sempre',
    descricao:
      'Para resistir à influência do personagem, o alvo precisa gastar foco adicional igual ao patamar do Agente.',
  },
  'agent::investigator::close-the-case': {
    nome: 'Encerrar o Caso',
    nomeEn: 'Close the Case',
    fonte: 'Investigador · Agente',
    fonteEn: 'Investigator · Agent',
    preRequisitos: 'Dedução 3+; talento Resistente',
    ativacao: '3acoes',
    custo: { foco: 3 },
    descricao:
      'Uma vez por cena, gasta 3 de foco e testa Dedução contra a defesa Cognitiva de um personagem que possa influenciar (vantagem se souber a motivação atual do alvo, desvantagem se não souber). Falha: o alvo tem vantagem em todos os testes contra o personagem até o fim do próximo turno dele. Sucesso: o alvo é influenciado a recuar e deixa de se opor aos objetivos imediatos do personagem na cena (pode até sair dela). Se resistir, sofre desvantagem em todos os testes até o fim do próximo turno dele.',
  },
  'agent::investigator::gather-evidence': {
    nome: 'Coletar Evidência',
    nomeEn: 'Gather Evidence',
    fonte: 'Investigador · Agente',
    fonteEn: 'Investigator · Agent',
    preRequisitos: 'Intuição 2+; talento Análise Rápida',
    ativacao: 'sempre',
    descricao:
      'Após ter sucesso em um teste cognitivo contra outro personagem, fica Focado até o fim do seu próximo turno. Ao adquirir, ganha uma especialidade de utilidade em Códigos Legais.',
  },
  'agent::investigator::get-em-talking': {
    nome: 'Faça-os Falar',
    nomeEn: 'Get ’Em Talking',
    fonte: 'Investigador · Agente',
    fonteEn: 'Investigator · Agent',
    preRequisitos: 'Intuição 2+; talento-chave Oportunista',
    ativacao: '2acoes',
    custo: { foco: 1 },
    descricao:
      'Gasta 1 de foco e testa Dedução contra a defesa Espiritual de um personagem que possa influenciar. Em sucesso, descobre a motivação do alvo para estar na cena. Até o fim da cena, ao fazer um teste que explore essa motivação contra o alvo, pode aumentar as apostas.',
  },
  'agent::investigator::hardy': {
    nome: 'Resistente',
    nomeEn: 'Hardy',
    fonte: 'Investigador · Agente',
    fonteEn: 'Investigator · Agent',
    preRequisitos: 'talento Pernicioso',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, a Vida máxima e atual aumenta em 1 por nível, retroativo a todos os níveis anteriores e futuros (ex.: escolhido no nível 6, +6 de Vida).',
  },
  'agent::investigator::quick-analysis': {
    nome: 'Análise Rápida',
    nomeEn: 'Quick Analysis',
    fonte: 'Investigador · Agente',
    fonteEn: 'Investigator · Agent',
    preRequisitos: 'talento Olhar Vigilante',
    ativacao: 'livre',
    custo: { foco: 2 },
    descricao:
      'Gasta 2 de foco para ganhar ▶▶, usáveis apenas em testes de perícia cognitivos via Usar uma Perícia, Ganhar Vantagem ou ação de qualquer talento de Agente. Em diálogo ou empreitada, a critério do MJ, pode usar as duas ▶▶ juntas numa contribuição adicional na rodada.',
  },
  'agent::investigator::sleuth-s-instincts': {
    nome: 'Instintos de Detetive',
    nomeEn: 'Sleuth’s Instincts',
    fonte: 'Investigador · Agente',
    fonteEn: 'Investigator · Agent',
    preRequisitos: 'Dedução 3+; talento Resistente',
    ativacao: 'sempre',
    descricao:
      'Tem vantagem em testes cognitivos contra um personagem cuja motivação conheça (descoberta por Faça-os Falar ou outros meios, como pesquisa). Além disso, se esse personagem mentir para ele, percebe automaticamente que não é verdade, sem saber qual é a mentira.',
  },
  'agent::investigator::watchful-eye': {
    nome: 'Olhar Vigilante',
    nomeEn: 'Watchful Eye',
    fonte: 'Investigador · Agente',
    fonteEn: 'Investigator · Agent',
    preRequisitos: 'Dedução 1+; talento-chave Oportunista',
    ativacao: 'reacao',
    descricao:
      'Quando um aliado voluntário que possa influenciar, a até 6 metros, rola o dado de trama, pode usar esta reação para aplicar Oportunista nesse dado como se fosse dele.',
  },
  'agent::spy::collected': {
    nome: 'Senhor de Si',
    nomeEn: 'Collected',
    fonte: 'Espião · Agente',
    fonteEn: 'Spy · Agent',
    preRequisitos: 'talento Resultado Certo',
    ativacao: 'sempre',
    descricao: 'Ao adquirir, as defesas Cognitiva e Espiritual aumentam em 2 cada.',
  },
  'agent::spy::cover-story': {
    nome: 'História Encoberta',
    nomeEn: 'Cover Story',
    fonte: 'Espião · Agente',
    fonteEn: 'Spy · Agent',
    preRequisitos: 'talento Desculpa Plausível',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, define com o MJ os detalhes de uma identidade falsa: em quais comunidades é usada e qual reputação tem nelas. Ganha também uma especialidade cultural relevante à cultura dessa identidade.',
  },
  'agent::spy::high-society-contacts': {
    nome: 'Contatos na Alta Sociedade',
    nomeEn: 'High Society Contacts',
    fonte: 'Espião · Agente',
    fonteEn: 'Spy · Agent',
    preRequisitos: 'ter um patrono da alta sociedade; talento História Encoberta',
    ativacao: 'especial',
    descricao:
      'Ao testar para interagir socialmente na alta sociedade, pode gastar 2 de foco para adicionar uma Oportunidade ao resultado. Ao adquirir, ganha uma especialidade cultural em Alta Sociedade.',
  },
  'agent::spy::mercurial-facade': {
    nome: 'Fachada Volátil',
    nomeEn: 'Mercurial Facade',
    fonte: 'Espião · Agente',
    fonteEn: 'Spy · Agent',
    preRequisitos: 'Dissimulação 3+; talento Derrubada Sutil',
    ativacao: 'especial',
    descricao:
      'Ao tentar se disfarçar, pode usar Dissimulação no lugar de Ladinagem, mesmo sem materiais de disfarce físico. O primeiro personagem que perceber o disfarce, ou aquele que o Agente escolher surpreender ao se revelar, fica Surpreendido até o fim do próximo turno dele.',
  },
  'agent::spy::mighty': {
    nome: 'Poderoso',
    nomeEn: 'Mighty',
    fonte: 'Espião · Agente',
    fonteEn: 'Spy · Agent',
    preRequisitos: 'talento História Encoberta',
    ativacao: 'sempre',
    descricao:
      'Ao acertar com arma ou ataque desarmado, para cada ▶ gasto nessa ação de ataque, o dano aumenta em 1 + o patamar do personagem (ex.: no nível 6, ataque de ▶▶ causa 1 + 2 por ▶, total de 6 extra).',
  },
  'agent::spy::plausible-excuse': {
    nome: 'Desculpa Plausível',
    nomeEn: 'Plausible Excuse',
    fonte: 'Espião · Agente',
    fonteEn: 'Spy · Agent',
    preRequisitos: 'Dissimulação 1+; talento-chave Oportunista',
    ativacao: 'reacao',
    custo: { foco: 2 },
    descricao:
      'Depois de ser flagrado se escondendo ou se esgueirando, gasta 2 de foco para se passar por alguém fazendo algo inofensivo, influenciando todo personagem que o sinta a acreditar. Quem resistir perde foco adicional igual às graduações do Agente em Dissimulação. Ao adquirir, ganha uma especialidade de utilidade em Prestidigitação.',
  },
  'agent::spy::subtle-takedown': {
    nome: 'Derrubada Sutil',
    nomeEn: 'Subtle Takedown',
    fonte: 'Espião · Agente',
    fonteEn: 'Spy · Agent',
    preRequisitos: 'Intuição 3+; talento História Encoberta',
    ativacao: '2acoes',
    descricao:
      'Ataque desarmado com Intuição contra a defesa Cognitiva de um alvo Surpreendido, que não o sinta ou não o veja como ameaça (ex.: disfarçado); o alvo deve ter o tamanho do personagem ou menor. Aumenta as apostas. Em acerto, além dos efeitos normais, o alvo não se comunica até o fim do próximo turno dele. Pode gastar uma Oportunidade para Agarrar o alvo como ▷, com sucesso automático; enquanto Restringido por esse agarrão, o alvo também fica Prostrado.',
  },
  'agent::spy::sure-outcome': {
    nome: 'Resultado Certo',
    nomeEn: 'Sure Outcome',
    fonte: 'Espião · Agente',
    fonteEn: 'Spy · Agent',
    preRequisitos: 'Intuição 2+; talento-chave Oportunista',
    ativacao: 'especial',
    descricao:
      'Ao usar Oportunista, em vez de rerrolar o dado de trama, pode gastar 2 de foco para mudar o resultado: Oportunidade vira Complicação 4; qualquer Complicação vira Oportunidade.',
  },
  'agent::thief::cheap-shot': {
    nome: 'Golpe Baixo',
    nomeEn: 'Cheap Shot',
    fonte: 'Ladrão · Agente',
    fonteEn: 'Thief · Agent',
    preRequisitos: 'talento-chave Oportunista',
    ativacao: '1acao',
    custo: { foco: 1 },
    descricao:
      'Com uma mão livre, gasta 1 de foco para atacar desarmado com Ladinagem contra a defesa Cognitiva de um inimigo do seu tamanho ou menor, aumentando as apostas. Em acerto, além dos efeitos normais, o alvo fica Atordoado até o fim do próximo turno dele. Em acerto ou raspão, pode gastar uma Oportunidade para furtar um item que o alvo carregue sem segurar nem empunhar (o item é decidido pelo MJ).',
  },
  'agent::thief::double-down': {
    nome: 'Redobrar Esforços',
    nomeEn: 'Double Down',
    fonte: 'Ladrão · Agente',
    fonteEn: 'Thief · Agent',
    preRequisitos: 'talento Comportamento Arriscado',
    ativacao: 'especial',
    descricao:
      'Depois de usar Oportunista, pode rerrolar o dado mais uma vez. O resultado final vale e, se incluir uma Complicação, o personagem perde 2 de foco.',
  },
  'agent::thief::fast-talker': {
    nome: 'Fala Rápida',
    nomeEn: 'Fast Talker',
    fonte: 'Ladrão · Agente',
    fonteEn: 'Thief · Agent',
    preRequisitos: 'Intuição 3+; talento Redobrar Esforços',
    ativacao: 'livre',
    custo: { foco: 2 },
    descricao:
      'Gasta 2 de foco para ganhar ▶▶, usáveis apenas em testes de perícia espirituais via Usar uma Perícia, Ganhar Vantagem ou ação de qualquer talento de Agente. Em diálogo ou empreitada, a critério do MJ, pode usar as duas ▶▶ juntas numa contribuição adicional na rodada.',
  },
  'agent::thief::risky-behavior': {
    nome: 'Comportamento Arriscado',
    nomeEn: 'Risky Behavior',
    fonte: 'Ladrão · Agente',
    fonteEn: 'Thief · Agent',
    preRequisitos: 'Intuição 2+; talento-chave Oportunista',
    ativacao: 'especial',
    descricao: 'Antes de fazer um teste, pode gastar 1 de foco para aumentar as apostas.',
  },
  'agent::thief::shadow-step': {
    nome: 'Passo nas Sombras',
    nomeEn: 'Shadow Step',
    fonte: 'Ladrão · Agente',
    fonteEn: 'Thief · Agent',
    preRequisitos: 'Ladinagem 3+; talento Pés Firmes',
    ativacao: 'especial',
    descricao:
      'Depois de Desengajar, gasta 2 de foco e testa Ladinagem contra a defesa Cognitiva de cada inimigo que possa senti-lo (vantagem se estiver em cobertura ou onde o sentido primário do alvo esteja obscurecido, como na escuridão). Contra cada inimigo em que tiver sucesso, fica escondido como se tivesse passado em um teste de Furtividade para se esconder dele.',
  },
  'agent::thief::surefooted': {
    nome: 'Pés Firmes',
    nomeEn: 'Surefooted',
    fonte: 'Ladrão · Agente',
    fonteEn: 'Thief · Agent',
    preRequisitos: 'talento Golpe Baixo',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, a taxa de movimento aumenta em 3 metros. Além disso, antes de sofrer dano por terreno perigoso ou queda, reduz esse dano em 2 vezes o patamar (ex.: 4 pontos no segundo patamar).',
  },
  'agent::thief::trickster-s-hand': {
    nome: 'Amparo do Trapaceiro',
    nomeEn: 'Trickster’s Hand',
    fonte: 'Ladrão · Agente',
    fonteEn: 'Thief · Agent',
    preRequisitos: 'Ladinagem 3+; talento Pés Firmes',
    ativacao: 'livre',
    custo: { foco: 2 },
    descricao:
      'Gasta 2 de foco para ganhar ▶▶, usáveis apenas em testes de perícia físicos via Usar uma Perícia, Ganhar Vantagem ou ação de qualquer talento de Agente. Em diálogo ou empreitada, a critério do MJ, pode usar as duas ▶▶ juntas numa contribuição adicional na rodada.',
  },
  'agent::thief::underworld-contacts': {
    nome: 'Contatos no Submundo',
    nomeEn: 'Underworld Contacts',
    fonte: 'Ladrão · Agente',
    fonteEn: 'Thief · Agent',
    preRequisitos: 'ter um patrono ou seguidor do submundo do crime; talento Redobrar Esforços',
    ativacao: 'especial',
    descricao:
      'Antes de testar para interagir socialmente com grupos ou indivíduos criminosos, pode gastar 2 de foco para adicionar uma Oportunidade ao resultado. Ao adquirir, ganha uma especialidade de utilidade em Grupos Criminosos.',
  },
}
