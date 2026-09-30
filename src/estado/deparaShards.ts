/* arquivo: deparaShards.ts */

/**
 * DE-PARA do Shards — todo nome que chega em inglês → termo do livro PT-BR.
 *
 * Só dado, sem lógica: quem aplica é o `importarShards.ts`. Separado dele
 * pra que termo novo do Shards mexa só aqui. Fonte de cada termo e o que
 * ainda é incerto: referencia/livro/dicionario-en-ptbr.md (não versionado).
 * Chave = texto EXATO do Shards (data/*.json do site); conferir lá antes de
 * mudar uma chave.
 */

import type { NomeAtributo, TipoEspecializacao, QualidadeFabrial, IdCondicao, GravidadeLesao } from '../tipos/personagem'

export const ATRIBUTO: Record<string, NomeAtributo> = {
  strength: 'forca',
  speed: 'velocidade',
  intellect: 'intelecto',
  willpower: 'vontade',
  awareness: 'consciencia',
  presence: 'presenca',
}

/** As 18 perícias (Cap. 3, "As 18 Perícias") — chave estável do Shards → nome canônico do livro. */
export const PERICIA_NOME: Record<string, string> = {
  athletics: 'Atletismo',
  'heavy-weaponry': 'Armamento Pesado',
  agility: 'Agilidade',
  'light-weaponry': 'Armamento Leve',
  stealth: 'Furtividade',
  thievery: 'Ladinagem',
  crafting: 'Manufatura',
  deduction: 'Dedução',
  lore: 'Saber',
  medicine: 'Medicina',
  discipline: 'Disciplina',
  intimidation: 'Intimidação',
  insight: 'Intuição',
  perception: 'Percepção',
  survival: 'Sobrevivência',
  deception: 'Dissimulação',
  leadership: 'Liderança',
  persuasion: 'Persuasão',
}

/** Mesmas 18, mas pelo NOME em inglês (é o que `inventory.items[].skill` traz pra armas, não a chave). */
export const PERICIA_NOME_POR_INGLES: Record<string, string> = Object.fromEntries(
  Object.entries(PERICIA_NOME).map(([chave, ptbr]) => [
    chave
      .split('-')
      .map((p) => p[0].toUpperCase() + p.slice(1))
      .join(' '),
    ptbr,
  ]),
)

/**
 * Tipo de dano em inglês → PT-BR (Cap. 9, "Tipos de Dano"). Chaves conferidas
 * contra o catálogo do Shards (data/items.json, 27/Set/2026): lâmina é "keen",
 * não "sharp". Impact e keen confirmados em arma real do Eccho (Maça, Faca).
 */
export const TIPO_DANO: Record<string, string> = {
  impact: 'impactante', // ✅ Maça
  keen: 'afiado', // ✅ Faca / Azagaia
  energy: 'energético', // ⚠️ não confirmado com dado real
  spirit: 'espiritual', // ⚠️ não confirmado com dado real (Espada Fractal: "2d8 spirit")
  vital: 'vital', // ⚠️ não confirmado com dado real
}

/**
 * Nomes de arma — Cap. 7 (Armamento Leve/Pesado + Armas Especiais).
 * Conferido campo a campo contra a lista de equipamento do Shards
 * (19-20/Jul/2026). Cada entrada diz se foi vista de verdade no Shards
 * (✅) ou é inferência (🤔) — corrigir se aparecer errado numa ficha.
 */
export const ARMA_NOME: Record<string, string> = {
  // Armamento Leve
  Shortbow: 'Arco Curto', // ✅ confirmado (uma palavra, sem espaço)
  Javelin: 'Azagaia', // ✅ confirmado
  Staff: 'Cajado', // ✅ confirmado
  Sidesword: 'Espada Lateral', // ✅ confirmado
  Knife: 'Faca', // ✅ confirmado
  Sling: 'Funda', // ✅ confirmado
  Shortspear: 'Lança Curta', // ✅ confirmado (uma palavra, sem espaço)
  Mace: 'Maça', // ✅ confirmado
  Rapier: 'Rapieira', // ✅ confirmado
  // Armamento Pesado
  Poleaxe: 'Alabarda', // ✅ confirmado pelo dicionário (peso/preço/traços batem)
  Longbow: 'Arco Longo', // 🤔 inferência (literal, sem confirmação direta)
  Crossbow: 'Besta', // ✅ confirmado
  Shield: 'Escudo', // ✅ confirmado
  Longsword: 'Espada Longa', // ✅ confirmado
  Longspear: 'Lança Longa', // ✅ confirmado (uma palavra, sem espaço)
  Axe: 'Machado', // ✅ confirmado
  Hammer: 'Martelo', // ✅ confirmado
  Greatsword: 'Montante', // ✅ confirmado
  // Armas Especiais (Cap. 7) — perito, raras
  // Grandbow = arma canônica da história (arco gigante de aço, Navani Kholin) —
  // bate com os traços do Hiperarco já transcritos (Desajeitada [5], Perfurante,
  // Armamento Pesado). Duas fontes convergindo (lore + mecânica) — confiança alta.
  Grandbow: 'Hiperarco',
  Warhammer: 'Martelo de Guerra', // ✅ confirmado — DIFERENTE do "Hammer" comum
  Shardblade: 'Espada Fractal', // ✅ confirmado
  'Shardblade (Radiant)': 'Espada Fractal Radiante', // ✅ confirmado
  'Half-Shard': 'Semifractal', // ✅ dicionário (2d4 impactante, 5 kg)
  // Fora das 18 básicas
  'Improvised Weapon': 'Arma Improvisada', // ✅ confirmado
  'Unarmed Attack': 'Ataque Desarmado', // ✅ confirmado
}

/**
 * Nomes de item e de fabrial padrão — Shards (data/items.json) → livro PT-BR.
 * Gerado do dicionário (referencia/livro/dicionario-en-ptbr.md, 27/Set/2026);
 * o capítulo de Equipamentos veio do PDF (p.256-257), a transcrição não cobre.
 * Nome fora do mapa (item customizado) passa como o jogador escreveu.
 */
export const ITEM_NOME: Record<string, string> = {
  'Alcohol (1 serving)': 'Álcool (1 dose)',
  'Alcohol (bottle)': 'Álcool (garrafa)',
  'Anesthetic (5 doses)': 'Anestésico (5 doses)',
  'Antiseptic (potent, 5 doses)': 'Antisséptico (potente, 5 doses)',
  'Antiseptic (weak, 5 doses)': 'Antisséptico (fraco, 5 doses)',
  'Backpack*': 'Mochila*',
  'Barrel*': 'Barril*',
  'Blanket*': 'Cobertor*',
  'Book (reference)': 'Livro (de referência)',
  'Bottle (crem)*': 'Garrafa (crem)*',
  'Bottle (glass)*': 'Garrafa (vidro)*',
  'Bucket*': 'Balde*',
  'Candle': 'Vela',
  'Case (leather)': 'Estojo (couro)',
  'Chain (thick, 10 feet)': 'Corrente (grossa, 3 metros)',
  'Chain (thin, 1 foot)': 'Corrente (fina, 30 centímetros)',
  'Chest*': 'Baú*',
  'Clothing (common)': 'Vestes (comum)',
  'Clothing (fine)': 'Vestes (boas)',
  'Clothing (ragged)': 'Vestes (farrapos)',
  'Crowbar': 'Pé-de-cabra',
  'Ear trumpet': 'Trombeta Auricular',
  'Flask or tankard*': 'Frasco ou caneca',
  'Flint and steel': 'Pederneira e Isqueiro',
  'Food (ration, 1 day)': 'Comida (ração, 1 dia)',
  'Food (street, 1 day)': 'Comida (rua, 1 dia)',
  'Food (fine, 1 day)': 'Comida (boa, 1 dia)',
  'Grappling hook': 'Gancho de Escalada',
  'Hammer (handheld)*': 'Martelo (de mão)*',
  'Ink (1-ounce bottle)*': 'Tinta (garrafa com 20 gramas)*',
  'Ink pen*': 'Caneta tinteiro*',
  'Jug or pitcher*': 'Jarro ou ânfora*',
  'Ladder (10-foot)*': 'Escada (3 metros)*',
  'Lantern (oil)': 'Lanterna (óleo)',
  'Lantern (sphere)': 'Lanterna (esfera)',
  'Lock and key': 'Chave e Tranca',
  'Lockpick': 'Gazuas',
  'Magnifying lens': 'Lente de Aumento',
  'Manacles': 'Grilhões',
  'Mirror (handheld)*': 'Espelho (de mão)*',
  'Musical instrument': 'Instrumento Musical',
  'Net (hunting)': 'Rede (caça)',
  'Net (fishing)': 'Rede (pesca)',
  'Oil (1 flask)': 'Óleo (1 frasco)',
  'Paper or parchment (1 sheet)*': 'Papel ou pergaminho (1 folha)*',
  'Perfume (1 vial)*': 'Perfume (1 frasco pequeno)*',
  'Pick (mining)*': 'Picareta (mineração)*',
  'Poison (weak, 1 dose)': 'Veneno (fraco, 1 dose)',
  'Poison (effectual, 1 dose)': 'Veneno (eficiente, 1 dose)',
  'Poison (potent, 1 dose)': 'Veneno (potente, 1 dose)',
  'Pot (iron)*': 'Panela (ferro)*',
  'Pouch*': 'Algibeira*', // 🤔 por eliminação (peso/preço)
  'Pulley system': 'Sistema de Polias',
  'Rope (50 feet)': 'Corda (15 metros)',
  'Sack*': 'Sacola*',
  'Scale': 'Balança',
  'Shovel*': 'Pá*',
  'Soap*': 'Sabão*',
  'Spyglass': 'Luneta',
  'Surgical supplies': 'Suprimentos Cirúrgicos',
  'Tent (two-person)*': 'Tenda (duas pessoas)*',
  'Treatment (medical, 1 dose)': 'Tratamento (médico, 1 dose)',
  'Tuning fork': 'Diapasão',
  'Unencased gem (infused)': 'Gema não envolta (infundida)',
  'Vial (glass)*': 'Frasco (vidro)*',
  'Waterskin*': 'Cantil*',
  'Wax (1 block)*': 'Cera (1 bloco)*',
  'Whetstone*': 'Pedra de Amolar*',
  'Alerter': 'Alertador',
  'Attractor': 'Atrator',
  'Clock fabrial': 'Relógio Fabrial',
  'Drainer': 'Drenador',
  'Emotion bracelet': 'Bracelete de Emoção',
  'Freechair': 'Cadeira Livre',
  'Heatrial': 'Calorial',
  'Painrial (amplifying)': 'Dorial (amplificador)',
  'Painrial (numbing)': 'Dorial (entorpecente)',
  'Repeller': 'Repelente',
  'Soulcaster': 'Transmutador',
  'Spanreed (1 pair)': 'Telepena (1 par)',
  'Suppressor': 'Supressor',
}

/**
 * Origem e trilhas — Shards → livro PT-BR (dicionário, 27/Set/2026).
 * Só a tela usa estes campos; nenhuma regra compara com eles.
 */
export const ANCESTRALIDADE: Record<string, string> = { Human: 'Humano', Singer: 'Cantor' }

export const CULTURA: Record<string, string> = {
  Alethi: 'Alethiano',
  Azish: 'Azishiano',
  Herdazian: 'Herdaziano',
  Iriali: 'Irialiano',
  Kharbranthian: 'Kharbranthiano',
  Listener: 'Ouvinte',
  Natan: 'Nataniano',
  Reshi: 'Reshiano',
  Shin: 'Shino',
  Thaylen: 'Thayleno',
  Unkalaki: 'Unkalakiano',
  Veden: 'Vedeno',
  Wayfarer: 'Viajante',
}

/** Conjuntos iniciais — PDF p.242-243 (Cap. 7, "Conjuntos Iniciais"). */
export const CONJUNTO_INICIAL: Record<string, string> = {
  Academic: 'Acadêmico',
  Artisan: 'Artesão',
  Courtier: 'Cortesão',
  Military: 'Militar',
  Prisoner: 'Prisioneiro',
  Underworld: 'Submundo',
}

export const TRILHA_HEROICA: Record<string, string> = {
  Agent: 'Agente',
  Envoy: 'Emissário',
  Hunter: 'Caçador',
  Leader: 'Líder',
  Scholar: 'Erudito',
  Warrior: 'Guerreiro',
}

/** Ordens Radiantes. O espreno de cada uma está em ESPRENO, no singular. */
export const ORDEM: Record<string, string> = {
  Windrunner: 'Corredor dos Ventos',
  Skybreaker: 'Rompe-céu',
  Dustbringer: 'Pulverizador',
  Edgedancer: 'Dançarino de Precipícios',
  Truthwatcher: 'Sentinela da Verdade',
  Lightweaver: 'Teceluz',
  Elsecaller: 'Alternauta',
  Willshaper: 'Plasmador',
  Stoneward: 'Guardião das Pedras',
  Bondsmith: 'Vinculador',
}

export const ESPRENO: Record<string, string> = {
  Honorspren: 'Espreno de Honra',
  Highspren: 'Grão-espreno',
  Ashspren: 'Espreno de Cinzas',
  Cultivationspren: 'Espreno de Cultura',
  Mistspren: 'Espreno de Névoa',
  Cryptic: 'Críptico',
  Inkspren: 'Espreno de Tinta',
  Lightspren: 'Espreno de Luz',
  Peakspren: 'Espreno Rochoso',
}

export const FLUXO: Record<string, string> = {
  Abrasion: 'Abrasão',
  Adhesion: 'Adesão',
  Cohesion: 'Coesão',
  Division: 'Divisão',
  Gravitation: 'Gravitação',
  Illumination: 'Iluminação',
  Progression: 'Progressão',
  Tension: 'Tensão',
  Transformation: 'Transformação',
  Transportation: 'Transporte',
}

/** Talentos de fluxo — só os dos fluxos do Eccho estão no livro transcrito. */
export const TALENTO_FLUXO: Record<string, string> = {
  'Soulcast Defense': 'Defesa Transmutada',
  'Soulcast Parry': 'Aparagem Transmutada',
  'Living Soulcasting': 'Transmutação Viva',
  Bloodcasting: 'Transmutar Sangue',
  'Distant Surgebinding': 'Manipulação de Fluxos Distante',
  Flamecasting: 'Transmutar Chamas',
  'Persistent Transformation': 'Transformação Persistente',
  'Expansive Transmuter': 'Transmutador Expansivo',
  'Cognitive Farsight': 'Visão Cognitiva Distante',
  'Realmic Evasion': 'Evasão Entre Reinos',
  'Cognitive Vision': 'Visão Cognitiva',
  'Realmic Step': 'Passo Entre Reinos',
  'Shared Transportation': 'Transporte Compartilhado',
  Elsecalling: 'Alternavegar',
  Elsegate: 'Alterportal',
  Realmwalker: 'Caminhante dos Reinos',
}

/** Categoria de item do Shards — o catálogo só usa "equipment". */
/** As 8 armaduras (dicionário → "Armaduras", 07-itens/05-armaduras.md). Vale pro item e pra especialidade em armadura. */
export const ARMADURA_NOME: Record<string, string> = {
  Uniform: 'Uniforme',
  Leather: 'Couro',
  Chain: 'Cota de Malha',
  Breastplate: 'Placa Peitoral',
  'Half Plate': 'Meia Armadura',
  'Full Plate': 'Armadura Completa',
  Shardplate: 'Armadura Fractal',
  'Shardplate (Radiant)': 'Armadura Fractal (Radiante)',
}

export const CATEGORIA_ITEM: Record<string, string> = { equipment: 'Equipamento', item: 'Item', armor: 'Armadura' }

/** De-para com fallback: termo fora do mapa passa cru, pra nunca sumir da tela. */
export function traduz(mapa: Record<string, string>, termo: string): string {
  return mapa[termo] ?? termo
}

/**
 * Traços de arma — Cap. 7. Chave = nome EXATO do Shards (data/items.json →
 * weapons.weapon_traits, conferido 27/Set/2026). O valor entre colchetes
 * ("Thrown [30/120]", "Cumbersome [5]") é tratado em `traduzTraco`.
 */
export const TRACO_ARMA: Record<string, string> = {
  Cumbersome: 'Desajeitada',
  Dangerous: 'Perigosa',
  Deadly: 'Mortal',
  Defensive: 'Defensiva',
  Discreet: 'Discreta',
  Fragile: 'Frágil',
  Indirect: 'Indireta',
  Loaded: 'Carregada',
  Momentum: 'Ímpeto', // ✅ confirmado
  Offhand: 'Mão Inábil',
  Pierce: 'Perfurante',
  Presentable: 'Apresentável', // armadura
  Quickdraw: 'Saque Rápido',
  Thrown: 'Arremesso',
  'Two-Handed': 'Duas Mãos',
  Unique: 'Única',
}

/** Traços cujo valor é distância em pés — viram metros ("Thrown [30/120]" → "Arremesso [9/36]"). */
export const TRACO_COM_DISTANCIA = new Set(['Thrown'])

/** Shards (select "Expertise type") → as 5 categorias do livro (Cap. 3). */
export const TIPO_ESPECIALIDADE: Record<string, TipoEspecializacao> = {
  Weapon: 'arma',
  Armor: 'armadura',
  Cultural: 'cultural',
  Utility: 'utilidade',
  Specialist: 'perito',
}

/** Fabrial padrão do Shards → id em regras/fabriais.ts. */
export const FABRIAL_PADRAO_ID: Record<string, string> = {
  Alerter: 'alertador',
  Attractor: 'atrator',
  'Clock fabrial': 'relogio',
  Drainer: 'drenador',
  'Emotion bracelet': 'bracelete-emocao',
  Freechair: 'cadeira-livre',
  Heatrial: 'calorial',
  'Painrial (amplifying)': 'dorial-amplificador',
  'Painrial (numbing)': 'dorial-entorpecente',
  Repeller: 'repelente',
  Soulcaster: 'transmutador',
  'Spanreed (1 pair)': 'telepena',
  Suppressor: 'supressor',
}

/** Upgrades do Shards (select "Add Upgrades") → id em regras/fabriais.ts. */
export const APRIMORAMENTO_ID: Record<string, string> = {
  Amplified: 'amplificado',
  Reliable: 'confiavel',
  'Fine-Tuned': 'sintonizado',
  Efficient: 'eficiente',
  'Higher Capacity': 'alta-capacidade',
  'Long Ranged': 'longa-distancia',
  Faster: 'mais-rapido',
  'Greater Damage': 'dano-maior',
}

/** Drawbacks do Shards (select "Add Drawbacks") → id em regras/fabriais.ts. */
export const REVES_ID: Record<string, string> = {
  Diminished: 'diminuido',
  Delicate: 'delicado',
  Dangerous: 'perigoso',
  Inefficient: 'ineficiente',
  'Lower Capacity': 'baixa-capacidade',
  'Short Ranged': 'curta-distancia',
  Slower: 'mais-lento',
  'Lesser Damage': 'dano-menor',
}

/** Quality do Shards → QualidadeFabrial. */
export const QUALIDADE_FABRIAL: Record<string, QualidadeFabrial> = {
  Shoddy: 'ruim',
  Typical: 'tipica',
  Quality: 'qualidade',
  Exceptional: 'excepcional',
  Custom: 'personalizada',
}

/** Cultura → nome da especialidade cultural que ela dá (regras/especialidadesCulturais.ts). */
export const ESPECIALIDADE_CULTURAL: Record<string, string> = {
  Alethi: 'Alethiana',
  Azish: 'Azishiana',
  Herdazian: 'Herdaziana',
  Iriali: 'Irialiana',
  Kharbranthian: 'Kharbranthiana',
  Listener: 'Ouvinte',
  Natan: 'Nataniana',
  Reshi: 'Reshiana',
  Shin: 'Shina',
  Thaylen: 'Thaylena',
  Unkalaki: 'Unkalakiana',
  Veden: 'Vedena',
  Wayfarer: 'Viajante',
}

/**
 * Condições — nome do Shards (data/rules-index.json, conferido 29/Set/2026) → id
 * em regras/condicoes.ts. Os 14 batem com o dicionário. Atenção ao par que
 * confunde: Enhanced = Aprimorado (atributo); Empowered = Potencializado (Ideal).
 */
/**
 * Tipo de lesão do Shards (js/rules/injuryRules.js) → gravidade do livro.
 * vicious = 6d6 dias (Grave); shallow = 1d6 dias (Leve); flesh = até o descanso longo (Superficial).
 */
export const GRAVIDADE_LESAO: Record<string, GravidadeLesao> = {
  permanent: 'permanente',
  vicious: 'grave',
  shallow: 'leve',
  flesh: 'superficial',
}

export const CONDICAO_ID: Record<string, IdCondicao> = {
  Afflicted: 'afligido',
  Enhanced: 'aprimorado',
  Stunned: 'atordoado',
  Disoriented: 'desorientado',
  Determined: 'determinado',
  Exhausted: 'exausto',
  Focused: 'focado',
  Immobilized: 'imobilizado',
  Unconscious: 'inconsciente',
  Slowed: 'lento',
  Empowered: 'potencializado',
  Prone: 'prostrado',
  Restrained: 'restringido',
  Surprised: 'surpreendido',
}
