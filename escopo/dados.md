<!-- DESTINO: escopo/dados.md -->
# Dados — schema, tradutor e o que o Shards entrega

← [Sumário](README.md)

> ⚠️ Valores vêm **sempre** do JSON importado. **Nunca hardcoded** — é o princípio nº 1.
> 📌 **A fonte única dos tipos agora é o código:** [`src/tipos/personagem.ts`](../src/tipos/personagem.ts) (desde 17/Jul/2026). O schema abaixo é o **retrato comentado** — se divergirem, **vale o .ts**, e este doc é que se corrige.
> Diferença que já nasceu lá: a perícia **não guarda `total`** — a fórmula foi confirmada (pergunta 5) e o total virou conta do `regras/calculos.ts`. Valor derivado guardado = duas fontes divergindo.

**Fonte:** conferido campo a campo contra o export real do Shards — `C:\Users\cesar\Downloads\stormlight-characters-2026-07-03.json` (Eccho, nível 3, `version: 1`, 03/Jul/2026).

> A versão anterior deste doc foi levantada do **PDF da ficha**, não do export — e **quase nenhum campo batia**. O PDF diz o que a ficha *tem*; o export diz o que o sistema *entrega*. Não é a mesma coisa.

Decisões que mandam aqui: [0007 — formato próprio + tradutor](decisoes/0007-formato-proprio-mais-tradutor.md) · [0009 — ler primeiro, calcular depois](decisoes/0009-ler-primeiro-calcular-depois.md).

## O tipo Personagem

```ts
type Personagem = {
  meta: {
    nome; jogador; nivel;
    ancestralidade;              // "Human"
    culturas: string[];          // ← tradutor junta culture1 + culture2
    kitInicial;                  // "Academic"
    trilhaHeroica;               // ← vem de heroic.startingPath ("Scholar")
    trilhaRadiante?;             // ← vem de radiant.order ("Elsecaller")
  };

  // ⚠️ o valor JÁ é o modificador — não existe conversão tipo D&D (20 → +5)
  atributos: { forca; velocidade; intelecto; vontade; consciencia; presenca };
  atributosMod: { ... };         // ❓ o Shards manda separado. Soma? Ver pergunta 6

  defesas: { fisica; cognitiva; espiritual };   // 3 defesas, não 1 CA
  defesasBonus: { ... };                        // ❓ idem
  deflect: number;

  recursos: {                                   // o que muda toda hora na mesa
    vida:        { atual; max };                // ← healthCur / healthMax
    foco:        { atual; max };
    investidura: { atual; max };
  };

  derivados: {
    dadoRecuperacao;             // "d8"
    movimento;                   // 30
    alcanceSentidos;             // "20 ft"
    capacidadeCarga;             // ← carryingCapacity  ⚠️ são DOIS campos no Shards
    capacidadeLevantamento;      // ← liftingCapacity
  };

  pericias: Array<{
    id; nome; atributo;          // key / name / trait
    graduacao;                   // rank (0–2 até o nv 5)
    graduacaoBonus; misc;        // componentes que o Shards manda
    total;                       // ⚠️ DIGITADO pelo César — o Shards não manda. Ver "O que o Shards NÃO dá"
  }>;

  especializacoes: Array<{ tipo: 'cultural' | 'especialista'; nome }>;

  talentos: Array<{
    id; nome; origem: 'heroica' | 'radiante' | 'ancestral';
    chave: boolean;              // isKey
    // ⚠️ SEM ativacao e SEM resumo — o Shards não manda
  }>;

  armas: Array<{ ... }>;         // ⚠️ derivado: inventory.items com type: "weapon"
  itens: Array<{ nome; tipo; qtd; peso; equipado; tracos: string[] }>;
  fabriais: Array<{ nome; cargas: { atual; max }; padrao: boolean; efeitos? }>;
  marcos: number;                                                 // moeda

  proposito; obstaculo; personalidade; aparencia; conexoes;
  objetivos: Array<{ nome; concluido: boolean; grau }>;   // ⚠️ achieved é BOOLEAN

  radiante?: {
    ordem;                                       // "Elsecaller"
    spren: { nome; tipo; iluminado: boolean };   // ← sprenBonds[]
    alcanceSpren: number;                        // 30
    ideais: Array<{ n; jurado: boolean; texto }>;  // ← tradutor funde idealsText + ideals
    fluxos: Array<{
      id; nome; atributo; graduacao;
      ativacao: Ativacao;        // ✅ surgeSkills TEM activation ("action", "action2x")
      talentos: Array<{ id; nome; aprendido: boolean }>;
    }>;
  };

  // estado vivo — ⚠️ o Shards TAMBÉM manda estes campos. Ver "Ficha × estado vivo"
  condicoes: Array<{ nome; duracao }>;
  lesoes: Array<{ tipo: 'temporaria' | 'permanente'; descricao; diasRestantes? }>;
};

type Ativacao = '1acao' | '2acoes' | '3acoes' | 'livre' | 'reacao' | 'especial' | 'sempre';
// Livro:         ▶        ▶▶         ▶▶▶        ▷         ↻          ★            ∞
// Shards:      "action"  "action2x"   ?          ?         ?          ?            ?
```

## Armadilhas do JSON do Shards

O tradutor tem que saber destas — todas verificadas no export real:

| Armadilha | Detalhe |
|---|---|
| **Campos mortos** | `talents: ""` (string vazia na raiz) e `surges: [{...vazio}]` são **legado**. Os reais são `heroic.talents[]` e `radiant.surgeSkills[]`. Não ler os mortos |
| **Duplicação na raiz** | `name` e `player` aparecem **duas vezes**: em `meta` e na raiz do personagem |
| **Ideais em dois objetos** | `idealsText.{i1..i5}` (texto) e `ideals.{i1..i5}` (jurado, booleano). O tradutor **funde** nos nossos `ideais[]` |
| **Talentos em três lugares** | `heroic.talents[]` · `radiant.talents[]` · `ancestryTalents[]`. Viram um array só, com `origem` |
| **Armas não existem** | São `inventory.items[]` com `type: "weapon"` |
| **Fabriais fora do inventário** | `fabrials.standard[]` (Clock 3/3) e `fabrials.custom[]` (Diapasão 0/5) — **dois formatos diferentes** |
| **Envelope multi-personagem** | Raiz = `{ exportedAt, version: 1, characters: [...] }`. **Já é array** — o item 4.4 sai quase de graça |
| **Unidades imperiais** | O Shards manda ft e lb; **o tradutor converte na entrada** (ft→m ×0,3 · lb→kg ×0,5 — convenção das mesas BR, contas redondas: 30ft→9m, 100lb→50kg). Nenhuma tela converte. ⚠️ Se o Guia PT-BR imprimir outros números, o livro desempata |

## FIXO — o Shards manda pronto

> 💡 **A descoberta que muda o projeto: o Shards já fez a conta.** Defesas, vida máxima, dado de recuperação e movimento **vêm calculados**. O `regras/calculos.ts` **não precisa existir pra desenhar a ficha** — o app precisa de um *leitor*, não de um motor de regras. Ver [decisão 0009](decisoes/0009-ler-primeiro-calcular-depois.md).

*Verificado no export do Eccho:*

| Campo | O que o Shards manda |
|---|---|
| `meta` | "Eccho" · Cesar · nível 3 · Human · Thaylen + Kharbranthian · kit Academic |
| **Atributos** | FOR 1 · VEL 3 · INT 3 · VON 3 · CON 3 · PRE 0 — **já são os modificadores** |
| **Defesas** | Física **14** · Cognitiva **17** · Espiritual **13** — ✅ **já calculadas** |
| **Recursos** | Vida 21/21 · Foco 4/5 · Investidura **0/0** ⛔ *(a ficha PT-BR do César diz **0/5** — o export está desatualizado. Ver pergunta 12)* |
| Deflect · Marcos | 0 · 65 |
| **Derivados** | Dado de Recuperação **d8** · Movimento **30** · Sentidos **20 ft** · carga 100/200 lb |
| **Graduação da perícia** | `rank` 0/1/2 — ✅ a bolinha de 3 estados funciona hoje |
| Especializações | 4 (Manufatura de Fabriais · Navegação · Mineralogia/Gemas) |
| Objetivos | 6, todos `achieved: false` |
| Armas e itens | Maça (1d6 impacto, Momentum) · Óleo · Livro |
| **Fabriais** | Clock **3/3** · Diapasão **0/5** — ✅ o item 3.2 tem dado |
| Ideais | 5 textos + jurado (todos `false`) |
| Talentos (nome) | Erudition (chave) · Efficient Engineer · Prized Acquisition · Fine Handiwork |
| Fluxos | Transformation (Vontade, `action2x`) · Transportation (Intelecto, `action`) — ✅ **com ativação** |

## O que o Shards NÃO dá

**Buracos reais.** Não adianta procurar melhor — o dado não existe no export:

| Falta | Como o app se vira **agora** |
|---|---|
| **Total da perícia** | Manda os componentes (`rank`, `rankBonus`, `misc`) e **nenhum total**. → ✅ **RESOLVIDO: o app CALCULA** — fórmula confirmada no livro (p.56): `modificador = atributo efetivo + graduações`. Fonte: transcrição `03-estatisticas/03-pericias-e-graduacoes.md`. Quem calcula: `regras/calculos.ts` |
| **Ativação e resumo dos talentos** | `{id, name, path, isKey}` e nada mais. → Talento aparece **sem ícone** de ativação. Os *fluxos* têm; os talentos não |
| **Ações do Mancha (custo de Foco)** | Não existem no JSON. → **Tirou o item 1.6 da Fase 1.** O texto está no livro, transcrito em `campanha-cosmere-marcos/livro/.../radiante-alternauta-03.md` — a fonte existe, só não é o Shards. Ver pergunta 9 |
| **Ações de Luz / custo de Investidura** | Idem |
| `attributeMods` · `defenseBonuses` somam? | → **Não somar** por ora. Exibir o valor base, que é o que a ficha do Shards mostra. Ver pergunta 6 |

> **Regra de ouro:** provisório **aparece na tela como provisório**. O app nunca mostra um número inventado com cara de número certo — é a versão em pixels do "não inventar regra do sistema" do [CLAUDE.md](../CLAUDE.md).

## Ficha × estado vivo

> ⚠️ **A versão anterior deste doc dizia que condições, lesões e vida atual "nascem e morrem no app, não vêm do Shards". Está ERRADO** — verificado no export real.

```json
"conditions": [],  "injuries": [],  "rollLog": [],
"resources": { "healthCur": 21, "focusCur": 4 }
```

| Tipo | Exemplo | Shards manda? | Quem é dono na prática |
|---|---|---|---|
| **Ficha** | atributos, perícias, talentos, fabriais | ✅ sim | **Shards** — o app só lê |
| **Estado vivo** | vida atual, foco atual, condições, lesões | ✅ **sim, também** | **O app**, durante a sessão |
| **Vantagens acumuladas** | ver [interface.md](interface.md) → "Vantagem e desvantagem" | ❌ não | Só o app |

**Consequência:** a divisão "Shards = construção, app = jogo" ([decisão 0005](decisoes/0005-shards-fonte-de-verdade.md)) é **menos limpa do que está escrita lá**. O Shards não é só construção — ele tem vida atual, foco atual, condições, lesões e até `rollLog`. Os dois lados rastreiam a mesma coisa, que é justamente o cenário de "duas fichas divergindo" que a decisão queria evitar.

**Isso torna a pergunta 7 urgente, não acadêmica:** reimportar depois de subir de nível pode **sobrescrever o combate em andamento** com o `healthCur` que estava no Shards.
