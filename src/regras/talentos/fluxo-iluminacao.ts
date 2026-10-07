/* arquivo: fluxo-iluminacao.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Fluxo Iluminação (árvore do Sentinela da Verdade e do Teceluz) — transcricao/05-trilhas-radiantes/11-sentinela-da-verdade.md e 12-teceluz.md ──
export const TALENTOS_FLUXO_ILUMINACAO: Record<string, EntradaTalento> = {
  'illumination::distracting_illusion': {
    nome: 'Ilusão Distrativa',
    nomeEn: 'Distracting Illusion',
    fonte: 'Fluxo · Iluminação',
    fonteEn: 'Surge · Illumination',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: '1acao',
    descricao:
      'Gasta 1 de Investidura para criar uma ilusão de si mesmo ou de um aliado. Até um ataque errar esse alvo, ataques contra ele têm desvantagem e não podem atingir de raspão.',
  },
  'illumination::disorienting_flash': {
    nome: 'Clarão Desorientador',
    nomeEn: 'Disorienting Flash',
    fonte: 'Fluxo · Iluminação',
    fonteEn: 'Surge · Illumination',
    preRequisitos: '—',
    ativacao: '2acoes',
    descricao:
      'Gasta 1 de Investidura para projetar luz numa área e testa Iluminação contra a defesa Cognitiva de cada personagem, deixando-o Desorientado.',
  },
  'illumination::lingering_lightweavings': {
    nome: 'Teceluminações Duradouras',
    nomeEn: 'Lingering Lightweavings',
    fonte: 'Fluxo · Iluminação',
    fonteEn: 'Surge · Illumination',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'especial',
    descricao:
      'Pode infundir uma ilusão numa esfera; ela se move com a esfera e gasta 1 de Investidura a cada quantidade de rodadas igual às graduações em Iluminação.',
  },
  'illumination::multiplicative_lightweaving': {
    nome: 'Teceluminação Multiplicativa',
    nomeEn: 'Multiplicative Lightweaving',
    fonte: 'Fluxo · Iluminação',
    fonteEn: 'Surge · Illumination',
    preRequisitos: '—',
    ativacao: 'sempre',
    descricao:
      'Pode criar ilusões adicionais, até um total igual às graduações em Iluminação, sem gastar Investidura extra.',
  },
  'illumination::spiritual_illumination': {
    nome: 'Iluminação Espiritual',
    nomeEn: 'Spiritual Illumination',
    fonte: 'Fluxo · Iluminação',
    fonteEn: 'Surge · Illumination',
    preRequisitos: '—',
    ativacao: '1acao',
    descricao: 'Gasta 2 de Investidura para deixar um aliado Determinado e Focado.',
  },
  'illumination::painful_truth': {
    nome: 'Verdade Dolorosa',
    nomeEn: 'Painful Truth',
    fonte: 'Fluxo · Iluminação',
    fonteEn: 'Surge · Illumination',
    preRequisitos: '—',
    ativacao: '1acao',
    descricao:
      'Gasta 2 de Investidura e testa Iluminação contra a defesa Espiritual de um alvo. Em sucesso, ele fica Lento e deve se Mover para longe no próximo turno, ou gastar foco para evitar.',
  },
  'illumination::endless_illusions': {
    nome: 'Ilusões Intermináveis',
    nomeEn: 'Endless Illusions',
    fonte: 'Fluxo · Iluminação',
    fonteEn: 'Surge · Illumination',
    preRequisitos: '—',
    ativacao: 'sempre',
    descricao:
      'Enquanto tiver Investidura, suas infusões de Iluminação dentro da distância do vínculo com o espreno não gastam Investidura.',
  },
  'illumination::stormlight_reclamation': {
    nome: 'Recuperação de Luz das Tempestades',
    nomeEn: 'Stormlight Reclamation',
    fonte: 'Fluxo · Iluminação',
    fonteEn: 'Surge · Illumination',
    preRequisitos: '—',
    ativacao: 'livre',
    descricao: 'Encerra infusões de Iluminação e recupera a Investidura remanescente delas.',
  },
}
