<!-- DESTINO: escopo/decisoes/decisoes.md -->
# Decisões

Toda decisão de arquitetura do cosmarcos-app, **uma por arquivo**, numerada em sequência. Padrão [ADR — Architecture Decision Record](https://adr.github.io/).

## A regra que faz isto funcionar

> ⚠️ **APPEND-ONLY. Decisão aceita não se edita — nunca.**
>
> Mudou de ideia? **Escreve uma decisão nova** que *supersede* a antiga, e liga as duas. A antiga fica lá, marcada como superada, com o motivo original intacto.
>
> **Por quê:** o valor de registrar não é saber o que foi decidido — é saber **por que**, e **por que mudou**. Reescrever o motivo antigo apaga exatamente a parte que interessa. *(Correção de typo pode. Trocar o raciocínio, não.)*

## 🪦 [cemiterio.md](cemiterio.md) — o que já foi descartado

**Leia antes de propor qualquer coisa.** Índice de tudo que está morto — ideias rejeitadas e decisões superadas — com o motivo em uma linha e o link pro raciocínio completo. Evita rediscutir do zero o que já foi resolvido.

## Índice das decisões

*Auditado em 31/Jul/2026 — os 16 status conferidos. Agrupado por tema; **a numeração dos arquivos não muda** (append-only).*

### Vigentes — 13

**Plataforma & Stack**
| # | Decisão |
|---|---|
| [0001](0001-plataforma-pwa.md) | **PWA** — um código, Android + iPhone, sem loja |
| [0002](0002-stack-react-ts-vite.md) | **React + TypeScript + Vite** *(supersede a 0006)* |

**Dados & Regras**
| # | Decisão |
|---|---|
| [0005](0005-shards-fonte-de-verdade.md) | **Shards = construção · app = jogo** ⚠️ *com ressalva: o Shards também guarda estado vivo* |
| [0007](0007-formato-proprio-mais-tradutor.md) | Schema **próprio em português** + tradutor na importação |
| [0009](0009-ler-primeiro-calcular-depois.md) | **Ler primeiro, calcular depois** — FIXO × PROVISÓRIO |
| [0012](0012-ficha-inteligente-e-o-objetivo.md) | **A ficha inteligente é o objetivo** — ler JSON é o andaime |
| [0015](0015-regra-do-dado-confirmada-no-livro.md) | **Regra do Dado e da vantagem** — confirmada no livro *(supersede a 0010)* |

**Interface**
| # | Decisão |
|---|---|
| [0008](0008-cabecalho-fixo.md) | **Cabeçalho fixo** — vitais grudados, diverge do DDB |
| [0011](0011-dado-rolado-na-mao.md) | **O dado é rolado na mão** — rolador é incremento (Fase 4) |
| [0013](0013-tema-shards-claro.md) | Tema **Shards fiel** — claro, pergaminho |

**Infraestrutura**
| # | Decisão |
|---|---|
| [0003](0003-estado-localstorage.md) | **localStorage** ⚠️ *contestada pela Fase 5 (mesa inteira)* |
| [0004](0004-hospedagem-github-pages.md) | **GitHub Pages**, repo público |
| [0016](0016-unificacao-codigo-e-docs.md) | **Código e docs juntos**, fora do Drive *(supersede a 0014)* |

### Superadas — 3 *(ficam pela história; ver [cemiterio.md](cemiterio.md))*

| # | Decisão | Superada por |
|---|---|---|
| [0006](0006-stack-js-puro.md) | ~~Stack HTML/CSS/JS puro~~ | [0002](0002-stack-react-ts-vite.md) |
| [0010](0010-regra-provisoria-do-dado-de-trama.md) | ~~Regra provisória do Dado de Trama~~ | [0015](0015-regra-do-dado-confirmada-no-livro.md) |
| [0014](0014-codigo-no-c-docs-no-drive.md) | ~~Código no C:, docs no Drive~~ | [0016](0016-unificacao-codigo-e-docs.md) |

## Status — o que cada um significa

| | |
|---|---|
| ✅ **aceita** | Vale. Construir em cima disto |
| ⚠️ **provisória** | Vale **por ora**, com data de validade conhecida. Vai ser derrubada por uma fonte melhor (o livro) |
| ⚠️ **contestada** | Vale, mas já existe pedido que conflita. Ver o campo "Contestada por" |
| ⛔ **superada** | Não vale mais. Fica aqui pela história — ver o link pra que a substituiu |

## Como escrever uma nova

Copie a estrutura de qualquer uma. O esqueleto é:

```md
# 000N — Título curto no imperativo

**Status:** aceita · DD/Mmm/AAAA
**Supersede:** 000X *(se for o caso)*

## Contexto      → qual era o problema, o que se sabia na época
## Decisão       → o que ficou decidido, em uma frase
## Alternativas rejeitadas  → e o motivo de cada uma
## Consequências → o que isto custa, inclusive o que dói
```

**Consequências é o campo que importa.** Decisão sem custo escrito é propaganda, não registro.
