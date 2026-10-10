/* arquivo: tracos.ts */
// Traços de arma e de armadura (livro, Cap. 7). O `resumo` é em palavras do app,
// curto: diz o que a regra FAZ na mesa — o texto do livro não fica no repositório.

export type EntradaTraco = {
  /** Nome em português, como o tradutor produz (sem o valor entre colchetes). */
  nome: string
  nomeEn: string
  de: 'arma' | 'armadura' | 'ambos'
  resumo: string
}

export const TRACOS: Record<string, EntradaTraco> = {
  // --- Os 16 de TRACO_ARMA ---
  Arremesso: {
    nome: 'Arremesso', nomeEn: 'Thrown', de: 'arma',
    resumo: 'Pode ser arremessada como ataque à distância. O [curta/longa] dá as distâncias; além da curta há desvantagem. A arma arremessada fica perdida até ser recuperada.',
  },
  Carregada: {
    nome: 'Carregada', nomeEn: 'Loaded', de: 'arma',
    resumo: 'Guarda o número [X] de disparos. Cada ataque à distância gasta 1; recarregar tudo custa uma ação ▶. O Mestre pode usar uma Complicação para deixar só 1 disparo.',
  },
  Defensiva: {
    nome: 'Defensiva', nomeEn: 'Defensive', de: 'arma',
    resumo: 'Empunhada, permite usar a ação Proteger sem precisar de cobertura por perto.',
  },
  Desajeitada: {
    nome: 'Desajeitada', nomeEn: 'Cumbersome', de: 'ambos',
    resumo: 'Pede Força igual ou maior que [X]. Com menos, o personagem fica Lento e, na arma, ainda ataca com desvantagem; na armadura, tem desvantagem nos testes de Velocidade.',
  },
  Discreta: {
    nome: 'Discreta', nomeEn: 'Discreet', de: 'arma',
    resumo: 'Arma pouco notada, difícil de ser confiscada. Fora de combate dá vantagem pra escondê-la ou evitar que a tomem.',
  },
  'Duas Mãos': {
    nome: 'Duas Mãos', nomeEn: 'Two-Handed', de: 'arma',
    resumo: 'Precisa das duas mãos para empunhar e atacar.',
  },
  Frágil: {
    nome: 'Frágil', nomeEn: 'Fragile', de: 'arma',
    resumo: 'Ao atacar com ela, o Mestre pode gastar uma Complicação para quebrá-la depois do ataque.',
  },
  Ímpeto: {
    nome: 'Ímpeto', nomeEn: 'Momentum', de: 'arma',
    resumo: 'Vantagem no ataque se o personagem andou ao menos 3 m em linha reta rumo ao alvo antes, no mesmo turno.',
  },
  Indireta: {
    nome: 'Indireta', nomeEn: 'Indirect', de: 'arma',
    resumo: 'Permite atacar alvo sem linha de efeito, se ele for sentido e houver caminho livre para o disparo arquear. O alvo não ganha o benefício de Proteger contra ela.',
  },
  'Mão Inábil': {
    nome: 'Mão Inábil', nomeEn: 'Offhand', de: 'arma',
    resumo: 'Na mão inábil, um Golpear com ela custa 1 de foco em vez de 2.',
  },
  Mortal: {
    nome: 'Mortal', nomeEn: 'Deadly', de: 'arma',
    resumo: 'Ao acertar, o atacante pode gastar uma Oportunidade para o alvo sofrer uma lesão na hora.',
  },
  Perfurante: {
    nome: 'Perfurante', nomeEn: 'Pierce', de: 'arma',
    resumo: 'O dano da arma não é reduzido pela deflexão do alvo.',
  },
  Perigosa: {
    nome: 'Perigosa', nomeEn: 'Dangerous', de: 'ambos',
    resumo: 'Arma: o Mestre pode gastar uma Complicação para o golpe também atingir de raspão um aliado ao alcance. Armadura: uma Complicação faz o movimento ferir aliado a 1,5 m com 2d6 impactante.',
  },
  'Saque Rápido': {
    nome: 'Saque Rápido', nomeEn: 'Quickdraw', de: 'arma',
    resumo: 'Sacar a arma com Interagir vira ação livre (▷).',
  },
  Única: {
    nome: 'Única', nomeEn: 'Unique', de: 'ambos',
    resumo: 'Tem regra própria, descrita na descrição do item ou junto à palavra "Única" na tabela.',
  },
  Apresentável: {
    nome: 'Apresentável', nomeEn: 'Presentable', de: 'armadura',
    resumo: 'Discreta o bastante para usar em público fora de contexto militar, sem chamar atenção nem dar desvantagem em conversas.',
  },

  // --- Traços únicos das armas especiais ---
  'Invocar/Dispensar': {
    nome: 'Invocar/Dispensar', nomeEn: 'Summon/Dismiss', de: 'arma',
    resumo: 'Espada Fractal vinculada: sacar com Interagir faz ela surgir só no início do próximo turno (cerca de dez batidas de coração). Some com um pensamento, sem ação.',
  },
  'Invocação Rápida': {
    nome: 'Invocação Rápida', nomeEn: 'Quick Summon', de: 'arma',
    resumo: 'Espada Fractal Radiante: surge na hora ao usar Interagir; some com um pensamento, sem ação.',
  },
  'Forma Maleável': {
    nome: 'Forma Maleável', nomeEn: 'Malleable Form', de: 'arma',
    resumo: 'Com ▷ a Espada Radiante assume a forma de uma arma corpo a corpo comum: usa a perícia e os traços dela (e os de perito, se houver especialidade), dobra os dados de dano e causa dano espiritual.',
  },
  'Lesão Espiritual': {
    nome: 'Lesão Espiritual', nomeEn: 'Spiritual Injury', de: 'arma',
    resumo: 'Lesão causada por Espada Fractal usa a tabela própria dela, sem somar a deflexão do alvo.',
  },
  'Sempre Disponível': {
    nome: 'Sempre Disponível', nomeEn: 'Always Available', de: 'arma',
    resumo: 'Ataque desarmado não conta como ataque com arma, não precisa de arma na mão e não pode ser tirado do personagem. Conta como usar uma mão à escolha.',
  },
  'Treinamento de Força': {
    nome: 'Treinamento de Força', nomeEn: 'Strength Training', de: 'arma',
    resumo: 'O dano do ataque desarmado depende do valor de Força do personagem, conforme a tabela do livro.',
  },
  'Peso Esmagador': {
    nome: 'Peso Esmagador', nomeEn: 'Crushing Weight', de: 'arma',
    resumo: 'Traço de perito do Martelo de Guerra: ao acertar alguém do mesmo tamanho ou menor, pode empurrá-lo até 3 m; com uma Oportunidade, empurra outros ao alcance.',
  },

  // --- Traços únicos das armaduras fractais ---
  Cargas: {
    nome: 'Cargas', nomeEn: 'Charges', de: 'armadura',
    resumo: 'Armadura Fractal tem 4 cargas. Antes de sofrer dano, gasta uma para somar 10 de deflexão contra aquele dano. Com ao menos 1 carga fica Investida; sem cargas fica Desajeitada [6] e perde Atributos Aprimorados e Proteção de Habilidade Investida.',
  },
  Quebrável: {
    nome: 'Quebrável', nomeEn: 'Breakable', de: 'armadura',
    resumo: 'Quando um ataque acerta quem a veste, o oponente pode gastar uma Oportunidade para a armadura perder 1 carga.',
  },
  Recarregando: {
    nome: 'Recarregando', nomeEn: 'Recharging', de: 'ambos',
    resumo: 'Recarrega como os demais itens com cargas, mas cada carga custa 5 de Investidura ou 5 gemas.',
  },
  'Atributos Aprimorados': {
    nome: 'Atributos Aprimorados', nomeEn: 'Enhanced Attributes', de: 'armadura',
    resumo: 'Vestida, deixa o personagem Aprimorado em +2 de Força e +2 de Velocidade.',
  },
  'Proteção de Habilidade Investida': {
    nome: 'Proteção de Habilidade Investida', nomeEn: 'Surgebinding Protection', de: 'armadura',
    resumo: 'Testes de habilidades Investidas do usuário e contra ele têm desvantagem, e a deflexão vale contra todos os tipos de dano (salvo exceções do Mestre).',
  },
  'Armadura Viva': {
    nome: 'Armadura Viva', nomeEn: 'Living Armor', de: 'armadura',
    resumo: 'Armadura Radiante: com ▶ convoca ou dispensa quantas partes quiser. As cargas são mantidas mesmo dispensada.',
  },
  'Armadura Restritiva': {
    nome: 'Armadura Restritiva', nomeEn: 'Restrictive Armor', de: 'armadura',
    resumo: 'Armadura Radiante: pode se fechar em outro personagem a até 6 m (exige teste de Disciplina se ele for involuntário), que ganha os benefícios mas fica Restringido.',
  },
  'Recuperação Natural': {
    nome: 'Recuperação Natural', nomeEn: 'Natural Recovery', de: 'armadura',
    resumo: 'Armadura Radiante recupera cargas sozinha com o tempo e todas elas após um descanso longo.',
  },
}

/** Acha o traço por nome; ignora o valor entre colchetes ("Arremesso [6/18]" → "Arremesso"). */
export function tracoPorNome(nome: string): EntradaTraco | undefined {
  const limpo = nome.replace(/\s*\[[^\]]*\]\s*$/, '').trim()
  return TRACOS[limpo]
}
