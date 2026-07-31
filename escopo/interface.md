<!-- DESTINO: escopo/interface.md -->
# Interface — requisitos

← [Sumário](README.md)

> **Referência:** prints do **D&D Beyond mobile** (Android), 16/Jul/2026 — personagem "Shal'Khan", Rogue 10.
> Copiamos os *padrões de interação*, nunca o sistema — as diferenças Cosmere × D&D que forçam UI própria estão no [CLAUDE.md](../CLAUDE.md).
>
> 📌 **Os prints ficam em [`referencia/ddb/`](../referencia/README.md) — dentro do projeto, mas no `.gitignore`.** São a interface da Wizards/D&D Beyond e o repo é público, então ficam do lado do César pra consulta mas **nunca sobem pro GitHub**. Referenciar, não versionar — mesma lógica do texto da Brotherwise. A imagem é a fonte; **este doc é a decisão**.
>
> ✅ **Validação achada nos prints:** o menu de seções do DDB termina com **"Edit Character on Website"** — o DDB mobile faz **exatamente** a divisão que a gente faz: app = JOGO, site = CONSTRUÇÃO. A [decisão 0005](decisoes/0005-shards-fonte-de-verdade.md) tem precedente no app que estamos copiando.

## Padrões a copiar

| Padrão | Detalhe |
|---|---|
| **Cabeçalho fixo** ⚠️ *diverge do DDB* | Vitais **grudados no topo**, em qualquer seção *e em qualquer rolagem*. Ver [decisão 0008](decisoes/0008-cabecalho-fixo.md) |
| **Uma seção por vez** | Barra com ícone + nome; toca e abre o menu (modal) com todas. **Reorder** no canto do modal (item 4.3 do [roadmap](roadmap.md)); a seção atual vem destacada |
| **FAB de dado** | Botão flutuante, canto inferior direito. ⚠️ **No DDB ele cobre conteúdo** — não copiar o defeito: reservar a margem |
| **Todo número em caixinha é botão** | Toca e rola. Nas **Ações são dois botões por linha**: acerto (`+10`) e dano (`1d6+6`), separados — o dano traz o ícone do tipo dentro da caixa |
| **Tema escuro** · atributos em cards 2×3 | ⚠️ O card do DDB tem modificador **+ valor bruto** num oval. **No Cosmere o oval morre** — o atributo já é o modificador |
| **Bolinha de graduação** | Três estados — ver abaixo |
| **Selo de vantagem** | Colado na perícia (no DDB: "A" verde). Marca vantagem **permanente por talento** — ex.: *"enquanto tiver Investidura, ganha uma vantagem em testes de Dedução"*. **Não confundir** com as vantagens gastáveis da tela de dados |

### Graduação — três estados, não dois

O DDB já resolveu visualmente o problema que a gente tem. A coluna PROF da lista de perícias tem **três** estados, e eles mapeiam 1-pra-1 nas graduações do Cosmere (que vão até 2 no nível do Eccho):

| Símbolo | DDB | cosmarcos-app |
|---|---|---|
| ○ pontilhada | sem proficiência | **Graduação 0** |
| ● cheia | proficiente | **Graduação 1** |
| ◎ cheia com anel | *expertise* (dobro) | **Graduação 2** |

✅ Funciona hoje: o `rank` vem pronto do Shards ([dados.md](dados.md) → "FIXO").

## O que NÃO copiar do DDB

| Do DDB | Por quê não |
|---|---|
| **Barra de navegação inferior** (Library · Listings · Search · Characters · Campaigns) | É a casca do app deles, que tem vários personagens e um compêndio. Nós somos **uma ficha** — a barra inteira é espaço morto |
| **Valor bruto no card de atributo** | Não existe no Cosmere — o atributo já é o modificador |
| **FAB cobrindo conteúdo** | Defeito, não padrão |
| **Cabeçalho que rola pra fora** | Ver [decisão 0008](decisoes/0008-cabecalho-fixo.md) |
| **Saving Throws** | Não existem — viram as 3 Defesas |

## Recursos — Vida · Foco · Investidura

**Os termos são estes** — conferidos na ficha PT-BR do César (`campanha-cosmere-marcos/eccho/eccho.md`) e batem com o Shards:

| RECURSO | Atual | Máx |
|---|---|---|
| **Vida** | 21 | 21 |
| **Foco** | 4 | 5 |
| **Investidura** | 0 | 5 |

> **Os três são o mesmo componente.** Mesma tabela, mesmas colunas, mesmo comportamento na ficha do César. Não são três painéis — é **um `PainelRecurso`, usado três vezes**.

| Coluna | Comportamento |
|---|---|
| **Atual** | Muda o tempo todo na mesa. É **o** número do app |
| **Máx** | Vem do Shards, o app **não toca**. Só muda quando sobe de nível |

### Como o Atual muda

Dois caminhos, os dois na Fase 1 (itens 1.2 e 1.3):

| Gesto | Pra quê |
|---|---|
| **▲ / ▼** — botãozinho pra cima e pra baixo | O caso comum: 1 de Foco, 1 de Investidura. Um toque, sem teclado |
| **Toca no número** → entrada numérica | O caso do dano: tomou 7, digita 7. Rápido pra valor qualquer |

**Nunca passa dos limites:** trava em `0` e no `Máx`. Vida 21/21 não vira 22.

## Seções do app

| DDB | cosmarcos-app | Observação |
|---|---|---|
| Abilities, Saves, Senses | **Atributos, Defesas, Sentidos** | 3 defesas, não 1 CA |
| Skills | **Perícias** | Graduações, não bônus de proficiência |
| Actions | **Ações** | Armas, fabriais, ações radiantes |
| Inventory | **Inventário + Marcos** | Marcos = moeda |
| Spells | **Fluxos + Ações Radiantes** | Não são espaços de magia |
| Speed, Defenses | **Movimento, Defesas, Deflect** | |
| Features & Traits | **Talentos** | |
| Extras: Creatures | **Mancha (spren)** | Ações próprias, custam Foco |

### Aba Condições (item 1.5)

- **Lista suspensa das condições com checkbox** (pedido do César): marca → aplica na ficha; desmarca → remove. Checkbox, não rádio — **pode ter mais de uma ao mesmo tempo**.
- Condições com **valor entre colchetes** (Afligido [dano], Aprimorado [+N atributo], Exausto [–N]) pedem esse parâmetro ao marcar.
- Regras de cada condição (14): `referencia/livro/transcricao/09-aventurando-se/06-condicoes.md`.

---

## Tela de dados (rolador)

> 🔽 **FASE 4 — não é MVP.** O dado é rolado na mão ([decisão 0011](decisoes/0011-dado-rolado-na-mao.md)).
> ✅ **Regra confirmada no livro** — spec atualizada em 18/Jul/2026 conforme a [decisão 0015](decisoes/0015-regra-do-dado-confirmada-no-livro.md); a seção "Vantagem e desvantagem" abaixo reflete o livro.

**Sobrepõe a ficha** — não é troca de tela. O contexto continua atrás; fecha e você está de volta onde estava.

**Já vem preenchida pelo contexto.** Tocou em "Ataque com Lâmina" → abre com 1d20 e 1d8 marcados. Nada de montar rolagem na mão no meio do combate.

### Rolar não muda nada

*Definido pelo César em 16/Jul/2026.*

**O resultado é informação, não ação.** A tela mostra o número e para por aí. Dois caminhos, os dois válidos:

| O jogador… | O que acontece |
|---|---|
| **Olha e fecha** | **Nada.** A ficha não é tocada. É o padrão |
| **Olha e toca em "Aplicar"** | O valor vai pra ficha — ex.: rolou o Dado de Recuperação, aplica e a Vida sobe |

> ⚠️ **Regra de arquitetura: o rolador é atalho, nunca porta única.**
>
> *"Nem todos vão usar o app pra rolar dados."* — César
>
> Se o rolador é opcional, **nada pode depender dele**. Tudo que o "Aplicar" faz **tem que ser possível na mão também**. Na prática já está certo: o **item 1.2** (dano/cura na mão) é Fase 1; o "Aplicar" da Fase 4 só chama a mesma coisa com o número pré-preenchido. **O caminho manual é o principal; o rolador é o atalho.**

**Onde o "Aplicar" faz sentido — e onde não:**

| Rolagem | Tem "Aplicar"? |
|---|---|
| **Dado de Recuperação** (cura) | ✅ aplica na sua Vida |
| Efeito que mexe no **seu** Foco/Investidura | ✅ aplica |
| **Ataque · dano contra inimigo** | ❌ **não tem onde aplicar** — o app não rastreia inimigos ([visao.md](visao.md): não é VTT nem ficha de mestre). Mostra o número, você narra pro Marcos |

```
┌─────────────────────────────────────────┐
│  ROLAGEM — Ataque com Lâmina       [X]  │
├──────────────┬──────────────────────────┤
│  1  ▸ D20    │                          │  ← menu lateral: quantidade × tipo
│  1  ▸ D8     │      [ ROLAR ]           │     linhas em 0 continuam visíveis
│  0  ▸ D6     │                          │
│  0  ▸ D10    │                          │
│  0  ▸ D12    │                          │
│ ─────────────│                          │
│ [x] Trama    │                          │
│  Vantagem  2 │  ← contadores, não checks │
│  Desvant.  0 │     líquido = 2 vantagens │
└──────────────┴──────────────────────────┘
```

### Dado de Trama

**Não é um d6 comum** — é um dado de símbolos. A UI mostra o **símbolo**, nunca o número da face:

| Faces | Resultado | Efeito no teste |
|---|---|---|
| 2 | *(em branco)* | nada |
| 2 | **Oportunidade** | efeito narrativo — o jogador escolhe |
| 2 | **Complicação** | efeito narrativo (o MJ escolhe) **+ soma +2 ou +4 no teste** — uma face de cada |

> **O bônus e a complicação são inseparáveis.** Não existe pegar o +4 sem a complicação: o resultado ruim na narrativa **é** o que dá o bônus na conta. Por isso o Trama não é decoração — ele entra na soma do d20.

### Vantagem e desvantagem *(regra do livro — decisão 0015)*

**Valem por teste** (não acumulam entre testes). Vantagens e desvantagens do mesmo teste **se anulam 1 a 1** — vale o líquido.

**Como funciona cada vantagem:**
1. Escolha **um dado** do teste (d20, Dado de Trama ou dado de dano).
2. Role **dois** desse dado.
3. **O jogador escolhe** qual dos dois vale (vantagem) · **o MJ escolhe** (desvantagem).

| Regra | |
|---|---|
| **Cada dado só uma vez** | 2 vantagens = **dois dados diferentes**. Nunca 3 cópias do mesmo |
| **Escolhe, não rerola** | Os dois resultados saem juntos; um é escolhido, o outro descartado |
| **Oportunidade/Complicação em d20 duplo** | Só conta se **o d20 escolhido** for o do 20/1 natural |

**Consequência de UI:** o dado com vantagem mostra **os dois resultados lado a lado**; o escolhido fica em destaque, o descartado esmaecido. Em vantagem, o app pode pré-selecionar o melhor (o jogador escolheria esse); em desvantagem, quem dita é o Marcos — o app mostra os dois e deixa marcar.

Fonte: transcrição `referencia/livro/transcricao/03-estatisticas-de-personagem/03-pericias-e-graduacoes.md`.
