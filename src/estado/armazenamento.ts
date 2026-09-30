/* arquivo: armazenamento.ts */

/**
 * Persistência em localStorage — item 2.3.
 *
 * ⚠️ A INVERSÃO QUE ESTE ARQUIVO IMPLEMENTA (ver escopo/premissas.md):
 * o JSON do Shards é SEMENTE, não fonte de verdade contínua. Importa uma
 * vez, e a partir daí o app é dono da ficha — o César ajusta o que quiser
 * e o JSON é abandonado. Por isso aqui se salva a ficha INTEIRA, e não só
 * o estado vivo: se salvasse só vida/foco, todo ajuste de ficha feito no
 * app morreria no próximo F5.
 *
 * Consequência: quem manda no boot é o localStorage, e o `fetch` do JSON
 * só acontece quando não existe nada salvo. Importar é ato
 * explícito (`importarTexto` no usePersonagem), que grava por cima.
 *
 * Nada aqui pode quebrar a ficha: localStorage falha de verdade (aba
 * privada, cota cheia, storage bloqueado). Toda leitura/escrita é
 * try/catch — e toda falha volta pra quem chama, pra TELA avisar.
 * Console o César não vê.
 */

import type { Personagem, Fabrial, Ideal } from '../tipos/personagem'
import { FABRIAIS_PADRAO, efeitoPorNome } from '../regras/fabriais'
import { CONDICOES } from '../regras/condicoes'
import type { EscolhaVaga } from '../regras/talentos'

/**
 * Sobe quando o formato salvo mudar de forma incompatível.
 * Versão sem migração = o save vai pra quarentena e a tela avisa (ver
 * `lerFicha`). Subiu este número? Escreva a entrada em MIGRACOES — o teste
 * `armazenamento.test.ts` reprova se faltar.
 */
export const VERSAO_ESQUEMA = 6

/**
 * Migrações: save de versão antiga que ainda dá pra aproveitar. Cada entrada
 * leva a ficha da versão N pra N+1 — sem ela, o save cairia no descarte.
 */
export const MIGRACOES: Record<number, (ficha: Personagem, semente?: Record<string, unknown>) => void> = {
  // v1 → v2: especialidade tinha só 'cultural' | 'especialista'; o livro tem 5
  // categorias. 'especialista' do v1 era a de Perito ("Specialist" do Shards).
  1: (ficha) => {
    for (const e of ficha.especializacoes) {
      if ((e.tipo as string) === 'especialista') e.tipo = 'perito'
    }
  },
  // v2 → v3: fabrial ganhou id, tipo, modelo, qualidade, aprimoramentos e
  // revezes. O v2 não tinha esses dados — reimportar o JSON traz tudo.
  2: (ficha) => {
    ficha.fabriais = ficha.fabriais.map((antigo) => {
      const v2 = antigo as unknown as { nome: string; cargas: Fabrial['cargas']; padrao: boolean; efeitos?: string }
      const modelo = v2.padrao
        ? FABRIAIS_PADRAO.find((f) => f.nome === v2.nome)?.id
        : efeitoPorNome(v2.nome)?.id
      return {
        id: crypto.randomUUID(),
        nome: v2.nome,
        tipo: v2.padrao ? 'padrao' : 'unico',
        modelo,
        cargas: v2.cargas,
        aprimoramentos: [],
        revezes: [],
        notas: v2.efeitos,
      }
    })
  },
  // v3 → v4: condição era { nome, duracao } em texto livre; virou id do livro +
  // parâmetro (regras/condicoes.ts). Lesão era { tipo, descricao }; ganhou
  // gravidade e efeito d8. Nome fora das 14 não tem como ser adivinhado — mas
  // no v3 não havia tela pra marcar condição, então só chega o que veio do Shards.
  3: (ficha) => {
    const porNome = new Map(CONDICOES.map((c) => [c.nome.toLowerCase(), c.id]))
    ficha.condicoes = (ficha.condicoes as unknown as { nome?: string }[]).flatMap((antiga) => {
      const id = porNome.get(antiga.nome?.toLowerCase() ?? '')
      return id ? [{ uid: crypto.randomUUID(), id }] : []
    })
    ficha.lesoes = (ficha.lesoes as unknown as { tipo: string; descricao: string; diasRestantes?: number }[]).map((l) => ({
      uid: crypto.randomUUID(),
      gravidade: l.tipo === 'permanente' ? 'permanente' : 'leve',
      efeito: 'outro',
      descricao: l.descricao || undefined,
      diasRestantes: l.diasRestantes,
    }))
  },
  // v4 → v5: Ideal ganhou `marcos` (0–3) e a lista passou a trazer o PRÓXIMO
  // Ideal a jurar. Jurado = 3 marcos (é o que o Shards grava); os marcos do
  // próximo não existiam no v4 — começa em 0, reimportar traz o do Shards.
  4: (ficha) => {
    if (!ficha.radiante) return
    const ideais = ficha.radiante.ideais as (Omit<Ideal, 'marcos'> & { marcos?: number })[]
    for (const i of ideais) i.marcos = i.jurado ? 3 : 0
    const ultimo = Math.max(0, ...ideais.filter((i) => i.jurado).map((i) => i.n))
    if (ultimo < 5 && !ideais.some((i) => i.n === ultimo + 1)) {
      ideais.push({ n: (ultimo + 1) as Ideal['n'], jurado: false, texto: '', marcos: 0 })
      ideais.sort((x, y) => x.n - y.n)
    }
  },
  // v5 → v6: o "Equipment" do Shards (texto livre) passou a entrar na ficha.
  // O save já guarda o JSON cru — dá pra buscar lá sem reimportar.
  5: (ficha, semente) => {
    ficha.equipamentoTexto = typeof semente?.equipment === 'string' ? semente.equipment : ''
  },
}

export type FichaSalva = {
  versaoEsquema: number
  salvoEm: string // ISO — só pra diagnóstico ("de quando é esse save?")
  ficha: Personagem
  /** Escolhas de vaga de talento: moram fora da ficha, mas são do jogador. */
  escolhasTalento: Record<string, EscolhaVaga>
  /**
   * O personagem CRU do Shards da última importação — base da exportação de
   * volta (estado/exportarShards.ts). Opcional: save anterior a 27/Set/2026
   * não tem, e aí exportar pede uma importação antes.
   */
  semente?: Record<string, unknown>
}

/** Uma chave por personagem — o item 4.4 (multi-personagem) já cabe aqui. */
function chave(id: string): string {
  return `cosmarcos:ficha:${id}`
}

/**
 * Confere o mínimo pra não aplicar lixo na tela. Não valida a ficha campo
 * a campo de propósito: quem faz validação forte é o tradutor
 * (importarShards), na entrada de dado novo. Aqui o dado já passou por lá
 * uma vez — o risco real é save de outra versão ou JSON truncado.
 */
function pareceFichaSalva(x: unknown): x is FichaSalva {
  if (typeof x !== 'object' || x === null) return false
  const c = x as Partial<FichaSalva>
  return (
    typeof c.versaoEsquema === 'number' &&
    typeof c.ficha === 'object' &&
    c.ficha !== null &&
    typeof c.ficha.meta?.nome === 'string'
  )
}

/**
 * Leva um save de versão antiga até a atual. `null` = versão sem migração
 * (mais nova que o app, ou buraco na tabela) — quem chama decide o que fazer.
 */
function migrar(dado: FichaSalva): FichaSalva | null {
  while (dado.versaoEsquema < VERSAO_ESQUEMA && MIGRACOES[dado.versaoEsquema]) {
    MIGRACOES[dado.versaoEsquema](dado.ficha, dado.semente)
    dado.versaoEsquema += 1
  }
  return dado.versaoEsquema === VERSAO_ESQUEMA ? dado : null
}

/** Cópia de segurança de um save que não abriu — uma por ocorrência, com data. */
function chaveDescartado(id: string): string {
  return `cosmarcos:descartado:${id}:${new Date().toISOString()}`
}

/**
 * Save que existia mas não abriu. ANTES de a semente gravar por cima, o texto
 * cru vai pra uma chave própria — senão o próximo save apagaria a única cópia.
 * Foi o risco mais caro do app (29/Set/2026): perda total, avisada só no console.
 */
function quarentena(id: string, cru: string, motivo: string): Leitura {
  try {
    localStorage.setItem(chaveDescartado(id), cru)
  } catch (e) {
    console.warn('[cosmarcos] não consegui guardar a cópia do save descartado:', e)
  }
  console.warn(`[cosmarcos] ${motivo}`)
  return { salva: null, problema: motivo }
}

export type Leitura = {
  salva: FichaSalva | null
  /** Havia save, mas não abriu — a tela TEM que avisar (ver `quarentena`). */
  problema?: string
}

/** A ficha salva deste personagem — ou `null`, com o motivo se havia save e ele não prestou. */
export function lerFicha(id: string): Leitura {
  let cru: string | null
  try {
    cru = localStorage.getItem(chave(id))
  } catch (e) {
    console.warn('[cosmarcos] localStorage indisponível pra leitura:', e)
    return { salva: null, problema: 'o navegador bloqueou o armazenamento deste site.' }
  }
  if (!cru) return { salva: null }

  let dado: unknown
  try {
    dado = JSON.parse(cru)
  } catch {
    return quarentena(id, cru, 'o save estava corrompido (não é JSON).')
  }
  if (!pareceFichaSalva(dado)) {
    return quarentena(id, cru, 'o save está num formato que o app não reconhece.')
  }
  const versao = dado.versaoEsquema
  const migrado = migrar(dado)
  if (!migrado) {
    return quarentena(id, cru, `o save é do esquema v${versao} e o app é v${VERSAO_ESQUEMA}.`)
  }
  return { salva: migrado }
}

/** O save descartado mais recente deste personagem (texto cru), pra baixar. */
export function lerDescartado(id: string): string | null {
  try {
    const prefixo = `cosmarcos:descartado:${id}:`
    const chaves = Object.keys(localStorage).filter((k) => k.startsWith(prefixo)).sort()
    const ultima = chaves.at(-1)
    return ultima ? localStorage.getItem(ultima) : null
  } catch {
    return null
  }
}

/**
 * Lê um arquivo de BACKUP do app (o mesmo pacote do save). `null` = não é
 * backup — quem chama tenta como export do Shards. Backup de versão sem
 * migração vira erro com mensagem, nunca ficha pela metade.
 */
export function lerBackup(json: unknown): FichaSalva | null {
  if (!pareceFichaSalva(json)) return null
  const versao = json.versaoEsquema
  const migrado = migrar(json)
  if (!migrado) throw new Error(`Backup do esquema v${versao}; este app lê até v${VERSAO_ESQUEMA}. Atualize o app.`)
  return migrado
}

/** O pacote completo — é o save e é o backup. */
export function montarPacote(
  ficha: Personagem,
  escolhasTalento: Record<string, EscolhaVaga>,
  semente: Record<string, unknown> | undefined,
): FichaSalva {
  return { versaoEsquema: VERSAO_ESQUEMA, salvoEm: new Date().toISOString(), ficha, escolhasTalento, semente }
}

/** Grava a ficha inteira + as escolhas de vaga. `false` = NÃO salvou, e a tela tem que dizer. */
export function salvarFicha(
  id: string,
  ficha: Personagem,
  escolhasTalento: Record<string, EscolhaVaga>,
  semente: Record<string, unknown> | undefined,
): boolean {
  try {
    localStorage.setItem(chave(id), JSON.stringify(montarPacote(ficha, escolhasTalento, semente)))
    return true
  } catch (e) {
    // Cota cheia ou storage bloqueado. A sessão continua — só não persiste.
    console.warn('[cosmarcos] não consegui salvar a ficha:', e)
    return false
  }
}
