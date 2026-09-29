<!-- DESTINO: .claude/mapa-projeto.md -->
# MAPA DO PROJETO — cosmarcos-app

> **Finalidade:** o **com o quê** e o **onde** — todo arquivo do projeto, o que cada um faz, e **quem depende de quem**.
> Serve pra responder uma pergunta só: **"se eu mexer neste arquivo, o que mais quebra?"**
> O CLAUDE.md tem o **porquê**; o [escopo/](../escopo/README.md) tem o **o quê**. Não duplicar entre eles.

> ⚠️ **REGRA DE MANUTENÇÃO — obrigatória**
> Este mapa é atualizado **a cada arquivo criado, renomeado, movido ou apagado**, na mesma entrega que fez a mudança. Mapa desatualizado é pior que mapa nenhum: mapa nenhum obriga a olhar; mapa errado faz confiar no errado.
> Quando abrir e quando não precisa: **"Quando usar este mapa"**, no fim. Checklist lá dentro.

> 📌 **Versionamento:** ver [`mapa-app.md`](../mapa-app.md) → "Versionamento". **Docs (.md) sem versão** — o "porquê" deles mora nas [premissas](../escopo/premissas.md).

---

## Ambiente e dependências

| | |
|---|---|
| **Versão do app** | fonte única: `package.json` — **não repetir o número aqui** (cópia de versão mente) |
| **Máquina** | Dell (Windows) — **sem Mac, e não vai ter** |
| **Node** | v24.18.0 |
| **npm** | 11.16.0 |
| **Celulares da mesa** | **Todos Android** — ver [premissas](../escopo/premissas.md) → "PWA, sem loja de apps" |
| **Navegador de dev** | Chrome + F12 modo celular |

### Dependências npm

Moram no `package.json` da raiz do projeto (react · react-dom · vite · typescript; `vite-plugin-pwa` entra na Fase 2). Detalhe: [`mapa-app.md`](../mapa-app.md).

> **Custo zero:** toda dependência tem que ser open source e gratuita. Ver CLAUDE.md.

## Arquivos que existem hoje

*Só a raiz. O que existe dentro de `src/` está no [`mapa-app.md`](../mapa-app.md).*

| Arquivo | O que faz |
|---|---|
| [`CLAUDE.md`](../CLAUDE.md) | **Briefing de sessão.** Só o que se usa em TODA sessão: quem é o César, como trabalhar, convenções, o índice dos docs e o estado atual. O resto é referência |
| [`escopo/README.md`](../escopo/README.md) | **Sumário** do escopo — o índice de tudo abaixo |
| [`escopo/visao.md`](../escopo/visao.md) | O que o app é · não é · princípios |
| [`escopo/roadmap.md`](../escopo/roadmap.md) | Fases 1–5 · backlog · perguntas em aberto |
| [`escopo/interface.md`](../escopo/interface.md) | Requisitos de tela · padrões do DDB · tela de dados |
| [`escopo/dados.md`](../escopo/dados.md) | Schema · tradutor do Shards · FIXO × PROVISÓRIO |
| [`escopo/cosmere-e-a-interface.md`](../escopo/cosmere-e-a-interface.md) | Cosmere × D&D — as diferenças de sistema que mudam a tela. Ler antes de copiar padrão do DDB |
| [`escopo/personagens.md`](../escopo/personagens.md) | Guia dos personagens da mesa · o Eccho e sua exceção no código |
| `escopo/jogadores.md` | De-para jogador → personagem e contato da mesa. **Não versionado** — nome de pessoa não vai pro repo público |
| [`escopo/notas-do-livro.md`](../escopo/notas-do-livro.md) | Índice das notas `📌 Para o app` da transcrição |
| [`escopo/conferencia-formulas.md`](../escopo/conferencia-formulas.md) | Verificações das fórmulas contra a ficha real do Eccho (movidas da transcrição) |
| [`escopo/premissas.md`](../escopo/premissas.md) | **Toda decisão de arquitetura**, numa página só — vigente, sobrescrita quando muda. Inclui "Descartado — não repropor" |
| [`referencia/README.md`](../referencia/README.md) | Explica a pasta `referencia/` — material de consulta, no `.gitignore` |
| `referencia/ddb/` | Prints de referência de interface, de consulta do César. **Não versionado** (gitignore) — interface de terceiro, nunca sobe |
| `referencia/shards/` | Export oficial do Eccho: `Eccho-sheet.pdf` (ficha), `pagina completa shards.pdf` (UI), `stormlight-characters-2026-07-03.json`. **Não versionado** |
| `referencia/livro/` | **Guia de Regras PT-BR** (Guerra das Tempestades v1.01). Desempata as perguntas em aberto. **Não versionado** — texto com direitos |
| `referencia/livro/dicionario-en-ptbr.md` | Dicionário EN (Shards) → PT-BR (livro) de toda a terminologia, com a fonte de cada termo. Alimenta os de-para do `importarShards.ts`. **Não versionado** |
| `.gitignore` | Barra `node_modules/`, `dist/` e **`referencia/`** de ir pro repo público |
| `.claude/mapa-projeto.md` | **Onde.** Este arquivo: mapa de arquivos + dependências |
| [`.claude/mapa-shards.md`](mapa-shards.md) | **Onde, no site do Shards:** telas, catálogos, banco do navegador, defeitos conhecidos e como exportar |
| `.claude/gerar-icones.mjs` | Gera os PNG do PWA a partir de `public/icone.svg`. Usa `sharp`, instalado na hora (`--no-save`) — não é dependência do projeto |
| `.github/workflows/deploy.yml` | Push em main → testes → build → GitHub Pages (Fase 2.4) |
| `apk/twa-manifest.json` | Receita do APK (TWA/Bubblewrap). O resto de `apk/` é gerado e fica fora do Git |
| [`.claude/apk.md`](apk.md) | Como gerar o APK, onde mora a chave de assinatura (fora do repo), conferência de segurança |
| `.claude/verificar.mjs` | A revisão de organização executável: `node .claude/verificar.mjs`. Links, mapas × disco, versão copiada |
| [`.claude/organizacao.md`](organizacao.md) | **Como a estrutura se mantém.** A regra do CLAUDE.md, pastas por papel, gatilhos de refatoração. A organização é responsabilidade do Claude |
| `.claude/settings.local.json` | Configuração local do Claude Code. Não é do app |
| `.claude/agents/transcritor-livro.md` | Agente que transcreve UM capítulo do Guia de Regras. **Não versionado** — cita o livro |
| `src/` · `public/` · `package.json` · `vite.config.ts` · `index.html` | **TODO O CÓDIGO DO APP**, na mesma pasta que a documentação ([premissas](../escopo/premissas.md) → "Código e documentação na mesma pasta, fora do Drive"). Mapa próprio: [`mapa-app.md`](../mapa-app.md). **Mudança no código atualiza o mapa-app, não este** |

## Arquivos planejados na raiz

*O planejado **dentro** do app está no [mapa-app](../mapa-app.md). Aqui, só o que é da raiz:*

| Arquivo | Quando |
|---|---|
| `BUGS.md` | Quando houver o que registrar |

## Mapa de dependências

**Como ler:** mexeu na coluna da esquerda → **revise** a do meio. A seta aponta para quem *sofre* a mudança.

### Dependências entre documentos

| Se mudar… | Revisar… | Por quê |
|---|---|---|
| **Qualquer decisão de arquitetura** | `escopo/premissas.md` — **sobrescrever a linha vigente** | Página única, sem histórico. Recusou uma ideia? A linha vai pra "Descartado — não repropor" |
| `escopo/cosmere-e-a-interface.md` | `escopo/interface.md` · `escopo/dados.md` · `src/variaveis.ts` | Regra do sistema muda o que a tela mostra, que campo existe e que símbolo se usa |
| `escopo/roadmap.md` | `CLAUDE.md` → "Roadmap" | Lá só tem ponteiro + estado atual; confirmar que o estado ainda bate |
| **Qualquer arquivo criado/movido/apagado** | **este mapa** | Regra de manutenção — ver "Checklist" |
| **Estrutura, pastas, onde um doc mora** | [`.claude/organizacao.md`](organizacao.md) | É lá que moram a regra do CLAUDE.md, os gatilhos de refatoração e a revisão periódica |
| **Um iPhone entrar na mesa** | [premissas](../escopo/premissas.md) → "PWA, sem loja de apps" · [premissas](../escopo/premissas.md) → "localStorage, sem servidor" | O Safari apaga storage após ~7 dias sem uso, e as sessões são quinzenais — a ficha sumiria entre sessões |

### Dependências do código

**Movido pro [mapa-app.md](../mapa-app.md)** — dependências internas do app moram lá, junto do código. Aqui só a fronteira que cruza a raiz:

| Se mudar… | Revisar… | Por quê |
|---|---|---|
| `vite.config.ts` ou `package.json` | `.github/workflows/deploy.yml` (Fase 2.4) | `base` errado = tela branca no Pages; o workflow chama o script de build |

### Dependências de fora do repositório

| Se mudar… | Revisar… | Por quê |
|---|---|---|
| Formato do export do **Shards** | `estado/importarShards.ts` (o tradutor) · `tipos/personagem.ts` · [`escopo/dados.md`](../escopo/dados.md) | ⚠️ **O de maior risco silencioso.** O Shards está na **0.1.0** — vai mudar. O tradutor **não dá erro** quando o formato muda: o campo chega vazio e a tela zera |
| **Transcrição nova do livro** em `campanha-cosmere-marcos` | [`escopo/roadmap.md`](../escopo/roadmap.md) → "Perguntas em aberto" · [premissas](../escopo/premissas.md) → "O Dado de Trama e a vantagem seguem o livro" · `regras/dados.ts` · `regras/calculos.ts` | **Gatilho de revisão.** O livro desempata: derruba regra provisória e fonte online. Ver CLAUDE.md → "Como Trabalhar" |
| Regra do livro (Brotherwise) | `regras/` · [`escopo/roadmap.md`](../escopo/roadmap.md) | Regra do sistema é fato externo. Não inventar |

## Quando usar este mapa

**Este arquivo não entra em contexto sozinho** — só o CLAUDE.md é carregado automaticamente a cada sessão. Estes são os gatilhos que mandam abrir (espelho da tabela no CLAUDE.md → "Quando chamar o mapa-projeto.md"; mudou lá, muda aqui):

| Momento | O que fazer |
|---|---|
| **Qualquer coisa no código** (`src/`, `public/`, configs) | É com o **mapa-app** — este mapa não é tocado |
| **Antes** de alterar arquivo da raiz do qual outros dependem | Ler **"Mapa de dependências"** |
| **Antes** de criar arquivo na raiz | Ler **"Arquivos que existem hoje"** e **"Arquivos planejados na raiz"** |
| **Antes** de propor stack/dependência nova | Ler **"Ambiente e dependências"** |
| **Depois** de criar · renomear · mover · apagar (na raiz) | **Escrever** — checklist abaixo |
| Só ler código, responder pergunta, editar texto de um MD | **Não precisa** |

> A última linha é o que faz as outras valerem: regra que dispara em tudo vira ruído e é ignorada.

### Checklist — depois de criar, renomear, mover ou apagar

- [ ] Entrou em "Arquivos que existem hoje" (ou saiu de lá)?
- [ ] Saiu de "Arquivos planejados na raiz" se era planejado e virou real?
- [ ] Tem linha em "Mapa de dependências" dizendo quem ele afeta?
- [ ] Os arquivos que **ele** afeta foram revisados?
- [ ] Versão e histórico deste mapa atualizados?

**Referência por nome, nunca por número.** Os **dois mapas** (este e o `mapa-app.md`) são a única exceção, e só pras próprias seções — são poucas e estáveis. Doc que cresce por dentro usa nome: ver `.claude/organizacao.md`. Pra apontar pro `escopo/`, sempre link + nome da seção.
