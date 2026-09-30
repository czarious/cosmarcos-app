/* arquivo: main.tsx */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ProvedorIdioma } from './idioma/IdiomaContexto'
import './estilos/base.css'

// Pede ao navegador pra não apagar o save sozinho (limpeza por falta de
// espaço, e o corte de ~7 dias do Safari) — premissas.md → "PWA, sem loja de apps".
// Recusa não quebra nada: o backup da engrenagem continua sendo a rede de segurança.
navigator.storage?.persist?.().catch(() => {})

createRoot(document.getElementById('raiz')!).render(
  <StrictMode>
    <ProvedorIdioma>
      <App />
    </ProvedorIdioma>
  </StrictMode>,
)
