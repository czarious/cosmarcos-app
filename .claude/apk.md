<!-- DESTINO: .claude/apk.md -->
# APK — como gerar e onde mora cada coisa

> **Abrir quando:** for gerar o APK de novo, trocar ícone/nome/cor do app instalado, ou se a chave de assinatura sumir.
> **Por que TWA e não Capacitor:** [premissas](../escopo/premissas.md) → "PWA, sem loja de apps".

O APK é uma **TWA** (Trusted Web Activity) gerada pelo **Bubblewrap**: uma casca que abre `https://czarious.github.io/cosmarcos-app/` dentro do Chrome, em tela cheia. **O app de verdade continua sendo o publicado** — todo push em `main` chega no APK sozinho. Gerar APK de novo só quando mudar a casca (nome, ícone, cor, pacote).

## Onde está cada coisa

| O quê | Onde | Versionado? |
|---|---|---|
| Receita do APK | `apk/twa-manifest.json` | ✅ — o resto de `apk/` se regenera dela |
| Projeto Android gerado · APK · AAB | `apk/` | ❌ `.gitignore` |
| **Chave de assinatura** + senha | `C:\Users\cesar\.cosmarcos-apk\` (`cosmarcos.keystore`, `senha-keystore.txt`) | ❌ **nunca** — repo público |
| Último APK pronto | `C:\Users\cesar\.cosmarcos-apk\cosmarcos.apk` | ❌ |
| Java 17 + Android SDK do Bubblewrap | `C:\Users\cesar\.bubblewrap\` (`config.json` aponta pros dois) | — (fora do projeto; não mexe no Java 21 do sistema) |
| Prova de dono do domínio (tela cheia) | `https://czarious.github.io/.well-known/assetlinks.json` — repo `czarious/czarious.github.io` | Repo próprio |

⚠️ **A chave não tem cópia no GitHub.** Perder a chave = o APK instalado não aceita atualização com chave nova (desinstala e instala de novo; a ficha mora no Chrome, não no APK, então sobrevive). Guardar cópia de `.cosmarcos-apk\` fora do PC.

## Gerar de novo

```
cd C:\dev\GitHub\cosmarcos-app\apk
bubblewrap update --skipVersionUpgrade      (só se mudou a receita)
bubblewrap build --skipPwaValidation
```

Três armadilhas desta máquina, todas resolvidas assim:

1. **Senhas sem pergunta:** exportar `BUBBLEWRAP_KEYSTORE_PASSWORD` e `BUBBLEWRAP_KEY_PASSWORD` com o conteúdo de `senha-keystore.txt`.
2. **"gradlew.bat não é reconhecido":** o terminal do Claude define `NoDefaultCurrentDirectoryInExePath=1` — `unset` antes do build.
3. **Pergunta "o manifesto mudou?" trava sem terminal interativo:** o `build` compara com `apk/manifest-checksum.txt`; regravar pelo `generateManifestChecksumFile` do `@bubblewrap/cli`.

Subiu a casca? Aumentar `appVersionCode` na receita (o Android recusa instalar versão igual por cima). Não tem relação com a versão do app no `package.json`.

## Conferência de segurança (29/Set/2026)

- Assinatura v1 + v2 + v3 válidas (`apksigner verify`).
- **Uma permissão só**, interna do próprio app — nem internet (quem acessa a rede é o Chrome).
- Android **5.0 (API 21) ao 16 (API 36)**.
- A impressão digital pública da chave: `C5:52:3A:71:1D:5C:3B:3C:49:CF:8F:2A:8C:E5:5F:C0:25:E4:D6:7F:25:C2:5F:F7:E4:F5:15:6A:12:B7:09:9A` — é ela que vai no `assetlinks.json`.
