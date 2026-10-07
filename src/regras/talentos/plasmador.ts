/* arquivo: plasmador.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Trilha Radiante: Plasmador — transcricao/05-trilhas-radiantes/08-plasmador.md ──
export const TALENTOS_PLASMADOR: Record<string, EntradaTalento> = {
  'willshaper::first-ideal-willshaper-key': {
    nome: 'Primeiro Ideal',
    nomeEn: 'First Ideal (Willshaper Key)',
    fonte: 'Talento-chave · Plasmador',
    fonteEn: 'Key talent · Willshaper',
    preRequisitos: 'Nível 2+',
    ativacao: 'especial',
    descricao:
      'Ao adquirir, ganha acesso à Investidura (máximo inicial = 2 + o maior entre Consciência e Presença) e as ações Inspirar Luz das Tempestades, Aprimorar e Restaurar. Ganha o objetivo "Dizer o Primeiro Ideal" — ao completá-lo, fica Potencializado até o fim da cena, ganha os fluxos Coesão e Transporte (1 graduação inicial em cada) e desbloqueia a árvore de Vínculo com Espreno de Luz e as árvores de Coesão e Transporte.',
  },
  'willshaper::second-ideal-willshaper': {
    nome: 'Segundo Ideal',
    nomeEn: 'Second Ideal (Willshaper)',
    fonte: 'Vínculo com Espreno de Luz · Plasmador',
    fonteEn: 'Lightspren Bond · Willshaper',
    preRequisitos: 'Nível 4+; Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Segundo Ideal". Ao completá-lo, fica Potencializado até o fim da cena e, enquanto tiver 1 ponto ou mais de Investidura, usa Aprimorar como ação livre (▷), sem gastar Investidura para usá-la nem para manter o efeito.',
  },
  'willshaper::third-ideal-willshaper': {
    nome: 'Terceiro Ideal',
    nomeEn: 'Third Ideal (Willshaper)',
    fonte: 'Vínculo com Espreno de Luz · Plasmador',
    fonteEn: 'Lightspren Bond · Willshaper',
    preRequisitos: 'Nível 8+; Dizer o Segundo Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Terceiro Ideal". Ao completá-lo, fica Potencializado até o fim da cena e pode convocar o espreno como uma Espada Fractal Radiante (ver Armas).',
  },
  'willshaper::fourth-ideal-willshaper': {
    nome: 'Quarto Ideal',
    nomeEn: 'Fourth Ideal (Willshaper)',
    fonte: 'Vínculo com Espreno de Luz · Plasmador',
    fonteEn: 'Lightspren Bond · Willshaper',
    preRequisitos: 'Nível 13+; Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Quarto Ideal". Ao completá-lo, fica Potencializado até o fim da cena e pode convocar um enxame de esprenos de alegria como uma Armadura Fractal Radiante (ver Armaduras).',
  },
  'willshaper::deepened-bond': {
    nome: 'Vínculo Aprofundado',
    nomeEn: 'Deepened Bond',
    fonte: 'Vínculo com Espreno de Luz · Plasmador',
    fonteEn: 'Lightspren Bond · Willshaper',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'sempre',
    descricao:
      'A distância do vínculo com o espreno sobe de 9 para 30 metros. Gastar foco para dar uma tarefa ao espreno custa 1 ponto a menos (mínimo 1).',
  },
  'willshaper::take-squire-willshaper': {
    nome: 'Obter Escudeiro',
    nomeEn: 'Take Squire (Willshaper)',
    fonte: 'Vínculo com Espreno de Luz · Plasmador',
    fonteEn: 'Lightspren Bond · Willshaper',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Depois de um descanso longo, escolhe como escudeiro um companheiro ou personagem jogador voluntário e sapiente que conheça há pelo menos 1 sessão e que não tenha vínculo com espreno Radiante. Decide se concede os dois fluxos, só um ou nenhum; o escudeiro recebe os fluxos escolhidos e os benefícios da habilidade Escudeiro. O máximo de escudeiros é igual ao número do Ideal atual; ao atingi-lo, é preciso dispensar um para escolher outro.',
  },
  'willshaper::invested': {
    nome: 'Investido',
    nomeEn: 'Invested',
    fonte: 'Vínculo com Espreno de Luz · Plasmador',
    fonteEn: 'Lightspren Bond · Willshaper',
    preRequisitos: 'Talento Coesão Espiritual',
    ativacao: 'sempre',
    descricao:
      'A Investidura máxima aumenta em um valor igual ao seu patamar; quando o patamar sobe 1, a Investidura máxima sobe junto.',
  },
  'willshaper::wound-regeneration': {
    nome: 'Restauração de Ferida',
    nomeEn: 'Wound Regeneration',
    fonte: 'Vínculo com Espreno de Luz · Plasmador',
    fonteEn: 'Lightspren Bond · Willshaper',
    preRequisitos: 'Talento Investido',
    ativacao: 'especial',
    descricao:
      'Ao usar a ação livre Restaurar, pode gastar Investidura para se curar na hora de uma lesão à escolha: 2 pontos para lesão temporária, 3 para permanente.',
  },
  'willshaper::spiritual-cohesion': {
    nome: 'Coesão Espiritual',
    nomeEn: 'Spiritual Cohesion',
    fonte: 'Vínculo com Espreno de Luz · Plasmador',
    fonteEn: 'Lightspren Bond · Willshaper',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: '2acoes',
    descricao:
      'Uma vez por cena, escolhe aliados que possa influenciar, até o número do seu Ideal atual. Cada alvo fica Determinado até o fim da cena; se usar essa condição para adicionar uma Oportunidade a um teste, suas defesas Cognitiva e Espiritual sobem 2 cada até o fim da cena.',
  },
}
