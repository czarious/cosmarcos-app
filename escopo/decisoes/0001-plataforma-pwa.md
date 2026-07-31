<!-- DESTINO: escopo/decisoes/0001-plataforma-pwa.md -->
# 0001 — Plataforma: PWA

**Status:** ✅ aceita
← [Índice das decisões](decisoes.md)

## Contexto

A ficha precisa rodar no celular do César durante a sessão. A mesa usa Android e iPhone. O César desenvolve num **Dell (Windows)**, não é desenvolvedor de formação, e o projeto tem **custo zero** como requisito.

## Decisão

**PWA** — um site instalável. Um código só roda em Android e iPhone, instala pela opção "Adicionar à tela inicial" do navegador.

## Alternativas rejeitadas

| Alternativa | Por quê não |
|---|---|
| **React Native · Flutter** | Compilar pro iPhone exige **macOS** (Xcode). O César está no Windows — precisaria comprar um Mac **só pra compilar**. Overkill pro problema |
| **App em loja** (Play / App Store) | US$ 25 (Play, uma vez) + US$ 99/ano (Apple). Fura o custo zero, e o PWA resolve de graça |

## Consequências

- ✅ Um código → dois sistemas. Sem loja, sem revisão de app, sem Mac.
- ✅ Atualizar = dar push. Ninguém precisa baixar nada.
- ⚠️ PWA no iPhone tem limitações que o Android não tem (notificação, armazenamento). Só vira problema se o app precisar disso — hoje não precisa.
- ⚠️ Instalar não é óbvio pro usuário leigo: tem que ensinar o "Adicionar à tela inicial". Como a mesa são 5 pessoas conhecidas, é aceitável.

---

## 📌 Atualização — 16/Jul/2026: a mesa é toda Android

*Informação nova. Não reescreve o raciocínio acima — acrescenta.*

**A decisão continua a mesma**, mas dois pontos mudam de peso:

**1. Um argumento desta decisão enfraqueceu, e é honesto dizer.**
O Mac só era necessário pra compilar pro **iPhone**. Android compila no Windows — então *"precisa de Mac"* **deixa de valer** contra React Native/Flutter, se ninguém na mesa usa iPhone.

**A decisão se sustenta pelos outros motivos**, que não dependem de plataforma: sem build, sem distribuir APK, atualiza por push, e o César mantém sozinho. Mas o argumento do Mac agora é condicional — se um dia entrar um iPhone na mesa, ele volta a valer sozinho.

**2. Ganhamos uma coisa que ninguém tinha visto — e ela é grande.**
O **Safari do iOS apaga armazenamento de site depois de ~7 dias sem uso**. As sessões da mesa são **quinzenais**.

> Num iPhone, a ficha podia **sumir entre uma sessão e outra**. Estado vivo, condições, tudo. E o bug só apareceria na mesa, dois meses depois, sem ninguém entender por quê.

Sendo tudo Android/Chrome, o `localStorage` da [decisão 0003](0003-estado-localstorage.md) fica bem mais confiável. **Isso não é permissão pra relaxar** — "limpar o navegador apaga a ficha" continua verdade, e o backup manual continua no backlog. Mas o risco pior sumiu.

> ⚠️ **Se um iPhone entrar na mesa, reabrir esta atualização.** Não é hipótese remota: basta um jogador trocar de celular.
