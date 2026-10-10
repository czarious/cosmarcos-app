# CLAUDE.md

> **Briefing de sessão** — lido sozinho ao abrir. Aqui só o que vale em **toda** sessão; o resto mora no doc dono. Como manter assim: [.claude/organizacao.md](.claude/organizacao.md) → "A regra do CLAUDE.md".

- **Ao abrir a conversa:** [escopo/melhorias.md](escopo/melhorias.md) → "Próxima conversa" (os pedidos do César e o estado de cada um).
- **Pra se localizar no projeto** — qual doc responde o quê, e quando abrir cada um: [mapa-app.md](mapa-app.md) → "Como se localizar no projeto".

## O projeto

**cosmarcos-app** — ficha do **Cosmere RPG** pro celular, usada na mesa (vida, foco, investidura, condições ao vivo): um "D&D Beyond do Cosmere", só a parte de jogar. React + TypeScript + Vite, PWA, ficha no IndexedDB, GitHub Pages. **Custo zero é requisito.** O Shards é a **semente** (importar sobrescreve tudo); **nenhum personagem fica escrito no código**. O repo é público: guarda os dados do César e o código, **nunca o texto do livro** (catálogos são resumo com palavras próprias).

Repositório `C:\dev\GitHub\cosmarcos-app` · campanha em `G:\Meu Drive\Claude\campanha-cosmere-marcos`.

## O César — a divisão

Engenheiro civil, não é desenvolvedor. **Diz o que o app tem que ser e confere só a tela — não olha pastas nem código** (12/Set/2026). Todo o resto é meu: organização, achar a regra no livro, entender o pedido sem dúvida. Inclua dicas de aprendizado (ele aprende por osmose).

## Como trabalhar

- **Dúvida que muda o trabalho: pergunto antes.** Diferença pequena: decido e digo a suposição. Sugestão dele eu avalio; pedido eu executo.
- **Regra do sistema: livro > decisão do César > fonte online > nada.** O livro está em `referencia/livro/transcricao/` (índice `00-sumario.md`) — abrir **antes** de implementar, e o conteúdo do livro entra junto, pra qualquer personagem. Não sei? Pergunto ou registro em [roadmap](escopo/roadmap.md) → "Perguntas em aberto". Nunca invento.
- **Relato em comportamento** (o que mudou na tela), **sempre com o que NÃO consegui verificar**, fechando com o **roteiro de conferência** (o que tocar, o que ver).
- **Antes de dizer que terminei:** `node .claude/verificar.mjs` · `npx tsc --noEmit` · `npm test` · `npm run build` — e: algo merece refatorar, fundir ou apagar?
- **Erro analisado até virar mudança** (conferência nova, regra no ponto de uso, estrutura corrigida) — "vou prestar atenção" não fecha.
- **Peça única:** o que se repete vira uma peça com características (ex.: `Janela`, `BotaoInfo`, `ListaLinhas`, `regraDoLivro.ts`), pra uma mudança grande afetar todo lugar que deve.
- Confirmação por **entrega**, não por arquivo · commit e push **só com autorização** (`/git-up` já é ela) · texto pra copiar em bloco de código · respostas diretas.

## Convenções

- `<!-- DESTINO: pasta/arquivo.md -->` no topo de doc · `/* arquivo: nome.tsx */` no topo de código · código em **português** · `PascalCase.tsx` (tela) · `camelCase.ts` (lógica).
- Criou, moveu ou apagou arquivo? **Atualiza o mapa na mesma entrega** (`mapa-app.md` ou `.claude/mapa-projeto.md`).
- Referência **por nome de seção**, nunca por número. Datas `DD/Mmm/AAAA`.
- Palavra de tela em `src/idioma/pt.ts` + `en.ts`; símbolo em `src/variaveis.ts`; cor, forma e tamanho de letra em `src/estilos/base.css`.
- **Uma versão só** (`package.json`), sobe uma vez por push — [mapa-app.md](mapa-app.md) → "Versionamento".
- Teste: `npm run dev` → `localhost:5173` → César confere na tela → autorização → commit + push → GitHub Pages.
