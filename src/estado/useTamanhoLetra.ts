/* arquivo: useTamanhoLetra.ts */
import { useCallback, useState } from 'react'

// O tamanho da letra escolhido nas Configurações. Mora no aparelho, como o
// idioma: é preferência de quem segura o celular. Quem aumenta é o base.css
// ("TAMANHO DA LETRA"), pelo data-letra do <html>.

/** Pequeno é o tamanho de sempre (100%); Médio 115%, Grande 130%. */
export const TAMANHOS_LETRA = ['pequeno', 'medio', 'grande'] as const
export type TamanhoLetra = (typeof TAMANHOS_LETRA)[number]

const CHAVE = 'cosmarcos:letra'

export function lerTamanhoLetra(): TamanhoLetra {
  try {
    const salvo = localStorage.getItem(CHAVE)
    return TAMANHOS_LETRA.find((t) => t === salvo) ?? 'pequeno'
  } catch {
    return 'pequeno'
  }
}

/** Chamado também antes do primeiro desenho (main.tsx), pra a letra não pular ao abrir. */
export function aplicarTamanhoLetra(tamanho: TamanhoLetra) {
  document.documentElement.dataset.letra = tamanho
}

export function useTamanhoLetra(): [TamanhoLetra, (t: TamanhoLetra) => void] {
  const [tamanho, setTamanho] = useState<TamanhoLetra>(lerTamanhoLetra)
  const definir = useCallback((t: TamanhoLetra) => {
    setTamanho(t)
    aplicarTamanhoLetra(t)
    try {
      localStorage.setItem(CHAVE, t)
    } catch {
      // sem espaço ou bloqueado: vale até fechar o app
    }
  }, [])
  return [tamanho, definir]
}
