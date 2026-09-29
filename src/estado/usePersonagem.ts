/* arquivo: usePersonagem.ts */
import { useEffect, useState, useCallback, useRef } from 'react'
import type { Personagem, Item, Anotacao, Fabrial } from '../tipos/personagem'
import { importarShards, ErroImportacao } from './importarShards'
import { exportarShards } from './exportarShards'
import { CATALOGO_TALENTOS, chaveVaga, type EscolhaVaga, type TipoVaga } from '../regras/talentos'
import { vinculosDe } from '../regras/especialidades'
import { lerFicha, salvarFicha, lerBackup, lerDescartado, montarPacote } from './armazenamento'

// O estado VIVO da ficha — e quem decide de ONDE ela vem (item 2.3):
// localStorage primeiro, JSON do Shards só como SEMENTE. Depois da primeira
// importação o app é dono da ficha (ver escopo/premissas.md); recarregar do
// JSON é ato explícito, o `importarTexto` (arquivo que o jogador escolhe).

export type NomeRecurso = keyof Personagem['recursos']

type Retorno = {
  ficha: Personagem | null
  erro: string | null
  /** Soma `delta` ao atual do recurso, travando entre 0 e o máximo. */
  alterarRecurso: (qual: NomeRecurso, delta: number) => void
  /** Define o atual diretamente (também travado). */
  definirRecurso: (qual: NomeRecurso, valor: number) => void
  /** Escolhas atuais das vagas de talento (ex.: qual perícia recebe o bônus da Erudição). */
  escolhasTalento: Record<string, EscolhaVaga>
  /** Muda a escolha de uma vaga — `undefined` = "Nenhuma". */
  definirEscolhaVaga: (talentoId: string, tipo: TipoVaga, indice: number, valor: string | undefined) => void
  /** Liga/desliga `equipada` de uma arma (por nome — Arma ainda não tem id estável). */
  alternarEquipada: (nomeArma: string) => void
  /** Define os marcos (moeda) diretamente — toca no número pra editar. */
  definirMarcos: (valor: number) => void
  /** Acrescenta um item ao inventário geral (aba Inventário → Gerenciar). */
  adicionarItem: (item: Item) => void
  /** Remove um item pelo índice na lista `ficha.itens`. */
  removerItem: (indice: number) => void
  /** Cria uma anotação nova (título + conteúdo) e devolve o id gerado. */
  adicionarAnotacao: (titulo: string, conteudo: string) => void
  /** Substitui título/conteúdo de uma anotação existente. */
  editarAnotacao: (id: string, titulo: string, conteudo: string) => void
  /** Remove uma anotação pelo id. */
  removerAnotacao: (id: string) => void
  /** Soma `delta` às cargas de um fabrial, travando entre 0 e o máximo. */
  alterarCargas: (idFabrial: string, delta: number) => void
  /** Grantormenta: todo fabrial volta ao máximo (01-usando-itens.md → "Recarregando Itens"). */
  recarregarTodos: () => void
  /** Descanso curto: 1 ponto de Investidura vira 1 carga do fabrial. */
  recarregarComInvestidura: (idFabrial: string) => void
  /** Cria ou substitui (mesmo id) um fabrial. */
  salvarFabrial: (f: Fabrial) => void
  removerFabrial: (idFabrial: string) => void
  /**
   * Importa o texto de um JSON — export do Shards (item 3.1) OU backup do
   * próprio app (reconhecido pelo formato). Devolve a mensagem de erro, ou
   * `null` se deu certo.
   * ⚠️ SOBRESCREVE TUDO — não existe fusão do que foi mudado no app com o
   * JSON novo. Trazer um JSON desatualizado é perda de dado, e a ficha não
   * tem como adivinhar qual lado está certo.
   */
  importarTexto: (texto: string) => string | null
  /** JSON pro Shards importar (Files → Import JSON), ou `null` se ainda não há semente — ver exportarShards.ts. */
  exportarJson: () => string | null
  /** Backup COMPLETO do app (ficha + escolhas + semente) — volta pelo `importarTexto`. */
  backupJson: () => string | null
  /** `false` = a última gravação falhou. A tela não pode dizer "salva". */
  salvou: boolean
  /** O save deste aparelho não abriu e foi pra quarentena — aviso fixo até o jogador dispensar. */
  alertaSave: string | null
  dispensarAlertaSave: () => void
  /** Texto cru do save que não abriu, pra baixar e recuperar. */
  saveDescartado: () => string | null
}

/**
 * Valor INICIAL das vagas de talento — semeado a partir do que já
 * confirmamos com o César (regras/especialidades.ts). A partir daqui é
 * só estado vivo: o jogador pode trocar no dropdown a qualquer momento,
 * sem precisar editar código nem reimportar o JSON.
 */
export function semearEscolhas(ficha: Personagem): Record<string, EscolhaVaga> {
  const seed: Record<string, EscolhaVaga> = {}
  // Vínculo é POR PERSONAGEM. Quem não tem entrada nasce com as vagas vazias —
  // e o total da perícia se vira com o bônus cru do Shards, marcado.
  const vinculos = vinculosDe(ficha.meta.nome)
  for (const t of ficha.talentos) {
    const vagas = CATALOGO_TALENTOS[t.id]?.vagas
    if (!vagas) continue
    const vinculo = vinculos[t.id]
    for (const vaga of vagas) {
      const valor =
        vaga.tipo === 'pericia'
          ? vinculo?.periciasIds?.[vaga.indice]
          : vinculo?.especialidades?.[vaga.indice]
      seed[chaveVaga(t.id, vaga.tipo, vaga.indice)] = {
        talentoId: t.id,
        tipo: vaga.tipo,
        indice: vaga.indice,
        valor,
      }
    }
  }
  return seed
}

function trava(valor: number, max: number): number {
  return Math.max(0, Math.min(valor, max))
}

/**
 * "./personagens/eccho.json" → "eccho" — a chave do save.
 * Vira `meta.nome` quando o item 3.1 (UI de importar) chegar: lá o arquivo
 * não mora mais no repositório e o caminho deixa de identificar ninguém.
 */
function idDoCaminho(caminho: string): string {
  return caminho.split('/').pop()?.replace(/\.json$/i, '') ?? 'ficha'
}

export function usePersonagem(caminhoJson: string): Retorno {
  const id = idDoCaminho(caminhoJson)
  const [ficha, setFicha] = useState<Personagem | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [escolhasTalento, setEscolhasTalento] = useState<Record<string, EscolhaVaga>>({})
  /** O personagem cru do Shards — base da exportação de volta. */
  const [semente, setSemente] = useState<Record<string, unknown> | undefined>(undefined)
  /**
   * Trava do save. Sem ela o primeiro render (ficha ainda `null`) e o
   * intervalo da importação poderiam gravar por cima de um save válido
   * antes de terminar de lê-lo.
   */
  const podeSalvar = useRef(false)
  const [salvou, setSalvou] = useState(true)
  const [alertaSave, setAlertaSave] = useState<string | null>(null)

  // CARGA — o localStorage manda; o JSON é o plano B (ver escopo/premissas.md).
  useEffect(() => {
    podeSalvar.current = false

    const { salva, problema } = lerFicha(id)
    if (problema) setAlertaSave(problema)
    if (salva) {
      setFicha(salva.ficha)
      setEscolhasTalento(salva.escolhasTalento)
      setSemente(salva.semente)
      setErro(null)
      podeSalvar.current = true
      return
    }

    // Nada salvo (primeira vez, ou a importação acabou de limpar) → semente.
    let cancelado = false // StrictMode monta 2× em dev: descarta o fetch órfão
    fetch(caminhoJson)
      .then((r) => {
        if (!r.ok) throw new Error(`não achei o JSON (HTTP ${r.status})`)
        return r.json()
      })
      .then((json) => {
        if (cancelado) return
        const novaFicha = importarShards(json)[0]
        setFicha(novaFicha)
        setEscolhasTalento(semearEscolhas(novaFicha))
        setSemente(json.characters[0])
        setErro(null)
        podeSalvar.current = true // a própria semente já vira save
      })
      .catch((e) => {
        if (!cancelado) setErro(e instanceof ErroImportacao ? e.message : String(e))
      })
    return () => {
      cancelado = true
    }
  }, [caminhoJson, id])

  // GRAVA a cada mudança de ficha ou de escolha. A ficha do Eccho dá ~10 KB
  // — localStorage é sincrono, mas nessa ordem de grandeza não pesa.
  useEffect(() => {
    if (!podeSalvar.current || !ficha) return
    setSalvou(salvarFicha(id, ficha, escolhasTalento, semente))
  }, [id, ficha, escolhasTalento, semente])

  const importarTexto = useCallback((texto: string): string | null => {
    let json: unknown
    try {
      json = JSON.parse(texto)
    } catch {
      return 'Esse arquivo não é um JSON — exporte de novo no Shards (Files → Export current JSON).'
    }
    // Backup do app primeiro: restaura TUDO, inclusive o que o Shards não tem.
    let backup
    try {
      backup = lerBackup(json)
    } catch (e) {
      return String(e instanceof Error ? e.message : e)
    }
    if (backup) {
      setFicha(backup.ficha)
      setEscolhasTalento(backup.escolhasTalento)
      setSemente(backup.semente)
      setErro(null)
      podeSalvar.current = true
      return null
    }
    let novaFicha: Personagem
    try {
      novaFicha = importarShards(json)[0]
    } catch (e) {
      return e instanceof ErroImportacao ? e.message : String(e)
    }
    setFicha(novaFicha)
    setEscolhasTalento(semearEscolhas(novaFicha))
    setSemente((json as { characters: Record<string, unknown>[] }).characters[0])
    setErro(null)
    podeSalvar.current = true
    return null
  }, [])

  const exportarJson = useCallback(
    (): string | null => (ficha && semente ? exportarShards(ficha, semente) : null),
    [ficha, semente],
  )

  const definirEscolhaVaga = useCallback(
    (talentoId: string, tipo: TipoVaga, indice: number, valor: string | undefined) => {
      setEscolhasTalento((atual) => ({
        ...atual,
        [chaveVaga(talentoId, tipo, indice)]: { talentoId, tipo, indice, valor },
      }))
    },
    [],
  )

  const definirRecurso = useCallback((qual: NomeRecurso, valor: number) => {
    setFicha((atual) => {
      if (!atual) return atual
      const recurso = atual.recursos[qual]
      const novo = trava(valor, recurso.max)
      if (novo === recurso.atual) return atual // nada mudou → não re-renderiza
      return {
        ...atual,
        recursos: {
          ...atual.recursos,
          [qual]: { ...recurso, atual: novo },
        },
      }
    })
  }, [])

  const alterarRecurso = useCallback(
    (qual: NomeRecurso, delta: number) => {
      setFicha((atual) => {
        if (!atual) return atual
        const recurso = atual.recursos[qual]
        const novo = trava(recurso.atual + delta, recurso.max)
        if (novo === recurso.atual) return atual
        return {
          ...atual,
          recursos: {
            ...atual.recursos,
            [qual]: { ...recurso, atual: novo },
          },
        }
      })
    },
    [],
  )

  const alternarEquipada = useCallback((nomeArma: string) => {
    setFicha((atual) => {
      if (!atual) return atual
      return {
        ...atual,
        armas: atual.armas.map((a) => (a.nome === nomeArma ? { ...a, equipada: !a.equipada } : a)),
      }
    })
  }, [])

  const definirMarcos = useCallback((valor: number) => {
    setFicha((atual) => (atual ? { ...atual, marcos: Math.max(0, valor) } : atual))
  }, [])

  const adicionarItem = useCallback((item: Item) => {
    setFicha((atual) => (atual ? { ...atual, itens: [...atual.itens, item] } : atual))
  }, [])

  const removerItem = useCallback((indice: number) => {
    setFicha((atual) =>
      atual ? { ...atual, itens: atual.itens.filter((_, i) => i !== indice) } : atual,
    )
  }, [])

  const adicionarAnotacao = useCallback((titulo: string, conteudo: string) => {
    const nova: Anotacao = { id: crypto.randomUUID(), titulo, conteudo }
    setFicha((atual) => (atual ? { ...atual, anotacoes: [...atual.anotacoes, nova] } : atual))
  }, [])

  const editarAnotacao = useCallback((id: string, titulo: string, conteudo: string) => {
    setFicha((atual) =>
      atual
        ? {
            ...atual,
            anotacoes: atual.anotacoes.map((a) => (a.id === id ? { ...a, titulo, conteudo } : a)),
          }
        : atual,
    )
  }, [])

  const removerAnotacao = useCallback((id: string) => {
    setFicha((atual) =>
      atual ? { ...atual, anotacoes: atual.anotacoes.filter((a) => a.id !== id) } : atual,
    )
  }, [])

  const mudaFabrial = useCallback((idFabrial: string, muda: (f: Fabrial) => Fabrial) => {
    setFicha((atual) =>
      atual ? { ...atual, fabriais: atual.fabriais.map((f) => (f.id === idFabrial ? muda(f) : f)) } : atual,
    )
  }, [])

  const alterarCargas = useCallback(
    (idFabrial: string, delta: number) => {
      mudaFabrial(idFabrial, (f) => ({ ...f, cargas: { ...f.cargas, atual: trava(f.cargas.atual + delta, f.cargas.max) } }))
    },
    [mudaFabrial],
  )

  const recarregarTodos = useCallback(() => {
    setFicha((atual) =>
      atual
        ? { ...atual, fabriais: atual.fabriais.map((f) => ({ ...f, cargas: { ...f.cargas, atual: f.cargas.max } })) }
        : atual,
    )
  }, [])

  const recarregarComInvestidura = useCallback((idFabrial: string) => {
    setFicha((atual) => {
      if (!atual) return atual
      const inv = atual.recursos.investidura
      const alvo = atual.fabriais.find((f) => f.id === idFabrial)
      if (!alvo || inv.atual <= 0 || alvo.cargas.atual >= alvo.cargas.max) return atual
      return {
        ...atual,
        recursos: { ...atual.recursos, investidura: { ...inv, atual: inv.atual - 1 } },
        fabriais: atual.fabriais.map((f) =>
          f.id === idFabrial ? { ...f, cargas: { ...f.cargas, atual: f.cargas.atual + 1 } } : f,
        ),
      }
    })
  }, [])

  const salvarFabrial = useCallback((novo: Fabrial) => {
    setFicha((atual) => {
      if (!atual) return atual
      const existe = atual.fabriais.some((f) => f.id === novo.id)
      const ajustado = { ...novo, cargas: { ...novo.cargas, atual: trava(novo.cargas.atual, novo.cargas.max) } }
      return {
        ...atual,
        fabriais: existe ? atual.fabriais.map((f) => (f.id === novo.id ? ajustado : f)) : [...atual.fabriais, ajustado],
      }
    })
  }, [])

  const removerFabrial = useCallback((idFabrial: string) => {
    setFicha((atual) => (atual ? { ...atual, fabriais: atual.fabriais.filter((f) => f.id !== idFabrial) } : atual))
  }, [])

  const backupJson = useCallback(
    (): string | null => (ficha ? JSON.stringify(montarPacote(ficha, escolhasTalento, semente), null, 2) : null),
    [ficha, escolhasTalento, semente],
  )
  const dispensarAlertaSave = useCallback(() => setAlertaSave(null), [])
  const saveDescartado = useCallback(() => lerDescartado(id), [id])

  return {
    ficha,
    erro,
    alterarRecurso,
    definirRecurso,
    escolhasTalento,
    definirEscolhaVaga,
    alternarEquipada,
    definirMarcos,
    adicionarItem,
    removerItem,
    adicionarAnotacao,
    editarAnotacao,
    removerAnotacao,
    alterarCargas,
    recarregarTodos,
    recarregarComInvestidura,
    salvarFabrial,
    removerFabrial,
    importarTexto,
    exportarJson,
    backupJson,
    salvou,
    alertaSave,
    dispensarAlertaSave,
    saveDescartado,
  }
}
