# CLAUDE.md

> **Finalidade:** briefing de sessão — lido automaticamente ao iniciar cada uma.
>
> ## 📏 A regra deste arquivo
>
> Pra cada assunto, uma pergunta só:
>
> > **Ao abrir o projeto eu preciso saber disso imediatamente, ou posso ler só quando precisar?**
>
> **Imediatamente → seção aqui.** · **Só quando precisar → arquivo próprio, e aqui fica a referência.**
>
> Vale nos dois sentidos: enxugar demais também custa. Ponteiro que me obriga a abrir 5 arquivos pra saber uma coisa é pior do que o texto inteiro aqui. Como aplicar e quando revisar: [.claude/organizacao.md](.claude/organizacao.md).

## Mapa dos documentos

**Cada assunto tem um dono. Se está aqui, não está lá — não duplicar.**

| Doc | Responde | Abrir quando |
|---|---|---|
| **CLAUDE.md** (este) | Quem · como trabalhar | Sempre — já está em contexto |
| **[escopo/premissas.md](escopo/premissas.md)** | **Por quê** — toda decisão de arquitetura, o que custa, e o que foi descartado | Antes de propor funcionalidade, stack ou dependência |
| **[escopo/roadmap.md](escopo/roadmap.md)** | O que falta · perguntas em aberto | Antes de propor funcionalidade ou chutar regra |
| **[escopo/](escopo/README.md)** | O quê | [visão](escopo/visao.md) · [dados](escopo/dados.md) · [interface](escopo/interface.md) · [Cosmere × D&D](escopo/cosmere-e-a-interface.md) · [personagens](escopo/personagens.md) |
| **[mapa-app.md](mapa-app.md)** | Onde, **no código** | Antes de mexer em `src/`; **escrever nele** ao criar/mover/apagar arquivo |
| **[.claude/mapa-projeto.md](.claude/mapa-projeto.md)** | Onde, **na raiz** | Antes de criar arquivo fora de `src/`; idem pra escrever |
| **[.claude/mapa-shards.md](.claude/mapa-shards.md)** | Onde, **no site do Shards** | Antes de editar a ficha no navegador ou mexer no tradutor |
| **[.claude/organizacao.md](.claude/organizacao.md)** | Como a estrutura se mantém | Ao sentir atrito: regra esquecida, busca longa, doc duplicado |

> **Antes de propor qualquer funcionalidade:** ler [premissas](escopo/premissas.md) → "Descartado — não repropor" e [roadmap](escopo/roadmap.md) → "Perguntas em aberto".
>
> **Decisão de arquitetura mora numa página só — [premissas](escopo/premissas.md), sempre vigente.** Mudou de ideia? **Sobrescreve a linha.** Sem registro novo, sem "superada", sem histórico.

## O Projeto

**cosmarcos-app** — ficha interativa do **Cosmere RPG** pro celular, usada durante a sessão: vida, foco, investidura, buffs e condições ao vivo na mesa. Um "D&D Beyond do Cosmere", **só a parte de jogar**.

**Stack:** React + TypeScript + Vite, empacotado como PWA. Estado em localStorage. Publicado no GitHub Pages. **Custo zero é requisito** — ver [premissas](escopo/premissas.md).

O Shards é a **semente**: importa o JSON uma vez, e a partir daí **o app é dono da ficha**. Importar de novo **sobrescreve tudo, sem fusão**. O app é orientado a dados — **nenhum personagem fica escrito no código**.

**Uso pessoal / da mesa.** O texto de regras é da Brotherwise — o repo guarda **os dados do César** e o código, nunca o livro.

Repositório: `C:\dev\GitHub\cosmarcos-app` · Projeto irmão (campanha): `G:\Meu Drive\Claude\campanha-cosmere-marcos`

## Sobre o César

Engenheiro Civil, Ribeirão Preto/SP — engenharia + processos + dados. **Não é desenvolvedor de formação**; aprendeu no `ficha-imovel` (JS puro). Lê e edita HTML/CSS/JS com orientação, usa GitHub Desktop, já integrou Google Drive API + OAuth.

**Inclua dicas de aprendizado ao longo do trabalho** — ele aprende por osmose.

> `ficha-imovel` e `reforma-rp-tibirica-682` são referência **organizacional**, nunca de stack.

## Como Trabalhar

### A divisão (definida em 12/Set/2026)

> **O César diz o que o app tem que ser.** Ele instrui, pede mudança, pede verificação. **Ele não olha pastas nem código.**
>
> **Todo o resto é meu:** organização, onde cada coisa mora, achar a regra do sistema na transcrição, e entender o pedido **sem dúvida** antes de executar.

**Ele só consegue conferir uma coisa: o app na tela.** Tudo que não aparece na tela — arquivo no lugar errado, referência quebrada, regra inventada, conta errada que ninguém exercitou — **não tem quem pegue além de mim**. Por isso:

| Dever | O que significa na prática |
|---|---|
| **Dizer o que eu NÃO consegui verificar** | Nunca deixar passar em silêncio. "O build passou, mas não consegui testar o F5 no navegador" é obrigatório. Silêncio aqui vira bug na mesa |
| **Analisar todo erro até ele virar mudança** | Não prometo zero erro — prometo que o erro é **analisado até mudar alguma coisa**: conferência nova no `verificar.mjs`, regra movida pro ponto de uso, ou estrutura corrigida. **"Vou prestar mais atenção" não fecha a análise.** Ver [.claude/organizacao.md](.claude/organizacao.md) → "As perguntas que eu me faço" |
| **Procurar a regra na transcrição ANTES de implementar** | Mexeu com regra do sistema? Abrir `referencia/livro/transcricao/` (índice em `00-sumario.md`) e achar o texto. Só então codar |
| **Desfazer a dúvida antes, não depois** | Entendimentos diferentes levariam a trabalhos diferentes? Pergunto **antes**. Se a diferença é pequena, decido e digo qual suposição usei |
| **Relatar em comportamento, não em arquivo** | Ele não abre código: o relato diz **o que mudou na tela**, não quais arquivos toquei |
| **Terminar com o roteiro de conferência** | Ele valida **na tela** — botão, aba, informação nova. Toda entrega fecha com a lista curta: **o que tocar e o que ele deve ver**. Sem isso ele não tem como validar |
| **Rodar as quatro conferências antes de dizer que terminei** | `node .claude/verificar.mjs` · `npx tsc --noEmit` · `npm test` · `npm run build` |

- **Apresente o raciocínio antes de executar e aguarde confirmação**
- **Confirmação por ENTREGA, não por arquivo.** Aprovado o raciocínio, executo a mudança inteira e ele confere **na tela**. *(Era "um arquivo por vez" — regra de quando ele revisava cada arquivo; virou cerimônia quando ele parou de abrir código, 12/Set/2026.)*
- Textos para copiar sempre em bloco de código (` ``` `)
- Verifique referências cruzadas antes de entregar qualquer arquivo
- Respostas diretas e sem enrolação
- Commit e push **nunca** são automáticos — só após autorização explícita
- **A organização, a limpeza e a verificação do projeto são minha responsabilidade**, não dele. **A cada entrega, antes de dizer que terminei:** algo merece refatorar, reestruturar, fundir ou apagar? Sem esperar ele pedir — [.claude/organizacao.md](.claude/organizacao.md)
- **Não inventar regra do sistema.** Não sabe? Pergunta, ou registra em [roadmap](escopo/roadmap.md) → "Perguntas em aberto". Regra chutada só aparece na mesa, no meio do combate
- **O livro desempata, e chega aos poucos.** Hierarquia: **livro > decisão do César > fonte online > nada**. Toda transcrição nova é **gatilho de revisão** — conferir as perguntas em aberto contra o texto e derrubar o que for provisório. Regra **PROVISÓRIA** existe pra ser derrubada, não pra virar permanente por esquecimento

## Convenções Obrigatórias

- `<!-- DESTINO: pasta/arquivo.md -->` no topo de todo doc · `/* arquivo: nome.tsx */` no topo de todo código
- **Criou, renomeou, moveu ou apagou? Atualiza o mapa na mesma entrega** — `mapa-app.md` se foi em `src/`, `.claude/mapa-projeto.md` se foi na raiz
- **Referência por nome, nunca por número de seção.** `ver [dados.md](escopo/dados.md) → "O que o Shards não dá"`, jamais "ver §6.3" — numeração quebra quando alguém insere seção no meio (já quebrou duas vezes)
- Datas no formato `DD/Mmm/AAAA`
- Código em **português** — tipos, funções, componentes
- Componentes em `PascalCase.tsx` · lógica em `camelCase.ts`
- **Uma versão só**, a do `package.json` — sobe **uma vez por push**, no commit que vai subir. Regra: [mapa-app.md](mapa-app.md) → "Versionamento"
- Palavra de tela mora em `src/idioma/pt.ts` e `en.ts` (as mesmas variáveis); símbolo e ícone, em `src/variaveis.ts`; cor e forma, em `src/estilos/base.css`

## Fluxo de Teste e Deploy

`npm run dev` na raiz → `localhost:5173` com recarga automática → **César confirma na tela** → teste no celular (IP local) → autorização → commit + push → GitHub Actions builda → GitHub Pages publica.

> Não existe Live Server aqui: quem serve o projeto é o Vite.

## Estado atual — 30/Set/2026

Publicado (v0.8.0): **rastreador de turno** na aba Ações (▶/↻, "Usar" paga Foco/Investidura/carga e aplica o efeito) · guia dos fluxos · **engrenagem ⚙** no topo (importar, exportar, backup, idioma) · **idioma PT/EN** — 1ª etapa (botões, títulos, nomes do jogo; as descrições de regra seguem em português) · pertences em texto livre no Inventário · ajustes pro iPhone · checklist Shards × app em [escopo/checklist-shards.md](escopo/checklist-shards.md). **Arte PAUSADA** a pedido do César: não gerar arte nova sem ele pedir. **Próximo, pedido por ele:** mapeamento do Shards mais fundo → compatibilidade do JSON (armadura não é lida) → funcionalidades que faltam; e a 2ª etapa do idioma. **Pergunta aberta:** a Vontade do Eccho está 2 no Shards e 3 no app. Tudo 🔶 espera a conferência dele na tela e no celular.

Detalhe e critério de pronto: [roadmap.md](escopo/roadmap.md).
