/* arquivo: usePersonagem.ts */
import { useEffect, useState, useCallback } from 'react'
import type { Personagem, Item, Anotacao } from '../tipos/personagem'
import { importarShards, ErroImportacao } from './importarShards'
import { CATALOGO_TALENTOS, chaveVaga, type EscolhaVaga, type TipoVaga } from '../regras/talentos'
import { VINCULO_TALENTO_ECCHO } from '../regras/especialidades'

// O estado VIVO da ficha. Carrega o JSON (via tradutor) e guarda em estado
// React — a partir daqui os recursos são MUTÁVEIS (dano, cura, gastar foco).
// Persistência em localStorage é o item 2.3 (Fase 2); por ora, em memória.

export type NomeRecurso = 'vida' | 'foco' | 'investidura'

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
}

/**
 * Valor INICIAL das vagas de talento — semeado a partir do que já
 * confirmamos com o César (regras/especialidades.ts). A partir daqui é
 * só estado vivo: o jogador pode trocar no dropdown a qualquer momento,
 * sem precisar editar código nem reimportar o JSON.
 */
function semearEscolhas(ficha: Personagem): Record<string, EscolhaVaga> {
  const seed: Record<string, EscolhaVaga> = {}
  for (const t of ficha.talentos) {
    const vagas = CATALOGO_TALENTOS[t.id]?.vagas
    if (!vagas) continue
    const vinculo = VINCULO_TALENTO_ECCHO[t.id]
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

export function usePersonagem(caminhoJson: string): Retorno {
  const [ficha, setFicha] = useState<Personagem | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [escolhasTalento, setEscolhasTalento] = useState<Record<string, EscolhaVaga>>({})

  useEffect(() => {
    fetch(caminhoJson)
      .then((r) => {
        if (!r.ok) throw new Error(`não achei o JSON (HTTP ${r.status})`)
        return r.json()
      })
      .then((json) => {
        const novaFicha = importarShards(json)[0]
        setFicha(novaFicha)
        setEscolhasTalento(semearEscolhas(novaFicha))
      })
      .catch((e) => setErro(e instanceof ErroImportacao ? e.message : String(e)))
  }, [caminhoJson])

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
  }
}
