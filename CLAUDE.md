# CLAUDE.md

> **Finalidade:** briefing de sessão para o Claude Code — contexto do projeto, decisões de arquitetura e regras de trabalho.
> Contém o **porquê**. Lido automaticamente ao iniciar cada sessão.

## Mapa dos documentos

**Cada assunto tem um dono. Se está aqui, não está lá — não duplicar.**

| Doc | Responde | Contém |
|---|---|---|
| **CLAUDE.md** (este) | **Porquê / como** | Contexto, custo zero, regras Cosmere × D&D, convenções de trabalho, processo, campanha |
| **[escopo/](escopo/README.md)** | **O quê** | Sumário. Dentro: [visão](escopo/visao.md) · [roadmap](escopo/roadmap.md) · [interface](escopo/interface.md) · [dados](escopo/dados.md) · [decisões](escopo/decisoes/decisoes.md) |
| **[.claude/mapa-projeto.md](.claude/mapa-projeto.md)** | **Onde** | **Mapa de todo arquivo** do projeto + **mapa de dependências** (mexeu em X → revise Y) |

> **Antes de propor qualquer funcionalidade:**
> 1. **[escopo/decisoes/cemiterio.md](escopo/decisoes/cemiterio.md)** — pra não ressuscitar ideia já descartada
> 2. **[escopo/roadmap.md](escopo/roadmap.md)** → "Perguntas em aberto" — pra não chutar regra do sistema
>
> **As decisões de arquitetura são [append-only](escopo/decisoes/decisoes.md).** Mudou de ideia? **Nunca editar** a decisão antiga — escrever uma nova que a supersede, com link. O valor do registro não é saber o que foi decidido; é saber **por que mudou**.

### Quando chamar o mapa-projeto.md

**Só o CLAUDE.md entra em contexto sozinho a cada sessão.** O [mapa-projeto.md](.claude/mapa-projeto.md) só é lido se um destes gatilhos disparar — por isso eles são específicos:

| Momento | O que fazer | Exemplo |
|---|---|---|
| **Antes** de alterar arquivo do qual outros dependem | **Ler §3** | Vou mexer no `tipos/personagem.ts` → o §3.2 avisa que `regras/`, `estado/`, `componentes/` e os JSONs vêm junto |
| **Antes** de criar arquivo | **Ler §1 e §2** | Já existe? Estava planejado com outro nome/lugar? |
| **Antes** de propor stack/dependência nova | **Ler §0** | Não duplicar o que já está instalado |
| **Depois** de criar · renomear · mover · apagar | **Escrever** §1, §2, §3 — **na mesma entrega** | Nunca "depois eu atualizo" |
| Só ler código, responder pergunta, editar texto de um MD | **Não precisa** | O mapa é sobre estrutura, não sobre conteúdo |

## O Projeto

**cosmarcos-app** — ficha de personagem interativa do **Cosmere RPG**, para usar no celular durante as sessões da campanha do Marcos.

É um **"D&D Beyond do Cosmere"**, mas só a parte de *jogar*: vida, foco, investidura, dados, buffs e condições — atualizados ao vivo na mesa. Escopo detalhado: **[escopo/](escopo/README.md)**.

Repositório: `C:\dev\GitHub\cosmarcos-app`
Projeto irmão (conteúdo da campanha): `G:\Meu Drive\Claude\campanha-cosmere-marcos`

**Uso pessoal / da mesa.** O texto de regras é da Brotherwise Games — o app guarda os **dados do personagem do César**, não redistribui o livro. Não publicar em loja nem repositório público com conteúdo do livro.

**Stack:** React + TypeScript + Vite, empacotado como PWA.

> Os outros projetos do César (`ficha-imovel`, `reforma-rp-tibirica-682`) são referência **organizacional** — documentação, versionamento e jeito de trabalhar. **Não** são referência de stack: aqui usamos React/TS, não JS puro.

## Sobre o César

Engenheiro Civil, Ribeirão Preto/SP. Perfil híbrido: engenharia + processos + dados.
Não é desenvolvedor de formação — aprendeu desenvolvendo o `ficha-imovel`.
**Inclua dicas de aprendizado ao longo do trabalho** (aprende por osmose).

Nível técnico:
- HTML/CSS/JS: leitura e edição guiada — intermediário
- Git: usa GitHub Desktop, entende commit/push
- API: já integrou Google Drive API e OAuth 2.0 no `ficha-imovel`

## Como Trabalhar

- **Apresente o raciocínio antes de executar e aguarde confirmação**
- Um arquivo por vez — aguarde confirmação antes do próximo
- Textos para copiar sempre em bloco de código (` ``` `)
- Verifique referências cruzadas antes de entregar qualquer arquivo
- Indique o destino no topo de cada arquivo: `<!-- DESTINO: pasta/arquivo.html -->`
- Respostas diretas e sem enrolação
- Commit e push **nunca** são automáticos — só após autorização explícita
- **Não inventar regra do sistema.** Não sabe se o Dado de Trama dá Complicação no 1? Pergunta, ou registra em **[roadmap.md](escopo/roadmap.md) → "Perguntas em aberto"**. Regra chutada só aparece na mesa, no meio do combate
- **O livro desempata — e o livro chega aos poucos.** O César vai transcrevendo o Guia de Regras em PT-BR pro `campanha-cosmere-marcos`. **Toda transcrição nova é gatilho de revisão:** conferir as [perguntas em aberto](escopo/roadmap.md) contra o texto e derrubar o que for provisório. A hierarquia é sempre: **livro > decisão do César > fonte online > nada**. Decisão marcada **PROVISÓRIA** (como a [0010](escopo/decisoes/0010-regra-provisoria-do-dado-de-trama.md)) existe pra ser derrubada pelo livro, não pra virar permanente por esquecimento

## Decisões de Arquitetura

| Decisão | Escolha | Porquê |
|---|---|---|
| Plataforma | **PWA** (site instalável) | Um código → Android + iPhone. Sem loja, sem Mac |
| Stack | **React + TypeScript + Vite** | Schema tipado é a espinha de um app orientado a dados — o TS garante que a ficha lida bate com o que a tela espera |
| Estado | **localStorage** | Offline, sem servidor, sem banco, sem login |
| Hospedagem | **GitHub Pages** (repo público) | Grátis. Ver "Custo Zero" abaixo |
| Fonte de verdade | **Shards** (site oficial) | O app **não** substitui o builder — ver abaixo |

> **Cada uma destas tem uma decisão escrita**, com contexto, alternativas rejeitadas e consequências: **[escopo/decisoes/](escopo/decisoes/decisoes.md)**.
> O que já foi **descartado** (React Native, loja de apps, servidor, JS puro…) e **por quê**: **[cemiterio.md](escopo/decisoes/cemiterio.md)**. Consultar antes de repropor.

## Custo Zero — requisito do projeto

> **Regra: tudo com recursos gratuitos.** Nenhuma decisão pode introduzir custo recorrente.

| Item | Ferramenta | Custo |
|---|---|---|
| Framework / linguagem | React · TypeScript · Vite | Grátis (open source) |
| Build / runtime | Node.js · npm | Grátis |
| PWA | `vite-plugin-pwa` | Grátis |
| Código e versionamento | GitHub | Grátis |
| Build automático | GitHub Actions | Grátis (ilimitado em repo público) |
| Hospedagem | GitHub Pages | Grátis (repo público) |
| Instalar no celular | PWA → "Adicionar à tela inicial" | Grátis — **sem loja de apps** |
| Banco de dados | localStorage (no próprio celular) | Grátis — sem servidor |
| Login / conta | Não tem | — |

**Custos que estamos evitando de propósito:**
- Google Play: US$ 25 (uma vez) · Apple Developer: US$ 99/ano → **evitados pelo PWA**
- Servidor + banco de dados → **evitados pelo localStorage**
- GitHub Pages em repo **privado** exige plano pago → **por isso o repo é público**

**Repo público × conteúdo do livro:** o repositório guarda **a ficha do César** (dados dele) e o código — não o texto de regras da Brotherwise. Se um dia embutirmos o compêndio com texto do livro, migrar a hospedagem para **Cloudflare Pages** ou **Netlify** (aceitam repo privado no plano grátis) antes de tornar o repo privado.

### Divisão de responsabilidade (a decisão mais importante)

```
Shards (shards.fairway3games.com)   →  MODO CONSTRUÇÃO
  subir nível, escolher talentos, atributos          → exporta JSON
                                                        ↓
cosmarcos-app                       →  MODO JOGO
  dano, cura, foco, investidura, dados, buffs, condições
```

O app **importa o JSON do Shards** — e o Shards é quem manda no formato.

**O app é orientado a dados: nenhum personagem fica escrito no código.** Ele lê um JSON e desenha o que vier — serve para o Eccho, para qualquer PC da mesa, para qualquer campanha.

> Decisão completa, com validação e ressalvas: **[0005 — Shards = construção · app = jogo](escopo/decisoes/0005-shards-fonte-de-verdade.md)**.
> ⚠️ **A linha é menos limpa do que parece.** O export real mostra que o Shards **também** guarda vida atual, foco atual, condições, lesões e log de rolagens — ele não é só construção. Verificado campo a campo em **[dados.md](escopo/dados.md) → "Ficha × estado vivo"**. Consequência prática: reimportar pode sobrescrever o combate em andamento.
> ⚠️ **O app NÃO usa o mesmo formato do Shards** — formato próprio + tradutor. Ver **[0007](escopo/decisoes/0007-formato-proprio-mais-tradutor.md)**.

Referências do formato:
- Shards (builder oficial): https://shards.fairway3games.com
- Backup JSON: `C:\Users\cesar\Downloads\stormlight-characters-2026-07-03.json`
- Ficha oficial em PDF (Brotherwise v1.02) — usada só para levantar **quais campos existem**

## Regras do Cosmere que mudam a interface

> ⚠️ Não copiar o D&D Beyond cru — o sistema é diferente. Estas são as diferenças que impactam a UI:

| D&D 5e (DDB) | Cosmere RPG |
|---|---|
| Atributo 20 → modificador +5 | **O atributo já é o modificador.** `VEL 3` e pronto — um número só |
| 1 CA (Armor Class) | **3 defesas**: Física · Cognitiva · Espiritual |
| Testes de resistência | Não existem — testes vão **contra as defesas** |
| Espaços de magia | **Foco** + **Investidura** (dois recursos separados) |
| Rola d20 | **d20 + Dado de Trama (d6) juntos** → Oportunidades e Complicações |
| Action / Bonus / Reaction | **2-3 ações por turno**: ▶ ▶▶ ▶▶▶ · ▷ livre · ↻ reação · ★ especial · ∞ sempre *(símbolos do livro, Introdução p.10)* |
| Condições | Condições **+ Lesões** (temporárias contam **dias**; permanentes só curam por meio sobrenatural) |
| Familiar | **Spren** (Mancha) — ações próprias que gastam Foco |
| Proficiência +N | **Graduações** de perícia (máx. 2 até o nível 5) |

**O Dado de Trama é o maior impacto:** a rolagem não retorna um número, retorna **dois resultados** — o teste e o efeito narrativo. Precisa de destaque próprio na tela.

> O que isso vira em tela (padrões de UI, seções do app): **[interface.md](escopo/interface.md)**.
> O que **ainda não sabemos** da regra do Dado de Trama: **[0010 — regra provisória](escopo/decisoes/0010-regra-provisoria-do-dado-de-trama.md)**.

## Modelo de dados

Schema completo (`type Personagem`), o tradutor do Shards e a separação **ficha × estado vivo**: **[dados.md](escopo/dados.md)**.

Quando `src/tipos/personagem.ts` existir, **ele** vira a fonte única dos tipos.

## Estrutura de Arquivos

Mapa de todo arquivo do projeto (o que existe · o que é planejado) e as dependências entre eles: **[.claude/mapa-projeto.md](.claude/mapa-projeto.md)**.

## Convenções Obrigatórias

- Indique o destino no topo de todo arquivo: `<!-- DESTINO: pasta/arquivo.md -->`
- **Criou, renomeou, moveu ou apagou arquivo? Atualiza o [mapa-projeto.md](.claude/mapa-projeto.md) na mesma entrega**
- **Referência por nome, nunca por número de seção.** Escreva `ver [dados.md](escopo/dados.md) → "O que o Shards não dá"`, jamais "ver §6.3". Numeração quebra quando alguém insere uma seção no meio — já quebrou duas vezes aqui
- Datas no formato `DD/Mmm/AAAA`
- Código em **português** (nomes de tipos, funções e componentes) — igual aos outros projetos do César
- Componentes em `PascalCase.tsx` · lógica em `camelCase.ts`

### Versionamento — simplificado (ativo desde 17/Jul/2026)

> **Uma versão só: a do `app/package.json`.** Sem versão por arquivo, sem changelog, sem histórico em doc.
>
> - **Minor (Y)** ao completar item do roadmap · **Patch (Z)** em bug · **Major (X)** em mudança radical
> - Cabeçalho de arquivo é só identificação: `/* arquivo: nome.tsx */`
> - **Docs (.md) não têm versão** — o "porquê" deles mora nas [decisões](escopo/decisoes/decisoes.md), datadas e append-only
>
> **Por quê simplificado:** versão por arquivo exige atualização a cada edição — e a experiência aqui mostrou que número sem gatilho de manutenção **mente** (os docs subiram 0.1.0 → 0.7.0 em um dia sem uma linha de código; a coluna de versão do mapa mentiu na primeira semana). Regra completa: [app/mapa-app.md](app/mapa-app.md).

## Fluxo de Teste e Deploy

1. `npm run dev` na raiz do projeto (**`C:\dev\GitHub\cosmarcos-app`**) — código e documentação vivem juntos aqui ([decisão 0016](escopo/decisoes/0016-unificacao-codigo-e-docs.md)) → abre em `localhost:5173` com recarga automática ao salvar
2. César confirma visualmente no navegador
3. Teste real: abrir no **celular** (mesma rede via IP local, ou já publicado) e usar na sessão
4. Após confirmação → commit + push → **GitHub Actions** faz o build → **GitHub Pages** publica

> Diferente do `ficha-imovel`: aqui **não** se abre o arquivo direto no Live Server — o Vite serve o projeto (`npm run dev`) e o build gera a pasta publicada.

## Roadmap

Fases 1–5, com funcionalidades e critério de pronto: **[roadmap.md](escopo/roadmap.md)**.

**Estado em 16/Jul/2026:** nada implementado. Só documentação — o app ainda não foi criado. Próximos passos combinados: scaffold do Vite → `tipos/personagem.ts` → `regras/dados.ts` → interface, componente por componente.
**A criação do app só começa quando o César autorizar explicitamente.**

## Campanha — contexto

Mesa do **Marcos** (DM), grupo de WhatsApp "RPG Gourmet - GIPAX9". Sessões ~quinzenais.

| Jogador | Personagem | Ordem Radiante |
|---|---|---|
| **César** | **Eccho** | Alternauta (inkspren Mancha) |
| Danilo | Rakshi Astranar | Dançarino de Precipícios (Serene) |
| Tiago | T'Tchago | Sentinela da Verdade (Valura) |
| Vinicius | Calvon Royfus | Guardião das Pedras? (em formação) |

Notas, timeline e transcrições do livro: `campanha-cosmere-marcos`.
