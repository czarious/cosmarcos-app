/* arquivo: especialidadesCulturais.ts */

/**
 * As 13 especialidades culturais rosharanas — Cap. 2 (Cultura), lista
 * FECHADA e completa do livro (diferente de utilidade/perito, que o livro
 * explicitamente NÃO fecha — ver especialidadesUtilidadePerito.ts).
 *
 * Usado pra complementar o dropdown de especialidade além do que já está
 * em ficha.especializacoes (ex.: se o Eccho ainda não tem "Thaylena" mas
 * o jogador quer escolhê-la numa vaga de talento).
 *
 * Texto = paráfrase própria, nunca cópia do livro (arquivo público, decisão 0004).
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
