/* arquivo: alternauta.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Trilha Radiante: Alternauta ──────────────────────────
export const TALENTOS_ALTERNAUTA: Record<string, EntradaTalento> = {
  'elsecaller::first-ideal-elsecaller-key': {
    nome: 'Primeiro Ideal',
    nomeEn: 'First Ideal',
    fonte: 'Talento-chave · Alternauta',
    fonteEn: 'Key talent · Elsecaller',
    preRequisitos: 'Nível 2+',
    ativacao: 'especial',
    descricao:
      'Ao adquirir, ganha acesso à Investidura (máximo inicial = 2 + o maior entre Consciência e Presença) e destrava as ações Inspirar Luz das Tempestades, Aprimorar e Restaurar. Ganha o objetivo "Dizer o Primeiro Ideal" — ao completá-lo, fica Potencializado até o fim da cena, ganha os fluxos de Transformação e Transporte (1 graduação inicial em cada) e desbloqueia a árvore de talentos de Vínculo com Espreno de Tinta.',
  },
  'elsecaller::second-ideal-elsecaller': {
    nome: 'Segundo Ideal',
    nomeEn: 'Second Ideal',
    fonte: 'Vínculo com Espreno de Tinta · Alternauta',
    fonteEn: 'Inkspren Bond · Elsecaller',
    preRequisitos: 'Nível 4+; Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Segundo Ideal". Ao completá-lo, fica Potencializado até o fim da cena e Aprimorar melhora: com 1 ponto ou mais de Investidura, você a usa como ação livre (▷) e não gasta mais Investidura para usá-la nem para manter o efeito.',
  },
  'elsecaller::third-ideal-elsecaller': {
    nome: 'Terceiro Ideal',
    nomeEn: 'Third Ideal',
    fonte: 'Vínculo com Espreno de Tinta · Alternauta',
    fonteEn: 'Inkspren Bond · Elsecaller',
    preRequisitos: 'Nível 8+; Dizer o Segundo Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Terceiro Ideal". Ao completá-lo, fica Potencializado até o fim da cena e pode convocar o espreno como Espada Fractal Radiante.',
  },
  'elsecaller::fourth-ideal-elsecaller': {
    nome: 'Quarto Ideal',
    nomeEn: 'Fourth Ideal',
    fonte: 'Vínculo com Espreno de Tinta · Alternauta',
    fonteEn: 'Inkspren Bond · Elsecaller',
    preRequisitos: 'Nível 13+; Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Quarto Ideal". Ao completá-lo, fica Potencializado até o fim da cena e pode convocar um enxame de esprenos de lógica como Armadura Fractal Radiante.',
  },
  'elsecaller::deepened-bond': {
    nome: 'Vínculo Aprofundado',
    nomeEn: 'Deepened Bond',
    fonte: 'Vínculo com Espreno de Tinta · Alternauta',
    fonteEn: 'Inkspren Bond · Elsecaller',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'sempre',
    descricao:
      'A distância do vínculo com o espreno passa de 9 para 30 metros. Gastar Foco para dar uma tarefa ao espreno custa 1 ponto a menos (mínimo 1).',
  },
  'elsecaller::take-squire-elsecaller': {
    nome: 'Obter Escudeiro',
    nomeEn: 'Take Squire',
    fonte: 'Vínculo com Espreno de Tinta · Alternauta',
    fonteEn: 'Inkspren Bond · Elsecaller',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Após um descanso longo, escolha como escudeiro um companheiro ou personagem jogador voluntário e sapiente, que você conheça há pelo menos 1 sessão e que não tenha vínculo com espreno Radiante. Decida se ele recebe os dois fluxos, um ou nenhum; ele ganha também os demais benefícios de Escudeiro. O máximo de escudeiros é igual ao número do seu Ideal atual; no máximo, dispense um antes de escolher outro.',
  },
  'elsecaller::invested': {
    nome: 'Investido',
    nomeEn: 'Invested',
    fonte: 'Vínculo com Espreno de Tinta · Alternauta',
    fonteEn: 'Inkspren Bond · Elsecaller',
    preRequisitos: 'talento Perspicácia do Alternauta',
    ativacao: 'sempre',
    descricao:
      'Sua Investidura máxima aumenta em um valor igual ao seu patamar; quando o patamar sobe 1, a Investidura máxima também sobe 1.',
  },
  'elsecaller::wound-regeneration': {
    nome: 'Restauração de Ferida',
    nomeEn: 'Wound Regeneration',
    fonte: 'Vínculo com Espreno de Tinta · Alternauta',
    fonteEn: 'Inkspren Bond · Elsecaller',
    preRequisitos: 'talento Investido',
    ativacao: 'especial',
    descricao:
      'Ao usar a ação livre Restaurar, pode gastar Investidura para curar na hora uma lesão à escolha: 2 pontos para lesão temporária, 3 pontos para lesão permanente.',
  },
  'elsecaller::elsecaller-s-perspicacity': {
    nome: 'Perspicácia do Alternauta',
    nomeEn: 'Elsecaller\'s Perspicacity',
    fonte: 'Vínculo com Espreno de Tinta · Alternauta',
    fonteEn: 'Inkspren Bond · Elsecaller',
    preRequisitos: 'Transformação 2+; Transporte 2+; Dizer o Primeiro Ideal',
    ativacao: 'sempre',
    descricao:
      'Enquanto tiver 1 ponto ou mais de Investidura, tem vantagem em testes de Dedução, em testes feitos como parte de uma reação e em testes para reunir informações olhando entre os Reinos Físico e Cognitivo.',
  },
}
