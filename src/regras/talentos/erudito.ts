/* arquivo: erudito.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 4 · Trilha heroica: Erudito — transcricao/04-trilhas-heroicas/05-erudito.md ──
export const TALENTOS_ERUDITO: Record<string, EntradaTalento> = {
  'scholar::key::erudition': {
    nome: 'Erudição',
    nomeEn: 'Erudition',
    fonte: 'Talento-chave · Erudito',
    fonteEn: 'Key talent · Scholar',
    preRequisitos: 'nenhum',
    ativacao: 'especial',
    descricao:
      'Ao adquirir, escolhe uma especialidade cultural ou de utilidade que ainda não tenha, e duas perícias cognitivas que não sejam de fluxo. Passa a contar como se tivesse a especialidade escolhida, e ganha +1 graduação em cada uma das duas perícias — mesmo acima do teto normal de graduação do patamar (é uma exceção explícita da regra de teto). Especialidade e graduações são temporárias: depois de um descanso longo com acesso a uma biblioteca, podem ser redistribuídas.',
    vagas: [
      { tipo: 'especialidade', indice: 0, rotulo: 'Especialidade concedida (cultural ou utilidade)', rotuloEn: 'Granted expertise (cultural or utility)' },
      {
        tipo: 'pericia',
        indice: 0,
        rotulo: 'Perícia bônus 1 (cognitiva)',
        rotuloEn: 'Bonus skill 1 (cognitive)',
        filtroPericia: (p) => p.atributo === 'intelecto' || p.atributo === 'vontade',
      },
      {
        tipo: 'pericia',
        indice: 1,
        rotulo: 'Perícia bônus 2 (cognitiva)',
        rotuloEn: 'Bonus skill 2 (cognitive)',
        filtroPericia: (p) => p.atributo === 'intelecto' || p.atributo === 'vontade',
      },
    ],
  },
  'scholar::artifabrian::efficient-engineer': {
    nome: 'Engenheiro Eficiente',
    nomeEn: 'Efficient Engineer',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'Manufatura 1+; talento-chave Erudição',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, ganha uma especialidade de utilidade (Manufatura de Arma, Armadura ou Equipamento) e um item à escolha (dorial amplificador, dorial entorpecente, ou um par de telepenas com bracelete de emoção). Ao manufaturar um item ou inventar um fabrial, o intervalo de Oportunidade desses testes aumenta em 2 pontos, e o custo de matéria-prima cai pela metade.',
  },
  'scholar::artifabrian::prized-acquisition': {
    nome: 'Aquisição Valiosa',
    nomeEn: 'Prized Acquisition',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'talento-chave Erudição',
    ativacao: 'especial',
    descricao:
      'Ao adquirir, ganha uma especialidade de perito em Manufatura de Fabrial e uma gema especialmente lapidada, usada como matéria-prima para um fabrial — ela vale como a gema de um fabrial único do patamar atual do personagem. Na primeira tentativa com essa gema, o tempo normal para atrair um espreno e manufaturar é ignorado. A gema não pode ser vendida nem trocada; se perdida, pode ser substituída após um descanso longo (a critério do MJ). Durante o recesso, é possível desfazer o fabrial pra recuperar a gema e reaproveitá-la.',
  },
  'scholar::artifabrian::fine-handiwork': {
    nome: 'Trabalho Manual Refinado',
    nomeEn: 'Fine Handiwork',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'talento Engenheiro Eficiente',
    ativacao: 'especial',
    descricao:
      'Ao manufaturar um item ou inventar um fabrial, pode gastar apenas uma melhoria (em vez de duas) para aplicar uma característica avançada. Só se beneficia deste talento uma vez por item.',
  },
  'scholar::artifabrian::deep-study': {
    nome: 'Estudo Aprofundado',
    nomeEn: 'Deep Study',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'talento Engenheiro Eficiente',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, o talento Erudição passa a conceder uma especialidade cultural ou de utilidade adicional e mais duas perícias cognitivas adicionais (não de fluxo). Esses extras podem ser redistribuídos como os do próprio talento Erudição.',
  },
  'scholar::artifabrian::experimental-tinkering': {
    nome: 'Criação Experimental',
    nomeEn: 'Experimental Tinkering',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'talento Trabalho Manual Refinado',
    ativacao: 'especial',
    descricao:
      'Ao manufaturar um item ou inventar um fabrial, o intervalo de Oportunidade desses testes aumenta em 1 ponto e o tempo de manufatura cai pela metade. Além disso, pode abrir mão dos benefícios de um descanso longo para trabalhar num fabrial feito com a gema de Aquisição Valiosa; ao fim, pode tentar reconfigurá-lo em outro fabrial de patamar igual ou inferior, pelo processo normal de manufatura, mas sem nova matéria-prima e ignorando o tempo de atrair um espreno. Se falhar no teste de Saber para aprisionar o espreno, o fabrial antigo permanece intacto, mas o talento não pode ser usado de novo até o próximo descanso longo. Ao concluir a manufatura com sucesso, o fabrial antigo é desfeito e perdido.',
  },
  'scholar::artifabrian::inventive-design': {
    nome: 'Projeto Inventivo',
    nomeEn: 'Inventive Design',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'Manufatura 2+; talento Aquisição Valiosa',
    ativacao: 'sempre',
    descricao:
      'Ao manufaturar um fabrial usando a gema de Aquisição Valiosa, pode escolher um efeito de 1 patamar acima do patamar que está manufaturando.',
  },
  'scholar::artifabrian::overcharge': {
    nome: 'Sobrecarregar',
    nomeEn: 'Overcharge',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'Manufatura 3+; talento Aquisição Valiosa',
    ativacao: 'especial',
    descricao:
      'Uma vez por turno, ao fazer um teste de ataque com um fabrial, pode gastar uma Oportunidade do teste para usar a ação Golpear com esse fabrial como ▷ no mesmo turno; esse Golpe não conta para o limite de ações de Golpear por mãos da arma. O MJ pode gastar uma Complicação do teste para impor um novo inconveniente ao fabrial, que dura até ser resolvido com um teste de Manufatura CD 15 feito como ▶▶ (2 ações).',
  },
  'scholar::artifabrian::overwhelm-with-detail': {
    nome: 'Encher de Detalhes',
    nomeEn: 'Overwhelm With Detail',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'Saber 3+; talento Criação Experimental',
    ativacao: 'especial',
    descricao:
      'Gasta 2 pontos de foco para fazer um teste cognitivo ou espiritual usando o modificador de Saber no lugar do modificador de perícia normalmente usado nesse teste.',
  },
  'scholar::strategist::composed': {
    nome: 'Compostura',
    nomeEn: 'Composed',
    fonte: 'Erudito · Estrategista',
    fonteEn: 'Scholar · Strategist',
    preRequisitos: 'talento Elaborar Estratégia',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, o foco máximo e atual aumenta num valor igual ao patamar do personagem. Quando o patamar sobe 1, o foco máximo sobe junto.',
  },
  'scholar::strategist::contingency': {
    nome: 'Contingência',
    nomeEn: 'Contingency',
    fonte: 'Erudito · Estrategista',
    fonteEn: 'Scholar · Strategist',
    preRequisitos: 'Saber 3+; talento Compostura',
    ativacao: 'reacao',
    descricao:
      'Depois que um aliado influenciável a até 6 metros rolar uma Complicação, pode gastar 2 pontos de foco para remover uma Complicação daquele teste.',
  },
  'scholar::strategist::deep-contemplation': {
    nome: 'Contemplação Profunda',
    nomeEn: 'Deep Contemplation',
    fonte: 'Erudito · Estrategista',
    fonteEn: 'Scholar · Strategist',
    preRequisitos: 'Saber 2+; talento Compostura',
    ativacao: '2acoes',
    descricao:
      'Redistribui até 2 das perícias e especialidades recebidas do talento Erudição.',
  },
  'scholar::strategist::keen-insight': {
    nome: 'Intuição Afiada',
    nomeEn: 'Keen Insight',
    fonte: 'Erudito · Estrategista',
    fonteEn: 'Scholar · Strategist',
    preRequisitos: 'talento Contemplação Profunda',
    ativacao: 'sempre',
    descricao:
      'Depois de obter sucesso num teste para Ganhar Vantagem, explora uma fraqueza do alvo: a menos que ele resista à influência, sofre uma desvantagem no próximo teste que fizer naquele encontro.',
  },
  'scholar::strategist::know-your-moment': {
    nome: 'A Hora de Agir',
    nomeEn: 'Know Your Moment',
    fonte: 'Erudito · Estrategista',
    fonteEn: 'Scholar · Strategist',
    preRequisitos: 'Dedução 2+; talento Corpo e Mente',
    ativacao: 'sempre',
    descricao:
      'No início de cada rodada, cada uma das defesas do personagem aumenta em 2 pontos até o início do seu próprio turno.',
  },
  'scholar::strategist::mind-and-body': {
    nome: 'Corpo e Mente',
    nomeEn: 'Mind and Body',
    fonte: 'Erudito · Estrategista',
    fonteEn: 'Scholar · Strategist',
    preRequisitos: 'talento-chave Erudição',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, o talento Erudição passa a conceder uma perícia adicional e pode ser usado para escolher perícias físicas (não de fluxo). Além disso, ganha uma especialidade em arma à escolha.',
  },
  'scholar::strategist::strategize': {
    nome: 'Elaborar Estratégia',
    nomeEn: 'Strategize',
    fonte: 'Erudito · Estrategista',
    fonteEn: 'Scholar · Strategist',
    preRequisitos: 'Dedução 1+; talento-chave Erudição',
    ativacao: 'especial',
    descricao:
      'Depois de obter sucesso num teste de Ganhar Vantagem usando uma perícia ganha pela Erudição, pode escolher um aliado influenciável para receber os benefícios dessa ação no seu lugar. Também pode gastar 2 pontos de foco para impedir o alvo da ação de usar reações contra o aliado escolhido até o fim do seu próximo turno.',
  },
  'scholar::strategist::turning-point': {
    nome: 'Momento de Virada',
    nomeEn: 'Turning Point',
    fonte: 'Erudito · Estrategista',
    fonteEn: 'Scholar · Strategist',
    preRequisitos: 'Dedução 3+; talento Contingência',
    ativacao: '2acoes',
    descricao:
      'Uma vez por cena, gasta 2 pontos de foco e faz um teste de Dedução contra a defesa Cognitiva do líder inimigo da cena (é preciso senti-lo para mirá-lo); em turno lento, ganha vantagem no teste. Em sucesso, o personagem e os aliados que puder influenciar ganham uma ▶ adicional nos próximos turnos.',
  },
  'scholar::surgeon::anatomical-insight': {
    nome: 'Intuição Anatômica',
    nomeEn: 'Anatomical Insight',
    fonte: 'Erudito · Cirurgião',
    fonteEn: 'Scholar · Surgeon',
    preRequisitos: 'talento Medicina de Campo',
    ativacao: 'especial',
    descricao:
      'Ao acertar um alvo do seu tamanho ou menor com um ataque desarmado, pode gastar 1 ponto de foco ou uma Oportunidade para aplicar a condição Exausto ao alvo. A penalidade é igual à metade das graduações em Medicina, arredondada para cima.',
  },
  'scholar::surgeon::applied-medicine': {
    nome: 'Medicina Aplicada',
    nomeEn: 'Applied Medicine',
    fonte: 'Erudito · Cirurgião',
    fonteEn: 'Scholar · Surgeon',
    preRequisitos: 'Saber 2+; talento Senhor de Si',
    ativacao: 'sempre',
    descricao:
      'Sempre que fizer um personagem recuperar vida, ele recupera vida adicional igual à metade das graduações do curador em Saber.',
  },
  'scholar::surgeon::collected': {
    nome: 'Senhor de Si',
    nomeEn: 'Collected',
    fonte: 'Erudito · Cirurgião',
    fonteEn: 'Scholar · Surgeon',
    preRequisitos: 'talento Inteligência Emocional',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, as defesas Cognitiva e Espiritual aumentam em 2 pontos cada.',
  },
  'scholar::surgeon::emotional-intelligence': {
    nome: 'Inteligência Emocional',
    nomeEn: 'Emotional Intelligence',
    fonte: 'Erudito · Cirurgião',
    fonteEn: 'Scholar · Surgeon',
    preRequisitos: 'talento-chave Erudição',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, o talento Erudição passa a conceder uma perícia adicional e pode ser usado para escolher perícias espirituais (não de fluxo). Além disso, ganha uma especialidade de utilidade em Diagnóstico.',
  },
  'scholar::surgeon::field-medicine': {
    nome: 'Medicina de Campo',
    nomeEn: 'Field Medicine',
    fonte: 'Erudito · Cirurgião',
    fonteEn: 'Scholar · Surgeon',
    preRequisitos: 'Medicina 1+; talento-chave Erudição',
    ativacao: '1acao',
    descricao:
      'Gasta 1 ponto de foco e faz um teste de Medicina CD 15 tratando um personagem voluntário e consciente ao alcance, rolando o dado de recuperação do alvo como parte do teste (desvantagem se tratar a si mesmo). Em sucesso, o alvo recupera vida igual ao dado de recuperação mais as graduações do curador em Medicina; em falha, só o resultado do dado.',
  },
  'scholar::surgeon::ongoing-care': {
    nome: 'Cuidado Contínuo',
    nomeEn: 'Ongoing Care',
    fonte: 'Erudito · Cirurgião',
    fonteEn: 'Scholar · Surgeon',
    preRequisitos: 'Saber 3+; talento Curandeiro Ágil',
    ativacao: 'especial',
    descricao:
      'Pode abrir mão dos benefícios de um descanso curto ou longo para tratar um aliado ao alcance. Depois, faz um teste de Medicina CD 10 (+5 de CD por lesão do alvo além da primeira); em sucesso, remove uma condição ou efeito equivalente causado por uma das lesões (a lesão continua). Um mesmo alvo só se beneficia a cada 24 horas. Ao adquirir, ganha também uma especialidade de utilidade em Cuidado de Saúde Mental.',
  },
  'scholar::surgeon::resuscitation': {
    nome: 'Ressuscitar',
    nomeEn: 'Resuscitation',
    fonte: 'Erudito · Cirurgião',
    fonteEn: 'Scholar · Surgeon',
    preRequisitos: 'Medicina 3+; talento Curandeiro Ágil',
    ativacao: 'especial',
    descricao:
      'Pode usar Medicina de Campo para ressuscitar, gastando 3 pontos de foco (em vez de 1) para mirar um personagem ao alcance que esteja Inconsciente ou morto há um número de rodadas igual às suas graduações em Medicina. A CD sobe 5 por lesão do alvo além da primeira. Em falha, o alvo não recupera vida; em sucesso, recupera vida como em Medicina de Campo, volta à vida se estava morto e, se estava Inconsciente, pode remover essa condição.',
  },
  'scholar::surgeon::swift-healer': {
    nome: 'Curandeiro Ágil',
    nomeEn: 'Swift Healer',
    fonte: 'Erudito · Cirurgião',
    fonteEn: 'Scholar · Surgeon',
    preRequisitos: 'Medicina 2+; talento Medicina de Campo',
    ativacao: 'livre',
    descricao:
      'Pode usar Medicina de Campo como ▷. Além disso, sempre que usar uma habilidade que restaura vida de outro personagem, o alvo recupera vida adicional igual às graduações do personagem em Medicina.',
  },
}
