<!-- DESTINO: escopo/decisoes/0002-stack-react-ts-vite.md -->
# 0002 — Stack: React + TypeScript + Vite

**Status:** ✅ aceita · 16/Jul/2026
**Supersede:** [0006 — Stack: HTML/CSS/JS puro](0006-stack-js-puro.md)
← [Índice das decisões](decisoes.md)

## Contexto

O CLAUDE.md se **contradizia**: dizia "Stack: React + TypeScript + Vite" no topo e, na tabela de decisões, "Stack: HTML/CSS/JS puro" + "~~React/TS/Vite~~ **descartado**". As pastas no disco (`css/`, `js/`, `dados/`, `icones/`) eram do plano de JS puro.

O César aprendeu a programar no `ficha-imovel`, que é JS puro — a stack dali é o que ele mantém sozinho hoje.

## Decisão

**React + TypeScript + Vite**, empacotado como PWA.

O fator decisivo: **o app é orientado a dados** (princípio 1) — ele lê um JSON do Shards e desenha o que vier. O schema tipado é a espinha desse desenho. O TypeScript garante que a ficha lida bate com o que a tela espera; em JS puro, um campo renomeado pelo Shards vira tela em branco sem aviso.

## Alternativas rejeitadas

| Alternativa | Por quê não |
|---|---|
| **HTML/CSS/JS puro** | Perdia a tipagem do schema. Ver [0006](0006-stack-js-puro.md) — era a decisão vigente, foi superada |

## Consequências

- ✅ O `tipos/personagem.ts` vira contrato executável, não documentação.
- ⚠️ **Toolchain nova pro César.** Node, npm, build — coisas que o `ficha-imovel` não tem. A curva existe.
- ⚠️ **Não dá mais pra abrir o arquivo no Live Server.** Quem serve o projeto é o `npm run dev`; o build gera a pasta publicada. Muda o fluxo de teste que ele já conhece.
- ⚠️ Quebra a consistência com os outros projetos dele (`ficha-imovel`, `reforma-rp-tibirica-682`), que seguem JS puro. Eles continuam sendo referência **organizacional**, não de stack.
