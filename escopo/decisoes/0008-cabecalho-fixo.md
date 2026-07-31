<!-- DESTINO: escopo/decisoes/0008-cabecalho-fixo.md -->
# 0008 — Cabeçalho fixo (diverge do D&D Beyond)

**Status:** ✅ aceita · 16/Jul/2026
← [Índice das decisões](decisoes.md)

## Contexto

O DDB mobile é nossa referência de interação ([interface.md](../interface.md)). Os prints revelaram uma coisa que o texto herdado do CLAUDE.md errava: **o DDB não tem cabeçalho fixo**. O bloco de vitais (AC · Iniciativa · retrato · Vida) aparece no topo de cada seção mas **some ao rolar a tela** — só a barra de seção fica.

## Decisão

**Os vitais grudam no topo.** Vida, Foco e Investidura ficam visíveis em qualquer seção **e em qualquer rolagem de tela**. Divergimos do DDB de propósito.

## Por quê

> No D&D, AC e HP mudam pouco durante o turno. **No Cosmere, Vida/Foco/Investidura mudam o tempo todo** — é literalmente o motivo do app existir ([visao.md](../visao.md)).

Deixar sumir ao rolar seria copiar o DDB **cru** justamente no ponto onde o sistema é diferente — o erro que o CLAUDE.md manda evitar.

## Consequências

- ✅ O número que mais muda nunca está a uma rolagem de distância.
- ⚠️ **Custo aceito:** o cabeçalho come altura de tela permanentemente, num aparelho onde a tela é o recurso escasso.
- 📌 **Se apertar, a saída é encolher** — uma faixa fina com os três números — **nunca sumir**.
