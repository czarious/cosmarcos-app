<!-- DESTINO: C:\dev\GitHub\cosmarcos-app\mapa-app.md -->
# MAPA DO APP — `C:\dev\GitHub\cosmarcos-app`

> **Tudo do código: arquivos, dependências internas e a regra de versão.**
> Código e documentação vivem juntos nesta pasta, fora do Drive ([decisão 0016](escopo/decisoes/0016-unificacao-codigo-e-docs.md)).
> O [.claude/mapa-projeto.md](.claude/mapa-projeto.md) cuida da raiz do projeto e só aponta pra cá — **mudança no código atualiza este mapa, não aquele.**

## Versionamento — simplificado (decidido em 17/Jul/2026)

> ⏸️ **PAUSADO na sessão de 17/Jul/2026 (pedido do César).** Não subir a versão enquanto a sessão do dia não encerrar — evita bumpar a cada item no meio do trabalho. Fica em `0.3.0`. **Ao encerrar o dia, subir de uma vez** conforme o que foi completado (itens 1.2 + 1.3 → viraria 0.4.0). Depois, retomar a regra normal abaixo.

**Uma versão só: a do `package.json`.** Nada de versão por arquivo.

| Regra | |
|---|---|
| **Onde mora** | `"version"` no `package.json` — fonte única |
| **Quando sobe** | **Minor (Y)** ao completar um item do [roadmap](escopo/roadmap.md) (1.0, 1.1…) · **Patch (Z)** em correção de bug · **Major (X)** em mudança radical |
| **Cabeçalho de arquivo** | Só identificação: `/* arquivo: nome.tsx */` — **sem número de versão** |
| **Por quê** | Versão por arquivo = manutenção a cada edição, e a experiência dos docs mostrou: número que ninguém é obrigado a atualizar **mente**. Ver a história no mapa-projeto |

## 1. O que existe

| Arquivo | O que faz |
|---|---|
| `mapa-app.md` | Este arquivo |
| `package.json` | Nome, **versão do app** (fonte única) e dependências |
| `tsconfig.json` | TypeScript `strict` — o contrato ficha × tela |
| `vite.config.ts` | Config do Vite. `base: './'` já pronto pro GitHub Pages |
| `index.html` | Casca do Vite (não é a ficha). `<div id="raiz">` |
| `src/main.tsx` | Ponto de entrada — monta o React no `#raiz` |
| `src/App.tsx` | Compõe a ficha: cabeçalho fixo + abas + conteúdo. Roteia pra `Principal`, `Talentos`, `Ações`, `Inventário` — resto é placeholder |
| `src/estado/usePersonagem.ts` | **Estado VIVO** — recursos, escolhas de vaga, `alternarEquipada`, `definirMarcos`, `adicionarItem`/`removerItem`. Persistência é o item 2.3 |
| `src/componentes/CabecalhoFixo.tsx` | Cabeçalho fixo TOTAL: identidade + 3 grupos + derivados. **O recurso é BOTÃO** — abre o `ControleRecurso` |
| `src/componentes/ControleRecurso.tsx` | **Popover de dano/cura**: ▲▼ de ±1 + entrada numérica. Um componente, serve aos 3 recursos |
| `src/componentes/PopoverDetalhe.tsx` | Popover só-leitura — toca num número calculado e vê de onde vem cada parcela. Reaproveita o visual do `ControleRecurso` |
| `src/componentes/SeletorSecao.tsx` | As 8 abas estilo DDB. Exporta `SECOES` e o tipo `Secao` |
| `src/componentes/secoes/Principal.tsx` | Aba Principal: especializações (chips) |
| `src/componentes/secoes/Talentos.tsx` | Aba Talentos — cruza talento (dado) × `regras/talentos.ts` (regra) × escolha do jogador (vivo). Talento com `vagas` ganha dropdown editável; sem vagas, fallback só-leitura |
| `src/componentes/secoes/Acoes.tsx` | Aba Ações — ataques das armas equipadas (acerto/dano via `regras/calculos.ts`), ações concedidas por talento, e as 17 ações padrão de combate como referência |
| `src/componentes/secoes/Inventario.tsx` | Aba Inventário — peso carregado/máximo, marcos editável, armas (equipar), itens por categoria, "Gerenciar Inventário" (add/remover) |
| `src/componentes/secoes/Anotacoes.tsx` | Aba Anotações — blocos livres título+conteúdo, 100% do app (Shards não tem isso). Cabeçalho recolhe/expande o corpo |
| `src/tipos/personagem.ts` | **O SCHEMA** — fonte única dos tipos. Sem `total` na perícia: quem calcula é `regras/calculos.ts` |
| `src/regras/talentos.ts` | **Catálogo de talentos** — nome, fonte, pré-requisitos, ativação, descrição, e `vagas?` (escolhas em aberto). Um bloco por trilha |
| `src/regras/especialidades.ts` | **Vínculo talento→concessão do Eccho** — o Shards não expõe essa ligação. Só o valor INICIAL das vagas |
| `src/regras/especialidadesCulturais.ts` | As 13 especialidades culturais do livro (Cap. 2) — lista fechada, completa dropdown |
| `src/regras/especialidadesUtilidadePerito.ts` | Exemplos do livro (Cap. 3) pra Utilidade/Perito — o livro não fecha essas duas, por isso o dropdown tem "Outra" |
| `src/regras/pericias.ts` | Teto de graduação por patamar (2/3/4/5/5) + a exceção da Erudição. Ainda não consumido em tela |
| `src/regras/calculos.ts` | `totalPericia`/`detalhePericia` (perícia) + `pesoCarregado`/`pesoEmKg` (inventário) + `periciaPorNome` |
| `src/regras/acoes.ts` | 17 ações padrão (Cap. 10) + ações de talento (Cap. 5, ex. Inspirar Luz) + Habilidades de Espreno (Cap. 5, condicional em `ficha.radiante`) |
| `src/estado/importarShards.ts` | **O TRADUTOR** — JSON do Shards → schema. **Grita** no que não reconhecer. Traduz nomes (atributo, perícia, perícia de arma) pro PT-BR, tipo de dano, e unidades (ft→m · lb→kg) |
| `public/personagens/eccho.json` | Cópia do export do Shards — o que o app carrega. Deve obedecer ao schema |
| `src/estilos/base.css` | Reset + **tokens do tema Shards claro** ([decisão 0013](escopo/decisoes/0013-tema-shards-claro.md)) — fonte única de cor. Nenhum componente inventa cor |
| `node_modules/` · `package-lock.json` | Gerados pelo npm — não editar à mão. `node_modules` no gitignore |

## 2. O que está planejado

*Sai daqui e sobe pro §1 conforme for criado.*

```
app/
├── public/
│   └── icones/                   ← ícones do PWA (Fase 2)
├── src/
│   ├── regras/                   ← lógica do sistema, sem UI
│   │   ├── ordens.ts             ← regras do Elsecaller/inkspren: Ações de Luz e do
│   │   │                            Mancha (decisão 0012 — a "ficha inteligente")
│   │   └── dados.ts              ← d20 + Dado de Trama (Fase 4 — decisão 0011)
│   ├── estado/
│   │   └── armazenamento.ts      ← localStorage (Fase 2.3)
│   └── componentes/
│       └── secoes/
│           └── Pericias.tsx · Condicoes.tsx · Radiante.tsx · Personagem.tsx
```

> `PainelRecurso.tsx` do plano original nunca foi criado à parte — virou `CabecalhoFixo.tsx` (exibição) + `ControleRecurso.tsx` (popover de edição). `regras/calculos.ts` e `secoes/Talentos.tsx` já saíram daqui — estão no §1.

**Regra de ouro:** `regras/` não conhece a tela, `componentes/` não faz conta. Assim dá pra testar regra sem abrir o navegador.

> 💡 `.tsx` = TypeScript + HTML no mesmo arquivo (o "JSX" do React). `.ts` = só lógica, sem tela.

## 3. Dependências internas

O fluxo é sempre: **schema → regra → estado → tela.** Nunca o contrário.

```
tipos/personagem.ts  ← a raiz de tudo
        ↓
   regras/*.ts  ·  estado/*.ts
        ↓
   componentes/*.tsx
```

| Se mudar… | Revisar… | Por quê |
|---|---|---|
| **`tipos/personagem.ts`** ⚠️ | `regras/` · `estado/` · `componentes/` · `public/personagens/*.json` · [`escopo/dados.md`](escopo/dados.md) | **O de maior alcance.** Todo o resto lê a ficha por ele. Mudou campo → os JSONs viram inválidos |
| **`estado/importarShards.ts`** (o tradutor) | `tipos/personagem.ts` · `public/personagens/*.json` · [`escopo/dados.md`](escopo/dados.md) | Única porta de entrada de dado. **Quebra calada** quando o Shards mudar — tem que validar e gritar ([decisão 0007](escopo/decisoes/0007-formato-proprio-mais-tradutor.md)) |
| `regras/ordens.ts` | `secoes/Acoes.tsx` · `Radiante.tsx` · [`escopo/roadmap.md`](escopo/roadmap.md) perguntas 8–9 | As Ações de Luz/Mancha vêm daqui, não do JSON. Regra do livro: conferir contra transcrição |
| `regras/talentos.ts` | `secoes/Talentos.tsx` · `usePersonagem.ts` | Nome/efeito/vagas de cada talento — um bloco de trilha por vez |
| `regras/especialidades.ts` | `usePersonagem.ts` · `secoes/Talentos.tsx` | Dado do Eccho — não generaliza pra outro personagem sem ajuste |
| `regras/pericias.ts` | *(reservado — ninguém ainda)* | Teto por patamar, pra quando a aba Perícias nascer |
| `regras/calculos.ts` | `secoes/Talentos.tsx` · `Acoes.tsx` | Cresce quando `Pericias.tsx` nascer |
| `regras/acoes.ts` | `secoes/Acoes.tsx` | Ações padrão + concedidas por talento |
| `regras/dados.ts` (Fase 4) | rolador · [`escopo/interface.md`](escopo/interface.md) → "Tela de dados" | Regra provisória ([decisão 0010](escopo/decisoes/0010-regra-provisoria-do-dado-de-trama.md)) |
| `estado/armazenamento.ts` | `estado/usePersonagem.ts` | Formato salvo mudou → **ficha salva no celular vira lixo**. Precisa de migração |
| `estado/usePersonagem.ts` | `CabecalhoFixo.tsx` · `ControleRecurso.tsx` · `secoes/Talentos.tsx` · seções com custo | É a fonte do estado vivo |
| `src/estilos/base.css` | Todos os componentes | Fonte única de cor/tipo — tema Shards ([decisão 0013](escopo/decisoes/0013-tema-shards-claro.md)) |
| `vite.config.ts` | `.github/workflows/deploy.yml` (na raiz, Fase 2.4) | `base` errado = tela branca no GitHub Pages |
| `package.json` | `.github/workflows/deploy.yml` | Script de build e a versão do app |
| `public/personagens/*.json` | — (só dados) | Deve **obedecer** ao schema, nunca o contrário |

## 4. Manutenção

- Criou/renomeou/moveu/apagou **dentro de `app/`** → atualiza **este** mapa (§1, §2, §3). O mapa-projeto **não é tocado**.
- Mudança **fora** de `app/` (docs, referências, workflows) → é com o [mapa-projeto](.claude/mapa-projeto.md).
- Completou item do roadmap → **sobe a Minor** no `package.json`.
