/* arquivo: armaduras.ts */
// Catálogo das 8 armaduras (livro, Cap. 7 — tabela de Armaduras). Só números e nomes de traço.

export type ArmaduraCatalogo = {
  nome: string
  /** Chave em inglês do de-para (ARMADURA_NOME). */
  nomeEn: string
  deflexao: number
  /** Nomes de traço, com valor entre colchetes quando houver ("Desajeitada [3]"). */
  tracos: string[]
  tracosPerito: string[]
  /** Regra "Única" do perito, em resumo. */
  notaPerito?: string
  /** kg; 0 = sem peso. */
  pesoKg: number
  precoMc?: number
  precoNota?: string
}

const LISTA: ArmaduraCatalogo[] = [
  { nome: 'Uniforme', nomeEn: 'Uniform', deflexao: 0, tracos: ['Apresentável'], tracosPerito: [], pesoKg: 2.5, precoMc: 40 },
  { nome: 'Couro', nomeEn: 'Leather', deflexao: 1, tracos: [], tracosPerito: ['Apresentável'], pesoKg: 5, precoMc: 60 },
  { nome: 'Cota de Malha', nomeEn: 'Chain', deflexao: 2, tracos: ['Desajeitada [3]'], tracosPerito: [], notaPerito: 'Perde o traço Desajeitada.', pesoKg: 12.5, precoMc: 80 },
  { nome: 'Placa Peitoral', nomeEn: 'Breastplate', deflexao: 2, tracos: ['Desajeitada [3]'], tracosPerito: ['Apresentável'], pesoKg: 15, precoMc: 120 },
  { nome: 'Meia Armadura', nomeEn: 'Half Plate', deflexao: 3, tracos: ['Desajeitada [4]'], tracosPerito: [], notaPerito: 'Desajeitada [3] em vez de Desajeitada [4].', pesoKg: 20, precoMc: 400 },
  { nome: 'Armadura Completa', nomeEn: 'Full Plate', deflexao: 4, tracos: ['Desajeitada [5]'], tracosPerito: [], pesoKg: 27.5, precoMc: 1600 },
  { nome: 'Armadura Fractal', nomeEn: 'Shardplate', deflexao: 5, tracos: ['Perigosa', 'Única', 'Cargas', 'Quebrável', 'Recarregando', 'Atributos Aprimorados', 'Proteção de Habilidade Investida'], tracosPerito: [], notaPerito: 'Perde o traço Perigosa.', pesoKg: 700, precoNota: 'Somente como recompensa' },
  { nome: 'Armadura Fractal (Radiante)', nomeEn: 'Shardplate (Radiant)', deflexao: 5, tracos: ['Única', 'Cargas', 'Quebrável', 'Recarregando', 'Atributos Aprimorados', 'Proteção de Habilidade Investida', 'Armadura Viva', 'Armadura Restritiva', 'Recuperação Natural'], tracosPerito: [], pesoKg: 0, precoNota: 'Somente como talento' },
]

/** Catálogo por nome em português (os valores de ARMADURA_NOME). */
export const ARMADURAS: Record<string, ArmaduraCatalogo> = Object.fromEntries(LISTA.map((a) => [a.nome, a]))

/** Busca por nome em português. Nome desconhecido (armadura customizada) → undefined. */
export function armaduraPorNome(nome: string): ArmaduraCatalogo | undefined {
  return ARMADURAS[nome.trim()]
}
