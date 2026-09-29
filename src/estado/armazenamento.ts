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
 * try/catch e o pior caso é cair na semente, nunca tela branca.
 */

import type { Personagem, Fabrial } from '../tipos/personagem'
import { FABRIAIS_PADRAO, efeitoPorNome } from '../regras/fabriais'
import type { EscolhaVaga } from '../regras/talentos'

/**
 * Sobe quando o formato salvo mudar de forma incompatível.
 * Versão desconhecida = descarta e volta pra semente (ver `lerFicha`) —
 * é a migração que o mapa-app.md §3 exige: ficha salva no celular não
 * pode virar lixo silencioso.
 */
export const VERSAO_ESQUEMA = 3

/**
 * Migrações: save de versão antiga que ainda dá pra aproveitar. Cada entrada
 * leva a ficha da versão N pra N+1 — sem ela, o save cairia no descarte.
 */
const MIGRACOES: Record<number, (ficha: Personagem) => void> = {
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

/** A ficha salva deste personagem, ou `null` se não tem / não presta. */
export function lerFicha(id: string): FichaSalva | null {
  let cru: string | null
  try {
    cru = localStorage.getItem(chave(id))
  } catch (e) {
    console.warn('[cosmarcos] localStorage indisponível pra leitura:', e)
    return null
  }
  if (!cru) return null

  let dado: unknown
  try {
    dado = JSON.parse(cru)
  } catch {
    console.warn(`[cosmarcos] save corrompido em "${chave(id)}" — usando o JSON de semente.`)
    return null
  }

  if (!pareceFichaSalva(dado)) {
    console.warn(`[cosmarcos] save em formato irreconhecível em "${chave(id)}" — usando o JSON de semente.`)
    return null
  }
  while (dado.versaoEsquema < VERSAO_ESQUEMA && MIGRACOES[dado.versaoEsquema]) {
    MIGRACOES[dado.versaoEsquema](dado.ficha)
    dado.versaoEsquema += 1
  }
  if (dado.versaoEsquema !== VERSAO_ESQUEMA) {
    console.warn(
      `[cosmarcos] save é do esquema v${dado.versaoEsquema}, o app é v${VERSAO_ESQUEMA} — ` +
        'descartado. Importe o JSON do Shards de novo.',
    )
    return null
  }
  return dado
}

/** Grava a ficha inteira + as escolhas de vaga. Falha em silêncio avisado. */
export function salvarFicha(
  id: string,
  ficha: Personagem,
  escolhasTalento: Record<string, EscolhaVaga>,
  semente: Record<string, unknown> | undefined,
): void {
  const pacote: FichaSalva = {
    versaoEsquema: VERSAO_ESQUEMA,
    salvoEm: new Date().toISOString(),
    ficha,
    escolhasTalento,
    semente,
  }
  try {
    localStorage.setItem(chave(id), JSON.stringify(pacote))
  } catch (e) {
    // Cota cheia ou storage bloqueado. A sessão continua — só não persiste.
    console.warn('[cosmarcos] não consegui salvar a ficha:', e)
  }
}
