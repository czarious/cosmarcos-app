/* arquivo: especialidadesCulturais.ts */
import type { Personagem, Especializacao } from '../tipos/personagem'
import { CULTURA, ESPECIALIDADE_CULTURAL } from '../estado/deparaShards'

/**
 * As 13 especialidades culturais rosharanas — Cap. 2 (Cultura), lista
 * FECHADA e completa do livro (diferente de utilidade/perito, que o livro
 * explicitamente NÃO fecha — ver especialidadesUtilidadePerito.ts).
 *
 * Usado pra complementar o dropdown de especialidade além do que já está
 * em ficha.especializacoes (ex.: se o Eccho ainda não tem "Thaylena" mas
 * o jogador quer escolhê-la numa vaga de talento).
 *
 * Texto = paráfrase própria, nunca cópia do livro (arquivo público, premissas.md → "GitHub Pages, repositório público").
 */

export type EspecialidadeCultural = {
  nome: string
  resumo: string
}

export const ESPECIALIDADES_CULTURAIS: EspecialidadeCultural[] = [
  { nome: 'Alethiana', resumo: 'Alethkar — nação guerreira, castas por cor dos olhos, vorinismo por representação.' },
  { nome: 'Azishiana', resumo: 'Azir — império burocrático, governado pelo Primeiro Aqasix e vizires.' },
  { nome: 'Herdaziana', resumo: 'Herdaz — nação pecuarista, grande diáspora, cumprimento "primo".' },
  { nome: 'Irialiana', resumo: 'Iri — três monarcas, religião do Um, jornada pela Longa Trilha.' },
  { nome: 'Kharbranthiana', resumo: 'Kharbranth — Cidade dos Sinos; medicina e academia (Grande Átrio, Palaneu).' },
  { nome: 'Nataniana', resumo: 'Nova Natanan — grantormentas severas; memória do antigo império perdido.' },
  { nome: 'Ouvinte', resumo: 'Cantores das Planícies Quebradas — restrita a Cantores ou permissão do MJ.' },
  { nome: 'Reshiana', resumo: 'Ilhas Reshi — grã-carapaças Tai-na cultuadas como divindades.' },
  { nome: 'Shina', resumo: 'Shinovar — nação isolada dos Xamãs das Pedras; pedra sagrada.' },
  { nome: 'Thaylena', resumo: 'Thaylenah — ilha-nação mercante; convivência cotidiana com fabriais.' },
  { nome: 'Unkalakiana', resumo: 'Picos dos Papaguampas — ocupação definida pela ordem de nascimento.' },
  { nome: 'Vedena', resumo: 'Jah Keved — vorinismo, castas por cor dos olhos, próxima da cultura alethiana.' },
  { nome: 'Viajante', resumo: 'Estilo de vida nômade, sem nação fixa — rotas, abrigos contra tempestade.' },
]

/**
 * As culturais que nascem das culturas escolhidas (o Shards não as põe em
 * `expertises` — o tradutor as cria): FIXAS, não se removem e não voltam no
 * export. Devolve os índices delas em `ficha.especializacoes` — calculado na
 * hora pela cultura, pra não mudar o formato do save.
 */
export function indicesDaCultura(ficha: Personagem): Set<number> {
  const fixos = new Set<number>()
  for (const cultura of ficha.meta.culturas) {
    const nome = especialidadeDaCultura(cultura)
    const i = ficha.especializacoes.findIndex((e, k) => !fixos.has(k) && e.tipo === 'cultural' && e.nome === nome)
    if (i >= 0) fixos.add(i)
  }
  return fixos
}

/** A especialidade cultural que a cultura concede (livro, cap. 2): "Thayleno" → "Thaylena". */
export function especialidadeDaCultura(cultura: string): string {
  const en = Object.keys(CULTURA).find((k) => CULTURA[k] === cultura) ?? cultura
  return ESPECIALIDADE_CULTURAL[en] ?? en
}

/**
 * Trocou as culturas na aba Personagem: sai a especialidade cultural das
 * antigas, entra a das novas (cada cultura concede a sua — cap. 2). As outras
 * especialidades ficam; a que já existia por outro motivo (talento) não duplica.
 */
export function especialidadesComCulturas(ficha: Personagem, novas: string[]): Especializacao[] {
  const fixos = indicesDaCultura(ficha)
  const resto = ficha.especializacoes.filter((_, i) => !fixos.has(i))
  const daCultura = novas
    .map((c) => ({ tipo: 'cultural' as const, nome: especialidadeDaCultura(c) }))
    .filter((e) => !resto.some((r) => r.tipo === 'cultural' && r.nome === e.nome))
  return [...daCultura, ...resto]
}
