/* arquivo: corredor-dos-ventos.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Trilha Radiante: Corredor dos Ventos — transcricao/05-trilhas-radiantes/05-corredor-dos-ventos.md ──
export const TALENTOS_CORREDOR_DOS_VENTOS: Record<string, EntradaTalento> = {
  'windrunner::first-ideal-windrunner-key': {
    nome: 'Primeiro Ideal',
    nomeEn: 'First Ideal (Windrunner Key)',
    fonte: 'Talento-chave · Corredor dos Ventos',
    fonteEn: 'Key talent · Windrunner',
    preRequisitos: 'Nível 2+',
    ativacao: 'especial',
    descricao:
      'Ao adquirir, ganha acesso à Investidura (máximo inicial = 2 + o maior entre Consciência e Presença) e as ações Inspirar Luz das Tempestades, Aprimorar e Restaurar. Ganha o objetivo "Dizer o Primeiro Ideal" — ao completá-lo, fica Potencializado até o fim da cena, ganha os fluxos Adesão e Gravitação (1 graduação inicial em cada) e desbloqueia as árvores de Vínculo com Espreno de Honra, Adesão e Gravitação.',
  },
  'windrunner::second-ideal-windrunner': {
    nome: 'Segundo Ideal',
    nomeEn: 'Second Ideal (Windrunner)',
    fonte: 'Vínculo com Espreno de Honra · Corredor dos Ventos',
    fonteEn: 'Honorspren Bond · Windrunner',
    preRequisitos: 'Nível 4+; Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Segundo Ideal". Ao completá-lo, fica Potencializado até o fim da cena e, enquanto tiver 1 ponto ou mais de Investidura, usa Aprimorar como ação livre (▷), sem gastar Investidura para usá-la nem para manter o efeito.',
  },
  'windrunner::third-ideal-windrunner': {
    nome: 'Terceiro Ideal',
    nomeEn: 'Third Ideal (Windrunner)',
    fonte: 'Vínculo com Espreno de Honra · Corredor dos Ventos',
    fonteEn: 'Honorspren Bond · Windrunner',
    preRequisitos: 'Nível 8+; Dizer o Segundo Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Terceiro Ideal". Ao completá-lo, fica Potencializado até o fim da cena e pode convocar o espreno como uma Espada Fractal Radiante (ver Armas).',
  },
  'windrunner::fourth-ideal-windrunner': {
    nome: 'Quarto Ideal',
    nomeEn: 'Fourth Ideal (Windrunner)',
    fonte: 'Vínculo com Espreno de Honra · Corredor dos Ventos',
    fonteEn: 'Honorspren Bond · Windrunner',
    preRequisitos: 'Nível 13+; Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Quarto Ideal". Ao completá-lo, fica Potencializado até o fim da cena e pode convocar um enxame de esprenos de vento como uma Armadura Fractal Radiante (ver Armaduras).',
  },
  'windrunner::deepened-bond': {
    nome: 'Vínculo Aprofundado',
    nomeEn: 'Deepened Bond',
    fonte: 'Vínculo com Espreno de Honra · Corredor dos Ventos',
    fonteEn: 'Honorspren Bond · Windrunner',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'sempre',
    descricao:
      'A distância do vínculo com o espreno sobe de 9 para 30 metros. Gastar foco para dar uma tarefa ao espreno custa 1 ponto a menos (mínimo 1).',
  },
  'windrunner::take-squire-windrunner': {
    nome: 'Obter Escudeiro',
    nomeEn: 'Take Squire (Windrunner)',
    fonte: 'Vínculo com Espreno de Honra · Corredor dos Ventos',
    fonteEn: 'Honorspren Bond · Windrunner',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Depois de um descanso longo, escolhe um voluntário sapiente que conheça há 1+ sessão e sem espreno Radiante para ser escudeiro, decidindo se concede ambos os fluxos, um ou nenhum. O máximo de escudeiros é o dobro do seu nível atual; ao atingir o limite, precisa dispensar um para escolher outro.',
  },
  'windrunner::invested': {
    nome: 'Investido',
    nomeEn: 'Invested',
    fonte: 'Vínculo com Espreno de Honra · Corredor dos Ventos',
    fonteEn: 'Honorspren Bond · Windrunner',
    preRequisitos: 'Talento Projeção Reversa',
    ativacao: 'sempre',
    descricao:
      'A Investidura máxima aumenta em um valor igual ao seu patamar; quando o patamar sobe 1, a Investidura máxima sobe junto.',
  },
  'windrunner::wound-regeneration': {
    nome: 'Restauração de Ferida',
    nomeEn: 'Wound Regeneration',
    fonte: 'Vínculo com Espreno de Honra · Corredor dos Ventos',
    fonteEn: 'Honorspren Bond · Windrunner',
    preRequisitos: 'Talento Investido',
    ativacao: 'especial',
    descricao:
      'Ao usar a ação livre Restaurar, pode gastar Investidura para se curar na hora de uma lesão à escolha: 2 pontos para lesão temporária, 3 pontos para lesão permanente.',
  },
  'windrunner::reverse-lashing': {
    nome: 'Projeção Reversa',
    nomeEn: 'Reverse Lashing',
    fonte: 'Vínculo com Espreno de Honra · Corredor dos Ventos',
    fonteEn: 'Honorspren Bond · Windrunner',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Antes de infundir a si ou um objeto com Projeção Básica de Gravitação, pode infundi-lo com uma Projeção Reversa de Adesão, declarando um tipo de objeto (projéteis, gemas, chaves...). Objetos soltos e desprotegidos desse tipo, de tamanho que suas graduações em Adesão afetem, que chegarem a 30 cm por graduação em Gravitação voam até o alvo e ficam presos nele até a infusão acabar ou serem removidos.',
  },
}
