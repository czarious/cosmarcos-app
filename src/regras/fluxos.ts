/* arquivo: fluxos.ts */
import type { Ativacao } from '../tipos/personagem'
import type { Custo } from './acoes'
import type { Mensagem } from '../idioma/pt'

/**
 * GUIA DE USO DOS FLUXOS — Cap. 6. Paráfrase própria, nunca cópia do livro
 * (arquivo público, premissas.md → "GitHub Pages, repositório público").
 *
 * Chave = id do fluxo como o Shards manda (`surgeSkills[].id`). O total do
 * teste NÃO mora aqui: fluxo é perícia (regras/calculos.ts → detalhePericia).
 *
 * Todo guia foi conferido contra a transcrição (Tensão ainda sem texto próprio
 * no livro transcrito). Fluxo sem guia aparece em Ações com a ativação do
 * Shards e sem custo automático.
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
  /**
   * Só no fluxo com mais de uma habilidade distinta (Transporte, Progressão, Abrasão):
   * cada uma vira um "Usar" próprio no lugar do "Usar" único. `id` = o do Shards
   * (surges.json → abilities[].id). Custo só se for fixo; variável, ajusta no topo.
   */
  habilidades?: HabilidadeFluxo[]
  /**
   * As habilidades SÃO os modos da ação do fluxo (Progressão: Crescimento ou
   * Regeneração) — somem com o "Usar" geral. Sem isto, o "Usar" fica e as
   * habilidades são extras (Transporte: cada efeito paga 1 Investidura).
   */
  habilidadesNoLugarDoUsar?: boolean
}

export type HabilidadeFluxo = {
  id: string
  nome: string
  nomeEn: string
  /** `sempre` (passiva, ex.: Deslizar) aparece sem botão. */
  ativacao: Ativacao
  custo?: Custo
  /** Pode pagar de novo no mesmo turno (efeito do Transporte). */
  repetivel?: boolean
  resumo: string
}

/** Os 5 tamanhos, na ordem da graduação — o nome em português e o inglês ao lado (idioma/nomes.ts). */
export const TAMANHO_EN: Record<string, string> = { Pequeno: 'Small', Médio: 'Medium', Grande: 'Large', Enorme: 'Huge', Imenso: 'Gargantuan' }
const TAMANHOS = Object.keys(TAMANHO_EN)

export const GUIAS_FLUXO: Record<string, GuiaFluxo> = {
  // 02-abrasao.md
  abrasion: {
    pagamentos: () => [],
    passos: [
      'Toque o objeto ou a superfície (mão livre) e pague 1+ Investidura. A infusão custa 1 por rodada e deixa tudo quase sem atrito. Tamanho máximo: o do seu fluxo.',
      'Não vale em outro personagem, em objeto Investido nem infundido. Pode mirar o que ele segura ou veste, ou o chão em que pisa: teste de Abrasão contra a defesa Física (falhou, não gasta).',
      'Quem pisa ou segura o escorregadio testa Agilidade contra a sua Abrasão; falhou, cai Prostrado ou larga o objeto.',
      'Infundir o próprio corpo (qualquer tamanho, 1 Investidura por rodada) libera Patinar e Deslizar, abaixo.',
    ],
    habilidades: [
      {
        id: 'skate',
        nome: 'Patinar',
        nomeEn: 'Skate',
        ativacao: 'livre',
        custo: { foco: 2 },
        resumo: 'Com o corpo infundido, Move em linha reta pelo chão como se patinasse no gelo.',
      },
      {
        id: 'slide',
        nome: 'Deslizar',
        nomeEn: 'Slide',
        ativacao: 'sempre',
        resumo: 'Com o corpo infundido, conta como um tamanho menor ao se espremer e tem vantagem pra escapar de amarras por atrito ou pressão.',
      },
    ],
  },
  // 03-adesao.md
  adhesion: {
    pagamentos: () => [],
    passos: [
      'Toque o alvo (mão livre) e pague 1+ Investidura: prende dois objetos a até 1,5 m um do outro. A infusão custa 1 por rodada.',
      'Cada objeto respeita o tamanho do seu fluxo (o chão, a parede ou o teto valem em qualquer tamanho). Não vale em personagem, objeto Investido nem infundido.',
      'Objeto de quem não quer: teste de Adesão contra a defesa Física (falhou, não gasta). Pode mirar o que ele segura ou veste.',
      'Pra soltar, o alvo faz Atletismo contra a sua Adesão. Sucesso quebra a ligação.',
    ],
  },
  // 04-coesao.md
  cohesion: {
    pagamentos: () => [],
    passos: [
      'Toque pedra solta ou uma superfície de pedra (mão livre) e pague 1+ Investidura: ela fica macia como argila. A infusão custa 1 por rodada.',
      'Dá pra moldar um formato aproximado na hora. Modelagem elaborada pede Interagir ou Usar uma Perícia (teste de Coesão, CD do Mestre).',
      'Tamanho máximo: o do seu fluxo. Não vale em personagem, objeto Investido nem infundido.',
      'Pedra de quem não quer, ou o chão sob ele: teste de Coesão contra a defesa Física (falhou, não gasta).',
      'Quando a infusão acaba a pedra endurece. Quem estava dentro fica Imobilizado (ou Restringido): Atletismo contra a sua Coesão pra sair.',
    ],
  },
  // 05-divisao.md
  division: {
    pagamentos: () => [],
    passos: [
      'Toque o alvo (mão livre). Gasta 2 ações.',
      'Personagem (qualquer tamanho): pague 1 Investidura e ataque a defesa Espiritual. Acerto causa dano espiritual (3d4, o dado sobe com a graduação) mais o modificador; zerou a vida, vira pó.',
      'Objeto ou área: pague 1 Investidura por tamanho (Pequeno 1, Médio 2…), até o tamanho do seu fluxo. Não vale em objeto Investido nem infundido.',
      'Em combate ou tensão, teste de Divisão antes de destruir. CD pelo material: ar 0, vapor 5, líquido 10, orgânico 15, sólido 20.',
      'Objeto de quem não quer: teste de Divisão contra a defesa Física ou a CD do material, a que for maior (falhou, não gasta).',
    ],
  },
  // 06-gravitacao.md
  gravitation: {
    pagamentos: () => [],
    passos: [
      'Toque o alvo (mão livre) e pague 1+ Investidura. A infusão custa 1 por rodada. Tamanho máximo: o do seu fluxo.',
      'Voluntário (ou você mesmo, em qualquer tamanho): ganha voo de 7,5 m por turno.',
      'Objeto: escolha a nova direção da gravidade. Todo início de turno seu, mais 1 Investidura, ele anda em linha reta até 7,5 m.',
      'Não vale em objeto Investido nem infundido.',
      'Personagem que não quer: teste de Gravitação contra a defesa Física. Sucesso, 1 Investidura move até 7,5 m e ele fica Restringido até o seu próximo turno.',
      'Manobra perigosa ou apertada: o Mestre pode pedir teste de Gravitação. Se acabar com o alvo no ar, ele cai.',
    ],
  },
  // 07-iluminacao.md
  illumination: {
    pagamentos: () => [],
    passos: [
      'Pague 1+ Investidura e crie uma ilusão de luz e som no ar, dentro da distância do vínculo com o espreno. Tamanho máximo: o do seu fluxo.',
      'Manutenção: ilusão simples (sem som nem movimento) custa 1 a cada 10 minutos; complexa, 1 por rodada.',
      'Disfarce em si mesmo: sem manutenção enquanto você tiver 1+ Investidura. Encerra como ação livre ou ao zerar.',
      'Ilusão simples ou disfarce próprio convence sozinha. Ilusão complexa pode pedir teste de Iluminação contra a defesa Cognitiva de quem olha.',
      'Quem avalia de propósito testa Percepção contra a sua Iluminação; se passar, vê que é falsa.',
      'Controlar: ação livre pra tarefa simples, ação para algo que pede atenção. Reabastecer: ação livre.',
    ],
  },
  // 08-progressao.md
  progression: {
    pagamentos: () => [],
    passos: [
      'Toque uma coisa viva que não seja você (mão livre). Gasta 2 ações.',
      'Cada habilidade abaixo traz o seu custo.',
      'Na Regeneração, quem decide o que é curado e como é o próprio curado.',
    ],
    habilidadesNoLugarDoUsar: true,
    habilidades: [
      {
        id: 'growth',
        nome: 'Crescimento de Plantas',
        nomeEn: 'Plant Growth',
        ativacao: '2acoes',
        custo: { investidura: 1 },
        resumo: 'Faz uma planta ou semente crescer na hora até um tamanho à sua escolha, no máximo o do seu fluxo.',
      },
      {
        id: 'regrowth',
        nome: 'Regeneração de Personagem',
        nomeEn: 'Character Regrowth',
        ativacao: '2acoes',
        resumo: 'Paga 1+ Investidura (1 por rodada). No início de cada turno o alvo recupera 1d4 + modificador de Progressão (o dado sobe com a graduação).',
      },
    ],
  },
  // 09-tensao.md
  tension: {
    pagamentos: () => [],
    passos: ['O texto básico do fluxo de Tensão ainda não foi transcrito do livro. Por enquanto só os talentos dele (Guardião das Pedras) estão registrados.'],
  },
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
    pagamentos: () => [],
    passos: [
      '"Usar" (▶) olha o Reino Cognitivo onde você está. Cada efeito abaixo paga 1 Investidura, sem outra ação, na distância do vínculo com o espreno.',
      'O Mestre pode pedir teste de Transporte pra identificar o que viu.',
    ],
    habilidades: [
      {
        id: 'learn_emotions_motives',
        nome: 'Descobrir Emoções e Motivações',
        nomeEn: 'Learn Emotions and Motives',
        ativacao: 'especial',
        custo: { investidura: 1 },
        repetivel: true,
        resumo: 'Lê os espren em volta de alguém: vantagem pra influenciá-lo, ou descobre a motivação sem teste de Intuição.',
      },
      {
        id: 'locate_characters',
        nome: 'Localizar Personagens',
        nomeEn: 'Locate Characters',
        ativacao: 'especial',
        custo: { investidura: 1 },
        repetivel: true,
        resumo: 'Estima onde está alguém cuja chama você já aprendeu a reconhecer, se estiver perto o bastante.',
      },
      {
        id: 'sense_investiture',
        nome: 'Sentir Investidura',
        nomeEn: 'Sense Investiture',
        ativacao: 'especial',
        custo: { investidura: 1 },
        repetivel: true,
        resumo: 'Vê o que é Investido (Moldado, Radiante, Espada Fractal, fabrial) e a verdadeira natureza disso.',
      },
    ],
  },
}

/** Nota que vale pra todo fluxo — "Usando Fluxos". */
export const NOTAS_FLUXO = [
  'Infusão ativa gasta 1 Investidura no início de cada turno seu (mesmo Inconsciente). Encerrar não custa ação.',
  'Ataque de fluxo: sem sentir o alvo, desvantagem; acerto soma o total do fluxo ao dano; errou, 1 foco atinge de raspão.',
]
