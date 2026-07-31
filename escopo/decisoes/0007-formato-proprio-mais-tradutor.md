<!-- DESTINO: escopo/decisoes/0007-formato-proprio-mais-tradutor.md -->
# 0007 — Schema próprio em português + tradutor

**Status:** ✅ aceita · 16/Jul/2026
← [Índice das decisões](decisoes.md)

## Contexto

O app lê o JSON do Shards ([0005](0005-shards-fonte-de-verdade.md)). O export real é em **inglês** e tem estruturas esquisitas: `culture1`/`culture2` em vez de array, `idealsText` e `ideals` como dois objetos paralelos, `healthCur`/`healthMax` planos.

O CLAUDE.md manda **código em português**.

## Decisão

O tipo `Personagem` é **nosso** — em português, desenhado pra tela. Um **tradutor** (`estado/importarShards.ts`) converte o JSON do Shards na importação.

## Alternativas rejeitadas

| Alternativa | Por quê não |
|---|---|
| **Espelhar o Shards, em inglês** | Importar viraria `JSON.parse` — zero tradução, zero bug de conversão, e mudança do Shards se conserta num lugar só. **Rejeitada** por violar o "código em português" e herdar as esquisitices do Shards pra dentro da tela |
| **Espelhar o Shards, traduzido campo a campo** | Mantinha as esquisitices sem o benefício de ser cópia fiel — o pior dos dois |

## Consequências

- ✅ A tela lê `vida.atual`, não `healthCur`. O schema é desenhado pro app, não herdado.
- ✅ O tradutor conserta as esquisitices num lugar só: funde `idealsText` + `ideals`, junta `culture1` + `culture2`, separa armas de `inventory.items`.
- ⚠️ **Mais código.** Existe uma camada que não existiria na alternativa.
- ⛔ **O risco de verdade: o tradutor falha calado.** O Shards está na **0.1.0** — o formato **vai** mudar. Quando mudar, não dá erro: o campo chega vazio e a tela zera. O bug aparece na mesa, no meio do combate, e parece bug do app.
  **Mitigação obrigatória:** o tradutor **valida** o que recebe e **grita** no que não reconhecer. Nunca falhar em silêncio.
