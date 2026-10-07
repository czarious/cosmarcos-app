/* arquivo: fluxo-tensao.ts */
import type { EntradaTalento } from '../talentos'

// ── Cap. 5 · Trilha Radiante: Guardião das Pedras — Fluxo Tensão — transcricao/05-trilhas-radiantes/07-guardiao-das-pedras.md ──
export const TALENTOS_FLUXO_TENSAO: Record<string, EntradaTalento> = {
  'tension::cloth_mastery': {
    nome: 'Maestria em Tecido',
    nomeEn: 'Cloth Mastery',
    fonte: 'Fluxo · Tensão',
    fonteEn: 'Surge · Tension',
    preRequisitos: 'Tensão 2+; Armamento Mastreado',
    ativacao: 'sempre',
    descricao:
      'Usa Tensão para criar instantaneamente objetos intrincados e complexos.',
  },
  'tension::clothsmith': {
    nome: 'Ferreiro de Tecido',
    nomeEn: 'Clothsmith',
    fonte: 'Fluxo · Tensão',
    fonteEn: 'Surge · Tension',
    preRequisitos: 'Maestria em Tecido ou Tensão em Superfície',
    ativacao: 'sempre',
    descricao:
      'O bônus de Aparagem com Tensão na defesa Física do alvo passa de 2 para 4. Uma arma criada temporariamente com Tensão ganha 1d4 de dano extra.',
  },
  'tension::extended_tension': {
    nome: 'Tensão Estendida',
    nomeEn: 'Extended Tension',
    fonte: 'Fluxo · Tensão',
    fonteEn: 'Surge · Tension',
    preRequisitos: 'Recuperação de Luz das Tempestades',
    ativacao: 'sempre',
    descricao:
      'Cada infusão de Tensão gasta 1 de Investidura a cada tantas rodadas quanto suas graduações em Tensão. Enquanto tiver Investidura, mantém infusões em objetos que segura sem custo extra.',
  },
  'tension::fine_control': {
    nome: 'Controle Apurado',
    nomeEn: 'Fine Control',
    fonte: 'Fluxo · Tensão',
    fonteEn: 'Surge · Tension',
    preRequisitos: 'Maestria em Tecido',
    ativacao: '2acoes',
    descricao:
      'Gasta Investidura para infundir um objeto que consiga controlar com uma ação e esteja tocando. O objeto se move até 7,5 metros sobre superfícies, realiza tarefas e ataca usando sua Tensão.',
  },
  'tension::rigged_weaponry': {
    nome: 'Armamento Mastreado',
    nomeEn: 'Rigged Weaponry',
    fonte: 'Fluxo · Tensão',
    fonteEn: 'Surge · Tension',
    preRequisitos: 'Aparagem com Tensão',
    ativacao: 'especial',
    descricao:
      'Gasta 1 de Investidura para aumentar em 3 metros o alcance da arma corpo a corpo. Ao acertar um ataque corpo a corpo, gasta uma ação livre ou 2 pontos de foco para infundir Tensão num objeto que o alvo segura.',
  },
  'tension::stormlight_reclamation': {
    nome: 'Recuperação de Luz das Tempestades',
    nomeEn: 'Stormlight Reclamation',
    fonte: 'Fluxo · Tensão',
    fonteEn: 'Surge · Tension',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'livre',
    descricao:
      'Encerra infusões de Tensão suas e recupera a Investidura que restava nelas.',
  },
  'tension::surface_tension': {
    nome: 'Tensão em Superfície',
    nomeEn: 'Surface Tension',
    fonte: 'Fluxo · Tensão',
    fonteEn: 'Surge · Tension',
    preRequisitos: 'Tensão Estendida',
    ativacao: 'sempre',
    descricao:
      'Usa Tensão para aumentar a tensão superficial de um líquido e andar sobre ele como se fosse piso sólido.',
  },
  'tension::tension_parry': {
    nome: 'Aparagem com Tensão',
    nomeEn: 'Tension Parry',
    fonte: 'Fluxo · Tensão',
    fonteEn: 'Surge · Tension',
    preRequisitos: 'Dizer o Primeiro Ideal',
    ativacao: 'reacao',
    descricao:
      'Antes de você ou um aliado ser acertado ou atingido de raspão, gasta Investidura para infundir a roupa do alvo, que ganha +2 de defesa Física contra esse ataque.',
  },
}
