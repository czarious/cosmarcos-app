<!-- DESTINO: escopo/visao.md -->
# Visão — o que o app é

← [Sumário](README.md)

## O que o app É

**Uma ficha de personagem do Cosmere RPG para usar no celular, ao vivo, durante a sessão.**

O recorte é o **modo JOGO**: o que muda a toda hora na mesa. Se um campo só muda quando o personagem sobe de nível, ele não é problema deste app — é do Shards.

O teste de uma funcionalidade é sempre o mesmo:

> **"Eu usaria isso com o celular na mão, no meio de um combate, com o Marcos esperando?"**

Se a resposta for não, vai pro backlog ou pras decisões rejeitadas.

Um "D&D Beyond do Cosmere", mas só a metade de jogar.

### Dois objetivos que convivem

Confirmado pelo César em 16/Jul/2026 — **as duas coisas, sem conflito**:

| | |
|---|---|
| **Ficha correta antes da sessão** | *"O que importa é a ficha na mão do jogador estar atualizada antes da sessão."* Subiu de nível no Shards? A ficha do app tem que refletir |
| **Ficha viva durante a sessão** | Tomou dano, gastou foco, pegou condição → atualiza ali, na hora |

### 🎲 O dado é rolado na mão

> *"Jogar RPG é rolar dados na mão e fazer acontecer ali."* — César

O app **não substitui o dado físico**. Ele mostra o `+7` da perícia pra você somar ao d20 que rolou na mesa. O rolador existe no roadmap, mas como **incremento (Fase 4)** — não como MVP. Ver [decisão 0011](decisoes/0011-dado-rolado-na-mao.md).

**Consequência de desenho:** todo número que se soma a um dado precisa ser **legível de relance**, com o celular na mão e o dado na outra. Legibilidade > interatividade.

## O que o app NÃO É

Limites explícitos. Cada item é uma decisão, não um "ainda não":

| Não é | Porque |
|---|---|
| **Construtor de personagem** | Subir nível, escolher talentos e atributos é o **Shards**. Duplicar isso = duas fichas divergindo. Ver [decisão 0005](decisoes/0005-shards-fonte-de-verdade.md) |
| **Compêndio de regras** | O texto é da Brotherwise Games. O app guarda **os dados do César**, não redistribui o livro |
| **App de loja (Play/App Store)** | PWA instala pelo navegador. Ver [decisão 0001](decisoes/0001-plataforma-pwa.md) |
| **Serviço com login/conta** | Sem servidor, sem banco, sem senha. Ver [decisão 0003](decisoes/0003-estado-localstorage.md) |
| **Rolador compartilhado / VTT** | O app rola **pro César ver**. Quem narra pra mesa é o César |
| **Ficha de mestre** | É ficha de **PC**. O Marcos tem as ferramentas dele |

> ⚠️ **Os três últimos estão contestados** pela **Fase 5** ([roadmap.md](roadmap.md)), que pede a mesa inteira + painel do mestre. **Nada foi decidido** — até decidir, o que vale é esta tabela.

## Princípios inegociáveis

1. **Orientado a dados** — nenhum personagem escrito no código. O app lê um JSON e desenha o que vier. Serve pro Eccho, pro Rakshi, pra qualquer PC, pra qualquer campanha.
2. **Custo zero** — nenhuma decisão pode introduzir custo recorrente. Tabela no [CLAUDE.md](../CLAUDE.md).
3. **Offline primeiro** — a sessão pode rolar sem Wi-Fi. Nada essencial depende de rede.
4. **Celular primeiro** — desenhado pro polegar, na vertical, com uma mão só. Desktop é consequência, não alvo.
5. **Regra separada da tela** — `regras/` não conhece a UI, `componentes/` não faz conta. Dá pra testar o Dado de Trama sem abrir o navegador.
6. **Tema Shards** — claro, pergaminho, serifas: a ficha do app e a do builder parecem o mesmo produto. *(Era "tema escuro"; mudado em 17/Jul/2026 — ver [decisão 0013](decisoes/0013-tema-shards-claro.md). Se a tela clara incomodar na mesa à noite, a saída é um alternador como incremento, não reabrir o tema.)*
7. **Provisório aparece como provisório** — o app nunca mostra número inventado com cara de número certo. Ver [decisão 0009](decisoes/0009-ler-primeiro-calcular-depois.md).
