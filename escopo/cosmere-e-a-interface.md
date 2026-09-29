<!-- DESTINO: escopo/cosmere-e-a-interface.md -->
# O Cosmere não é D&D — as diferenças que mudam a tela

← [Sumário](README.md)

> **Quando ler:** antes de desenhar ou alterar qualquer tela, e antes de copiar
> um padrão do D&D Beyond. O DDB é nossa referência de **interação**, não de
> **sistema** — copiá-lo cru é o erro mais fácil de cometer aqui.

## A tabela

| D&D 5e (DDB) | Cosmere RPG |
|---|---|
| Atributo 20 → modificador +5 | **O atributo já é o modificador.** `VEL 3` e pronto — um número só |
| 1 CA (Armor Class) | **3 defesas**: Física · Cognitiva · Espiritual |
| Testes de resistência | Não existem — testes vão **contra as defesas** |
| Espaços de magia | **Foco** + **Investidura** (dois recursos separados) |
| Rola d20 | **d20 + Dado de Trama (d6) juntos** → Oportunidades e Complicações |
| Action / Bonus / Reaction | **2–3 ações por turno**: ▶ ▶▶ ▶▶▶ · ▷ livre · ↻ reação · ★ especial · ∞ sempre *(símbolos do livro, Introdução p.10)* |
| Condições | Condições **+ Lesões** (temporárias contam **dias**; permanentes só curam por meio sobrenatural) |
| Familiar | **Spren** (Mancha) — ações próprias que gastam Foco |
| Proficiência +N | **Graduações** de perícia (máx. 2 até o nível 5) |

## O maior impacto: o Dado de Trama

A rolagem **não retorna um número** — retorna **dois resultados**: o teste e o
efeito narrativo (Oportunidade ou Complicação). Isso não tem equivalente no
D&D, então não tem padrão de UI pra copiar: precisa de destaque próprio na tela.

## Onde isso já virou decisão

| Diferença | O que ela causou |
|---|---|
| Os três recursos mudam o tempo todo | Cabeçalho fixo, divergindo do DDB — [premissas](premissas.md) → "Os vitais grudam no topo" |
| O atributo já é o modificador | O schema guarda um número só, sem conversão — [dados.md](dados.md) |
| Graduação ≠ proficiência | Bolinhas ● ○ ◎ na aba Perícias, com teto por patamar — `regras/pericias.ts` |
| Símbolos de ação | `SIMBOLO_ATIVACAO` em `src/variaveis.ts` — **são do livro**, não escolha nossa |

> Padrões de UI e seções do app: [interface.md](interface.md).
> A regra do Dado de Trama, confirmada no livro: [notas-do-livro.md](notas-do-livro.md).
