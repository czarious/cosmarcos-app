/* arquivo: armazenamento.test.ts */
import { describe, it, expect, beforeEach } from 'vitest'
import { lerFicha, salvarFicha, lerDescartado, lerBackup, montarPacote, MIGRACOES, VERSAO_ESQUEMA, sementeMaisNova } from './armazenamento'
import { importarShards } from './importarShards'
import { guardarCopia, retirarUltimaCopia, temCopia, ultimaCopia } from './copias'
import eccho from '../../public/personagens/eccho.json'

// O risco mais caro do app é perder a ficha em silêncio (29/Set/2026).
// Estes testes travam as três portas por onde isso acontecia.

/** localStorage de mentira: itens como chaves próprias (pra Object.keys funcionar), métodos escondidos. */
function storageFalso(falharAoGravar = false): Storage {
  const s = {} as Record<string, string>
  Object.defineProperties(s, {
    getItem: { value: (k: string) => (k in s ? s[k] : null) },
    setItem: {
      value: (k: string, v: string) => {
        if (falharAoGravar) throw new Error('QuotaExceededError')
        s[k] = String(v)
      },
    },
    removeItem: { value: (k: string) => delete s[k] },
  })
  return s as unknown as Storage
}

const ficha = () => importarShards(structuredClone(eccho))[0]

beforeEach(() => {
  globalThis.localStorage = storageFalso()
})

describe('migração de esquema', () => {
  it('toda versão antiga tem migração até a atual — subiu VERSAO_ESQUEMA, escreva a entrada', () => {
    for (let v = 1; v < VERSAO_ESQUEMA; v++) expect(MIGRACOES[v], `falta MIGRACOES[${v}]`).toBeTypeOf('function')
  })
})

describe('migração v3 → v4 (condição e lesão ganharam id do livro)', () => {
  it('condição por nome vira id; lesão ganha gravidade e efeito "outro"', () => {
    const f = ficha() as unknown as Record<string, unknown>
    f.condicoes = [{ nome: 'Lento' }, { nome: 'Algo que não existe' }]
    f.lesoes = [{ tipo: 'permanente', descricao: 'perna' }]
    localStorage.setItem('cosmarcos:ficha:eccho', JSON.stringify({ versaoEsquema: 3, salvoEm: '', ficha: f, escolhasTalento: {} }))
    const lida = lerFicha('eccho').salva!.ficha
    expect(lida.condicoes.map((c) => c.id)).toEqual(['lento'])
    expect(lida.lesoes[0]).toMatchObject({ gravidade: 'permanente', efeito: 'outro', descricao: 'perna' })
  })
})

describe('migração v4 → v5 (Ideal ganhou marcos)', () => {
  it('jurado vira 3 marcos e o próximo Ideal aparece com 0', () => {
    const f = ficha()
    f.radiante!.ideais = [{ n: 1, jurado: true, texto: 'Vida antes da morte.' }] as never
    localStorage.setItem('cosmarcos:ficha:eccho', JSON.stringify({ versaoEsquema: 4, salvoEm: '', ficha: f, escolhasTalento: {} }))
    const lida = lerFicha('eccho').salva!.ficha
    expect(lida.radiante!.ideais.map((i) => [i.n, i.jurado, i.marcos])).toEqual([
      [1, true, 3],
      [2, false, 0],
    ])
  })
})

describe('migração v5 → v6 (pertences em texto livre)', () => {
  it('o texto vem do JSON cru guardado no save, sem reimportar', () => {
    const f = ficha() as unknown as Record<string, unknown>
    delete f.equipamentoTexto
    MIGRACOES[5](f as never, eccho.characters[0] as unknown as Record<string, unknown>)
    expect(f.equipamentoTexto).toContain('Amuleto de Sorte')
  })
})

describe('save que não abre', () => {
  it('corrompido: avisa e guarda o texto cru antes de qualquer gravação por cima', () => {
    localStorage.setItem('cosmarcos:ficha:eccho', '{isso não é json')
    const r = lerFicha('eccho')
    expect(r.salva).toBeNull()
    expect(r.problema).toMatch(/corrompido/)
    expect(lerDescartado('eccho')).toBe('{isso não é json')
  })

  it('esquema mais novo que o app: avisa e guarda a cópia', () => {
    const futuro = JSON.stringify({ ...montarPacote(ficha(), {}, undefined), versaoEsquema: VERSAO_ESQUEMA + 1 })
    localStorage.setItem('cosmarcos:ficha:eccho', futuro)
    const r = lerFicha('eccho')
    expect(r.problema).toMatch(/esquema/)
    expect(lerDescartado('eccho')).toBe(futuro)
  })

  it('sem save nenhum não é problema (primeira abertura)', () => {
    expect(lerFicha('eccho')).toEqual({ salva: null })
  })
})

describe('gravar', () => {
  it('devolve false quando o navegador recusa — a tela não pode dizer "salva"', () => {
    globalThis.localStorage = storageFalso(true)
    expect(salvarFicha('eccho', ficha(), {}, undefined)).toBe(false)
  })

  it('grava e lê de volta idêntico', () => {
    const f = ficha()
    expect(salvarFicha('eccho', f, {}, undefined)).toBe(true)
    expect(lerFicha('eccho').salva?.ficha).toEqual(f)
  })
})

describe('backup', () => {
  it('ida e volta pelo arquivo devolve a mesma ficha, escolhas e semente', () => {
    const pacote = montarPacote(ficha(), {}, eccho.characters[0] as Record<string, unknown>)
    const volta = lerBackup(JSON.parse(JSON.stringify(pacote)))
    expect(volta?.ficha).toEqual(pacote.ficha)
    expect(volta?.semente).toEqual(pacote.semente)
  })

  it('export do Shards não é confundido com backup', () => {
    expect(lerBackup(structuredClone(eccho))).toBeNull()
  })
})

describe('save de esquema antigo', () => {
  const antigo = () => JSON.stringify({ ...montarPacote(ficha(), {}, undefined), versaoEsquema: VERSAO_ESQUEMA - 1 })

  it('antes de converter, o original vai pra pasta das cópias', () => {
    const cru = antigo()
    localStorage.setItem('cosmarcos:ficha:eccho', cru)
    expect(lerFicha('eccho').salva?.versaoEsquema).toBe(VERSAO_ESQUEMA)
    expect(ultimaCopia('eccho', 'antes-de-atualizar')).toBe(cru)
  })

  it('conversão que quebra vira quarentena com aviso, nunca tela branca', () => {
    const original = MIGRACOES[VERSAO_ESQUEMA - 1]
    MIGRACOES[VERSAO_ESQUEMA - 1] = () => {
      throw new Error('campo sumiu')
    }
    try {
      localStorage.setItem('cosmarcos:ficha:eccho', antigo())
      const r = lerFicha('eccho')
      expect(r.salva).toBeNull()
      expect(r.problema).toMatch(/conversão/)
      expect(lerDescartado('eccho')).not.toBeNull()
    } finally {
      MIGRACOES[VERSAO_ESQUEMA - 1] = original
    }
  })
})

describe('pasta das cópias', () => {
  it('guarda só as últimas 3 de antes de importar', () => {
    for (const n of [1, 2, 3, 4]) guardarCopia('eccho', 'antes-de-importar', `ficha ${n}`)
    expect(Object.keys(localStorage).filter((k) => k.startsWith('cosmarcos:copia:eccho:antes-de-importar:'))).toHaveLength(3)
    expect(ultimaCopia('eccho', 'antes-de-importar')).toBe('ficha 4')
  })

  it('"voltar" tira a mais recente e a anterior vira a próxima', () => {
    guardarCopia('eccho', 'antes-de-importar', 'original')
    guardarCopia('eccho', 'antes-de-importar', 'importação errada')
    expect(retirarUltimaCopia('eccho', 'antes-de-importar')).toBe('importação errada')
    expect(retirarUltimaCopia('eccho', 'antes-de-importar')).toBe('original')
    expect(temCopia('eccho', 'antes-de-importar')).toBe(false)
  })

  it('cópias da v0.14.0 (chaves soltas) entram na pasta sem se perder', () => {
    localStorage.setItem('cosmarcos:antes-importar:eccho', 'antes velho')
    localStorage.setItem('cosmarcos:descartado:eccho:2026-10-01T00:00:00.000Z', 'quebrado velho')
    expect(ultimaCopia('eccho', 'antes-de-importar')).toBe('antes velho')
    expect(lerDescartado('eccho')).toBe('quebrado velho')
    expect(localStorage.getItem('cosmarcos:antes-importar:eccho')).toBeNull()
  })
})

describe('ficha-semente mais nova que o save', () => {
  const velha = { id: 'eccho', updatedAt: '2026-07-03T17:46:26.005Z' }
  const nova = { id: 'eccho', updatedAt: '2026-09-28T02:26:07.533Z' }
  it('mesmo personagem, semente mais nova: avisa', () => {
    expect(sementeMaisNova(velha, nova)).toBe(true)
  })
  it('save igual ou mais novo que a semente: não avisa', () => {
    expect(sementeMaisNova(nova, nova)).toBe(false)
    expect(sementeMaisNova(nova, velha)).toBe(false)
  })
  it('outro personagem: a semente não é dele', () => {
    expect(sementeMaisNova({ id: 'outro', updatedAt: velha.updatedAt }, nova)).toBe(false)
  })
  it('save antigo sem semente: avisa', () => {
    expect(sementeMaisNova(undefined, nova)).toBe(true)
  })
})
