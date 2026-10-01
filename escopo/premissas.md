<!-- DESTINO: escopo/premissas.md -->
# Premissas do app

← [Sumário](README.md)

> **Página única e VIGENTE.** Aqui mora **o que vale hoje** e **por quê**.
> Mudou de ideia? **Sobrescreve a linha.** Não anota outra, não marca a antiga como superada, não abre arquivo novo. Não existe histórico nesta página — de propósito (12/Set/2026).
>
> O **o quê** em tabela resumida está no [CLAUDE.md](../CLAUDE.md). Aqui está o **porquê** e, principalmente, **o que cada escolha custa**. Premissa sem custo escrito é propaganda, não registro.

## Plataforma e infraestrutura

### Custo zero — a regra que manda em todas as outras
**Tudo com recurso gratuito. Nenhuma escolha pode introduzir custo recorrente.** Quase toda premissa desta seção é consequência dela — inclusive as que doem.

| Item | Ferramenta | Custo |
|---|---|---|
| Framework / linguagem | React · TypeScript · Vite | Grátis (open source) |
| Build / runtime | Node.js · npm | Grátis |
| PWA | `vite-plugin-pwa` | Grátis |
| Código e versionamento | GitHub | Grátis |
| Build automático | GitHub Actions | Grátis (ilimitado em repo público) |
| Hospedagem | GitHub Pages | Grátis (repo público) |
| Instalar no celular | PWA → "Adicionar à tela inicial" | Grátis — **sem loja de apps** |
| Banco de dados | localStorage (no próprio celular) | Grátis — sem servidor |
| Login / conta | Não tem | — |

**O que está sendo evitado de propósito:** Google Play US$ 25 (uma vez) e Apple Developer US$ 99/ano → evitados pelo PWA · servidor e banco → evitados pelo localStorage · GitHub Pages em repo privado (exige plano pago) → por isso o repo é público.

- ⚠️ **Dependência nova passa por aqui antes de entrar.** Gratuita hoje e paga amanhã não serve: o critério é *ausência de dependência*, não *plano grátis de alguém*.

### PWA, sem loja de apps
Um código roda em Android e iPhone, instala por "Adicionar à tela inicial". O César desenvolve no Windows: compilar pro iPhone exigiria um **Mac só pra compilar**.

- ⚠️ **iPhone: instalar é obrigatório, não opcional.** O Safari apaga o armazenamento de **site** depois de ~7 dias sem uso, e as sessões são quinzenais. O app **adicionado à Tela de Início** tem contagem própria de dias de uso, e o WebKit diz não esperar apagar os dados dele (blog do WebKit, "Full Third-Party Cookie Blocking and More", 2020). Por isso: no iPhone, **sempre pela Tela de Início, nunca pela aba do Safari**. O app também pede armazenamento persistente (`main.tsx`) e o backup da engrenagem é a rede de segurança. O APK é só Android — ver [apk.md](../.claude/apk.md).
- ⚠️ Instalar não é óbvio pra leigo — tem que ensinar o "Adicionar à tela inicial".
- **Também existe um APK** (29/Set/2026), pra quem prefere instalar arquivo: é uma **TWA** — casca que abre o app publicado dentro do Chrome. Continua sendo o PWA: atualiza sozinho a cada push, a ficha é a mesma do Chrome, zero código a mais. Custa: depende do Chrome no celular (a mesa toda tem). Como gerar: [.claude/apk.md](../.claude/apk.md).

### GitHub Pages, repositório público
Pages em repo privado exige plano pago. O repo é público **por causa do custo zero**, não por preferência.

**O que sobe e o que não sobe** (César, 29/Set/2026): **a fonte nunca sobe** — PDF, transcrição, notas tiradas dela. **O app sobe** — regras e conteúdo feitos a partir da transcrição, em palavras próprias (nome e número exatos; frase copiada, não). **Nome de jogador também não sobe** — só o de personagem ([personagens.md](personagens.md)).

- 🔒 **Publicado com a porta fechada** (29/Set/2026): a página só roda o que vem dela mesma — sem script de terceiro, sem conexão pra fora (política no `vite.config.ts`). O teste falhando barra a publicação. O que fica público: o app e a ficha-semente do Eccho; nome de jogador e livro, nunca. Dependência do app: 0 vulnerabilidades no `npm audit` (as ferramentas de dev têm 2 moderadas, fora do app).
- ⛔ **Limite duro:** se um dia o app embutir o compêndio com texto do livro, o repo **tem** que virar privado — e aí o Pages deixa de servir. A saída é **Cloudflare Pages** ou **Netlify** (aceitam repo privado no plano grátis). Decidir **antes** de trazer o texto, nunca depois.

### React + TypeScript + Vite
O app é **orientado a dados**: lê um JSON de terceiro e desenha o que vier. O Shards está na **0.1.0** e **vai** mudar de formato. Em JS puro, campo renomeado não dá erro — a tela só zera. Com TS, o compilador acusa.

- ⚠️ Toolchain que os outros projetos do César não têm. E **não dá pra abrir o arquivo no Live Server**: quem serve é o `npm run dev`.

### localStorage, sem servidor
O estado mora no próprio celular. Funciona offline, custo zero de verdade — ausência de dependência, não "grátis enquanto uma empresa quiser".

- ⚠️ **Limpar o navegador apaga a ficha.** Backup manual segue no backlog.
- ⚠️ **Preso a um aparelho**, e **ninguém mais enxerga** — o Mestre não vê a Vida do César.
- 🔥 **Em disputa:** a [Fase 5](roadmap.md) (mesa inteira, painel do mestre, tempo real) precisa de servidor. Ao reabrir, atenção: o motivo do enterro do servidor foi *"localStorage resolve — é ficha de uma pessoa"*, e **essa frase deixou de ser verdade** quando a mesa entrou no escopo. Candidato na mesa: **Google Drive API + OAuth** (o César já integrou no `ficha-imovel`) — resolve 4 dos 5 itens, **não resolve tempo real**.

### Código e documentação na mesma pasta, fora do Drive
Tudo em `C:\dev\GitHub\cosmarcos-app`; o backup é o **GitHub**. O Google Drive **corrompe repositório Git** e trava com `node_modules` (milhares de arquivinhos = milhares de eventos de sync; junction no G: é impossível, o sistema de arquivos não aceita reparse points). Projeto em dois lugares já custou um `ONDE-ESTA-O-APP.md`, dez links absolutos e duas cópias do `eccho.json` divergindo.

- ⚠️ **`referencia/` (145 MB) só existe no disco local** — não sobe pro GitHub por decisão e não está mais no Drive. O PDF do livro é re-baixável; **as 135 transcrições não são.** Vale backup manual à parte.
- ⚠️ `.gitignore` errado num `git add -A` publica material protegido de uma vez. Conferir `git status` antes de commit.

## Dados e regras

### O Shards é SEMENTE; o app é dono da ficha
Importa o JSON do Shards **uma vez** e a partir daí **o app manda**: o César ajusta o que quiser, define a ficha no padrão dele, e o JSON é abandonado. Quem decide no boot é o **localStorage**; o JSON só é lido quando não há nada salvo.

- **Importar é um botão só** — o mesmo pro primeiro JSON e pra cada atualização: escolhe o arquivo exportado pelo Shards.
- **Exportar devolve pro Shards** (27/Set/2026): o app guarda o JSON cru da importação e exporta ele com as mudanças do app aplicadas por cima; o Shards substitui a ficha de mesmo id. Campo que o app não edita volta idêntico — é o que deixa construir no Shards (nível, talento) e jogar no app sem perder nenhum dos dois. A mesma regra vale na volta: **importar no Shards sobrescreve lá**.
- ⚠️ **Importar sobrescreve tudo. Não existe fusão** da ficha do app com o JSON novo, e não vai existir: a ficha não tem como adivinhar qual lado está certo. **Trazer um JSON desatualizado é perda de dado, e a responsabilidade é de quem importa.**
- ⚠️ Por isso se salva a **ficha inteira**, não só vida/foco: se salvasse só o estado vivo, todo ajuste de ficha morreria no próximo F5.
- 📌 **O que mudou aqui:** a versão anterior desta premissa dizia *"o app nunca edita a ficha-base — toda ideia que pedir isso está pedindo pra virar Shards, recusar"*. **Não vale mais.** O app edita. O Shards continua útil pra **construir** (subir nível, escolher talento) e gerar a semente — por conveniência, não por proibição.

### O app serve qualquer personagem da mesa — nenhum fica escrito no código
Ele lê um JSON e desenha o que vier. Quando a informação **não existe no export** (ex.: qual talento concedeu qual graduação de perícia — o Shards manda o `rankBonus` mas não a origem), a saída **nunca** é embutir um personagem no cálculo.

**A regra de três degraus, em ordem:**

1. **O que o jogador atribuiu no app manda** — sobrevive a redistribuição (a Erudição muda de perícia depois do descanso longo).
2. **Faltando atribuição, vale o número cru do Shards** — mas **marcado como origem não identificada**, nunca disfarçado de certo.
3. **Vínculo conhecido é dado, não código** — mora chaveado por `meta.nome` (`regras/especialidades.ts`), e quem não tem entrada funciona igual, só sem a origem nomeada.

- ⚠️ **O degrau 2 é o que impede o erro mais caro:** sem ele, um PC novo apareceria com a perícia **1 abaixo** da ficha dele no Shards, em silêncio. Número errado com cara de certo é o que este projeto mais persegue.
- 📌 Conferido com o código rodando nos 4 cenários (com vínculo · sem vínculo · redistribuído · atribuído à mão): o Eccho não muda, e o personagem sem vínculo bate com o Shards.

### Schema próprio em português + tradutor na entrada
O tipo `Personagem` é nosso, desenhado pra tela; o `estado/importarShards.ts` converte o JSON na importação. O export real é em inglês e tem esquisitices (`culture1`/`culture2` em vez de array, `idealsText` e `ideals` paralelos, `healthCur` plano) — o tradutor conserta num lugar só.

- ⛔ **O risco de verdade: o tradutor falha calado.** Quando o Shards mudar, não dá erro — o campo chega vazio e a tela zera, na mesa, no meio do combate. **Mitigação obrigatória: validar e GRITAR** no que não reconhecer. Nunca falhar em silêncio.

### Ler primeiro, calcular depois
O Shards **já fez a conta** — defesas, vida máxima, dado de recuperação e movimento vêm calculados no export. Então cada campo é classificado:

| | Significado |
|---|---|
| ✅ **FIXO** | O Shards manda pronto. O app lê e mostra |
| ⚠️ **PROVISÓRIO** | Falta regra ou o dado não vem. O app mostra **marcado como provisório** |

**Regra de ouro:** provisório **aparece na tela como provisório**. O app nunca mostra número inventado com cara de número certo — é a versão em pixels do "não inventar regra do sistema" do [CLAUDE.md](../CLAUDE.md). Classificação campo a campo em [dados.md](dados.md).

- ⚠️ **Dependência dobrada do Shards:** se ele calcular errado, o app não tem como conferir enquanto não tiver as regras.

### A ficha inteligente é o objetivo; ler o JSON é o andaime
Palavras do César: *"minha primeira intenção aqui é a ficha inteligente — isso é o motivo de eu estar criando o app"*. Protótipo = leitor. Destino = o app conhece as regras e as aplica. **PROVISÓRIO não é estado permanente aceitável — é dívida.**

A fronteira que evita confusão:

| ✅ Inteligência de **JOGO** — é o objetivo | ⛔ Inteligência de **CONSTRUÇÃO** — fica no Shards |
|---|---|
| *Enhance* gasta 1 Investidura e aplica FOR+1/VEL+1 até o fim do próximo turno | Alocar talento |
| Ação do Mancha desconta 1 Foco | Escolher atributo ao subir de nível |
| *Regenerate* recupera 1d6 + patamar de Vida | Definir graduação de perícia |
| Condição ativa → o que ela muda na ficha | Escolher Trilha, Ordem, cultura |

- ⚠️ **A transcrição do livro é caminho crítico**, não "seria bom": cada página transcrita é uma regra que o app passa a saber.
- 🔥 **A decidir — jurar um Ideal.** O gatilho é jogo (jura-se na cena), a consequência é construção (libera Investidura *e talentos a alocar*). Por ora o app pode reconhecer o Ideal jurado, mas **alocar talento continua no Shards** até alguém decidir o contrário de propósito.

### O Dado de Trama e a vantagem seguem o livro
A regra está **confirmada no Guia de Regras PT-BR** (pág. 8–10 e 58) e resumida em `escopo/notas-do-livro.md` — que fica **fora do repositório**, junto com o resto do material derivado do livro. A regra anterior, baseada em fonte online e na memória do César, estava **errada em 2 de 3 pontos** e foi derrubada pelo livro.

- 📌 **Pendência:** a seção "Tela de dados" do `interface.md` foi escrita na regra velha (contadores acumuláveis, "fica com o segundo") e **precisa ser refeita**. Não é urgente — o rolador é Fase 4.

## Interface

### Os vitais grudam no topo
Vida, Foco e Investidura ficam visíveis em qualquer seção **e em qualquer rolagem**. O D&D Beyond **não** faz isso — os vitais dele somem ao rolar. Divergimos de propósito: no D&D, AC e HP mudam pouco durante o turno; **no Cosmere esses três números mudam o tempo todo**, que é o motivo do app existir.

- ⚠️ O cabeçalho come altura de tela permanentemente, no aparelho onde a tela é o recurso escasso.
- 📌 **Se apertar, a saída é encolher** — faixa fina com os três números — **nunca sumir**.
- 📌 **No topo fica só o que muda na mesa:** os três recursos e as condições ativas. Atributos, defesas e derivados moram na aba Principal — o César pediu o topo enxuto, como o do DDB.

### Arrastar entre abas: Embla
Arrastar o dedo troca de aba com as abas coladas lado a lado. O arrasto é do **Embla Carousel** (`embla-carousel-react`): MIT, ~7 KB, sem dependência de terceiros, entra no próprio app (nada de CDN). Escolhido em 30/Set/2026 porque o arrasto feito à mão travava — falta física (inércia, trava de direção). Custa: uma dependência a mais pra manter atualizada.

### O dado é rolado na mão
*"Jogar RPG é rolar dados na mão e fazer acontecer ali."* O rolador desceu pra Fase 4; o MVP é a **ficha viva**. Isso **não** muda a tese do app — ele continua sendo ficha viva na mesa **e** ficha correta antes da sessão. O que mudou é só quem rola o dado.

- ⚠️ **O total da perícia fica MAIS importante, não menos:** rolando na mão, o jogador precisa **ler** o `+7` na tela pra somar ao d20.

### Tema Shards fiel — claro, pergaminho
Fundo pergaminho, texto marrom-escuro, painéis creme com borda dupla, títulos serifados em versalete, destaque vinho. Fonte **serifada do sistema (Georgia)** — webfont quebraria o offline-primeiro e adicionaria dependência. Escolhido pelo César com as paletas lado a lado, contra um híbrido escuro que o Claude recomendava.

- ⚠️ **Na mesa à noite, tela clara ofusca.** Se incomodar na prática, a saída registrada é um **alternador claro/escuro** como incremento — **não** trocar o tema inteiro de novo.

### Textos em variáveis, um arquivo por idioma
O César pediu o app inteiro alternável entre português e inglês (30/Set/2026), na engrenagem do topo. Toda palavra de tela é uma **variável** organizada por tela: `idioma/pt.ts` tem o português, `idioma/en.ts` as **mesmas variáveis** em inglês — faltou ou sobrou uma, o app não compila. Somar um idioma = copiar um arquivo e traduzir.

- **Nome de jogo não é variável de tela:** o que o Shards manda (perícia, arma, trilha…) volta pro inglês pelo caminho inverso dos de-para do tradutor; o dos catálogos de regra (ação, talento, lesão, fabrial) fica **ao lado do nome**, no catálogo (`nomeEn`). `idioma/nomes.ts` junta os dois — sem lista duplicada.
- **A regra não escreve frase:** devolve uma Mensagem (qual variável + lacunas), e a tela escreve no idioma. Por isso `regras/` não carrega palavra.
- **O que o jogador escreveu não traduz** (anotação, objetivo, Ideal, pertences) — decisão do César.
- **Em etapas:** 1ª, botões, títulos e nomes; 2ª, as descrições de regra (resumo de ação, condição, fabrial, fluxo), que ganham o inglês ao lado no catálogo. Mensagem de erro do tradutor e do save continua só em português.
- A escolha mora no aparelho (`localStorage`), não na ficha: não vai pro Shards.
- Pesquisado contra as práticas do i18next, gettext, Lingui, FormatJS, Fluent, W3C e MDN: frase inteira (nunca pedaços colados), plural pela regra de cada idioma (`Intl.PluralRules`), número no formato do idioma (`Intl`), `<html lang>`.
- ⚠️ **O compilador não pega tudo:** palavra escrita direto no componente, lacuna `{x}` que existe num idioma e não no outro, nome de jogo sem inglês. `idioma.test.ts` reprova os três.

## Código

### O que vira variável — `src/variaveis.ts`
Os **símbolos** e a **estrutura** da tela, sem palavra nenhuma: ícones de interação, símbolos de ativação (▶ ▷ ↻, do livro), o símbolo de cada recurso (♥ ◆ ✦ ⚡), quais verbos cada recurso usa, os 3 grupos da ficha e a ordem dos atributos. Três irmãos: aqui o **glifo**; em `estilos/base.css` a **cor e a forma**; em `idioma/pt.ts` e `en.ts` a **palavra** — ver "Textos em variáveis, um arquivo por idioma".

**O critério de entrada, medido — não pelo gosto:** entra o que **aparece em mais de um arquivo**, ou o que o César muda com frequência. **Conteúdo do sistema nunca entra** (talento, cultura, perícia, traço, tipo de dano): é regra do Cosmere, com dono em `regras/*.ts` e no tradutor.

**Por que o critério é escrito:** o arquivo se chama `variaveis.ts`, e nome genérico convida a virar depósito. **Cada variável leva uma nota** dizendo o que é e onde aparece — quando a nota fica difícil de escrever, é sinal de que aquilo não pertence ali.

## Descartado — não repropor

*Motivo em uma linha. Se a ideia voltar, é porque o mundo mudou — e aí a linha se reescreve, não se apaga.*

| Ideia | Por que não |
|---|---|
| **React Native · Flutter** | Precisa de build e de Mac pro iOS. Overkill — o PWA resolve |
| **Capacitor** (APK com o app dentro) | Cada versão exigiria reinstalar o APK; ficha separada da do Chrome; o WebView não baixa arquivo — quebraria backup e exportar. A TWA faz o mesmo sem nada disso |
| **App em loja** (Play · App Store) | US$ 25 + US$ 99/ano. Fura o custo zero |
| **HTML/CSS/JS puro** | Perdia a tipagem do schema, que é a espinha de um app orientado a dados. O motivo original ("toolchain que não agrega") não estava errado, estava **incompleto** |
| **Live Server** | Consequência do Vite: quem serve é o `npm run dev` |
| **Servidor + banco de dados** | Custo recorrente ⚠️ *o motivo original caducou — ver localStorage acima* |
| **Login / contas** | Sem servidor não há o que autenticar ⚠️ *contestado pela Fase 5* |
| **Espelhar o formato do Shards, em inglês** | Importar viraria `JSON.parse`, mas violava "código em português" e trazia as esquisitices do Shards pra dentro da tela |
| **Cabeçalho que rola pra fora** (como o DDB) | No Cosmere os vitais mudam o tempo todo |
| **Barra de navegação inferior** (como o DDB) | É a casca de um app com vários personagens e compêndio. Somos **uma ficha** — seria espaço morto |
| **Tema escuro** · **híbrido Shards-escuro** | Continuidade visual com o builder venceu. Rejeitado pelo dono, com as opções na mão |
| **Tudo no Google Drive** | Sync corrompe Git e trava com `node_modules` — provado na prática |
| **Migrar o código de volta pro Drive** | Criaria duas cópias divergindo. O GitHub é backup melhor em tudo |

## Tensões abertas

Nenhuma é bug; todas são coisa que o projeto sabe que ainda vai doer.

| Tensão | Onde dói |
|---|---|
| **Quando o app souber regras, ele pode discordar do Shards** | Quem é a verdade? Decidir de propósito, não por omissão |
| **`public/personagens/eccho.json` × o export em `referencia/shards/`** | Seguem divergentes (md5 diferentes). Definir qual é a fonte |
| **`mapa-app.md` × `.claude/mapa-projeto.md`** | Continuam dois. Foram separados quando o projeto vivia em dois lugares — vale reavaliar |
