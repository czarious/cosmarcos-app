<!-- DESTINO: escopo/decisoes/0014-codigo-no-c-docs-no-drive.md -->
# 0014 — Código no C:, documentação no Drive

**Status:** ⛔ **SUPERADA** em 31/Jul/2026 por [0016 — código e docs juntos](0016-unificacao-codigo-e-docs.md)
← [Índice das decisões](decisoes.md)

> ✅ **O diagnóstico desta decisão continua certo: `node_modules` não convive com o Google Drive.** O que mudou foi a premissa — em 31/Jul/2026 o César tirou **todos** os projetos do Drive, então não existe mais "a parte que fica no Drive" para separar. O remédio de dividir o projeto em dois lugares deixou de ser necessário. Fica aqui pela história: o texto abaixo é o registro de por que o Drive não serve para código. **A organização que vale é a [0016](0016-unificacao-codigo-e-docs.md).**

## Contexto

O projeto inteiro morava em `G:\Meu Drive\GitHub\cosmarcos-app` (Google Drive). Ao instalar as dependências do scaffold, três fatos se provaram **na prática, no mesmo dia**:

1. **Instalação rastejando** — `node_modules` são milhares de arquivinhos; o Drive trata cada um como evento de upload. 11 arquivos gravados em vários minutos, com o npm trabalhando a 100%.
2. **Pastas travadas** — o Drive tranca arquivos durante o sync; três tentativas de apagar `node_modules` parcial falharam ("Directory not empty").
3. **Junction impossível** — o plano B (atalho `app/node_modules → C:`) morreu com "Função incorreta": o sistema de arquivos do G: **não suporta reparse points**. E o Node resolve `node_modules` subindo a árvore — não há como escapar do G: estando dentro dele.

O César tinha acabado de pedir o app numa pasta `app/` dentro do projeto — esta decisão **contradiz esse pedido**, por isso foi perguntada explicitamente, com custos na mesa.

## Decisão

**O código mora em `C:\dev\cosmarcos-app\` (disco local). A documentação continua no Drive.**

| O quê | Onde | Backup |
|---|---|---|
| Código + `node_modules` | `C:\dev\cosmarcos-app\` | **GitHub** (o repo vai existir de qualquer jeito — o deploy do Pages exige) |
| Docs, escopo, decisões, referências | Drive, como sempre | O próprio Drive |
| Ponteiro | `ONDE-ESTA-O-APP.md` na raiz do Drive | — |

O `mapa-app.md` **foi junto com o código** — o mapa mora com o que mapeia.

## Alternativas rejeitadas

| Alternativa | Por quê não |
|---|---|
| **Tudo no Drive, aceitar a lentidão** | Installs de 10–40 min, Vite lento **todo dia**, e ~30 mil arquivos regeneráveis entupindo o sync do Drive pra sempre |
| **Junction `node_modules → C:`** | O G: não aceita reparse points. Testado, "Função incorreta" |
| **Pausar o sync a cada install** | Ritual manual que alguém esquece — e o problema volta |

## Sobre "migrar de volta quando estiver pronto" *(pergunta do César na hora da decisão)*

**Dá, mas provavelmente não vai valer a pena.** Quando o MVP existir, o código estará no **GitHub** — que é backup versionado, histórico e remoto: melhor que Drive pra código em tudo. Copiar a fonte de volta pro Drive criaria **duas cópias divergindo** — a doença que este projeto caça desde o primeiro dia.

O que dá pra fazer sem risco: **snapshot** (zip datado do código, sem `node_modules`) guardado no Drive quando o César quiser um conforto extra. Reavaliar quando o MVP estiver pronto — fica nas perguntas em aberto do [roadmap](../roadmap.md).

## Consequências

- ✅ Instalação e dev server em velocidade normal. O hot reload (a experiência "vejo enquanto você cria") fica viável.
- ✅ O Drive volta a fazer só o que faz bem: documentos.
- ⚠️ **O código não está no Drive** — até o repo do GitHub nascer, o backup do código é só o disco local. **Mitigação: criar o repo cedo.**
- ⚠️ Quem procurar o app no Drive acha o `ONDE-ESTA-O-APP.md` apontando.
- 📌 Restos de `node_modules` travados pelo Drive (`_lixo1`, `_lixo2` na pasta do Drive) — apagar quando o sync soltar.
