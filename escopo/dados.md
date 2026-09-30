<!-- DESTINO: escopo/dados.md -->
# Dados — schema, tradutor e o que o Shards entrega

← [Sumário](README.md)

> ⚠️ Valores vêm **sempre** do JSON importado. **Nunca hardcoded** — é o princípio nº 1.
> 📌 **A fonte única dos tipos agora é o código:** [`src/tipos/personagem.ts`](../src/tipos/personagem.ts) (desde 17/Jul/2026). O schema abaixo é o **retrato comentado** — se divergirem, **vale o .ts**, e este doc é que se corrige.
> Diferença que já nasceu lá: a perícia **não guarda `total`** — a fórmula foi confirmada (pergunta 5) e o total virou conta do `regras/calculos.ts`. Valor derivado guardado = duas fontes divergindo.

**Fonte:** conferido campo a campo contra o export real do Shards — `C:\Users\cesar\Downloads\stormlight-characters-2026-07-03.json` (Eccho, nível 3, `version: 1`, 03/Jul/2026).

> A versão anterior deste doc foi levantada do **PDF da ficha**, não do export — e **quase nenhum campo batia**. O PDF diz o que a ficha *tem*; o export diz o que o sistema *entrega*. Não é a mesma coisa.

Decisões que mandam aqui: [premissas](premissas.md) → "Schema próprio em português + tradutor na entrada" · [premissas](premissas.md) → "Ler primeiro, calcular depois".

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
    alcanceSentidos;             // "6 m"
    capacidadeCarga;             // ← carryingCapacity  ⚠️ são DOIS campos no Shards
    capacidadeLevantamento;      // ← liftingCapacity
  };

  pericias: Array<{
    id; nome; atributo;          // key / name / trait
    graduacao;                   // rank (0–2 até o nv 5)
    graduacaoBonus; misc;        // componentes que o Shards manda
    // SEM total, de propósito: quem calcula é regras/calculos.ts
  }>;

  especializacoes: Array<{ tipo: 'arma' | 'armadura' | 'cultural' | 'utilidade' | 'perito'; nome }>; // as 5 do livro

  talentos: Array<{
    id; nome; origem: 'heroica' | 'radiante' | 'ancestral';
    chave: boolean;              // isKey
    // ⚠️ SEM ativacao e SEM resumo — o Shards não manda
  }>;

  armas: Array<{ ... }>;         // ⚠️ derivado: inventory.items com type: "weapon"
  itens: Array<{ nome; tipo; qtd; peso; equipado; tracos: string[] }>;
  // armadura é item com deflexao?/tracos?/tracosPerito? (Shards: type "armor", deflect) — regras/armadura.ts
  equipamentoTexto: string;      // ← equipment: texto livre ("Equipment notes" na tela do Shards); volta no export
  fabriais: Array<{ id; nome; tipo: 'padrao' | 'unico'; modelo?; cargas: { atual; max };
                   qualidade?; aprimoramentos: id[]; revezes: id[]; gema?; material?; notas? }>; // ids: regras/fabriais.ts
  marcos: number;                                                 // moeda

  proposito; obstaculo; personalidade; aparencia; conexoes;
  objetivos: Array<{ nome; concluido: boolean; grau }>;   // ⚠️ achieved é BOOLEAN

  radiante?: {
    ordem;                                       // "Elsecaller"
    spren: { nome; tipo; iluminado: boolean };   // ← sprenBonds[]
    alcanceSpren: number;                        // 30
    ideais: Array<{ n; jurado: boolean; texto; marcos }>;  // ← funde idealsText + ideals + idealMilestones (do vínculo); traz o próximo a jurar
    fluxos: Array<{
      id; nome; atributo; graduacao;
      ativacao: Ativacao;        // ✅ surgeSkills TEM activation ("action", "action2x")
      talentos: Array<{ id; nome; aprendido: boolean }>;
    }>;
  };

  // estado vivo — ⚠️ o Shards TAMBÉM manda estes campos. Ver "Ficha × estado vivo"
  condicoes: Array<{ uid; id: IdCondicao; valor?; atributo?; dano?; nota? }>;      // as 14 do livro — regras/condicoes.ts
  lesoes: Array<{ uid; gravidade; efeito; descricao?; diasRestantes? }>;
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
| **Fabriais fora do inventário** | `fabrials.standard[]` (Clock 3/3) e `fabrials.custom[]` (Diapasão 0/5) — **dois formatos diferentes**. O custom **não diz qual efeito do livro usa**: o tradutor casa pelo nome ("PROJÉTIL" → Projétil), e upgrade fora da lista geral num efeito conhecido vira o aprimoramento próprio dele |
| **Envelope multi-personagem** | Raiz = `{ format: "cosmere-v3", version: 1, characters: [...] }` (antes da 3.x: `exportedAt` no lugar de `format`). **Já é array** — o item 4.4 sai quase de graça |
| **Mistborn no mesmo site** | Desde a 3.x o Shards faz ficha de Mistborn também (`system.type`). O tradutor **recusa** com aviso — outro sistema |
| **Tudo em inglês** | Nomes de ancestralidade, cultura, trilha, ordem, espreno, fluxo, item, fabrial, traço e dano chegam em inglês. O tradutor tem um de-para por categoria, conferido contra o livro — fonte: `referencia/livro/dicionario-en-ptbr.md`. Termo fora do mapa passa cru (item customizado, por exemplo) |
| **Unidades** | O livro PT-BR usa **5 ft = 1,5 m** e **2 lb = 1 kg** (Maça 3 lb = 1,5 kg) — o tradutor converte na entrada, nenhuma tela converte. ⚠️ **O modo métrico do Shards é inconsistente:** converte só o inventário, com fator exato (Maça 1,4 kg), e deixa movimento, sentidos, carga e alcance do espreno em pés/libras com o rótulo trocado ("20 m" = 20 ft). O tradutor detecta o modo pelo `weightRaw` e sempre parte do número imperial. Detalhe no topo de `importarShards.ts` |

## FIXO — o Shards manda pronto

> 💡 **A descoberta que muda o projeto: o Shards já fez a conta.** Defesas, vida máxima, dado de recuperação e movimento **vêm calculados**. O `regras/calculos.ts` **não precisa existir pra desenhar a ficha** — o app precisa de um *leitor*, não de um motor de regras. Ver [premissas](premissas.md) → "Ler primeiro, calcular depois".

*Verificado no export do Eccho (27/Set/2026):*

| Campo | O que o Shards manda |
|---|---|
| `meta` | "Eccho" · Cesar · nível 3 · Human · Thaylen + Kharbranthian · kit Academic |
| **Atributos** | FOR 1 · VEL 3 · INT 4 · VON 2 · CON 3 · PRE 0 — **já são os modificadores** |
| **Defesas** | Física **14** · Cognitiva **16** · Espiritual **13** — ✅ **já calculadas** |
| **Recursos** | Vida 21/21 · Foco 4/4 · Investidura 5/5 |
| Deflect · Marcos | 0 · 109 |
| **Derivados** | Dado de Recuperação **d6** · Movimento **30** (ft) · Sentidos **20** (ft) · carga 100/200 (lb) |
| **Graduação da perícia** | `rank` 0/1/2 — ✅ a bolinha de 3 estados funciona hoje |
| Especializações | 4 (Manufatura de Fabriais · Navegação · Mineralogia/Gemas) |
| Objetivos | 6, todos `achieved: false` |
| Armas e itens | Maça (1d6 impacto, Momentum) · Óleo · Livro |
| **Fabriais** | Relógio 3/3 · Telepena 3/3 · Diapasão 0/5 · PROJÉTIL 5/5 (Quality, Amplified + Double Attack, Inefficient) |
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
| **Ficha** | atributos, perícias, talentos, fabriais | ✅ sim | **O app**, depois de importar — o Shards só semeia |
| **Estado vivo** | vida atual, foco atual, condições, lesões | ✅ **sim, também** | **O app**, durante a sessão |
| **Vantagens acumuladas** | ver [interface.md](interface.md) → "Vantagem e desvantagem" | ❌ não | Só o app |

**Consequência:** o Shards **não é só construção** — ele tem vida atual, foco atual, condições, lesões e até `rollLog`. Como ele também rastreia estado vivo, um import traz junto o `healthCur` que estava lá.

**E é assim de propósito:** importar **sobrescreve a ficha inteira, sem fusão** — o app é dono da ficha, o JSON é semente, e trazer um export desatualizado é perda de dado assumida por quem importa. Ver [premissas](premissas.md) → "O Shards é SEMENTE; o app é dono da ficha".
