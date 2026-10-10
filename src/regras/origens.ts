/* arquivo: origens.ts */
import { ANCESTRALIDADE, CULTURA, ORDEM, TRILHA_HEROICA } from '../estado/deparaShards'

/**
 * Texto de regra das ORIGENS (ancestralidade, cultura) e das TRILHAS (heroicas e
 * radiantes) — resumo em palavras próprias do Guia de Regras, Cap. 2, 4 e 5.
 * Nunca copiar o livro: o repositório é público. As chaves são os nomes que o app
 * usa (os valores de estado/deparaShards.ts).
 */

export interface Ancestralidade {
  nome: string
  nomeEn: string
  resumo: string
  oQueDa: string[]
}

export interface CulturaTexto {
  nome: string
  nomeEn: string
  /** nome da especialidade cultural que a cultura concede */
  especialidade: string
  resumo: string
  oQueSabe: string[]
}

export interface TrilhaHeroicaTexto {
  nome: string
  nomeEn: string
  resumo: string
  /** perícia que a trilha dá de graça no início */
  periciaInicial?: string
  /** perícias que o livro recomenda pra trilha */
  pericias?: string[]
  especializacoes?: string[]
}

export interface OrdemTexto {
  nome: string
  nomeEn: string
  espreno: string
  fluxos: [string, string]
  resumo: string
  /** tema de cada Ideal além do Primeiro (2º, 3º, 4º) */
  ideais?: string[]
}

export const ANCESTRALIDADES: Record<string, Ancestralidade> = {
  Humano: {
    nome: 'Humano',
    nomeEn: 'Human',
    resumo: 'Espécie dominante nas nações de Roshar. Tamanho Médio.',
    oQueDa: ['Talento bônus de uma trilha heroica nos níveis 1, 6, 11, 16 e 21'],
  },
  Cantor: {
    nome: 'Cantor',
    nomeEn: 'Singer',
    resumo:
      'População nativa de Roshar, que muda de forma ao vincular esprenos durante grantormentas. Tamanho Médio.',
    oQueDa: [
      'Árvore de talentos própria de Cantor, disponível ao escolher qualquer talento',
      'Talento-chave Mudar Forma no nível 1, mais o talento bônus ligado a ele',
      'Talento bônus nos níveis 6, 11, 16 e 21: da árvore de Cantor ou de trilha heroica',
      'Percebe e usa os ritmos',
    ],
  },
}

const cultura = (
  nome: string,
  nomeEn: string,
  especialidade: string,
  resumo: string,
  oQueSabe: string[],
): CulturaTexto => ({ nome, nomeEn, especialidade, resumo, oQueSabe })

export const CULTURAS: Record<string, CulturaTexto> = {
  Alethiano: cultura(
    'Alethiano', 'Alethi', 'Alethiana',
    'Conhecimento dos principados e do jeito alethiano.',
    ['Nomes, locais e grão-príncipes de cada principado', 'Dialeto e pontos úteis de um principado onde viveu', 'Básico do vorinismo, do Todo-Poderoso e dos Arautos'],
  ),
  Azishiano: cultura(
    'Azishiano', 'Azish', 'Azishiana',
    'Conhecimento da burocracia e do Império azishiano.',
    ['Palácio de Bronze, Primeiro Aqasix e vizires', 'Fatos básicos dos estados do Império', 'Navegar prédios cívicos: leis, queixas, exame de vizir', 'Kadasixes e pósteros'],
  ),
  Herdaziano: cultura(
    'Herdaziano', 'Herdazian', 'Herdaziana',
    'Conhecimento da vida rancheira de Herdaz.',
    ['O rei e as principais famílias rancheiras', 'Andar pelos ranchos e evitar a costa dos grã-carapaças', 'Ferramentas básicas de pecuária', 'Vorinismo herdaziano'],
  ),
  Irialiano: cultura(
    'Irialiano', 'Iriali', 'Irialiana',
    'Conhecimento de Iri e de viagem.',
    ['O Triunvirato Irialiano', 'Pontos úteis de uma cidade ou área rural onde viveu', 'O Um e a Longa Trilha', 'Estratégias de viagem, como gestão de suprimentos'],
  ),
  Kharbranthiano: cultura(
    'Kharbranthiano', 'Kharbranthian', 'Kharbranthiana',
    'Conhecimento de Kharbranth, a cidade da medicina e do estudo.',
    ['Sistemas de educação da cidade', 'Nomes e funções de remédios comuns e higiene contra esprenos de putrefação', 'Básico do vorinismo, do Todo-Poderoso e dos Arautos'],
  ),
  Ouvinte: cultura(
    'Ouvinte', 'Listener', 'Ouvinte',
    'Cultura Cantora das Planícies Quebradas. Em geral só pra Cantores; o MJ pode liberar pra humano que conviveu com eles.',
    ['As formas opaca, copulatória, hábil, bélica e laboral', 'O conselho dos Cinco e, talvez, canções ouvintes', 'Ecologia das Planícies Quebradas e Guerra da Vingança'],
  ),
  Nataniano: cultura(
    'Nataniano', 'Natan', 'Nataniana',
    'Conhecimento do povo nataniano e das grantormentas.',
    ['Relatos das terras que o povo perdeu', 'Grantormentas em potência total e como se proteger delas', 'Vorinismo e a reverência pelas luas'],
  ),
  Reshiano: cultura(
    'Reshiano', 'Reshi', 'Reshiana',
    'Conhecimento das Ilhas Reshi e do mar.',
    ['Grã-carapaças Tai-na e divindades esprenas', 'Ecologia do Mar Reshiano e ilhas estacionárias', 'O que falta nas ilhas e de onde vem', 'Costume de resolver conflitos sociais rápido e feroz'],
  ),
  Shino: cultura(
    'Shino', 'Shin', 'Shina',
    'Conhecimento de Shinovar.',
    ['Grantormentas amenas e a ecologia e arquitetura que elas sustentam', 'Negociar diminuindo o valor percebido da própria oferta', 'Xamanismo das Pedras'],
  ),
  Thayleno: cultura(
    'Thayleno', 'Thaylen', 'Thaylena',
    'Conhecimento de Thaylenah e do comércio.',
    ['Monarquia eletiva e conselhos mercantes', 'Guildas artifabrianas e convívio com fabriais', 'Evitar enjoo marítimo e viajar entre as ilhas', 'Vorinismo e as Paixões'],
  ),
  Unkalakiano: cultura(
    'Unkalakiano', 'Unkalaki', 'Unkalakiana',
    'Conhecimento dos picos e dos oceanos de altitude.',
    ['Liderança, ecologia e mitos dos "oceanos" nos picos', 'Corpo acostumado ao ar rarefeito', 'Deuses das águas, montanhas e árvores; veneração de esprenos'],
  ),
  Vedeno: cultura(
    'Vedeno', 'Veden', 'Vedena',
    'Conhecimento de Jah Keved.',
    ['O rei, os principados e os quatro grandes grupos étnicos', 'Vorinismo e eventos atuais da igreja', 'Pode escolher também alethiano, bavlandês ou silnaseno, se fizer sentido'],
  ),
  Viajante: cultura(
    'Viajante', 'Wayfarer', 'de Viajante',
    'Cultura de quem vive viajando entre nações.',
    ['Ler legendas de mapas internacionais', 'Achar câmbio confiável pra trocar esferas foscas por infundidas', 'Cumprimentos e costumes básicos de várias nações'],
  ),
}

export const TRILHAS_HEROICAS: Record<string, TrilhaHeroicaTexto> = {
  Agente: {
    nome: 'Agente',
    nomeEn: 'Agent',
    resumo: 'Mestre da duplicidade e da sabotagem: age nos bastidores, com reflexos rápidos e golpes calculados.',
    periciaInicial: 'Intuição',
    pericias: ['Agilidade', 'Armamento Leve', 'Dedução', 'Dissimulação', 'Intuição', 'Ladinagem'],
    especializacoes: ['Investigador', 'Espião', 'Ladrão'],
  },
  Caçador: {
    nome: 'Caçador',
    nomeEn: 'Hunter',
    resumo: 'Paciente, estuda o terreno e a presa e só golpeia quando as condições favorecem.',
    periciaInicial: 'Percepção',
    pericias: ['Agilidade', 'Furtividade', 'Percepção', 'Sobrevivência', 'Armamento Leve ou Pesado'],
    especializacoes: ['Arqueiro', 'Assassino', 'Rastreador'],
  },
  Emissário: {
    nome: 'Emissário',
    nomeEn: 'Envoy',
    resumo: 'Representa e promove uma causa ou organização com retórica, paciência e dedicação.',
    periciaInicial: 'Disciplina',
    pericias: ['Disciplina', 'Dissimulação', 'Liderança', 'Persuasão', 'Saber'],
    especializacoes: ['Diplomata', 'Fiel', 'Mentor'],
  },
  Erudito: {
    nome: 'Erudito',
    nomeEn: 'Scholar',
    resumo: 'Move-se pela fome de conhecimento e reconstrói Roshar depois de cada Desolação.',
    periciaInicial: 'Saber',
    pericias: ['Dedução', 'Manufatura', 'Medicina', 'Saber'],
    especializacoes: ['Artifabriano', 'Estrategista', 'Cirurgião'],
  },
  Guerreiro: {
    nome: 'Guerreiro',
    nomeEn: 'Warrior',
    resumo: 'Vive o conflito como vocação, honra ou necessidade, e se vira em qualquer situação marcial.',
    periciaInicial: 'Atletismo',
    pericias: ['Armamento Leve', 'Armamento Pesado', 'Atletismo', 'Intimidação', 'Liderança', 'Persuasão'],
    especializacoes: ['Duelista', 'Fractário', 'Soldado'],
  },
  Líder: {
    nome: 'Líder',
    nomeEn: 'Leader',
    resumo: 'Farol de ânimo e direção: sustenta o grupo quando a dúvida aparece e vira o jogo contra forças maiores.',
    periciaInicial: 'Liderança',
    pericias: ['Armamento Pesado', 'Atletismo', 'Dissimulação', 'Intimidação', 'Liderança', 'Persuasão'],
    especializacoes: ['Campeão', 'Oficial', 'Político'],
  },
}

export const ORDENS: Record<string, OrdemTexto> = {
  'Corredor dos Ventos': {
    nome: 'Corredor dos Ventos', nomeEn: 'Windrunner', espreno: 'Espreno de Honra',
    fluxos: ['Adesão', 'Gravitação'],
    resumo: 'Batedores e forças especiais: voam, prendem coisas ao chão e protegem os indefesos. Excelência com armas e hierarquia militar.',
    ideais: ['Proteger quem não pode se proteger', 'Proteger até quem odeia, apesar dos próprios defeitos', 'Aceitar a falha e perdoar-se, sem parar de proteger'],
  },
  'Rompe-céu': {
    nome: 'Rompe-céu', nomeEn: 'Skybreaker', espreno: 'Grão-espreno',
    fluxos: ['Divisão', 'Gravitação'],
    resumo: 'Fazem a lei servir a todos e vigiam o abuso de poder, inclusive das outras ordens. Atuam dentro da lei.',
    ideais: ['Justiça: aprender e seguir o código da lei', 'Dedicação: obedecer a uma autoridade ou código escolhido', 'Cruzada: assumir uma missão pessoal contra uma injustiça'],
  },
  Pulverizador: {
    nome: 'Pulverizador', nomeEn: 'Dustbringer', espreno: 'Espreno de Cinzas',
    fluxos: ['Abrasão', 'Divisão'],
    resumo: 'Engenheiros da destruição: artilharia móvel e sapadores, de máximo poder destrutivo, definidos por controle e precisão.',
    ideais: ['Autocontrole: controlar a si pra controlar o poder', 'Compreender todas as formas de poder', 'Poder traz obrigação e responsabilidade'],
  },
  'Dançarino de Precipícios': {
    nome: 'Dançarino de Precipícios', nomeEn: 'Edgedancer', espreno: 'Espreno de Cultura',
    fluxos: ['Abrasão', 'Progressão'],
    resumo: 'Socorristas ágeis e resistentes que curam e fazem plantas crescer. Defendem a gente comum e evitam o combate direto.',
    ideais: ['Lembrar dos esquecidos', 'Escutar os ignorados', 'Advocacia: levar as queixas do povo a quem tem poder'],
  },
  'Sentinela da Verdade': {
    nome: 'Sentinela da Verdade', nomeEn: 'Truthwatcher', espreno: 'Espreno de Névoa',
    fluxos: ['Iluminação', 'Progressão'],
    resumo: 'Pesquisadores e investigadores dos Radiantes: descobrem verdades e as compartilham, com ilusões, plantas e cura.',
    ideais: ['Buscar a verdade onde estiver escondida', 'Revelar a verdade a quem a busca', 'Assumir o risco de expor segredos dos poderosos'],
  },
  Teceluz: {
    nome: 'Teceluz', nomeEn: 'Lightweaver', espreno: 'Críptico',
    fluxos: ['Iluminação', 'Transformação'],
    resumo: 'Artistas e espiões: ilusões e disfarces pra subterfúgio, e arte pra sustentar a moral. Vivem na linha entre verdade e mentira.',
    ideais: ['Cada Ideal: admitir uma verdade difícil sobre si mesmo e crescer com ela'],
  },
  Alternauta: {
    nome: 'Alternauta', nomeEn: 'Elsecaller', espreno: 'Espreno de Tinta',
    fluxos: ['Transformação', 'Transporte'],
    resumo: 'Ligação mais forte com o Reino Cognitivo: transformam o entorno em arma e abrem passagens entre reinos. Os mais sábios e cautelosos.',
    ideais: ['Cada Ideal: uma aspiração pessoal de aprimoramento, sem tema fixo'],
  },
  Plasmador: {
    nome: 'Plasmador', nomeEn: 'Willshaper', espreno: 'Espreno de Luz',
    fluxos: ['Coesão', 'Transporte'],
    resumo: 'Construtores e artesãos: amaciam paredes e correntes, viajam por Shadesmar e lutam pela liberdade e escolha de todos.',
    ideais: ['Buscar a liberdade dos oprimidos', 'Lutar contra a opressão até a causa raiz', 'Garantir que os libertados continuem livres'],
  },
  'Guardião das Pedras': {
    nome: 'Guardião das Pedras', nomeEn: 'Stoneward', espreno: 'Espreno Rochoso',
    fluxos: ['Coesão', 'Tensão'],
    resumo: 'Infantaria pesada: vanguarda confiável, esculpem pedra e improvisam armas e armaduras. Trabalho em equipe e teimosia.',
    ideais: ['Avançar quando os outros recuarem', 'Ser o apoio de que os outros dependem', 'Cuidar de si pra continuar apoiando'],
  },
}

/**
 * Vinculador: o livro traz só filosofia e história, sem talentos jogáveis. Fica
 * fora de ORDENS pra não aparecer como escolha; `ordemPorNome` ainda o acha.
 */
export const ORDEM_NAO_JOGAVEL: OrdemTexto = {
  nome: 'Vinculador', nomeEn: 'Bondsmith', espreno: 'Espreno Único',
  fluxos: ['Adesão', 'Tensão'],
  resumo: 'Une antes de dividir. Vincula um dos três grandes esprenos. Indisponível para personagens jogadores.',
}

export function ancestralidadePorNome(nome: string): Ancestralidade | undefined {
  return ANCESTRALIDADES[nome]
}
export function culturaPorNome(nome: string): CulturaTexto | undefined {
  return CULTURAS[nome]
}
export function trilhaHeroicaPorNome(nome: string): TrilhaHeroicaTexto | undefined {
  return TRILHAS_HEROICAS[nome]
}
export function ordemPorNome(nome: string): OrdemTexto | undefined {
  return ORDENS[nome] ?? (nome === ORDEM_NAO_JOGAVEL.nome ? ORDEM_NAO_JOGAVEL : undefined)
}

/** Valores do de-para, pra conferência no teste. */
export const NOMES_DO_DEPARA = {
  ancestralidades: Object.values(ANCESTRALIDADE),
  culturas: Object.values(CULTURA),
  trilhasHeroicas: Object.values(TRILHA_HEROICA),
  ordens: Object.values(ORDEM),
}
