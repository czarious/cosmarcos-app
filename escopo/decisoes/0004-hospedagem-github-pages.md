<!-- DESTINO: escopo/decisoes/0004-hospedagem-github-pages.md -->
# 0004 — Hospedagem: GitHub Pages, repositório público

**Status:** ✅ aceita
← [Índice das decisões](decisoes.md)

## Contexto

O PWA ([0001](0001-plataforma-pwa.md)) precisa estar publicado numa URL pra ser instalado no celular. Requisito de **custo zero**. O César já usa GitHub e GitHub Desktop.

## Decisão

**GitHub Pages**, em **repositório público**. Build automático por **GitHub Actions**.

O repo é público **porque Pages em repo privado exige plano pago** — a escolha é consequência do custo zero, não preferência.

## Consequências

- ✅ Grátis, incluindo Actions ilimitado em repo público.
- ✅ Deploy = `git push`. Alguns minutos depois o celular já tem a versão nova.
- ⚠️ **Todo o código é público.** Aceitável: o repo guarda **a ficha do César** e o código, **não** o texto de regras da Brotherwise.
- ⛔ **Limite conhecido:** se um dia embutirmos o compêndio com texto do livro, o repo **tem** que virar privado — e aí o Pages deixa de servir. A saída seria migrar pra **Cloudflare Pages** ou **Netlify**, que aceitam repo privado no plano grátis. Decidir isso **antes** de trazer o texto, não depois.
