---
name: git-up
description: Commit + push do cosmarcos-app de uma vez, com a versão do app subindo no mesmo commit. Usar só quando o César chamar /git-up.
disable-model-invocation: true
---
<!-- DESTINO: .claude/skills/git-up/SKILL.md -->

Chamar `/git-up` **é** a autorização de commit e push — não pedir de novo. Push em `main` publica o app (o `deploy.yml` testa e builda antes; se falhar, o site fica na versão anterior).

## Passos (da raiz do projeto)

1. **O que mudou:** `git status -s` e `git diff --stat`. Sem mudança e sem commit pendente → "nada para enviar" e parar.
2. **Versão** — regra: [mapa-app.md](../../../mapa-app.md) → "Versionamento". Mudou o app (`src/`, `public/`, dependência) → `npm version <nova> --no-git-tag-version`; só doc → não sobe.
3. **Mensagem**, no formato dos commits anteriores (`git log -3`):
   - 1ª linha: `feat:` / `fix:` / `docs:` / `chore:` + o que mudou **na tela**, em português, com `(vX.Y.Z)` no fim quando a versão subiu. Se o César passou texto (`/git-up <texto>`), usar o dele.
   - Corpo: uma linha `- ` por mudança, em comportamento.
   - Fim: a linha de atribuição do system-reminder.
4. **Guardar:** `git add -A`, depois conferir que nada proibido entrou (repo público):
   ```
   git diff --cached --name-only | grep -iE '^referencia/|transcricao/|\.pdf$|jogadores\.md$|notas-do-livro|conferencia-formulas|escopo/interface\.md$|settings\.local\.json$|\.claude/agents/|\.(keystore|jks|apk|aab)$|^\.env'
   ```
   Achou algo → `git reset -q`, mostrar a lista, conferir o `.gitignore` e parar. Nunca `git add -f`.
5. **Enviar:** `git commit -F <arquivo da mensagem>` → `git tag vX.Y.Z` (se subiu) → `git push --follow-tags`. Push recusado → `git pull --rebase` e push de novo.
6. **Responder em 2 linhas:** versão e quantos arquivos foram, e se ficou igual ao GitHub (`git status -sb`, 1ª linha).

## Se parar

- **Conflito no `pull --rebase`:** mostrar `git status`, não apagar nem sobrescrever nada, resolver com o César.
- **Sem login:** `gh auth status`; deslogado → pedir `! gh auth login --web`.

## Não fazer

`git push --force`, `git reset --hard`, `git clean` ou `--no-verify` sem o César pedir.
