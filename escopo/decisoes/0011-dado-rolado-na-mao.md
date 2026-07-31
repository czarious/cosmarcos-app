<!-- DESTINO: escopo/decisoes/0011-dado-rolado-na-mao.md -->
# 0011 — O dado é rolado na mão; o rolador é incremento

**Status:** ✅ aceita · 16/Jul/2026
← [Índice das decisões](decisoes.md)

## Contexto

O roadmap tinha o **rolador com Dado de Trama** como item **1.4 — dentro do MVP**. Foi o item que mais consumiu trabalho: pesquisa das regras, conflito entre fontes, a [decisão 0010](0010-regra-provisoria-do-dado-de-trama.md), e a tela inteira especificada em [interface.md](../interface.md).

Aí o César disse:

> *"Jogar RPG é rolar dados na mão e fazer acontecer ali. O rolador de dados que estamos fazendo aqui é uma sugestão a incrementar. **O que importa é a ficha na mão do jogador estar atualizada antes da sessão.**"*

## Decisão

**O rolador sai do MVP e desce pra Fase 4.** Na mesa, o dado é físico — é parte do prazer de jogar, não um problema a resolver.

**O MVP é a ficha viva:** ler o JSON, cabeçalho fixo, dano/cura, foco/investidura, perícias e condições.

## O que isto NÃO significa

**A tese do app não mudou.** Confirmado pelo César: *"as duas, sem conflito"*. O app **continua sendo ficha viva na mesa** — tomou dano, atualiza ali. **E** continua importando que ela esteja correta antes da sessão. As duas coisas convivem. O que mudou é só **quem rola o dado**.

Ver [visao.md](../visao.md).

## Consequências

- ✅ **O MVP encolheu e ficou honesto.** Sobra o que o papel faz mal (número que muda toda hora) e sai o que a mão faz bem (rolar dado).
- ✅ **Destravou as duas perguntas mais emperradas do projeto.** A regra da vantagem ("fica com o segundo" × "pega o melhor") e a fórmula do total da perícia **só bloqueavam por causa do rolador**. Sem ele no MVP, viram perguntas da Fase 4.
- ✅ **A [decisão 0010](0010-regra-provisoria-do-dado-de-trama.md) para de ser urgente** — continua provisória, mas agora só afeta a Fase 4.
- ⚠️ **O total da perícia fica MAIS importante, não menos.** Rolando na mão, o jogador **precisa ler** o `+7` na tela pra somar ao d20. O contorno ("o César digita, o app guarda") continua valendo — e agora é a razão principal da tela de Perícias existir.
- 📌 **Nada do trabalho do rolador foi jogado fora.** A spec da tela ([interface.md](../interface.md)) e a regra ([0010](0010-regra-provisoria-do-dado-de-trama.md)) ficam escritas e prontas pra quando a Fase 4 chegar.
