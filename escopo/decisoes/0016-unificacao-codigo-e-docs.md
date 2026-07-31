<!-- DESTINO: escopo/decisoes/0016-unificacao-codigo-e-docs.md -->
# 0016 — Código e documentação juntos, fora do Drive

**Status:** ✅ aceita · 31/Jul/2026
**Supersede:** [0014](0014-codigo-no-c-docs-no-drive.md)
← [Índice das decisões](decisoes.md)

## Contexto

A [decisão 0014](0014-codigo-no-c-docs-no-drive.md) resolveu um problema real — `node_modules` não convive com o Google Drive — mas com um remédio que tinha custo próprio: **o projeto passou a viver em dois lugares**, `C:\dev\cosmarcos-app` (código) e `G:\Meu Drive\GitHub\cosmarcos-app` (docs). As consequências apareceram:

- Um `ONDE-ESTA-O-APP.md` só para explicar onde estava a outra metade
- Dois mapas (`mapa-app.md` e `.claude/mapa-projeto.md`) com fronteira negociada entre eles
- **Dez links absolutos** `<g:/Meu Drive/GitHub/cosmarcos-app/...>` no `mapa-app.md`, que só resolviam com o Drive montado
- `eccho.json` e `stormlight-characters-2026-07-03.json` divergiram (md5 diferentes) — as duas cópias que o projeto diz caçar desde o primeiro dia

Em 31/Jul/2026 o César decidiu tirar **todos** os projetos do Drive, não só este. Isso removeu a premissa da 0014: não existe mais "a parte que fica no Drive".

A razão original de usar o Drive era backup na nuvem. Documentação oficial ([Google Drive Community](https://support.google.com/drive/thread/353731823/google-drive-sync-corrupting-git-repositories-via-desktop-ini-injection?hl=en), [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/5452768/git-repos-not-working-for-folders-on-onedrive)) mostra que o sync corrompe repositórios Git — e o GitHub cobre backup melhor: versionado, íntegro, remoto.

## Decisão

**O projeto inteiro — código, documentação e referências — mora em `C:\dev\GitHub\cosmarcos-app`. O backup é o GitHub.**

| O quê | Onde | Vai pro repo? |
|---|---|---|
| Código (`src/`, `public/`, configs) | raiz do projeto | ✅ sim |
| Documentação (`escopo/`, `CLAUDE.md`, mapas) | raiz do projeto | ✅ sim, exceto os 2 derivados do livro |
| `referencia/` (livro, prints DDB, transcrições) | raiz do projeto | ❌ **nunca** — `.gitignore` |
| `node_modules/` | raiz do projeto | ❌ regenerável |

O `ONDE-ESTA-O-APP.md` foi apagado — não há mais para onde apontar.

## O `.gitignore` e o conteúdo do livro

Esta decisão é o momento em que o repositório **nasce**, então o `.gitignore` precisa estar certo **antes** do primeiro `git add`. Ele bloqueia, em três camadas:

1. **`referencia/`** inteira — o PDF de 125 MB do Guia de Regras, os 18 prints do D&D Beyond, os 2 PDFs do Shards, as 135 transcrições e os extratos verbatim
2. **`escopo/notas-do-livro.md` e `escopo/conferencia-formulas.md`** — fórmulas e regras extraídas do livro que moram **fora** de `referencia/` e passavam batido
3. **Rede de segurança** — `**/transcricao/`, `**/_extrato*.txt`, `*.pdf`: valem mesmo se algum arquivo for movido de lugar

Continuam versionados, deliberadamente: `src/regras/*.ts` (paráfrase própria, já declarada segura para repo público pela [0004](0004-hospedagem-github-pages.md); sem eles o app não roda) e `public/personagens/eccho.json` (dado do próprio César).

## Alternativas rejeitadas

| Alternativa | Por quê não |
|---|---|
| **Manter a 0014** (código no C:, docs no Drive) | A premissa morreu: os docs também saíram do Drive. Manter a divisão seria custo sem benefício |
| **Tudo no Drive de novo** | É o problema que a 0014 resolveu, e que a documentação oficial confirma: sync corrompe Git e trava com `node_modules` |
| **Deixar `referencia/` no Drive** | Reintroduziria a divisão em dois lugares. O `.gitignore` já resolve o que importa: `referencia/` fica no disco e não sobe |

## Consequências

- ✅ Um projeto, uma pasta. Os links viraram relativos e resolvem offline no VS Code
- ✅ O `git init` finalmente aconteceu — a 0014 avisava *"até o repo do GitHub nascer, o backup do código é só o disco local. Mitigação: criar o repo cedo."* Levou duas semanas
- ✅ O Drive volta a fazer só o que faz bem: documentos que não são código
- ⚠️ **`referencia/` (145 MB) só existe no disco local** — não sobe pro GitHub por decisão, e não está mais no Drive. Se o disco morrer, o PDF do livro se perde. É material comprado, re-baixável, mas as **135 transcrições não são**. Vale um backup manual à parte
- ⚠️ Um `git add -A` com `.gitignore` errado publica 125 MB de material protegido de uma vez. Por isso o `git status` foi conferido antes do primeiro commit
- 📌 `mapa-app.md` × `.claude/mapa-projeto.md` continuam dois. Foram separados pela 0014 justamente porque o projeto estava partido — vale reavaliar se ainda faz sentido
- 📌 `public/personagens/eccho.json` e `referencia/shards/stormlight-characters-2026-07-03.json` seguem divergentes. Definir qual é a fonte
