<!-- DESTINO: escopo/decisoes/0012-ficha-inteligente-e-o-objetivo.md -->
# 0012 — A ficha inteligente é o objetivo do projeto

**Status:** ✅ aceita · 16/Jul/2026
**Não supersede a [0009](0009-ler-primeiro-calcular-depois.md)** — corrige o *motivo* dela. A estratégia continua igual; o destino é que estava mal escrito.
← [Índice das decisões](decisoes.md)

## Contexto

A [decisão 0009](0009-ler-primeiro-calcular-depois.md) dizia: *"a base de regras própria vira **evolução**, não pré-requisito"*. Está tecnicamente correto — mas tinha um subtexto errado: **"talvez nunca"**.

O César corrigiu:

> *"Primeiro começaremos o projeto apenas lendo o JSON do Shards, para poder ter um protótipo. **Minha primeira intenção aqui é a ficha inteligente! Isso é o motivo de eu estar criando o app.** Eu posso marcar/digitar apenas o que é mutável, como HP atual."*

> *"São as pequenas regras que clicamos e atualiza a ficha ou abre coisas novas."*

## Decisão

**A ficha inteligente é o objetivo. Ler o JSON é o andaime.**

| Etapa | O que é |
|---|---|
| **Protótipo** (Fases 1–3) | Leitor. O app lê o JSON e desenha. Sem regra nenhuma |
| **Destino** | **Ficha inteligente.** O app conhece as regras e as aplica |

A estratégia da [0009](0009-ler-primeiro-calcular-depois.md) **não muda** — FIXO × PROVISÓRIO continua valendo, e o Shards continua entregando as contas prontas enquanto a base de regras não existe. O que muda é o horizonte: **PROVISÓRIO não é um estado permanente aceitável — é dívida a pagar.**

## A fronteira: inteligência de jogo × de construção

**Não são a mesma coisa.** Registrar isto evita a confusão que quase virou uma decisão errada:

| ✅ **Inteligência de JOGO** — é o objetivo | ⛔ **Inteligência de CONSTRUÇÃO** — é do Shards |
|---|---|
| *Enhance* → gasta 1 Investidura, aplica FOR+1 e VEL+1 até o fim do próximo turno | **Alocar talento** |
| Ação do Mancha → desconta 1 Foco | Escolher atributo ao subir de nível |
| *Regenerate* → recupera 1d6 + patamar de Vida | Definir graduação de perícia |
| Condição ativa → o que ela muda na ficha | Escolher Trilha, Ordem, cultura |
| Dado de Trama → oportunidade, complicação, +2/+4 | |

**A coluna da esquerda inteira é modo JOGO** — é o app fazendo o que o papel não faz. **Não conflita com a [0005](0005-shards-fonte-de-verdade.md).**

> ⚠️ **O caso de fronteira: jurar um Ideal.**
> O **gatilho é jogo** — jura-se na mesa, no meio da cena. Mas a **consequência é construção**: libera Investidura *e talentos a alocar*.
> **Ainda não decidido.** Quando chegar a vez: o app pode reconhecer o Ideal jurado, mas **alocar talento continua no Shards** até que alguém decida o contrário — com uma decisão escrita, não por acidente.

## Consequências

- ✅ **O rumo fica explícito.** Sem isto, uma sessão futura leria a [0009](0009-ler-primeiro-calcular-depois.md) e concluiria que calcular é opcional. É o oposto: **é o motivo do app existir.**
- ✅ **A ordem continua a mesma.** Protótipo lendo JSON primeiro — dá pra ver a ficha na tela sem esperar o livro ser transcrito.
- ⚠️ **A transcrição do livro sai do "seria bom" e vira caminho crítico.** Cada página transcrita é uma regra que o app passa a saber. Ver CLAUDE.md → "Como Trabalhar".
- ⚠️ **A superfície editável é pequena, de propósito.** *"Eu posso marcar/digitar apenas o que é mutável, como HP atual."* O que o app deixa mexer é **estado vivo** — não a ficha-base.
- ⚠️ **Risco de longo prazo:** conforme o app aprende regras, ele passa a poder **discordar do Shards**. Quando isso acontecer, a [0005](0005-shards-fonte-de-verdade.md) precisa ser reaberta — quem é a verdade? **Não decidir isso por omissão.**
