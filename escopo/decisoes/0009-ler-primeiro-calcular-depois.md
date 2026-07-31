<!-- DESTINO: escopo/decisoes/0009-ler-primeiro-calcular-depois.md -->
# 0009 — Ler primeiro, calcular depois

**Status:** ✅ aceita · 16/Jul/2026
← [Índice das decisões](decisoes.md)

## Contexto

O app precisaria de uma base de regras do Cosmere pra calcular a ficha — e o livro ainda está sendo transcrito aos poucos. Isso parecia bloquear a Fase 1 inteira.

**Aí a gente foi ler o export real do Shards** e descobriu que a premissa estava errada:

```json
"defenses": { "physical": 14, "cognitive": 17, "spiritual": 13 },
"resources": { "healthMax": 21, "recoveryDie": "d8", "movement": 30 }
```

**O Shards já fez a conta.** Defesas, vida máxima, dado de recuperação, movimento — tudo calculado no export.

## Decisão

**O app importa o JSON e desenha o que vier.** Cada campo é classificado:

| | Significado |
|---|---|
| ✅ **FIXO** | O Shards manda pronto. O app lê e mostra — nenhuma regra envolvida |
| ⚠️ **PROVISÓRIO** | Falta regra ou o dado não vem. O app mostra **marcado como provisório** e não finge que sabe |

Conforme o livro for transcrito, PROVISÓRIO vira FIXO calculado. A classificação campo a campo está em [dados.md](../dados.md).

**Regra de ouro:** provisório **aparece na tela como provisório**. O app nunca mostra número inventado com cara de número certo — é a versão em pixels do "não inventar regra do sistema" do [CLAUDE.md](../../CLAUDE.md).

## Consequências

- ✅ **O `regras/calculos.ts` deixa de ser pré-requisito do protótipo.** Pra ver a ficha na tela, o app precisa de um **leitor**. A base de regras não bloqueia o começo.
  > 📌 **Corrigido em 16/Jul/2026 pela [decisão 0012](0012-ficha-inteligente-e-o-objetivo.md).** Esta linha dizia que a base de regras "vira **evolução**, não pré-requisito" — com o subtexto de *talvez nunca*. **Errado.** A **ficha inteligente é o objetivo do projeto** — é o motivo de o app existir. Ler o JSON é o **andaime do protótipo**, não o destino. A estratégia desta decisão continua valendo; o horizonte é que estava mal escrito.
- ✅ **A Fase 1 destravou.** As duas perguntas que a bloqueavam (fórmula da perícia · ações do Mancha) deixaram de bloquear.
- ⚠️ **O total da perícia é o buraco real** — o Shards manda os componentes e nenhum total, e é justamente o número que se rola. Contorno: **o César digita uma vez, o app guarda**. Quando a fórmula sair do livro, o app calcula e o digitado vira conferência.
- ⚠️ **Dependência dobrada do Shards.** Se ele parar de calcular (ou calcular errado), o app não tem como conferir — não temos as regras.
- ⚠️ Ficha de personagem que não veio do Shards **não funciona**. Aceitável: [0005](0005-shards-fonte-de-verdade.md) já diz que o Shards é a fonte.
