/* arquivo: dancarino-de-precipicios.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Trilha Radiante: Dançarino de Precipícios — transcricao/05-trilhas-radiantes/06-dancarino-de-precipicios.md ──
export const TALENTOS_DANCARINO_DE_PRECIPICIOS: Record<string, EntradaTalento> = {
  'edgedancer::first-ideal-edgedancer-key': {
    nome: 'Primeiro Ideal (Dançarino de Precipícios)',
    nomeEn: 'First Ideal (Edgedancer Key)',
    fonte: 'Talento-chave · Dançarino de Precipícios',
    fonteEn: 'Key talent · Edgedancer',
    preRequisitos: 'Nível 2+',
    ativacao: 'especial',
    descricao:
      'Começa o vínculo com um espreno de cultura. Ao adquirir, ganha Investidura (máximo inicial 2 + o maior entre Consciência ou Presença) e as ações Inspirar Luz das Tempestades, Aprimorar e Restaurar. Ganha o objetivo "Dizer o Primeiro Ideal"; ao completá-lo, fica Potencializado até o fim da cena e ganha os fluxos Abrasão e Progressão, com uma perícia adicional para cada um, começando com 1 graduação.',
  },
  'edgedancer::deepened-bond': {
    nome: 'Vínculo Aprofundado',
    nomeEn: 'Deepened Bond',
    fonte: 'Vínculo com Espreno de Cultura · Dançarino de Precipícios',
    fonteEn: 'Cultivationspren Bond · Edgedancer',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'sempre',
    descricao:
      'A distância do vínculo com o espreno aumenta de 9 para 30 metros. Gastar foco para dar uma tarefa ao espreno custa 1 ponto a menos (mínimo 1).',
  },
  'edgedancer::edgedancer-s-grace': {
    nome: 'Graça do Dançarino de Precipícios',
    nomeEn: 'Edgedancer’s Grace',
    fonte: 'Vínculo com Espreno de Cultura · Dançarino de Precipícios',
    fonteEn: 'Cultivationspren Bond · Edgedancer',
    preRequisitos: 'Abrasão 2+; Progressão 2+; Dizer o Primeiro Ideal',
    ativacao: 'sempre',
    descricao:
      'Sempre que começa o turno com 1 ponto ou mais de Investidura, ganha uma reação adicional, usável apenas para Evitar Perigo ou Esquivar. Se usar Esquivar assim, ignora o custo normal de foco dessa reação.',
  },
  'edgedancer::fourth-ideal-edgedancer': {
    nome: 'Quarto Ideal (Dançarino de Precipícios)',
    nomeEn: 'Fourth Ideal (Edgedancer)',
    fonte: 'Vínculo com Espreno de Cultura · Dançarino de Precipícios',
    fonteEn: 'Cultivationspren Bond · Edgedancer',
    preRequisitos: 'Nível 13+; Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Quarto Ideal"; ao completá-lo, fica Potencializado até o fim da cena e pode convocar um enxame de esprenos de vida como Armadura Fractal Radiante (ver Armaduras, cap. 7).',
  },
  'edgedancer::invested': {
    nome: 'Investido',
    nomeEn: 'Invested',
    fonte: 'Vínculo com Espreno de Cultura · Dançarino de Precipícios',
    fonteEn: 'Cultivationspren Bond · Edgedancer',
    preRequisitos: 'Talento Graça do Dançarino de Precipícios',
    ativacao: 'sempre',
    descricao:
      'O valor máximo de Investidura aumenta em um número igual ao patamar. Quando o patamar sobe em 1, a Investidura máxima também sobe.',
  },
  'edgedancer::second-ideal-edgedancer': {
    nome: 'Segundo Ideal (Dançarino de Precipícios)',
    nomeEn: 'Second Ideal (Edgedancer)',
    fonte: 'Vínculo com Espreno de Cultura · Dançarino de Precipícios',
    fonteEn: 'Cultivationspren Bond · Edgedancer',
    preRequisitos: 'Nível 4+; Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Segundo Ideal"; ao completá-lo, fica Potencializado até o fim da cena. Além disso, enquanto tiver 1 ponto ou mais de Investidura, usa Aprimorar como ação livre e não gasta mais Investidura para usá-la nem para manter seu efeito.',
  },
  'edgedancer::take-squire-edgedancer': {
    nome: 'Obter Escudeiro (Dançarino de Precipícios)',
    nomeEn: 'Take Squire (Edgedancer)',
    fonte: 'Vínculo com Espreno de Cultura · Dançarino de Precipícios',
    fonteEn: 'Cultivationspren Bond · Edgedancer',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Após um descanso longo, pode tomar como escudeiro um companheiro ou personagem jogador que possa influenciar: voluntário, sapiente, conhecido há pelo menos 1 sessão e sem vínculo com outro espreno Radiante. Decide se concede os dois fluxos, só um ou nenhum; o escudeiro ganha os fluxos escolhidos e os benefícios da habilidade Escudeiro. O máximo de escudeiros é o número do Ideal atual (3 no Terceiro); no máximo, é preciso dispensar um para escolher outro.',
  },
  'edgedancer::third-ideal-edgedancer': {
    nome: 'Terceiro Ideal (Dançarino de Precipícios)',
    nomeEn: 'Third Ideal (Edgedancer)',
    fonte: 'Vínculo com Espreno de Cultura · Dançarino de Precipícios',
    fonteEn: 'Cultivationspren Bond · Edgedancer',
    preRequisitos: 'Nível 8+; Dizer o Segundo Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Terceiro Ideal"; ao completá-lo, fica Potencializado até o fim da cena e pode convocar seu espreno como Espada Fractal Radiante (ver Armas, cap. 7).',
  },
  'edgedancer::wound-regeneration': {
    nome: 'Restauração de Ferida',
    nomeEn: 'Wound Regeneration',
    fonte: 'Vínculo com Espreno de Cultura · Dançarino de Precipícios',
    fonteEn: 'Cultivationspren Bond · Edgedancer',
    preRequisitos: 'Talento Investido',
    ativacao: 'especial',
    descricao:
      'Ao usar a ação livre Restaurar, pode gastar Investidura para se recuperar na hora de uma lesão à escolha: 2 pontos para lesão temporária, 3 pontos para lesão permanente.',
  },
}
