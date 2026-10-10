/* arquivo: armas.ts */
// Catálogo das armas (livro, Cap. 7 — tabelas de Armas). Só números e nomes de traço.

export type CategoriaArma = 'leve' | 'pesada' | 'especial'
export type TipoDano = 'afiado' | 'impactante' | 'espiritual'

export type ArmaCatalogo = {
  nome: string
  /** Chave em inglês do de-para (ARMA_NOME). */
  nomeEn: string
  categoria: CategoriaArma
  /** Perícia do ataque. Ausente: depende da arma similar ou da forma assumida. */
  pericia?: string
  /** Dado de dano ("1d6"; "2d*" na Espada Radiante). Ausente: depende de outra regra. */
  dano?: string
  tipoDano?: TipoDano
  /** Texto do dano quando não há dado fixo. */
  danoNota?: string
  corpoACorpo: boolean
  /** Corpo a corpo: metros somados ao alcance normal (ex.: 1,5). */
  alcanceExtra?: number
  /** À distância: curta/longa em metros. */
  distancia?: { curta: number; longa: number }
  /** Nomes de traço, com valor entre colchetes quando houver ("Carregada [1]"). */
  tracos: string[]
  tracosPerito: string[]
  /** Regra "Única" do perito, em resumo. */
  notaPerito?: string
  /** kg; 0 = sem peso; ausente = não informado. */
  pesoKg?: number
  /** Preço em marcos comuns (mc). */
  precoMc?: number
  /** Quando não há preço de compra (recompensa/talento). */
  precoNota?: string
}

const L = 'Armamento Leve'
const P = 'Armamento Pesado'

type Base = Omit<ArmaCatalogo, 'nome' | 'corpoACorpo'> & { corpoACorpo?: boolean }
const arma = (nome: string, b: Base): ArmaCatalogo => ({ nome, corpoACorpo: !b.distancia, ...b })

const LISTA: ArmaCatalogo[] = [
  // Armamento Leve
  arma('Arco Curto', { nomeEn: 'Shortbow', categoria: 'leve', pericia: L, dano: '1d6', tipoDano: 'afiado', distancia: { curta: 24, longa: 96 }, tracos: ['Duas Mãos'], tracosPerito: ['Saque Rápido'], pesoKg: 1, precoMc: 80 }),
  arma('Azagaia', { nomeEn: 'Javelin', categoria: 'leve', pericia: L, dano: '1d6', tipoDano: 'afiado', tracos: ['Arremesso [9/36]'], tracosPerito: ['Indireta'], pesoKg: 1, precoMc: 20 }),
  arma('Cajado', { nomeEn: 'Staff', categoria: 'leve', pericia: L, dano: '1d6', tipoDano: 'impactante', tracos: ['Discreta', 'Duas Mãos'], tracosPerito: ['Defensiva'], pesoKg: 2, precoMc: 1 }),
  arma('Espada Lateral', { nomeEn: 'Sidesword', categoria: 'leve', pericia: L, dano: '1d6', tipoDano: 'afiado', tracos: ['Saque Rápido'], tracosPerito: ['Mão Inábil'], pesoKg: 1, precoMc: 40 }),
  arma('Faca', { nomeEn: 'Knife', categoria: 'leve', pericia: L, dano: '1d4', tipoDano: 'afiado', tracos: ['Discreta'], tracosPerito: ['Arremesso [6/18]'], pesoKg: 0.5, precoMc: 8 }),
  arma('Funda', { nomeEn: 'Sling', categoria: 'leve', pericia: L, dano: '1d4', tipoDano: 'impactante', distancia: { curta: 9, longa: 36 }, tracos: ['Discreta'], tracosPerito: ['Indireta'], pesoKg: 0.5, precoMc: 2 }),
  arma('Lança Curta', { nomeEn: 'Shortspear', categoria: 'leve', pericia: L, dano: '1d8', tipoDano: 'afiado', tracos: ['Duas Mãos'], tracosPerito: [], notaPerito: 'Perde o traço Duas Mãos.', pesoKg: 1.5, precoMc: 10 }),
  arma('Maça', { nomeEn: 'Mace', categoria: 'leve', pericia: L, dano: '1d6', tipoDano: 'impactante', tracos: [], tracosPerito: ['Ímpeto'], pesoKg: 1.5, precoMc: 20 }),
  arma('Rapieira', { nomeEn: 'Rapier', categoria: 'leve', pericia: L, dano: '1d6', tipoDano: 'afiado', tracos: ['Saque Rápido'], tracosPerito: ['Defensiva'], pesoKg: 1, precoMc: 100 }),
  // Armamento Pesado
  arma('Alabarda', { nomeEn: 'Poleaxe', categoria: 'pesada', pericia: P, dano: '1d10', tipoDano: 'afiado', tracos: ['Duas Mãos'], tracosPerito: [], notaPerito: 'Alcance corpo a corpo ganha +1,5 m.', pesoKg: 2.5, precoMc: 40 }),
  arma('Arco Longo', { nomeEn: 'Longbow', categoria: 'pesada', pericia: P, dano: '1d6', tipoDano: 'afiado', distancia: { curta: 45, longa: 180 }, tracos: ['Duas Mãos'], tracosPerito: ['Indireta'], pesoKg: 1.5, precoMc: 100 }),
  arma('Besta', { nomeEn: 'Crossbow', categoria: 'pesada', pericia: P, dano: '1d8', tipoDano: 'afiado', distancia: { curta: 30, longa: 120 }, tracos: ['Carregada [1]', 'Duas Mãos'], tracosPerito: ['Mortal'], pesoKg: 3.5, precoMc: 200 }),
  arma('Escudo', { nomeEn: 'Shield', categoria: 'pesada', pericia: P, dano: '1d4', tipoDano: 'impactante', tracos: ['Defensiva'], tracosPerito: ['Mão Inábil'], pesoKg: 1, precoMc: 10 }),
  arma('Espada Longa', { nomeEn: 'Longsword', categoria: 'pesada', pericia: P, dano: '1d8', tipoDano: 'afiado', tracos: ['Duas Mãos', 'Saque Rápido'], tracosPerito: [], notaPerito: 'Perde o traço Duas Mãos.', pesoKg: 1.5, precoMc: 60 }),
  arma('Lança Longa', { nomeEn: 'Longspear', categoria: 'pesada', pericia: P, dano: '1d8', tipoDano: 'afiado', alcanceExtra: 1.5, tracos: ['Duas Mãos'], tracosPerito: ['Defensiva'], pesoKg: 4.5, precoMc: 15 }),
  arma('Machado', { nomeEn: 'Axe', categoria: 'pesada', pericia: P, dano: '1d6', tipoDano: 'afiado', tracos: ['Arremesso [6/18]'], tracosPerito: ['Mão Inábil'], pesoKg: 1, precoMc: 20 }),
  arma('Martelo', { nomeEn: 'Hammer', categoria: 'pesada', pericia: P, dano: '1d10', tipoDano: 'impactante', tracos: ['Duas Mãos'], tracosPerito: ['Ímpeto'], pesoKg: 4, precoMc: 40 }),
  arma('Montante', { nomeEn: 'Greatsword', categoria: 'pesada', pericia: P, dano: '1d10', tipoDano: 'afiado', tracos: ['Duas Mãos'], tracosPerito: ['Mortal'], pesoKg: 3.5, precoMc: 200 }),
  // Armas especiais
  arma('Arma Improvisada', { nomeEn: 'Improvised Weapon', categoria: 'especial', danoNota: 'Igual ao da arma similar escolhida pelo Mestre.', corpoACorpo: true, tracos: ['Frágil'], tracosPerito: [], notaPerito: 'Usa os traços de perito da arma mais parecida.' }),
  arma('Ataque Desarmado', { nomeEn: 'Unarmed Attack', categoria: 'especial', pericia: 'Atletismo', tipoDano: 'impactante', danoNota: 'Depende da Força: 0–2 = 1; 3–4 = 1d4; 5–6 = 1d8; 7–8 = 2d6; 9+ = 2d10.', tracos: ['Sempre Disponível', 'Treinamento de Força'], tracosPerito: ['Ímpeto', 'Mão Inábil'], pesoKg: 0 }),
  arma('Espada Fractal', { nomeEn: 'Shardblade', categoria: 'especial', pericia: P, dano: '2d8', tipoDano: 'espiritual', tracos: ['Mortal', 'Perigosa', 'Única', 'Invocar/Dispensar', 'Lesão Espiritual'], tracosPerito: [], notaPerito: 'Perde o traço Perigosa.', pesoKg: 2, precoNota: 'Somente como recompensa' }),
  arma('Espada Fractal Radiante', { nomeEn: 'Shardblade (Radiant)', categoria: 'especial', dano: '2d*', tipoDano: 'espiritual', danoNota: 'Perícia e dado dependem da forma assumida (Forma Maleável): dados dobrados do normal da arma.', tracos: ['Mortal', 'Única', 'Invocação Rápida', 'Forma Maleável', 'Lesão Espiritual'], tracosPerito: [], pesoKg: 0, precoNota: 'Somente como talento' }),
  arma('Hiperarco', { nomeEn: 'Grandbow', categoria: 'especial', pericia: P, dano: '2d6', tipoDano: 'afiado', distancia: { curta: 60, longa: 240 }, tracos: ['Desajeitada [5]', 'Duas Mãos'], tracosPerito: ['Perfurante'], pesoKg: 10, precoMc: 1000 }),
  arma('Martelo de Guerra', { nomeEn: 'Warhammer', categoria: 'especial', pericia: P, dano: '2d10', tipoDano: 'impactante', tracos: ['Desajeitada [5]', 'Duas Mãos'], tracosPerito: ['Peso Esmagador'], pesoKg: 75, precoMc: 400 }),
  arma('Semifractal', { nomeEn: 'Half-Shard', categoria: 'especial', pericia: P, dano: '2d4', tipoDano: 'impactante', tracos: ['Defensiva', 'Duas Mãos', 'Única'], tracosPerito: ['Ímpeto'], pesoKg: 5, precoMc: 2000 }),
]

/** Catálogo por nome em português (os valores de ARMA_NOME). */
export const ARMAS: Record<string, ArmaCatalogo> = Object.fromEntries(LISTA.map((a) => [a.nome, a]))

/** Busca por nome em português. Nome desconhecido (arma customizada) → undefined. */
export function armaPorNome(nome: string): ArmaCatalogo | undefined {
  return ARMAS[nome.trim()]
}

