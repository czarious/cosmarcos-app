<!-- DESTINO: escopo/decisoes/0015-regra-do-dado-confirmada-no-livro.md -->
# 0015 — Regra do Dado de Trama e da vantagem, confirmada no livro

**Status:** ✅ aceita · 17/Jul/2026
**Supersede:** [0010 — regra provisória](0010-regra-provisoria-do-dado-de-trama.md) *(que existia pra ser derrubada pelo livro — e foi)*
← [Índice das decisões](decisoes.md)

## Contexto

A [0010](0010-regra-provisoria-do-dado-de-trama.md) rodava na **regra do César**, provisória, porque as fontes online divergiam e o livro não estava transcrito. Em 17/Jul/2026 o César trouxe o **Guia de Regras PT-BR** (Guerra das Tempestades v1.01). Lido direto: introdução (pág. 7–10) e cap. 3 (pág. 58). **O livro desempata** — hierarquia do CLAUDE.md: livro > César > online.

## Decisão — o que o livro diz (é isto que vale)

### Vantagem e desvantagem *(pág. 58 — corrige o César)*

> *"Role dois de cada do dado escolhido, e escolha um dos dois resultados para usar — aplique o resultado do dado escolhido e descarte o outro."*

- **Rola 2 do dado, ESCOLHE um.** Vantagem: o **jogador** escolhe (fica com o melhor). Desvantagem: o **MJ** escolhe (fica com o pior).
- **Cada dado só uma vez por teste.** Duas vantagens = **dois dados diferentes**, nunca 3 do mesmo.
- Vale em **qualquer** dado do teste: d20, dado de trama, ou dado de dano.
- **Anulam 1 a 1** (cada desvantagem cancela uma vantagem).
- **Não é recurso acumulável** — é circunstância *daquele* teste (regra do jogo, MJ concede, ou ação "Ganhar Vantagem").

### Dado de Trama *(pág. 8–10)*

- **Só rola quando "aumentam as apostas"** — o MJ (ou uma habilidade) decide, em testes tensos. Não é todo teste. Uma vez por teste, nunca depois do d20.
- **6 faces:** 2 em branco · 2 Oportunidade (O) · 2 Complicação (C).
- **Complicação dá bônus +2 ou +4** no d20 — **mesmo se o teste falhar**. O número é o dobro da face do d6 (1→+2, 2→+4).
- **20 e 1 naturais** dão Oportunidade / Complicação automáticas, além do dado de trama (pode empilhar num mesmo teste). ⚠️ **A Complicação do 1 natural NÃO dá bônus** — diferente da Complicação do dado de trama.

### Gastar Oportunidade / Complicação *(pág. 9)*

| Oportunidade (jogador gasta) | Complicação (MJ gasta) |
|---|---|
| **Auxiliar Aliado** — próximo teste do aliado ganha vantagem | **Atrapalhar Aliado** — próximo teste de um PJ sofre desvantagem |
| **Recompor-se** — recupera 1 de foco | **Distraí-lo** — perde 1 de foco |
| **Acerto Crítico** — vira crítico (só ataques) | **Influenciar a Narrativa** — inconveniente narrativo |
| **Influenciar a Narrativa** — efeito narrativo bom | |

## Consequências

- ✅ **As perguntas 1–4 do roadmap estão RESOLVIDAS** com citação do livro.
- ✅ **O rolador (Fase 4) fica mais simples e mais correto:** some o "pool de vantagens acumuladas"; entra "para cada vantagem líquida, rola 2 de um dado diferente e escolha". O app mostra as duas rolagens e destaca a escolhida.
- ⚠️ **A tela de dados do [interface.md](../interface.md) precisa ser refeita** — foi escrita na regra provisória (contadores acumuláveis, "fica com o segundo"). **Não é urgente:** o rolador é Fase 4 ([decisão 0011](0011-dado-rolado-na-mao.md)). Marcar a seção como "a refazer".
- ✅ **A [0010](0010-regra-provisoria-do-dado-de-trama.md) cumpriu o papel dela:** existiu pra ser derrubada pelo livro, e foi. Fica no histórico — mostra que a regra provisória do César não virou permanente por esquecimento.

## Correção de bônus — símbolos de ação *(pág. 10, achado de brinde)*

O livro define os símbolos, e o nosso schema/CLAUDE.md estavam trocados:

| Símbolo | Livro | Tínhamos (errado) |
|---|---|---|
| **▶** | 1 ação | ▷ |
| **▶▶ / 2** | 2 ações | ▷▷ |
| **▶▶▶ / 3** | 3 ações | ▷▷▷ |
| **↻** | reação | ↻ ✅ |
| **▷** | ação **livre** | ↺ |

Corrigir no `tipos/personagem.ts` e no CLAUDE.md quando a aba Ações for construída.
