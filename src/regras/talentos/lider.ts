/* arquivo: lider.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 4 · Trilha heroica: Líder — transcricao/04-trilhas-heroicas/07-lider.md ──
export const TALENTOS_LIDER: Record<string, EntradaTalento> = {
  'leader::key::decisive-command': {
    nome: 'Comando Decisivo',
    nomeEn: 'Decisive Command',
    fonte: 'Talento-chave · Líder',
    fonteEn: 'Key talent · Leader',
    preRequisitos: 'nenhum',
    ativacao: '1acao',
    descricao:
      'Ao adquirir, ganha um dado de comando: começa como d4 e sobe até d12 por outros talentos. Gasta 1 de foco e escolhe um aliado influenciável a até 6 m. No próximo teste que esse aliado fizer antes do fim do próprio próximo turno, ele rola o dado de comando junto dos demais dados e soma o resultado a uma das rolagens do teste (exceto o Dado de Trama). Outros talentos de Líder usam o dado de comando de outras formas, mesmo que um aliado já tenha um dado concedido por você.',
  },
  'leader::champion::combat-coordination': {
    nome: 'Coordenação de Combate',
    nomeEn: 'Combat Coordination',
    fonte: 'Campeão · Líder',
    fonteEn: 'Champion · Leader',
    preRequisitos: 'Liderança 2+; talento-chave Comando Decisivo',
    ativacao: 'livre',
    descricao:
      'Depois de usar a ação Golpear, usa Comando Decisivo como ação livre. Se o Golpear não acertou, não paga o foco usual de Comando Decisivo.',
  },
  'leader::champion::demonstrative-command': {
    nome: 'Comando Demonstrativo',
    nomeEn: 'Demonstrative Command',
    fonte: 'Campeão · Líder',
    fonteEn: 'Champion · Leader',
    preRequisitos: 'Liderança 2+; talento Posição Resoluta',
    ativacao: 'especial',
    descricao:
      'Antes de um teste de Agilidade, Atletismo ou Liderança, pode gastar 1 de foco para rolar o dado de comando e somar o resultado ao d20. Ao adquirir, o dado de comando sobe um passo (ex.: d4 para d6).',
  },
  'leader::champion::hardy': {
    nome: 'Resistente',
    nomeEn: 'Hardy',
    fonte: 'Campeão · Líder',
    fonteEn: 'Champion · Leader',
    preRequisitos: 'talento Intervenção Valente',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, a Vida máxima e a atual aumentam em 1 por nível, retroativamente para todos os níveis passados e futuros (ex.: escolhido no nível 6, soma 6 de imediato).',
  },
  'leader::champion::imposing-posture': {
    nome: 'Postura Impositiva',
    nomeEn: 'Imposing Posture',
    fonte: 'Campeão · Líder',
    fonteEn: 'Champion · Leader',
    preRequisitos: 'Atletismo 2+; talento Coordenação de Combate',
    ativacao: 'sempre',
    descricao:
      'Quando um inimigo resiste à sua influência estando ao alcance da sua arma, ele fica Desorientado até o fim do próprio próximo turno.',
  },
  'leader::champion::mighty': {
    nome: 'Poderoso',
    nomeEn: 'Mighty',
    fonte: 'Campeão · Líder',
    fonteEn: 'Champion · Leader',
    preRequisitos: 'talento Postura Impositiva',
    ativacao: 'sempre',
    descricao:
      'Ao acertar um ataque com arma ou desarmado, cada ▶ gasta naquela ação de ataque soma 1 + seu patamar ao dano. Ex.: patamar 2 atacando com ▶▶ causa 3 por ▶, 6 de dano extra no total.',
  },
  'leader::champion::resilient-hero': {
    nome: 'Herói Resiliente',
    nomeEn: 'Resilient Hero',
    fonte: 'Campeão · Líder',
    fonteEn: 'Champion · Leader',
    preRequisitos: 'Atletismo 3+; talento Posição Resoluta',
    ativacao: 'reacao',
    descricao:
      'Uma vez por cena, antes de cair a 0 de Vida, usa esta reação para que a Vida fique igual ao seu modificador de Atletismo em vez de 0.',
  },
  'leader::champion::resolute-stand': {
    nome: 'Posição Resoluta',
    nomeEn: 'Resolute Stand',
    fonte: 'Campeão · Líder',
    fonteEn: 'Champion · Leader',
    preRequisitos: 'Atletismo 1+; talento Resistente',
    ativacao: 'especial',
    descricao:
      'Ao usar Intervenção Valente, pode gastar foco até o valor das suas graduações em Liderança para afetar essa mesma quantidade de alvos adicionais (1 alvo por ponto de foco). Além disso, um alvo afetado por Intervenção Valente não pode fazer Golpe Reativo contra seus aliados até o fim do próprio próximo turno.',
  },
  'leader::champion::valiant-intervention': {
    nome: 'Intervenção Valente',
    nomeEn: 'Valiant Intervention',
    fonte: 'Campeão · Líder',
    fonteEn: 'Champion · Leader',
    preRequisitos: 'Atletismo 1+; talento-chave Comando Decisivo',
    ativacao: '1acao',
    descricao:
      'Gasta 1 de foco, move-se até 3 m e testa Atletismo contra a defesa Espiritual de um inimigo influenciável. Em sucesso, o alvo sofre desvantagem em testes contra seus aliados até o fim do próximo turno dele. Se o alvo resistir, você ganha vantagem no próximo teste contra ele, desde que feito até o fim do seu próximo turno.',
  },
  'leader::officer::authority': {
    nome: 'Autoridade',
    nomeEn: 'Authority',
    fonte: 'Oficial · Líder',
    fonteEn: 'Officer · Leader',
    preRequisitos: 'ter um título que dê comando sobre ao menos 5 pessoas; talento Comando Confiante',
    ativacao: 'sempre',
    descricao:
      'Seus talentos de Líder que afetam aliados passam a ter o dobro do alcance (se tiverem) e podem afetar até o dobro de aliados.',
  },
  'leader::officer::composed': {
    nome: 'Compostura',
    nomeEn: 'Composed',
    fonte: 'Oficial · Líder',
    fonteEn: 'Officer · Leader',
    preRequisitos: 'talento-chave Comando Decisivo',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, o foco máximo e o atual aumentam em um valor igual ao seu patamar. Quando o patamar sobe, o foco máximo sobe junto.',
  },
  'leader::officer::confident-command': {
    nome: 'Comando Confiante',
    nomeEn: 'Confident Command',
    fonte: 'Oficial · Líder',
    fonteEn: 'Officer · Leader',
    preRequisitos: 'Liderança 2+; talento Traje Habitual',
    ativacao: 'especial',
    descricao:
      'Antes de um teste de Intimidação, Liderança ou Persuasão, pode gastar 1 de foco para rolar o dado de comando e somar o resultado ao d20. Ao adquirir, o dado de comando sobe um passo (ex.: d4 para d6).',
  },
  'leader::officer::customary-garb': {
    nome: 'Traje Habitual',
    nomeEn: 'Customary Garb',
    fonte: 'Oficial · Líder',
    fonteEn: 'Officer · Leader',
    preRequisitos: 'talento Em Toda a Contenda',
    ativacao: 'sempre',
    descricao:
      'Enquanto estiver visivelmente com roupas ou armadura Apresentável adequadas à situação, suas defesas Física e Espiritual aumentam em 2 cada.',
  },
  'leader::officer::relentless-march': {
    nome: 'Marcha Implacável',
    nomeEn: 'Relentless March',
    fonte: 'Oficial · Líder',
    fonteEn: 'Officer · Leader',
    preRequisitos: 'Persuasão 3+; talento Comando Confiante',
    ativacao: 'sempre',
    descricao:
      'Depois de usar Comando Decisivo em um aliado, até o fim do próximo turno dele sua taxa de movimento sobe 3 m e ele ignora os efeitos das condições Exausto, Lento e Surpreendido.',
  },
  'leader::officer::synchronized-assault': {
    nome: 'Ataque Sincronizado',
    nomeEn: 'Synchronized Assault',
    fonte: 'Oficial · Líder',
    fonteEn: 'Officer · Leader',
    preRequisitos: 'Liderança 3+; talento Autoridade',
    ativacao: '3acoes',
    descricao:
      'Gasta 2 de foco e testa Liderança contra a defesa Cognitiva de um inimigo que você possa sentir. Em sucesso, escolhe aliados até o valor das suas graduações em Liderança; em falha, apenas um aliado influenciável. No próximo turno de cada aliado escolhido, ele ganha uma ▶ que só pode ser usada para Golpear o alvo, sem contar para o limite de Golpes por mãos da arma.',
  },
  'leader::officer::through-the-fray': {
    nome: 'Em Toda a Contenda',
    nomeEn: 'Through the Fray',
    fonte: 'Oficial · Líder',
    fonteEn: 'Officer · Leader',
    preRequisitos: 'Persuasão 1+; talento-chave Comando Decisivo',
    ativacao: '1acao',
    descricao:
      'Escolhe um aliado influenciável a até 6 m. Antes do fim do seu turno, esse aliado pode usar a ação Desengajar ou Ganhar Vantagem como reação.',
  },
  'leader::officer::well-supplied': {
    nome: 'Provisões Abundantes',
    nomeEn: 'Well Supplied',
    fonte: 'Oficial · Líder',
    fonteEn: 'Officer · Leader',
    preRequisitos: 'Persuasão 2+; talento Compostura',
    ativacao: 'especial',
    descricao:
      'Ao testar para requisitar ou alocar recursos, pode gastar 2 de foco para adicionar uma Oportunidade ao resultado. Ao adquirir, ganha uma especialidade de utilidade em Logística Militar.',
  },
  'leader::politico::baleful': {
    nome: 'Pernicioso',
    nomeEn: 'Baleful',
    fonte: 'Político · Líder',
    fonteEn: 'Politician · Leader',
    preRequisitos: 'talento Boateiro',
    ativacao: 'sempre',
    descricao:
      'Para resistir à sua influência, o alvo precisa gastar foco adicional igual ao seu patamar.',
  },
  'leader::politico::cutthroat-tactics': {
    nome: 'Táticas Implacáveis',
    nomeEn: 'Cutthroat Tactics',
    fonte: 'Político · Líder',
    fonteEn: 'Politician · Leader',
    preRequisitos: 'Dissimulação 1+; talento-chave Comando Decisivo',
    ativacao: 'especial',
    descricao:
      'Antes de um aliado rolar o dado de comando que você concedeu, ele pode optar por aumentar as apostas daquele teste em vez de rolar o dado. Se fizer isso e rolar uma Complicação, você recupera 1 de foco.',
  },
  'leader::politico::grand-deception': {
    nome: 'Dissimulação Grandiosa',
    nomeEn: 'Grand Deception',
    fonte: 'Político · Líder',
    fonteEn: 'Politician · Leader',
    preRequisitos: 'Dissimulação 3+; talento Comando Efetivo',
    ativacao: '3acoes',
    descricao:
      'Gasta 3 de foco e testa Dissimulação, CD 15. Em sucesso, escolhe um detalhe estabelecido desde o início da última cena e revela que era um ardil. A revelação precisa ser plausível (esconder um artefato em outro lugar ou mover o exército para leste em vez de oeste, sim; transformar item mundano em artefato inestimável ou surgir com um exército que disse não ter, não). O MJ decide o que pode ser revelado.',
  },
  'leader::politico::rumormonger': {
    nome: 'Boateiro',
    nomeEn: 'Rumormonger',
    fonte: 'Político · Líder',
    fonteEn: 'Politician · Leader',
    preRequisitos: 'ter um patrono; talento Táticas Implacáveis',
    ativacao: 'especial',
    descricao:
      'Ao testar para espalhar desinformação ou coletar rumores, pode gastar 2 de foco para adicionar uma Oportunidade ao resultado. Ao adquirir, ganha uma especialidade de utilidade em Escândalo.',
  },
  'leader::politico::set-at-odds': {
    nome: 'Colocar em Desacordo',
    nomeEn: 'Set at Odds',
    fonte: 'Político · Líder',
    fonteEn: 'Politician · Leader',
    preRequisitos: 'Liderança 3+; talento Pernicioso',
    ativacao: '2acoes',
    descricao:
      'Escolhe dois ou mais personagens influenciáveis, descreve uma fonte de conflito (suspeita, inveja) e testa Liderança com CD igual à maior defesa Espiritual entre os alvos. Em sucesso, cada alvo fica hostil aos demais (discussão, combate ou outro conflito) até resolverem. Um alvo pode resistir, mas então perde foco adicional igual às suas graduações em Liderança; se só um resistir, os outros seguem hostis entre si, porém o conflito fica mais fácil de resolver.',
  },
  'leader::politico::shrewd-command': {
    nome: 'Comando Efetivo',
    nomeEn: 'Shrewd Command',
    fonte: 'Político · Líder',
    fonteEn: 'Politician · Leader',
    preRequisitos: 'Liderança 2+; talento Boateiro',
    ativacao: 'especial',
    descricao:
      'Antes de um teste de Dissimulação, Intuição ou Liderança, pode gastar 1 de foco para rolar o dado de comando e somar o resultado ao d20. Ao adquirir, o dado de comando sobe um passo (ex.: d4 para d6).',
  },
  'leader::politico::tactical-ploy': {
    nome: 'Estratagema Tático',
    nomeEn: 'Tactical Ploy',
    fonte: 'Político · Líder',
    fonteEn: 'Politician · Leader',
    preRequisitos: 'talento-chave Comando Decisivo',
    ativacao: '1acao',
    descricao:
      'Testa Dissimulação contra a defesa Cognitiva de um inimigo influenciável. Em sucesso, o alvo perde uma reação e sofre desvantagem no próximo teste cognitivo ou espiritual. Se o alvo resistir, você ganha vantagem no próximo teste contra ele, desde que feito até o fim do seu próximo turno.',
  },
  'leader::politico::well-dressed': {
    nome: 'Bem Vestido',
    nomeEn: 'Well Dressed',
    fonte: 'Político · Líder',
    fonteEn: 'Politician · Leader',
    preRequisitos: 'talento Boateiro',
    ativacao: 'especial',
    descricao:
      'Enquanto estiver visivelmente com roupas elegantes ou armadura Apresentável, ganha vantagem no primeiro teste de Dissimulação, Liderança ou Persuasão de cada cena. Ao adquirir, ganha uma especialidade cultural em Moda.',
  },
}
