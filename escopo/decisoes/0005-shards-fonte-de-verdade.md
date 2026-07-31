<!-- DESTINO: escopo/decisoes/0005-shards-fonte-de-verdade.md -->
# 0005 — Shards = construção · app = jogo

**Status:** ⚠️ aceita, **com ressalva** (ver embaixo)
← [Índice das decisões](decisoes.md)

> **A decisão mais importante do projeto.**

## Contexto

O [Shards](https://shards.fairway3games.com) é o construtor oficial de fichas do Cosmere RPG. O César já usa e já tem o Eccho lá. Um app de ficha pode facilmente virar um segundo construtor — e aí existiriam **duas fichas do mesmo personagem**, divergindo.

## Decisão

```
Shards        →  MODO CONSTRUÇÃO
  subir nível, escolher talentos, atributos     → exporta JSON
                                                    ↓
cosmarcos-app →  MODO JOGO
  dano, cura, foco, investidura, dados, buffs, condições
```

O app **importa o JSON do Shards** e nunca edita a ficha-base. **O Shards manda no formato** — o app obedece.

**Regra derivada:** toda vez que uma ideia pedir pra editar a ficha-base, ela está pedindo pra virar Shards. Recusar.

## Validação externa

O **D&D Beyond mobile** faz exatamente a mesma divisão: o menu de seções dele termina com **"Edit Character on Website"**. O app é jogo; o site é construção. Achado nos prints em 16/Jul/2026 — ver [interface.md](../interface.md).

## Consequências

- ✅ Uma ficha só. O Shards é a verdade.
- ✅ O app não precisa saber criar personagem — some metade do trabalho.
- ⚠️ **Sem sync automático.** O DDB liga site e app por conta de usuário + servidor; nós não temos nenhum dos dois ([0003](0003-estado-localstorage.md)). Subiu de nível? Exporta o JSON e importa na mão.
- ⚠️ **O formato não é nosso.** O Shards está na 0.1.0 e vai mudar. Ver [0007](0007-formato-proprio-mais-tradutor.md).

## ⚠️ Ressalva — a linha é menos limpa do que parece

Verificado no export real em 16/Jul/2026: **o Shards também rastreia estado vivo.**

```json
"conditions": [],  "injuries": [],  "rollLog": [],
"resources": { "healthCur": 21, "focusCur": 4 }
```

Vida atual, foco atual, condições, lesões e até **log de rolagens** — ou seja, **o Shards não é só construção**. Os dois lados guardam a mesma coisa, que é exatamente o cenário de "duas fichas divergindo" que esta decisão queria evitar.

**Isto não invalida a decisão** — o Shards é web, não é PWA de mesa, e ninguém vai abrir o navegador no meio do combate. Mas cria um problema concreto: **reimportar pode sobrescrever o combate em andamento** com o `healthCur` que estava lá. Ver pergunta 7 do [roadmap.md](../roadmap.md).
