// Gera src/componentes/Icone.tsx a partir dos SVGs de icones-abas/ (os do icones-abas.py):
// os 10 das abas + configurações + backup.
// Uso, na raiz: node .claude/arte/icone-aba-tsx.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const raiz = fileURLToPath(new URL('../..', import.meta.url))
const icones = [
  ['Principal', 'principal'], ['Perícias', 'pericias'], ['Ações', 'acoes'], ['Fabriais', 'fabriais'], ['Condições', 'condicoes'],
  ['Radiante', 'radiante'], ['Inventário', 'inventario'], ['Talentos', 'talentos'], ['Personagem', 'personagem'], ['Anotações', 'anotacoes'],
  ['configuracoes', 'configuracoes'], ['backup', 'backup'],
]
const jsx = (s) =>
  s.replace(/stroke-width=/g, 'strokeWidth=').replace(/stroke-linecap=/g, 'strokeLinecap=').replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/fill-rule=/g, 'fillRule=').replace(/clip-rule=/g, 'clipRule=').replace(/stroke-miterlimit=/g, 'strokeMiterlimit=')
let corpo = ''
for (const [nome, arq] of icones) {
  const svg = readFileSync(`${raiz}/.claude/arte/icones-abas/${arq}.svg`, 'utf8')
  const dentro = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim()
  if (/style=|<text|<image|href=/.test(dentro)) throw new Error(`${arq}: tem coisa que não pode`)
  corpo += `  ${/^[a-z]+$/.test(nome) ? nome : `'${nome}'`}: (\n    ${jsx(dentro)}\n  ),\n`
}
const saida = `/* arquivo: Icone.tsx */
import type { ReactNode } from 'react'
import type { Secao } from './SeletorSecao'

// Os ícones do app, desenhados pelo agente de arte (criação própria, sem símbolo
// da Brotherwise): os 10 das abas, a engrenagem das Configurações e o backup.
// Todos com uma gema em losango, o mesmo traço e uma cor só (currentColor — a
// cor vem do CSS). Desenho: .claude/arte/icones-abas.py; este arquivo sai de lá
// com node .claude/arte/icone-aba-tsx.mjs (não editar à mão).

export type NomeIcone = Secao | 'configuracoes' | 'backup'

const DESENHO: Record<NomeIcone, ReactNode> = {
${corpo}}

export default function Icone({ nome }: { nome: NomeIcone }) {
  return (
    <svg className="icone" viewBox="0 0 24 24" aria-hidden focusable="false">
      {DESENHO[nome]}
    </svg>
  )
}
`
writeFileSync(`${raiz}/src/componentes/Icone.tsx`, saida)
console.log('ok', saida.length)
