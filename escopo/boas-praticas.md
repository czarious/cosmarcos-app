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
| 6 | Alvo de toque ≥ 44px, com espaço entre eles | `--alvo-toque` + área invisível nos botões pequenos; o teste do iPhone mede. Exceção do topo: [premissas](premissas.md) → "Letra maior e alvo de toque" |
| 7 | Letra de livro, não fonte "de fantasia"; poucas palavras por tela | Georgia, versalete nos títulos |
| 8 | Peças com variantes e temas por nome, sem sobrescrever por componente | `Janela.tsx` (características) |

## O que faltava (pedido 16, 10/Out/2026)

| # | Prática | Estado |
|---|---|---|
| 9 | Medir o espaço usado e avisar perto do limite (a foto pesa) | Feito: Configurações → "Este aparelho"; a ⚙ acende a partir de 80% (`espaco.ts`). Com a ficha no IndexedDB, o teto é a cota do site que o navegador informa |
| 10 | Avisar que limpar os dados do navegador ou desinstalar apaga a ficha | Feito como o botão do backup que muda de cor quando a ficha mudou desde o último (ideia do César, `BotaoBackup.tsx`) |
| 11 | Tamanho da letra ajustável (guias: 16px de mínimo, opção até 150–200%) | Feito até 130% — por que não mais: [premissas](premissas.md) → "Letra maior e alvo de toque" |
| 12 | Controles dentro da área segura (notch, barra do iPhone) | Conferido no código: só o fim da página ia pra baixo da barrinha do iPhone → recuo `safe-area-inset-bottom`. No alto, a barra de status `default` já deixa a página abaixo dela; deitado, a ficha (até 480px) fica no meio, longe do recorte. Falta ver num iPhone |

## Visto e não adotado

| Prática | Por quê |
|---|---|
| Tema escuro | Recusado pelo César — [premissas](premissas.md) → "Descartado" (fica o alternador claro/escuro, se ofuscar na prática) |
| Ficha na nuvem (Supabase) | Melhoria futura — [roadmap](roadmap.md) → "Backlog de ideias" |
| Guia passo a passo de subir de nível (o forte do Pathbuilder) | Melhoria futura — [roadmap](roadmap.md) → "Backlog de ideias". Agora o foco é absorver o JSON do Shards |
