/* arquivo: pt.ts */

/**
 * TODAS AS PALAVRAS DA TELA EM PORTUGUÊS — a fonte. Uma variável por texto,
 * organizada por tela. O en.ts tem que ter exatamente as mesmas variáveis
 * (o formato sai daqui: `Dicionario`), senão o app não compila.
 * Decisão: premissas.md → "Textos em variáveis, um arquivo por idioma".
 *
 * Regras deste arquivo:
 *  - Lacuna `{x}` preenchida na tela: t(tx.turno.rodadaN, { n: 3 }).
 *  - Plural tem as duas formas (`um` / `varios`); quem escolhe é a regra do
 *    idioma (Intl.PluralRules), nunca um `n === 1` no código.
 *  - Frase inteira numa variável só — nunca montar frase juntando pedaços.
 *  - Nome de jogo NÃO mora aqui: vem do Shards (tradutor) ou do catálogo de
 *    regra (`nomeEn` ao lado do `nome`) — ver idioma/nomes.ts.
 *  - Símbolo e ícone também não: são globais, em variaveis.ts.
 */
/** As duas formas de um texto com número — a regra do idioma escolhe qual. */
export type Plural = { um: string; varios: string }

export const PT = {
  // ── palavras da ficha: atributos, defesas, recursos, abas ─────────
  atributos: {
    forca: 'Força',
    velocidade: 'Velocidade',
    intelecto: 'Intelecto',
    vontade: 'Vontade',
    consciencia: 'Consciência',
    presenca: 'Presença',
  },
  atributosAbrev: {
    forca: 'FOR',
    velocidade: 'VEL',
    intelecto: 'INT',
    vontade: 'VON',
    consciencia: 'CON',
    presenca: 'PRE',
  },
  /** Os 3 grupos da ficha oficial — cada um junta uma defesa, dois atributos e um recurso. */
  grupos: {
    fisica: 'Física',
    cognitiva: 'Cognitiva',
    espiritual: 'Espiritual',
  },
  recursos: {
    vida: 'Vida',
    foco: 'Foco',
    investidura: 'Investidura',
    cargas: 'Cargas',
    vidaAbrev: 'VIDA',
    focoAbrev: 'FOCO',
    investiduraAbrev: 'INVEST',
    cargasAbrev: 'CARGAS',
    dano: 'Dano',
    curar: 'Curar',
    gastar: 'Gastar',
    recuperar: 'Recuperar',
    recarregar: 'Recarregar',
  },
  nomesAbas: {
    Principal: 'Principal',
    Perícias: 'Perícias',
    Ações: 'Ações',
    Fabriais: 'Fabriais',
    Condições: 'Condições',
    Radiante: 'Radiante',
    Inventário: 'Inventário',
    Talentos: 'Talentos',
    Personagem: 'Personagem',
    Anotações: 'Anotações',
  },

  // ── gerais: aparecem em mais de uma tela ────────────────────────
  geral: {
    fechar: 'Fechar',
    cancelar: 'Cancelar',
    salvar: 'Salvar',
    aplicar: 'Aplicar',
    total: 'Total',
    menu: 'Menu',
    importarJson: 'Importar JSON',
    exportarJson: 'Exportar pro Shards',
    baixarBackup: 'Baixar backup',
    fichaSalva: 'Ficha salva neste aparelho.',
    naoSalvou: 'NÃO salvou neste aparelho — baixe um backup agora.',
    backupBaixado: 'Backup baixado — guarde o arquivo. Ele volta pelo Importar.',
    saveNaoAbriu: 'O save deste aparelho não abriu',
    baixarDescartado: 'Baixar o save que não abriu',
    entendi: 'Entendi',
    exportado: 'Baixado — no Shards: Files → Import JSON.',
    exportarSemSemente: 'Importe o JSON do Shards uma vez antes de exportar.',
    importado: 'Importado: {arquivo}',
    bonusSemOrigem: 'Talento não identificado (do Shards)',
    graduacao: 'Graduação',
    outrosMisc: 'Outros (misc)',
    deflexao: 'Deflexão',
    deflexaoComoUsa: 'Desconte de todo dano afiado, energético ou impactante; espiritual e vital passam inteiros. Ex.: deflexão 2 e 5 de dano → −3 de Vida. No editor da Vida o app já desconta (dá pra desmarcar).',
    nenhuma: '— Nenhuma —',
    adicionar: '+ Adicionar',
    editarNome: 'Editar {nome}',
    excluirNome: 'Excluir {nome}',
    removerNome: 'Remover {nome}',
    nomeTotalVer: '{nome}, total {total}. Ver de onde vem',
    nomeTotalAlteradoVer: '{nome}, total {total}, alterado por condição. Ver de onde vem',
  },

  // ── App.tsx — carregando, erro, aba em construção ───────────────
  /** AvisoAtualizacao — versão nova do app pronta pra entrar. */
  atualizacao: {
    disponivel: 'Versão nova do app disponível.',
    atualizar: 'Atualizar',
  },
  app: {
    algoQuebrou: 'algo quebrou',
    carregandoFicha: 'carregando a ficha…',
    umaCopiaFicouGuardada: 'Uma cópia ficou guardada no aparelho — baixe e mande pro Claude recuperar. A ficha abaixo veio do JSON de semente.',
    aAbaSecaoVem: 'A aba {secao} vem a seguir.',
    aEstruturaJaEsta: 'A estrutura já está de pé — construímos uma por vez.',
    fichaMaisNova: 'Há uma ficha mais nova do {nome}.',
    importar: 'Importar',
    agoraNao: 'Agora não',
    fichaNovaImportada: 'Ficha nova importada — a de antes ficou na ⚙ pra voltar.',
  },

  // ── CabecalhoFixo ───────────────────────────────────────────────
  cabecalho: {
    nvN: 'nv {n}',
    nomeAtualMaxAlterar: '{nome} {atual} de {max}. Alterar',
    verCondicoesAtivas: 'Ver condições ativas',
    descansar: 'Descansar',
  },

  // ── FotoPersonagem — o rosto no cabeçalho, com recorte ─────────
  foto: {
    porFoto: 'Pôr foto do personagem',
    trocarFoto: 'Trocar foto do personagem',
    escolherOutra: 'Escolher outra',
    tirar: 'Tirar a foto',
    recortar: 'Recortar a foto',
    comoRecortar: 'Arraste pra posicionar. Dois dedos ou a barra dão zoom.',
    zoom: 'Zoom',
    usar: 'Usar',
    naoAbriu: 'Não consegui abrir essa imagem — tente outra.',
  },

  // ── Fogueira — o descanso, no cabeçalho ─────────────────────────
  descanso: {
    titulo: 'Descanso',
    curto: 'Descanso curto',
    curtoDuracao: '1 hora ou mais',
    curtoComo: 'Role o dado de recuperação ({dado}) e divida o resultado entre Vida e Foco.',
    longo: 'Descanso longo',
    longoDuracao: '8 horas ou mais',
    vidaCheia: 'Vida cheia ({n})',
    focoCheio: 'Foco cheio ({n})',
    exaustoMenos1: 'Exausto −1',
    superficialCura: 'Lesão superficial cura',
    descansar: 'Descansar',
    confirmarDescansoLongo: 'Sim, descansar',
    lesaoLeveGraveConta: 'Lesão leve/grave conta dias, não descansos — use o −1 dia de cada uma.',
  },

  // ── SeletorSecao — o menu das abas ──────────────────────────────
  abas: {
    secoesFicha: 'Seções da ficha',
    abaAbaAbrirMenu: 'Aba {aba}. Abrir menu de abas',
    abasFicha: 'Abas da ficha',
  },

  // ── MenuEngrenagem — a ⚙ do topo ────────────────────────────────
  menu: {
    shards: 'Shards',
    confirmaImportar: 'Isso apaga tudo que você mudou no app. Não tem desfazer.',
    esteAparelho: 'Este aparelho',
    idioma: 'Idioma',
    desfazerImportacao: 'Voltar à ficha de antes da importação',
    importacaoDesfeita: 'Voltou a ficha de antes da importação.',
    versao: 'cosmarcos v{v}',
  },

  // ── ControleMarcos — objetivos e Ideais ─────────────────────────
  marcos: {
    desfazer: 'Desfazer',
    marcosHistoriaN3: 'Marcos de história: {n} de 3',
    marcoK: 'Marco {k}',
    concluir: 'Concluir',
    concluido: 'Concluído',
    dizerPalavras: 'Dizer as Palavras',
    jurado: 'Jurado',
  },

  // ── ControleRecurso — o ± de Vida, Foco, Investidura e cargas ───
  recurso: {
    menos: 'Menos um',
    mais: 'Mais um',
    quantidade: 'quantidade',
    descontarDeflexao: 'Descontar deflexão (−{n})',
    deflexaoVale: 'Só dano afiado, energético ou impactante — espiritual e vital passam inteiros.',
  },

  // ── PopoverDetalhe — de onde vem um número ──────────────────────
  detalhe: {
    lesoesVezes5: {
      um: '{n} lesão × −5',
      varios: '{n} lesões × −5',
    },
  },

  // ── PainelTurno — o rastreador de turno ─────────────────────────
  turno: {
    foraCombateUsarAcao: 'Fora de combate — usar ação só desconta o custo.',
    iniciarCombate: 'Iniciar combate',
    minimizarTurno: 'Minimizar o turno',
    abrirTurno: 'Abrir o turno',
    inicio: 'Início',
    rodadaN: 'Rodada {n}',
    nTotalAcoes: '{n} de {total} ações',
    reacoes: {
      um: '{n} reação',
      varios: '{n} reações',
    },
    rapido: 'rápido',
    lento: 'lento',
    preparada: 'preparada',
    turnoRapido: 'Turno rápido',
    turnoLento: 'Turno lento',
    fimCombate: 'Fim do combate',
    encerrarManterAprimorado: 'Encerrar e manter Aprimorado',
    encerrarAprimoradoAcaba: 'Encerrar (Aprimorado acaba)',
    encerrarTurno: 'Encerrar turno',
    plano: 'Plano',
    confirmar: 'Confirmar',
    limpar: 'Limpar',
    desfazer: 'Desfazer',
    removerDoPlano: 'Tirar {nome} do plano',
    planoPendente: 'Confirme ou limpe o plano antes de encerrar o turno.',
  },

  // ── DialogoUso — o dado rolado antes de usar a ação ─────────────
  dialogoUso: {
    role1d6DigiteApp: 'Role 1d6 e digite. O app soma o patamar (+{n}) e cura.',
    resultado1d6: 'Resultado do 1d6',
    curarN: 'Curar {n}',
    roleDadoRecuperacaoDado: 'Role o dado de recuperação ({dado}) e divida entre Vida e Foco.',
    vidaMais: 'Vida +',
    focoMais: 'Foco +',
    recuperar: 'Recuperar',
    quantasSimboloCustaAcao: 'Quantas {simbolo} custa a ação que você vai preparar? Ela fica guardada até o início do seu próximo turno.',
    livre: 'livre',
  },

  // ── aba Ações ───────────────────────────────────────────────────
  acoes: {
    ataques: 'Ataques',
    nenhumaArmaEquipadaVa: 'Nenhuma arma equipada — vá em Inventário pra equipar.',
    alcance: 'Alcance',
    acerto: 'Acerto',
    dano: 'Dano',
    armaPericiaPericiaNao: '{arma}: perícia "{pericia}" não encontrada na ficha.',
    armaCorpoACorpo: 'Arma corpo a corpo',
    armaADistancia: 'Arma à distância',
    usar: 'Usar',
    maoInabil: 'Mão inábil',
    fluxos: 'Fluxos',
    acoesLuzTempestades: 'Ações de Luz das Tempestades',
    acoes: 'Ações',
    reacoes: 'Reações',
    fabriais: 'Fabriais',
    detalheAbaFabriais: 'detalhe na aba Fabriais.',
    habilidadesEspreno: 'Habilidades de Espreno',
    daPreparada: 'da preparada',
    peloLivroMenosN: 'Pelo livro, com menos de {n} marcos o Mestre pode pedir a conta das esferas infundidas.',
    graduacaoGDadoDado: 'Graduação {g}: dado {dado}, alvo até {tamanho}.',
    comoUsar: 'Como usar',
    guiaDesteFluxoAinda: 'Guia deste fluxo ainda não foi transcrito — use a ativação e o custo que o Mestre disser.',
    chamasSoTalentoTransmutar: '* Chamas só com o talento Transmutar Chamas.',
    tamanhoMenosN: '{tamanho} −{n}',
    maisUmEfeito: '+1 efeito −1',
  },

  // ── guia dos fluxos (regras/fluxos.ts) ──────────────────────────
  fluxos: {
    tituloCD: 'CD — de (linha) pra (coluna)',
    solidoCurto: 'Sól',
    organicoCurto: 'Org',
    liquidoCurto: 'Líq',
    vaporCurto: 'Vap',
    arCurto: 'Ar',
    chamasCurto: 'Cham*',
    solido: 'Sólido',
    organico: 'Orgânico',
    liquido: 'Líquido',
    vapor: 'Vapor',
    arPuro: 'Ar puro',
    chamas: 'Chamas*',
  },

  // ── aba Anotações ───────────────────────────────────────────────
  anotacoes: {
    novaAnotacaoTitulo: 'Nova Anotação',
    editarAnotacao: 'Editar Anotação',
    titulo: 'Título',
    conteudo: 'Conteúdo',
    novaAnotacao: '+ Nova Anotação',
    nenhumaAnotacaoAindaToque: 'Nenhuma anotação ainda — toque em "+ Nova Anotação" pra criar uma.',
  },

  // ── aba Condições — condições e lesões ──────────────────────────
  condicoes: {
    agora: 'Agora',
    turnoRapido: 'Turno rápido',
    naoPode: 'não pode',
    lento: 'lento',
    reacao: 'reação',
    nenhuma: 'nenhuma',
    movimento: 'Movimento',
    periciasJaMostramAprimorado: 'Perícias já mostram Aprimorado e Exausto no total; vantagem e desvantagem aparecem marcadas lá.',
    condicoes: 'Condições',
    outra: '+ outra',
    deLesao: 'de lesão',
    daArmadura: 'da armadura ({nome})',
    n1d4Vital: '1d4 vital',
    danoTurno: 'Dano por turno',
    atributo: 'Atributo',
    lesoes: 'Lesões',
    nenhumaLesao: 'Nenhuma lesão.',
    menosDia: 'Menos um dia',
    n1Dia: '−1 dia',
    dias: {
      um: '{n} dia',
      varios: '{n} dias',
    },
    curou: 'Curou',
    registrarLesao: '+ Registrar lesão',
    recessoCuraDuasVezes: 'Recesso cura duas vezes mais rápido: tire 2 dias por dia de recesso.',
    role1d20SinalN: 'Role 1d20 {sinal} {n}',
    linhasSomeTalentoMao: '({linhas}; some talento à mão)',
    d20Rolado: 'd20 rolado',
    morteCombineMestre: 'MORTE — combine com o Mestre',
    gravidade: 'Gravidade',
    roleDuracao: 'Role {duracao}:',
    efeitoVoceEscolheOu: 'Efeito (você escolhe, ou rola 1d8)',
    oFoiOpcional: 'O que foi (opcional)',
    registrar: 'Registrar',
  },

  // ── aba Perícias ────────────────────────────────────────────────
  pericias: {
    graduacaoDetalhe: 'graduação {n} de {casas}, mais {bonus} de talento e {semOrigem} de origem não identificada',
    vantagem: 'vantagem',
    desvantagem: 'desvantagem',
    graduacao: 'graduação',
    vagaAteTetoTeto: 'vaga até o teto de {teto} (nível {nivel})',
    graduacaoTalentoIsentaTeto: 'graduação de talento, isenta do teto',
    veioShardsTalentoAinda: 'veio do Shards, talento ainda não identificado — defina na aba Talentos. Toque no número pra ver de onde ele vem.',
  },

  // ── aba Personagem ──────────────────────────────────────────────
  personagem: {
    objetivos: 'Objetivos',
    apagar: 'Apagar',
    manter: 'Manter',
    apagarObjetivoNome: 'Apagar o objetivo {nome}',
    objetivoNovoMestreDeu: 'Objetivo novo (o Mestre deu, ou você escolheu)',
    nomeObjetivoNovo: 'Nome do objetivo novo',
    cadaObjetivoAvancaCerca:
      'Cada objetivo avança cerca de um marco por sessão, quando o Mestre disser. Com os 3, conclua quando a cena pedir — não precisa ser na hora. Vale anotar em Anotações o que aconteceu em cada marco.',
    identidade: 'Identidade',
    jogador: 'Jogador',
    nivel: 'Nível',
    ancestralidade: 'Ancestralidade',
    culturas: 'Culturas',
    trilhaHeroica: 'Trilha heroica',
    ordemRadiante: 'Ordem radiante',
    kitInicial: 'Kit inicial',
    proposito: 'Propósito',
    obstaculo: 'Obstáculo',
    personalidade: 'Personalidade',
    aparencia: 'Aparência',
    conexoes: 'Conexões',
  },

  // ── aba Principal ───────────────────────────────────────────────
  principal: {
    atributosDefesas: 'Atributos e Defesas',
    grupoNome: 'Grupo {nome}',
    defesa: 'Defesa',
    deslocamentoSentidos: 'Deslocamento e Sentidos',
    verDeflexao: 'Deflexão {n}. Ver a conta e como usar',
    duasArmaduras: 'Duas armaduras vestidas: só vale uma — a de maior deflexão.',
    movimento: 'Movimento',
    alcanceSentidos: 'Alcance dos sentidos',
    dadoRecuperacao: 'Dado de recuperação',
    capacidadeCarga: 'Capacidade de carga',
    capacidadeLevantamento: 'Capacidade de levantamento',
  },

  // ── aba Radiante ────────────────────────────────────────────────
  radiante: {
    nomeAindaNaoRadiante: '{nome} ainda não é Radiante.',
    aAbaPreencheQuando: 'A aba se preenche quando o Shards trouxer a ordem e o vínculo com o espreno.',
    vinculo: 'Vínculo',
    ordem: 'Ordem',
    espreno: 'Espreno',
    iluminado: 'iluminado',
    alcanceVinculo: 'Alcance do vínculo',
    ideais: 'Ideais',
    nIdeal: '{n}º Ideal',
    asPalavrasOuAspiracao: 'As Palavras (ou a aspiração) deste Ideal',
    palavrasNIdeal: 'Palavras do {n}º Ideal',
    cadaIdealObjetivo3:
      'Cada Ideal é um objetivo de 3 marcos de história. Com os 3, as Palavras podem ser ditas quando a cena pedir — e o Mestre as aceita. Os efeitos do talento do Ideal continuam no Shards.',
    fluxos: 'Fluxos',
    graduacaoN: 'graduação {n}',
  },

  // ── FormularioFabrial — montar ou editar um fabrial ───────────────
  formularioFabrial: {
    novoFabrial: 'Novo Fabrial',
    editarFabrial: 'Editar Fabrial',
    unico: 'Único (inventado)',
    padrao: 'Padrão (da tabela)',
    fabrial: 'Fabrial',
    efeito: 'Efeito',
    livre: '— livre (fora do livro) —',
    cargasPreco: '{nome} · {cargas} cargas · {preco}',
    cargasN: '{nome} · {cargas} cargas',
    patamar: 'Patamar {n} — {marcos} marcos, prender espreno CD {cd}',
    nome: 'Nome',
    nomeFabrial: 'Nome do fabrial',
    qualidade: 'Qualidade (teste de Manufatura)',
    qualidadeOpcao: '{nome} ({resultado}) · {aprimoramentos} aprim. · {revezes} revés',
    aprimoramentos: 'Aprimoramentos',
    revezes: 'Revezes',
    doEfeito: 'Do {efeito}',
    naoCabe: '(não cabe neste efeito)',
    caracteristicasAvancadas:
      'Características avançadas — custam 2 aprimoramentos (1 com Trabalho Manual Refinado, uma vez por item)',
    combinadoMestre: '(combinado com o Mestre)',
    outroCombinado: 'Outro, combinado com o Mestre',
    cargasAtuais: 'Cargas atuais',
    maximo: 'Máximo',
    gema: 'Gema',
    material: 'Material',
    notas: 'Notas',
  },
  // ── aba Fabriais ──────────────────────────────────────────────────
  fabriais: {
    padrao: 'Padrão',
    unico: 'Único',
    patamarN: 'Patamar {n}',
    cargasDe: 'Cargas de {nome}',
    gasto: 'Gasto: {gasto}',
    aprimoramentos: 'Aprimoramentos',
    revezes: 'Revezes',
    gema: 'Gema: {gema}',
    material: 'Material: {material}',
    recarregarInvestidura: '+1 {carga} com Investidura ({simbolo} {n})',
    editar: '✏️ Editar',
    excluir: '🗑️ Excluir',
    novoFabrial: '+ Novo Fabrial',
    grantormenta: '🌩️ Grantormenta',
    nenhumFabrial: 'Nenhum fabrial — toque em "+ Novo Fabrial".',
  },
  // ── aba Inventário ────────────────────────────────────────────────
  inventario: {
    gerenciar: 'Gerenciar Inventário',
    nomeItem: 'Nome do item',
    categoriaExemplo: 'Categoria (ex.: Ferramenta)',
    pesoKg: 'Peso (kg)',
    qtd: 'Qtd',
    outros: 'Outros',
    pesoCarregado: 'Peso carregado',
    sobrecarregado: 'Sobrecarregado',
    livre: 'Livre',
    marcos: 'Marcos',
    armas: 'Armas',
    nenhumaArma: 'Nenhuma arma veio no JSON deste personagem.',
    item: 'Item',
    peso: 'Peso',
    equipamentos: 'Equipamentos',
    nenhumEquipamento: 'Nenhum equipamento — use "Gerenciar Inventário" pra adicionar.',
    pertences: 'Pertences',
    deflexaoN: 'Deflexão {n}',
    vestir: 'Vestir {nome}',
    pertencesAjuda: 'Texto livre, uma coisa por linha — é o campo "Equipment" do Shards, e volta pra lá no Exportar.',
  },
  // ── aba Talentos ──────────────────────────────────────────────────
  talentos: {
    heroicos: 'Heroicos',
    radiantes: 'Radiantes',
    ancestrais: 'Ancestrais',
    graduacaoBonus: '+{n} graduação',
    outraDigitar: 'Outra (digitar)…',
    grupoCulturais: 'Culturais',
    grupoUtilidadePerito: 'Utilidade / Perito (exemplos do livro)',
    nomeEspecialidade: 'Nome da especialidade',
    comGraduacaoBonus: '{nome} (+{n} graduação bônus)',
    naoEncontrada: '{nome} (não encontrada na ficha atual)',
    nenhumTalento: 'Nenhum talento veio no JSON deste personagem.',
    semTraducao: '(sem tradução)',
    preRequisitos: 'Pré-requisitos: {texto}',
    semEntradaCatalogo: '(ainda sem entrada no catálogo)',
  },
  // ── o que as REGRAS devolvem pra tela escrever (regras/*.ts) ────
  regras: {
    faltaFoco: 'falta foco ({n})',
    faltaInvestidura: 'falta Investidura ({n})',
    semCarga: 'sem carga',
    umaVezPorCena: 'uma vez por cena',
    inconsciente: 'Inconsciente',
    semReacao: 'sem reação',
    foraDoTurno: 'fora do seu turno',
    jaUsouNoTurno: 'já usou neste turno',
    faltamAcoes: 'faltam ▶ ({n})',
    soDepoisDoAtaque: 'só depois de um ataque com a arma',
    atordoadoMenos2: 'Atordoado −2 ▶',
    surpreendidoMenos1: 'Surpreendido −1 ▶, sem turno rápido',
    fimTurnoSofra: 'Fim do seu turno: sofra {dano}.',
    fimTurnoSofraAflicao: 'Fim do seu turno: sofra o dano da aflição.',
    lembreteFocado: 'Focado: habilidade que custa foco sai 1 mais barata.',
    lembretePotencializado: 'Potencializado: encha a Investidura no início de cada turno seu.',
    lembreteDeterminado: 'Determinado: falhou um teste? Pode somar uma Oportunidade (e a condição acaba).',
    lembreteProstrado: 'Prostrado: corpo a corpo contra você tem vantagem. Levantar custa ▷.',
    lembreteUmaMao: 'Lesão: só pode usar uma mão.',
    avisoCargasRegra: 'Pela regra, o máximo seria {regra} cargas (está {atual}).',
    avisoAprimoramentos: '{qualidade} dá {n} aprimoramento(s); as escolhas somam {gastos}.',
    avisoRevezes: '{qualidade} dá {n} revés; há {atual}.',
    avisoNaoCabe: '{opcao} não cabe neste efeito (requer: {requer}).',
  },
} satisfies Record<string, Record<string, string | Plural>>

type Formato<T> = { [G in keyof T]: { [K in keyof T[G]]: T[G][K] extends string ? string : Plural } }

/** O formato que todo idioma cumpre: as mesmas variáveis do português. */
export type Dicionario = Formato<typeof PT>

/**
 * Texto que uma REGRA devolve pra tela escrever: qual variável (escolhida no
 * dicionário do idioma da tela) + as lacunas. Lacuna em texto é nome de jogo
 * e passa por `nome()` (lista: cada nome, juntos por vírgula); `n` escolhe a forma do plural.
 */
export type Mensagem = { texto: (d: Dicionario) => string | Plural; vars?: Record<string, string | number | string[]> }

/** Origem de um bônus no detalhe de um número: nome de jogo (texto) ou mensagem. */
export type Rotulo = string | Mensagem
