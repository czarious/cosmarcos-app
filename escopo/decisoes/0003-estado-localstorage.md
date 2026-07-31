<!-- DESTINO: escopo/decisoes/0003-estado-localstorage.md -->
# 0003 — Estado: localStorage

**Status:** ⚠️ aceita, **CONTESTADA**
**Contestada por:** Fase 5 ([roadmap.md](../roadmap.md)) — pedido do César em 16/Jul/2026. Nada decidido.
← [Índice das decisões](decisoes.md)

## Contexto

O app precisa lembrar o estado vivo entre sessões: Vida 14/21, Foco gasto, condições ativas. É a ficha de **uma pessoa**, usada numa mesa de 5 amigos. Requisito de **custo zero**.

## Decisão

**localStorage** — o estado mora no próprio celular. Sem servidor, sem banco, sem login.

## Alternativas rejeitadas

| Alternativa | Por quê não |
|---|---|
| **Servidor + banco de dados** | Custo recorrente. E o localStorage resolve — **é ficha de uma pessoa** |
| **Login / contas** | Sem servidor não há o que autenticar. Ninguém mais precisa acessar |

## Consequências

- ✅ Funciona offline. A sessão pode rolar sem Wi-Fi (princípio 3).
- ✅ Custo zero **de verdade** — não é "grátis enquanto uma empresa quiser", é ausência de dependência.
- ⚠️ **Limpar o navegador apaga a ficha.** Daí a ideia de backup manual no backlog.
- ⚠️ **Preso a um aparelho.** Trocar de celular = perder o estado.
- ⚠️ **Ninguém mais enxerga.** O Marcos não vê a Vida do César.

## ⚠️ O que a Fase 5 faz com esta decisão

O César pediu (16/Jul/2026): mesa inteira com ficha própria, painel do mestre, salvamento online, tempo real. **Tudo isso precisa de servidor** — as duas últimas consequências acima deixam de ser aceitáveis e viram o problema a resolver.

**Atenção ao reabrir:** o motivo do enterro do servidor foi *"localStorage resolve — **é ficha de uma pessoa**"*. **Essa frase deixou de ser verdade** no momento em que a mesa entrou no escopo. Não basta exumar a ideia: o raciocínio que a matou também morreu.

**Candidato na mesa:** **Google Drive API + OAuth** (proposto pelo César, 16/Jul/2026) — ele já integrou no `ficha-imovel` e já tem a conta. Resolve 4 dos 5 itens da Fase 5; **não resolve tempo real**. Detalhes em [roadmap.md](../roadmap.md) → "Candidato: Google Drive API + OAuth".

Se a Fase 5 for aprovada, **não editar este arquivo** — escrever uma decisão nova que o supersede, explicando o que mudou no mundo.

---

## 📌 Atualização — 16/Jul/2026: a mesa é toda Android

*Acréscimo, não reescrita.*

O `localStorage` ficou **mais confiável do que quando esta decisão foi tomada**: o Safari do iOS apaga armazenamento de site depois de ~7 dias sem uso, e as sessões são **quinzenais** — num iPhone, a ficha podia sumir entre uma sessão e outra. Sendo tudo Android/Chrome, esse risco sai de cena. Ver [0001 → Atualização](0001-plataforma-pwa.md).

As outras consequências **continuam valendo**: limpar o navegador ainda apaga a ficha, ainda está preso a um aparelho, e o Marcos ainda não vê nada.
