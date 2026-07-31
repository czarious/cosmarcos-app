<!-- DESTINO: escopo/decisoes/0010-regra-provisoria-do-dado-de-trama.md -->
# 0010 — Regra do Dado de Trama e da vantagem

**Status:** ⛔ **SUPERADA** em 17/Jul/2026 por [0015 — regra confirmada no livro](0015-regra-do-dado-confirmada-no-livro.md)
← [Índice das decisões](decisoes.md)

> ✅ **Esta decisão fez o que devia: existiu pra ser derrubada pelo livro, e foi** — em 1 dia, quando o César trouxe o Guia de Regras. A regra do César estava **errada** em 2 de 3 pontos (não é "fica com o segundo", é "escolhe um dos dois"; e vantagens vão em dados diferentes, não empilhadas). Fica aqui pela história — mostra que provisório não virou permanente por esquecimento. **A regra que vale é a [0015](0015-regra-do-dado-confirmada-no-livro.md).**

## Contexto

O Dado de Trama é o coração do sistema, e o `regras/dados.ts` depende dele. As fontes disponíveis **se contradizem**:

| Fonte | Diz sobre vantagem |
|---|---|
| [Wargamer](https://www.wargamer.com/cosmere-rpg/review) (review do livro final) | *"reroll any of the dice… **taking the better or worse result of the two**. If you have multiple advantages, they must be used on **different dice**"* |
| [Invested in the Cosmere](https://www.investedinthecosmere.com/article/how-to-use-the-plot-die-in-the-cosmere-rpg) | Rola **2d20 e pega o melhor** (estilo D&D) |
| **César** (joga o jogo, tem o livro) | **Fica sempre com o segundo dado.** O que muda é quem decide rerolar |

O livro resolveria — mas a pág. 7 (*"Using Cosmere RPG Dice"*) e a Referência Rápida **não estão transcritas** em `campanha-cosmere-marcos`.

## Decisão

**Vale a versão do César**, até o livro dizer outra coisa.

### O que está fechado *(três fontes concordam)*

Dado de Trama **não é um d6 comum** — é dado de símbolos:

| Faces | Resultado |
|---|---|
| 2 | *(em branco)* |
| 2 | **Oportunidade** |
| 2 | **Complicação** — soma **+2** ou **+4** no teste (uma face de cada) |

O bônus e a complicação são **inseparáveis**: o resultado ruim na narrativa **é** o que dá o bônus na conta.

### O que é a versão do César *(contraria as fontes online)*

| Regra | Contraria |
|---|---|
| **Fica sempre com a segunda rolagem** — rerolou 3 e saiu 1, vale 1 | Wargamer diz "pega o melhor/pior" |
| **Vantagens múltiplas podem ir no mesmo dado** | Wargamer diz *"must be used on different dice"* |
| Vantagem vale em **qualquer** dado, inclusive o Trama | — |
| Vantagem e desvantagem **se anulam 1 a 1**; vale o líquido | Wargamer concorda |

## Por que a versão do César venceu

Não foi por ser dele. O César disse: *"eu posso usar ela e rerolar, **ou eu nem preciso rerolar**"*.

**Essa escolha só existe se ficar com o segundo dado.** Com "pega o melhor", declinar seria burrice — a decisão não existiria, e vantagem viraria lucro automático. **A existência da decisão é evidência da regra.** O Wargamer provavelmente descreve o beta de 2024.

## Consequências

- ✅ Vantagem e desvantagem viram **a mesma mecânica** no código: *N rerrolagens, toca no dado, vale o segundo*. Quem decide (você ou o Marcos) acontece **na mesa**, não na tela — o app não precisa modelar.
- ⚠️ **Rerolar é aposta, não melhoria.** A UI precisa **parecer** irreversível. Ver [interface.md](../interface.md).
- ⛔ **Se o livro disser "pega o melhor", o `regras/dados.ts` muda inteiro** — e a UI junto: deixaria de ser aposta e viraria lucro.

## Como derrubar

Transcrever a **pág. 7** e a **Referência Rápida** pro `campanha-cosmere-marcos`. Aí: **não editar este arquivo** — escrever uma decisão nova que o supersede. Perguntas 1 a 4 do [roadmap.md](../roadmap.md).
