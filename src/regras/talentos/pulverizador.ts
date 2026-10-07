/* arquivo: pulverizador.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Trilha Radiante: Pulverizador — transcricao/05-trilhas-radiantes/09-pulverizador.md ──
export const TALENTOS_PULVERIZADOR: Record<string, EntradaTalento> = {
  'dustbringer::first-ideal-dustbringer-key': {
    nome: 'Primeiro Ideal',
    nomeEn: 'First Ideal (Dustbringer Key)',
    fonte: 'Talento-chave · Pulverizador',
    fonteEn: 'Key talent · Dustbringer',
    preRequisitos: 'Nível 2+',
    ativacao: 'especial',
    descricao:
      'Dá acesso à Investidura (máximo inicial 2 + o maior entre Consciência e Presença) e às ações Inspirar Luz das Tempestades, Aprimorar e Restaurar. Cria o objetivo "Dizer o Primeiro Ideal"; ao cumpri-lo: fica Potencializado até o fim da cena e ganha os fluxos Abrasão e Divisão, com 1 graduação em cada perícia de fluxo.',
  },
  'dustbringer::deepened-bond': {
    nome: 'Vínculo Aprofundado',
    nomeEn: 'Deepened Bond',
    fonte: 'Vínculo com Espreno de Cinzas · Pulverizador',
    fonteEn: 'Ashspren Bond · Dustbringer',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'sempre',
    descricao:
      'A distância do vínculo com o espreno sobe de 9 para 30 metros. Dar uma tarefa ao espreno custa 1 ponto de foco a menos (mínimo 1).',
  },
  'dustbringer::fourth-ideal-dustbringer': {
    nome: 'Quarto Ideal',
    nomeEn: 'Fourth Ideal (Dustbringer)',
    fonte: 'Vínculo com Espreno de Cinzas · Pulverizador',
    fonteEn: 'Ashspren Bond · Dustbringer',
    preRequisitos: 'Nível 13+; Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Cria o objetivo "Dizer o Quarto Ideal"; ao cumpri-lo: fica Potencializado até o fim da cena e pode convocar um enxame de esprenos de chamas como Armadura Fractal Radiante.',
  },
  'dustbringer::searing-dust-storm': {
    nome: 'Tempestade de Poeira Ardente',
    nomeEn: 'Searing Dust Storm',
    fonte: 'Vínculo com Espreno de Cinzas · Pulverizador',
    fonteEn: 'Ashspren Bond · Dustbringer',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ao usar Mover por superfície sólida, gasta 1 ou mais de Investidura para levantar uma nuvem de poeira obscurecente nos espaços em que entrar ou sair; dura tantas rodadas quanto a Investidura gasta (ou até vento forte). Na primeira vez por rodada que um inimigo na nuvem sofre dano, o dano aumenta pelas suas graduações em Disciplina.',
  },
  'dustbringer::invested': {
    nome: 'Investido',
    nomeEn: 'Invested',
    fonte: 'Vínculo com Espreno de Cinzas · Pulverizador',
    fonteEn: 'Ashspren Bond · Dustbringer',
    preRequisitos: 'Talento Tempestade de Poeira Ardente',
    ativacao: 'sempre',
    descricao:
      'O máximo de Investidura aumenta em um valor igual ao patamar, e continua subindo quando o patamar sobe.',
  },
  'dustbringer::second-ideal-dustbringer': {
    nome: 'Segundo Ideal',
    nomeEn: 'Second Ideal (Dustbringer)',
    fonte: 'Vínculo com Espreno de Cinzas · Pulverizador',
    fonteEn: 'Ashspren Bond · Dustbringer',
    preRequisitos: 'Nível 4+; Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Cria o objetivo "Dizer o Segundo Ideal"; ao cumpri-lo: fica Potencializado até o fim da cena. Enquanto tiver 1+ de Investidura, usa Aprimorar como ação livre, sem gastar Investidura para usar ou manter o efeito.',
  },
  'dustbringer::take-squire-dustbringer': {
    nome: 'Obter Escudeiro',
    nomeEn: 'Take Squire (Dustbringer)',
    fonte: 'Vínculo com Espreno de Cinzas · Pulverizador',
    fonteEn: 'Ashspren Bond · Dustbringer',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Depois de um descanso longo, escolhe um voluntário sapiente, conhecido há ao menos 1 sessão e sem vínculo com espreno Radiante, como escudeiro, concedendo-lhe ambos os fluxos, um ou nenhum. O limite de escudeiros é o número do Ideal atual; no limite, é preciso dispensar um antes de escolher outro.',
  },
  'dustbringer::third-ideal-dustbringer': {
    nome: 'Terceiro Ideal',
    nomeEn: 'Third Ideal (Dustbringer)',
    fonte: 'Vínculo com Espreno de Cinzas · Pulverizador',
    fonteEn: 'Ashspren Bond · Dustbringer',
    preRequisitos: 'Nível 8+; Dizer o Segundo Ideal',
    ativacao: 'especial',
    descricao:
      'Cria o objetivo "Dizer o Terceiro Ideal"; ao cumpri-lo: fica Potencializado até o fim da cena e pode convocar o espreno como Espada Fractal Radiante.',
  },
  'dustbringer::wound-regeneration': {
    nome: 'Restauração de Ferida',
    nomeEn: 'Wound Regeneration',
    fonte: 'Vínculo com Espreno de Cinzas · Pulverizador',
    fonteEn: 'Ashspren Bond · Dustbringer',
    preRequisitos: 'Talento Investido',
    ativacao: 'especial',
    descricao:
      'Ao usar a ação livre Restaurar, pode gastar Investidura para curar uma lesão na hora: 2 pontos para lesão temporária, 3 para permanente.',
  },
}
