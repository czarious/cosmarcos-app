/* arquivo: useTurno.ts */
import { useCallback, useEffect, useState } from 'react'
import type { Condicao, Personagem } from '../tipos/personagem'
import type { NomeRecurso } from './usePersonagem'
import {
  aprimorarVenceAgora,
  avaliar,
  comecarTurno,
  custoEfetivo,
  encerrarTurno,
  gastar,
  iniciarCombate,
  type AcaoUsavel,
  type EstadoTurno,
  type TipoTurno,
} from '../regras/turno'
import { condicoesEfetivas } from '../regras/condicoes'
import { patamarPorNivel } from '../regras/pericias'

// O rastreador de turno LIGADO À FICHA: a conta das ▶/↻ é de regras/turno.ts;
// aqui ela vira gasto de Foco/Investidura/carga, condição aplicada e cura.
//
// O estado do combate NÃO entra no save da ficha: é passageiro (acaba com o
// combate) e não vai pro Shards. Mora numa chave própria do localStorage só
// pra sobreviver a tela apagando ou F5 no meio da luta.

/** Marca as condições que o Aprimorar pôs — é por ela que o fim do efeito as acha. */
export const NOTA_APRIMORAR = 'Aprimorar (Luz das Tempestades)'

/** O que a API da ficha (usePersonagem) precisa oferecer pro turno mexer nela. */
export type FichaParaTurno = {
  alterarRecurso: (qual: NomeRecurso, delta: number) => void
  definirRecurso: (qual: NomeRecurso, valor: number) => void
  adicionarCondicao: (c: Omit<Condicao, 'uid'>) => void
  removerCondicao: (uid: string) => void
  alterarCargas: (idFabrial: string, delta: number) => void
  fazerDescansoCurto: (vida: number, foco: number) => void
}

/** O que o jogador informa quando a ação depende do dado rolado na mão. */
export type ExtraUso = {
  /** Restaurar: o 1d6 rolado (o patamar o app soma). */
  d6?: number
  /** Recuperar: como dividiu o dado de recuperação. */
  vida?: number
  foco?: number
  /** Preparar: ▶ da ação que ficou preparada. */
  reservar?: number
}

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
  const nome = ficha?.meta.nome

  // Carrega quando a ficha chega (ou troca de personagem).
  useEffect(() => {
    setEstado(ler(ficha))
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

  const tirarAprimorar = useCallback(() => {
    if (!ficha) return
    for (const c of ficha.condicoes) if (c.id === 'aprimorado' && c.nota === NOTA_APRIMORAR) api.removerCondicao(c.uid)
  }, [ficha, api])

  const iniciar = useCallback(() => ficha && gravar(iniciarCombate(ficha)), [ficha, gravar])

  const comecar = useCallback(
    (tipo: TipoTurno) => {
      if (!ficha || !estado) return
      // Potencializado: "Investidura cheia no início de cada turno seu"
      if (condicoesEfetivas(ficha).some((c) => c.id === 'potencializado')) {
        api.definirRecurso('investidura', ficha.recursos.investidura.max)
      }
      gravar(comecarTurno(estado, ficha, tipo))
    },
    [ficha, estado, api, gravar],
  )

  /** `manterAprimorar`: só conta quando o Aprimorado vence neste turno (aprimorarVenceAgora). */
  const encerrar = useCallback(
    (manterAprimorar = false) => {
      if (!ficha || !estado) return
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
      gravar({ ...encerrarTurno(estado), aprimorarAte })
    },
    [ficha, estado, api, gravar, tirarAprimorar],
  )

  const encerrarCombate = useCallback(() => {
    // O Aprimorar se mede em turnos; sem turno, ele acaba junto.
    if (estado?.aprimorarAte !== null && estado?.aprimorarAte !== undefined) tirarAprimorar()
    gravar(null)
  }, [estado, gravar, tirarAprimorar])

  const usar = useCallback(
    (acao: AcaoUsavel, extra: ExtraUso = {}) => {
      if (!ficha || !avaliar(acao, estado, ficha).pode) return
      const custo = custoEfetivo(acao, ficha)
      if (custo.foco) api.alterarRecurso('foco', -custo.foco)
      if (custo.investidura) api.alterarRecurso('investidura', -custo.investidura)
      if (acao.cargas) api.alterarCargas(acao.cargas.idFabrial, -acao.cargas.qtd)

      let novo = estado ? gastar(acao, estado, ficha, extra.reservar ?? 0) : null
      switch (acao.efeito) {
        case 'inspirar':
          api.definirRecurso('investidura', ficha.recursos.investidura.max)
          break
        case 'aprimorar':
          tirarAprimorar() // renovar não empilha: continua +1, só estica o prazo
          api.adicionarCondicao({ id: 'aprimorado', valor: 1, atributo: 'forca', nota: NOTA_APRIMORAR })
          api.adicionarCondicao({ id: 'aprimorado', valor: 1, atributo: 'velocidade', nota: NOTA_APRIMORAR })
          // "até o final do PRÓXIMO turno" — fora de combate não há turno pra contar
          if (novo && novo.tipo !== null) novo = { ...novo, aprimorarAte: novo.rodada + 1 }
          break
        case 'restaurar':
          api.alterarRecurso('vida', (extra.d6 ?? 0) + patamarPorNivel(ficha.meta.nivel))
          break
        case 'recuperar':
          api.fazerDescansoCurto(extra.vida ?? 0, extra.foco ?? 0)
          break
      }
      if (novo) gravar(novo)
    },
    [ficha, estado, api, gravar, tirarAprimorar],
  )

  /** Gasto de Investidura que depende do resultado (fluxo: tamanho do alvo, efeito extra). */
  const pagar = useCallback((investidura: number) => api.alterarRecurso('investidura', -investidura), [api])

  return { estado, iniciar, comecar, encerrar, encerrarCombate, usar, pagar }
}

export type Turno = ReturnType<typeof useTurno>
