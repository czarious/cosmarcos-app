/* arquivo: marcaBackup.ts */

// A marca do último backup: a impressão digital da ficha no momento em que o
// backup foi baixado. Ficha com impressão diferente = mudou desde o último
// backup, e o botão do backup muda de cor (BotaoBackup.tsx).
// A ficha mora só no aparelho — limpar os dados do navegador ou desinstalar a
// apaga. O backup baixado é a única cópia fora dele.

const chave = (id: string) => `cosmarcos:backup-feito:${id}`

/** Impressão digital curta de um texto (FNV-1a, 32 bits). Só compara; não protege nada. */
export function impressao(texto: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16)
}

export function lerMarca(id: string): string | null {
  try {
    return localStorage.getItem(chave(id))
  } catch {
    return null
  }
}

export function gravarMarca(id: string, marca: string) {
  try {
    localStorage.setItem(chave(id), marca)
  } catch {
    // sem espaço: o botão só continua dizendo que mudou
  }
}
