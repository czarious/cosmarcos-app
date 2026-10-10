/* arquivo: Icone.tsx */
import type { ReactNode } from 'react'
import type { Secao } from './SeletorSecao'

// Os ícones do app, desenhados pelo agente de arte (criação própria, sem símbolo
// da Brotherwise): os 10 das abas, a engrenagem das Configurações e o backup.
// Todos com uma gema em losango, o mesmo traço e uma cor só (currentColor — a
// cor vem do CSS). Desenho: .claude/arte/icones-abas.py; este arquivo sai de lá
// com node .claude/arte/icone-aba-tsx.mjs (não editar à mão).

export type NomeIcone = Secao | 'configuracoes' | 'backup'

const DESENHO: Record<NomeIcone, ReactNode> = {
  'Principal': (
    <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4.5H16L20.5 9.5L12 20.5L3.5 9.5Z"/><path d="M3.5 9.5H20.5"/><path d="M8 4.5L10 9.5M16 4.5L14 9.5"/><path d="M10.3 9.5H13.7L12 17Z" fill="currentColor" stroke="none"/></g>
  ),
  'Perícias': (
    <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3V9M12 15V21"/><path d="M8 4.5C4.2 8.5 4.2 15.5 8 19.5M16 4.5C19.8 8.5 19.8 15.5 16 19.5"/><path d="M12 8.8L14.4 12L12 15.2L9.6 12Z" fill="currentColor" stroke="none"/></g>
  ),
  'Ações': (
    <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1.4L14.6 4.4V15.4H9.4V10.6L7.8 9L9.4 7.4V4.4Z"/><path d="M5.2 13.4Q6.4 17.2 12 17.2Q17.6 17.2 18.8 13.4"/><path d="M12 17.2V20.4"/><path d="M12 19.7L13.7 21.6L12 23.5L10.3 21.6Z" fill="currentColor" stroke="none"/></g>
  ),
  'Fabriais': (
    <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5.6 16.6H18.4V21H5.6Z"/><path d="M8 16.6C6 15.2 5.4 12.6 5.6 10.4C5.8 8.4 6.6 6.8 7.8 5.8M16 16.6C18 15.2 18.6 12.6 18.4 10.4C18.2 8.4 17.4 6.8 16.2 5.8"/><path d="M12 4.2L16 9.6L12 15L8 9.6Z" fill="currentColor" stroke="none"/></g>
  ),
  'Condições': (
    <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.6L18.6 9L12 21.4L5.4 9Z"/><path d="M15 5.6L11 10.6L14 12.8L11.6 16.8"/><path d="M20 15.3L21.5 17.4L20 19.5L18.5 17.4Z" fill="currentColor" stroke="none"/></g>
  ),
  'Radiante': (
    <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12.00 6.80L13.45 3.90L12.00 1.00L10.55 3.90Z" fill="currentColor" stroke="none"/><path d="M15.06 7.79L17.23 7.27L17.05 5.04L14.88 5.57Z" fill="currentColor" stroke="none"/><path d="M16.95 10.39L20.15 10.88L22.46 8.60L19.26 8.12Z" fill="currentColor" stroke="none"/><path d="M16.95 13.61L18.11 15.51L20.18 14.66L19.01 12.75Z" fill="currentColor" stroke="none"/><path d="M15.06 16.21L15.59 19.41L18.47 20.90L17.93 17.70Z" fill="currentColor" stroke="none"/><path d="M12.00 17.20L10.55 18.90L12.00 20.60L13.45 18.90Z" fill="currentColor" stroke="none"/><path d="M8.94 16.21L6.07 17.70L5.53 20.90L8.41 19.41Z" fill="currentColor" stroke="none"/><path d="M7.05 13.61L4.99 12.75L3.82 14.66L5.89 15.51Z" fill="currentColor" stroke="none"/><path d="M7.05 10.39L4.74 8.12L1.54 8.60L3.85 10.88Z" fill="currentColor" stroke="none"/><path d="M8.94 7.79L9.12 5.57L6.95 5.04L6.77 7.27Z" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="2.6"/></g>
  ),
  'Inventário': (
    <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9.2 7.6C5.2 10 3.9 14 4.5 17C5.2 20.2 8 21 12 21C16 21 18.8 20.2 19.5 17C20.1 14 18.8 10 14.8 7.6"/><path d="M9.2 7.6L7.4 3.8Q12 5.4 16.6 3.8L14.8 7.6Z"/><path d="M14.8 7.6Q17.6 8.6 18.2 11"/><path d="M12 11.7L14.4 14.8L12 17.9L9.6 14.8Z" fill="currentColor" stroke="none"/></g>
  ),
  'Talentos': (
    <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V14.6"/><path d="M12 18.4C11.6 20 10.4 21 8.6 21.2M12 18.4C12.4 20 13.6 21 15.4 21.2"/><path d="M12 14.6C9.6 13.6 7.6 12.2 7 9.8M12 14.6C14.4 13.6 16.4 12.2 17 9.8"/><path d="M7 9.8C6.6 8.8 5.6 8 4.6 7.4M7 9.8C7.6 8.8 8.6 8 9.6 7.4"/><path d="M17 9.8C16.4 8.8 15.4 8 14.4 7.4M17 9.8C17.6 8.8 18.6 8 19.6 7.4"/><path d="M4.2 2.4L5.8 4.6L4.2 6.8L2.6 4.6Z" fill="currentColor" stroke="none"/><path d="M9.8 2.4L11.4 4.6L9.8 6.8L8.2 4.6Z" fill="currentColor" stroke="none"/><path d="M14.2 2.4L15.8 4.6L14.2 6.8L12.6 4.6Z" fill="currentColor" stroke="none"/><path d="M19.8 2.4L21.4 4.6L19.8 6.8L18.2 4.6Z" fill="currentColor" stroke="none"/></g>
  ),
  'Personagem': (
    <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4.6" r="2.4"/><path d="M9.8 8.6C10.6 8 13.4 8 14.2 8.6L13.4 13.2C14.2 16 15.8 19 17.6 21H6.4C8.2 19 9.8 16 10.6 13.2Z"/><path d="M9.8 8.9L7.6 12.4Q8.2 14.4 10.6 13.4M14.2 8.9L15.8 13.2"/><path d="M12 11.4L13.5 13.2L12 15L10.5 13.2Z" fill="currentColor" stroke="none"/></g>
  ),
  'Anotações': (
    <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><g transform="translate(-1.2 -0.6) rotate(45 12 12)"><path d="M10 4.6V15.6L12 20L14 15.6V4.6Z"/><path d="M12 -0.8L14 1.6L12 4L10 1.6Z" fill="currentColor" stroke="none"/></g><path d="M8.6 20.6C10.6 19.2 12.2 21.6 14.2 20.4S18 19.6 20.6 20.6"/></g>
  ),
  configuracoes: (
    <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10.13 3.91L10.55 1.70L13.45 1.70L13.87 3.91A8.3 8.3 0 0 1 16.40 4.96L18.26 3.69L20.31 5.74L19.04 7.60A8.3 8.3 0 0 1 20.09 10.13L22.30 10.55L22.30 13.45L20.09 13.87A8.3 8.3 0 0 1 19.04 16.40L20.31 18.26L18.26 20.31L16.40 19.04A8.3 8.3 0 0 1 13.87 20.09L13.45 22.30L10.55 22.30L10.13 20.09A8.3 8.3 0 0 1 7.60 19.04L5.74 20.31L3.69 18.26L4.96 16.40A8.3 8.3 0 0 1 3.91 13.87L1.70 13.45L1.70 10.55L3.91 10.13A8.3 8.3 0 0 1 4.96 7.60L3.69 5.74L5.74 3.69L7.60 4.96A8.3 8.3 0 0 1 10.13 3.91Z"/><circle cx="12" cy="12" r="4.6"/><path d="M12 9.5L13.9 12L12 14.5L10.1 12Z" fill="currentColor" stroke="none"/></g>
  ),
  backup: (
    <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7.8V15.4M8 11.6L12 15.6L16 11.6"/><path d="M3.8 15.8V20.6H20.2V15.8"/><path d="M12 1.1L14.1 3.8L12 6.5L9.9 3.8Z" fill="currentColor" stroke="none"/></g>
  ),
}

export default function Icone({ nome }: { nome: NomeIcone }) {
  return (
    <svg className="icone" viewBox="0 0 24 24" aria-hidden focusable="false">
      {DESENHO[nome]}
    </svg>
  )
}
