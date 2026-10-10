/* arquivo: banco.test.ts */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { abrirBanco, armazem, aoFalharGravacao, fecharBancoParaTeste, letrasNoBanco, type Fundo } from './banco'
import { salvarFicha, lerFicha } from './armazenamento'
import { guardarCopia, temCopia } from './copias'
import { importarShards } from './importarShards'
import eccho from '../../public/personagens/eccho.json'

// A mudança pro IndexedDB (10/Out/2026) não pode perder ficha: estes testes
// travam a mudança do localStorage, a gravação, a falha e o caminho de volta.

function storageFalso(): Storage {
  const s = {} as Record<string, string>
  Object.defineProperties(s, {
    getItem: { value: (k: string) => (k in s ? s[k] : null) },
    setItem: { value: (k: string, v: string) => (s[k] = String(v)) },
    removeItem: { value: (k: string) => delete s[k] },
  })
  return s as unknown as Storage
}

/** IndexedDB de mentira: um Map, com como fazer falhar. */
function fundoFalso(opcoes: { falhaAoGravar?: boolean; perdeNaCopia?: boolean } = {}) {
  const m = new Map<string, string>()
  const fundo: Fundo = {
    todas: async () => [...m],
    gravar: async (k, v) => {
      if (opcoes.falhaAoGravar) throw new Error('QuotaExceededError')
      m.set(k, v)
    },
    gravarVarias: async (pares) => {
      for (const [k, v] of pares) m.set(k, opcoes.perdeNaCopia ? v.slice(1) : v)
    },
    apagar: async (k) => void m.delete(k),
  }
  return { fundo, m }
}

const ficha = () => importarShards(structuredClone(eccho))[0]
const espera = () => new Promise((r) => setTimeout(r, 0))

beforeEach(() => {
  globalThis.localStorage = storageFalso()
  fecharBancoParaTeste()
})
afterEach(() => fecharBancoParaTeste())

describe('banco (IndexedDB)', () => {
  it('na 1ª abertura, a ficha e as cópias saem do localStorage e vão pro banco; preferência fica', async () => {
    salvarFicha('eccho', ficha(), {}, undefined)
    guardarCopia('eccho', 'antes-de-importar', '{"x":1}')
    localStorage.setItem('cosmarcos:idioma', 'pt')
    const { fundo, m } = fundoFalso()
    await abrirBanco(fundo)
    expect([...m.keys()].some((k) => k.startsWith('cosmarcos:ficha:eccho'))).toBe(true)
    expect([...m.keys()].some((k) => k.startsWith('cosmarcos:copia:eccho:antes-de-importar:'))).toBe(true)
    expect(localStorage.getItem('cosmarcos:ficha:eccho')).toBeNull()
    expect(localStorage.getItem('cosmarcos:idioma')).toBe('pt')
    expect(lerFicha('eccho').salva?.ficha.meta.nome).toBe('Eccho')
    expect(temCopia('eccho', 'antes-de-importar')).toBe(true)
    expect(letrasNoBanco()).toBeGreaterThan(1000)
  })

  it('se a cópia pro banco não confere, nada sai do localStorage', async () => {
    salvarFicha('eccho', ficha(), {}, undefined)
    await abrirBanco(fundoFalso({ perdeNaCopia: true }).fundo)
    expect(localStorage.getItem('cosmarcos:ficha:eccho')).not.toBeNull()
    expect(armazem()).toBe(localStorage) // ficou no caminho antigo
    expect(lerFicha('eccho').salva?.ficha.meta.nome).toBe('Eccho')
  })

  it('gravar vai pro banco; falha do banco avisa quem ouve', async () => {
    const { fundo, m } = fundoFalso()
    await abrirBanco(fundo)
    expect(salvarFicha('eccho', ficha(), {}, undefined)).toBe(true)
    await espera()
    expect(m.has('cosmarcos:ficha:eccho')).toBe(true)
    expect(localStorage.getItem('cosmarcos:ficha:eccho')).toBeNull()

    fecharBancoParaTeste()
    const ruim = fundoFalso({ falhaAoGravar: true })
    await abrirBanco(ruim.fundo)
    let avisou = false
    const parar = aoFalharGravacao(() => (avisou = true))
    salvarFicha('eccho', ficha(), {}, undefined)
    await espera()
    parar()
    expect(avisou).toBe(true)
  })

  it('sem IndexedDB, tudo continua no localStorage', async () => {
    await abrirBanco(null)
    expect(armazem()).toBe(localStorage)
    salvarFicha('eccho', ficha(), {}, undefined)
    expect(localStorage.getItem('cosmarcos:ficha:eccho')).not.toBeNull()
  })
})
