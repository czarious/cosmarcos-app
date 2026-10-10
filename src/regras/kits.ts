/* arquivo: kits.ts */
// Conjuntos iniciais (livro, Cap. 7 — passo 6 da criação). Lista de itens em palavras do app;
// nomes de arma/armadura batem com armas.ts e armaduras.ts. Chave = valor de CONJUNTO_INICIAL.

export type KitCatalogo = {
  nome: string
  /** Chave em inglês do de-para (CONJUNTO_INICIAL). */
  nomeEn: string
  /** Armas do kit; "ou" marca escolha. Vazio: nenhuma. */
  armas: string[]
  /** Armadura(s) do kit (nome de armaduras.ts; " e " junta duas). Ausente: nenhuma. */
  armadura?: string
  /** Itens; "N x" antes do nome é a quantidade. Nomes da tabela de equipamentos quando existem lá. */
  equipamentos: string[]
  /** Dados de marcos na algibeira ("3d12"). Ausente: sem esferas. */
  esferas?: string
  /** Efeitos de ficha e conexões. */
  extras: string[]
}

export const KITS: Record<string, KitCatalogo> = {
  'Acadêmico': {
    nome: 'Acadêmico', nomeEn: 'Academic',
    armas: ['Faca, Funda ou Cajado (uma)'],
    armadura: 'Uniforme',
    equipamentos: [
      'Mochila*', 'Vestes (comum)', 'Caneta tinteiro*', 'Tinta (garrafa com 20 gramas)*',
      '10 x Papel ou pergaminho (1 folha)*', '3 x Frasco (vidro)*', 'Cera (1 bloco)*',
      'Livro (de referência) sobre um tópico à escolha (aprovado pelo Mestre)', 'Veneno (fraco, 1 dose)',
    ],
    esferas: '3d12',
    extras: ['Especialidade em Literatura (se já tem, uma cultural ou de utilidade à escolha); não conta entre as escolhidas na criação'],
  },
  'Artesão': {
    nome: 'Artesão', nomeEn: 'Artisan',
    armas: ['Martelo ou uma arma leve (uma)'],
    armadura: 'Couro',
    equipamentos: [
      'Baú*', 'Vestes (comum)', 'Suprimentos Cirúrgicos', 'Antisséptico (fraco, 5 doses)', 'Caneta tinteiro*',
      'Tinta (garrafa com 20 gramas)*', '5 x Papel ou pergaminho (1 folha)*', '5 x Vela', 'Pederneira e Isqueiro',
      '3 x Garrafa (vidro)*', 'Diapasão', 'Instrumento Musical à escolha', 'Balança',
    ],
    esferas: '4d8',
    extras: [],
  },
  'Cortesão': {
    nome: 'Cortesão', nomeEn: 'Courtier',
    armas: ['Espada Lateral, Montante, Espada Longa ou Arco Longo (uma)'],
    equipamentos: ['Álcool (garrafa) de vinho violeta', 'Vestes (boas)'],
    esferas: '4d20',
    extras: ['Apoiado por um patrono da casa nobre: acomodações e certo padrão de vida (conexão)'],
  },
  'Militar': {
    nome: 'Militar', nomeEn: 'Military',
    armas: ['Duas armas não especiais'],
    armadura: 'Uniforme e Cota de Malha',
    equipamentos: ['Mochila*', 'Vestes (comum)', 'Cantil*', 'Pederneira e Isqueiro', 'Pedra de Amolar*', 'Cobertor*', '10 x Comida (ração, 1 dia)'],
    esferas: '2d6',
    extras: [],
  },
  'Prisioneiro': {
    nome: 'Prisioneiro', nomeEn: 'Prisoner',
    armas: [],
    equipamentos: ['Grilhões', 'Vestes (farrapos)'],
    extras: [
      'Atraiu um espreno Radiante: combinar o tipo com o Mestre e anotar em Conexões',
      'Se escolher depois o talento-chave da trilha Radiante desse espreno, marca 2 caixas do objetivo de "Jurar o Primeiro Ideal"',
    ],
  },
  'Submundo': {
    nome: 'Submundo', nomeEn: 'Underworld',
    armas: ['Duas armas leves'],
    armadura: 'Couro',
    equipamentos: [
      'Mochila*', 'Vestes (comum)', 'Álcool (garrafa) de cachaça de papaguampas', 'Pé-de-cabra', 'Gazuas',
      'Corda (15 metros)', 'Pederneira e Isqueiro', 'Lanterna (óleo)', 'Óleo (1 frasco)', '5 x Comida (rua, 1 dia)',
    ],
    esferas: '1d20',
    extras: [],
  },
}

export function kitPorNome(nome: string): KitCatalogo | undefined {
  return KITS[nome]
}
