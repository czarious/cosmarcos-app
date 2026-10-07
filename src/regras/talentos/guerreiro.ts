/* arquivo: guerreiro.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 4 · Trilha heroica: Guerreiro — transcricao/04-trilhas-heroicas/06-guerreiro.md ──
export const TALENTOS_GUERREIRO: Record<string, EntradaTalento> = {
  'warrior::key::vigilant-stance': {
    nome: 'Postura Vigilante',
    nomeEn: 'Vigilant Stance',
    fonte: 'Talento-chave · Guerreiro',
    fonteEn: 'Key talent · Warrior',
    preRequisitos: 'nenhum',
    ativacao: '1acao',
    descricao:
      'Libera o uso de posturas e já ensina esta: entra nela com ▶. Nela, as reações Esquivar e Golpe Reativo custam 1 foco a menos, e é possível entrar em outra postura conhecida com ▷. Regras de postura: só uma ativa por vez; termina ao trocar, ao entrar em outra ou no fim da cena; seus efeitos acabam junto; só vale em combate (salvo Kata Praticado).',
  },
  'warrior::duelist::feinting-strike': {
    nome: 'Golpe de Finta',
    nomeEn: 'Feinting Strike',
    fonte: 'Guerreiro · Duelista',
    fonteEn: 'Warrior · Duelist',
    preRequisitos: 'Intimidação 2+; talento Postura da Chama',
    ativacao: '1acao',
    descricao:
      'Gasta 2 de foco para atacar corpo a corpo contra a defesa Cognitiva. Em acerto, o alvo perde uma ↻ e foco igual às suas graduações em Intimidação; em raspão, perde metade do foco (arredondado para cima) e mantém a ↻. Pode gastar uma Oportunidade para ganhar ▶, usável só para Golpear ou ativar uma postura.',
  },
  'warrior::duelist::flamestance': {
    nome: 'Postura da Chama',
    nomeEn: 'Flamestance',
    fonte: 'Guerreiro · Duelista',
    fonteEn: 'Warrior · Duelist',
    preRequisitos: 'Intimidação 1+; talento-chave Postura Vigilante',
    ativacao: '1acao',
    descricao:
      'Ensina a postura da Chama (entra com ▶). Nela, tem vantagem em testes de Intimidação; e, havendo exatamente um inimigo ao alcance e nenhum aliado no alcance dele ou no seu, usa ▷ para ganhar ▶, usável só para Ganhar Vantagem ou atacar esse inimigo.',
  },
  'warrior::duelist::ironstance': {
    nome: 'Postura do Ferro',
    nomeEn: 'Ironstance',
    fonte: 'Guerreiro · Duelista',
    fonteEn: 'Warrior · Duelist',
    preRequisitos: 'Atletismo 2+; talento Kata Praticado',
    ativacao: '1acao',
    descricao:
      'Ensina a postura do Ferro (entra com ▶). Nela, tem vantagem em testes de Intuição; e quando um personagem ao seu alcance erra contra você ou acerta de raspão, pode usar Golpe Reativo contra ele como se tivesse saído voluntariamente do alcance.',
  },
  'warrior::duelist::practiced-kata': {
    nome: 'Kata Praticado',
    nomeEn: 'Practiced Kata',
    fonte: 'Guerreiro · Duelista',
    fonteEn: 'Warrior · Duelist',
    preRequisitos: 'talento-chave Postura Vigilante',
    ativacao: 'especial',
    descricao:
      'Posturas passam a valer também em cenas de diálogo e empreitada: ativar ou trocar custa 1 de foco e conta como sua contribuição na rodada. Se não estiver Surpreendido no início de uma cena de combate, diálogo ou empreitada, entra em Postura Vigilante sem gastar ações.',
  },
  'warrior::duelist::signature-weapon': {
    nome: 'Arma Emblemática',
    nomeEn: 'Signature Weapon',
    fonte: 'Guerreiro · Duelista',
    fonteEn: 'Warrior · Duelist',
    preRequisitos: 'talento Postura da Chama',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, escolhe um tipo de arma em que já tenha especialidade e o anota ao lado do talento. O intervalo de Oportunidade nos testes com esse tipo de arma expande em 1; a partir do patamar 3, expande em 2.',
  },
  'warrior::duelist::surefooted': {
    nome: 'Pés Firmes',
    nomeEn: 'Surefooted',
    fonte: 'Guerreiro · Duelista',
    fonteEn: 'Warrior · Duelist',
    preRequisitos: 'talento Postura do Ferro',
    ativacao: 'sempre',
    descricao:
      'Taxa de movimento +3 metros. Antes de sofrer dano de terreno perigoso ou queda, reduz esse dano em 2 × patamar (ex.: 4 no patamar 2).',
  },
  'warrior::duelist::vinestance': {
    nome: 'Postura da Vinha',
    nomeEn: 'Vinestance',
    fonte: 'Guerreiro · Duelista',
    fonteEn: 'Warrior · Duelist',
    preRequisitos: 'Atletismo 3+; talento Golpe de Finta',
    ativacao: '1acao',
    descricao:
      'Ensina a postura da Vinha (entra com ▶). Nela, defesas Física e Cognitiva +1 cada; e depois de ser acertado ou atingido de raspão por ataque corpo a corpo, usa ↻ para testar Atletismo contra a defesa Cognitiva do atacante: em sucesso, ele perde 1d4 de foco e pode ser empurrado na horizontal até 1,5 m × suas graduações em Atletismo.',
  },
  'warrior::duelist::wit-s-end': {
    nome: 'Finalização Astuta',
    nomeEn: 'Wit’s End',
    fonte: 'Guerreiro · Duelista',
    fonteEn: 'Warrior · Duelist',
    preRequisitos: 'Intimidação 3+; talento Golpe de Finta',
    ativacao: '2acoes',
    descricao:
      'Gasta 1 de foco para atacar com arma corpo a corpo contra a defesa Cognitiva de um alvo com 0 de foco. Ignora a deflexão, causa 4d6 de dano extra no acerto e não pode ser raspão (só acerta ou erra). Dano extra por patamar: 6d6 no 3, 8d6 no 4, 10d6 no 5.',
  },
  'warrior::shardbearer::bloodstance': {
    nome: 'Postura do Sangue',
    nomeEn: 'Bloodstance',
    fonte: 'Guerreiro · Fractário',
    fonteEn: 'Warrior · Shardbearer',
    preRequisitos: 'Atletismo 2+; talento Poderoso ou Treinamento Fractal',
    ativacao: '1acao',
    descricao:
      'Ensina a postura do Sangue (entra com ▶). Nela, o intervalo de Oportunidade em testes de ataque físicos expande em 2, mas as defesas Física, Cognitiva e Espiritual caem 2 pontos cada.',
  },
  'warrior::shardbearer::meteoric-leap': {
    nome: 'Salto Meteórico',
    nomeEn: 'Meteoric Leap',
    fonte: 'Guerreiro · Fractário',
    fonteEn: 'Warrior · Shardbearer',
    preRequisitos: 'Atletismo 3+; talento Postura do Sangue',
    ativacao: '2acoes',
    descricao:
      'Gasta 2 de foco, salta até 1/4 da taxa de movimento e ataca desarmado contra a defesa Física de cada personagem à escolha ao seu alcance. Vestindo Armadura Fractal, tem vantagem no teste. Rola o dobro dos dados de dano; em acerto, cada alvo com Força menor que a sua fica Prostrado.',
  },
  'warrior::shardbearer::mighty': {
    nome: 'Poderoso',
    nomeEn: 'Mighty',
    fonte: 'Guerreiro · Fractário',
    fonteEn: 'Warrior · Shardbearer',
    preRequisitos: 'talento Postura da Rocha',
    ativacao: 'sempre',
    descricao:
      'Ao acertar um ataque com arma ou desarmado, cada ▶ usada naquela ação de ataque aumenta o dano em 1 + patamar (ex.: patamar 2 com ▶▶: 3 por ▶, total 6).',
  },
  'warrior::shardbearer::precise-parry': {
    nome: 'Aparada Precisa',
    nomeEn: 'Precise Parry',
    fonte: 'Guerreiro · Fractário',
    fonteEn: 'Warrior · Shardbearer',
    preRequisitos: 'Percepção 3+; talento Golpe Estilhaçador',
    ativacao: 'reacao',
    descricao:
      'Antes de ser acertado por ataque corpo a corpo, gasta 1 de foco para tentar aparar. Desarmado: testa Atletismo, com desvantagem salvo contra Espada Fractal; pode gastar Oportunidade para desarmar o oponente e tomar a arma. Com arma: testa Armamento Leve ou Pesado (conforme a arma); com Espada Fractal contra arma não Investida, pode gastar Oportunidade para destruí-la. A CD é o resultado do ataque que acertou; em sucesso, o acerto vira raspão.',
  },
  'warrior::shardbearer::shard-training': {
    nome: 'Treinamento Fractal',
    nomeEn: 'Shard Training',
    fonte: 'Guerreiro · Fractário',
    fonteEn: 'Warrior · Shardbearer',
    preRequisitos: 'acesso a uma Espada Fractal e uma Armadura Fractal para treinamento; talento-chave Postura Vigilante',
    ativacao: 'especial',
    descricao:
      'Uma vez por rodada, ao Golpear com Espada Fractal, escolhe inimigos adicionais ao alcance dela, até suas graduações na perícia usada; sem gastar foco, atinge de raspão cada um cuja defesa Física seja igual ou menor que o teste. Ao adquirir, ganha especialidade de perito em Armadura Fractal e em Espadas Fractais, Hiperarcos ou Martelos de Guerra. Vestindo Armadura Fractal, ela tem 2 cargas adicionais.',
  },
  'warrior::shardbearer::shattering-blow': {
    nome: 'Golpe Estilhaçador',
    nomeEn: 'Shattering Blow',
    fonte: 'Guerreiro · Fractário',
    fonteEn: 'Warrior · Shardbearer',
    preRequisitos: 'Percepção 2+; talento Postura do Vento',
    ativacao: 'especial',
    descricao:
      'Ao acertar corpo a corpo com arma de duas mãos ou mão livre, pode gastar 2 de foco: antes do dano, armadura com cargas do alvo (Fractal ou Semifractal) perde 1 carga. Depois, cada alvo que perdeu vida é empurrado 1,5 m, mais 1,5 m por ponto de Força acima de 5. Se colidir com objeto Médio ou maior, sofre dano de queda igual à distância (1d6 impactante a cada 3 m); o objeto também pode sofrer dano, a critério do MJ.',
  },
  'warrior::shardbearer::stonestance': {
    nome: 'Postura da Rocha',
    nomeEn: 'Stonestance',
    fonte: 'Guerreiro · Fractário',
    fonteEn: 'Warrior · Shardbearer',
    preRequisitos: 'talento-chave Postura Vigilante',
    ativacao: '1acao',
    descricao:
      'Ensina a postura da Rocha (entra com ▶). Nela, deflexão +1; e antes de um inimigo ao alcance da sua arma corpo a corpo gastar ▶ para atacar um aliado que não esteja em Postura da Rocha, ele precisa gastar uma ▶ adicional.',
  },
  'warrior::shardbearer::windstance': {
    nome: 'Postura do Vento',
    nomeEn: 'Windstance',
    fonte: 'Guerreiro · Fractário',
    fonteEn: 'Warrior · Shardbearer',
    preRequisitos: 'Percepção 1+; talento Treinamento Fractal',
    ativacao: '1acao',
    descricao:
      'Ensina a postura do Vento (entra com ▶). Nela, tem vantagem em testes de Agilidade; e com dois ou mais inimigos ao alcance, usa ▷ para ganhar ▶, usável só para Desengajar ou atacar um ou mais desses inimigos.',
  },
  'warrior::soldier::cautious-advance': {
    nome: 'Avanço Cauteloso',
    nomeEn: 'Cautious Advance',
    fonte: 'Guerreiro · Soldado',
    fonteEn: 'Warrior · Soldier',
    preRequisitos: 'Disciplina 1+; talento-chave Postura Vigilante',
    ativacao: '2acoes',
    descricao:
      'Move até metade da taxa de movimento, ignorando terreno difícil, e ganha ▶ que só pode ser gasta em Ganhar Vantagem ou Proteger.',
  },
  'warrior::soldier::combat-training': {
    nome: 'Treinamento de Combate',
    nomeEn: 'Combat Training',
    fonte: 'Guerreiro · Soldado',
    fonteEn: 'Warrior · Soldier',
    preRequisitos: 'talento-chave Postura Vigilante',
    ativacao: 'especial',
    descricao:
      'Uma vez por rodada, ao errar um ataque com arma, atinge o alvo de raspão sem gastar foco. Ao adquirir, ganha uma especialidade em arma, uma em armadura (à escolha) e a especialidade cultural Vida Militar.',
  },
  'warrior::soldier::defensive-position': {
    nome: 'Posição Defensiva',
    nomeEn: 'Defensive Position',
    fonte: 'Guerreiro · Soldado',
    fonteEn: 'Warrior · Soldier',
    preRequisitos: 'Atletismo 2+; talento Avanço Cauteloso',
    ativacao: 'sempre',
    descricao:
      'A ação Proteger impõe duas desvantagens (em vez de uma) a ataques contra você. Usando escudo para se Proteger, aliados a até 1,5 m podem se Proteger como se tivessem cobertura ou escudo.',
  },
  'warrior::soldier::devastating-blow': {
    nome: 'Golpe Devastador',
    nomeEn: 'Devastating Blow',
    fonte: 'Guerreiro · Soldado',
    fonteEn: 'Warrior · Soldier',
    preRequisitos: 'Atletismo 3+; talento Treinamento de Combate',
    ativacao: '2acoes',
    descricao:
      'Ataca com arma corpo a corpo contra a defesa Física; ao rolar dano, causa 2d8 extra. Dano extra por patamar: 3d8 no 3, 4d8 no 4, 5d8 no 5.',
  },
  'warrior::soldier::formation-drills': {
    nome: 'Exercícios de Formação',
    nomeEn: 'Formation Drills',
    fonte: 'Guerreiro · Soldado',
    fonteEn: 'Warrior · Soldier',
    preRequisitos: 'Disciplina 2+; talento Posição Defensiva',
    ativacao: 'sempre',
    descricao:
      'Enquanto um aliado a até 3 m se beneficia da ação Proteger, ele também recebe os efeitos da sua Posição Defensiva, como se tivesse o talento.',
  },
  'warrior::soldier::hardy': {
    nome: 'Resistente',
    nomeEn: 'Hardy',
    fonte: 'Guerreiro · Soldado',
    fonteEn: 'Warrior · Soldier',
    preRequisitos: 'talento Treinamento de Combate',
    ativacao: 'sempre',
    descricao:
      'Vida máxima e atual aumentam em 1 por nível, retroativamente a todos os níveis anteriores e também aos futuros (ex.: escolhido no nível 6, +6 de vida na hora).',
  },
  'warrior::soldier::swift-strikes': {
    nome: 'Golpes Repentinos',
    nomeEn: 'Swift Strikes',
    fonte: 'Guerreiro · Soldado',
    fonteEn: 'Warrior · Soldier',
    preRequisitos: 'talento Resistente',
    ativacao: '1acao',
    descricao:
      'Gasta 1 de foco para fazer uma segunda ação de Golpear com uma mão que já tenha usado para Golpear naquele turno.',
  },
  'warrior::soldier::wary': {
    nome: 'Prudente',
    nomeEn: 'Wary',
    fonte: 'Guerreiro · Soldado',
    fonteEn: 'Warrior · Soldier',
    preRequisitos: 'Disciplina 3+; talento Posição Defensiva',
    ativacao: 'sempre',
    descricao:
      'Com 1 ou mais de foco, não pode ser Surpreendido. Ao resistir a influência ou perder foco involuntariamente, reduz o foco perdido em suas graduações em Disciplina (mínimo de 1 perdido).',
  },
}
