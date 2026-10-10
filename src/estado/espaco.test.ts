/* arquivo: espaco.test.ts */
import { describe, it, expect } from 'vitest'
import { medirEspaco, LIMITE_BYTES } from './espaco'

/** localStorage de mentira: itens como chaves próprias (pra Object.keys funcionar). */
function storageCom(itens: Record<string, string>): Storage {
  const s = { ...itens } as Record<string, string>
  Object.defineProperty(s, 'getItem', { value: (k: string) => (k in s ? s[k] : null) })
  return s as unknown as Storage
}

describe('medirEspaco', () => {
  it('conta chave + valor, 2 bytes por letra (o teto do Safari)', () => {
    const e = medirEspaco(storageCom({ ab: '1234' }))
    expect(e.usadoBytes).toBe(12)
    expect(e.quaseCheio).toBe(false)
  })

  it('conta as chaves de outros projetos do mesmo site', () => {
    expect(medirEspaco(storageCom({ 'outro-app': 'x'.repeat(10) })).usadoBytes).toBe(38)
  })

  it('acima de 80% fica quase cheio; nunca passa de 100%', () => {
    const letras = (fracao: number) => 'x'.repeat((LIMITE_BYTES * fracao) / 2)
    expect(medirEspaco(storageCom({ a: letras(0.79) })).quaseCheio).toBe(false)
    expect(medirEspaco(storageCom({ a: letras(0.81) })).quaseCheio).toBe(true)
    expect(medirEspaco(storageCom({ a: letras(1.2) })).fracao).toBe(1)
  })

  it('armazenamento bloqueado não quebra', () => {
    const bloqueado = new Proxy({} as Storage, { ownKeys: () => { throw new Error('SecurityError') } })
    expect(medirEspaco(bloqueado).usadoBytes).toBe(0)
  })
})
