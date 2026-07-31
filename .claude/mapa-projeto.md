<!-- DESTINO: .claude/mapa-projeto.md -->
# MAPA DO PROJETO — cosmarcos-app

> **Finalidade:** o **com o quê** e o **onde** — todo arquivo do projeto, o que cada um faz, e **quem depende de quem**.
> Serve pra responder uma pergunta só: **"se eu mexer neste arquivo, o que mais quebra?"**
> O CLAUDE.md tem o **porquê**; o [escopo/](../escopo/README.md) tem o **o quê**. Não duplicar entre eles.

> ⚠️ **REGRA DE MANUTENÇÃO — obrigatória**
> Este mapa é atualizado **a cada arquivo criado, renomeado, movido ou apagado**, na mesma entrega que fez a mudança. Mapa desatualizado é pior que mapa nenhum: mapa nenhum obriga a olhar; mapa errado faz confiar no errado.
> Quando abrir e quando não precisa: **§4**. Checklist: **§4.1**.

> 📌 **Versionamento: SIMPLIFICADO (17/Jul/2026).** **Uma versão só — a do `package.json` do app**, na raiz do projeto. Sem versão por arquivo (número que ninguém é obrigado a atualizar mente). Minor por item do roadmap · Patch por bug · Major por mudança radical. Regra completa: [`mapa-app.md`](../mapa-app.md). **Docs (.md) sem versão** — o "porquê" deles mora nas [decisões](../escopo/decisoes/decisoes.md).

---

## 0. Ambiente e dependências

| | |
|---|---|
| **Versão do app** | **0.1.0** — scaffold (fonte única: `package.json`) |
| **Máquina** | Dell (Windows) — **sem Mac, e não vai ter** |
| **Node** | v24.18.0 |
| **npm** | 11.16.0 |
| **Celulares da mesa** | **Todos Android** — ver [decisão 0001 → Atualização](../escopo/decisoes/0001-plataforma-pwa.md) |
| **Navegador de dev** | Chrome + F12 modo celular |

### Dependências npm

Moram no `package.json` da raiz do projeto (react · react-dom · vite · typescript; `vite-plugin-pwa` entra na Fase 2). Detalhe: [`mapa-app.md`](../mapa-app.md).

> **Custo zero:** toda dependência tem que ser open source e gratuita. Ver CLAUDE.md.

## 1. Arquivos que existem hoje

**Estado em 16/Jul/2026: o app não foi criado. Só documentação.**

| Arquivo | O que faz |
|---|---|
| [`CLAUDE.md`](../CLAUDE.md) | **Porquê / como.** Briefing de sessão: contexto, custo zero, regras Cosmere × D&D, convenções, processo, campanha |
| [`escopo/README.md`](../escopo/README.md) | **Sumário** do escopo — o índice de tudo abaixo |
| [`escopo/visao.md`](../escopo/visao.md) | O que o app é · não é · princípios |
| [`escopo/roadmap.md`](../escopo/roadmap.md) | Fases 1–5 · backlog · perguntas em aberto |
| [`escopo/interface.md`](../escopo/interface.md) | Requisitos de tela · padrões do DDB · tela de dados |
| [`escopo/dados.md`](../escopo/dados.md) | Schema · tradutor do Shards · FIXO × PROVISÓRIO |
| [`escopo/notas-do-livro.md`](../escopo/notas-do-livro.md) | Índice das notas `📌 Para o app` da transcrição |
| [`escopo/conferencia-formulas.md`](../escopo/conferencia-formulas.md) | Verificações das fórmulas contra a ficha real do Eccho (movidas da transcrição) |
| [`escopo/decisoes/decisoes.md`](../escopo/decisoes/decisoes.md) | Índice das decisões + a regra append-only |
| [`escopo/decisoes/cemiterio.md`](../escopo/decisoes/cemiterio.md) | Índice do que foi descartado |
| [`escopo/decisoes/000N-*.md`](../escopo/decisoes/decisoes.md) | **12 decisões**, uma por arquivo — append-only |
| [`referencia/README.md`](../referencia/README.md) | Explica a pasta `referencia/` — material de consulta, no `.gitignore` |
| `referencia/ddb/` | 18 prints do D&D Beyond mobile, renomeados `ddb-NN-assunto.jpg` + [README.md](../referencia/ddb/README.md) explicando cada um e o padrão estrutural do DDB. **Não versionado** (gitignore) |
| `referencia/shards/` | Export oficial do Eccho: `Eccho-sheet.pdf` (ficha), `pagina completa shards.pdf` (UI), `stormlight-characters-2026-07-03.json`. **Não versionado** |
| `referencia/livro/` | **Guia de Regras PT-BR** (Guerra das Tempestades v1.01). Desempata as perguntas em aberto. **Não versionado** — texto com direitos |
| `.gitignore` | Barra `node_modules/`, `dist/` e **`referencia/`** de ir pro repo público |
| `.claude/mapa-projeto.md` | **Onde.** Este arquivo: mapa de arquivos + dependências |
| `.claude/settings.local.json` | Configuração local do Claude Code. Não é do app |
| `src/` · `public/` · `package.json` · `vite.config.ts` · `index.html` | **TODO O CÓDIGO DO APP**, na mesma pasta que a documentação ([decisão 0016](../escopo/decisoes/0016-unificacao-codigo-e-docs.md)). Mapa próprio: [`mapa-app.md`](../mapa-app.md). **Mudança no código atualiza o mapa-app, não este** |

## 2. Arquivos planejados (fora de `app/`)

*O planejado **dentro** do app está no [mapa-app](../app/mapa-app.md). Aqui, só o que é da raiz:*

| Arquivo | Quando |
|---|---|
| `.github/workflows/deploy.yml` | Fase 2.4 — build + deploy automático (GitHub Actions → Pages) |
| `BUGS.md` | Quando houver o que registrar |

## 3. Mapa de dependências

**Como ler:** mexeu na coluna da esquerda → **revise** a do meio. A seta aponta para quem *sofre* a mudança.

### 3.1 Documentação (o que existe hoje)

| Se mudar… | Revisar… | Por quê |
|---|---|---|
| **Qualquer decisão de arquitetura** | `escopo/decisoes/` — **arquivo novo**, nunca editar o antigo | Append-only. A antiga é marcada superada e linkada. Ver [decisoes.md](../escopo/decisoes/decisoes.md) |
| **Decisão nova ou superada** | `escopo/decisoes/decisoes.md` (índice) · `cemiterio.md` (se matou alguma ideia) | Os dois são índices — não se atualizam sozinhos |
| `CLAUDE.md` — regras Cosmere × D&D | `escopo/interface.md` · `escopo/dados.md` | Regra do sistema muda o que a tela mostra e que campo existe |
| `escopo/roadmap.md` | `CLAUDE.md` → "Roadmap" | Lá só tem ponteiro + estado atual; confirmar que o estado ainda bate |
| **Qualquer arquivo criado/movido/apagado** | **este mapa** (§1, §2, §3) | Regra de manutenção — §4.1 |
| `CLAUDE.md` → "Quando chamar o mapa-projeto.md" | **§4 deste mapa** | São espelho um do outro — mudou um gatilho lá, muda aqui |
| **Um iPhone entrar na mesa** | [decisão 0001](../escopo/decisoes/0001-plataforma-pwa.md) · [0003](../escopo/decisoes/0003-estado-localstorage.md) | O Safari apaga storage após ~7 dias sem uso, e as sessões são quinzenais — a ficha sumiria entre sessões |

### 3.2 Código

**Movido pro [app/mapa-app.md](../app/mapa-app.md)** — dependências internas do app moram lá, junto do código. Aqui só a fronteira que cruza a raiz:

| Se mudar… | Revisar… | Por quê |
|---|---|---|
| `app/vite.config.ts` ou `app/package.json` | `.github/workflows/deploy.yml` (Fase 2.4) | `base` errado = tela branca no Pages; o workflow chama o script de build |

### 3.3 Fora do repositório

| Se mudar… | Revisar… | Por quê |
|---|---|---|
| Formato do export do **Shards** | `estado/importarShards.ts` (o tradutor) · `tipos/personagem.ts` · [`escopo/dados.md`](../escopo/dados.md) | ⚠️ **O de maior risco silencioso.** O Shards está na **0.1.0** — vai mudar. O tradutor **não dá erro** quando o formato muda: o campo chega vazio e a tela zera |
| **Transcrição nova do livro** em `campanha-cosmere-marcos` | [`escopo/roadmap.md`](../escopo/roadmap.md) → "Perguntas em aberto" · [decisão 0010](../escopo/decisoes/0010-regra-provisoria-do-dado-de-trama.md) · `regras/dados.ts` · `regras/calculos.ts` | **Gatilho de revisão.** O livro desempata: derruba regra provisória e fonte online. Ver CLAUDE.md → "Como Trabalhar" |
| Regra do livro (Brotherwise) | `regras/` · [`escopo/roadmap.md`](../escopo/roadmap.md) | Regra do sistema é fato externo. Não inventar |

## 4. Quando usar este mapa

**Este arquivo não entra em contexto sozinho** — só o CLAUDE.md é carregado automaticamente a cada sessão. Estes são os gatilhos que mandam abrir (espelho da tabela no CLAUDE.md → "Quando chamar o mapa-projeto.md"; mudou lá, muda aqui):

| Momento | O que fazer |
|---|---|
| **Qualquer coisa no código** (`src/`, `public/`, configs) | É com o **mapa-app** — este mapa não é tocado |
| **Antes** de alterar arquivo da raiz do qual outros dependem | **Ler §3** |
| **Antes** de criar arquivo na raiz | **Ler §1 e §2** |
| **Antes** de propor stack/dependência nova | **Ler §0** |
| **Depois** de criar · renomear · mover · apagar (na raiz) | **Escrever** — checklist abaixo |
| Só ler código, responder pergunta, editar texto de um MD | **Não precisa** |

> A última linha é o que faz as outras valerem: regra que dispara em tudo vira ruído e é ignorada.

### 4.1 Checklist — depois de criar, renomear, mover ou apagar

- [ ] Entrou no §1 (ou saiu dele)?
- [ ] Saiu do §2 se era planejado e virou real?
- [ ] Tem linha no §3 dizendo quem ele afeta?
- [ ] Os arquivos que **ele** afeta foram revisados?
- [ ] Versão e histórico deste mapa atualizados?

**Referência por nome, nunca por número.** Este mapa é o único doc que ainda usa `§` — e só nas próprias seções, que são poucas e estáveis. Pra apontar pro `escopo/`, sempre link + nome da seção.
