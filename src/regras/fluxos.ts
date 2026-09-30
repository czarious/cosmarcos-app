/* arquivo: fluxos.ts */
import type { Custo } from './acoes'
import type { Mensagem } from '../idioma/pt'

/**
 * GUIA DE USO DOS FLUXOS — Cap. 6. Paráfrase própria, nunca cópia do livro
 * (arquivo público, premissas.md → "GitHub Pages, repositório público").
 *
 * Chave = id do fluxo como o Shards manda (`surgeSkills[].id`). O total do
 * teste NÃO mora aqui: fluxo é perícia (regras/calculos.ts → detalhePericia).
 *
 * Só os fluxos já conferidos contra a transcrição têm guia. Fluxo sem guia
 * aparece em Ações com a ativação do Shards e sem custo automático.
 * Fonte: transcricao/06-fluxos/01-usando-fluxos.md + um arquivo por fluxo.
 */

/** Tabela "Escalonamento de Fluxo" — graduação → dado e tamanho máximo do alvo/área. */
export const ESCALONAMENTO_FLUXO: Record<number, { dado: string; tamanho: string; tamanhoEn: string }> = {
  1: { dado: 'd4', tamanho: 'Pequeno (0,75 m)', tamanhoEn: 'Small (0.75 m)' },
  2: { dado: 'd6', tamanho: 'Médio (1,5 m)', tamanhoEn: 'Medium (1.5 m)' },
  3: { dado: 'd8', tamanho: 'Grande (3 m)', tamanhoEn: 'Large (3 m)' },
  4: { dado: 'd10', tamanho: 'Enorme (4,5 m)', tamanhoEn: 'Huge (4.5 m)' },
  5: { dado: 'd12', tamanho: 'Imenso (6 m)', tamanhoEn: 'Gargantuan (6 m)' },
}

/** Botão de gasto que aparece depois de usar o fluxo — o custo que depende do que aconteceu na mesa. */
export type PagamentoFluxo = { rotulo: Mensagem; investidura: number }

export type GuiaFluxo = {
  /** Descontado ao tocar em "Usar". */
  custoAoUsar?: Custo
  /** Gastos que dependem do resultado (tamanho do alvo, efeitos extras). */
  pagamentos: (graduacao: number) => PagamentoFluxo[]
  /** O passo a passo na mesa, curto. */
  passos: string[]
  tabelaCD?: { titulo: Mensagem; colunas: Mensagem[]; linhas: { rotulo: Mensagem; cds: Array<number | null> }[] }
}

/** Os 5 tamanhos, na ordem da graduação — o nome em português e o inglês ao lado (idioma/nomes.ts). */
export const TAMANHO_EN: Record<string, string> = { Pequeno: 'Small', Médio: 'Medium', Grande: 'Large', Enorme: 'Huge', Imenso: 'Gargantuan' }
const TAMANHOS = Object.keys(TAMANHO_EN)

export const GUIAS_FLUXO: Record<string, GuiaFluxo> = {
  // 10-transformacao.md
  transformation: {
    pagamentos: (g) =>
      TAMANHOS.slice(0, Math.max(1, Math.min(5, g))).map((t, i) => ({
        rotulo: { texto: (d) => d.acoes.tamanhoMenosN, vars: { tamanho: t, n: i + 1 } },
        investidura: i + 1,
      })),
    passos: [
      'Toque o objeto (mão livre). Não vale ser vivo, Investido nem infundido.',
      'Teste de Transformação contra a CD da tabela: de qual Essência pra qual.',
      'Sucesso: pague a Investidura pelo tamanho do objeto (botões abaixo). O tamanho máximo é o do seu fluxo.',
      'Falha: não gasta Investidura, mas não tenta de novo nesse objeto nesta cena.',
    ],
    tabelaCD: {
      titulo: { texto: (d) => d.fluxos.tituloCD },
      colunas: (['solidoCurto', 'organicoCurto', 'liquidoCurto', 'vaporCurto', 'arCurto', 'chamasCurto'] as const).map((k) => ({ texto: (d) => d.fluxos[k] })),
      linhas: [
        { rotulo: { texto: (d) => d.fluxos.solido }, cds: [10, 10, 15, 20, 25, 30] },
        { rotulo: { texto: (d) => d.fluxos.organico }, cds: [10, 10, 10, 15, 20, 25] },
        { rotulo: { texto: (d) => d.fluxos.liquido }, cds: [15, 10, 10, 10, 15, 20] },
        { rotulo: { texto: (d) => d.fluxos.vapor }, cds: [20, 15, 10, 10, 10, 15] },
        { rotulo: { texto: (d) => d.fluxos.arPuro }, cds: [25, 20, 15, 10, 10, 10] },
        { rotulo: { texto: (d) => d.fluxos.chamas }, cds: [30, 25, 20, 15, 10, null] },
      ],
    },
  },
  // 11-transporte.md
  transportation: {
    custoAoUsar: { investidura: 1 },
    pagamentos: () => [{ rotulo: { texto: (d) => d.acoes.maisUmEfeito }, investidura: 1 }],
    passos: [
      'Olha o Reino Cognitivo onde você está. Cada Investidura gasta = um efeito, na distância do vínculo com o espreno:',
      'Emoções e motivações — vantagem pra influenciar, ou descobre a motivação sem Intuição.',
      'Localizar personagem — estima onde está alguém cuja chama você reconhece.',
      'Sentir Investidura — vê o que é Investido (Radiante, Moldado, Fractal, fabrial).',
      'O Mestre pode pedir teste de Transporte pra identificar o que viu.',
    ],
  },
}

/** Nota que vale pra todo fluxo — "Usando Fluxos". */
export const NOTAS_FLUXO = [
  'Infusão ativa gasta 1 Investidura no início de cada turno seu (mesmo Inconsciente). Encerrar não custa ação.',
  'Ataque de fluxo: sem sentir o alvo, desvantagem; acerto soma o total do fluxo ao dano; errou, 1 foco atinge de raspão.',
]
