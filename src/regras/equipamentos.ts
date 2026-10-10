/* arquivo: equipamentos.ts */
// Equipamentos mundanos (livro, Cap. 7 — tabela de Equipamentos) e itens de viagem.
// Só números e um `resumo` em palavras do app: o que o item FAZ na mesa. O texto do livro não fica aqui.
// Chave = nome em português do ITEM_NOME (deparaShards.ts), asterisco incluído quando o de-para o tem.
// Fabriais ficam em fabriais.ts, não aqui.

export type EquipamentoCatalogo = {
  /** Igual à chave. */
  nome: string
  /** Chave em inglês do de-para (ITEM_NOME). */
  nomeEn: string
  /** kg. Em item de peso variável, o menor valor (o maior em `pesoMaxKg`). */
  pesoKg?: number
  pesoMaxKg?: number
  /** Preço em marcos comuns (mc). Em item de preço variável, o menor (o maior em `precoMaxMc`). */
  precoMc?: number
  precoMaxMc?: number
  /** O que o item faz na mesa (1-2 frases). Ausente nos só narrativos. */
  resumo?: string
  /** Marcado com * no livro: só para interpretação, sem regra. */
  soNarrativo?: boolean
}

export const EQUIPAMENTOS: Record<string, EquipamentoCatalogo> = {
  "Álcool (1 dose)": { nome: "Álcool (1 dose)", nomeEn: "Alcohol (1 serving)", pesoKg: 0.1, precoMc: 0.5, precoMaxMc: 50,
    resumo: "Uma dose de bebida; a cor do vinho vorin diz o quanto embriaga (rosa o menos, violeta o mais). Preço varia conforme a variedade.",
   },
  "Álcool (garrafa)": { nome: "Álcool (garrafa)", nomeEn: "Alcohol (bottle)", pesoKg: 1, pesoMaxKg: 2, precoMc: 1, precoMaxMc: 300,
    resumo: "Garrafa de bebida; a cor do vinho vorin diz o quanto embriaga. Peso e preço variam conforme a variedade; uma mais cara pode baixar a CD de testes sociais com apreciadores.",
   },
  "Algibeira*": { nome: "Algibeira*", nomeEn: "Pouch*", pesoKg: 0.5, precoMc: 1, soNarrativo: true },
  "Anestésico (5 doses)": { nome: "Anestésico (5 doses)", nomeEn: "Anesthetic (5 doses)", pesoKg: 0.75, precoMc: 75,
    resumo: "Aplicado numa lesão após descanso curto ou longo: reduz o tempo dela em 1d4 dias. Uma vez por dia por lesão.",
   },
  "Antisséptico (fraco, 5 doses)": { nome: "Antisséptico (fraco, 5 doses)", nomeEn: "Antiseptic (weak, 5 doses)", pesoKg: 0.5, precoMc: 25,
    resumo: "Uma dose aplicada após um descanso curto restaura 1d6 de vida.",
   },
  "Antisséptico (potente, 5 doses)": { nome: "Antisséptico (potente, 5 doses)", nomeEn: "Antiseptic (potent, 5 doses)", pesoKg: 0.5, precoMc: 50,
    resumo: "Uma dose aplicada após um descanso curto restaura 2d6 de vida.",
   },
  "Balança": { nome: "Balança", nomeEn: "Scale", pesoKg: 1.5, precoMc: 20,
    resumo: "Pesa um objeto com precisão (até 1 kg).",
   },
  "Balde*": { nome: "Balde*", nomeEn: "Bucket*", pesoKg: 1, precoMc: 1, soNarrativo: true },
  "Barril*": { nome: "Barril*", nomeEn: "Barrel*", pesoKg: 35, precoMc: 15, soNarrativo: true },
  "Baú*": { nome: "Baú*", nomeEn: "Chest*", pesoKg: 12.5, precoMc: 30, soNarrativo: true },
  "Caneta tinteiro*": { nome: "Caneta tinteiro*", nomeEn: "Ink pen*", pesoKg: 0.05, precoMc: 0.1, soNarrativo: true },
  "Cantil*": { nome: "Cantil*", nomeEn: "Waterskin*", pesoKg: 0.5, precoMc: 1, soNarrativo: true },
  "Cera (1 bloco)*": { nome: "Cera (1 bloco)*", nomeEn: "Wax (1 block)*", pesoKg: 0.25, precoMc: 2, soNarrativo: true },
  "Chave e Tranca": { nome: "Chave e Tranca", nomeEn: "Lock and key", pesoKg: 0.5, precoMc: 50,
    resumo: "A tranca abre com a chave ou com Ladinagem CD 20. Trancas mais difíceis podem existir por mais caro.",
   },
  "Cobertor*": { nome: "Cobertor*", nomeEn: "Blanket*", pesoKg: 1, precoMc: 2, soNarrativo: true },
  "Comida (boa, 1 dia)": { nome: "Comida (boa, 1 dia)", nomeEn: "Food (fine, 1 day)", pesoKg: 0.25, precoMc: 25,
    resumo: "Comida de alta classe, de restaurante ou banquete.",
   },
  "Comida (ração, 1 dia)": { nome: "Comida (ração, 1 dia)", nomeEn: "Food (ration, 1 day)", pesoKg: 0.25, precoMc: 0.2,
    resumo: "Ração de viagem; mantida seca, dura indefinidamente.",
   },
  "Comida (rua, 1 dia)": { nome: "Comida (rua, 1 dia)", nomeEn: "Food (street, 1 day)", pesoKg: 0.75, precoMc: 3,
    resumo: "Comida de rua típica de cada cultura.",
   },
  "Corda (15 metros)": { nome: "Corda (15 metros)", nomeEn: "Rope (50 feet)", pesoKg: 2.5, precoMc: 30,
    resumo: "Corta-se com 2 de dano; arrebenta com Atletismo CD 20. Vendida em trechos de 15 m.",
   },
  "Corrente (fina, 30 centímetros)": { nome: "Corrente (fina, 30 centímetros)", nomeEn: "Chain (thin, 1 foot)", pesoKg: 0.25, precoMc: 20,
    resumo: "Quebra com Atletismo CD 20 ou 5 de dano.",
   },
  "Corrente (grossa, 3 metros)": { nome: "Corrente (grossa, 3 metros)", nomeEn: "Chain (thick, 10 feet)", pesoKg: 5, precoMc: 20,
    resumo: "Quebra com Atletismo CD 30 ou 15 de dano.",
   },
  "Diapasão": { nome: "Diapasão", nomeEn: "Tuning fork", pesoKg: 0.25, precoMc: 50,
    resumo: "Transfere Luz das Tempestades entre gemas/esferas; com ele, esferas recarregam fabriais e Armaduras Fractais/semifractais como gemas não envoltas.",
   },
  "Escada (3 metros)*": { nome: "Escada (3 metros)*", nomeEn: "Ladder (10-foot)*", pesoKg: 10, precoMc: 5, soNarrativo: true },
  "Espelho (de mão)*": { nome: "Espelho (de mão)*", nomeEn: "Mirror (handheld)*", pesoKg: 1, precoMc: 25, soNarrativo: true },
  "Estojo (couro)": { nome: "Estojo (couro)", nomeEn: "Case (leather)", pesoKg: 0.5, precoMc: 4,
    resumo: "Guarda até 10 folhas de papel ou pergaminho, protegidas do clima.",
   },
  "Frasco (vidro)*": { nome: "Frasco (vidro)*", nomeEn: "Vial (glass)*", pesoKg: 0.1, precoMc: 4, soNarrativo: true },
  "Frasco ou caneca": { nome: "Frasco ou caneca", nomeEn: "Flask or tankard*", pesoKg: 0.5, precoMc: 1,
    resumo: "Recipiente comum para bebida.",
   },
  "Gancho de Escalada": { nome: "Gancho de Escalada", nomeEn: "Grappling hook", pesoKg: 2, precoMc: 10,
    resumo: "Preso a uma corda dá vantagem em Agilidade e Atletismo para escalar por ela. Prende-se a ponto fixo ao alcance com Interagir (sem teste), ou arremessado a até 6 m com Atletismo ou Agilidade.",
   },
  "Garrafa (crem)*": { nome: "Garrafa (crem)*", nomeEn: "Bottle (crem)*", pesoKg: 1.5, precoMc: 0.5, soNarrativo: true },
  "Garrafa (vidro)*": { nome: "Garrafa (vidro)*", nomeEn: "Bottle (glass)*", pesoKg: 1, precoMc: 1, soNarrativo: true },
  "Gazuas": { nome: "Gazuas", nomeEn: "Lockpick", pesoKg: 0.25, precoMc: 5,
    resumo: "Vantagem em Ladinagem para abrir fechadura. O Mestre pode gastar uma Complicação para quebrá-las.",
   },
  "Gema não envolta (infundida)": { nome: "Gema não envolta (infundida)", nomeEn: "Unencased gem (infused)", pesoKg: 0.005, precoMc: 2,
    resumo: "Recarrega fabriais e Armaduras Fractais; vaza Luz rápido e fosqueia em poucos dias. Radiantes a inspiram como esfera.",
   },
  "Grilhões": { nome: "Grilhões", nomeEn: "Manacles", pesoKg: 3, precoMc: 10,
    resumo: "Prendem pulsos ou tornozelos de personagem Grande ou menor. Escapar: Agilidade CD 25. Quebrar: Atletismo CD 25 ou 15 de dano. Abrir: Ladinagem CD 20.",
   },
  "Instrumento Musical": { nome: "Instrumento Musical", nomeEn: "Musical instrument", pesoKg: 0.25, pesoMaxKg: 10, precoMc: 1, precoMaxMc: 50,
    resumo: "A qualidade da performance vem de um teste de perícia ligada ao instrumento; com especialidade nele, vantagem.",
   },
  "Jarro ou ânfora*": { nome: "Jarro ou ânfora*", nomeEn: "Jug or pitcher*", pesoKg: 2, precoMc: 2, soNarrativo: true },
  "Lanterna (esfera)": { nome: "Lanterna (esfera)", nomeEn: "Lantern (sphere)", pesoKg: 1, precoMc: 20,
    resumo: "Esferas infundidas na gaiola dão luz: cheia 18 m, metade 9 m, um quarto 4,5 m, ao menos 1 marco/brom 1,5 m. Tranca: Ladinagem CD 15.",
   },
  "Lanterna (óleo)": { nome: "Lanterna (óleo)", nomeEn: "Lantern (oil)", pesoKg: 1, precoMc: 20,
    resumo: "Acesa, ilumina 9 m. Queima até 6 horas por quartilho de óleo.",
   },
  "Lente de Aumento": { nome: "Lente de Aumento", nomeEn: "Magnifying lens", pesoKg: 0.1, precoMc: 400,
    resumo: "Vantagem em testes para avaliar ou inspecionar itens pequenos ou detalhados.",
   },
  "Livro (de referência)": { nome: "Livro (de referência)", nomeEn: "Book (reference)", pesoKg: 0.5, pesoMaxKg: 2.5, precoMc: 10, precoMaxMc: 500,
    resumo: "Sobre um tópico; ao consultá-lo durante um teste de Intelecto relacionado, conta como ter especialidade no tópico.",
   },
  "Luneta": { nome: "Luneta", nomeEn: "Spyglass", pesoKg: 0.5, precoMc: 500,
    resumo: "Objetos vistos por ela parecem à metade da distância.",
   },
  "Martelo (de mão)*": { nome: "Martelo (de mão)*", nomeEn: "Hammer (handheld)*", pesoKg: 1.5, precoMc: 4, soNarrativo: true },
  "Mochila*": { nome: "Mochila*", nomeEn: "Backpack*", pesoKg: 2.5, precoMc: 8, soNarrativo: true },
  "Óleo (1 frasco)": { nome: "Óleo (1 frasco)", nomeEn: "Oil (1 flask)", pesoKg: 0.5, precoMc: 1,
    resumo: "Inflamável: alimenta lanternas, cria terreno perigoso ou serve de arma improvisada (banha o alvo em óleo; o frasco quebra a cada ataque).",
   },
  "Pá*": { nome: "Pá*", nomeEn: "Shovel*", pesoKg: 2.5, precoMc: 8, soNarrativo: true },
  "Panela (ferro)*": { nome: "Panela (ferro)*", nomeEn: "Pot (iron)*", pesoKg: 5, precoMc: 8, soNarrativo: true },
  "Papel ou pergaminho (1 folha)*": { nome: "Papel ou pergaminho (1 folha)*", nomeEn: "Paper or parchment (1 sheet)*", pesoKg: 0.05, precoMc: 0.5, soNarrativo: true },
  "Pé-de-cabra": { nome: "Pé-de-cabra", nomeEn: "Crowbar", pesoKg: 1.5, precoMc: 10,
    resumo: "Vantagem em Atletismo quando a alavanca ajudar.",
   },
  "Pederneira e Isqueiro": { nome: "Pederneira e Isqueiro", nomeEn: "Flint and steel", pesoKg: 0.75, precoMc: 4,
    resumo: "Com uma ação ▶ acende combustível abundante ao alcance. Fogueira em situação difícil pode levar 1 minuto ou mais.",
   },
  "Pedra de Amolar*": { nome: "Pedra de Amolar*", nomeEn: "Whetstone*", pesoKg: 0.5, precoMc: 0.2, soNarrativo: true },
  "Perfume (1 frasco pequeno)*": { nome: "Perfume (1 frasco pequeno)*", nomeEn: "Perfume (1 vial)*", pesoKg: 0.25, precoMc: 20, soNarrativo: true },
  "Picareta (mineração)*": { nome: "Picareta (mineração)*", nomeEn: "Pick (mining)*", pesoKg: 5, precoMc: 10, soNarrativo: true },
  "Rede (caça)": { nome: "Rede (caça)", nomeEn: "Net (hunting)", pesoKg: 2.5, precoMc: 4,
    resumo: "Com uma ▶: Atletismo contra defesa Física de alvo Grande ou menor a até 4,5 m. Acertando, fica Restringido e Prostrado; solta-se com Interagir e Atletismo CD 15.",
   },
  "Rede (pesca)": { nome: "Rede (pesca)", nomeEn: "Net (fishing)", pesoKg: 7.5, precoMc: 10,
    resumo: "Vantagem em testes físicos ligados à pesca.",
   },
  "Sabão*": { nome: "Sabão*", nomeEn: "Soap*", pesoKg: 0.05, precoMc: 1, soNarrativo: true },
  "Sacola*": { nome: "Sacola*", nomeEn: "Sack*", pesoKg: 0.25, precoMc: 0.2, soNarrativo: true },
  "Sistema de Polias": { nome: "Sistema de Polias", nomeEn: "Pulley system", pesoKg: 6, precoMc: 100,
    resumo: "Armado antes, trata o objeto levantado como tendo um quarto do peso. Inclui 4 polias, 9 m de corda e um gancho.",
   },
  "Suprimentos Cirúrgicos": { nome: "Suprimentos Cirúrgicos", nomeEn: "Surgical supplies", pesoKg: 1.5, precoMc: 20,
    resumo: "10 usos. Gastar um dá vantagem num teste de Medicina para tratar um ferido.",
   },
  "Tenda (duas pessoas)*": { nome: "Tenda (duas pessoas)*", nomeEn: "Tent (two-person)*", pesoKg: 10, precoMc: 10, soNarrativo: true },
  "Tinta (garrafa com 20 gramas)*": { nome: "Tinta (garrafa com 20 gramas)*", nomeEn: "Ink (1-ounce bottle)*", pesoKg: 0.1, precoMc: 40, soNarrativo: true },
  "Tratamento (médico, 1 dose)": { nome: "Tratamento (médico, 1 dose)", nomeEn: "Treatment (medical, 1 dose)", pesoKg: 0.1, precoMc: 10,
    resumo: "Em descanso curto, cura um personagem ou uma condição (Atordoado, Desorientado ou Exausto, reduzindo a penalidade em 1), se não vier de lesão permanente.",
   },
  "Trombeta Auricular": { nome: "Trombeta Auricular", nomeEn: "Ear trumpet", pesoKg: 0.5, precoMc: 50,
    resumo: "Sons distantes ouvidos por ela parecem à metade da distância.",
   },
  "Vela": { nome: "Vela", nomeEn: "Candle", pesoKg: 0.1, precoMc: 0.2,
    resumo: "Acesa, ilumina 4,5 m. Queima até 6 horas.",
   },
  "Veneno (eficiente, 1 dose)": { nome: "Veneno (eficiente, 1 dose)", nomeEn: "Poison (effectual, 1 dose)", pesoKg: 0.1, precoMc: 50,
    resumo: "Como ▶ derrama-se em comida/líquido ou aplica-se em arma/munição. Alvo faz Atletismo CD 14 ou sofre 2d8 de dano vital.",
   },
  "Veneno (fraco, 1 dose)": { nome: "Veneno (fraco, 1 dose)", nomeEn: "Poison (weak, 1 dose)", pesoKg: 0.1, precoMc: 20,
    resumo: "Como ▶ derrama-se em comida/líquido ou aplica-se em arma/munição. Alvo faz Atletismo CD 12 ou sofre 1d6 de dano vital.",
   },
  "Veneno (potente, 1 dose)": { nome: "Veneno (potente, 1 dose)", nomeEn: "Poison (potent, 1 dose)", pesoKg: 0.1, precoMc: 120,
    resumo: "Como ▶ derrama-se em comida/líquido ou aplica-se em arma/munição. Alvo faz Atletismo CD 16 ou sofre 3d10 de dano vital e fica Atordoado (e Imobilizado) por 1 hora.",
   },
  "Vestes (boas)": { nome: "Vestes (boas)", nomeEn: "Clothing (fine)", pesoKg: 3, precoMc: 50, precoMaxMc: 200,
    resumo: "Vantagem em testes espirituais para se passar por alta sociedade.",
   },
  "Vestes (comum)": { nome: "Vestes (comum)", nomeEn: "Clothing (common)", pesoKg: 1.5, precoMc: 2,
    resumo: "Vantagem em testes espirituais para se passar por gente comum.",
   },
  "Vestes (farrapos)": { nome: "Vestes (farrapos)", nomeEn: "Clothing (ragged)", pesoKg: 0.75, precoMc: 0.5,
    resumo: "Vantagem em testes espirituais para parecer destituído.",
   },
}

/** Aceita o nome com ou sem o asterisco final. */
export function equipamentoPorNome(nome: string): EquipamentoCatalogo | undefined {
  return EQUIPAMENTOS[nome] ?? EQUIPAMENTOS[`${nome}*`] ?? EQUIPAMENTOS[nome.replace(/\*$/, '')]
}

// --- Viagem (livro, Cap. 7 — Viagem). Sem regra de ficha além de preço e peso. ---

export type Alojamento = { nome: string; nomeEn: string; precoMcPorNoite: number }

/** Abrigo de Tempestade é gratuito para o público (se houver vaga). */
export const ALOJAMENTOS: Alojamento[] = [
  { nome: 'Abrigo de Tempestade', nomeEn: 'Stormshelter', precoMcPorNoite: 0 },
  { nome: 'Modesto', nomeEn: 'Modest', precoMcPorNoite: 2 },
  { nome: 'Confortável', nomeEn: 'Comfortable', precoMcPorNoite: 4 },
  { nome: 'Rico', nomeEn: 'Wealthy', precoMcPorNoite: 8 },
  { nome: 'Aristocrático', nomeEn: 'Aristocratic', precoMcPorNoite: 20 },
]

export type Montaria = {
  nome: string
  nomeEn: string
  velocidadeKmh: number
  capacidadeKg: number
  /** Ausente: só como recompensa. */
  precoMc?: number
  precoNota?: string
}

/** Atrelada a um veículo, a montaria move até 5x a capacidade de carga (soma entre várias). */
export const MONTARIAS: Montaria[] = [
  { nome: 'Chule', nomeEn: 'Chull', velocidadeKmh: 3.2, capacidadeKg: 750, precoMc: 200 },
  { nome: 'Cavalo', nomeEn: 'Horse', velocidadeKmh: 6.4, capacidadeKg: 250, precoMc: 4000 },
  { nome: 'Richádio', nomeEn: 'Ryshadium', velocidadeKmh: 9.6, capacidadeKg: 500, precoNota: 'Somente como recompensa' },
]

export type Veiculo = {
  nome: string
  nomeEn: string
  tipo: 'terra' | 'água'
  velocidadeKmh: number
  /** Canoa: velocidade rio acima. */
  velocidadeContraKmh?: number
  aluguelMcPorDia: number
  precoMc: number
}

/** Aluguel inclui quem opera; quem compra precisa tripular. */
export const VEICULOS: Veiculo[] = [
  { nome: 'Carroça de chule', nomeEn: 'Chull cart', tipo: 'terra', velocidadeKmh: 3.2, aluguelMcPorDia: 5, precoMc: 500 },
  { nome: 'Canoa', nomeEn: 'Canoe', tipo: 'água', velocidadeKmh: 4.8, velocidadeContraKmh: 1.6, aluguelMcPorDia: 3, precoMc: 250 },
  { nome: 'Embarcação mercante', nomeEn: 'Merchant ship', tipo: 'água', velocidadeKmh: 8, aluguelMcPorDia: 50, precoMc: 10000 },
  { nome: 'Navio de guerra', nomeEn: 'Warship', tipo: 'água', velocidadeKmh: 12.8, aluguelMcPorDia: 250, precoMc: 100000 },
]
