<!-- DESTINO: escopo/decisoes/0006-stack-js-puro.md -->
# 0006 — Stack: HTML/CSS/JS puro

**Status:** ⛔ **SUPERADA** em 16/Jul/2026 por [0002 — React + TypeScript + Vite](0002-stack-react-ts-vite.md)
← [Índice das decisões](decisoes.md)

> 📌 Este arquivo fica aqui **de propósito**, mesmo não valendo mais. Ver a regra append-only em [decisoes.md](decisoes.md): o valor de registrar não é saber o que foi decidido, é saber **por que mudou**.
>
> *Numerada 0006 porque só foi transcrita pra cá em 16/Jul/2026, quando a pasta `decisoes/` nasceu. A decisão em si é anterior — vinha da tabela do CLAUDE.md.*

## Contexto

Mesma stack do `ficha-imovel`, o projeto onde o César aprendeu a programar. Ele mantém aquele sozinho.

## Decisão *(revogada)*

HTML/CSS/JS puro, sem toolchain. O React/TS/Vite tinha sido explicitamente **descartado** com o motivo: *"toolchain que não agrega; quebra consistência"*.

## Por que foi superada

O motivo original não estava errado — **estava incompleto**. Ele pesava a facilidade de manutenção e ignorava que o app é **orientado a dados**: ele lê um JSON de terceiro (o Shards, que está na 0.1.0 e **vai** mudar de formato) e desenha o que vier.

Sem tipagem, uma mudança no Shards não dá erro — a tela só zera. Com TypeScript, o compilador acusa. Ver [0002](0002-stack-react-ts-vite.md) e [0007](0007-formato-proprio-mais-tradutor.md).

## O que sobrou dela

- A estrutura de pastas de JS puro (`css/`, `js/`, `dados/`, `icones/`) foi **apagada** em 16/Jul/2026 — estavam todas vazias.
- **Live Server** morreu junto, por consequência: quem serve o projeto agora é o `npm run dev`.
