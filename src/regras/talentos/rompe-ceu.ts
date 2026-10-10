/* arquivo: rompe-ceu.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Trilha Radiante: Rompe-céu — transcricao/05-trilhas-radiantes/10-rompe-ceu.md ──
export const TALENTOS_ROMPE_CEU: Record<string, EntradaTalento> = {
  'skybreaker::first-ideal-skybreaker-key': {
    nome: 'Primeiro Ideal',
    nomeEn: 'First Ideal (Skybreaker Key)',
    fonte: 'Talento-chave · Rompe-céu',
    fonteEn: 'Key talent · Skybreaker',
    preRequisitos: 'Nível 2+',
    ativacao: 'especial',
    descricao:
      'Dá acesso à Investidura (máximo inicial 2 + o maior entre Consciência e Presença) e às ações Inspirar Luz das Tempestades, Aprimorar e Restaurar. Cria o objetivo “Dizer o Primeiro Ideal”; ao cumpri-lo: Potencializado até o fim da cena, fluxos Divisão e Gravitação e 1 graduação em cada perícia de fluxo.',
  },
  'skybreaker::second-ideal-skybreaker': {
    nome: 'Segundo Ideal',
    nomeEn: 'Second Ideal (Skybreaker)',
    fonte: 'Vínculo com Grão-espreno · Rompe-céu',
    fonteEn: 'Highspren Bond · Skybreaker',
    preRequisitos: 'Nível 4+; Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Cria o objetivo “Dizer o Segundo Ideal”; ao cumpri-lo: Potencializado até o fim da cena. Com 1+ de Investidura, Aprimorar vira ação livre e não gasta Investidura (nem para manter o efeito).',
  },
  'skybreaker::third-ideal-skybreaker': {
    nome: 'Terceiro Ideal',
    nomeEn: 'Third Ideal (Skybreaker)',
    fonte: 'Vínculo com Grão-espreno · Rompe-céu',
    fonteEn: 'Highspren Bond · Skybreaker',
    preRequisitos: 'Nível 8+; Dizer o Segundo Ideal',
    ativacao: 'especial',
    descricao:
      'Cria o objetivo “Dizer o Terceiro Ideal”; ao cumpri-lo: Potencializado até o fim da cena e pode convocar o espreno como Espada Fractal Radiante.',
  },
  'skybreaker::fourth-ideal-skybreaker': {
    nome: 'Quarto Ideal',
    nomeEn: 'Fourth Ideal (Skybreaker)',
    fonte: 'Vínculo com Grão-espreno · Rompe-céu',
    fonteEn: 'Highspren Bond · Skybreaker',
    preRequisitos: 'Nível 13+; Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'O Quarto Ideal é dito de imediato, com uma missão escolhida pelo personagem. Cria o objetivo “Completar Missão do Quarto Ideal”; ao cumpri-lo: Potencializado até o fim da cena e pode convocar um enxame de esprenos de sorte como Armadura Fractal Radiante.',
  },
  'skybreaker::deepened-bond': {
    nome: 'Vínculo Aprofundado',
    nomeEn: 'Deepened Bond',
    fonte: 'Vínculo com Grão-espreno · Rompe-céu',
    fonteEn: 'Highspren Bond · Skybreaker',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'sempre',
    descricao:
      'A distância do vínculo com o espreno sobe de 9 para 30 metros. Dar uma tarefa ao espreno custa 1 de foco a menos (mínimo 1).',
  },
  'skybreaker::take-squire-skybreaker': {
    nome: 'Obter Escudeiro',
    nomeEn: 'Take Squire (Skybreaker)',
    fonte: 'Vínculo com Grão-espreno · Rompe-céu',
    fonteEn: 'Highspren Bond · Skybreaker',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Após um descanso longo, escolhe como escudeiro um voluntário sapiente, conhecido há 1+ sessão e sem vínculo com espreno Radiante, e decide quais dos seus fluxos (ambos, um ou nenhum) ele recebe. Máximo de escudeiros igual ao número do Ideal atual; para trocar, dispensa um antes.',
  },
  'skybreaker::invested': {
    nome: 'Investido',
    nomeEn: 'Invested',
    fonte: 'Vínculo com Grão-espreno · Rompe-céu',
    fonteEn: 'Highspren Bond · Skybreaker',
    preRequisitos: 'Talento Destruição Elevada',
    ativacao: 'sempre',
    descricao:
      'A Investidura máxima aumenta em um valor igual ao patamar; sobe de novo a cada aumento de patamar.',
  },
  'skybreaker::wound-regeneration': {
    nome: 'Restauração de Ferida',
    nomeEn: 'Wound Regeneration',
    fonte: 'Vínculo com Grão-espreno · Rompe-céu',
    fonteEn: 'Highspren Bond · Skybreaker',
    preRequisitos: 'Talento Investido',
    ativacao: 'especial',
    descricao:
      'Ao usar a ação livre Restaurar, pode gastar Investidura para curar na hora uma lesão à escolha: 2 pontos para lesão temporária, 3 para permanente.',
  },
  'skybreaker::soaring-destruction': {
    nome: 'Destruição Elevada',
    nomeEn: 'Soaring Destruction',
    fonte: 'Vínculo com Grão-espreno · Rompe-céu',
    fonteEn: 'Highspren Bond · Skybreaker',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'livre',
    custo: { foco: 1 },
    descricao:
      'Depois de Mover mantendo uma Projeção Básica de Gravitação em si, gasta 1 de foco para ganhar uma ação extra que só serve para Divisão ou um talento de Divisão.',
  },
}
