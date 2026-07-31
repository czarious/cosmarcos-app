<!-- DESTINO: escopo/roadmap.md -->
# Roadmap · Backlog · Perguntas em aberto

← [Sumário](README.md)

> **Critério de pronto** = como saber que acabou. Sem isso, é lista de desejo, não escopo.

---

## Fase 1 — MVP de mesa

*O que se usa em toda sessão. Sem isto, o app não substitui o papel.*

| # | Funcionalidade | O que faz | Critério de pronto |
|---|---|---|---|
| **1.0** | ✅ **Ler a ficha do JSON** | Carrega `public/personagens/*.json` via tradutor ([decisão 0007](decisoes/0007-formato-proprio-mais-tradutor.md)) + validação | ✅ O Eccho aparece: nome, nível, atributos, defesas 14/17/13, Vida 21/21 |
| 1.1 | ✅ **Cabeçalho fixo** | A ficha oficial em miniatura: identidade + 3 grupos (atributos·defesa·recurso) + derivados em métrico ([decisão 0008](decisoes/0008-cabecalho-fixo.md)) | ✅ Troco de seção e rolo até o fim: tudo grudado no topo |
| 1.2 | ✅ **Dano e cura** | ▲/▼ na Vida + toque no número pra entrada numérica. Spec: [interface.md](interface.md) → "Recursos" | ✅ Toco na Vida, abre o controle, digito 7 e "− Dano", Vida cai de 21 → 14. Trava em 0 e no máx |
| 1.3 | ✅ **Foco e Investidura** | **O mesmo componente da 1.2** (`ControleRecurso`), usado nos 3 recursos | ✅ Toco no Foco, ▼: 4 → 3. Labels viram "Gastar/Recuperar" |
| **1.4** | **Lista de Perícias** | 18 perícias com a bolinha de graduação e o total **CALCULADO** — fórmula confirmada no livro p.56 (`regras/calculos.ts`) | Vejo Dedução com ◎ e **+7 calculado**, batendo com o Shards; **legível de relance** — é o número que somo ao d20 rolado na mão |
| 1.5 | **Condições e buffs** | Adicionar/remover condições ativas | Marco "Atordoado", ele aparece; removo, some |

**Pronta quando:** o César joga uma sessão inteira só com o celular na mão e o dado na outra, sem abrir o PDF nem o Shards.

> 📌 **O item 1.0 é novo (16/Jul/2026).** A Fase 1 prometia mostrar Vida/Foco/Investidura, mas ler o JSON era o item **3.1 — duas fases depois**. Como nenhum personagem pode estar no código (princípio 1), **a fase era impossível como estava escrita**.

> ⚠️ **Dois itens saíram da Fase 1 em 16/Jul/2026:**
> - **Rolador com Dado de Trama** → Fase 4. **O dado é rolado na mão.** Ver [decisão 0011](decisoes/0011-dado-rolado-na-mao.md)
> - **Ações do Mancha** → backlog. Sem fonte de dados. Ver pergunta 9

## Fase 2 — PWA

*Vira app de verdade no celular.*

| # | Funcionalidade | Critério de pronto |
|---|---|---|
| 2.1 | **Instalável** (`vite-plugin-pwa`) | "Adicionar à tela inicial" no Android; abre em tela cheia |
| 2.2 | **Offline** | Modo avião → app abre e funciona |
| 2.3 | **Persistência** (localStorage) | Fecho com Vida 14/21, reabro depois: continua 14/21 |
| 2.4 | **Deploy automático** (GitHub Actions → Pages) | `git push` → alguns minutos → celular já tem a versão nova |

## Fase 3 — Dados

*Fecha o ciclo com o Shards.*

| # | Funcionalidade | Critério de pronto |
|---|---|---|
| 3.1 | **UI de importar** | Baixo o export no celular, toco em "Importar", escolho o arquivo, a ficha atualiza. *(Ler o JSON já é o 1.0 — aqui é só a interface de trocar de ficha sem mexer no repositório)* |
| 3.2 | **Fabriais com cargas** | Diapasão 0/5, Clock 3/3 — gasto e recupero carga |
| 3.3 | **Lesões com contagem de dias** | Temporária conta dias; permanente não some sozinha |

> ❓ Reimportar depois de subir de nível **preserva ou zera** o estado vivo? O Shards manda `healthCur` ([dados.md](dados.md) → "Ficha × estado vivo"), então reimportar pode sobrescrever o combate. Ver pergunta 7.

## Fase 4 — Incrementos

*Aprovadas, sem prazo. Só depois da Fase 3.*

| # | Funcionalidade | Critério de pronto |
|---|---|---|
| **4.0** | **Rolador com Dado de Trama** ⬅️ *veio da Fase 1* | Tela que sobrepõe a ficha, já preenchida pelo contexto. Regra **definitiva do livro** na [decisão 0015](decisoes/0015-regra-do-dado-confirmada-no-livro.md); spec em [interface.md](interface.md) → "Tela de dados" | Toco em "Maça" → abre com 1d20 e 1d6 → rolo → vejo o total e o símbolo do Trama |
| 4.1 | **Talentos consultáveis** | Toco no talento → vejo o resumo; link pras notas em `campanha-cosmere-marcos` |
| 4.2 | **Log de sessão** | Histórico do que rolei/gastei na sessão |
| 4.3 | **Reordenar seções** | Escolho a ordem e ela persiste |
| 4.4 | **Multi-personagem** | Troco entre fichas da mesa. *Quase de graça: o JSON já vem como `characters: []`* |

> 📌 **O 4.0 desceu da Fase 1** em 16/Jul/2026 — **o dado é rolado na mão** ([decisão 0011](decisoes/0011-dado-rolado-na-mao.md)). A spec está inteira e pronta; é só implementar quando chegar a vez. **As perguntas 1 a 4 daqui de baixo existem só por causa dele** — por isso deixaram de bloquear qualquer coisa.

## Fase 5 — A mesa inteira

> ⚠️ **VISÃO REGISTRADA — não decidida. Nada aqui está aprovado.**
> Pedido do César em 16/Jul/2026. A decisão sobre servidor só acontece **depois da Fase 3**, quando o app já tiver provado que presta na mesa. Até lá, [visao.md](visao.md) e as [decisões](decisoes/decisoes.md) valem integralmente.

| # | Funcionalidade | Precisa de servidor? |
|---|---|---|
| 5.1 | Cada jogador da mesa põe a **ficha dele** | ✅ sim |
| 5.2 | **Salvamento online** — abro em outro aparelho e está atualizado | ✅ sim |
| 5.3 | **Painel do mestre** — o Marcos vê as fichas **resumidas**: só o que importa em combate | ✅ sim |
| 5.4 | Mestre **abre a ficha inteira** quando precisa de detalhe | ✅ sim |
| 5.5 | **Tempo real** — tomo dano, o Marcos vê; subo de nível, a mesa vê | ✅ sim |

> 💡 **O que NÃO precisa de servidor:** *"hoje ganho 10 marcos, amanhã abro e está lá"* — isso é o **item 2.3** (localStorage), **no mesmo celular**, e sai de graça na Fase 2. Servidor só entra pra **outro aparelho** (5.2) ou **outra pessoa** (5.3–5.5). Metade do pedido é barata, metade não.

**O que a Fase 5 contradiz:**

| Item | Contradiz | Onde |
|---|---|---|
| 5.3 · 5.4 | *"Ficha de mestre — não é"* | [visao.md](visao.md) |
| 5.1 · 5.5 | *"Rolador compartilhado / VTT — não é"* | [visao.md](visao.md) |
| 5.2 · 5.5 | Estado: localStorage — sem servidor, sem login | [decisão 0003](decisoes/0003-estado-localstorage.md) |
| 5.5 | Princípio 3 — **Offline primeiro** | [visao.md](visao.md) |

**Custo zero sobrevive, mas muda de sentido.** Supabase, Firebase e Cloudflare D1 têm plano grátis folgado pra 5 pessoas. Só que hoje o custo zero vem de **não existir servidor**; ali passaria a vir de **uma empresa manter o plano grátis**. É trocar ausência de dependência por dependência gratuita — e o Firebase já mudou de preço uma vez.

### Candidato: Google Drive API + OAuth

*Proposto pelo César em 16/Jul/2026. **Não decidido** — registrado pra não se perder.*

**Por que é o melhor candidato até agora:**

- ✅ O César **já integrou** Drive API + OAuth 2.0 no `ficha-imovel`. Não é tecnologia nova.
- ✅ Ele **já tem** a conta — este repositório mora dentro do Drive dele. **Zero dependência nova.**
- ✅ Escopo `drive.file` (só arquivos que o app criou) **não é escopo sensível** no Google → não exige verificação do app.

**O que ele resolve e o que não resolve:**

| Item | Drive dá conta? |
|---|---|
| 5.1 · cada jogador com a ficha dele | ✅ um JSON por jogador |
| 5.2 · salvamento online | ✅ é literalmente o que o Drive faz |
| 5.3 · 5.4 · painel do mestre | ✅ pasta compartilhada com o Marcos |
| **5.5 · tempo real** | ❌ **não.** Drive não é banco de tempo real. Só dá pra ficar perguntando "mudou?" de tempos em tempos, e isso queima cota e gasta bateria |

> **Consequência a encarar:** o Drive entrega 4 dos 5 itens. O tempo real (*"tomo dano e o Marcos vê na hora"*) é o único que ele não faz — e é justamente o mais chamativo. Ou a mesa aceita "atualiza quando abrir", ou entra um banco de verdade só pra isso.

**Não resolve o login.** Cada jogador precisaria de conta Google e autorizar o app. Continua contrariando a [decisão 0003](decisoes/0003-estado-localstorage.md) — só que **de graça e sem empresa nova**.

#### Três coisas a acertar antes de decidir

**1. Drive grátis basta — Google One é desnecessário.**
A ficha do Eccho tem **16 KB**. A mesa inteira, ~100 KB. O Drive gratuito tem **15 GB** — 150 mil vezes mais do que o projeto precisa. E amarrar o app a uma assinatura seria pior que o Firebase: cancelou o One, quebrou o app. Nunca depender do plano pago.

**2. O Drive NÃO substitui o localStorage — ele soma.**

| | localStorage | Drive |
|---|---|---|
| Velocidade | instantâneo | chamada de rede |
| **Sem Wi-Fi** | ✅ funciona | ❌ **morre** |
| Outro aparelho / o mestre vê | ❌ não | ✅ sim |

Escrever direto no Drive **quebra o princípio 3 (offline primeiro)**: combate rolando, Wi-Fi caindo, cada toque em "dano" travando na rede.

O padrão é **local-first**: `localStorage` é a **cópia de trabalho**; o Drive é a **camada de sincronia**, que sobe quando dá. **O próprio Shards faz assim** — ele se descreve como *"local-first character sheets"* e guarda tudo em IndexedDB. O padrão já está provado neste domínio.

**3. ~~O caro não é guardar — é sincronizar.~~ → resolvido pelo dono único.**

*A objeção original: subir JSON é trivial, mas **conflito** é caro — dois editam a mesma ficha offline, os dois sobem, qual vence?*

**O César matou a objeção em 16/Jul/2026:** *"podemos colocar salvamentos travados por dono da ficha"*.

> **Um dono por ficha. Só o dono escreve; os outros leem.**
>
> Conflito só existe com **dois escritores na mesma coisa**. Com dono único, não há o que reconciliar: o Marcos lê a ficha do César, nunca escreve nela. Sobra só o caso de o próprio dono abrir em dois aparelhos — e aí data mais recente vence, que é trivial.

Isso derruba o principal argumento contra a Fase 5. **Sincronia deixa de ser cara.**

*Ideia complementar do César: escrever numa pasta temp e consolidar no JSON principal depois de um gatilho ou um tempo, verificando por data. Com dono único isso talvez seja complexidade desnecessária — decidir na implementação, não agora.*

> ⚠️ **Armadilha técnica a verificar antes de prometer o painel do mestre:** o escopo OAuth `drive.file` só enxerga arquivos que **o próprio app criou**. Pro Marcos ler a ficha do Danilo, ou usa o Google Picker (o usuário aponta o arquivo na mão), ou pede escopo amplo — que é **sensível** e exige verificação do app pelo Google. Isso muda o esforço da 5.3/5.4.

> Se a Fase 5 for aprovada, **não basta exumar a ideia**: a [decisão 0003](decisoes/0003-estado-localstorage.md) justifica o localStorage dizendo *"é ficha de uma pessoa"* — o motivo também morreu. Escrever uma decisão nova que a supersede.

---

## Backlog de ideias

*Depósito livre. Nada aqui é compromisso — é pra não perder a ideia.*
*Conferido contra o export real do Shards em 16/Jul/2026: a nota diz se **o dado existe** pra sustentar a ideia.*

### Origem: César

| Ideia | Nota |
|---|---|
| _(a preencher — as quatro da Fase 4 já subiram pro roadmap)_ | |

### Derivadas do schema e das conversas

| Ideia | Nota |
|---|---|
| **Ações do Mancha com custo de Foco** | ⬅️ **Veio da Fase 1** (era o item 1.6) — sem fonte de dados. O texto existe em `radiante-alternauta-03.md`, só não vem do Shards. Volta quando a pergunta 9 for decidida |
| **Base de regras Cosmere própria** | Evolução natural da [decisão 0009](decisoes/0009-ler-primeiro-calcular-depois.md): conforme o livro for transcrito, PROVISÓRIO vira FIXO calculado. **Não é pré-requisito de nada** — o Shards já entrega as contas prontas |
| Descanso — recuperar Foco/Investidura de uma vez | Depende da regra de descanso — confirmar no livro |
| Dado de Recuperação | ✅ `resources.recoveryDie` = `"d8"`. Falta a ação de usar |
| Objetivos — marcar como concluído | ✅ `achieved: boolean` + `rank`. ⚠️ **Não é barra de progresso** — a ideia antiga vinha do schema errado |
| Ideais radiantes — marcar como jurado | ✅ `radiant.ideals.{i1..i5}`. O Eccho tem os 5 como `false` |
| Exportar estado / backup manual | Contra perder tudo se limpar o navegador. Cresce de importância se a Fase 5 não sair |
| Marcos (moeda) — gastar/ganhar | ✅ `resources.marks` = 65. Baixa prioridade na mesa |
| Iniciativa | Confirmar se o Cosmere usa e como |
| Propósito / Obstáculo / Personalidade na tela | ✅ Existem e estão preenchidos. São de interpretação, não de mesa |
| Especializações na tela | ✅ `expertises[]` — o Eccho tem 4 |

---

## Perguntas em aberto

*O que trava decisão e precisa de resposta do César ou de consulta ao livro.*

**Como isto se resolve:** conforme o César for transcrevendo o livro em PT-BR pro `campanha-cosmere-marcos`, as respostas vão saindo e **este doc é corrigido contra o livro**. A hierarquia é **livro > decisão do César > fonte online > nada**. Processo no [CLAUDE.md](../CLAUDE.md) → "Como Trabalhar".

> 📌 **Nada aqui bloqueia o MVP.** Depois da [decisão 0011](decisoes/0011-dado-rolado-na-mao.md) (o dado é rolado na mão), as perguntas **1 a 4 são todas da Fase 4** — existem só por causa do rolador. A Fase 1 anda sem nenhuma delas.

| # | Pergunta | Status | Fonte que resolve |
|---|---|---|---|
| ~~1~~ | ~~"Fica com o segundo" × "pega o melhor"~~ | ✅ **RESOLVIDA 17/Jul** — [decisão 0015](decisoes/0015-regra-do-dado-confirmada-no-livro.md). Livro pág. 58: **rola 2, escolhe um** (vantagem = melhor). César estava errado; vantagens vão em **dados diferentes** | Livro ✓ |
| ~~2~~ | ~~Oportunidade/Complicação automáticas no 20/1?~~ | ✅ **RESOLVIDA — sim** (livro pág. 10). ⚠️ mas a Complicação do 1 natural **não dá bônus** | Livro ✓ |
| ~~3~~ | ~~+2/+4 da Complicação soma na falha?~~ | ✅ **RESOLVIDA — sim** (livro pág. 9): vale "independente de o teste falhar" | Livro ✓ |
| ~~4~~ | ~~De onde nascem as vantagens?~~ | ✅ **RESOLVIDA** (livro pág. 58): regra do jogo · MJ concede · ação "Ganhar Vantagem" | Livro ✓ |
| 5 | **Fórmula do total da perícia** | ✅ **RESOLVIDA — confirmada no LIVRO** (p.56, 18/Jul/2026): modificador = **atributo efetivo + graduações**. Já batia 18/18 no PDF do Shards. Transcrição: `03-estatisticas/03-pericias-e-graduacoes.md` | Livro ✓ |
| 6 | **`attributeMods` somam no base?** | ✅ **RESOLVIDA** em 17/Jul/2026 — **sim.** O PDF exibe o Intelecto já como **4** (base 3 + mod 1). ⚠️ **Consequência de UI: o app mostra o valor EFETIVO, não o base.** A nota do PDF confirma: *"User Modifications: +1 Attribute Intellect"* | PDF do Shards |
| 7 | Reimportar **preserva ou zera** o estado vivo? | ⚠️ **Urgente.** O Shards manda `healthCur`/`focusCur`/`conditions` — reimportar pode sobrescrever o combate | **Decisão do César** |
| 8 | **Ativação dos talentos — de onde vem?** | ✅ **FONTE ACHADA** em 17/Jul/2026 — **o PDF traz** (o JSON não): *"Special Activation", "Always Active", "Reaction"*. É **regra do talento**, não dado do personagem. Como puxar pro app ainda é decisão (o JSON de import não tem; ou digita, ou o app aprende a regra) | PDF · [decisão 0012](decisoes/0012-ficha-inteligente-e-o-objetivo.md) |
| 9 | **Ações do Mancha e de Luz — de onde vêm?** | ✅ **FONTE ACHADA** em 17/Jul/2026 — **o PDF traz as duas listas completas** (Enhance, Regenerate, Test Assistance…), com custo e texto. **São regra do Elsecaller/inkspren, não do personagem** — todo Alternauta tem. É a "base de regras" da [decisão 0012](decisoes/0012-ficha-inteligente-e-o-objetivo.md). Falta decidir *como* entra (JSON de regras próprio × digitar) | PDF · transcrições · [0012](decisoes/0012-ficha-inteligente-e-o-objetivo.md) |
| 10 | O Shards tem **"Roll Log"** e rastreia estado vivo — ele já faz o que a gente quer? | ❓ Não muda o MVP (é web, não PWA de mesa), mas vale saber antes de investir nas Fases 4 e 5 | Usar o Shards |
| 11 | Quais ideias suas ainda não estão escritas? | ❓ | **César** |
| **12** | ⛔ **O export do Shards está DESATUALIZADO — o 1º Ideal não está marcado lá** | Achado em 16/Jul/2026 comparando o export com a ficha PT-BR do César. O `eccho.md` diz *"1º Ideal jurado ✅ — desbloqueou Investidura e Surges"* e **Investidura 0/5**. O export diz `ideals.i1: false` e **`investitureMax: 0`**. **O app mostraria Investidura 0/0** e o Eccho ficaria sem Stormlight Actions | **César marcar o Ideal no Shards e reexportar** |

### Resolvidas

*Não apagar — mostram o que já foi verificado, e com que fonte.*

| Pergunta | Resposta | Fonte |
|---|---|---|
| ~~Quais **valores** do d6 dão Oportunidade/Complicação?~~ | **Pergunta errada.** Não são valores, são **símbolos**: 2 branco · 2 Oportunidade · 2 Complicação (+2 e +4) | [Dungeon Mister](https://dungeonmister.com/cosmere-rpg/plot-die-in-cosmere-rpg/) + César |
| ~~Vantagem é 2d20 pega-o-melhor, como no D&D?~~ | **Não.** É rerrolagem de qualquer dado, gastando recurso contável | César + [Wargamer](https://www.wargamer.com/cosmere-rpg/review); *"ganha **uma** vantagem"* nas transcrições do Alternauta |
| ~~Vantagem e desvantagem se anulam?~~ | **Sim, 1 a 1.** Vale o líquido | César + [Wargamer](https://www.wargamer.com/cosmere-rpg/review) |
| ~~Vantagem vale no Dado de Trama?~~ | **Sim** | César |
| ~~Vantagens múltiplas podem ir no **mesmo dado**?~~ | **Sim.** ⚠️ Contraria o Wargamer (*"must be used on different dice"*) — vale o César até o livro desempatar | César |
| ~~O JSON do Shards bate com o schema?~~ | **Não — quase nada batia.** O schema vinha do PDF. Reescrito contra o export real | Export `stormlight-characters-2026-07-03.json` |
| ~~Estado vivo nasce só no app?~~ | **Não.** O Shards manda `conditions`, `injuries`, `rollLog`, `healthCur`, `focusCur` | Export real |
