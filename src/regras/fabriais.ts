/* arquivo: fabriais.ts */

/**
 * REGRAS DE FABRIAL — Cap. 7 do Guia PT-BR (conferido contra a transcrição em 27/Set/2026).
 *  - Fabriais padrão, cargas e recarga: transcricao/07-itens/08-fabriais.md · 01-usando-itens.md
 *  - Fabrial único (efeitos, aprimoramentos, revezes, qualidade): transcricao/07-itens/09-manufaturando.md
 *
 * Texto aqui é RESUMO com palavras próprias — o livro não vai pro repo
 * público. Número (cargas, custo, CD, dado) é exato.
 *
 * A ficha só guarda ids (Fabrial.modelo, .aprimoramentos, .revezes); o que
 * cada id significa mora aqui. Id desconhecido = texto livre do Mestre.
 */

import type { Fabrial, QualidadeFabrial, Personagem } from '../tipos/personagem'

// ── recarga (01-usando-itens.md → "Recarregando Itens") ──────────────
export const RECARGA = {
  descansoCurto: 'No descanso curto: +1 carga por gema não envolta ou ponto de Investidura infundido.',
  grantormenta: 'Exposto a uma grantormenta: recarga completa.',
}

// ── fabriais padrão (08-fabriais.md → "Fabriais Padrão") ─────────────
export type FabrialPadrao = {
  id: string
  nome: string
  /** `null` = cargas ilimitadas (Cadeira Livre). */
  cargas: number | null
  peso: string
  preco: string
  /** Ritmo de gasto enquanto ativo. */
  gasto: string
  resumo: string
}

export const FABRIAIS_PADRAO: FabrialPadrao[] = [
  { id: 'alertador', nome: 'Alertador', cargas: 5, peso: '0,25–5 kg', preco: '500 mc', gasto: '1 carga por dia ativo', resumo: 'Pisca quando algo entra num raio definido na manufatura; pode ser sintonizado a pessoas, materiais ou uso de fluxos.' },
  { id: 'atrator', nome: 'Atrator', cargas: 5, peso: '4 kg', preco: '750 mc', gasto: '1 carga por hora ativo', resumo: 'Puxa de leve um material sintonizado dentro de um raio, 30 cm por rodada. Não afeta o que está vestido ou carregado.' },
  { id: 'bracelete-emocao', nome: 'Bracelete de Emoção', cargas: 3, peso: '0,1 kg', preco: '200 mc', gasto: '1 carga por uso (▷)', resumo: 'Muda de cor com as emoções por perto. Gaste 1 carga como ▷: vantagem num teste de Intuição contra alguém a até 3 m.' },
  { id: 'cadeira-livre', nome: 'Cadeira Livre', cargas: null, peso: '6 kg', preco: 'gratuito ou 800 mc', gasto: 'não conta cargas', resumo: 'Cadeira que levita; o operador usa a taxa de movimento normal, sem ação para ativar.' },
  { id: 'calorial', nome: 'Calorial', cargas: 5, peso: '0,5–5 kg', preco: '50–500 mc', gasto: '1 carga por dia (calor ambiente) ou por hora (cozinha/forja)', resumo: 'Aquecedor: Interagir liga e ajusta raio e intensidade. Tocar a gema ativa causa 1d6 de dano de energia.' },
  { id: 'dorial-amplificador', nome: 'Dorial (amplificador)', cargas: 3, peso: '0,5 kg', preco: '750 mc', gasto: '1 carga por acerto', resumo: 'Arma corpo a corpo de Armamento Leve, 1d6 vital. Ao acertar, gaste 1 carga para somar o modificador de perícia ao dano mais uma vez.' },
  { id: 'dorial-entorpecente', nome: 'Dorial (entorpecente)', cargas: 3, peso: '0,5 kg', preco: '750 mc', gasto: '1 carga por uso (↻)', resumo: 'Vestido: antes de sofrer dano, use ↻ e gaste 1 carga para reduzir o dano em 1d4.' },
  { id: 'drenador', nome: 'Drenador', cargas: 2, peso: '0,25 kg', preco: '1.000 mc', gasto: 'ganha carga ao drenar', resumo: 'Interagir num alvo Investido: ele perde 1 carga/Investidura e o drenador ganha 1. Alvo involuntário: Agilidade contra a defesa Física. Cheio, esvazia com diapasão, Radiante ou em 5 dias.' },
  { id: 'relogio', nome: 'Relógio Fabrial', cargas: 3, peso: '1 kg', preco: '200 mc', gasto: '1 carga a cada 5 dias ativo', resumo: 'Marca a hora exata; os maiores anunciam a hora.' },
  { id: 'repelente', nome: 'Repelente', cargas: 5, peso: '4 kg', preco: '1.500 mc', gasto: '1 carga por hora ativo', resumo: 'Empurra de leve um material sintonizado, 30 cm por rodada — ou é empurrado, se for o mais leve. Não afeta o que está vestido ou carregado.' },
  { id: 'supressor', nome: 'Supressor', cargas: 2, peso: '0,5 kg', preco: 'só como recompensa', gasto: '1 carga por hora ativo', resumo: 'Suprime fluxos num raio de 9 m (Luz das Tempestades barra Luz do Vazio, e vice-versa). Radiante do 4º Ideal+ resiste com CD 20 por rodada.' },
  { id: 'telepena', nome: 'Telepena (1 par)', cargas: 3, peso: '0,5 kg cada', preco: '100 mc', gasto: '1 carga a cada 5 dias ativo (o par)', resumo: 'Par de penas ligadas: o que uma escreve, a outra repete. As duas precisam estar paradas (não funciona em navio ou carruagem).' },
  { id: 'transmutador', nome: 'Transmutador', cargas: 5, peso: '2,5 kg', preco: 'só como recompensa', gasto: 'cargas no lugar de Investidura', resumo: 'Usa o fluxo da Transformação numa única Essência, gastando cargas em vez de Investidura. Sem graduação: tamanho Pequeno e teste com Vontade. O Mestre pode gastar uma C para rachar uma gema.' },
]

// ── fabrial único (09-manufaturando.md) ──────────────────────────────

/**
 * O que um efeito "tem" — é o que decide quais aprimoramentos/revezes gerais
 * cabem nele (coluna "Requerimentos" da tabela d8). A marcação de cada efeito
 * é leitura do texto do efeito, não uma lista do livro.
 */
export type Caracteristica = 'ataque' | 'teste' | 'cargas' | 'distancia' | 'movimento' | 'dano'

/** Botão de gasto de carga que o efeito oferece em Ações (ex.: disparar o Projétil). */
export type UsoCarga = { rotulo: string; custo: number; /** só aparece com o aprimoramento próprio do efeito */ exigeProprio?: boolean }

export type EfeitoUnico = {
  id: string
  nome: string
  patamar: 1 | 2 | 3 | 4
  cargas: number
  /** Custo de ação pra usar (▷ ▶); ausente = vale a do ataque (Projétil, Dorial). */
  acao?: string
  resumo: string
  /** Revés próprio do efeito (opção de revés além dos gerais). */
  reves: string
  /** Aprimoramento próprio do efeito (opção de aprimoramento além dos gerais). */
  aprimoramento: string
  tem: Caracteristica[]
  usos?: UsoCarga[]
}

export const EFEITOS_UNICOS: EfeitoUnico[] = [
  { id: 'prendrial-area', nome: 'Prendrial (área)', patamar: 1, cargas: 3, acao: '▶', tem: ['cargas', 'distancia'],
    resumo: 'Gaste 1 carga: tudo a até 1,5 m (menos você) fica Imobilizado. Ativo, gasta 1 carga no começo de cada turno seu.',
    reves: 'Você também fica Imobilizado.', aprimoramento: 'Afeta tudo a até 3 m.' },
  { id: 'prendrial-pessoal', nome: 'Prendrial (pessoal)', patamar: 1, cargas: 5, acao: '▷', tem: ['cargas', 'movimento'],
    resumo: 'Gaste 1 carga: escala qualquer superfície por 1 rodada, sem ficar Lento, e pode ficar parado depois sem gastar mais. Sem cargas no alto, você cai.',
    reves: 'Você fica Lento enquanto escala assim.', aprimoramento: 'Teste de Agilidade contra a defesa Física de um alvo no alcance; acertando, gaste 1 carga e ele fica Imobilizado por 1 rodada.' },
  { id: 'compressor', nome: 'Compressor', patamar: 1, cargas: 3, acao: '▶', tem: ['cargas', 'ataque', 'teste', 'distancia'],
    resumo: 'Teste de Agilidade contra a defesa Física de um alvo no alcance; acertando, gaste 1+ cargas: ele fica Lento ou com desvantagem em testes físicos por essa quantidade de rodadas.',
    reves: 'Enquanto Lento assim, a defesa Física do alvo sobe 2.', aprimoramento: 'O alvo fica Imobilizado em vez de Lento.' },
  { id: 'cremrial', nome: 'Cremrial', patamar: 1, cargas: 5, acao: '▶', tem: ['cargas', 'distancia'],
    resumo: 'Gaste 1 carga: uma área Média (1,5 m) de pedra no alcance vira argila. No fim do turno volta a ser pedra; inimigos nela Evitam um Perigo ou ficam Imobilizados (Atletismo CD 15 para sair).',
    reves: 'Até o fim do seu próximo turno, com uma C a até 1,5 m da área, o Mestre pode afundar você na pedra (Imobilizado).', aprimoramento: 'Área Grande (3 m) em vez de Média.' },
  { id: 'cultivador', nome: 'Cultivador', patamar: 1, cargas: 3, acao: '▶', tem: ['cargas'],
    resumo: 'Gaste 1 carga: plantas que você toca crescem até tamanho Médio (1,5 m) — barreira, cobertura ou escalada.',
    reves: 'Com uma C a até 1,5 m da planta, o Mestre pode fazê-la prender você (Restringido; Atletismo CD 12 para partir).', aprimoramento: 'Plantas até tamanho Grande (3 m).' },
  { id: 'acelerador', nome: 'Acelerador', patamar: 2, cargas: 3, acao: '▷', tem: ['cargas', 'movimento'],
    resumo: 'Reduz o atrito do corpo: gaste 1 carga para mover até sua taxa de movimento em linha reta.',
    reves: 'Teste de Agilidade a cada uso; falhando, fica Prostrado no fim do movimento.', aprimoramento: 'Não precisa ser em linha reta.' },
  { id: 'ampliador-armadura', nome: 'Ampliador de Armadura', patamar: 2, cargas: 2, acao: '▶', tem: ['cargas'],
    resumo: 'Preso a uma armadura não Investida: gaste 1 carga para +2 de deflexão até o fim da cena.',
    reves: 'A armadura ganha Desajeitada [3] enquanto ativo.', aprimoramento: 'Uma carga a mais também dá +1 de defesa Física até o fim da cena.' },
  { id: 'ascensor', nome: 'Ascensor', patamar: 2, cargas: 5, acao: '▷', tem: ['cargas', 'movimento'],
    resumo: 'Gaste 1 carga: voo de 9 m até o fim do seu próximo turno; com cargas sobrando, paira ou desce sem gastar. Sem cargas no ar, você cai.',
    reves: 'Exige +1.000 marcos em contrapesos, que precisam ser resetados uma vez por dia.', aprimoramento: 'Também afeta outros: Agilidade contra a defesa Física no alcance; acertando, gaste 1 carga para empurrar o alvo até 9 m em linha reta.' },
  { id: 'dorial', nome: 'Dorial (amplificador/entorpecente)', patamar: 2, cargas: 3, tem: ['cargas', 'ataque', 'teste', 'dano'],
    resumo: 'Arma corpo a corpo de Armamento Leve, 1d6 vital. Ao acertar, gaste 1 carga para somar o modificador de perícia ao dano mais uma vez.',
    reves: 'O Mestre pode gastar uma C do ataque: o fabrial perde 1 carga e causa 1d6 vital em você.', aprimoramento: 'Antes de sofrer dano de inimigo, com o fabrial não cheio, reduza o dano em 1d6 e recupere 1 carga.',
    usos: [{ rotulo: 'Somar dano', custo: 1 }] },
  { id: 'drenador', nome: 'Drenador', patamar: 2, cargas: 5, acao: '▶', tem: ['cargas'],
    resumo: 'Toque num alvo infundido ou Investido: com o fabrial não cheio, o alvo perde 1 carga/Investidura e o fabrial ganha 1. Cheio, esvazia com diapasão, Radiante ou em 5 dias.',
    reves: 'Carregando-o, uma C em teste envolvendo algo Investido deixa o Mestre drenar 1 de Investidura dele.', aprimoramento: 'Drena 2 de Investidura em vez de 1.' },
  { id: 'iluminial', nome: 'Iluminial', patamar: 2, cargas: 3, acao: '▶', tem: ['cargas', 'ataque', 'teste', 'distancia'],
    resumo: 'Dissimulação contra a defesa Cognitiva de um alvo a até 9 m. Acertando, gaste 1 carga: ele perde 3 de foco; errando, gaste 1 carga: perde 1. Chegando a 0 de foco, fica Desorientado até o fim do seu próximo turno.',
    reves: 'O Mestre pode gastar uma C do uso para deixar você Desorientado até o fim do seu próximo turno.', aprimoramento: 'Gaste uma O do uso para também causar 1d6 vital.',
    usos: [{ rotulo: 'Atordoar', custo: 1 }] },
  { id: 'projetil', nome: 'Projétil', patamar: 2, cargas: 5, tem: ['cargas', 'ataque', 'teste', 'distancia', 'dano'],
    resumo: 'Gaste 1 carga: arma à distância [9/36] de Armamento Leve, traço Mão Inábil, 1d10 impactante.',
    reves: 'Ganha o traço Carregada [1].', aprimoramento: 'Gaste 1 carga a mais para atacar dois alvos em vez de um.',
    usos: [{ rotulo: 'Disparar', custo: 1 }, { rotulo: 'Ataque duplo', custo: 2, exigeProprio: true }] },
  { id: 'vidarial', nome: 'Vidarial', patamar: 2, cargas: 3, acao: '▶', tem: ['cargas', 'dano', 'distancia'],
    resumo: 'Gaste 1 carga: você ou um alvo no alcance recupera 1d6 de vida.',
    reves: 'Custa ▶▶ em vez de ▶.', aprimoramento: 'Gaste 1 carga para remover uma lesão do alvo (junto com a cura ou no lugar dela).',
    usos: [{ rotulo: 'Curar', custo: 1 }] },
  { id: 'disruptor', nome: 'Disruptor', patamar: 3, cargas: 4, acao: '▶', tem: ['cargas', 'teste'],
    resumo: 'Gaste 1 carga tocando um objeto Pequeno (0,75 m): desapossado, é destruído; segurado, Agilidade contra a defesa Física do portador. Não afeta objeto infundido ou Investido.',
    reves: 'Só afeta objetos desapossados.', aprimoramento: 'Contra personagens: gaste 2 cargas, ataque de Disciplina contra a defesa Espiritual, 2d6 espiritual.' },
  { id: 'fabrial-fluxo', nome: 'Fabrial de Fluxo', patamar: 4, cargas: 4, tem: ['cargas', 'teste'],
    resumo: 'Imita um fluxo Radiante escolhido na manufatura, com as regras normais, gastando cargas em vez de Investidura. Sem graduação, conta como 1 para efeitos; testa com a perícia do fluxo ou com Vontade.',
    reves: 'Só você pode usar este fabrial.', aprimoramento: 'Praticando com ele, pode escolher talentos da árvore do fluxo ao subir de nível (só funcionam com o fabrial).' },
]

/** O aprimoramento/revés próprio do efeito entra na lista com este id. */
export const ID_PROPRIO = 'proprio'

export type OpcaoGeral = { id: string; nome: string; resumo: string; requer: Caracteristica[] }

/** Tabela d8 "Aprimoramentos e Revezes de Fabrial" — linha a linha, na ordem do dado. */
export const APRIMORAMENTOS_GERAIS: OpcaoGeral[] = [
  { id: 'amplificado', nome: 'Amplificado', resumo: 'Ataques com este fabrial ganham vantagem.', requer: ['ataque'] },
  { id: 'confiavel', nome: 'Confiável', resumo: 'Ignore a primeira C rolada com ele em cada cena (sem o bônus dela).', requer: ['teste'] },
  { id: 'sintonizado', nome: 'Sintonizado', resumo: 'Gaste uma O para recuperar 1d4 de foco.', requer: ['teste'] },
  { id: 'eficiente', nome: 'Eficiente', resumo: 'Rolando O a até 1,5 m do fabrial ativo, gaste-a para ele recuperar 1 carga.', requer: ['cargas'] },
  { id: 'alta-capacidade', nome: 'Alta Capacidade', resumo: '+1 no máximo de cargas.', requer: ['cargas'] },
  { id: 'longa-distancia', nome: 'Longa Distância', resumo: 'Distância dobrada.', requer: ['distancia'] },
  { id: 'mais-rapido', nome: 'Mais Rápido', resumo: '+50% na taxa de movimento do efeito.', requer: ['movimento'] },
  { id: 'dano-maior', nome: 'Dano Maior', resumo: 'Dano ou cura sobe um tamanho de dado (d4 → d6).', requer: ['dano'] },
]

export const REVEZES_GERAIS: OpcaoGeral[] = [
  { id: 'diminuido', nome: 'Diminuído', resumo: 'Ataques com este fabrial sofrem desvantagem.', requer: ['ataque'] },
  { id: 'delicado', nome: 'Delicado', resumo: 'O Mestre gasta uma C para desativá-lo até um reparo (Manufatura CD 15).', requer: ['teste'] },
  { id: 'perigoso', nome: 'Perigoso', resumo: 'O Mestre gasta uma C: 1d6 de energia em você e em quem estiver a até 1,5 m.', requer: ['teste'] },
  { id: 'ineficiente', nome: 'Ineficiente', resumo: 'Rolando C a até 1,5 m do fabrial ativo, o Mestre pode gastá-la para queimar 1 carga extra.', requer: ['cargas'] },
  { id: 'baixa-capacidade', nome: 'Baixa Capacidade', resumo: '−1 no máximo de cargas.', requer: ['cargas'] },
  { id: 'curta-distancia', nome: 'Curta Distância', resumo: 'Distância pela metade.', requer: ['distancia'] },
  { id: 'mais-lento', nome: 'Mais Lento', resumo: '−50% na taxa de movimento do efeito.', requer: ['movimento'] },
  { id: 'dano-menor', nome: 'Dano Menor', resumo: 'Dano ou cura desce um tamanho de dado (d20 → d12).', requer: ['dano'] },
]

/** "Características de Fabriais Avançados" — custam 2 aprimoramentos (1 com Trabalho Manual Refinado). */
export const CARACTERISTICAS_AVANCADAS: { id: string; nome: string; resumo: string }[] = [
  { id: 'capacidade-expandida', nome: 'Capacidade Expandida', resumo: '+3 no máximo de cargas.' },
  { id: 'area-ampla', nome: 'Área Ampla', resumo: 'Efeito de um alvo: gaste 2 de foco para afetar cada inimigo, cada aliado ou cada personagem a até 1,5 m do alvo.' },
  { id: 'trava-seguranca', nome: 'Trava de Segurança', resumo: 'Só funciona para quem conhece o mecanismo secreto.' },
  { id: 'ativacao-rapida', nome: 'Ativação Rápida', resumo: '1× por cena, gaste 1 de foco para reduzir o custo de ativação em ▶.' },
  { id: 'ativacao-cronometrada', nome: 'Ativação Cronometrada', resumo: 'Com Preparar, liga ou desliga sozinho depois de um intervalo escolhido.' },
  { id: 'efeito-extra', nome: 'Efeito Extra', resumo: 'Um segundo efeito único (exige outra gema do patamar); cargas separadas.' },
]

/** Tabela de qualidade do teste de Manufatura do fabrial. `null` = o Mestre decide. */
export const QUALIDADE: Record<QualidadeFabrial, { nome: string; resultado: string; aprimoramentos: number | null; revezes: number | null }> = {
  ruim: { nome: 'Qualidade Ruim', resultado: '6–10', aprimoramentos: 0, revezes: 1 },
  tipica: { nome: 'Criação Típica', resultado: '11–20', aprimoramentos: 1, revezes: 1 },
  qualidade: { nome: 'Criação de Qualidade', resultado: '21–25', aprimoramentos: 2, revezes: 1 },
  excepcional: { nome: 'Criação Excepcional', resultado: '26+', aprimoramentos: 3, revezes: 0 },
  personalizada: { nome: 'Combinado com o Mestre', resultado: '—', aprimoramentos: null, revezes: null },
}

/** Custo de material (sem a gema) e CD para prender o espreno, por patamar do efeito. */
export const PATAMAR: Record<1 | 2 | 3 | 4, { custo: string; cd: number }> = {
  1: { custo: '100 marcos', cd: 15 },
  2: { custo: '200 marcos', cd: 20 },
  3: { custo: '400 marcos', cd: 25 },
  4: { custo: '800 marcos', cd: 30 },
}

/** Talento que barateia característica avançada (Erudito · Artifabriano). */
const TRABALHO_MANUAL_REFINADO = 'scholar::artifabrian::fine-handiwork'

// ── consultas ─────────────────────────────────────────────────────────

export function fabrialPadrao(id: string | undefined): FabrialPadrao | undefined {
  return FABRIAIS_PADRAO.find((f) => f.id === id)
}

export function efeitoUnico(id: string | undefined): EfeitoUnico | undefined {
  return EFEITOS_UNICOS.find((e) => e.id === id)
}

/** Nome e resumo de um id de aprimoramento, revés ou característica — ou o próprio texto, se livre. */
export function descreverOpcao(id: string, efeito: EfeitoUnico | undefined, lado: 'aprimoramento' | 'reves'): { nome: string; resumo?: string } {
  if (id === ID_PROPRIO && efeito) {
    return { nome: `${lado === 'aprimoramento' ? 'Aprimoramento' : 'Revés'} do ${efeito.nome}`, resumo: lado === 'aprimoramento' ? efeito.aprimoramento : efeito.reves }
  }
  const lista = lado === 'aprimoramento' ? [...APRIMORAMENTOS_GERAIS, ...CARACTERISTICAS_AVANCADAS] : REVEZES_GERAIS
  const achado = lista.find((o) => o.id === id)
  return achado ? { nome: achado.nome, resumo: achado.resumo } : { nome: id }
}

export function ehCaracteristicaAvancada(id: string): boolean {
  return CARACTERISTICAS_AVANCADAS.some((c) => c.id === id)
}

/** O efeito atende o requisito da opção geral? (sem efeito conhecido, não dá pra saber → aceita) */
export function opcaoCabe(opcao: OpcaoGeral, efeito: EfeitoUnico | undefined): boolean {
  return !efeito || opcao.requer.every((r) => efeito.tem.includes(r))
}

/**
 * Quantos aprimoramentos da qualidade as escolhas consomem. Característica
 * avançada custa 2 — ou 1, uma vez por item, com Trabalho Manual Refinado.
 */
export function aprimoramentosGastos(f: Fabrial, ficha: Personagem): number {
  const temRefinado = ficha.talentos.some((t) => t.id === TRABALHO_MANUAL_REFINADO)
  let desconto = temRefinado ? 1 : 0
  let total = 0
  for (const id of f.aprimoramentos) {
    if (ehCaracteristicaAvancada(id)) {
      total += desconto > 0 ? 1 : 2
      desconto = 0
    } else total += 1
  }
  return total
}

/**
 * Máximo de cargas pelo livro: base do efeito/padrão + Alta Capacidade (+1),
 * Capacidade Expandida (+3), Baixa Capacidade (−1). `null` = não dá pra saber.
 */
export function cargasPelaRegra(f: Fabrial): number | null {
  const base = f.tipo === 'padrao' ? fabrialPadrao(f.modelo)?.cargas : efeitoUnico(f.modelo)?.cargas
  if (base === undefined || base === null) return null
  let n = base
  if (f.aprimoramentos.includes('alta-capacidade')) n += 1
  if (f.aprimoramentos.includes('capacidade-expandida')) n += 3
  if (f.revezes.includes('baixa-capacidade')) n -= 1
  return n
}

/** Avisos (não bloqueiam — o Mestre pode ter liberado diferente). */
export function avisosFabrial(f: Fabrial, ficha: Personagem): string[] {
  const avisos: string[] = []
  const cargasRegra = cargasPelaRegra(f)
  if (cargasRegra !== null && cargasRegra !== f.cargas.max) {
    avisos.push(`Pela regra, o máximo seria ${cargasRegra} cargas (está ${f.cargas.max}).`)
  }
  const efeito = efeitoUnico(f.modelo)
  // Sem efeito do livro (fabrial livre, como o Diapasão da Guilda) não há tabela pra conferir.
  if (f.tipo !== 'unico' || !efeito) return avisos
  const q = f.qualidade ? QUALIDADE[f.qualidade] : undefined
  if (q && q.aprimoramentos !== null) {
    const gastos = aprimoramentosGastos(f, ficha)
    if (gastos !== q.aprimoramentos) avisos.push(`${q.nome} dá ${q.aprimoramentos} aprimoramento(s); as escolhas somam ${gastos}.`)
  }
  if (q && q.revezes !== null && f.revezes.length !== q.revezes) {
    avisos.push(`${q.nome} dá ${q.revezes} revés; há ${f.revezes.length}.`)
  }
  for (const id of f.aprimoramentos) {
    const op = APRIMORAMENTOS_GERAIS.find((o) => o.id === id)
    if (op && !opcaoCabe(op, efeito)) avisos.push(`${op.nome} não cabe neste efeito (requer: ${op.requer.join(', ')}).`)
  }
  for (const id of f.revezes) {
    const op = REVEZES_GERAIS.find((o) => o.id === id)
    if (op && !opcaoCabe(op, efeito)) avisos.push(`${op.nome} não cabe neste efeito (requer: ${op.requer.join(', ')}).`)
  }
  return avisos
}

/** Nome sem acento e em minúsculas — "PROJÉTIL" casa com "Projétil". */
function normaliza(t: string): string {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()
}

/** O fabrial que alimenta uma arma de mesmo nome (ex.: a arma PROJÉTIL gasta carga do fabrial PROJÉTIL). */
export function fabrialDaArma(nomeArma: string, ficha: Personagem): Fabrial | undefined {
  return ficha.fabriais.find((f) => normaliza(f.nome) === normaliza(nomeArma))
}

/** Botões de gasto que o efeito oferece — o do aprimoramento próprio só se ele foi escolhido. */
export function usosDoFabrial(f: Fabrial): UsoCarga[] {
  const usos = efeitoUnico(f.modelo)?.usos ?? []
  return usos.filter((u) => !u.exigeProprio || f.aprimoramentos.includes(ID_PROPRIO))
}

/** Efeito único pelo nome, sem ligar pra acento/caixa — o Shards não guarda qual efeito o fabrial usa. */
export function efeitoPorNome(nome: string): EfeitoUnico | undefined {
  return EFEITOS_UNICOS.find((e) => normaliza(e.nome) === normaliza(nome))
}
