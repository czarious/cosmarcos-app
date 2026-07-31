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
| **[dados.md](dados.md)** | O schema · o tradutor do Shards · o que é FIXO e o que é PROVISÓRIO |
| **[notas-do-livro.md](notas-do-livro.md)** | Índice das notas `📌 Para o app` da transcrição do livro (fórmulas, condições, dano/lesões) |
| **[conferencia-formulas.md](conferencia-formulas.md)** | Verificações das fórmulas contra a ficha real do Eccho (as caixas ✅ movidas da transcrição) |
| **[decisoes/](decisoes/decisoes.md)** | Toda decisão de arquitetura, uma por arquivo — **append-only** |
| ↳ **[decisoes/cemiterio.md](decisoes/cemiterio.md)** | 🪦 O que já foi **descartado** e por quê — leia antes de propor ideia |

## Estado do app (18/Jul/2026)

**Código na raiz do projeto**, junto com a documentação ([decisão 0016](decisoes/0016-unificacao-codigo-e-docs.md)) — mapa próprio: [`mapa-app.md`](../mapa-app.md).

| Fase 1 — MVP | |
|---|---|
| ✅ 1.0 Ler a ficha do JSON (tradutor) | ✅ 1.1 Cabeçalho fixo (ficha em miniatura, métrico) |
| ✅ 1.2 Dano e cura | ✅ 1.3 Foco e Investidura |
| ⬜ 1.4 Perícias (fórmula do livro pronta) | ⬜ 1.5 Condições |

Transcrição do livro em andamento: `referencia/livro/transcricao/` (Introdução + Cap. 3 = as fórmulas da ficha ✅).

## Por onde começar

| Quero… | Leia |
|---|---|
| Entender o projeto em 2 minutos | [visao.md](visao.md) |
| Saber o que falta fazer | [roadmap.md](roadmap.md) |
| Saber **por que** algo foi decidido assim | [decisoes/](decisoes/decisoes.md) |
| Propor uma ideia nova | [decisoes/](decisoes/decisoes.md) primeiro — pra não repropor o que já foi rejeitado |
| Escrever código que lê a ficha | [dados.md](dados.md) |
| Desenhar tela | [interface.md](interface.md) |

## Duas regras desta pasta

**1. Docs sem versão, sem changelog.** A memória do "porquê" fica nas [decisoes/](decisoes/decisoes.md), datadas e append-only. A versão do **app** é uma só, no `package.json` (regra em `mapa-app.md`).

**2. Referência por nome, nunca por número de seção.** Escreva `ver [dados.md](dados.md) → "O que o Shards não dá"`, nunca "ver §6.3". Numeração quebra quando alguém insere uma seção no meio — já quebrou duas vezes aqui.
