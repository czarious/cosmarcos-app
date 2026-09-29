<!-- DESTINO: .claude/organizacao.md -->
# Organização do projeto — responsabilidade do Claude

> **Decidido em 12/Set/2026 pelo César:** *"a organização de pastas e arquivos vai ser sua, sempre mantenha isso organizado e eficiente."*
>
> Ele **não gerencia** estrutura de pastas, nome de arquivo, onde cada doc mora nem quando refatorar. Isso é meu. Ele revisa o resultado, não o caminho.
>
> **Consequência:** não perguntar "onde ponho este arquivo?". Decidir, fazer, e registrar no mapa. Só levar pra ele quando a mudança for grande o bastante pra mudar o **jeito de trabalhar** dele.
>
> ⚠️ **Nenhum doc do projeto numera seção.** O porquê, pesado, está em "Como eu decido uma convenção". O `verificar.mjs` reprova título numerado.

## O dever permanente

**A cada entrega, antes de dizer que terminei, eu avalio a organização — sempre, sem ser pedido.** Quatro perguntas:

| Pergunta | Se sim |
|---|---|
| Algo aqui merece **refatoração**? | Fazer agora, ou anotar com o motivo |
| Algo merece **reestruturação** — arquivo no lugar errado, pasta que não faz mais sentido? | Mover e atualizar o mapa |
| Dois arquivos deviam ser **um**? | Fundir. Dois docs sobre o mesmo assunto sempre divergem |
| Algo deveria ser **apagado**? | Apagar. Doc que ninguém abre e código que ninguém chama custam atenção toda vez que aparecem numa busca |

**Isso não espera o César pedir.** Ele disse: *"sempre tenha em mente que você é dono da sua organização e limpeza/verificação do projeto."* Limpeza atrasada não fica igual — fica pior, porque cada entrega nova se apoia na bagunça anterior.

**O custo de não fazer é meu, e aparece como lentidão:** projeto desorganizado me faz ler mais pra entregar menos — que é o gatilho **"processamento longo"**.

## As perguntas que eu me faço

*Lista do César, 12/Set/2026 — e ela é aberta: vale qualquer dúvida do mesmo tipo.*

> **A pergunta só vale se a resposta mudar o que eu faço em seguida.** Perguntar e seguir igual é ritual, não manutenção.

### Depois que algo deu errado

| Pergunta | O que a resposta significa |
|---|---|
| **"Por que errei nisso?"** | Separar **erro de informação** de **erro de atenção**. Informação que não existia → escrever a regra. Informação que existia e eu não li → o problema é **onde ela estava**, não quanto esforço fiz |
| **"Por que não enxerguei isso?"** | Estava escrito e eu não abri o arquivo → **posicionamento**. A regra tem que ir pro caminho de quem faz o trabalho: comentário no próprio código, ou linha no `CLAUDE.md` |
| **"Por que aquilo passou?"** | Escapou de uma conferência → candidato a virar checagem **automática** no `verificar.mjs`. Se uma máquina pode pegar, não deve depender de eu lembrar |

> ⚠️ **Problema estrutural não se conserta com mais esforço.** "Da próxima vez eu presto mais atenção" não é conserto — é a mesma estrutura com mais custo. Se a resposta for essa, a análise ainda não terminou.

### A análise só fecha quando vira mudança

*Exigência do César, 12/Set/2026: "não quero que me prometa zero erros, mas que analise o erro para não acontecer de novo."*

**Todo erro é analisado, e a análise termina em uma destas três — nunca numa intenção:**

| Saída | Quando é essa | Exemplo desta sessão |
|---|---|---|
| **Conferência nova** no `verificar.mjs` | A máquina consegue pegar | O verificador nasceu deixando `### 4.1` passar. Testei, achei o buraco, corrigi o regex e **provei que dispara** numerando um título de propósito |
| **Regra movida pro ponto de uso** | A informação existia, mas longe de quem trabalha | A regra de "não numerar seção" saiu de um doc distante e virou reprovação automática |
| **Estrutura corrigida** | O recorte é que estava errado | Três regimes de numeração convivendo viraram um só, com a exceção da transcrição escrita e justificada |

**Se nenhuma das três couber, a análise não terminou** — falta entender o erro. E um erro que só produziu boa intenção volta.

> ⚠️ **Nem todo erro tem conserto automático, e forçar um é pior.** Quando a saída certa for "estrutura corrigida" e não houver checagem possível, dizer isso — inventar uma verificação frágil só pra fechar a conta cria alarme falso, e alarme falso vira alarme ignorado.

### Antes e durante o trabalho

| Pergunta | Como responder |
|---|---|
| **"Dá pra encurtar esse processamento?"** | Contar arquivos abertos. Mais de 3 pra uma tarefa simples = contexto espalhado ou duplicado |
| **"Vale a pena criar outro arquivo aqui?"** | Aplicar o teste do `CLAUDE.md`: uso **sempre** ou **às vezes**? Arquivo novo só se o conteúdo for **grande** e de uso **ocasional**. Arquivo de 10 linhas quase nunca se paga |
| **"Falta pasta pra me organizar?"** | Pasta nasce com **3+ arquivos que dividem o mesmo papel** — antes disso é categoria prematura. Se a pasta existente virou depósito, o que falta é subdividir, não criar ao lado |
| **"Ele me pediu X — qual o jeito eficiente?"** | Antes de escrever: já existe algo que faz isso? Cabe em arquivo que já existe? Quantos arquivos a mudança vai tocar? Se forem muitos, o recorte provavelmente está errado |

## Como eu decido uma convenção

Às vezes a pergunta não é "onde ponho isso", é **"qual regra vale aqui?"** — e aí não basta arrumar: tem que legislar. Quatro passos:

1. **Notar que existe pergunta em aberto.** Normalmente ela aparece como incoerência: dois arquivos fazendo diferente, e nenhum dos dois errado.
2. **Pesar os dois lados — incluindo o custo da própria regra.** Regra tem preço de manutenção, e esse preço entra na conta.
3. **Decidir**, mesmo quando os dois lados têm razão. Empate não resolvido vira incoerência de novo em três semanas.
4. **Escrever a decisão e o porquê** — e, se der, **fazer a máquina cobrar**.

### Os dois critérios de desempate

> **1. Convenção que precisa de ritual vai mentir.** Se manter a regra exige lembrar de conferir algo a cada uso, ela será pulada. Este projeto já provou duas vezes: versão por arquivo e a coluna de versão do mapa mentiram em uma semana.

> **2. Prefira a falha barulhenta à silenciosa.** Erro que grita se conserta; erro que continua funcionando errado envenena tudo que se apoia nele.

### Exemplo registrado: seção numerada ou não?

*Pergunta levantada pelo César em 12/Set/2026, depois de eu ter três regimes convivendo no mesmo projeto — mapas numerados, `organizacao.md` por nome, e o `CLAUDE.md` proibindo número.*

**A favor de numerar:** endereço curto, acesso rápido — "§3" é mais rápido de escrever e de achar que o nome da seção.

**Contra:**

| Peso | |
|---|---|
| **Falha silenciosa** | Inserir seção no meio desloca todos os números seguintes. "§3" continua resolvendo — pra seção **errada**. Nome que mudou não resolve nada, e `Ctrl+F` acusa na hora |
| **O ganho é menor do que parece** | O editor já lista os títulos no outline: clica-se no nome, não no número |
| **Exige ritual** | "Toda vez que criar seção, conferir se a ordem está certa" — o critério de desempate 1, em cheio |
| **Dava pra automatizar, mas o preço é errado** | Um verificador de sequência sustentaria a convenção — mas pagar manutenção pra ganhar só abreviação de endereço não fecha |

**Decisão: sem números em documento nosso.** O `verificar.mjs` reprova título numerado — assim a regra não precisa de disciplina minha, e não dá pra reintroduzir por descuido.

**E se um doc ficar longo demais pra achar as coisas pelo nome?** Aí o problema é o tamanho, não o endereço: o conserto é partir o doc — ver o gatilho "arquivo com duas responsabilidades".

#### A exceção: a transcrição do livro

*Apontada pelo César, 12/Set/2026.*

`referencia/livro/transcricao/` **numera, e deve numerar** — nos nomes de pasta e arquivo (`00-introducao/`, `03-estatisticas-de-personagem/07-as-18-pericias.md`). Os títulos internos seguem os títulos do próprio livro.

**Por que a exceção não fura a regra:** ali o número **não é convenção nossa, é dado da fonte**. O capítulo 3 do Guia *é* o 3. Renomear pra "Estatísticas de personagem" falsificaria a referência e impediria conferir contra o PDF — e o livro é quem desempata neste projeto.

E os dois critérios de desempate continuam satisfeitos: não exige ritual (a ordem já vem pronta e conferida do livro) e a falha é barulhenta (número fora de ordem não bate com o PDF, e aparece na hora da conferência).

> **A regra geral que isso revela:** *numeração vinda de fonte externa é dado, não convenção — preservar.* Numeração inventada por nós é endereçamento — evitar. O `verificar.mjs` não varre `referencia/`, então a exceção já está sustentada por construção.

## A regra do CLAUDE.md

Pra cada assunto, uma pergunta só:

> **Ao abrir o projeto eu preciso saber disso imediatamente, ou posso ler só quando precisar?**

| Resposta | Onde vai |
|---|---|
| **Preciso imediatamente** | Seção dentro do `CLAUDE.md` |
| **Só quando precisar** | Arquivo próprio + **uma linha de referência** no `CLAUDE.md`, dizendo *quando* abrir |

**Passa no teste** (fica no CLAUDE.md): quem é o César e como falar com ele · como trabalhar · convenções de escrita · o índice dos documentos · o estado atual do roadmap.

**Não passa** (vira arquivo): tabela de custos · regras do Cosmere × D&D · quem está na mesa · o raciocínio completo de qualquer decisão.

⚠️ **A regra corta dos dois lados.** Fragmentar até o CLAUDE.md virar só ponteiros é tão ruim quanto o arquivo gordo: se pra saber uma coisa banal eu preciso abrir 5 arquivos, a fragmentação **criou** o custo que devia eliminar.

**Toda referência diz QUANDO abrir**, não só o que tem dentro. "Ver premissas.md" é inútil; "antes de propor dependência nova, ver premissas.md" funciona.

## Onde as coisas moram

| Tipo | Lugar | Regra |
|---|---|---|
| Código | `src/`, por **papel** | Ver "Pastas por papel" |
| O **porquê** de qualquer decisão | `escopo/premissas.md` | Página única e vigente. **Sobrescrever**, nunca acumular |
| O **o quê** — visão, roadmap, dados, telas | `escopo/*.md` | Um assunto por arquivo |
| O **onde** | `mapa-app.md` (dentro de `src/`) · `.claude/mapa-projeto.md` (raiz) | Atualizar **na mesma entrega** que criou/moveu/apagou |
| Regras de como eu trabalho | `.claude/` | Não é conteúdo do projeto — é instrução pra mim |
| Material de terceiro (livro, prints, export) | `referencia/` | **Nunca versionado** — repo é público |

## Pastas por papel, não por extensão

`src/` é organizado por **o que o arquivo faz**, não pelo tipo dele:

```
src/
├── tipos/        o contrato — o schema da ficha
├── regras/       lógica do sistema, sem tela
├── estado/       o que muda e o que persiste
├── componentes/  a tela
├── estilos/      cor e forma
└── variaveis.ts  símbolo, ícone e rótulo
```

**Por que não `js/`, `ts/`, `json/`:** agrupar por extensão espalha **uma funcionalidade** por várias pastas — mexer nas perícias obrigaria a abrir `ts/`, `tsx/` e `css/` pra juntar o que é um assunto só. Agrupar por papel mantém junto o que muda junto.

**As duas regras de ouro que a estrutura protege:**
- `regras/` não conhece a tela · `componentes/` não faz conta
- O fluxo é sempre **schema → regra → estado → tela**, nunca o contrário

## Gatilhos de refatoração

**São sintomas, não opiniões.** Se um disparar durante o trabalho, a organização falhou — e o conserto entra na mesma entrega ou vira item anotado. *("Regra esquecida" e "processamento longo" são as heurísticas do César.)*

| Gatilho | O que significa | Conserto |
|---|---|---|
| **Regra esquecida** no meio de uma atividade | A referência não estava **no caminho** de quem faz o trabalho | Levar a regra pro **ponto de uso** — comentário no próprio arquivo, ou linha no CLAUDE.md. Não adianta estar escrita num doc que eu não abri |
| **Processamento longo** e cansativo | Li muito pra produzir pouco: contexto espalhado ou duplicado | Consolidar o que se lê junto. Se abri 4 arquivos pra uma tarefa, eles provavelmente são um assunto só |
| **3+ arquivos** pra responder algo simples | Fragmentação excessiva — a regra do CLAUDE.md violada pro lado do "enxugar demais" | Trazer de volta pro arquivo principal |
| **Mesmo fato em dois lugares** | Uma das cópias vai mentir, e não dá pra saber qual | Apagar uma, deixar ponteiro. ⚠️ **Vale pra FATO, não pra código** — ver "Regra de Três" |
| **Link quebrado** ou referência a arquivo renomeado | Mapa e realidade divergiram | Consertar + rodar o `verificar.mjs` |
| **Não soube onde pôr** um arquivo novo | Falta uma categoria, ou existe uma sobrando | Decidir, e **atualizar "Onde as coisas moram"** com a categoria nova |
| Arquivo passou de **~250 linhas fazendo mais de uma coisa** | Duas responsabilidades num lugar só | Partir por responsabilidade — nunca por tamanho |
| Pasta com **um arquivo só**, ou com **15+** | Categoria prematura, ou categoria que virou depósito | Dissolver a de um; subdividir a de muitos |
| **`componentes/` passou de ~15 arquivos** | O limite conhecido do agrupamento por papel | Migrar pra pastas **por funcionalidade** (`pericias/`, `inventario/`), levando junto o que só aquela tela usa |
| **Não consigo dar um bom nome** pra algo | Fowler: nome difícil é sintoma de design confuso, não de vocabulário pobre | Não forçar o nome — repensar o recorte. Aconteceu com o `variaveis.ts`: "aparência" não cobria tudo que ia pra lá |

> **O que NÃO é gatilho:** arquivo grande que faz **uma coisa só** bem feita. Tamanho sozinho não justifica quebrar nada — quebrar por número de linhas é como o "3+ arquivos" nasce.

## Revisão periódica

**Quando rodar:** ao terminar um item do roadmap, ou quando qualquer gatilho disparar duas vezes seguidas.

### O que a máquina confere

```
node .claude/verificar.mjs
```

Links quebrados entre docs · arquivo de `src/` fora do `mapa-app.md` · doc fora dos mapas · versão copiada em doc. Sem dependência, só Node. Sai com código 1 se achar algo.

> Ele ignora **code spans** de propósito: caminho de exemplo dentro de crases não é link quebrado. Por isso **exemplo de caminho se escreve entre crases, nunca como link** — senão o alarme toca à toa, e alarme que toca à toa vira alarme ignorado.

### O que só eu confiro

1. **Duplicação** — o mesmo fato em dois docs? Um vira ponteiro. ⚠️ Limiar diferente pra código: ver "Regra de Três"
2. **O teste do CLAUDE.md** — alguma seção deixou de ser "preciso imediatamente"? Alguma referência virou tão usada que devia subir?
3. **Fatos vencidos** — data, estado do roadmap, "ainda não implementado"
4. **Os gatilhos que dependem de julgamento** — arquivo fazendo duas coisas, pasta virando depósito, nome que não sai

## O que a prática corrente confirma — e o que ela corrige

Pesquisado em 12/Set/2026. Só entrou o que **apareceu em fonte independente mais de uma vez**.

| Prática | Fonte | O que fizemos com ela |
|---|---|---|
| **Agrupar por funcionalidade, não por tipo de arquivo** ("Screaming Architecture" — a estrutura grita o que o app *faz*, não o framework) | [profy.dev](https://profy.dev/article/react-folder-structure) · [DEV](https://dev.to/profydev/screaming-architecture-evolution-of-a-react-folder-structure-4g25) · [thetshaped.dev](https://thetshaped.dev/p/screaming-architecture-and-colocation-nodejs-typescript-react) | ✅ **Confirma "pastas por papel"** — `js/`/`ts/` estavam certas de descartar |
| **Agrupar por tipo quebra entre 15 e 20 componentes** | [Medium — 7 ways](https://rahuulmiishra.medium.com/react-folder-structure-7-ways-to-organize-a-react-app-and-exactly-when-each-one-breaks-ccb10dba68c2) · [DZone](https://dzone.com/articles/production-grade-react-project-structure) | ⚠️ **Virou o gatilho "componentes > 15".** Nosso tem 9 — funciona hoje, e agora tem data de validade conhecida |
| **Regra de Três** — duas ocorrências não justificam abstrair; espere a terceira, senão a abstração sai errada | [Fowler/Roberts, via Wikipedia](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)) · [understandlegacycode](https://understandlegacycode.com/blog/refactoring-rule-of-three/) | ⚠️ **Corrige um gatilho meu** — ver abaixo |
| **"Colocate first, extract later"** — nasce junto da tela que usa; sobe pra pasta comum quando um segundo lugar precisar | [thetshaped.dev](https://thetshaped.dev/p/screaming-architecture-and-colocation-nodejs-typescript-react) · [profy.dev](https://profy.dev/article/react-folder-structure) | ✅ Adotado: componente novo nasce em `componentes/secoes/`; só vira compartilhado quando a segunda seção pedir |
| **Um doc responde a UMA necessidade** — misturar "por quê" com "referência" é o que incha documentação (Diátaxis) | [diataxis.fr](https://diataxis.fr/) · [I'd Rather Be Writing](https://idratherbewriting.com/blog/what-is-diataxis-documentation-framework) | ✅ **Explica o inchaço do CLAUDE.md**: ele misturava "como trabalhar" com tabela de referência |
| **Revisar a estrutura periodicamente**, não só quando dói | [World Bank template](https://worldbank.github.io/template/docs/folders-and-naming.html) · [CLIMB](https://climbtheladder.com/10-project-folder-structure-best-practices/) | ✅ Confirma "revisão periódica" |
| **Arquivar em vez de apagar** | [CLIMB](https://climbtheladder.com/10-project-folder-structure-best-practices/) · [Extensis](https://www.extensis.com/blog/how-to-create-a-manageable-and-logical-folder-structure) | ⛔ **Rejeitado aqui.** O César decidiu o contrário: registro vigente, sobrescrito, sem histórico. Pasta de arquivo morto vira o depósito que a premissa quer evitar |

### Regra de Três: duas cópias × três ocorrências

A Regra de Três diz pra **não** abstrair na segunda ocorrência — a terceira é que mostra o padrão de verdade, e abstrair cedo trava um recorte errado. Meu gatilho "mesmo fato em dois lugares" dizia o contrário.

**Os dois estão certos, em domínios diferentes:**

| | Limiar | Por quê |
|---|---|---|
| **Fato escrito** (doc, rótulo, constante literal) | **2 já é demais** | Não existe "padrão a descobrir" — é a mesma informação. Duas cópias divergem, e aí uma mente sem avisar |
| **Estrutura de código** (função, componente, abstração) | **Esperar a 3ª** | A segunda ocorrência ainda não revelou o que varia. Abstrair cedo produz a abstração errada, que custa mais que a duplicação |

> Pelo critério certo, o `variaveis.ts` está de pé: ♥ ◆ ✦ eram **a mesma constante literal** em dois arquivos, não duas estruturas parecidas. Se fossem dois componentes com forma semelhante, eu teria esperado o terceiro.

## Quando levar pro César

Decido sozinho: nome e lugar de arquivo, criar/dissolver pasta, partir ou juntar doc, mover seção entre arquivos.

Levo pra ele: mudança que altera **o jeito dele trabalhar** (onde ele abre as coisas, o que ele precisa saber de cor), ou que mexe em `referencia/` e no que vai pro repo público.

> ⚠️ **Desde 12/Set/2026 ele não olha pastas nem código** — a divisão está no `CLAUDE.md` → "A divisão". Isso muda o peso de tudo neste arquivo: a revisão que ele fazia por cima do meu ombro **deixou de existir**, e quem substitui é a conferência automática mais o hábito de **declarar o que não consegui verificar**. Organização frouxa agora não é deselegância — é erro que ninguém pega.
