/* arquivo: main.tsx */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ProvedorIdioma } from './idioma/IdiomaContexto'
import ErroTela from './componentes/ErroTela'
import { aplicarTamanhoLetra, lerTamanhoLetra } from './estado/useTamanhoLetra'
import { abrirBanco } from './estado/banco'
import './estilos/base.css'

aplicarTamanhoLetra(lerTamanhoLetra())

// Pede ao navegador pra não apagar o save sozinho (limpeza por falta de
// espaço, e o corte de ~7 dias do Safari) — premissas.md → "PWA, sem loja de apps".
// Recusa não quebra nada: o backup da engrenagem continua sendo a rede de segurança.
navigator.storage?.persist?.().catch(() => {})

// A ficha mora no IndexedDB (estado/banco.ts): abre antes de desenhar. Se o
// banco falhar, abrirBanco já deixa tudo no localStorage — desenha igual.
abrirBanco().finally(() =>
  createRoot(document.getElementById('raiz')!).render(
    <StrictMode>
      <ProvedorIdioma>
        <ErroTela>
          <App />
        </ErroTela>
      </ProvedorIdioma>
    </StrictMode>,
  ),
)
