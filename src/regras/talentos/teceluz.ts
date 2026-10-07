/* arquivo: teceluz.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Trilha Radiante: Teceluz — transcricao/05-trilhas-radiantes/12-teceluz.md ──
export const TALENTOS_TECELUZ: Record<string, EntradaTalento> = {
  'lightweaver::first-ideal-lightweaver-key': {
    nome: 'Primeiro Ideal',
    nomeEn: 'First Ideal (Lightweaver Key)',
    fonte: 'Talento-chave · Teceluz',
    fonteEn: 'Key talent · Lightweaver',
    preRequisitos: 'Nível 2+',
    ativacao: 'especial',
    descricao:
      'Ao adquirir, ganha acesso à Investidura (máximo inicial = 2 + o maior entre Consciência e Presença) e as ações Inspirar Luz das Tempestades, Aprimorar e Restaurar. Ganha o objetivo "Dizer o Primeiro Ideal" — ao completá-lo, fica Potencializado até o fim da cena, ganha os fluxos Iluminação e Transformação (1 graduação inicial em cada) e desbloqueia a árvore de Vínculo com Críptico e as árvores de Iluminação e Transformação.',
  },
  'lightweaver::second-ideal-lightweaver': {
    nome: 'Segundo Ideal',
    nomeEn: 'Second Ideal (Lightweaver)',
    fonte: 'Vínculo com Críptico · Teceluz',
    fonteEn: 'Cryptic Bond · Lightweaver',
    preRequisitos: 'Nível 4+; Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Segundo Ideal". Ao completá-lo, fica Potencializado até o fim da cena e, enquanto tiver 1 ponto ou mais de Investidura, usa Aprimorar como ação livre (▷), sem gastar Investidura para usá-la nem para manter o efeito.',
  },
  'lightweaver::third-ideal-lightweaver': {
    nome: 'Terceiro Ideal',
    nomeEn: 'Third Ideal (Lightweaver)',
    fonte: 'Vínculo com Críptico · Teceluz',
    fonteEn: 'Cryptic Bond · Lightweaver',
    preRequisitos: 'Nível 8+; Dizer o Segundo Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Terceiro Ideal". Ao completá-lo, fica Potencializado até o fim da cena e pode convocar o espreno como uma Espada Fractal Radiante (ver Armas).',
  },
  'lightweaver::fourth-ideal-lightweaver': {
    nome: 'Quarto Ideal',
    nomeEn: 'Fourth Ideal (Lightweaver)',
    fonte: 'Vínculo com Críptico · Teceluz',
    fonteEn: 'Cryptic Bond · Lightweaver',
    preRequisitos: 'Nível 13+; Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Quarto Ideal". Ao completá-lo, fica Potencializado até o fim da cena e pode convocar um enxame de esprenos de criação como uma Armadura Fractal Radiante (ver Armaduras).',
  },
  'lightweaver::deepened-bond': {
    nome: 'Vínculo Aprofundado',
    nomeEn: 'Deepened Bond',
    fonte: 'Vínculo com Críptico · Teceluz',
    fonteEn: 'Cryptic Bond · Lightweaver',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'sempre',
    descricao:
      'A distância do vínculo com o espreno sobe de 9 para 30 metros. Gastar foco para dar uma tarefa ao espreno custa 1 ponto a menos (mínimo 1).',
  },
  'lightweaver::take-squire-lightweaver': {
    nome: 'Obter Escudeiro',
    nomeEn: 'Take Squire (Lightweaver)',
    fonte: 'Vínculo com Críptico · Teceluz',
    fonteEn: 'Cryptic Bond · Lightweaver',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Após um descanso longo, escolhe um escudeiro: companheiro ou personagem voluntário e sapiente, conhecido há pelo menos 1 sessão e sem vínculo com espreno Radiante. Decide se concede os dois fluxos, um ou nenhum. O máximo de escudeiros é igual ao número do Ideal atual; ao atingi-lo, é preciso dispensar um para escolher outro.',
  },
  'lightweaver::invested': {
    nome: 'Investido',
    nomeEn: 'Invested',
    fonte: 'Vínculo com Críptico · Teceluz',
    fonteEn: 'Cryptic Bond · Lightweaver',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'sempre',
    descricao:
      'A Investidura máxima aumenta em um valor igual ao patamar, e sobe mais 1 a cada aumento de patamar.',
  },
  'lightweaver::wound-regeneration': {
    nome: 'Restauração de Ferida',
    nomeEn: 'Wound Regeneration',
    fonte: 'Vínculo com Críptico · Teceluz',
    fonteEn: 'Cryptic Bond · Lightweaver',
    preRequisitos: 'Talento Investido',
    ativacao: 'especial',
    descricao:
      'Ao usar a ação livre Restaurar, pode gastar Investidura para se curar na hora de uma lesão à escolha: 2 pontos para lesão temporária, 3 para permanente.',
  },
  'lightweaver::physical-illusion': {
    nome: 'Ilusão Física',
    nomeEn: 'Physical Illusion',
    fonte: 'Vínculo com Críptico · Teceluz',
    fonteEn: 'Cryptic Bond · Lightweaver',
    preRequisitos: 'Dizer o Quarto Ideal; talento Restauração de Ferida',
    ativacao: '2acoes',
    descricao:
      'Gasta 1 ou mais de Investidura para infundir uma ilusão tangível: ocupa espaço, pode dar cobertura (Média ou maior) e pesa metade do real, até 12,5 kg por graduação de fluxo. Tem vida 5 × graduações em Transformação e defesas 10 + modificador de Transformação; a 0 de vida, a infusão termina. Comandá-la custa ▶ e usa seu modificador de Iluminação; com arma ilusória ataca corpo a corpo a defesa Física, com dado de dano crescente (2 graduações 2d6, 3 graduações 2d8…) + modificador de Iluminação.',
  },
}
