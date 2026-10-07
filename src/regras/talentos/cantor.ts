/* arquivo: cantor.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 2 · Ancestralidade Cantor: árvore de talentos — transcricao/02-origens/02-ancestralidade.md ──
export const TALENTOS_CANTOR: Record<string, EntradaTalento> = {
  'singer::change-form': {
    nome: 'Mudar Forma',
    nomeEn: 'Change Form',
    fonte: 'Talento-chave · Cantor',
    fonteEn: 'Key talent · Singer',
    preRequisitos: 'ancestralidade Cantor',
    ativacao: '3acoes',
    descricao:
      'Começa com duas formas: Opaca (sem benefício de forma; passa por "parshemano" na maioria das sociedades humanas) e Copulatória (sem benefício mecânico). Ao ar livre durante uma grantormenta, ative para voltar à forma opaca ou para colocar um espreno na gema-coração e assumir a copulatória ou outra forma já desbloqueada; o espreno vinculado define a forma (o MJ pode exigir interpretação ou teste se o espreno for difícil de achar). Enquanto na forma, ganha suas ações, aumentos de estatística e outros efeitos (mesmo acima do máximo normal) até trocar de forma. Só uma forma por vez.',
  },
  'singer::forms-of-finesse': {
    nome: 'Formas de Acuidade',
    nomeEn: 'Forms of Finesse',
    fonte: 'Cantor',
    fonteEn: 'Singer',
    preRequisitos: 'talento-chave Mudar Forma',
    ativacao: 'sempre',
    descricao:
      'Libera duas formas. Artística (espreno de criação): Consciência +1, especialidades de utilidade em Pintura e Música, vantagem em testes de Manufatura e de entretenimento (cantar, dançar). Hábil (espreno de vento): Velocidade +1; ao assumir, foco máximo e atual sobem 2, e ao trocar de forma ambos caem 2.',
  },
  'singer::forms-of-resolve': {
    nome: 'Formas de Determinação',
    nomeEn: 'Forms of Resolve',
    fonte: 'Cantor',
    fonteEn: 'Singer',
    preRequisitos: 'talento-chave Mudar Forma',
    ativacao: 'sempre',
    descricao:
      'Libera duas formas. Bélica (espreno de dor): Força +1, deflexão +1 (não acumula com armadura; use o maior), e ao se mover pode saltar na horizontal até a taxa de movimento ou na vertical até metade dela sem teste de Atletismo. Laboral (espreno de gravidade): Vontade +1, ignora os efeitos da condição Exausto e pode se passar por "parshemano" na maioria das sociedades humanas (pode ser notado se fizer algo suspeito).',
  },
  'singer::forms-of-wisdom': {
    nome: 'Formas de Sabedoria',
    nomeEn: 'Forms of Wisdom',
    fonte: 'Cantor',
    fonteEn: 'Singer',
    preRequisitos: 'talento-chave Mudar Forma',
    ativacao: 'sempre',
    descricao:
      'Libera duas formas. Mediadora (espreno de conexão): Presença +1 e não gasta foco para usar a reação Auxiliar. Erudita (espreno de lógica): Intelecto +1; ao assumir, escolhe uma especialidade cultural ou de utilidade que não tenha e uma perícia cognitiva que não seja de fluxo, ganhando temporariamente a especialidade e +1 graduação na perícia. Com o talento Erudição, isso conta como concedido por Erudição (inclusive para redistribuir), mas não dá para escolher a mesma perícia nos dois.',
  },
  'singer::ambitious-mind': {
    nome: 'Mente Ambiciosa',
    nomeEn: 'Ambitious Mind',
    fonte: 'Cantor',
    fonteEn: 'Singer',
    preRequisitos: 'Disciplina 3+; talento Formas de Acuidade, Formas de Determinação ou Formas de Sabedoria',
    ativacao: 'sempre',
    descricao:
      'Defesa Cognitiva +2. Ao adquirir depois um talento de formas de poder, pode usar Mudar Forma para atrair um espreno de vazio, pelas mesmas regras das outras formas. Enquanto vinculado a um espreno de vazio, uma vez por dia, ao obter uma Complicação em um teste, precisa passar num teste de Disciplina (CD 15) ou fica Atordoado até o fim do próprio próximo turno; sucesso automático se já jurou o Primeiro Ideal de uma ordem Radiante.',
  },
  'singer::forms-of-destruction': {
    nome: 'Formas de Destruição',
    nomeEn: 'Forms of Destruction',
    fonte: 'Cantor',
    fonteEn: 'Singer',
    preRequisitos: 'talento Mente Ambiciosa',
    ativacao: 'sempre',
    descricao:
      'Libera duas formas de poder (Régias). Horrenda (espreno de insensibilidade): Força +2, deflexão +2 (não acumula com armadura); ao sofrer Golpe Reativo, pode usar a reação para tentar Agarrar o alvo em vez de atacar (ainda gasta 1 foco). Tempestuosa (espreno de tempestade): Força +1, Velocidade +1, deflexão +1 (não acumula com armadura); ação Liberar Relâmpago (▶▶, 1 foco ou Investidura): ataque à distância de Disciplina, alcance 18 m, contra defesa Física, 2d8 de dano energético e, no acerto, alvo Desorientado até o fim do próprio próximo turno. O MJ pode aumentar as apostas se a forma foi assumida há pouco. Dano: 4 graduações em Disciplina 2d10; 5 graduações 2d12.',
  },
  'singer::forms-of-expansion': {
    nome: 'Formas de Expansão',
    nomeEn: 'Forms of Expansion',
    fonte: 'Cantor',
    fonteEn: 'Singer',
    preRequisitos: 'talento Mente Ambiciosa',
    ativacao: 'sempre',
    descricao:
      'Libera duas formas de poder (Régias). Emissária (espreno de zelo): Intelecto +1, Presença +1, fala, lê, escreve e entende todas as línguas, vantagem em Intuição para interpretar desejos e intenções alheias. Mensageira (espreno de celeridade): Velocidade +2, ignora os efeitos da condição Lento e, em testes de Agilidade, Furtividade ou Ladinagem, pode gastar 1 foco para ganhar vantagem.',
  },
  'singer::forms-of-mystery': {
    nome: 'Formas de Mistério',
    nomeEn: 'Forms of Mystery',
    fonte: 'Cantor',
    fonteEn: 'Singer',
    preRequisitos: 'talento Mente Ambiciosa',
    ativacao: 'sempre',
    descricao:
      'Libera duas formas de poder (Régias). Decadente (espreno de decadência): Vontade +2 e Toque Decadente (★): antes de um personagem ao alcance recuperar vida ou foco, gaste 1 foco ou Investidura para impedir; ele não recupera, e recursos já gastos continuam gastos. Noturna (espreno de noite): Consciência +1, Intelecto +1; ao assumir, foco máximo e atual sobem 2 (caem 2 ao trocar de forma); Premonições Intervenientes (↻): no início da sessão role dois d20 e anote; quando inimigo ou aliado voluntário que você sinta fizer um teste, substitua o d20 por um anotado (após ver o dado, antes de vantagens, sempre antes de resolver efeitos); o número se perde ao usar ou no fim da sessão; Premonições Esporádicas (★): o MJ pode dar vislumbres vagos do futuro em momentos imprevisíveis.',
  },
}
