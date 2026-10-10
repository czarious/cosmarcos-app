/* arquivo: talentos.test.ts */
import { describe, it, expect } from 'vitest'
import { importarShards } from '../estado/importarShards'
import { CATALOGO_TALENTOS, acoesDeTalentos, entradaTalento, talentosDeFluxo, chaveTalentoFluxo, escolhidasNasOutras } from './talentos'
import { usavelDe } from './turno'
import eccho from '../../public/personagens/eccho.json'

const ficha = importarShards(structuredClone(eccho))[0]

describe('catálogo de talentos', () => {
  it('todo talento do Eccho acha o texto no catálogo', () => {
    expect(ficha.talentos.filter((t) => !entradaTalento(t)).map((t) => t.id)).toEqual([])
  })

  it('todo talento dos fluxos do Eccho, aprendido ou não, está no catálogo pela chave do Shards', () => {
    const faltam = ficha.radiante!.fluxos.flatMap((f) =>
      f.talentos.map((t) => chaveTalentoFluxo(f.id, t.id)).filter((k) => !CATALOGO_TALENTOS[k]),
    )
    expect(faltam).toEqual([])
  })

  it('talento de fluxo aprendido vira talento da lista, com nome PT e texto', () => {
    const r = ficha.radiante!
    const [f, ...resto] = r.fluxos
    const comFluxo = { ...ficha, radiante: { ...r, fluxos: [{ ...f, talentos: f.talentos.map((t, i) => ({ ...t, aprendido: i === 0 })) }, ...resto] } }
    const [tal] = talentosDeFluxo(comFluxo)
    expect(tal.id).toBe(chaveTalentoFluxo(f.id, f.talentos[0].id))
    expect(tal.nome).toBe(CATALOGO_TALENTOS[tal.id].nome)
    expect(entradaTalento(tal)?.descricao).toBeTruthy()
  })

  it('aba Ações: só talento de ação (▶ ▷ ↻) vira ação; ★ e ∞ ficam de fora', () => {
    const acoes = acoesDeTalentos(ficha)
    const deAcao = ficha.talentos.filter((t) => ['1acao', '2acoes', '3acoes', 'livre', 'reacao'].includes(entradaTalento(t)!.ativacao))
    expect(acoes.map((a) => a.acao.nome)).toEqual(deAcao.map((t) => entradaTalento(t)!.nome))
  })

  it('custo do catálogo só em talento de ação, e chega ao "Usar" do turno', () => {
    const comCustoErrado = Object.entries(CATALOGO_TALENTOS)
      .filter(([, e]) => e.custo && (e.ativacao === 'especial' || e.ativacao === 'sempre'))
      .map(([k]) => k)
    expect(comCustoErrado).toEqual([])
    const [chave, e] = Object.entries(CATALOGO_TALENTOS).find(([, x]) => x.custo)!
    const tal = { id: chave, nome: e.nomeEn, origem: 'heroica' as const, chave: false }
    const [{ acao }] = acoesDeTalentos({ ...ficha, talentos: [tal], radiante: undefined })
    expect(usavelDe('talento', acao).custo).toEqual(e.custo)
  })

  it('nenhuma entrada sem texto de regra', () => {
    const vazias = Object.entries(CATALOGO_TALENTOS)
      .filter(([, e]) => !e.descricao.trim() || e.descricao.includes('não encontrado na transcrição'))
      .map(([k]) => k)
    expect(vazias).toEqual([])
  })
})

describe('vagas de talento — restrições do livro', () => {
  it('a outra vaga do mesmo tipo já escolheu: não pode repetir (Erudição: duas perícias diferentes)', () => {
    const id = 'scholar::key::erudition'
    const escolhas = {
      [`${id}#pericia#0`]: { talentoId: id, tipo: 'pericia' as const, indice: 0, valor: 'crafting' },
      [`${id}#especialidade#0`]: { talentoId: id, tipo: 'especialidade' as const, indice: 0, valor: 'Mineralogia/Gemas' },
    }
    expect([...escolhidasNasOutras(id, { tipo: 'pericia', indice: 1 }, escolhas)]).toEqual(['crafting'])
    expect(escolhidasNasOutras(id, { tipo: 'pericia', indice: 0 }, escolhas).size).toBe(0) // a própria escolha não conta
  })

  it('a especialidade da Erudição é só cultural ou de utilidade (livro: 05-erudito.md)', () => {
    const vaga = CATALOGO_TALENTOS['scholar::key::erudition'].vagas?.find((v) => v.tipo === 'especialidade')
    expect(vaga?.tiposEspecialidade).toEqual(['cultural', 'utilidade'])
  })
})
