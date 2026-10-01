<!-- DESTINO: escopo/checklist-shards.md -->
# Checklist — o Shards inteiro × o app

← [Sumário](README.md)

> **Finalidade:** tudo o que o Shards faz, tela por tela, e se o app já faz. É daqui que sai o que falta.
> **Abrir quando:** antes de propor funcionalidade nova, ou quando o Shards atualizar (refazer a varredura).
> **Não mora aqui:** onde cada coisa fica no site → [.claude/mapa-shards.md](../.claude/mapa-shards.md). O que entra e quando → [roadmap.md](roadmap.md).

**Varredura:** 30/Set/2026, Shards 3.5.0, ficha do Eccho, só leitura (nada foi alterado no Shards).

**Legenda:** ✅ o app faz · 🔶 faz em parte · ❌ não faz · ➖ fora de propósito (motivo na nota)

## Divergências de número achadas na varredura

| O quê | Shards | App (save deste PC) | Situação |
|---|---|---|---|
| Vontade do Eccho | 2 | 3 | ✅ **Resolvido:** o save deste PC era antigo; a semente do app e o Shards dizem 2 (Foco 4). Reimportar atualiza |
| Movimento | "30 m/action" na Sheet · "30 ft" na Play | 9 m | Defeito do Shards em métrico (converte rótulo sem converter número). O app segue o livro |
| Tamanho de fluxo Pequeno | 2,5 m | 0,75 m | O app segue o livro (transcrição, "Escalonamento de Fluxo") |

## Sheet — a ficha inteira

| Item do Shards | App | Nota |
|---|---|---|
| Nome · nível · jogador · ancestralidade · kit inicial · culturas | ✅ | Topo e aba Personagem |
| Nome aleatório · criar/editar identidade | ➖ | O Shards é a semente — [premissas](premissas.md) → "O Shards é SEMENTE; o app é dono da ficha" |
| 6 atributos | ✅ | Aba Principal, valor efetivo |
| Marcos (moeda) | ✅ | Inventário, editável |
| Vida · Foco · Investidura | ✅ | Topo fixo, ± e número |
| Deflexão · movimento · dado de recuperação · carga · levantamento · sentidos | ✅ | Aba Principal |
| Contador de talentos (total / heroico / saldo "-1") | ❌ | Leitura simples; útil ao subir de nível |
| 18 perícias com graduação e total | ✅ | Aba Perícias, total calculado e detalhado |
| Ordenar perícias | ❌ | Baixa prioridade |
| Propósito · obstáculo · personalidade · aparência · conexões | ✅ | Aba Personagem |
| Objetivos (lista, marcos, concluir) | ✅ | Aba Personagem |
| Ancestralidade → bônus (Humano: +1 talento heroico) | ❌ | Só aparece como nome |
| Especialidades (adicionar, tipo, origem) | 🔶 | Aba Talentos mostra e liga às vagas; não adiciona especialidade avulsa |
| Lesões: deflexão da armadura, modificador, rolar lesão, duração | ✅ | Aba Condições, rolagem guiada |
| Condições com detalhes e efeitos | ✅ | Aba Condições, 14 do livro, efeito na conta |
| Notas | ✅ | Viram blocos na aba Anotações |
| Trilhas heroicas: talentos com o texto da habilidade | 🔶 | Aba Talentos: só os talentos já no catálogo do app (Erudito, Alternauta); talento fora do catálogo mostra só o nome |
| Trilha radiante: ordem, Ideais com marcos, vínculo (nome, tipo, alcance) | ✅ | Aba Radiante |
| Segunda ordem (vínculo duplo, raro) | ❌ | Nenhum personagem da mesa usa |
| Fluxos: graduação, dado, tamanho, descrição | ✅ | Abas Radiante e Ações (guia de uso) |
| Fluxos: habilidades separadas (Transporte: emoções, localizar, sentir Investidura) | 🔶 | O app lista no "Como usar"; o Shards dá um botão por habilidade |
| Talentos de fluxo (+ Talent) | 🔶 | Mostra os aprendidos pelo nome; sem texto de regra |
| Notas de trilha | ❌ | Campo livre do Shards que o tradutor não lê |
| Defesas Física · Cognitiva · Espiritual | ✅ | Aba Principal |
| Armas equipadas (dano, alcance, perícia, bônus) | ✅ | Aba Ações, com Golpear no rastreador de turno |
| Armadura equipada | ✅ | Inventário: vestir/tirar; deflexão soma na Principal e na rolagem de lesão; Desajeitada [X] deixa Lento e com desvantagem em Velocidade (v0.10.0) |
| Fabriais padrão (cargas, descrição, aprimoramentos, revezes) | ✅ | Aba Fabriais |
| Fabriais únicos (nome, qualidade, cargas, material, gema, características, efeitos) | ✅ | Aba Fabriais, montador |
| "Surge power" do fabrial | ❌ | Campo do Shards pra fabrial com fluxo; ninguém usa ainda |
| Equipamento: catálogo, item próprio, equipar, quantidade, peso total | ✅ | Aba Inventário |
| Notas de equipamento (texto livre) | ✅ | Inventário → Pertences (30/Set/2026) |

## Play — o modo mesa

| Item do Shards | App | Nota |
|---|---|---|
| Recursos ± | ✅ | Topo fixo |
| Resumo de combate (defesas, movimento, deflexão, recuperação) | ✅ | Aba Principal |
| Status: condições e lesões | ✅ | Faixa no topo + aba Condições |
| Testes rápidos (as perícias mais altas) e "todos os testes" | 🔶 | O app mostra os totais na aba Perícias. Atalho das mais altas no topo da Principal foi tentado na v0.12.0 e retirado na v0.12.1: o César não quer mexer na Principal nem nas abas |
| Rolar teste de atributo, perícia, ataque, fluxo | ➖ | O dado é rolado na mão — [premissas](premissas.md) → "O dado é rolado na mão"; rolador é o 4.0 do [roadmap](roadmap.md) |
| Lista de talentos | ✅ | Aba Talentos |
| Referência da sessão: especialidades, objetivos ativos, equipamento à mão | 🔶 | Tudo existe, espalhado em abas; não há um resumo único |
| Rolagens recentes | ❌ | Depende do rolador — roadmap 4.2 |
| **Rastreador de turno (▶, ↻, custo pago na hora)** | ✅ | **O Shards não tem.** Aba Ações (30/Set/2026) |

## Paths — árvores de talento

| Item do Shards | App | Nota |
|---|---|---|
| Ver trilhas, talentos escolhidos, saldo de pontos | 🔶 | Os escolhidos aparecem; o saldo não |
| Escolher talento na árvore / gastar ponto | ➖ | Subir de nível acontece no Shards (semente) |

## Roll Log · DM Roster · Reference

| Item do Shards | App | Nota |
|---|---|---|
| Roll Log (quando, teste, total, Trama) | ❌ | Roadmap 4.2, depende do rolador |
| DM Roster (colunas por personagem, pro mestre) | ❌ | Fase 5 do [roadmap](roadmap.md), não aprovada |
| Reference (lembretes de uso) | ➖ | O app põe a regra no ponto de uso (resumo de cada ação, condição, fluxo) |

## Barra de cima e ajustes

| Item do Shards | App | Nota |
|---|---|---|
| Vários personagens (trocar, novo, duplicar, apagar) | ❌ | Roadmap 4.4 |
| Importar / exportar JSON | ✅ | Engrenagem do topo; o app exporta de volta pro Shards |
| Exportar todos os personagens | ❌ | Só faz sentido com o 4.4 |
| PDF da ficha oficial · imprimir | ❌ | Não pedido |
| Idioma (inglês / espanhol) | 🔶 | O app tem português e inglês (30/Set/2026): botões e nomes; as descrições de regra em inglês são a 2ª etapa |
| Arrumar os painéis na ordem que quiser | ❌ | Roadmap 4.3 |
| Unidades (imperial / métrico) | ➖ | O app é sempre métrico, pela convenção do livro |
| Temas de cor (13+) | ➖ | Tema único claro — [premissas](premissas.md) → "Descartado — não repropor" |
| Tutorial · reportar defeito | ❌ | Não pedido |
