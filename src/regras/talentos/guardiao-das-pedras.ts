/* arquivo: guardiao-das-pedras.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Trilha Radiante: Guardião das Pedras — transcricao/05-trilhas-radiantes/07-guardiao-das-pedras.md ──
export const TALENTOS_GUARDIAO_DAS_PEDRAS: Record<string, EntradaTalento> = {
  'stoneward::first-ideal-stoneward-key': {
    nome: 'Primeiro Ideal',
    nomeEn: 'First Ideal (Stoneward Key)',
    fonte: 'Talento-chave · Guardião das Pedras',
    fonteEn: 'Key talent · Stoneward',
    preRequisitos: 'Nível 2+',
    ativacao: 'especial',
    descricao:
      'Ao adquirir, ganha acesso à Investidura (máximo inicial = 2 + o maior entre Consciência e Presença) e as ações Inspirar Luz das Tempestades, Aprimorar e Restaurar. Ganha o objetivo "Dizer o Primeiro Ideal" — ao completá-lo, fica Potencializado até o fim da cena, ganha os fluxos Coesão e Tensão (1 graduação inicial em cada) e desbloqueia a árvore de Vínculo com Espreno Rochoso e as árvores de Coesão e Tensão.',
  },
  'stoneward::second-ideal-stoneward': {
    nome: 'Segundo Ideal',
    nomeEn: 'Second Ideal (Stoneward)',
    fonte: 'Vínculo com Espreno Rochoso · Guardião das Pedras',
    fonteEn: 'Peakspren Bond · Stoneward',
    preRequisitos: 'Nível 4+; Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Segundo Ideal". Ao completá-lo, fica Potencializado até o fim da cena e, enquanto tiver 1 ponto ou mais de Investidura, usa Aprimorar como ação livre (▷), sem gastar Investidura para usá-la nem para manter o efeito.',
  },
  'stoneward::third-ideal-stoneward': {
    nome: 'Terceiro Ideal',
    nomeEn: 'Third Ideal (Stoneward)',
    fonte: 'Vínculo com Espreno Rochoso · Guardião das Pedras',
    fonteEn: 'Peakspren Bond · Stoneward',
    preRequisitos: 'Nível 8+; Dizer o Segundo Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Terceiro Ideal". Ao completá-lo, fica Potencializado até o fim da cena e pode convocar o espreno como uma Espada Fractal Radiante (ver Armas).',
  },
  'stoneward::fourth-ideal-stoneward': {
    nome: 'Quarto Ideal',
    nomeEn: 'Fourth Ideal (Stoneward)',
    fonte: 'Vínculo com Espreno Rochoso · Guardião das Pedras',
    fonteEn: 'Peakspren Bond · Stoneward',
    preRequisitos: 'Nível 13+; Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Quarto Ideal". Ao completá-lo, fica Potencializado até o fim da cena e pode convocar um enxame de esprenos de conexão como uma Armadura Fractal Radiante (ver Armaduras).',
  },
  'stoneward::deepened-bond': {
    nome: 'Vínculo Aprofundado',
    nomeEn: 'Deepened Bond',
    fonte: 'Vínculo com Espreno Rochoso · Guardião das Pedras',
    fonteEn: 'Peakspren Bond · Stoneward',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'sempre',
    descricao:
      'A distância do vínculo com o espreno sobe de 9 para 30 metros. Gastar foco para dar uma tarefa ao espreno custa 1 ponto a menos (mínimo 1).',
  },
  'stoneward::take-squire-stoneward': {
    nome: 'Obter Escudeiro',
    nomeEn: 'Take Squire (Stoneward)',
    fonte: 'Vínculo com Espreno Rochoso · Guardião das Pedras',
    fonteEn: 'Peakspren Bond · Stoneward',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Depois de um descanso longo, escolhe como escudeiro um companheiro ou personagem jogador voluntário e sapiente que conheça há pelo menos 1 sessão e que não tenha vínculo com espreno Radiante. Decide se concede os dois fluxos, só um ou nenhum; o escudeiro recebe os fluxos escolhidos e os benefícios da habilidade Escudeiro. O máximo de escudeiros é igual ao seu nível atual; ao atingi-lo, é preciso dispensar um para escolher outro.',
  },
  'stoneward::invested': {
    nome: 'Investido',
    nomeEn: 'Invested',
    fonte: 'Vínculo com Espreno Rochoso · Guardião das Pedras',
    fonteEn: 'Peakspren Bond · Stoneward',
    preRequisitos: 'Talento Trabalho em Equipe Coeso',
    ativacao: 'sempre',
    descricao:
      'A Investidura máxima aumenta em um valor igual ao seu patamar; quando o patamar sobe 1, a Investidura máxima sobe junto.',
  },
  'stoneward::wound-regeneration': {
    nome: 'Restauração de Ferida',
    nomeEn: 'Wound Regeneration',
    fonte: 'Vínculo com Espreno Rochoso · Guardião das Pedras',
    fonteEn: 'Peakspren Bond · Stoneward',
    preRequisitos: 'Talento Investido',
    ativacao: 'especial',
    descricao:
      'Ao usar a ação livre Restaurar, pode gastar Investidura para se curar na hora de uma lesão à escolha: 2 pontos para lesão temporária, 3 pontos para lesão permanente.',
  },
  'stoneward::cohesive-teamwork': {
    nome: 'Trabalho em Equipe Coeso',
    nomeEn: 'Cohesive Teamwork',
    fonte: 'Vínculo com Espreno Rochoso · Guardião das Pedras',
    fonteEn: 'Peakspren Bond · Stoneward',
    preRequisitos: 'Coesão 2+; Tensão 2+; Dizer o Primeiro Ideal',
    ativacao: 'sempre',
    descricao:
      'Depois de usar Ganhar Vantagem com 1 ponto ou mais de Investidura (com sucesso ou não), o próximo aliado que fizer um teste contra o mesmo alvo ganha vantagem. Até o fim do seu próximo turno, enquanto estiver sobre pedra, não pode ser movido nem ficar Prostrado contra a vontade.',
  },
}
