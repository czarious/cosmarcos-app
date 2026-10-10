<!-- DESTINO: escopo/boas-praticas.md -->
# Boas práticas de app de ficha — o que a pesquisa diz

> **Finalidade:** o que jogadores e guias dizem sobre ficha digital de RPG na mesa, cruzado com o app. Ler antes de propor funcionalidade, junto com [premissas](premissas.md) → "Descartado — não repropor".
>
> Pesquisa de 10/Out/2026 (fóruns do D&D Beyond, Roll20, Paizo; guias de UI de jogo, acessibilidade, PWA offline). Fontes: fóruns e blogs — **experiência de jogador, não estudo**.

## O que já fazemos e a pesquisa confirma

| # | O que a pesquisa diz | No app |
|---|---|---|
| 1 | A maior reclamação contra o D&D Beyond: sair do app e ir ao site pra mudar algo no meio do jogo | Tudo se edita no app |
| 2 | Usar e **editar** sem internet | PWA offline |
| 3 | O mais usado (Vida, defesas, ataques) sempre à vista | Cabeçalho fixo |
| 4 | A conta é da ficha, não do jogador — conta na mão trava a mesa | `src/regras/` |
| 5 | A maior reclamação contra o Roll20: ficha que se apagou sozinha | Cópias de segurança (`copias.ts`), aviso obrigatório, apagar com 2º toque |
| 6 | Alvo de toque ≥ 44px, com espaço entre eles | `--alvo-toque` |
| 7 | Letra de livro, não fonte "de fantasia"; poucas palavras por tela | Georgia, versalete nos títulos |
| 8 | Peças com variantes e temas por nome, sem sobrescrever por componente | `Janela.tsx` (características) |

## O que faltava

| # | Prática | Estado |
|---|---|---|
| 9 | Medir o espaço usado (`navigator.storage.estimate`) e avisar perto do limite (~5 MB do localStorage; a foto pesa) | Pedido 16 do CLAUDE.md |
| 10 | Avisar que limpar os dados do navegador ou desinstalar apaga a ficha | Pedido 16 — vira o ícone de "mudou desde o último backup" (ideia do César) |
| 11 | Tamanho da letra ajustável (guias: 16px de mínimo, opção até 150–200%) | Pedido 16 |
| 12 | Controles dentro da área segura (notch, barra do iPhone) | Pedido 16 — conferir antes |

## Visto e não adotado

| Prática | Por quê |
|---|---|
| Tema escuro | Recusado pelo César — [premissas](premissas.md) → "Descartado" (fica o alternador claro/escuro, se ofuscar na prática) |
| IndexedDB no lugar do localStorage | Mudança grande; só se o item 9 mostrar o espaço apertado |
| Ficha na nuvem (Supabase) | Melhoria futura — [roadmap](roadmap.md) → "Backlog de ideias" |
| Guia passo a passo de subir de nível (o forte do Pathbuilder) | Melhoria futura — [roadmap](roadmap.md) → "Backlog de ideias". Agora o foco é absorver o JSON do Shards |
