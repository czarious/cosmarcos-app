<!-- DESTINO: escopo/decisoes/cemiterio.md -->
# Cemitério — o que já foi descartado, e por quê

← [Índice das decisões](decisoes.md)

**Leia isto antes de propor qualquer coisa.** É aqui que se descobre, em 30 segundos, que uma ideia já foi discutida e rejeitada — e com qual argumento.

> 📌 **Este arquivo é um índice, não a fonte.** O raciocínio completo mora na decisão que matou a ideia — o link da última coluna. Se o motivo estivesse escrito aqui **e** lá, um dos dois ia mentir com o tempo. Aqui fica a linha curta; lá, o porquê inteiro.

## Ideias rejeitadas

*Nunca foram adotadas.*

| Ideia | Motivo em uma linha | Raciocínio completo |
|---|---|---|
| **React Native · Flutter** | Precisa de build e de um Mac pro iOS. Overkill | [0001 — PWA](0001-plataforma-pwa.md) |
| **App em loja** (Play · App Store) | US$ 25 + US$ 99/ano. O PWA resolve de graça | [0001 — PWA](0001-plataforma-pwa.md) |
| **Servidor + banco de dados** | Custo recorrente. localStorage resolve — *"é ficha de uma pessoa"* ⚠️ **motivo caducou** | [0003 — localStorage](0003-estado-localstorage.md) |
| **Login / contas** | Sem servidor não há o que autenticar ⚠️ **contestado** | [0003 — localStorage](0003-estado-localstorage.md) |
| **Espelhar o formato do Shards** (em inglês) | Importar viraria `JSON.parse`, mas violava "código em português" e trazia as esquisitices do Shards pra tela | [0007 — formato próprio](0007-formato-proprio-mais-tradutor.md) |
| **Cabeçalho que rola pra fora** (como o DDB faz) | No Cosmere os vitais mudam o tempo todo — é o motivo do app existir | [0008 — cabeçalho fixo](0008-cabecalho-fixo.md) |
| **Barra de navegação inferior** (como o DDB) | É a casca de um app com vários personagens e compêndio. Nós somos **uma ficha** — seria espaço morto | [interface.md](../interface.md) |
| **Live Server** (abrir o arquivo direto) | Consequência do Vite: quem serve o projeto é o `npm run dev` | [0002 — React/TS/Vite](0002-stack-react-ts-vite.md) |

## Decisões superadas

*Valeram um dia. Não valem mais — mas o arquivo fica, pra saber por que mudou.*

| Decisão | Morreu em | Superada por |
|---|---|---|
| [0006 — Stack: HTML/CSS/JS puro](0006-stack-js-puro.md) | 16/Jul/2026 | [0002 — React + TypeScript + Vite](0002-stack-react-ts-vite.md) — o motivo original não estava errado, estava **incompleto**: ignorava que o app lê JSON de terceiro |
| [0010 — regra provisória do Dado de Trama](0010-regra-provisoria-do-dado-de-trama.md) | 17/Jul/2026 | [0015 — regra confirmada no livro](0015-regra-do-dado-confirmada-no-livro.md) — a regra do César estava errada em 2 de 3 pontos; o livro desempatou. **Exemplo do processo funcionando:** provisório existiu pra ser derrubado, e foi |
| [0014 — código no C:, docs no Drive](0014-codigo-no-c-docs-no-drive.md) | 31/Jul/2026 | [0016 — código e docs juntos](0016-unificacao-codigo-e-docs.md) — o **diagnóstico continua certo** (`node_modules` não convive com o Drive); o que caiu foi a premissa: todos os projetos saíram do Drive, então não há mais metade para separar |

## ⚠️ Duas lápides sob revisão

A **Fase 5** ([roadmap.md](../roadmap.md)) — mesa inteira, painel do mestre, salvamento online, tempo real — **pede de volta** o servidor e o login. Nada foi decidido.

**Se for aprovada, não basta exumar a ideia.** O motivo do enterro foi *"localStorage resolve — **é ficha de uma pessoa**"*, e essa frase **deixou de ser verdade** quando a mesa entrou no escopo. **O raciocínio morreu junto com a decisão.**

O certo: escrever uma decisão nova que supersede a [0003](0003-estado-localstorage.md), explicando **o que mudou no mundo** — não reescrever a antiga. Ver a regra append-only em [decisoes.md](decisoes.md).
