<!-- DESTINO: escopo/README.md -->
# ESCOPO — cosmarcos-app

> **O quê** — o que o app faz, o que ele manipula e o que ainda é ideia.
> O **porquê** está no [CLAUDE.md](../CLAUDE.md) · o **onde** está no [mapa-projeto.md](../.claude/mapa-projeto.md).

## Sumário

| Doc | O que tem dentro |
|---|---|
| **[visao.md](visao.md)** | O que o app **é**, o que **não é**, e os princípios inegociáveis |
| **[roadmap.md](roadmap.md)** | As fases 1–5 com critério de pronto · backlog de ideias · perguntas em aberto |
| **[interface.md](interface.md)** | Requisitos de tela · padrões copiados do D&D Beyond · a tela de dados |
| **[cosmere-e-a-interface.md](cosmere-e-a-interface.md)** | As diferenças de sistema entre Cosmere e D&D que mudam a tela — ler antes de copiar padrão do DDB |
| **[personagens.md](personagens.md)** | Guia dos personagens da mesa · o Eccho e a exceção dele no código |
| **[dados.md](dados.md)** | O schema · o tradutor do Shards · o que é FIXO e o que é PROVISÓRIO |
| **[notas-do-livro.md](notas-do-livro.md)** | Índice das notas `📌 Para o app` da transcrição do livro (fórmulas, condições, dano/lesões) |
| **[conferencia-formulas.md](conferencia-formulas.md)** | Verificações das fórmulas contra a ficha real do Eccho (as caixas ✅ movidas da transcrição) |
| **[checklist-shards.md](checklist-shards.md)** | Tudo o que o Shards faz, tela por tela, e se o app já faz — de onde sai o que falta |
| **[premissas.md](premissas.md)** | Toda decisão de arquitetura numa página só — **vigente, sobrescrita quando muda**. Dentro: o porquê, o que custa, e 🪦 **"Descartado — não repropor"** (leia antes de propor ideia) |

## Estado do app

O que está pronto e o que falta: [roadmap.md](roadmap.md). O código mora na raiz do projeto, junto com a documentação ([premissas](premissas.md) → "Código e documentação na mesma pasta, fora do Drive") — mapa próprio: [`mapa-app.md`](../mapa-app.md).

## Por onde começar

| Quero… | Leia |
|---|---|
| Entender o projeto em 2 minutos | [visao.md](visao.md) |
| Saber o que falta fazer | [roadmap.md](roadmap.md) |
| Saber **por que** algo foi decidido assim | [premissas](premissas.md) |
| Propor uma ideia nova | [premissas](premissas.md) primeiro — pra não repropor o que já foi rejeitado |
| Escrever código que lê a ficha | [dados.md](dados.md) |
| Desenhar tela | [interface.md](interface.md) |

## Duas regras desta pasta

**1. Docs sem versão, sem changelog.** A memória do "porquê" fica nas [premissas](premissas.md), que só guardam o que vale hoje. A versão do **app** é uma só, no `package.json` (regra em `mapa-app.md`).

**2. Referência por nome, nunca por número de seção.** Escreva `ver [dados.md](dados.md) → "O que o Shards não dá"`, nunca "ver §6.3". Numeração quebra quando alguém insere uma seção no meio — já quebrou duas vezes aqui.
