/* arquivo: cacador.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 4 · Trilha heroica: Caçador — transcricao/04-trilhas-heroicas/03-cacador.md ──
export const TALENTOS_CACADOR: Record<string, EntradaTalento> = {
  'hunter::key::seek-quarry': {
    nome: 'Marcar Presa',
    nomeEn: 'Seek Quarry',
    fonte: 'Talento-chave · Caçador',
    fonteEn: 'Key talent · Hunter',
    preRequisitos: 'nenhum',
    ativacao: 'especial',
    descricao:
      'Depois de 1 minuto de preparo mental, escolhe um personagem que possa sentir ou que já tenha encontrado: ele vira sua presa até você encerrar o efeito (▷) ou escolher outra presa. Você tem vantagem em testes para encontrar, atacar ou estudar a presa (como na ação Ganhar Vantagem).',
  },
  'hunter::archer::backstep': {
    nome: 'Passo de Recuo',
    nomeEn: 'Backstep',
    fonte: 'Arqueiro · Caçador',
    fonteEn: 'Archer · Hunter',
    preRequisitos: 'Agilidade 2+; talento Mira Estável',
    ativacao: 'livre',
    descricao:
      'Depois de fazer um ataque à distância, gasta 2 pontos de foco para Desengajar como ▷. Se terminar o turno sob cobertura ou onde os sentidos dos inimigos estejam obscurecidos, ganha o benefício da ação Proteger.',
  },
  'hunter::archer::combat-training': {
    nome: 'Treinamento de Combate',
    nomeEn: 'Combat Training',
    fonte: 'Arqueiro · Caçador',
    fonteEn: 'Archer · Hunter',
    preRequisitos: 'talento-chave Marcar Presa',
    ativacao: 'especial',
    descricao:
      'Uma vez por rodada, ao errar um ataque com arma, pode acertar de raspão sem gastar foco. Ao adquirir, ganha uma especialidade em arma e uma em armadura à escolha, e a especialidade cultural Vida Militar.',
  },
  'hunter::archer::exploit-weakness': {
    nome: 'Explorar Fraqueza',
    nomeEn: 'Exploit Weakness',
    fonte: 'Arqueiro · Caçador',
    fonteEn: 'Archer · Hunter',
    preRequisitos: 'Percepção 3+; talento Olhar Afiado',
    ativacao: 'livre',
    descricao: 'Usa a ação Ganhar Vantagem como ▷, mirando somente na sua presa.',
  },
  'hunter::archer::hardy': {
    nome: 'Resistente',
    nomeEn: 'Hardy',
    fonte: 'Arqueiro · Caçador',
    fonteEn: 'Archer · Hunter',
    preRequisitos: 'talento Mira Estável',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, a Vida máxima e atual aumentam em 1 por nível, retroativamente em todos os níveis passados e futuros (ex.: escolhido no nível 6, soma 6 de Vida).',
  },
  'hunter::archer::sharp-eye': {
    nome: 'Olhar Afiado',
    nomeEn: 'Sharp Eye',
    fonte: 'Arqueiro · Caçador',
    fonteEn: 'Archer · Hunter',
    preRequisitos: 'talento Tiro de Marcação',
    ativacao: 'especial',
    descricao:
      'Depois de observar a presa usando ▶, ou de observar outro personagem por pelo menos 1 minuto, faz um teste de Percepção contra a defesa Cognitiva do alvo. Em sucesso, descobre uma informação à escolha: o menor valor de atributo do alvo; o menor valor de defesa do alvo; ou se o alvo perdeu mais da metade do máximo de vida, foco ou Investidura (uma opção à escolha).',
  },
  'hunter::archer::steady-aim': {
    nome: 'Mira Estável',
    nomeEn: 'Steady Aim',
    fonte: 'Arqueiro · Caçador',
    fonteEn: 'Archer · Hunter',
    preRequisitos: 'Agilidade 1+; talento Treinamento de Combate',
    ativacao: '1acao',
    descricao:
      'Até o fim do turno, as distâncias curta e longa das suas armas à distância aumentam em 50%, e cada ataque à distância que acerta causa dano extra igual às suas graduações em Percepção.',
  },
  'hunter::archer::tagging-shot': {
    nome: 'Tiro de Marcação',
    nomeEn: 'Tagging Shot',
    fonte: 'Arqueiro · Caçador',
    fonteEn: 'Archer · Hunter',
    preRequisitos: 'Percepção 2+; talento-chave Marcar Presa',
    ativacao: '3acoes',
    descricao:
      'Move-se até 1,5 metro e faz um ataque à distância contra a defesa Física de um alvo. Em acerto ou raspão, o alvo também vira sua presa para o talento Marcar Presa.',
  },
  'hunter::archer::unrelenting-salvo': {
    nome: 'Saraivada Implacável',
    nomeEn: 'Unrelenting Salvo',
    fonte: 'Arqueiro · Caçador',
    fonteEn: 'Archer · Hunter',
    preRequisitos: 'Agilidade 3+; talento Resistente',
    ativacao: 'sempre',
    descricao:
      'Pode Golpear contra sua presa mais de uma vez por turno com a mesma arma à distância, sem o limite de um Golpear por mão.',
  },
  'hunter::assassin::cold-eyes': {
    nome: 'Olhar Frio',
    nomeEn: 'Cold Eyes',
    fonte: 'Assassino · Caçador',
    fonteEn: 'Assassin · Hunter',
    preRequisitos: 'talento Às Sombras',
    ativacao: 'sempre',
    descricao:
      'Ao matar ou incapacitar um inimigo que seja sua presa, recupera 1 ponto de foco e pode designar outro inimigo que possa sentir como nova presa para Marcar Presa. A critério do MJ, não vale para alvos que não representem ameaça.',
  },
  'hunter::assassin::fatal-thrust': {
    nome: 'Estocada Fatal',
    nomeEn: 'Fatal Thrust',
    fonte: 'Assassino · Caçador',
    fonteEn: 'Assassin · Hunter',
    preRequisitos: 'Percepção 3+; talento Golpe Surpreendente',
    ativacao: '2acoes',
    descricao:
      'Com uma arma leve, faz um ataque corpo a corpo contra a defesa Cognitiva de um alvo Surpreendido, que não o sinta ou que não o veja como ameaça (ex.: você disfarçado). Se a arma tiver o traço Discreto, ganha duas vantagens no teste. No dano, soma 4d4 extras e conta quantos dados (da arma e extras) saíram no valor máximo; para cada um, o alvo subtrai 2 de qualquer rolagem de lesão causada por esse ataque. Dano extra: 6d4 no patamar 3, 8d4 no 4 e 10d4 no 5.',
  },
  'hunter::assassin::killing-edge': {
    nome: 'Excelência em Matar',
    nomeEn: 'Killing Edge',
    fonte: 'Assassino · Caçador',
    fonteEn: 'Assassin · Hunter',
    preRequisitos: 'Percepção 2+; talento-chave Marcar Presa',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, ganha a especialidade em armas Facas e Fundas. Enquanto empunhar faca ou funda, ela também tem os traços de perito Mortal e Saque Rápido.',
  },
  'hunter::assassin::mighty': {
    nome: 'Poderoso',
    nomeEn: 'Mighty',
    fonte: 'Assassino · Caçador',
    fonteEn: 'Assassin · Hunter',
    preRequisitos: 'talento Olhar Frio',
    ativacao: 'sempre',
    descricao:
      'Ao acertar com arma ou ataque desarmado, cada ▶ gasta no ataque soma 1 + seu patamar ao dano (ex.: nível 6 com ataque de ▶▶: 1+2 por ▶, total 6 de dano extra).',
  },
  'hunter::assassin::shadowing': {
    nome: 'Às Sombras',
    nomeEn: 'Shadowing',
    fonte: 'Assassino · Caçador',
    fonteEn: 'Assassin · Hunter',
    preRequisitos: 'Furtividade 2+; talento Excelência em Matar',
    ativacao: 'especial',
    descricao:
      'Tem vantagem em testes para evitar ser sentido pela presa, e a presa sofre desvantagem para senti-lo. Além disso, ao ter sucesso num teste contra a defesa Espiritual de um inimigo estando sob cobertura ou onde os sentidos dele estejam obscurecidos, pode gastar 3 pontos de foco para torná-lo sua presa em Marcar Presa.',
  },
  'hunter::assassin::sidestep': {
    nome: 'Passo Lateral',
    nomeEn: 'Sidestep',
    fonte: 'Assassino · Caçador',
    fonteEn: 'Assassin · Hunter',
    preRequisitos: 'Furtividade 3+; talento Às Sombras',
    ativacao: 'sempre',
    descricao:
      'No início de cada combate e de cada turno seu, ganha uma ↻ adicional, utilizável apenas para Esquivar. Não funciona com armadura de deflexão 2 ou superior.',
  },
  'hunter::assassin::startling-blow': {
    nome: 'Golpe Surpreendente',
    nomeEn: 'Startling Blow',
    fonte: 'Assassino · Caçador',
    fonteEn: 'Assassin · Hunter',
    preRequisitos: 'Furtividade 1+; talento-chave Marcar Presa',
    ativacao: '1acao',
    descricao:
      'Faz um ataque desarmado ou com arma improvisada contra a defesa Cognitiva de um alvo do seu tamanho ou menor. Em acerto ou raspão, o alvo fica Atordoado até o fim do seu próximo turno.',
  },
  'hunter::assassin::swift-strikes': {
    nome: 'Golpes Repentinos',
    nomeEn: 'Swift Strikes',
    fonte: 'Assassino · Caçador',
    fonteEn: 'Assassin · Hunter',
    preRequisitos: 'talento Olhar Frio',
    ativacao: '1acao',
    descricao:
      'Gasta 1 ponto de foco para fazer uma segunda ação de Golpear com uma mão que já tenha Golpeado naquele turno.',
  },
  'hunter::tracker::animal-bond': {
    nome: 'Vínculo Animal',
    nomeEn: 'Animal Bond',
    fonte: 'Rastreador · Caçador',
    fonteEn: 'Tracker · Hunter',
    preRequisitos: 'ter um companheiro animal; talento-chave Marcar Presa',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, aprimora um companheiro animal ganho como recompensa. Comunica conceitos simples a ele, que tenta ajudar conforme pedido. Enquanto você o sentir e ele estiver a até 3 metros, cada uma das suas defesas sobe 1; quando você se move, ele se move junto. Em combate segue as regras de PNJ aliado, mas, se ainda não agiu na rodada, você pode usar ▷ para chamá-lo: ele ganha ▶ ou ▶▶ (sua escolha) para agir já, e no início do próximo turno dele ganha essa mesma quantidade a menos. Ação especial dele: ▶▶ Rastrear, ajudando a rastrear um personagem à sua escolha que ele possa sentir ao alcance, que se torna sua presa em Marcar Presa. Se chegar a 0 de vida, não fica Inconsciente: para de lutar e recua (ainda pode morrer por lesões ou razões narrativas). Se o perder, pode formar vínculo com novo animal quando o MJ achar apropriado.',
  },
  'hunter::tracker::deadly-trap': {
    nome: 'Armadilha Mortal',
    nomeEn: 'Deadly Trap',
    fonte: 'Rastreador · Caçador',
    fonteEn: 'Tracker · Hunter',
    preRequisitos: 'Sobrevivência 1+; talento-chave Marcar Presa',
    ativacao: '2acoes',
    descricao:
      'Cria e oculta uma armadilha ao seu alcance (círculo de 1,5 m de diâmetro), escolhendo: Emaranhadora (Sobrevivência vs. Cognitiva; acerto: 2d4 impactante, Imobilizado por 1 rodada, área vira terreno difícil até o fim da cena) ou Empaladora (Sobrevivência vs. Física; acerto: 2d4 afiado, Afligido [dano vital 3 + graduações em Sobrevivência] por 1 rodada, e pode gastar uma Oportunidade para causar lesão). Fica no local até ser acionada ao ser tocada, quando você ataca com Sobrevivência contra a defesa indicada, com vantagem se o alvo for sua presa; não causa raspão. Máximo de armadilhas ativas igual às suas graduações em Sobrevivência, sem sobrepor áreas. Para outro personagem procurar ou desarmar, a CD é a defesa Espiritual do Caçador.',
  },
  'hunter::tracker::experienced-trapper': {
    nome: 'Armadilheiro Experiente',
    nomeEn: 'Experienced Trapper',
    fonte: 'Rastreador · Caçador',
    fonteEn: 'Tracker · Hunter',
    preRequisitos: 'Percepção 2+; talento Armadilha Mortal',
    ativacao: 'especial',
    descricao:
      'Forragear num descanso curto não consome sua atenção: ainda pode rolar o dado de recuperação ou fazer outras atividades. Teste de Sobrevivência para forragear comida e água tem sucesso automático se houver no ambiente e nada impedir; a forragem sustenta personagens em número igual às suas graduações em Sobrevivência. Após descanso longo nos ermos, pode produzir uma ferramenta de materiais naturais (lança, funda, tenda etc., a critério do MJ) usando o modificador de Sobrevivência no lugar de Manufatura. Ao adquirir, o dano de Armadilha Mortal sobe de 2d4 para 2d6 e a duração das condições de 1 para 2 rodadas.',
  },
  'hunter::tracker::feral-connection': {
    nome: 'Conexão Feral',
    nomeEn: 'Feral Connection',
    fonte: 'Rastreador · Caçador',
    fonteEn: 'Tracker · Hunter',
    preRequisitos: 'Sobrevivência 2+; talento Vínculo Protetivo',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, a Vida máxima e atual do companheiro animal sobe 5 por patamar seu (e continua subindo quando o patamar aumenta); suas defesas Física, Cognitiva e Espiritual sobem 2 cada; e ele soma aos próprios testes suas graduações em Sobrevivência. Você também ganha uma especialidade de utilidade em Cuidado de Animais.',
  },
  'hunter::tracker::hunter-s-edge': {
    nome: 'Astúcia do Caçador',
    nomeEn: 'Hunter’s Edge',
    fonte: 'Rastreador · Caçador',
    fonteEn: 'Tracker · Hunter',
    preRequisitos: 'Sobrevivência 3+; talento Armadilheiro Experiente',
    ativacao: 'sempre',
    descricao:
      'Seu companheiro animal tem vantagem em testes contra sua presa. Ao adquirir, o dano de Armadilha Mortal sobe de 2d6 para 2d8 e a duração das condições de 2 para 3 rodadas.',
  },
  'hunter::tracker::pack-hunting': {
    nome: 'Caçar em Bando',
    nomeEn: 'Pack Hunting',
    fonte: 'Rastreador · Caçador',
    fonteEn: 'Tracker · Hunter',
    preRequisitos: 'Percepção 2+; talento Vínculo Protetivo',
    ativacao: 'reacao',
    descricao:
      'Quando um aliado na sua linha de efeito ataca sua presa, gasta 1 ponto de foco para somar suas graduações em Sobrevivência ao teste ou ao dano dele (à sua escolha).',
  },
  'hunter::tracker::protective-bond': {
    nome: 'Vínculo Protetivo',
    nomeEn: 'Protective Bond',
    fonte: 'Rastreador · Caçador',
    fonteEn: 'Tracker · Hunter',
    preRequisitos: 'talento Vínculo Animal',
    ativacao: '1acao',
    descricao:
      'Designa o companheiro animal para proteger um aliado a até 9 metros; ele vai para o lado do aliado. Enquanto estiver ao alcance do aliado, este recebe o bônus de defesas do Vínculo Animal e você não. Pode encerrar como ▶ se estiver a até 9 metros do companheiro e puder influenciá-lo, fazendo-o voltar a você; senão, termina ao fim da cena.',
  },
  'hunter::tracker::surefooted': {
    nome: 'Pés Firmes',
    nomeEn: 'Surefooted',
    fonte: 'Rastreador · Caçador',
    fonteEn: 'Tracker · Hunter',
    preRequisitos: 'talento Armadilheiro Experiente',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, a taxa de movimento aumenta em 3 metros. Antes de sofrer dano por terreno perigoso ou queda, reduz esse dano em 2 × seu patamar (ex.: 4 no segundo patamar).',
  },
}
