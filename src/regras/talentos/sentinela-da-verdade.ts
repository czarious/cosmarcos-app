/* arquivo: sentinela-da-verdade.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Trilha Radiante: Sentinela da Verdade — transcricao/05-trilhas-radiantes/11-sentinela-da-verdade.md ──
export const TALENTOS_SENTINELA_DA_VERDADE: Record<string, EntradaTalento> = {
  'truthwatcher::first-ideal-truthwatcher-key': {
    nome: 'Primeiro Ideal',
    nomeEn: 'First Ideal (Truthwatcher Key)',
    fonte: 'Talento-chave · Sentinela da Verdade',
    fonteEn: 'Key talent · Truthwatcher',
    preRequisitos: 'Nível 2+',
    ativacao: 'especial',
    descricao:
      'Ao adquirir, ganha acesso à Investidura (máximo inicial = 2 + o maior entre Consciência e Presença) e as ações Inspirar Luz das Tempestades, Aprimorar e Restaurar. Ganha o objetivo "Dizer o Primeiro Ideal" — ao completá-lo, fica Potencializado até o fim da cena, ganha os fluxos Iluminação e Progressão (1 graduação inicial em cada) e desbloqueia a árvore de Vínculo com Espreno de Névoa e as árvores de Iluminação e Progressão.',
  },
  'truthwatcher::second-ideal-truthwatcher': {
    nome: 'Segundo Ideal',
    nomeEn: 'Second Ideal (Truthwatcher)',
    fonte: 'Vínculo com Espreno de Névoa · Sentinela da Verdade',
    fonteEn: 'Mistspren Bond · Truthwatcher',
    preRequisitos: 'Nível 4+; Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Segundo Ideal". Ao completá-lo, fica Potencializado até o fim da cena e, enquanto tiver 1 ponto ou mais de Investidura, usa Aprimorar como ação livre (▷), sem gastar Investidura para usá-la nem para manter o efeito.',
  },
  'truthwatcher::third-ideal-truthwatcher': {
    nome: 'Terceiro Ideal',
    nomeEn: 'Third Ideal (Truthwatcher)',
    fonte: 'Vínculo com Espreno de Névoa · Sentinela da Verdade',
    fonteEn: 'Mistspren Bond · Truthwatcher',
    preRequisitos: 'Nível 8+; Dizer o Segundo Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Terceiro Ideal". Ao completá-lo, fica Potencializado até o fim da cena e pode convocar o espreno como uma Espada Fractal Radiante (ver Armas).',
  },
  'truthwatcher::fourth-ideal-truthwatcher': {
    nome: 'Quarto Ideal',
    nomeEn: 'Fourth Ideal (Truthwatcher)',
    fonte: 'Vínculo com Espreno de Névoa · Sentinela da Verdade',
    fonteEn: 'Mistspren Bond · Truthwatcher',
    preRequisitos: 'Nível 13+; Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Quarto Ideal". Ao completá-lo, fica Potencializado até o fim da cena e pode convocar um enxame de esprenos de concentração como uma Armadura Fractal Radiante (ver Armaduras).',
  },
  'truthwatcher::deepened-bond': {
    nome: 'Vínculo Aprofundado',
    nomeEn: 'Deepened Bond',
    fonte: 'Vínculo com Espreno de Névoa · Sentinela da Verdade',
    fonteEn: 'Mistspren Bond · Truthwatcher',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'sempre',
    descricao:
      'A distância do vínculo com o espreno sobe de 9 para 30 metros. Gastar foco para dar uma tarefa ao espreno custa 1 ponto a menos (mínimo 1).',
  },
  'truthwatcher::take-squire-truthwatcher': {
    nome: 'Obter Escudeiro',
    nomeEn: 'Take Squire (Truthwatcher)',
    fonte: 'Vínculo com Espreno de Névoa · Sentinela da Verdade',
    fonteEn: 'Mistspren Bond · Truthwatcher',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Após um descanso longo, escolhe um escudeiro: companheiro ou personagem voluntário e sapiente, conhecido há pelo menos 1 sessão e sem vínculo com espreno Radiante. Decide se concede os dois fluxos, um ou nenhum. O máximo de escudeiros é igual ao número do Ideal atual; ao atingi-lo, é preciso dispensar um para escolher outro.',
  },
  'truthwatcher::invested': {
    nome: 'Investido',
    nomeEn: 'Invested',
    fonte: 'Vínculo com Espreno de Névoa · Sentinela da Verdade',
    fonteEn: 'Mistspren Bond · Truthwatcher',
    preRequisitos: 'Talento Cura Espiritual',
    ativacao: 'sempre',
    descricao:
      'A Investidura máxima aumenta em um valor igual ao patamar, e sobe mais 1 a cada aumento de patamar.',
  },
  'truthwatcher::wound-regeneration': {
    nome: 'Restauração de Ferida',
    nomeEn: 'Wound Regeneration',
    fonte: 'Vínculo com Espreno de Névoa · Sentinela da Verdade',
    fonteEn: 'Mistspren Bond · Truthwatcher',
    preRequisitos: 'Talento Investido',
    ativacao: 'especial',
    descricao:
      'Ao usar a ação livre Restaurar, pode gastar Investidura para se curar na hora de uma lesão à escolha: 2 pontos para lesão temporária, 3 para permanente.',
  },
  'truthwatcher::spiritual-healing': {
    nome: 'Cura Espiritual',
    nomeEn: 'Spiritual Healing',
    fonte: 'Vínculo com Espreno de Névoa · Sentinela da Verdade',
    fonteEn: 'Mistspren Bond · Truthwatcher',
    preRequisitos: 'Iluminação 2+; Progressão 2+; Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Antes de restaurar vida de si ou de um aliado voluntário, pode gastar 2 de Investidura para que o alvo, em vez de vida, recupere metade desse valor (arredondado para cima) em foco.',
  },
  'truthwatcher::future-sight-enlightened-key': {
    nome: 'Visão do Futuro',
    nomeEn: 'Future Sight (Enlightened Key)',
    fonte: 'Iluminado · Sentinela da Verdade',
    fonteEn: 'Enlightened · Truthwatcher',
    preRequisitos: 'Vínculo com um espreno de névoa Iluminado',
    ativacao: 'especial',
    descricao:
      'Ganho de graça ao formar o vínculo. Depois de um descanso ou no início de uma cena, pode pedir ao Mestre uma visão do futuro; se houver evento próximo relevante, a recebe (em geral do dia seguinte). O Mestre pode exigir teste de Dedução para entendê-la e pode gastar uma Complicação para decidir em segredo se a informação é verdadeira.',
  },
  'truthwatcher::glimpse-the-future': {
    nome: 'Vislumbrar o Futuro',
    nomeEn: 'Glimpse the Future',
    fonte: 'Iluminado · Sentinela da Verdade',
    fonteEn: 'Enlightened · Truthwatcher',
    preRequisitos: 'Dizer o Primeiro Ideal; talento-chave Visão do Futuro',
    ativacao: 'especial',
    descricao:
      'Uma vez por rodada, após rolar um teste, pode gastar 1 ou mais de Investidura para rerrolar essa quantidade de dados dele (o novo resultado vale). Enquanto estiver presente ou influenciando fortemente um evento, nenhum inimigo tem visões dele (passado ou futuro).',
  },
  'truthwatcher::alter-fortune': {
    nome: 'Alterar Fortuna',
    nomeEn: 'Alter Fortune',
    fonte: 'Iluminado · Sentinela da Verdade',
    fonteEn: 'Enlightened · Truthwatcher',
    preRequisitos: 'Talento Vislumbrar o Futuro',
    ativacao: 'reacao',
    descricao:
      'Ao fim de um descanso longo, rola 1 + patamar d20 e anota os resultados. Quando um inimigo ou aliado voluntário que sinta faz um teste, usa uma reação para trocar o d20 por um número anotado (mesmo após vantagens, antes dos efeitos). Cada número se perde ao ser usado ou no próximo descanso longo.',
  },
  'truthwatcher::search-the-past': {
    nome: 'Procurar no Passado',
    nomeEn: 'Search the Past',
    fonte: 'Iluminado · Sentinela da Verdade',
    fonteEn: 'Enlightened · Truthwatcher',
    preRequisitos: 'Dizer o Primeiro Ideal; talento-chave Visão do Futuro',
    ativacao: 'especial',
    descricao:
      'Depois de um descanso longo, escolhe um evento passado conhecido e testa Saber. CD por tempo decorrido: 1 dia 10 · 10 dias 13 · 50 dias 16 · 1 ano 19 · 10 anos 22 · 100 anos 25 · 1.000 anos 30 · 10.000 anos 35; −10 se viveu o evento (ou o viu em visão). Em sucesso, vive 10 minutos do evento como observador passivo (invisível, sem poder alterá-lo); se já o viveu, escolhe outro ponto dentro dele.',
  },
  'truthwatcher::vision-void': {
    nome: 'Visão do Vazio',
    nomeEn: 'Vision Void',
    fonte: 'Iluminado · Sentinela da Verdade',
    fonteEn: 'Enlightened · Truthwatcher',
    preRequisitos: 'Talento Vislumbrar o Futuro ou Procurar no Passado',
    ativacao: 'sempre',
    descricao:
      'O personagem e cada aliado dentro da distância do vínculo ficam imunes a efeitos inimigos que os façam rerrolar ou substituir o resultado de um dado que rolaram.',
  },
}
