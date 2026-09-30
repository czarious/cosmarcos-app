/* arquivo: useTurno.ts */
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Personagem } from '../tipos/personagem'
import type { NomeRecurso } from './usePersonagem'
import {
  NOTA_APRIMORAR,
  aprimorarVenceAgora,
  comecarTurno,
  encerrarTurno,
  iniciarCombate,
  simularPlano,
  type AcaoUsavel,
  type EstadoTurno,
  type ExtraUso,
  type ItemPlano,
  type TipoTurno,
} from '../regras/turno'
import { condicoesEfetivas } from '../regras/condicoes'

// O rastreador de turno LIGADO À FICHA. A conta é de regras/turno.ts; aqui
// ela vira estado e é gravada na ficha.
//
// PLANO → CONFIRMAR → DESFAZER (pedido do César, 30/Set/2026): "Usar" só põe
// a ação no plano; nada é gasto até "Confirmar", que grava de uma vez o que
// `simularPlano` calculou. "Desfazer" volta a última confirmação inteira
// (recursos, cargas, condições e ações), enquanto o turno não acabar.
//
// O estado do combate NÃO entra no save da ficha: é passageiro (acaba com o
// combate) e não vai pro Shards. Mora numa chave própria do localStorage só
// pra sobreviver a tela apagando ou F5 no meio da luta. O plano não é salvo.

/** O que a API da ficha (usePersonagem) precisa oferecer pro turno mexer nela. */
export type FichaParaTurno = {
  alterarRecurso: (qual: NomeRecurso, delta: number) => void
  definirRecurso: (qual: NomeRecurso, valor: number) => void
  removerCondicao: (uid: string) => void
  aplicarFicha: (parte: Pick<Personagem, 'recursos' | 'fabriais' | 'condicoes'>) => void
}

/** Foto de antes de confirmar — o que o "Desfazer" devolve. */
type Foto = { estado: EstadoTurno | null } & Pick<Personagem, 'recursos' | 'fabriais' | 'condicoes'>

function chaveSave(ficha: Personagem): string {
  return `cosmarcos:turno:${ficha.meta.nome}`
}

function ler(ficha: Personagem | null): EstadoTurno | null {
  if (!ficha) return null
  try {
    const cru = localStorage.getItem(chaveSave(ficha))
    return cru ? (JSON.parse(cru) as EstadoTurno) : null
  } catch {
    return null
  }
}

export function useTurno(ficha: Personagem | null, api: FichaParaTurno) {
  const [estado, setEstado] = useState<EstadoTurno | null>(null)
  const [plano, setPlano] = useState<ItemPlano[]>([])
  const [foto, setFoto] = useState<Foto | null>(null)
  const nome = ficha?.meta.nome

  // Carrega quando a ficha chega (ou troca de personagem).
  useEffect(() => {
    setEstado(ler(ficha))
    setPlano([])
    setFoto(null)
    // só a identidade da ficha importa aqui, não cada mudança de Vida
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nome])

  const gravar = useCallback(
    (novo: EstadoTurno | null) => {
      setEstado(novo)
      if (!ficha) return
      try {
        if (novo) localStorage.setItem(chaveSave(ficha), JSON.stringify(novo))
        else localStorage.removeItem(chaveSave(ficha))
      } catch {
        // sem storage o turno funciona igual — só não sobrevive ao F5
      }
    },
    [ficha],
  )

  /** Como turno e ficha ficam se o plano for confirmado — a tela avalia os botões por aqui. */
  const simulacao = useMemo(() => (ficha ? simularPlano(plano, estado, ficha) : null), [plano, estado, ficha])

  const tirarAprimorar = useCallback(() => {
    if (!ficha) return
    for (const c of ficha.condicoes) if (c.id === 'aprimorado' && c.nota === NOTA_APRIMORAR) api.removerCondicao(c.uid)
  }, [ficha, api])

  /** Troca de turno fecha a janela do "Desfazer" e descarta plano não confirmado. */
  const virarPagina = useCallback(() => {
    setPlano([])
    setFoto(null)
  }, [])

  const iniciar = useCallback(() => {
    if (!ficha) return
    virarPagina()
    gravar(iniciarCombate(ficha))
  }, [ficha, gravar, virarPagina])

  const comecar = useCallback(
    (tipo: TipoTurno) => {
      if (!ficha || !estado) return
      // Potencializado: "Investidura cheia no início de cada turno seu"
      if (condicoesEfetivas(ficha).some((c) => c.id === 'potencializado')) {
        api.definirRecurso('investidura', ficha.recursos.investidura.max)
      }
      virarPagina()
      gravar(comecarTurno(estado, ficha, tipo))
    },
    [ficha, estado, api, gravar, virarPagina],
  )

  /** `manterAprimorar`: só conta quando o Aprimorado vence neste turno (aprimorarVenceAgora). */
  const encerrar = useCallback(
    (manterAprimorar = false) => {
      if (!ficha || !estado || plano.length > 0) return
      let aprimorarAte = estado.aprimorarAte
      if (aprimorarVenceAgora(estado)) {
        if (manterAprimorar && ficha.recursos.investidura.atual >= 1) {
          api.alterarRecurso('investidura', -1)
          aprimorarAte = estado.rodada + 1
        } else {
          tirarAprimorar()
          aprimorarAte = null
        }
      }
      // Surpreendido: "removida após seu próximo turno" — só a marcada à mão;
      // a que vem de lesão fica enquanto a lesão durar.
      for (const c of ficha.condicoes) if (c.id === 'surpreendido') api.removerCondicao(c.uid)
      virarPagina()
      gravar({ ...encerrarTurno(estado), aprimorarAte })
    },
    [ficha, estado, plano, api, gravar, tirarAprimorar, virarPagina],
  )

  const encerrarCombate = useCallback(() => {
    // O Aprimorar se mede em turnos; sem turno, ele acaba junto.
    if (estado?.aprimorarAte !== null && estado?.aprimorarAte !== undefined) tirarAprimorar()
    virarPagina()
    gravar(null)
  }, [estado, gravar, tirarAprimorar, virarPagina])

  /** Põe no plano — se couber, contando o que já está no plano. Nada é gasto aqui. */
  const adicionar = useCallback(
    (acao: AcaoUsavel, extra: ExtraUso = {}) => {
      if (!ficha) return
      const teste = simularPlano([...plano, { acao, extra }], estado, ficha)
      if (!teste.avaliacoes.at(-1)?.pode) return
      setPlano([...plano, { acao, extra }])
    },
    [ficha, plano, estado],
  )

  /** Tira um item e, junto, o que dependia dele e deixou de caber (ex.: a carga "ao acertar" do ataque tirado). */
  const remover = useCallback(
    (indice: number) => {
      if (!ficha) return
      let novo = plano.filter((_, i) => i !== indice)
      for (;;) {
        const av = simularPlano(novo, estado, ficha).avaliacoes
        const quebrado = av.findIndex((a) => !a.pode)
        if (quebrado < 0) break
        novo = novo.filter((_, i) => i !== quebrado)
      }
      setPlano(novo)
    },
    [ficha, plano, estado],
  )

  const limpar = useCallback(() => setPlano([]), [])

  const confirmar = useCallback(() => {
    if (!ficha || !simulacao || plano.length === 0) return
    setFoto({ estado, recursos: ficha.recursos, fabriais: ficha.fabriais, condicoes: ficha.condicoes })
    const { ficha: f, estado: e } = simulacao
    api.aplicarFicha({ recursos: f.recursos, fabriais: f.fabriais, condicoes: f.condicoes })
    if (e !== estado) gravar(e)
    setPlano([])
  }, [ficha, simulacao, plano, estado, api, gravar])

  const desfazer = useCallback(() => {
    if (!foto) return
    api.aplicarFicha({ recursos: foto.recursos, fabriais: foto.fabriais, condicoes: foto.condicoes })
    gravar(foto.estado)
    setFoto(null)
  }, [foto, api, gravar])

  return {
    estado,
    plano,
    /** Turno e ficha como ficam se o plano for confirmado. */
    simulacao,
    podeDesfazer: foto !== null,
    iniciar,
    comecar,
    encerrar,
    encerrarCombate,
    adicionar,
    remover,
    limpar,
    confirmar,
    desfazer,
  }
}

export type Turno = ReturnType<typeof useTurno>
export type { ExtraUso }
