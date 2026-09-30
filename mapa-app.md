<!-- DESTINO: C:\dev\GitHub\cosmarcos-app\mapa-app.md -->
# MAPA DO APP — `C:\dev\GitHub\cosmarcos-app`

> **Tudo do código: arquivos, dependências internas e a regra de versão.**
> Código e documentação vivem juntos nesta pasta, fora do Drive ([premissas](escopo/premissas.md) → "Código e documentação na mesma pasta, fora do Drive").
> O [.claude/mapa-projeto.md](.claude/mapa-projeto.md) cuida da raiz do projeto e só aponta pra cá — **mudança no código atualiza este mapa, não aquele.**

## Versionamento — simplificado (decidido em 17/Jul/2026)

**Uma versão só: a do `package.json`.** Nada de versão por arquivo.

| Regra | |
|---|---|
| **Onde mora** | `"version"` no `package.json` — fonte única |
| **O que o número significa** | **Um estado publicado.** Cada número = um push pro GitHub. Não sobe por item de roadmap, nem por sessão — sobe **uma vez por push**, no commit que vai subir |
| **Quanto sobe** | Push com funcionalidade nova → **minor** (0.4.0 → 0.5.0) · push só com correção → **patch** (0.4.0 → 0.4.1) · push só de doc → **não sobe** (o app não mudou) · **1.0.0** = Fase 1 completa e usada numa sessão inteira ([roadmap](escopo/roadmap.md) → "Fase 1") |
| **Quem sobe** | O Claude, ao preparar o commit — e diz o número novo junto das mensagens. O César aprova os dois juntos, como já aprova todo push. *(Até 29/Set/2026 era "só quando o César mandar"; ele delegou a análise e o número passou a seguir o push.)* |
| **Marca no Git** | Tag `vX.Y.Z` no commit do push — o GitHub lista as versões em "Tags" |
| **Cabeçalho de arquivo** | Só identificação: `/* arquivo: nome.tsx */` — **sem número de versão** |
| **Histórico por arquivo** | É o **Git**, não um número: GitHub Desktop → History mostra toda mudança de cada arquivo, com data e mensagem |
| **Por quê** | Versão por arquivo = manutenção a cada edição, e a experiência dos docs mostrou: número que ninguém é obrigado a atualizar **mente**. Amarrar o número ao push elimina o ritual: ele sobe no único momento que já exige conferência |

## O que existe

| Arquivo | O que faz |
|---|---|
| `mapa-app.md` | Este arquivo |
| `package.json` | Nome, **versão do app** (fonte única) e dependências |
| `tsconfig.json` | TypeScript `strict` — o contrato ficha × tela |
| `vite.config.ts` | Config do Vite. `base: './'` pro GitHub Pages · `vite-plugin-pwa` em modo `prompt` (manifest, service worker, pré-cache incluindo `personagens/*.json`) |
| `index.html` | Casca do Vite (não é a ficha). `<div id="raiz">` · theme-color · apple-touch-icon |
| `public/icone.svg` | Fonte do ícone do PWA (✦ creme sobre vinho) |
| `public/icones/*.png` | Ícones 192, 512, maskable 512 e apple-touch 180 — gerados de `icone.svg` por `.claude/gerar-icones.mjs` |
| `src/vite-env.d.ts` | Declara `__VERSAO__` (a do package.json, posta pelo vite.config) |
| `src/main.tsx` | Ponto de entrada — monta o React no `#raiz`, dentro do `ProvedorIdioma` |
| `src/App.tsx` | Compõe a ficha: cabeçalho fixo (com a engrenagem) + painel de turno + abas + conteúdo + rodapé (estado do save). Liga o `useTurno` ao `usePersonagem` |
| `src/estado/usePersonagem.ts` | **Estado VIVO** — recursos, escolhas de vaga, `alternarEquipada`, `definirMarcos`, `adicionarItem`/`removerItem`, fabriais, `importarTexto`/`exportarJson`. Carrega do save; o JSON é semente e base da exportação |
| `src/estado/useTurno.ts` | **Estado do combate** ligado à ficha: o **plano do turno** ("Usar" só planeja), **Confirmar** grava o que `simularPlano` calculou, **Desfazer** volta a última confirmação. Tira Surpreendido no fim do turno. Chave própria no localStorage, fora do save |
| `src/estado/armazenamento.ts` | **Persistência** (localStorage). Salva a ficha INTEIRA + escolhas + o JSON cru do Shards (semente da exportação), com `VERSAO_ESQUEMA` e migração de versão antiga. Save que não abre → **quarentena** (cópia guardada) + aviso na tela, nunca quebra. Mesmo pacote = arquivo de **backup** |
| `src/estado/armazenamento.test.ts` | Testes do save: migração sem buraco, quarentena, gravação que falha, backup ida e volta |
| `src/componentes/CabecalhoFixo.tsx` | Cabeçalho fixo enxuto: identidade + engrenagem + Vida/Foco/Investidura com barra + faixa de condições. **O recurso é BOTÃO** — abre o `ControleRecurso` |
| `src/componentes/AvisoAtualizacao.tsx` | Registra o service worker, procura versão nova ao voltar pra tela e mostra "Atualizar" — o jogador escolhe a hora |
| `src/componentes/MenuEngrenagem.tsx` | A ⚙ do topo: importar (com confirmação), exportar pro Shards, baixar backup, idioma PT/EN |
| `src/componentes/PainelTurno.tsx` | Faixa do turno no topo fixo: rodada, ▶ (restantes, planejadas, gastas), ↻, preparada; o **plano** com ✕, custo, Confirmar/Limpar/Desfazer; turno rápido/lento, encerrar, fim do combate |
| `src/componentes/DialogoUso.tsx` | Pergunta o dado rolado antes de usar Restaurar (1d6), Recuperar (dado de recuperação) e quantas ▶ o Preparar reserva |
| `src/componentes/ControleRecurso.tsx` | **Popover de ±**: botões − e + de ±1 + entrada numérica. Serve a qualquer contador atual/máximo — os 3 recursos e as cargas de fabrial |
| `src/componentes/FormularioFabrial.tsx` | Montador de fabrial (novo/editar): padrão ou único, efeito, qualidade, aprimoramentos, revezes e características do livro, com avisos que não bloqueiam |
| `src/componentes/ControleMarcos.tsx` | As 3 caixas de marco de história + concluir. Serve a Objetivos e Ideais |
| `src/componentes/PopoverDetalhe.tsx` | Popover só-leitura — toca num número calculado e vê de onde vem cada parcela. Reaproveita o visual do `ControleRecurso` |
| `src/componentes/SeletorSecao.tsx` | Barra de uma linha (ícone + aba aberta + 9 quadradinhos) que abre o menu com todas as abas. Exporta `SECOES` (nome → ícone) e o tipo `Secao` |
| `src/componentes/secoes/Principal.tsx` | Aba Principal — o "Abilities, Saves, Senses" do DDB: 3 cartões [atributo·DEFESA·atributo], Deflexão, movimento/sentidos/recuperação/carga/levantamento, com o efeito das condições |
| `src/componentes/secoes/Pericias.tsx` | Aba Perícias — as 18 agrupadas por atributo, bolinha de graduação (◎ = de talento, isenta do teto) e o total calculado, grande. Toque no total abre o `PopoverDetalhe` |
| `src/componentes/secoes/Talentos.tsx` | Aba Talentos — cruza talento (dado) × `regras/talentos.ts` (regra) × escolha do jogador (vivo). Talento com `vagas` ganha dropdown editável; sem vagas, fallback só-leitura |
| `src/componentes/secoes/Acoes.tsx` | Aba Ações — tudo que o personagem pode fazer, cada item com "Usar" ligado ao turno: ataques (Golpear, mão inábil), fluxos (total, pagar Investidura, guia "Como usar"), Luz, as 17 padrão, fabriais de combate, espreno |
| `src/componentes/secoes/Condicoes.tsx` | Aba Condições — "Agora" (ações/reação/movimento/lembretes), as 14 com checkbox e valor entre colchetes, lesões (rolagem guiada, dias, curar) e descanso curto/longo. Exporta `rotuloCondicao` pro cabeçalho |
| `src/componentes/secoes/Fabriais.tsx` | Aba Fabriais — cartão por fabrial: cargas (± de ajuste), recarga com Investidura e grantormenta, efeito/aprimoramentos/revezes e avisos. **Usar** o fabrial é pelo plano da aba Ações |
| `src/componentes/secoes/Personagem.tsx` | Aba Personagem — objetivos (marcos, concluir, adicionar, apagar), identidade e o texto de interpretação do Shards |
| `src/componentes/secoes/Radiante.tsx` | Aba Radiante — vínculo, Ideais (marcos, Palavras, jurar) e fluxos com total via `detalhePericia` |
| `src/componentes/secoes/Inventario.tsx` | Aba Inventário — peso carregado/máximo, marcos editável, armas (equipar), itens por categoria, "Gerenciar Inventário" (add/remover), Pertences (texto livre do Shards) |
| `src/componentes/secoes/Anotacoes.tsx` | Aba Anotações — blocos livres título+conteúdo, 100% do app (Shards não tem isso). Cabeçalho recolhe/expande o corpo |
| `src/tipos/personagem.ts` | **O SCHEMA** — fonte única dos tipos. Sem `total` na perícia: quem calcula é `regras/calculos.ts` |
| `src/regras/talentos.ts` | **Catálogo de talentos** — nome, fonte, pré-requisitos, ativação, descrição, e `vagas?` (escolhas em aberto). Um bloco por trilha |
| `src/regras/especialidades.ts` | **Vínculo talento→concessão, POR PERSONAGEM** (`vinculosDe`) — o Shards não expõe essa ligação. Só o valor INICIAL das vagas; quem não tem entrada nasce com vagas vazias |
| `src/regras/especialidadesCulturais.ts` | As 13 especialidades culturais do livro (Cap. 2) — lista fechada, completa dropdown |
| `src/regras/especialidadesUtilidadePerito.ts` | Rótulo das 5 categorias de especialidade + exemplos do livro (Cap. 3) pra Utilidade/Perito — o livro não fecha essas duas, por isso o dropdown tem "Outra" |
| `src/regras/pericias.ts` | Teto de graduação por patamar (2/3/4/5/5) + a exceção da Erudição. Consumido pela aba Perícias |
| `src/regras/calculos.ts` | `totalPericia`/`detalhePericia` + `bonusNaoAtribuido` (o bônus que o Shards mandou e ninguém atribuiu) + `pesoCarregado`/`pesoEmKg` + `periciaPorNome` |
| `src/regras/condicoes.ts` | **Condições e lesões** (Cap. 9): as 14 condições, efeitos d8 de lesão, gravidade, rolagem de lesão — e o que muda na ficha (perícia, movimento, ações no turno, lembretes). Lesão com efeito vira condição por `condicoesEfetivas`, sem gravar duas vezes |
| `src/regras/condicoes.test.ts` | Testes de condição/lesão/descanso com os exemplos e faixas exatas do livro |
| `src/regras/descanso.ts` | **Descanso** curto (soma o dado de recuperação distribuído) e longo (Vida/Foco cheios, Exausto −1, superficial cura) |
| `src/regras/fabriais.ts` | **Regras de fabrial** (Cap. 7): 13 padrão, 15 efeitos únicos, aprimoramentos/revezes gerais com requisito, características avançadas, qualidade, patamar, recarga — e as contas (cargas pela regra, avisos, fabrial de uma arma) |
| `src/regras/acoes.ts` | 17 ações padrão (Cap. 10) + ações de talento (Cap. 5, ex. Inspirar Luz) + Habilidades de Espreno — com custo, efeito, "pode repetir" e "uma vez por cena" |
| `src/regras/turno.ts` | **Regra do turno** (Cap. 10): rápido/lento, reação, uma vez por turno, Preparar, Focado, Inconsciente, carga "ao acertar" — `avaliar`, `gastar`, e `simularPlano`/`aplicarUso` (a ficha depois do plano, pura) |
| `src/regras/turno.test.ts` | Testes do turno com os casos do livro |
| `src/regras/turno.cenarios.test.ts` | 20 turnos de jogador (10 lentos, 10 rápidos): a fala do jogador + o plano que ele montaria, conferidos contra o livro |
| `src/regras/armadura.ts` | **Armadura** (Cap. 7): deflexão total (a da ficha + a vestida, a maior), Desajeitada [X] com traço de perito → Lento e desvantagem em Velocidade |
| `src/regras/armadura.test.ts` | Testes da armadura: deflexão, Desajeitada, perito, tradutor, volta pro Shards, migração |
| `src/regras/fluxos.ts` | Guia de uso dos fluxos (Cap. 6): escalonamento, CD e custo de Transformação e Transporte, notas gerais |
| `src/estado/importarShards.ts` | **O TRADUTOR** — JSON do Shards → schema. **Grita** no que não reconhecer. Unidades pelos números do livro, inclusive com o Shards em métrico |
| `src/estado/importarShards.test.ts` | Testes do tradutor com o `eccho.json`: valores prontos, as 18 perícias contra a conta refeita do JSON cru, ida e volta do export |
| `src/estado/exportarShards.ts` | **O caminho de volta** — ficha → JSON que o Shards importa. Parte do JSON cru da importação e aplica só o que o app edita; o resto volta idêntico |
| `src/estado/deparaShards.ts` | **Os de-para** EN→PT-BR do tradutor, um mapa por categoria — só dado. Fonte: `referencia/livro/dicionario-en-ptbr.md` |
| `public/personagens/eccho.json` | Cópia do export do Shards — o que o app carrega. Deve obedecer ao schema |
| `src/idioma/pt.ts` | **Toda palavra de tela em português**, uma variável por texto, por tela. Dá o formato (`Dicionario`) que todo idioma cumpre. Regra: [premissas](escopo/premissas.md) → "Textos em variáveis, um arquivo por idioma" |
| `src/idioma/en.ts` | As mesmas variáveis, em inglês |
| `src/idioma/nomes.ts` | Nome de jogo PT → EN: de-para do tradutor invertido + o `nomeEn` dos catálogos de regra |
| `src/idioma/idioma.ts` | Preencher lacuna, plural (`Intl.PluralRules`), nome de jogo, mensagem de regra, número no formato do idioma |
| `src/idioma/IdiomaContexto.tsx` | `ProvedorIdioma` + `useIdioma()` → `tx` (as palavras), `t`, `tn`, `nome`, `msg`, `num`; escolha salva no aparelho |
| `src/idioma/idioma.test.ts` | Reprova palavra escrita no componente, lacuna diferente entre idiomas, nome sem inglês e mensagem de regra incompleta |
| `src/variaveis.ts` | **Símbolos, ícones e estrutura** da tela (sem palavra). Critério: [premissas](escopo/premissas.md) → "O que vira variável" |
| `src/fundos.ts` | Qual arte de fundo cada aba mostra pra este personagem (trilha → Principal, ordem → Radiante), pelo nome do arquivo |
| `src/assets/fundos/` | As imagens `.webp` de fundo + `creditos.md` (origem e licença de cada uma). Quem cria: agente de arte |
| `src/estilos/base.css` | Reset + **tokens do tema Shards claro** ([premissas](escopo/premissas.md) → "Tema Shards fiel") — fonte única de cor. Nenhum componente inventa cor |
| `node_modules/` · `package-lock.json` | Gerados pelo npm — não editar à mão. `node_modules` no gitignore |

## O que está planejado

*Sai daqui e sobe pra "O que existe" conforme for criado.*

```
(raiz do projeto)
├── src/
│   ├── regras/                   ← lógica do sistema, sem UI
│   │   ├── ordens.ts             ← regras do Elsecaller/inkspren: Ações de Luz e do
│   │   │                            Mancha (premissas.md → "A ficha inteligente é o objetivo")
│   │   └── dados.ts              ← d20 + Dado de Trama (Fase 4 — premissas.md → "O dado é rolado na mão")
```

> `PainelRecurso.tsx` do plano original nunca foi criado à parte — virou `CabecalhoFixo.tsx` (exibição) + `ControleRecurso.tsx` (popover de edição). As seções planejadas (Condições, Radiante, Personagem) já existem — estão em "O que existe".

**Regra de ouro:** `regras/` não conhece a tela, `componentes/` não faz conta. Assim dá pra testar regra sem abrir o navegador.

> 💡 `.tsx` = TypeScript + HTML no mesmo arquivo (o "JSX" do React). `.ts` = só lógica, sem tela.

## Dependências internas

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
| **`estado/importarShards.ts`** (o tradutor) · `deparaShards.ts` · `exportarShards.ts` | `idioma/idioma.ts` (nomes em inglês vêm do de-para) · `tipos/personagem.ts` · `public/personagens/*.json` · [`escopo/dados.md`](escopo/dados.md) · [`.claude/mapa-shards.md`](.claude/mapa-shards.md) | Única porta de entrada de dado. **Quebra calada** quando o Shards mudar — tem que validar e gritar ([premissas](escopo/premissas.md) → "Schema próprio em português + tradutor na entrada") |
| `regras/ordens.ts` | `secoes/Acoes.tsx` · `Radiante.tsx` · [`escopo/roadmap.md`](escopo/roadmap.md) perguntas 8–9 | As Ações de Luz/Mancha vêm daqui, não do JSON. Regra do livro: conferir contra transcrição |
| `regras/talentos.ts` | `secoes/Talentos.tsx` · `usePersonagem.ts` | Nome/efeito/vagas de cada talento — um bloco de trilha por vez |
| `regras/especialidades.ts` | `usePersonagem.ts` · `secoes/Talentos.tsx` | Um bloco por personagem, chaveado por `meta.nome`. Personagem sem entrada **funciona** — o total cai no `bonusNaoAtribuido` |
| `regras/pericias.ts` | `secoes/Pericias.tsx` | Teto por patamar — as bolinhas ○ são as vagas até ele |
| `regras/calculos.ts` | `secoes/Talentos.tsx` · `Acoes.tsx` · `secoes/Pericias.tsx` · `secoes/Radiante.tsx` (fluxo conta como perícia) | O total da perícia sai daqui — é o número que vai pra mesa |
| `regras/condicoes.ts` | `regras/calculos.ts` (total da perícia) · `CabecalhoFixo.tsx` · `secoes/Principal.tsx` · `secoes/Condicoes.tsx` · `secoes/Pericias.tsx` · `estado/armazenamento.ts` (migração v3→v4) | Mudou uma condição → o total de TODA perícia pode mudar. Ids são o que a ficha salva: renomear quebra o save. Regra: `transcricao/09-aventurando-se/06-condicoes.md` |
| `regras/acoes.ts` · `regras/turno.ts` | `secoes/Acoes.tsx` · `estado/useTurno.ts` · `PainelTurno.tsx` | Custo e efeito das ações — o que o "Usar" desconta da ficha |
| `idioma/pt.ts` · `idioma/en.ts` | Toda tela (`tx`) · `regras/*.ts` (Mensagem) | Variável nova vai nos dois arquivos — o compilador reprova se faltar num |
| Catálogos de regra (`acoes` · `talentos` · `condicoes` · `fabriais` · `fluxos`) | `idioma/nomes.ts` | Nome novo leva o `nomeEn` ao lado — o tipo exige |
| `regras/fabriais.ts` | `secoes/Fabriais.tsx` · `FormularioFabrial.tsx` · `secoes/Acoes.tsx` · `estado/importarShards.ts` · `estado/armazenamento.ts` | Ids de efeito/aprimoramento são o que a ficha salva — **renomear um id quebra o save**. Regra do livro: conferir contra `transcricao/07-itens/09-manufaturando.md` |
| `regras/dados.ts` (Fase 4) | rolador · [`escopo/interface.md`](escopo/interface.md) → "Tela de dados" | Regra provisória ([premissas](escopo/premissas.md) → "O Dado de Trama e a vantagem seguem o livro") |
| `estado/armazenamento.ts` ⚠️ | `estado/usePersonagem.ts` · `tipos/personagem.ts` | Salva a ficha inteira. Mudou o schema → subir `VERSAO_ESQUEMA` **e** escrever a entrada em `MIGRACOES` — o teste reprova se faltar. Sem migração o save vai pra quarentena e a ficha volta pra semente |
| `estado/usePersonagem.ts` | `CabecalhoFixo.tsx` · `ControleRecurso.tsx` · `secoes/Talentos.tsx` · seções com custo | É a fonte do estado vivo |
| `src/variaveis.ts` | `CabecalhoFixo` · `Principal` · `SeletorSecao` · `ControleRecurso` · `PopoverDetalhe` · `Pericias` · `Talentos` · `Acoes` · `Inventario` · `Anotacoes` · `Personagem` · `Radiante` · `App` · `regras/calculos.ts` | Rótulo/símbolo que a tela mostra. **Alcance largo:** trocar um glifo muda o app inteiro — que é o objetivo |
| `src/assets/fundos/*.webp` | `src/fundos.ts` (pelo nome do arquivo) · `vite.config.ts` (pré-cache do `webp`) | Renomear a imagem = a aba perde o fundo, sem erro. Regras de arte: `.claude/agents/arte.md` |
| `src/estilos/base.css` | Todos os componentes | Fonte única de cor/tipo — tema Shards ([premissas](escopo/premissas.md) → "Tema Shards fiel") |
| `vite.config.ts` | `.github/workflows/deploy.yml` (na raiz, Fase 2.4) | `base` errado = tela branca no GitHub Pages |
| `package.json` | `.github/workflows/deploy.yml` | Script de build e a versão do app |
| `public/personagens/*.json` | — (só dados) | Deve **obedecer** ao schema, nunca o contrário |

## Manutenção

- Criou/renomeou/moveu/apagou **dentro de `src/`** → atualiza **este** mapa. O mapa-projeto **não é tocado**.
- Mudança **fora** de `src/` (docs, referências, workflows) → é com o [mapa-projeto](.claude/mapa-projeto.md).
- Completou item do roadmap → **sobe a Minor** no `package.json`.
