/* arquivo: idioma.test.ts */
import { describe, it, expect } from 'vitest'
import ts from 'typescript'
import type { Personagem, Condicao, IdCondicao } from '../tipos/personagem'
import { importarShards } from '../estado/importarShards'
import { PT, type Mensagem, type Plural } from './pt'
import { EN } from './en'
import { mensagem, nome, plural, rotulo } from './idioma'
import { NOMES_EN } from './nomes'
import { CONDICOES, acoesNoTurno, lembretes, modificadorRolagemLesao, movimentoComCondicoes } from '../regras/condicoes'
import { detalhePericia } from '../regras/calculos'
import { avisosFabrial } from '../regras/fabriais'
import { GUIAS_FLUXO } from '../regras/fluxos'
import { ARMA_NOME } from '../estado/deparaShards'
import eccho from '../../public/personagens/eccho.json'

// O que o compilador NÃO pega sozinho no idioma — o que pega (variável faltando
// num dos dois arquivos) já trava o build. Texto em português no modo EN só
// apareceria na mesa; cada teste aqui fecha uma porta por onde isso entraria.

/** Todo .tsx do app, como texto — o Vite lê na hora do teste. */
const TSX = Object.entries(import.meta.glob('../**/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>).map(
  ([f, s]) => ({ f: f.replace('../', ''), s }),
)

let n = 0
const cond = (c: Omit<Condicao, 'uid'>): Condicao => ({ ...c, uid: `c${n++}` })
const eccho_ = (mudar: Partial<Personagem> = {}): Personagem => ({ ...importarShards(structuredClone(eccho))[0], ...mudar })

/** Toda variável do dicionário, achatada: "turno.rodadaN" → texto (plural vira duas). */
function folhas(d: Record<string, Record<string, string | Plural>>): Record<string, string> {
  const r: Record<string, string> = {}
  for (const [g, grupo] of Object.entries(d)) {
    for (const [k, v] of Object.entries(grupo)) {
      if (typeof v === 'string') r[`${g}.${k}`] = v
      else for (const [forma, x] of Object.entries(v)) r[`${g}.${k}.${forma}`] = x
    }
  }
  return r
}
const lacunas = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

describe('dicionários', () => {
  const pt = folhas(PT)
  const en = folhas(EN)

  it('nenhum texto vazio', () => {
    expect(Object.entries({ ...pt, ...en }).filter(([, v]) => !v.trim()).map(([k]) => k)).toEqual([])
  })

  it('as lacunas {x} batem nos dois idiomas — senão o número some na tela', () => {
    const diferentes = Object.keys(pt).filter((k) => lacunas(pt[k]).join() !== lacunas(en[k] ?? '').join())
    expect(diferentes).toEqual([])
  })

  it('plural escolhe a forma pela regra de cada idioma', () => {
    expect(plural(PT.condicoes.dias, 1, 'pt')).toBe('1 dia')
    expect(plural(PT.condicoes.dias, 0, 'pt')).toBe('0 dia') // no português o zero é singular
    expect(plural(EN.condicoes.dias, 0, 'en')).toBe('0 days')
    expect(plural(EN.condicoes.dias, 3, 'en')).toBe('3 days')
  })
})

describe('nenhum texto cru em JSX', () => {
  it('palavra na tela sai de uma variável de texto, não escrita no componente', () => {
    // Lê o JSX de verdade (compilador do TypeScript): texto entre tags e
    // atributo de texto (aria-label, placeholder, title, label, alt) com palavra dentro.
    const cru: string[] = []
    // unidade (kg, m, d20) é igual nos dois idiomas — não é palavra
    const temPalavra = (x: string) => /[A-Za-zÀ-ú]{2,}/.test(x) && !/^\s*(kg|m|d\d+)\s*$/.test(x)
    for (const { f, s } of TSX) {
      const fonte = ts.createSourceFile(f, s, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
      const visitar = (no: ts.Node) => {
        if (ts.isJsxText(no) && temPalavra(no.text)) cru.push(`${f}: ${no.text.trim()}`)
        if (ts.isJsxAttribute(no) && no.initializer && ts.isStringLiteral(no.initializer)) {
          const nomeAttr = no.name.getText(fonte)
          if (['aria-label', 'placeholder', 'title', 'label', 'alt'].includes(nomeAttr) && temPalavra(no.initializer.text)) {
            cru.push(`${f}: ${nomeAttr}="${no.initializer.text}"`)
          }
        }
        ts.forEachChild(no, visitar)
      }
      visitar(fonte)
    }
    expect(cru).toEqual([])
  })
})

describe('nomes do jogo', () => {
  it('tudo o que a ficha do Eccho mostra tem inglês', () => {
    const f = eccho_()
    const nomes = [
      ...f.pericias.map((p) => p.nome),
      // arma criada pelo jogador (o PROJÉTIL) não tem inglês — só as do catálogo do Shards
      ...f.armas.filter((a) => Object.values(ARMA_NOME).includes(a.nome)).map((a) => a.nome),
      ...f.armas.flatMap((a) => [a.tipoDano, ...a.tracos, ...a.tracosPerito]),
      ...f.itens.map((i) => i.nome),
      ...f.radiante!.fluxos.map((x) => x.nome),
      f.meta.ancestralidade,
      f.meta.trilhaHeroica,
      f.meta.trilhaRadiante!,
      f.meta.kitInicial,
      ...f.meta.culturas,
      ...CONDICOES.map((c) => c.nome),
    ]
    expect(nomes.filter((x) => nome(x, 'en') === x)).toEqual([])
  })

  it('nome sem inglês (item criado pelo jogador) fica como veio', () => {
    expect(nome('Amuleto da vó', 'en')).toBe('Amuleto da vó')
    expect(nome('Dedução', 'en')).toBe('Deduction')
    expect(nome('Dedução', 'pt')).toBe('Dedução')
    expect(nome('Arremesso [6/18]', 'en')).toBe('Thrown [6/18]')
  })
})

describe('mensagens das regras', () => {
  /** Mensagem sem lacuna sobrando, nos dois idiomas. */
  const completa = (m: Mensagem) => !/\{\w+\}/.test(mensagem(m, 'pt')) && !/\{\w+\}/.test(mensagem(m, 'en'))

  it('condição, lesão, movimento e turno: nenhuma lacuna fica sem preencher', () => {
    const todas = CONDICOES.map((c) => c.id as IdCondicao)
    const f = eccho_({
      condicoes: todas.map((id) => cond({ id, valor: 1, atributo: 'forca', dano: id === 'afligido' ? '1d4 vital' : undefined })),
      lesoes: [{ uid: 'l1', gravidade: 'leve', efeito: 'uma-mao' }],
    })
    const msgs = [...lembretes(f), ...acoesNoTurno(f).motivos, ...acoesNoTurno(eccho_({ condicoes: [cond({ id: 'surpreendido' })] })).motivos]
    expect(msgs.length).toBeGreaterThan(5)
    expect(msgs.filter((m) => !completa(m)).map((m) => mensagem(m, 'pt'))).toEqual([])
    expect(movimentoComCondicoes(f).motivos.filter((x) => !(x in NOMES_EN))).toEqual([])
  })

  it('detalhe de um número: toda origem sai escrita nos dois idiomas', () => {
    const f = eccho_({ lesoes: [{ uid: 'l1', gravidade: 'leve', efeito: 'outro' }, { uid: 'l2', gravidade: 'grave', efeito: 'outro' }] })
    const origens = [...detalhePericia(f.pericias[0], f, {}).linhas, ...modificadorRolagemLesao(f).linhas].map((l) => l.origem)
    for (const o of origens) {
      expect(rotulo(o, 'en')).not.toMatch(/\{\w+\}/)
      expect(rotulo(o, 'pt')).not.toMatch(/\{\w+\}/)
    }
    expect(rotulo(modificadorRolagemLesao(f).linhas[1].origem, 'en')).toBe('2 injuries × −5')
  })

  it('avisos de fabrial e guia dos fluxos', () => {
    const f = eccho_()
    const avisos = f.fabriais.flatMap((fab) => avisosFabrial({ ...fab, cargas: { ...fab.cargas, max: 99 } }, f))
    expect(avisos.filter((m) => !completa(m))).toEqual([])
    const guia = GUIAS_FLUXO.transformation
    const msgs = [...guia.pagamentos(5).map((p) => p.rotulo), guia.tabelaCD!.titulo, ...guia.tabelaCD!.colunas, ...guia.tabelaCD!.linhas.map((l) => l.rotulo)]
    expect(msgs.filter((m) => !completa(m))).toEqual([])
    expect(mensagem(guia.pagamentos(2)[1].rotulo, 'en')).toBe('Medium −2')
  })
})
