/* arquivo: armazenamento.test.ts */
import { describe, it, expect, beforeEach } from 'vitest'
import { lerFicha, salvarFicha, lerDescartado, lerBackup, montarPacote, MIGRACOES, VERSAO_ESQUEMA } from './armazenamento'
import { importarShards } from './importarShards'
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
