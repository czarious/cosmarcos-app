/* arquivo: usePersonagem.ts */
import { useEffect, useState, useCallback, useRef } from 'react'
import type { Personagem, Item, Anotacao, Fabrial, Condicao, Lesao, Objetivo, Ideal } from '../tipos/personagem'
import { descansoCurto, descansoLongo } from '../regras/descanso'
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
  /** Veste/tira um item (armadura) pelo índice em `ficha.itens`. */
  alternarItemEquipado: (indice: number) => void
  /** Define os marcos (moeda) diretamente — toca no número pra editar. */
  definirMarcos: (valor: number) => void
  /** O texto livre de pertences (o "Equipment" do Shards). */
  definirEquipamentoTexto: (texto: string) => void
  /** Põe, troca ou (`undefined`) tira a foto do personagem. */
  definirFoto: (foto: string | undefined) => void
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
  alterarObjetivo: (indice: number, muda: Partial<Objetivo>) => void
  adicionarObjetivo: (nome: string) => void
  removerObjetivo: (indice: number) => void
  alterarIdeal: (n: Ideal['n'], muda: Partial<Ideal>) => void
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
  /** Volta a ficha de antes da última importação (a importação guarda uma cópia). `null` se não há cópia. */
  desfazerImportacao: (() => void) | null
  /** JSON pro Shards importar (Files → Import JSON), ou `null` se ainda não há semente — ver exportarShards.ts. */
  exportarJson: () => string | null
  adicionarCondicao: (c: Omit<Condicao, 'uid'>) => void
  removerCondicao: (uid: string) => void
  /** Grava de uma vez recursos, fabriais e condições — o "Confirmar" e o "Desfazer" do plano do turno. */
  aplicarFicha: (parte: Pick<Personagem, 'recursos' | 'fabriais' | 'condicoes'>) => void
  /** Cria ou substitui (mesmo `uid`) uma lesão. */
  salvarLesao: (l: Lesao) => void
  removerLesao: (uid: string) => void
  /** Soma o que o jogador distribuiu do dado de recuperação (rolado na mão). */
  fazerDescansoCurto: (vida: number, foco: number) => void
  /** Vida e Foco cheios, Exausto −1, lesão superficial cura. */
  fazerDescansoLongo: () => void
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

  // A rede de segurança da importação: antes de sobrescrever, guarda a ficha
  // atual — importar um JSON velho sem querer deixa de ser perda sem volta.
  const chaveAntes = `cosmarcos:antes-importar:${id}`
  const [temAntes, setTemAntes] = useState(() => {
    try {
      return localStorage.getItem(chaveAntes) !== null
    } catch {
      return false
    }
  })
  const guardarAntes = useCallback(() => {
    if (!ficha) return
    try {
      localStorage.setItem(chaveAntes, JSON.stringify(montarPacote(ficha, escolhasTalento, semente)))
      setTemAntes(true)
    } catch {
      // sem espaço: a importação segue, só sem a cópia (o aviso de backup continua valendo)
    }
  }, [ficha, escolhasTalento, semente, chaveAntes])

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
      guardarAntes()
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
    const novaSemente = (json as { characters: Record<string, unknown>[] }).characters[0]
    // A foto é do app (o Shards não tem): reimportar o MESMO personagem a mantém; outro personagem vem sem
    if (ficha?.foto && semente?.id === novaSemente.id) novaFicha.foto = ficha.foto
    guardarAntes()
    setFicha(novaFicha)
    setEscolhasTalento(semearEscolhas(novaFicha))
    setSemente(novaSemente)
    setErro(null)
    podeSalvar.current = true
    return null
  }, [guardarAntes, ficha, semente])

  const desfazerImportacao = useCallback(() => {
    let antes
    try {
      antes = lerBackup(JSON.parse(localStorage.getItem(chaveAntes) ?? 'null'))
    } catch {
      antes = null
    }
    if (antes) {
      setFicha(antes.ficha)
      setEscolhasTalento(antes.escolhasTalento)
      setSemente(antes.semente)
      podeSalvar.current = true
    }
    try {
      localStorage.removeItem(chaveAntes)
    } catch {
      // nada a fazer
    }
    setTemAntes(false)
  }, [chaveAntes])

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

  const alternarItemEquipado = useCallback((indice: number) => {
    setFicha((atual) => (atual ? { ...atual, itens: atual.itens.map((it, i) => (i === indice ? { ...it, equipado: !it.equipado } : it)) } : atual))
  }, [])

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

  const definirEquipamentoTexto = useCallback((texto: string) => {
    setFicha((atual) => (atual ? { ...atual, equipamentoTexto: texto } : atual))
  }, [])

  const definirFoto = useCallback((foto: string | undefined) => {
    setFicha((atual) => (atual ? { ...atual, foto } : atual))
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

  // Objetivos (livro, cap. 8 "Objetivos"): 3 marcos de história, depois concluir.
  // Pelo ÍNDICE — o Shards não dá id, e a ordem dele é a que volta na exportação.
  const alterarObjetivo = useCallback((indice: number, muda: Partial<Objetivo>) => {
    setFicha((atual) =>
      atual ? { ...atual, objetivos: atual.objetivos.map((o, i) => (i === indice ? { ...o, ...muda } : o)) } : atual,
    )
  }, [])

  const adicionarObjetivo = useCallback((nome: string) => {
    setFicha((atual) =>
      atual ? { ...atual, objetivos: [...atual.objetivos, { nome, concluido: false, grau: 0 }] } : atual,
    )
  }, [])

  const removerObjetivo = useCallback((indice: number) => {
    setFicha((atual) => (atual ? { ...atual, objetivos: atual.objetivos.filter((_, i) => i !== indice) } : atual))
  }, [])

  // Ideal = objetivo especial (livro, "Jurando Ideais"): 3 marcos → dizer as
  // Palavras. Jurou? Abre o próximo Ideal, até o 5º.
  const alterarIdeal = useCallback((n: Ideal['n'], muda: Partial<Ideal>) => {
    setFicha((atual) => {
      if (!atual?.radiante) return atual
      let ideais = atual.radiante.ideais.map((i) => (i.n === n ? { ...i, ...muda } : i))
      const jurou = muda.jurado === true && n < 5 && !ideais.some((i) => i.n === n + 1)
      if (jurou) ideais = [...ideais, { n: (n + 1) as Ideal['n'], jurado: false, texto: '', marcos: 0 }]
      return { ...atual, radiante: { ...atual.radiante, ideais } }
    })
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

  // CONDIÇÕES, LESÕES E DESCANSO (itens 1.5 e 3.3) — o que cada uma faz mora
  // em regras/condicoes.ts e regras/descanso.ts; aqui só se grava.
  const adicionarCondicao = useCallback((c: Omit<Condicao, 'uid'>) => {
    setFicha((atual) => (atual ? { ...atual, condicoes: [...atual.condicoes, { ...c, uid: crypto.randomUUID() }] } : atual))
  }, [])

  const removerCondicao = useCallback((uid: string) => {
    setFicha((atual) => (atual ? { ...atual, condicoes: atual.condicoes.filter((c) => c.uid !== uid) } : atual))
  }, [])

  const aplicarFicha = useCallback((parte: Pick<Personagem, 'recursos' | 'fabriais' | 'condicoes'>) => {
    setFicha((atual) => (atual ? { ...atual, recursos: parte.recursos, fabriais: parte.fabriais, condicoes: parte.condicoes } : atual))
  }, [])

  const salvarLesao = useCallback((l: Lesao) => {
    setFicha((atual) => {
      if (!atual) return atual
      const existe = atual.lesoes.some((x) => x.uid === l.uid)
      return { ...atual, lesoes: existe ? atual.lesoes.map((x) => (x.uid === l.uid ? l : x)) : [...atual.lesoes, l] }
    })
  }, [])

  const removerLesao = useCallback((uid: string) => {
    setFicha((atual) => (atual ? { ...atual, lesoes: atual.lesoes.filter((l) => l.uid !== uid) } : atual))
  }, [])

  const fazerDescansoCurto = useCallback((vida: number, foco: number) => {
    setFicha((atual) => (atual ? descansoCurto(atual, vida, foco) : atual))
  }, [])

  const fazerDescansoLongo = useCallback(() => {
    setFicha((atual) => (atual ? descansoLongo(atual) : atual))
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
    alternarItemEquipado,
    definirMarcos,
    definirEquipamentoTexto,
    definirFoto,
    adicionarItem,
    removerItem,
    adicionarAnotacao,
    editarAnotacao,
    removerAnotacao,
    alterarObjetivo,
    adicionarObjetivo,
    removerObjetivo,
    alterarIdeal,
    alterarCargas,
    recarregarTodos,
    recarregarComInvestidura,
    salvarFabrial,
    removerFabrial,
    adicionarCondicao,
    removerCondicao,
    aplicarFicha,
    salvarLesao,
    removerLesao,
    fazerDescansoCurto,
    fazerDescansoLongo,
    importarTexto,
    desfazerImportacao: temAntes ? desfazerImportacao : null,
    exportarJson,
    backupJson,
    salvou,
    alertaSave,
    dispensarAlertaSave,
    saveDescartado,
  }
}
