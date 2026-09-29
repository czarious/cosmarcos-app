<!-- DESTINO: .claude/mapa-shards.md -->
# MAPA DO SHARDS — https://shards.fairway3games.com

> **Finalidade:** onde cada coisa mora **no site do Shards** — tela, catálogo, banco do navegador, export — e como mexer nele sem se queimar.
> **Abrir quando:** antes de editar a ficha do Eccho pelo navegador, antes de mexer no tradutor (`src/estado/importarShards.ts` · `src/estado/deparaShards.ts`), ou quando o Shards atualizar.
> **Não mora aqui:** o formato do JSON e as armadilhas dele → [dados.md](../escopo/dados.md) → "Armadilhas do JSON do Shards". Os termos EN → PT-BR → `referencia/livro/dicionario-en-ptbr.md` (não versionado).

**Versão vista:** 3.5.0 (varredura de 27/Set/2026). Site em inglês/espanhol, sem português. Faz Stormlight **e** Mistborn.

## Telas

| Onde | O que tem | Serve pro app? |
|---|---|---|
| **Sheet** (`#sheet`) | Ficha inteira editável: identidade, atributos, recursos, perícias, objetivos, especialidades, lesões, condições, trilhas heroica e radiante, fluxos, defesas, fabriais, equipamento, notas | É onde se edita a semente |
| **Play** (`#play`) | Modo mesa: recursos ±, condições, lesões, testes rápidos, ataques, fluxos, talentos, rolagens recentes | Referência de UI — ver [roadmap](../escopo/roadmap.md) pergunta 10 |
| **Paths** (`#paths`) | Árvores de talento; mostra saldo de pontos ("-1" = gastou um a mais) | O "-1" do Eccho é decisão do César — ver [personagens.md](../escopo/personagens.md) |
| **Roll Log** · **DM Roster** · **Reference** | Histórico de rolagem · painel do mestre com vários personagens · lembretes | Não |
| Barra de cima | **Characters** (trocar/criar) · **Files** (PDF, **Export current JSON**, Export all, Import) · Settings (idioma, **Units**, tema) | Export = a semente do app |

## Listas suspensas (de onde vêm as opções)

| Lista | Opções | Fonte no site |
|---|---|---|
| Ancestry · Background · Culture 1/2 | Autocompletar — filtra pelo texto digitado | `/data/ancestries.json` · `/data/cultures.json` · `js/services/startingKitService.js` |
| Expertise type | Armor · Cultural · Utility · Weapon · Specialist | tela (`sheetPanels`) → `TIPO_ESPECIALIDADE` no de-para |
| Ideal milestones | 0/3 … 3/3 por Ideal | tela |
| Add item, weapon, or armor | Catálogo inteiro: armas, armaduras, 68 equipamentos | `/data/items.json` |
| Fabrial → Add Standard | 13 fabriais padrão | `/data/items.json` → `fabrials.fabrials` |
| Fabrial → Quality | Shoddy · Typical · Quality · Exceptional · Custom | `js/ui/pages/fabrialsCard.js` |
| Fabrial → Upgrades / Drawbacks | 8 + 8 (Amplified… / Diminished…) | idem; texto das regras em `/data/items.json` → `crafting` |
| Heroic/Radiant → Manage · Surge → + Talent | Trilhas, talentos, talentos de fluxo | `/data/heroic-paths.json` · `/data/radiant-paths.json` · `/data/surge-talents.json` |

**Catálogos em JSON, públicos** (baixar com `fetch`/`curl`, sem login): `ancestries` · `cultures` · `heroic-paths` · `radiant-paths` · `surges` · `surge-talents` · `items` · `rules-index` (texto de regra em inglês, 290 KB) — todos em `https://shards.fairway3games.com/data/<nome>.json`. **A chave de todo de-para é o texto exato daqui**, não o do livro em inglês.

## Onde a ficha mora no navegador

- **IndexedDB `cosmere_rpg_v3` → `characters`** — a ficha viva (um objeto por personagem, o mesmo formato do export).
- `stormlight_rpg_app` — banco da versão antiga (parou em Jul/2026). Ignorar.
- `localStorage`: `stormlight.unitSystem` (`metric`/`imperial`) · layout · tema.
- **Backup antes de mexer:** copiar o registro pro `localStorage` com nome datado (ex.: `backup-eccho-antes-2026-09-27`).

## Como editar a ficha pelo navegador

1. **Pela tela** funciona para texto, atributos, marcos e **adicionar** item do catálogo (digitar no campo, clicar a opção, clicar **+ Add**).
2. ⚠️ **Defeito do Shards 3.5.0:** mudar **quantidade** ou **equipar** um item dá `ReferenceError: updateEquippedGearSection is not defined` e **não salva** — a tela mostra o valor, mas o F5 perde. Contorno: gravar direto no IndexedDB (ler o registro, alterar, `put`) e **recarregar a página logo em seguida**, antes que a tela salve por cima.
3. Conferir sempre relendo o IndexedDB depois do F5 — a tela mente enquanto não salva.
4. Exportar: **Files → Export current JSON** → baixa `eccho.json` em `Downloads` → no app, **Importar JSON** (o mesmo botão aceita o backup do app; ou copiar pra `public/personagens/eccho.json`, a semente do primeiro carregamento).
5. Voltar do app: **Exportar pro Shards** no rodapé do app → no Shards, **Files → Import JSON**. O Shards substitui a ficha de mesmo `id` (`bulkPut`, conferido no código dele).

## O que o tradutor precisa saber (resumo — detalhe no código)

| Tema | Onde está resolvido |
|---|---|
| Modo métrico inconsistente | Topo de `importarShards.ts` → "unidades" · [dados.md](../escopo/dados.md) → "Unidades" |
| Nomes em inglês | `deparaShards.ts`, um mapa por categoria |
| Envelope `format: "cosmere-v3"` e ficha de Mistborn | [dados.md](../escopo/dados.md) → "Armadilhas do JSON do Shards" |
| Texto-modelo dos Ideais não jurados ("Declare to your…") | `traduzIdeais` descarta |

## Quando o Shards atualizar

1. Ver a versão (`/js/v3/main.js?v=…` no código da página).
2. Baixar de novo os `/data/*.json` e comparar as chaves com `deparaShards.ts`.
3. Exportar o Eccho e passar pelo tradutor — **ele grita** no que não reconhece.
4. Atualizar a versão vista no topo deste mapa.
