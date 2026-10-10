/* arquivo: baixarArquivo.ts */

/** Baixa um texto como arquivo .json — exportar, backup, save descartado e a tela "Algo quebrou" usam o mesmo caminho. */
export function baixarArquivo(nome: string, texto: string) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([texto], { type: 'application/json' }))
  link.download = nome
  document.body.appendChild(link)
  link.click()
  // revogar na hora cancela o download no Chrome — espera ele começar
  setTimeout(() => {
    URL.revokeObjectURL(link.href)
    link.remove()
  }, 1000)
}
