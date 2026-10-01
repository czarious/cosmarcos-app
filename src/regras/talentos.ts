/* arquivo: talentos.ts */
import type { Ativacao, Pericia } from '../tipos/personagem'

/**
 * CATÁLOGO DE TALENTOS — a regra em si, universal (vale pra qualquer
 * personagem com o talento, não só o Eccho). O Shards só manda
 * `{id, nome, origem, chave}` (ver tipos/personagem.ts); ativação e efeito
 * são REGRA, não dado — premissas.md → "A ficha inteligente é o objetivo".
 *
 * Fonte: transcrição do Guia de Regras PT-BR (referencia/livro/transcricao/,
 * não versionada). Texto aqui é PARÁFRASE própria, nunca cópia do livro —
 * este arquivo é público no repo (premissas.md → "GitHub Pages, repositório público"), diferente da transcrição.
 *
 * Organizado em blocos por TRILHA de origem — mesma divisão da transcrição
 * (04-trilhas-heroicas/, 05-trilhas-radiantes/). Cresce um bloco por vez.
 */

/**
 * VAGA — uma escolha em aberto que o talento concede (ex.: Erudição pede
 * 1 especialidade + 2 perícias). Diferente da descrição (fixa, universal),
 * a vaga é o que o JOGADOR escolhe — a resposta mora no estado vivo do app
 * (usePersonagem), não aqui. Ver regras/especialidades.ts pro valor inicial.
 */
export type TipoVaga = 'pericia' | 'especialidade'

export type VagaTalento = {
  tipo: TipoVaga
  indice: number // 0, 1... quando o talento pede mais de uma vaga do mesmo tipo
  rotulo: string
  rotuloEn: string
  /** Só pra vaga tipo 'pericia' — filtra as opções do dropdown pela regra do talento. */
  filtroPericia?: (p: Pericia) => boolean
}

/** A escolha atual de UMA vaga — é isto que vive no estado (usePersonagem). */
export type EscolhaVaga = {
  talentoId: string
  tipo: TipoVaga
  indice: number
  /** id de Pericia (tipo 'pericia') ou nome de Especializacao (tipo 'especialidade'). */
  valor: string | undefined
}

export function chaveVaga(talentoId: string, tipo: TipoVaga, indice: number): string {
  return `${talentoId}#${tipo}#${indice}`
}

export type EntradaTalento = {
  nome: string // canônico PT-BR do livro
  nomeEn: string // como o Shards escreve (dicionário → "Trilhas Heroicas", "Ordens Radiantes")
  fonte: string // trilha/especialização, pra exibir
  fonteEn: string
  preRequisitos: string
  ativacao: Ativacao
  descricao: string
  /** Presente só nos talentos com escolha em aberto (ex.: Erudição). */
  vagas?: VagaTalento[]
}

// O símbolo de exibição de cada ativação mudou de casa: é rótulo de tela, não
// catálogo de talento. Mora em `variaveis.ts` → SIMBOLO_ATIVACAO.

// ── Cap. 4 · Trilha heroica: Erudito ──────────────────────────────
const TALENTOS_ERUDITO: Record<string, EntradaTalento> = {
  'scholar::key::erudition': {
    nome: 'Erudição',
    nomeEn: 'Erudition',
    fonte: 'Talento-chave · Erudito',
    fonteEn: 'Key talent · Scholar',
    preRequisitos: 'nenhum',
    ativacao: 'especial',
    descricao:
      'Ao adquirir, escolhe uma especialidade cultural ou de utilidade que ainda não tenha, e duas perícias cognitivas que não sejam de fluxo. Passa a contar como se tivesse a especialidade escolhida, e ganha +1 graduação em cada uma das duas perícias — mesmo acima do teto normal de graduação do patamar (é uma exceção explícita da regra de teto). Especialidade e graduações são temporárias: depois de um descanso longo com acesso a uma biblioteca, podem ser redistribuídas.',
    vagas: [
      { tipo: 'especialidade', indice: 0, rotulo: 'Especialidade concedida (cultural ou utilidade)', rotuloEn: 'Granted expertise (cultural or utility)' },
      {
        tipo: 'pericia',
        indice: 0,
        rotulo: 'Perícia bônus 1 (cognitiva)',
        rotuloEn: 'Bonus skill 1 (cognitive)',
        filtroPericia: (p) => p.atributo === 'intelecto' || p.atributo === 'vontade',
      },
      {
        tipo: 'pericia',
        indice: 1,
        rotulo: 'Perícia bônus 2 (cognitiva)',
        rotuloEn: 'Bonus skill 2 (cognitive)',
        filtroPericia: (p) => p.atributo === 'intelecto' || p.atributo === 'vontade',
      },
    ],
  },
  'scholar::artifabrian::efficient-engineer': {
    nome: 'Engenheiro Eficiente',
    nomeEn: 'Efficient Engineer',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'Manufatura 1+; talento-chave Erudição',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, ganha uma especialidade de utilidade (Manufatura de Arma, Armadura ou Equipamento) e um item à escolha (dorial amplificador, dorial entorpecente, ou um par de telepenas com bracelete de emoção). Ao manufaturar um item ou inventar um fabrial, o intervalo de Oportunidade desses testes aumenta em 2 pontos, e o custo de matéria-prima cai pela metade.',
  },
  'scholar::artifabrian::prized-acquisition': {
    nome: 'Aquisição Valiosa',
    nomeEn: 'Prized Acquisition',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'talento-chave Erudição',
    ativacao: 'especial',
    descricao:
      'Ao adquirir, ganha uma especialidade de perito em Manufatura de Fabrial e uma gema especialmente lapidada, usada como matéria-prima para um fabrial — ela vale como a gema de um fabrial único do patamar atual do personagem. Na primeira tentativa com essa gema, o tempo normal para atrair um espreno e manufaturar é ignorado. A gema não pode ser vendida nem trocada; se perdida, pode ser substituída após um descanso longo (a critério do MJ). Durante o recesso, é possível desfazer o fabrial pra recuperar a gema e reaproveitá-la.',
  },
  'scholar::artifabrian::fine-handiwork': {
    nome: 'Trabalho Manual Refinado',
    nomeEn: 'Fine Handiwork',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'talento Engenheiro Eficiente',
    ativacao: 'especial',
    descricao:
      'Ao manufaturar um item ou inventar um fabrial, pode gastar apenas uma melhoria (em vez de duas) para aplicar uma característica avançada. Só se beneficia deste talento uma vez por item.',
  },
  'scholar::artifabrian::deep-study': {
    nome: 'Estudo Aprofundado',
    nomeEn: 'Deep Study',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'talento Engenheiro Eficiente',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, seu talento Erudição concede uma especialidade adicional (cultural ou utilidade) e duas perícias cognitivas adicionais que não sejam de fluxo. Essas especialidades e perícias podem ser redistribuídas do mesmo jeito que as concedidas por Erudição.',
  },
  'scholar::artifabrian::experimental-creation': {
    nome: 'Criação Experimental',
    nomeEn: 'Experimental Creation',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'talento Trabalho Manual Refinado',
    ativacao: 'especial',
    descricao:
      'Ao manufaturar um item ou inventar um fabrial, aumenta o intervalo de Oportunidade em 1 ponto e reduz o tempo de manufatura pela metade. Adicionalmente, pode optar por não usar um descanso longo normalmente e gastar esse tempo em um fabrial de Aquisição Valiosa, reconfigurado para um fabrial diferente do mesmo patamar ou inferior — ignorando matéria-prima e tempo de atração.',
  },
  'scholar::artifabrian::inventive-project': {
    nome: 'Projeto Inventivo',
    nomeEn: 'Inventive Project',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'Manufatura 2+; talento Aquisição Valiosa',
    ativacao: 'sempre',
    descricao:
      'Ao manufaturar um fabrial usando a gema de Aquisição Valiosa, pode selecionar um efeito 1 patamar acima do patamar atualmente manufaturado, refletindo o profundo conhecimento personalizado da pedra.',
  },
  'scholar::artifabrian::overcharge': {
    nome: 'Sobrecarregar',
    nomeEn: 'Overcharge',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'Manufatura 3+; talento Aquisição Valiosa',
    ativacao: 'especial',
    descricao:
      'Uma vez por turno, ao fazer um teste de ataque com um fabrial, pode gastar uma Oportunidade (◎) desse teste para Golpear de novo com o mesmo fabrial como ação livre (▷) no mesmo turno; esse Golpe não conta no limite de Golpes que as mãos permitem. Em troca, o MJ pode gastar uma Complicação (✸) desse teste para dar ao fabrial um inconveniente novo, que só sai quando você passar num teste de Manufatura CD 15 feito como ação (▶).',
  },
  'scholar::artifabrian::fill-with-details': {
    nome: 'Encher de Detalhes',
    nomeEn: 'Fill With Details',
    fonte: 'Erudito · Artifabriano',
    fonteEn: 'Scholar · Artifabrian',
    preRequisitos: 'Saber 3+; talento Criação Experimental',
    ativacao: 'especial',
    descricao:
      'Ao falar com autoridade sobre um assunto de paixão, pode gastar 2 pontos de Foco para fazer um teste Cognitivo ou Espiritual usando seu modificador de Saber em vez do modificador de perícia usual, refletindo conhecimento profundo e inquestionável.',
  },
}

// ── Cap. 5 · Trilha Radiante: Alternauta ──────────────────────────
const TALENTOS_ALTERNAUTA: Record<string, EntradaTalento> = {
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
  'elsecaller::perspicacity': { // id do Shards a confirmar
    nome: 'Perspicácia do Alternauta',
    nomeEn: 'Elsecaller Perspicacity',
    fonte: 'Alternauta · Talentos avançados',
    fonteEn: 'Elsecaller · Advanced talents',
    preRequisitos: 'Transformação 2+; Transporte 2+; Dizer o Primeiro Ideal',
    ativacao: 'sempre',
    descricao:
      'Enquanto tiver 1 ponto ou mais de Investidura, ganha vantagem em testes de Dedução, testes feitos como reação e testes para reunir informações ao observar entre o Reino Físico e Cognitivo simultaneamente, refletindo raciocínio perspicaz e observação apurada.',
  },
  'elsecaller::wound-restoration': { // id do Shards a confirmar
    nome: 'Restauração de Ferida',
    nomeEn: 'Wound Restoration',
    fonte: 'Alternauta · Talentos avançados',
    fonteEn: 'Elsecaller · Advanced talents',
    preRequisitos: 'Talento Investido',
    ativacao: 'especial',
    descricao:
      'Ao usar a ação livre Restaurar, pode gastar Investidura para se recuperar instantaneamente de uma lesão à escolha: 2 pontos para lesão temporária, ou 3 pontos para lesão permanente, canalizando Luz das Tempestades para cura rápida.',
  },
  'elsecaller::second-ideal': { // id do Shards a confirmar
    nome: 'Segundo Ideal',
    nomeEn: 'Second Ideal',
    fonte: 'Alternauta · Ideais',
    fonteEn: 'Elsecaller · Ideals',
    preRequisitos: 'Nível 4+; Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Segundo Ideal". Ao completá-lo, fica Potencializado até o fim da cena e sua ação Aprimorar se torna mais poderosa — enquanto tiver 1 ponto de Investidura, pode usar Aprimorar como ação livre e não precisa gastar Investidura ou manter seu efeito.',
  },
  'elsecaller::third-ideal': { // id do Shards a confirmar
    nome: 'Terceiro Ideal',
    nomeEn: 'Third Ideal',
    fonte: 'Alternauta · Ideais',
    fonteEn: 'Elsecaller · Ideals',
    preRequisitos: 'Nível 8+; Dizer o Segundo Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Terceiro Ideal". Ao completá-lo, fica Potencializado até o fim da cena e pode convocar seu espreno como uma Espada Fractal Radiante (veja capítulo 7), abrindo novas possibilidades ofensivas.',
  },
  'elsecaller::deepened-bond': { // id do Shards a confirmar
    nome: 'Vínculo Aprofundado',
    nomeEn: 'Deepened Bond',
    fonte: 'Alternauta · Talentos avançados',
    fonteEn: 'Elsecaller · Advanced talents',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'sempre',
    descricao:
      'O laço de Nahel fica forte a ponto de o espreno se manifestar mais no Reino Físico: a distância do vínculo do espreno aumenta de 9 para 30 metros. Adicionalmente, ao gastar Foco para uma tarefa do espreno, custa 1 ponto a menos (mínimo 1 ponto).',
  },
  'elsecaller::invested': { // id do Shards a confirmar
    nome: 'Investido',
    nomeEn: 'Invested',
    fonte: 'Alternauta · Vínculo com Espreno de Tinta',
    fonteEn: 'Elsecaller · Ink Spren Bond',
    preRequisitos: 'Talento Perspicácia do Alternauta',
    ativacao: 'sempre',
    descricao:
      'Ao adquirir, seu valor máximo de Investidura aumenta em um número igual ao seu patamar. Quando o patamar aumentar, a Investidura Máxima também aumenta, refletindo maior domínio da Luz das Tempestades.',
  },
  'elsecaller::gain-squire': { // id do Shards a confirmar
    nome: 'Obter Escudeiro',
    nomeEn: 'Gain Squire',
    fonte: 'Alternauta · Vínculo com Espreno de Tinta',
    fonteEn: 'Elsecaller · Ink Spren Bond',
    preRequisitos: 'Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Depois de um descanso longo, escolhe um companheiro ou personagem jogador que possa influenciar para virar seu escudeiro: ele precisa ser voluntário e sapiente, você precisa conhecê-lo há pelo menos 1 sessão, e ele não pode ter vínculo com espreno Radiante. Você decide se ele recebe os seus dois fluxos, só um ou nenhum; ele ganha esses fluxos e os outros benefícios da seção "Escudeiros" (p. 128). O máximo de escudeiros é o número do seu Ideal atual (3 no Terceiro Ideal); com o máximo, dispensa um antes de escolher outro.',
  },
  'elsecaller::fourth-ideal': { // id do Shards a confirmar
    nome: 'Quarto Ideal',
    nomeEn: 'Fourth Ideal',
    fonte: 'Alternauta · Ideais',
    fonteEn: 'Elsecaller · Ideals',
    preRequisitos: 'Nível 13+; Dizer o Terceiro Ideal',
    ativacao: 'especial',
    descricao:
      'Ganha o objetivo "Dizer o Quarto Ideal", o caminho pra virar Cavaleiro Radiante completo. Ao completá-lo, fica Potencializado até o fim da cena e pode convocar um enxame de esprenos de lógica como Armadura Fractal Radiante (cap. 7, p. 255).',
  },
}

/** Catálogo consultado pela tela — junta todos os blocos acima. */
export const CATALOGO_TALENTOS: Record<string, EntradaTalento> = {
  ...TALENTOS_ERUDITO,
  ...TALENTOS_ALTERNAUTA,
}
